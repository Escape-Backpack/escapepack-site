"use strict";
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const slug = s => s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const categories = CLUE_LIBRARY.categories.filter(c => c.lede);
const categoryName = id => categories.find(c => c.id === id)?.label || id;
// Editorial browsing aids, not assertions that a technique has been tested.
function suggestedTags(t) {
  const n = t.n.toLowerCase(), material = t.m.toLowerCase();
  let action = ({text:"Read & decode",symbol:"Read & decode",map:"Navigate & measure",prop:"Handle & arrange",material:"Reveal",logic:"Reason & count",combine:"Combine",structure:"Plan the flow"})[t.c];
  if (/sort|order|arrangement|reassembly|matching|jigsaw|set completion/.test(n)) action = "Sort & arrange";
  else if (/overlay|grille|mask|superposition|align/.test(n)) action = "Align & layer";
  else if (/fold|wrap|scytale/.test(n)) action = "Fold & wrap";
  else if (n === "triangulation" || /measur|bearing|distance|ruler/.test(n)) action = "Navigate & measure";
  else if (/counting|tally marks/.test(n)) action = "Reason & count";
  else if (/hidden|magnifier|micro-text|mark in|invisible/.test(n)) action = "Look closely";
  let build = "Props / mixed materials";
  if (/^structural/.test(material)) build = "Design pattern";
  else if (/3d/.test(material)) build = "3D print / build";
  else if (/phone|audio|circuit|switch/.test(material)) build = "Digital / electronics";
  else if (/ink|light|torch|acetate|mirror|paint|paper|stock|sheets|coating/.test(material)) build = "Paper / light / finishes";
  else if (/print|typesetting|artwork/.test(material)) build = "Print / paper craft";
  let output = "Adapt to your puzzle";
  if (t.c === "structure" || /^structural/.test(material)) output = "Flow / connection";
  else if (/acrostic|null cipher|telestich|book cipher|caesar|atbash|vigen|bacon|rail fence|transposition|scytale|substitution|pigpen|futhark|ogham|polybius|tap code|morse|semaphore|mirror writing/.test(n)) output = "Text / instruction";
  else if (/seven-segment|roman numerals|tally marks|date arithmetic|counting a|distance table|one digit/.test(n)) output = "Number / code";
  else if (/grid reference|latitude|bearing|triangulation|maze|pin and string/.test(n)) output = "Location / route";
  else if (/route drawn|nonogram|anamorphic|calligram|lithophane/.test(n)) output = "Shape / image";
  else if (/cryptex|puzzle box|compartment|release|containers|retrieval|lock|keys as/.test(n)) output = "Physical access";
  return {action, build, output};
}
const records = CLUE_LIBRARY.techniques.map(t => ({...t, id:t.id || slug(t.n), ...suggestedTags(t),
  ...Object.fromEntries(["action","build","output"].filter(k=>t[k]).map(k=>[k,t[k]])),
  details:t.details || CLUE_DETAIL_OVERRIDES[t.id],
}));
const byId = new Map(records.map(t => [t.id,t]));
let saved = new Set(), storageAvailable = true;
try { const stored = JSON.parse(localStorage.getItem("escape-clue-shortlist-v1") || "[]"); if (Array.isArray(stored)) saved = new Set(stored.filter(id => byId.has(id))); } catch { storageAvailable = false; }
let mode = "find", currentDetail = null, detailTrigger = null, toastTimer;
function toast(message) { clearTimeout(toastTimer); $("#toast").textContent=message; $("#toast").hidden=false; toastTimer=setTimeout(()=>$("#toast").hidden=true,4200); }
function persist() { try { localStorage.setItem("escape-clue-shortlist-v1",JSON.stringify([...saved])); } catch { storageAvailable=false; } }
function updateCount() { $("#saved-count").textContent=saved.size; }
function toggleSave(id) {
  if(saved.has(id)) saved.delete(id); else saved.add(id);
  persist(); render(); updateCount();
  if(currentDetail) updateDetailSave();
  if(!storageAvailable) toast("Saved for this session only; browser storage is unavailable.");
}
function addOptions(selector, values) { for(const [value,label] of values) { const option=document.createElement("option"); option.value=value; option.textContent=label; $(selector).append(option); } }
addOptions("#category",categories.map(c=>[c.id,c.label]));
for(const [selector,key] of [["#action","action"],["#material","build"],["#output","output"]]) addOptions(selector,[...new Set(records.map(t=>t[key]))].sort().map(v=>[v,v]));
$("#library-count").textContent=records.length;
function filtered() {
  const words=$("#search").value.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return records.filter(t=>(mode!=="saved"||saved.has(t.id)) && (!$("#category").value||t.c===$("#category").value) && (!$("#action").value||t.action===$("#action").value) && (!$("#material").value||t.build===$("#material").value) && (!$("#output").value||t.output===$("#output").value) && (!$("#depth").value||($("#depth").value==="specific"?!!t.details:!t.details)) && words.every(w=>[t.n,t.w,t.x,t.m,t.t,t.warn,t.action,t.output,categoryName(t.c),...Object.values(t.details||{})].join(" ").toLowerCase().includes(w)));
}
function saveButton(t) { return `<button type="button" class="save" data-save="${t.id}" aria-pressed="${saved.has(t.id)}" aria-label="${saved.has(t.id)?"Remove":"Save"} ${esc(t.n)}${saved.has(t.id)?" from":" to"} shortlist">${saved.has(t.id)?"✓ Saved":"＋ Save"}</button>`; }
function render() {
  const items=filtered();
  $("#results-title").textContent=mode==="saved"?"Your shortlist":($("#category").value?categoryName($("#category").value):"The full collection");
  $("#result-count").textContent=`${items.length} of ${mode==="saved"?saved.size:records.length} techniques${mode==="saved"?" · saved in this browser":" · open a card for examples and notes"}`;
  $("#results").innerHTML=items.map(t=>`<article class="technique"><div class="card-kicker">${esc(categoryName(t.c))}</div><h3><button type="button" data-open="${t.id}">${esc(t.n)}</button></h3><p class="description">${esc(t.w)}</p><div class="chips"><span class="chip">${esc(t.action)}</span><span class="chip">${esc(t.build)}</span></div><div class="card-bottom"><button type="button" class="open-card" data-open="${t.id}" aria-label="Explore ${esc(t.n)}">Explore technique ↗</button>${saveButton(t)}</div></article>`).join("");
  $("#empty").hidden=items.length>0;
  $("#empty-message").textContent=mode==="saved"&&!saved.size?"Save techniques from the finder or visual examples to collect them here.":"Try fewer filters or a different search.";
  $("#empty-clear").textContent=mode==="saved"&&!saved.size?"Browse techniques":"Clear filters";
  $("#export").hidden=mode!=="saved"||!saved.size;
}
function clearFilters() { for(const s of ["#search","#category","#action","#material","#output","#depth"]) $(s).value=""; render(); }
function setMode(next, changeHash=true) {
  mode=["find","saved","inspire","guide","coverage"].includes(next)?next:"find";
  $("#browse").hidden=!["find","saved"].includes(mode); $("#inspiration").hidden=mode!=="inspire"; $("#guide").hidden=mode!=="guide";
  $("#coverage").hidden=mode!=="coverage";
  document.querySelectorAll("[data-mode]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.mode===mode)));
  render(); if(changeHash) history.replaceState(null,"",`#${mode}`);
}
function brief(t) { return `<!-- Candidate idea: ${t.n} — not an approved design or tested build.\nCreate the record with kit.py new puzzle, then REPLACE its whole body (everything below the front matter) with this brief; pasting it in addition duplicates the headings.\nKeep status idea and publish_hints no. Put the library link in the technique: field:\ntechnique: ${location.href.split("#")[0]}#technique/${t.id} -->\n\n## How it works\n[open]\n\n## Player notices\n[open]\n\n## Player does\n[${t.action}; adapt to the story]\n\n## Player obtains\n[open]\n\n## Story reason\n[open]\n\n## Reading order\n[open]\n\n## Hints\n1.\n\n## Solution\n[open]\n\n## Playtest evidence\n<!-- No test recorded. Add dated observations after testing. -->\n\n<!-- Prop-record follow-up: materials (${t.m}), container, starting state, reset, replacement.\nAvailability: link props, needs and found_in when known. -->\n`; }
async function copyText(text, label, host) {
  try { await navigator.clipboard.writeText(text); toast(label); }
  catch {
    let area=host.querySelector(".brief-fallback");
    if(!area) { area=document.createElement("textarea"); area.className="brief-fallback"; area.readOnly=true; area.setAttribute("aria-label","Select and copy this idea brief"); host.append(area); }
    area.value=text; area.focus(); area.select(); toast("Copy the selected text with Ctrl+C or your device’s Copy command.");
  }
}
function updateDetailSave() { const holder=$("#detail-save"); if(holder) holder.innerHTML=saveButton(byId.get(currentDetail)); }
function openDetail(id, push=true) {
  const t=byId.get(id); if(!t) return;
  if(!$("#detail").open) detailTrigger=document.activeElement;
  currentDetail=id;
  const demo=demos.find(d=>d.id===id);
  $("#detail-body").innerHTML=`<p class="card-kicker">${esc(categoryName(t.c))}</p><h2 id="detail-title">${esc(t.n)}</h2><p>${esc(t.w)}</p>${demo?`<div class="illustration">${diagram(demo)}</div><p class="evidence">Illustrative example · not a tested prop</p>`:""}<dl class="detail-meta"><dt>Player action</dt><dd>${esc(t.action)}</dd><dt>Materials</dt><dd>${esc(t.m)}</dd><dt>Possible output</dt><dd>${esc(t.output)}</dd><dt>Difficulty</dt><dd>${t.d}/5 · inherited estimate; depends on clues and execution</dd></dl><div class="detail-example"><h3>${t.id==="acrostic"?"Illustrative example":"Imported example · implementation unverified"}</h3><p>${esc(t.x)}</p></div>${t.warn?`<p class="detail-warning"><strong>Design consideration:</strong> ${esc(t.warn)}</p>`:""}<p class="evidence">Playtest evidence: not recorded here. Check the current backpack records before reusing game-specific details.</p>${t.s?`<a href="${esc(t.s[1])}" target="_blank" rel="noopener noreferrer">Reference: ${esc(t.s[0])} ↗</a>`:""}<div class="detail-actions"><span id="detail-save"></span><button type="button" class="secondary" id="copy-brief">Copy idea brief</button><button type="button" class="secondary" id="copy-link">Copy link</button></div>`;
  const detailMeta=$("#detail-body .detail-meta");
  detailMeta.lastElementChild.textContent=t.d?`${t.d}/5 · inherited estimate; depends on clues and execution`:"Not rated · prototype before assigning difficulty";
  if(t.evidence==="illustrative") $("#detail-body .detail-example h3").textContent="Original illustrative proposal · not playtested";
  const guidance=t.details || CLUE_GUIDANCE[t.c] || {};
  const titles={cue:"Fair cue",setup:"Build & setup",solve:"Solving path",check:"Failure modes & test",reset:"Reset & replacement",access:"Accessibility",variants:"Variations"};
  const section=document.createElement("section"); section.className="technique-brief";
  section.innerHTML=`<h3>${t.details?"Specific design brief":"Family design checklist"}</h3><p class="evidence">${t.details?"Guidance for this mechanism; adapt and test the actual build.":"Shared guidance for this category; a specific production brief is still needed."}</p>${Object.entries(titles).map(([key,title])=>`<details${["cue","solve"].includes(key)?" open":""}><summary>${title}</summary><p>${esc(guidance[key]||"Not documented yet.")}</p></details>`).join("")}<p class="evidence">${t.source_checked?`Mechanism reference reviewed ${esc(t.source_checked)}. The worked example remains untested.`:t.s?"Reference carried forward; not independently rechecked for this entry.":"Original design proposal; a technique-specific reference has not been attached."}</p>`;
  $("#detail-body .detail-actions").before(section);
  updateDetailSave();
  $("#copy-brief").onclick=()=>copyText(brief(t),"Idea brief copied. Paste it into your working notes.",$("#detail-body"));
  $("#copy-link").onclick=()=>copyText(`${location.href.split("#")[0]}#technique/${id}`,"Technique link copied.",$("#detail-body"));
  if(!$("#detail").open) $("#detail").showModal();
  if(push) history.pushState(null,"",`#technique/${id}`);
}
function closeDetail() { const id=currentDetail; $("#detail").close(); currentDetail=null; history.replaceState(null,"",`#${mode}`); if(detailTrigger?.isConnected) detailTrigger.focus(); else document.querySelector(`[data-open="${id}"]`)?.focus(); }
$("#close-detail").onclick=closeDetail;
$("#detail").addEventListener("cancel",e=>{e.preventDefault();closeDetail();});
$("#detail").addEventListener("click",e=>{if(e.target===$("#detail")){const r=$("#detail").getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDetail();}});
document.addEventListener("click",e=>{
  const open=e.target.closest("[data-open]"), save=e.target.closest("[data-save]"), nav=e.target.closest("[data-mode]");
  if(open) openDetail(open.dataset.open);
  if(save) { const id=save.dataset.save; const inDialog=$("#detail").contains(save); toggleSave(id); (inDialog?$("#detail-save .save"):document.querySelector(`[data-save="${id}"]`))?.focus(); }
  if(nav) setMode(nav.dataset.mode);
  const category=e.target.closest("[data-category]");
  if(category){clearFilters();$("#category").value=category.dataset.category;setMode("find");}
});
for(const s of ["#search","#category","#action","#material","#output","#depth"]) $(s).addEventListener("input",render);
$("#clear").onclick=clearFilters;
$("#empty-clear").onclick=()=>{clearFilters();if(mode==="saved"&&!saved.size)setMode("find");};
$("#export").onclick=()=>copyText([...saved].map(id=>brief(byId.get(id))).join("\n---\n\n"),"Shortlist copied.",$(".results-area"));

const demos=[
  {id:"acrostic",verb:"Read the starts",note:"A line cue turns a short note into a four-letter word.",caption:"First letters → MAPS",art:"acrostic"},
  {id:"cardan-grille",verb:"Let an object select",note:"A windowed mask selects four cells. A corner mark sets orientation.",caption:"Align the mask → read 4 2 7 1",art:"grille"},
  {id:"route-drawn-as-a-shape",verb:"Turn a journey into a shape",note:"Follow four numbered stops. The traced route becomes the answer.",caption:"1 → 2 → 3 → 4 draws a Z",art:"route"},
  {id:"constraint-ordering",verb:"Make order do the work",note:"Two relationships put three numbered tickets in one order.",caption:"Leaf before moon before sun → 2 4 7",art:"order"},
  {id:"hold-to-light-overlay",verb:"Give two halves one meaning",note:"Two partial shapes combine when the sheets are aligned and backlit.",caption:"Two sheets → one digit",art:"overlay"},
  {id:"matching-pairs",verb:"Match, then read",note:"Pair symbols with their keys. The order of the first row matters.",caption:"Moon, star, sun → 4 2 7",art:"match"},
  {id:"uv-invisible-ink",verb:"Change what can be seen",note:"A supplied light reveals a mark that ordinary viewing misses.",caption:"Ordinary view → UV view",art:"uv"},
  {id:"metapuzzle",verb:"Bring earlier answers together",note:"Three earlier results supply the three parts of a final code.",caption:"Earlier outputs → one final answer",art:"meta"},
  {id:"indexed-answer-extraction",verb:"Take one letter from each",note:"Each supplied index selects a letter. The card order supplies the reading order.",caption:"CAMP[3] · TRAIL[3] · ROPE[3] → MAP",art:"index"},
  {id:"texture-substitution",verb:"Let the surface speak",note:"Match textures to a supplied key. A marked end sets the direction.",caption:"Felt · ridges · smooth → 2 4 7",art:"texture"},
  {id:"distributed-information",verb:"Put two views together",note:"A shared specimen ID joins one player’s description to another’s number key.",caption:"Match the same specimen → combine the facts",art:"shared"},
  {id:"truth-count-statements",verb:"Test every candidate",note:"Exactly one claim is true: “red” and “not green”. Only the blue box fits.",caption:"Red: 2 true · Blue: 1 true · Green: 0 true",art:"truth"}
];
function diagram(d) {
  const text=(x,y,s,size=16,extra="")=>`<text x="${x}" y="${y}" font-size="${size}" ${extra}>${s}</text>`;
  const box=(x,y,w,h,fill="#fbf7ee",extra="")=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${fill}" stroke="#8c9f84" ${extra}/>`;
  let art="";
  if(d.art==="acrostic") art=box(32,16,246,163)+text(51,42,"“Look to the beginnings.”",13)+["Meet me beside the trees.","A trail runs north from here.","Pack the little compass.","Start before the sun sets."].map((s,i)=>text(51,70+i*25,s,14)).join("")+`<rect x="46" y="54" width="18" height="101" rx="3" fill="#b95b3d" opacity=".18"/>`;
  if(d.art==="grille") art=Array.from({length:12},(_,i)=>box(29+(i%4)*66,27+Math.floor(i/4)*47,55,36)+text(51+(i%4)*66,51+Math.floor(i/4)*47,[4,8,6,9,3,2,0,5,7,3,6,1][i],20)).join("")+[0,5,8,11].map(i=>box(25+(i%4)*66,23+Math.floor(i/4)*47,63,44,"none",'stroke-width="3"')).join("")+text(28,186,"Read selected cells row by row",12);
  if(d.art==="route") art=Array.from({length:6},(_,i)=>`<path d="M 35 ${29+i*26} H 275 M ${40+i*45} 20 V 169" stroke="#bec9b0" stroke-width="1"/>`).join("")+`<path d="M65 47 H245 L65 145 H245" fill="none" stroke="#b95b3d" stroke-width="5" stroke-linecap="round"/>`+[[65,47],[245,47],[65,145],[245,145]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="14" fill="#17372d"/>`+`<text x="${x}" y="${y+5}" text-anchor="middle" style="fill:#fff7e8" font-size="14">${i+1}</text>`).join("");
  if(d.art==="order") art=text(27,35,"Leaf before moon. Moon before sun.",13)+["LEAF","MOON","SUN"].map((s,i)=>box(26+i*95,61,72,90)+text(62+i*95,88,s,12,'text-anchor="middle"')+text(62+i*95,132,[2,4,7][i],30,'text-anchor="middle"')).join("");
  if(d.art==="overlay") art=box(22,51,70,100)+box(112,51,70,100)+box(212,51,70,100)+`<path d="M40 70 H75 M 164 70 V 131 M 230 70 H264 V131" stroke="#b95b3d" stroke-width="7" fill="none"/>`+text(98,107,"+",20)+text(190,107,"=",20)+text(35,178,"Sheet A",12)+text(124,178,"Sheet B",12)+text(222,178,"Aligned",12);
  if(d.art==="match") art=text(29,30,"Keep the top row’s order",13)+["☾","☆","☼"].map((s,i)=>box(31+i*91,46,65,48)+text(63+i*91,79,s,28,'text-anchor="middle"')).join("")+text(32,139,"KEY:  ☼ = 7     ☾ = 4     ☆ = 2",16)+text(91,177,"4   ·   2   ·   7",23);
  if(d.art==="uv") art=box(22,40,117,123)+box(170,40,117,123,"#17372d")+text(38,64,"Field note",13)+text(184,64,"Field note",13,'style="fill:#d0dac9"')+`<path d="M38 88 H118 M38 104 H112 M38 120 H117" stroke="#9aab92"/>`+text(227,130,"427",36,'style="fill:#cfef87" text-anchor="middle"')+text(37,184,"Daylight",12)+text(190,184,"UV light",12);
  if(d.art==="meta") art=["4","2","7"].map((s,i)=>box(32+i*93,26,58,48)+text(61+i*93,59,s,25,'text-anchor="middle"')+`<path d="M${61+i*93} 78 L155 126" stroke="#859b7a" stroke-width="2" fill="none"/>`).join("")+box(97,126,116,53,"#17372d")+text(155,163,"427",31,'style="fill:#fff7e8" text-anchor="middle"');
  if(d.art==="index") art=[['CAMP',3,'M'],['TRAIL',3,'A'],['ROPE',3,'P']].map(([word,index,letter],i)=>box(24,20+i*52,262,42)+text(38,48+i*52,word,19)+text(158,48+i*52,`[${index}]  →  ${letter}`,20)).join('');
  if(d.art==="texture") art=[['FELT','2'],['RIDGES','4'],['SMOOTH','7']].map(([label,value],i)=>box(22+i*95,27,77,116)+text(60+i*95,165,label,11,'text-anchor="middle"')+text(60+i*95,185,value,16,'text-anchor="middle"')).join('')+Array.from({length:25},(_,i)=>`<circle cx="${32+i%5*12}" cy="${42+Math.floor(i/5)*19}" r="2" fill="#8c9f84"/>`).join('')+Array.from({length:6},(_,i)=>`<path d="M125 ${42+i*15} H182" stroke="#8c9f84" stroke-width="4"/>`).join('');
  if(d.art==="shared") art=box(20,33,123,130)+box(167,33,123,130)+text(33,58,'FIELD NOTE',12)+text(180,58,'CATALOGUE',12)+text(33,97,'Specimen A',16)+text(33,127,'Triangle',16)+text(180,97,'Specimen A',16)+text(180,127,'Value: 4',16)+`<path d="M145 98 H165" stroke="#b95b3d" stroke-width="3"/>`;
  if(d.art==="truth") art=text(22,28,'Exactly one claim is true',16)+text(112,55,'“red”',12)+text(189,55,'“not green”',12)+[['RED','T','T'],['BLUE','F','T'],['GREEN','F','F']].map(([name,a,b],i)=>box(20,66+i*38,270,33,i===1?'#d4dfc0':'#fbf7ee')+text(31,88+i*38,name,13)+text(123,88+i*38,a,15)+text(219,88+i*38,b,15)).join('');
  return `<svg viewBox="0 0 310 200" role="img" aria-label="${esc(d.caption)}">${art}</svg>`;
}
$("#gallery").innerHTML=demos.map(d=>`<article class="inspiration-card"><div class="illustration">${diagram(d)}<div class="diagram-caption">${esc(d.caption)}</div></div><div class="gallery-copy"><div class="card-kicker">${esc(byId.get(d.id).action)}</div><h3>${esc(d.verb)}</h3><p>${esc(d.note)}</p><button type="button" class="open-card" data-open="${d.id}">Explore ${esc(byId.get(d.id).n.toLowerCase())} ↗</button></div></article>`).join("");
const reading=[
  ["Peeking Behind the Locked Door — Scott Nicholson","https://scottnicholson.com/pubs/erfacwhite.pdf"],
  ["Ask Why: Environmental Storytelling — Scott Nicholson","https://scottnicholson.com/pubs/askwhy.pdf"],
  ["13 Rules for Escape Room Puzzle Design — The Codex","https://thecodex.ca/13-rules-for-escape-room-puzzle-design/"],
  ["Escape Room Games — Wiemker, Elumir & Clare","https://thecodex.ca/wp-content/uploads/2016/08/00511Wiemker-et-al-Paper-Escape-Room-Games.pdf"],
  ["How to Hunt Puzzles — MIT, 2023","https://puzzles.mit.edu/resources/hth2023/hth2023.html"],
  ["MIT Mystery Hunt Puzzle Index","https://devjoe.appspot.com/huntindex/index/index.html"]
];
$("#reading").innerHTML=`<p>Selected primary references reviewed on September 28, 2026: <a href="https://puzzledpint.org/volunteering/write-puzzles/" target="_blank" rel="noopener noreferrer">Puzzled Pint authoring guidance</a>, <a href="https://scottnicholson.com/pubs/askwhy.pdf" target="_blank" rel="noopener noreferrer">Nicholson’s Ask Why</a>, and the mechanism references labelled on new cards. The expanded examples and build checklists are original editorial proposals.</p><p>Additional carried-over reading (not comprehensively rechecked):</p><ul>${reading.map(([name,url])=>`<li><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name)} ↗</a></li>`).join("")}</ul>`;
$("#coverage-summary").textContent=`${records.length} entries · ${categories.length} categories · ${records.filter(t=>t.details).length} specific briefs · ${records.filter(t=>!t.details).length} family checklists`;
$("#coverage-grid").innerHTML=categories.map(c=>{const list=records.filter(t=>t.c===c.id);return `<article><p class="card-kicker">${list.length} entries · ${list.filter(t=>t.details).length} specific briefs</p><h3>${esc(c.label)}</h3><button type="button" class="open-card" data-category="${c.id}">Browse category ↗</button></article>`;}).join("");
function route() {
  const hash=location.hash.slice(1);
  if(hash.startsWith("technique/")) {const id=hash.slice(10); if(byId.has(id)) {openDetail(id,false);return;} toast("That technique link was not found.");}
  if($("#detail").open) {$("#detail").close();currentDetail=null;}
  setMode(hash,false);
}
window.addEventListener("hashchange",route);
updateCount(); render(); route();
