/* Family-level editorial guidance. These are prompts, not recorded test results. */
window.CLUE_GUIDANCE = {
  text: {
    cue:"Make the carrier text plausible, then supply a reason to inspect a particular feature: line starts, punctuation, spacing or a referenced key.",
    setup:"Lock the spelling, line breaks and type size once a positional extraction depends on them. Keep an editable master and a solved proof.",
    solve:"Write the full path from selecting the relevant text through transforming it to reading the final answer. State indexing and reading direction.",
    check:"Try alternative wordings and plausible wrong reads. Recheck extraction after every typography or text edit; do not assume prose changes are harmless.",
    reset:"Replace annotated copies or use a separate answer sheet. Check that erasures do not leave the next group a clue.",
    access:"Check contrast and actual print size. Avoid relying on a barely distinguishable font, regional pronunciation or language trivia without a supplied reference.",
    variants:"Swap the carrier among a letter, label, receipt, itinerary or diary while keeping the same player action. Use a different extraction sparingly, not as an extra unmotivated layer."
  },
  symbol: {
    cue:"Associate symbols with a supplied key through a shared mark, title or context. A historical-looking alphabet is not permission to assume prior knowledge.",
    setup:"Record the exact mapping, including ambiguous symbols and repeated letters. Check the printed key matches the symbols on every prop.",
    solve:"Select the relevant symbol sequence, determine orientation and order, then translate using the in-game key.",
    check:"Test easily confused marks and rotated forms. Distinguish a game adaptation from a claim about how a real historical system works.",
    reset:"Return the key to its intended release point and remove any written translations from reusable props.",
    access:"Pair colour distinctions with shapes or labels. Use a large enough symbol set for differences to remain visible after printing.",
    variants:"Carry the same mapping in stamps, stitching, carved marks or a reference chart. If the surface changes, retest symbol recognition."
  },
  map: {
    cue:"Provide a starting point, orientation, scale and ordering rule wherever the mechanism needs them. Make decorative routes distinguishable from puzzle data.",
    setup:"Choose final print size before setting distances, alignments or overlay geometry. Include a scale reference and preserve the production master.",
    solve:"Locate the relevant places, apply the route or measurement rule, then translate the resulting point, shape or sequence into the requested output.",
    check:"Print at actual size. Check printer scaling, ruler units, trim, fold and registration tolerances. Try the most plausible alternate route and orientation.",
    reset:"Erase route marks and inspect folds or overlays. Restore strings and pins to a documented starting state.",
    access:"Use high-contrast routes and readable labels. Provide a larger version or a tracing aid where fine measurement is incidental to the puzzle.",
    variants:"Use a floor plan, sky chart, transit map or invented landscape. Keep the geometric rules explicit even when the setting changes."
  },
  prop: {
    cue:"Show what can reasonably be manipulated and why two objects belong together. A souvenir can become a tool without requiring force or destructive guessing.",
    setup:"Record dimensions that affect fit, the physical container, starting state and required handling. Prototype the mechanism before polishing the artwork.",
    solve:"Describe each physical action and what feedback shows it worked. Separate a logical insight from dexterity or repeated trial.",
    check:"Test the actual object repeatedly. Look for jamming, accidental release, wear, misleading play and plausible wrong fits.",
    reset:"Photograph the starting arrangement, inventory detachable parts and test reassembly. Note replacement parts and consumables.",
    access:"Check grip, force, reach and fine movement. Offer an equivalent route when a physical capability is not the intended challenge.",
    variants:"Change the in-world object while retaining the same mechanism; remeasure rather than assuming a new shell preserves the fit."
  },
  material: {
    cue:"Give a reason to change the viewing condition or compare surfaces. Supply the required lamp, filter, water or other tool rather than relying on the room.",
    setup:"Prototype on the intended paper, ink, coating and laminate. Record which side faces the viewer and the alignment reference.",
    solve:"Identify the relevant surface, apply the clued viewing action and read the newly visible information in a defined orientation.",
    check:"Check premature visibility, ghosting, glare and legibility in normal lighting. Test repeatability and whether the effect survives transport.",
    reset:"Classify your actual build as reversible, restorable or consumable. Keep replacement masters; do not infer durability from a screen mockup.",
    access:"Do not make colour discrimination or unusual visual perception the only route. Avoid uncontrolled heat or player damage to unrelated props.",
    variants:"Move between printed, cut, layered and embossed carriers only after testing the new material's behaviour."
  },
  logic: {
    cue:"State the allowed moves or constraints and include a worked example if the rules are unfamiliar. Keep the eventual extraction visible as a goal.",
    setup:"Construct a solved instance first, then remove information carefully. Keep a proof or exhaustive check of the solution set where feasible.",
    solve:"Show the deduction sequence and the extraction separately. A filled grid is not the final answer unless the game makes it so.",
    check:"Look for multiple valid solutions and inconsistent rules. If several solutions are allowed, their outputs must all be accepted or identical.",
    reset:"Erase deductions completely or supply fresh worksheets. Return tokens and given clues to the starting arrangement.",
    access:"Use clear wording, ample working space and a compact instance. Offer aids for note-taking without removing the central reasoning step.",
    variants:"Reskin the objects and story, not the mathematical constraints. A new extraction requires a new uniqueness check."
  },
  combine: {
    cue:"Give a fair connection between the inputs: shared IDs, complementary fields, matching geometry or an instruction that names their relationship.",
    setup:"List every input and when it becomes available. Keep one source for each relationship in the kit's needs, props and found_in fields.",
    solve:"Separate selecting inputs, ordering them, transforming them and extracting the answer. Clarify which of these is the intended insight.",
    check:"Walk the dependency graph. Check for circular gates, missing inputs and a single prop accidentally revealing the whole answer early.",
    reset:"Restore each input to its release point; inspect reusable props for accumulated answer marks.",
    access:"Avoid placing all required work on one small object. Let a group share intermediate information in a visible form.",
    variants:"Split selection from order, data from rule, or answer from verification. Do not add all three splits to every puzzle."
  },
  structure: {
    cue:"Make available work and completion states understandable without exposing future answers. Optional work should be clearly optional.",
    setup:"Draw the dependency flow and map it onto actual containers, locks and starting props. Check both solo and group paths.",
    solve:"Describe how a player discovers the next available activity, gets feedback and knows when to combine earlier results.",
    check:"Observe bottlenecks, idle players, premature access and finale fatigue. A graph that connects is not proof of good pacing.",
    reset:"Generate setup from the same prop records as the flow. Reconcile the inventory after every structural change.",
    access:"Avoid making timed speed, multiple simultaneous bodies or a single sensory channel mandatory unless the audience and alternate route are explicit.",
    variants:"Compare linear, parallel and converging arrangements using the same puzzle set before adding more locks."
  }
};
// New families have technique-specific design briefs rather than a shared checklist.
window.CLUE_DETAIL_OVERRIDES = {
  "acrostic":{cue:"A phrase about beginnings points toward line starts.",setup:"Write the target word, then write one natural line per letter. Preserve those line breaks in the final print.",solve:"Take the first letter of each indicated line, top to bottom. The gallery's four lines produce MAPS.",check:"Count lines and letters; check wrapping at the actual card width. A six-line note cannot directly yield a five-letter acrostic without another stated rule.",reset:"Provide an unmarked note or a separate answer sheet.",access:"Use visible line breaks and readable text; avoid making the only cue a tiny typographic difference.",variants:"Use first letters of explicitly separated entries rather than lines if responsive text might reflow."},
  "cardan-grille":{cue:"Shared corner marks, a matching border or story wording connects the mask to its document.",setup:"Design the message and aperture positions together. Include orientation and a repeatable alignment stop.",solve:"Align the mask, read the exposed cells in the supplied order, then use that output.",check:"Test final paper/prop thickness, printer scale and all flips/rotations. Check whether words remain visible around aperture edges.",reset:"Inspect apertures and return both the mask and carrier to their release points.",access:"Use larger apertures or a guide frame; do not require unsupported fine alignment.",variants:"Disguise the mask as a comb, ruler or specimen holder, while retaining a precise registration cue."},
  "route-drawn-as-a-shape":{cue:"Establish the start and route order, then cue players to read what the journey draws.",setup:"Plot the desired shape and choose locations that yield it at final print size. Record whether points are joined by straight lines or actual routes.",solve:"Identify the right locations, connect them in the clued order and read the traced shape.",check:"Test alternate plausible locations, route orders and map rotations. A traced symbol must read reliably to someone who did not draw it.",reset:"Erase marks or replace overlays; check strings return to their start.",access:"Use strong contrast and a thick tracing line; provide a larger map if location precision is incidental.",variants:"Use a cord, reusable overlay or ordered transparencies instead of drawing on the map."},
  "uv-invisible-ink":{cue:"Connect the supplied UV light to the relevant object through a mark or in-world reason to inspect it.",setup:"Use the final ink, paper and laminate. Keep a daylight proof and a UV proof of the same object.",solve:"Inspect the intended surface with the supplied light and interpret the revealed information using its reading order.",check:"Check daylight leakage, background fluorescence, battery state and contrast. Test after the expected storage/handling period.",reset:"Restore the lamp and inspect the mark; replace faded or accidentally exposed materials.",access:"Provide another reveal route when UV viewing is unsuitable; never require looking into the lamp.",variants:"Reveal a selection mark or ordering cue rather than printing the entire answer in invisible ink."},
  "hold-to-light-overlay":{cue:"A shared outline or paired phrase connects the sheets and suggests viewing them together.",setup:"Record the intended sides, trim and registration points. Design on the actual paper weight, including any laminate.",solve:"Orient and align the sheets, hold them to the supplied light source, and read the combined feature.",check:"Test front/back registration, translucency, ghosting and ordinary lighting. Preserve a full-size alignment proof.",reset:"Return the sheets flat and unmarked; replace creased or badly worn copies.",access:"Use a alignment frame or a prepared combined view as an alternate clue.",variants:"Combine partial digits, a route and a key, or missing segments of a picture."},
  "one-digit-per-prop":{cue:"Show both which props contribute and how their digits are ordered.",setup:"Keep the selection and ordering rules explicit in the design notes; record each prop's release gate.",solve:"Obtain one digit from each selected prop, apply the independent order and enter the complete code.",check:"Test duplicate digits, interchangeable props and missing components. Confirm the code length fits the physical lock.",reset:"Reset every contributing prop and erase the shared code sheet.",access:"Pair colour order with symbols or labels and provide a shared recording surface.",variants:"Use one letter, direction or symbol per prop if the chosen output device supports it."}
};
