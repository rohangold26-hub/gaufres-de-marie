/* =====================================================================
   Les Gaufres de Marie — per-item food illustrations (inline SVG)
   Each item gets art that MATCHES its name:
   plain waffle, chocolate drizzle, caramel, honey, oreo, banana, etc.
   LGM.dishArt(item) -> SVG markup string sized to fill the card image.
   ===================================================================== */
(function (root) {
  const LGM = (root.LGM = root.LGM || {});

  // shape: square (Bruxelloise) | round (Liège) | minis | bowl | box | drink
  // top:   sugar | chocolate | caramel | honey | oreo | speculoos | banana | hazelnut | mixed
  const ART = {
    "brx-nature":     { shape: "square", top: "sugar" },
    "brx-nutella":    { shape: "square", top: "chocolate" },
    "brx-cbs":        { shape: "square", top: "caramel" },
    "brx-miel":       { shape: "square", top: "honey" },
    "lg-nature":      { shape: "round", top: "sugar" },
    "lg-nutella":     { shape: "round", top: "chocolate" },
    "lg-cbs":         { shape: "round", top: "caramel" },
    "lg-oreo":        { shape: "round", top: "oreo" },
    "min-gaufres":    { shape: "minis", top: "sugar" },
    "min-pan-nature": { shape: "minis", top: "honey" },
    "min-pan-oreo":   { shape: "minis", top: "oreo" },
    "min-pan-spec":   { shape: "minis", top: "speculoos" },
    "bowl-nutban":    { shape: "bowl", top: "banana" },
    "bowl-cookie":    { shape: "bowl", top: "speculoos" },
    "bowl-crispy":    { shape: "bowl", top: "hazelnut" },
    "box-brux":       { shape: "box", top: "mixed", round: false },
    "box-liege":      { shape: "box", top: "mixed", round: true },
    "dr-limonade":    { shape: "drink", top: "lemon" }
  };

  const C = {
    waffle: "#E6A95B", waffleDk: "#C8842F", waffleEdge: "#A9691F", pocket: "#8a4f1e",
    choc: "#3a1c0a", chocHi: "#6a3a18", caramel: "#C9821E", caramelHi: "#E8A94B",
    honey: "#E7B73A", cream: "#FBEFE2", oreo: "#2a2024", oreoCream: "#fff",
    banana: "#F3D24E", nut: "#9c6326", sugar: "#fff", plate: "#00000018"
  };

  // ---------- waffle grid ----------
  function grid(cx, cy, w, h, n) {
    let s = "";
    for (let i = 1; i < n; i++) {
      const x = cx - w / 2 + (w / n) * i;
      s += `<line x1="${x}" y1="${cy - h / 2}" x2="${x}" y2="${cy + h / 2}"/>`;
    }
    for (let j = 1; j < n; j++) {
      const y = cy - h / 2 + (h / n) * j;
      s += `<line x1="${cx - w / 2}" y1="${y}" x2="${cx + w / 2}" y2="${y}"/>`;
    }
    return `<g stroke="${C.pocket}" stroke-opacity=".5" stroke-width="4" stroke-linecap="round">${s}</g>`;
  }

  function squareWaffle(cx, cy, sz) {
    const r = sz * 0.18;
    return `<g>
      <rect x="${cx - sz / 2 + 6}" y="${cy - sz / 2 + 10}" width="${sz}" height="${sz}" rx="${r}" fill="${C.plate}"/>
      <rect x="${cx - sz / 2}" y="${cy - sz / 2}" width="${sz}" height="${sz}" rx="${r}" fill="${C.waffleDk}"/>
      <rect x="${cx - sz / 2}" y="${cy - sz / 2}" width="${sz}" height="${sz * 0.9}" rx="${r}" fill="url(#wg)"/>
      ${grid(cx, cy - sz * 0.03, sz * 0.82, sz * 0.78, 4)}
      <rect x="${cx - sz / 2}" y="${cy - sz / 2}" width="${sz}" height="${sz}" rx="${r}" fill="none" stroke="${C.waffleEdge}" stroke-width="3"/>
    </g>`;
  }
  function roundWaffle(cx, cy, rad) {
    return `<g>
      <ellipse cx="${cx}" cy="${cy + rad * 0.18}" rx="${rad * 1.02}" ry="${rad * 0.95}" fill="${C.plate}"/>
      <circle cx="${cx}" cy="${cy}" r="${rad}" fill="${C.waffleDk}"/>
      <circle cx="${cx}" cy="${cy - rad * 0.04}" r="${rad * 0.97}" fill="url(#wg)"/>
      <clipPath id="rc${cx}${cy}"><circle cx="${cx}" cy="${cy}" r="${rad * 0.92}"/></clipPath>
      <g clip-path="url(#rc${cx}${cy})">${grid(cx, cy, rad * 2, rad * 2, 6)}</g>
      <circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="${C.waffleEdge}" stroke-width="3"/>
    </g>`;
  }

  // ---------- toppings ----------
  function drizzle(cx, cy, w, col, hi) {
    const y = cy - 8;
    return `<g fill="none" stroke="${col}" stroke-width="13" stroke-linecap="round">
      <path d="M${cx - w * .42} ${y - 18} q ${w * .18} 34 ${w * .34} 4 q ${w * .16} -30 ${w * .34} 6"/>
      <path d="M${cx - w * .34} ${y + 22} q ${w * .2} -28 ${w * .36} 8 q ${w * .14} 30 ${w * .3} -4"/>
    </g>
    <g fill="none" stroke="${hi}" stroke-width="4" stroke-linecap="round" opacity=".7">
      <path d="M${cx - w * .42} ${y - 22} q ${w * .18} 34 ${w * .34} 4 q ${w * .16} -30 ${w * .34} 6"/>
    </g>
    <circle cx="${cx - w * .42}" cy="${y - 18}" r="9" fill="${col}"/>
    <circle cx="${cx + w * .26}" cy="${y + 30}" r="8" fill="${col}"/>`;
  }
  function pool(cx, cy, w, col, hi) {
    return `<ellipse cx="${cx}" cy="${cy}" rx="${w * .34}" ry="${w * .2}" fill="${col}"/>
      <ellipse cx="${cx - w * .08}" cy="${cy - w * .05}" rx="${w * .14}" ry="${w * .07}" fill="${hi}" opacity=".6"/>`;
  }
  function crumbs(cx, cy, w, col, light) {
    let s = "";
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * 6.28, rr = (i % 3) * w * .08 + w * .05;
      const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * .6;
      s += `<circle cx="${x}" cy="${y}" r="${3 + (i % 3)}" fill="${i % 2 ? col : light}"/>`;
    }
    return s;
  }
  function sugar(cx, cy, w) {
    let s = "";
    for (let i = 0; i < 22; i++) { const x = cx - w * .4 + Math.random() * w * .8, y = cy - w * .32 + Math.random() * w * .6; s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1 + Math.random() * 1.6).toFixed(1)}" fill="#fff" opacity=".9"/>`; }
    return s;
  }
  function bananas(cx, cy, w) {
    let s = "";
    [[-.2, -.04], [.04, .06], [.22, -.02], [-.04, .14]].forEach(([dx, dy]) => {
      s += `<g transform="translate(${cx + dx * w} ${cy + dy * w}) rotate(${(dx * 60).toFixed(0)})"><ellipse rx="14" ry="10" fill="${C.banana}" stroke="#d9b73a" stroke-width="2"/><circle r="2.5" fill="#caa42f"/></g>`;
    });
    return s;
  }
  function nuts(cx, cy, w) {
    let s = "";
    for (let i = 0; i < 8; i++) { const a = i / 8 * 6.28; const x = cx + Math.cos(a) * w * .22, y = cy + Math.sin(a) * w * .14; s += `<ellipse cx="${x}" cy="${y}" rx="8" ry="6" fill="${C.nut}" stroke="#7a4a1a" stroke-width="1.5" transform="rotate(${(a * 57).toFixed(0)} ${x} ${y})"/>`; }
    return s;
  }
  function topping(top, cx, cy, w) {
    switch (top) {
      case "chocolate": return pool(cx, cy, w, C.choc, C.chocHi) + drizzle(cx, cy, w, C.choc, C.chocHi);
      case "caramel": return pool(cx, cy, w, C.caramel, C.caramelHi) + drizzle(cx, cy, w, C.caramel, C.caramelHi);
      case "honey": return `<g opacity=".92">${drizzle(cx, cy, w, C.honey, "#f6d873")}</g>`;
      case "oreo": return pool(cx, cy, w, C.choc, C.chocHi) + crumbs(cx, cy, w, C.oreo, C.oreoCream) + drizzle(cx, cy, w, C.choc, C.chocHi);
      case "speculoos": return pool(cx, cy, w, C.caramel, C.caramelHi) + crumbs(cx, cy, w, "#9c6326", "#d9a45e");
      case "banana": return pool(cx, cy, w, C.choc, C.chocHi) + bananas(cx, cy, w) + drizzle(cx, cy, w, C.choc, C.chocHi);
      case "hazelnut": return pool(cx, cy, w, C.choc, C.chocHi) + nuts(cx, cy, w);
      case "sugar": default: return sugar(cx, cy, w);
    }
  }

  // ---------- shapes ----------
  function drawSquare(top) { return squareWaffle(200, 140, 180) + topping(top, 200, 132, 180); }
  function drawRound(top) { return roundWaffle(200, 140, 96) + topping(top, 200, 134, 175); }
  function drawMinis(top) {
    let s = "";
    const pos = [[120, 110], [205, 100], [285, 120], [165, 175], [250, 178]];
    pos.forEach(([x, y]) => { s += `<g>${roundWaffle(x, y, 44)}</g>` + miniTop(top, x, y - 3); });
    return s;
  }
  function miniTop(top, x, y) {
    if (top === "sugar") return sugar(x, y, 70);
    if (top === "honey") return `<path d="M${x - 24} ${y - 6} q 22 26 44 2" fill="none" stroke="${C.honey}" stroke-width="7" stroke-linecap="round" opacity=".9"/>`;
    if (top === "oreo") return pool(x, y, 70, C.choc, C.chocHi) + crumbs(x, y, 60, C.oreo, "#fff");
    if (top === "speculoos") return pool(x, y, 70, C.caramel, C.caramelHi) + crumbs(x, y, 60, "#9c6326", "#d9a45e");
    return "";
  }
  function drawBowl(top) {
    const cx = 200, cy = 150;
    let pieces = "";
    const pp = [[160, 120], [210, 110], [250, 140], [170, 165], [225, 165], [200, 140]];
    pp.forEach(([x, y]) => pieces += `<rect x="${x - 16}" y="${y - 14}" width="32" height="28" rx="6" fill="url(#wg)" stroke="${C.waffleEdge}" stroke-width="2" transform="rotate(${((x + y) % 40 - 20)} ${x} ${y})"/>`);
    return `<g>
      <ellipse cx="${cx}" cy="${cy + 60}" rx="120" ry="26" fill="${C.plate}"/>
      <path d="M${cx - 120} ${cy - 6} a120 70 0 0 0 240 0 z" fill="#caa06a"/>
      <ellipse cx="${cx}" cy="${cy - 6}" rx="120" ry="42" fill="#e7c79a"/>
      <ellipse cx="${cx}" cy="${cy - 8}" rx="108" ry="34" fill="#f3ddb8"/>
      ${pieces}
      ${topping(top, cx, cy - 6, 200)}
    </g>`;
  }
  function drawBox(top, round) {
    let w = "";
    const pos = [[140, 120], [255, 120], [140, 195], [255, 195]];
    pos.forEach(([x, y], i) => {
      w += round ? roundWaffle(x, y, 46) : squareWaffle(x, y, 88);
      const t = ["chocolate", "sugar", "caramel", "chocolate"][i];
      w += `<g transform="scale(1)">${topping(t, x, y - 4, 90)}</g>`;
    });
    return `<g>
      <rect x="86" y="78" width="228" height="150" rx="14" fill="#E8546A"/>
      <rect x="92" y="84" width="216" height="138" rx="11" fill="#fff5ee"/>
      ${w}
      <rect x="86" y="78" width="228" height="150" rx="14" fill="none" stroke="#c8324a" stroke-width="4"/>
    </g>`;
  }
  function drawDrink() {
    return `<g>
      <ellipse cx="200" cy="232" rx="70" ry="14" fill="${C.plate}"/>
      <path d="M150 70 h100 l-10 150 a40 18 0 0 1 -80 0 z" fill="#fdeaa0" opacity=".95"/>
      <path d="M156 110 h88 l-8 110 a36 16 0 0 1 -72 0 z" fill="#F4C430"/>
      <rect x="150" y="60" width="100" height="16" rx="6" fill="#e9d9b0"/>
      <rect x="232" y="44" width="10" height="120" rx="5" fill="#fff" opacity=".5" transform="rotate(10 237 104)"/>
      <circle cx="180" cy="150" r="6" fill="#fff" opacity=".5"/><circle cx="215" cy="180" r="4" fill="#fff" opacity=".5"/>
      <g transform="translate(248 150)"><circle r="26" fill="#F4C430" stroke="#d9a93a" stroke-width="3"/><circle r="26" fill="#fde9a0" opacity=".4"/><path d="M0 0 L20 8 M0 0 L18 -14 M0 0 L-2 22 M0 0 L-20 6" stroke="#e6b93a" stroke-width="2"/></g>
    </g>`;
  }

  LGM.dishArt = function (item) {
    const cfg = ART[item.id] || { shape: "square", top: "sugar" };
    let body = "";
    if (cfg.shape === "square") body = drawSquare(cfg.top);
    else if (cfg.shape === "round") body = drawRound(cfg.top);
    else if (cfg.shape === "minis") body = drawMinis(cfg.top);
    else if (cfg.shape === "bowl") body = drawBowl(cfg.top);
    else if (cfg.shape === "box") body = drawBox(cfg.top, cfg.round);
    else if (cfg.shape === "drink") body = drawDrink();
    return `<svg class="dish-art" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${LGM.nm(item)}">
      <defs>
        <linearGradient id="bgc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3E3"/><stop offset="1" stop-color="#F4E2C2"/></linearGradient>
        <radialGradient id="wg" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#F0BE74"/><stop offset=".6" stop-color="#E6A95B"/><stop offset="1" stop-color="#CE8E3E"/></radialGradient>
      </defs>
      <rect width="400" height="280" fill="url(#bgc)"/>
      <circle cx="200" cy="140" r="150" fill="#fff" opacity=".25"/>
      ${body}
    </svg>`;
  };
})(window);
