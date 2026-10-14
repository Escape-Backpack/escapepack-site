/* Envelope edition guidance, 2026-10-14. Editorial candidates, not physical test results. */
(() => {
  const additions = [
    {
      id: "paper-slider-windows", c: "mechanical", n: "Reusable paper sliders",
      m: "Card sleeve and captive printed strips", action: "Slide & set", build: "Print / paper craft", output: "Number / code",
      w: "Set sliding strips from clues; windows expose the result when the strips are correctly positioned.",
      x: "A dispatch sleeve has four strips. A route note specifies oak, bridge, mill and quay, one setting per strip. Setting those landmarks exposes 4271 in four windows, read from a printed arrow.",
      details: {
        cue: "Match each strip to a named setting in the note. Mark the window reading direction and show which parts slide.",
        setup: "Keep strips captive with end stops. Put one result character at each setting; prototype the sleeve before final artwork.",
        solve: "Identify the four landmark settings, position the corresponding strips, then read the exposed characters in the marked order.",
        check: "Check alternate settings, accidental peeking, friction and whether a strip can be inserted backwards. Test after repeated handling; do not rely on a tight printer-dependent fit.",
        reset: "Return strips to a neutral start mark, inspect stops and windows, and repack the assembled sleeve.",
        access: "Use broad tabs, clear alignment marks and symbols with labels. Avoid precision finger movements as the main challenge.",
        variants: "Use a train timetable, specimen selector or station control panel. Related: rotating overlays; this version moves linearly."
      }
    },
    {
      id: "paper-weaving", c: "mechanical", n: "Paper weaving reveal",
      m: "Pre-cut sturdy strips and a slotted card frame", action: "Weave & assemble", build: "Print / paper craft", output: "Shape / image",
      w: "Weave prepared strips through a frame so the visible sections complete a picture or short answer.",
      x: "A repair diagram specifies strip order and over/under positions for a damaged tapestry. Following it completes four digit shapes in a marked reading band. The actual pattern must be constructed and checked.",
      details: {
        cue: "Provide the intended orientation, strip order and a small worked over/under example. The task is interpreting the pattern, not guessing how weaving works.",
        setup: "Supply all pieces pre-cut. Use a frame that fixes spacing and broad strips that can be removed without tearing. Design the revealed artwork on the assembled prototype.",
        solve: "Use the repair clues to order the strips, weave them through the marked slots, then read the completed band.",
        check: "Try reversed strips and plausible alternate orders. Check whether loose strips expose the answer prematurely and whether threading becomes repetitive busywork.",
        reset: "Unweave gently, inspect edges and slots, count the strips and return them to their starting envelope.",
        access: "Offer wide strips with large tabs and a flat placement alternative carrying the same reasoning task.",
        variants: "A woven bookmark, hockey jersey repair or basket pattern can supply the story reason. Keep the amount of weaving short."
      }
    },
    {
      id: "multiple-view-reconstruction", c: "logic", n: "Reconstruct from multiple views",
      m: "View cards, a labelled grid and movable tokens", action: "Deduce & reconstruct", build: "Print / paper craft", output: "Number / code",
      w: "Combine views of the same scene to reconstruct positions that no single view fully specifies.",
      x: "On a two-by-two display, the front view puts the vase left of the bell. The side view places the vase in the back row and the bell in the front row. This fixes vase at back-left and bell at front-right; a supplied location table gives their two-digit labels, read vase then bell.",
      details: {
        cue: "Label viewpoints, shared landmarks and object identities. Show how a view corresponds to the grid, including what left means.",
        setup: "Specify that each object occupies one cell. Draw every view from one consistent master arrangement and supply a labelled location table and reading order.",
        solve: "Use the front view for columns and the side view for rows. Place each object at the intersection, then read the location labels in the stated object order.",
        check: "Enumerate layouts consistent with the views. Require one solution or the same output for every valid layout. Check occlusion, mirrored viewpoints and accidental contradictions.",
        reset: "Remove and count the tokens, shuffle the view cards and clear any working notes.",
        access: "Use distinct shapes plus names and an explicit orientation diagram. A movable flat grid avoids requiring a three-dimensional build.",
        variants: "Reconstruct a display case, cargo bay or team photograph. Unlike viewpoint registration, the insight comes from deduction, not lining up fragments by eye."
      }
    },
    {
      id: "narrative-timeline", c: "logic", n: "Reconstruct a story timeline",
      m: "Event cards and short evidence documents", action: "Sort & arrange", build: "Print / paper craft", output: "Number / code",
      w: "Reconstruct what happened from evidence spread across letters, receipts and pictures. A story-focused variation of constraint ordering.",
      x: "Four event cards carry digits: arrival 4, parcel collection 2, meeting 7, departure 1. A receipt says the parcel was collected after arrival; a letter puts the meeting after collection and before departure. Earliest to latest gives 4271.",
      details: {
        cue: "Ask players to reconstruct the day's events. Make every necessary before/after relationship available in the supplied documents.",
        setup: "Build the event order first, distribute the evidence across short documents, and show which event marks to read. Extra dates should have a clear purpose.",
        solve: "Match evidence to events, establish arrival before collection before meeting before departure, then read the event digits chronologically.",
        check: "Check all possible orders against the clues. Avoid missing time zones, assumed travel durations or historical knowledge. The example is deliberately simple; difficulty requires testing.",
        reset: "Shuffle the event cards, restore documents to their envelopes and remove working annotations.",
        access: "Use concise passages and movable event cards so players can share the reading and compare evidence.",
        variants: "A family journey, expedition incident or match-day mystery. Related entries: constraint ordering, resource scheduling and audio event reconstruction."
      }
    }
  ];
  for (const t of additions) window.CLUE_LIBRARY.techniques.push({ ...t, d: null, evidence: "illustrative", added: "2026-10-14", t: "envelope reusable prototype " + t.n });

  const groups = {
    equipment: new Set("barcode-or-qr-code spectrogram-in-audio magnet-and-reed-switch".split(" ")),
    consumable: new Set("heat-revealed-ink water-reveal scratch-off-coating wax-seal".split(" ")),
    flat: new Set("torn-document-reassembly arrangement-as-data postmarks-and-stamps playing-cards-and-dominoes cipher-disk planisphere-rotating-overlay edge-matching-tiles tangram-silhouette paper-slider-windows paper-weaving hold-to-light-overlay cut-out-window-mask negative-space-reading spot-the-difference torn-edge-matching frame-sequence-reveal pinholes-in-paper".split(" ")),
    fold: new Set("fold-to-join fold-to-reveal cube-net-folding scytale paper-slider-windows paper-weaving cipher-disk planisphere-rotating-overlay".split(" ")),
    pieces: new Set("constraint-ordering matching-pairs torn-document-reassembly edge-matching-tiles tangram-silhouette rotating-network-tiles narrative-timeline multiple-view-reconstruction".split(" ")),
    clear: new Set("nonogram-picross magic-square elimination-grid loop-edge-deduction skyscraper-sightlines crossword-marked-cells maze-or-path-finding route-drawn-as-a-shape toggle-state-grid".split(" ")),
    flatExceptions: new Set("floor-plan-and-physical-space pin-and-string weighing-deduction scytale counting-a-physical-set".split(" "))
  };
  // Explicit action corrections keep near-identical experiences together in the shortlist.
  const actionOverrides = {
    "spot-the-difference": "Compare evidence", "historic-versus-modern-comparison": "Compare evidence",
    "cross-document-assembly": "Deduce & reconstruct", "attribute-triangulation": "Deduce & reconstruct",
    "elimination-grid": "Deduce & reconstruct", "sequential-narrowing": "Deduce & reconstruct",
    "truth-count-statements": "Deduce & reconstruct", "provenance-and-version-match": "Compare evidence",
    "edge-matching-tiles": "Sort & arrange", "torn-document-reassembly": "Sort & arrange",
    "border-as-a-ruler": "Navigate & measure", "continuation-across-a-seam": "Sort & arrange",
    "star-chart-over-a-map": "Align & layer", "resource-scheduling": "Deduce & reconstruct",
    "cube-net-folding": "Fold & wrap", "rotating-network-tiles": "Assemble & move"
  };
  window.clueEnvelopeProfile = t => {
    const structural = t.c === "structure" || t.c === "combine";
    let fit = structural ? "Flow pattern" : "Needs prop prototype";
    if ((["text", "symbol", "map", "logic", "extraction"].includes(t.c) && !groups.flatExceptions.has(t.id)) || groups.flat.has(t.id)) fit = "Flat-paper candidate";
    if (t.c === "sound" || groups.equipment.has(t.id)) fit = "Digital / equipment";
    if (groups.consumable.has(t.id)) fit = "Consumable / redesign";
    let reset = fit === "Flat-paper candidate" ? "Repack" : "Define in build";
    if (groups.pieces.has(t.id)) reset = "Reposition pieces";
    if (groups.clear.has(t.id)) reset = "Clear working marks";
    if (groups.fold.has(t.id)) reset = "Inspect moving parts / folds";
    if (fit === "Digital / equipment") reset = "Reset equipment";
    if (fit === "Consumable / redesign") reset = "Replace / redesign";
    let participation = "Solo or shared";
    if (t.c === "cooperate" || t.id === "parallel-subtasks" || t.id === "bottleneck-relief" || t.id === "open-parallel" || t.id === "convergence") participation = "Shared work; plan solo route";
    if (t.id === "two-person-simultaneous-action") participation = "Requires solo redesign";
    const notes = {
      "Flat-paper candidate": "Promising for envelopes; check your chosen size, print and handling. Use pre-cut pieces and separate scratch paper or a reusable working surface.",
      "Needs prop prototype": "Check thickness, equipment, durability and handling in a filled envelope. Do not assume a flat or inexpensive build.",
      "Flow pattern": "A way to connect solving moments, not an extra puzzle type. One envelope can release several useful tasks.",
      "Digital / equipment": "Not a default for the no-app format. Supply all required equipment or an equivalent physical route; hints can remain optional online.",
      "Consumable / redesign": "The described reveal changes or consumes material. Redesign it for reuse before selecting it for a lendable kit."
    };
    return { fit, reset, participation, fitNote: notes[fit], ...(actionOverrides[t.id] ? { action: actionOverrides[t.id] } : {}) };
  };
  window.clueVarietyGroup = t => {
    if (t.c === "structure" || t.c === "combine") return "Flow patterns";
    if (t.action === "Read & decode" || t.action === "Extract letters") return "Read / decode / extract";
    if (/arrange|assemble|weave|slide|fold|wrap|move/i.test(t.action)) return "Arrange / manipulate";
    if (/align|layer|reveal|look closely/i.test(t.action)) return "Inspect / reveal";
    if (/compare evidence/i.test(t.action)) return "Compare evidence";
    if (/deduce|reason|count/i.test(t.action)) return "Deduce / reason";
    if (/navigate|measure/i.test(t.action)) return "Navigate / measure";
    return t.action;
  };
})();
