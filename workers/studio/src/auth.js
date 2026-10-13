// Who is calling. Cloudflare Access sits in front of escapepack.ca/studio* and signs every request
// it lets through (Cf-Access-Jwt-Assertion). We check that signature against the team's public keys,
// so a request that skipped Access can't pretend to be someone.
//   People log in with a one-time email code -> claims.email.
//   kit.py uses an Access service token        -> claims.common_name (its client ID) -> name "Claude".
// Local development only: wrangler dev --var DEV_USER:you@example.com stands in for Access.

let certs = null, certsAt = 0;

async function keys(team) {
  if (certs && Date.now() - certsAt < 3600_000) return certs;
  const res = await fetch(`https://${team}.cloudflareaccess.com/cdn-cgi/access/certs`);
  if (!res.ok) throw new Error("could not load Access keys");
  const { keys: list } = await res.json();
  certs = await Promise.all(list.map(async k => ({
    kid: k.kid,
    key: await crypto.subtle.importKey("jwk", k, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]),
  })));
  certsAt = Date.now();
  return certs;
}

const b64 = s => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4)), c => c.charCodeAt(0));

export async function verify(token, env) {
  const [h, p, sig] = token.split(".");
  if (!sig) return null;
  const header = JSON.parse(new TextDecoder().decode(b64(h)));
  const claims = JSON.parse(new TextDecoder().decode(b64(p)));
  const k = (await keys(env.ACCESS_TEAM)).find(x => x.kid === header.kid);
  if (!k) return null;
  const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", k.key, b64(sig), new TextEncoder().encode(`${h}.${p}`));
  if (!ok || claims.exp * 1000 < Date.now()) return null;
  const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!aud.includes(env.ACCESS_AUD)) return null;
  return claims;
}

// -> { email, service } or null
export async function caller(request, env) {
  // Only `wrangler dev --var DEV_USER:...` sets this (wrangler rewrites the host to escapepack.ca, so it
  // can't be checked). Never add DEV_USER to wrangler.toml or the deployed Worker.
  if (env.DEV_USER) {
    const as = request.headers.get("X-Dev-User"); // lets a local test act as a second person or as Claude
    if (as === "claude") return { email: "service:dev", service: true };
    return { email: as || env.DEV_USER, service: false };
  }
  if (!env.ACCESS_TEAM || !env.ACCESS_AUD) return null;
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) return null;
  const claims = await verify(token, env).catch(() => null);
  if (!claims) return null;
  if (claims.email) return { email: claims.email.toLowerCase(), service: false };
  if (claims.common_name) return { email: "service:" + claims.common_name, service: true };
  return null;
}
