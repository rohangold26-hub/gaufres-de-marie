/* =====================================================================
   Les Gaufres de Marie — client account page
   ===================================================================== */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const S = LGM.store, L = () => LGM.lang, fmt = x => LGM.fmt(x, L());
  const tx = (fr, en) => (L() === "en" ? en : fr);
  const esc = s => String(s == null ? "" : s).replace(/"/g, "&quot;");
  let authTab = "signin";

  function toast(m) { const e = $("#toast"); e.textContent = m; e.classList.add("show"); clearTimeout(e._t); e._t = setTimeout(() => e.classList.remove("show"), 2200); }

  function render() {
    LGM.applyI18n();
    $("#langBtn").textContent = LGM.t("lang.toggle");
    const c = S.currentCustomer();
    $("#accRoot").innerHTML = c ? profileHTML(c) : authHTML();
    if (c) wireProfile(c); else wireAuth();
  }

  /* ---------- auth ---------- */
  function authHTML() {
    return `
    <section class="acc-hero">
      <h1 data-i18n="acc.title">Mon compte</h1>
      <p data-i18n="acc.profileSub"></p>
    </section>
    <div class="acc-wrap"><div class="acc-card">
      <div class="auth-tabs">
        <button class="auth-tab ${authTab === "signin" ? "on" : ""}" data-tab="signin">${LGM.t("acc.signin")}</button>
        <button class="auth-tab ${authTab === "signup" ? "on" : ""}" data-tab="signup">${LGM.t("acc.signup")}</button>
      </div>
      <div class="auth-body">
        <div class="auth-pane ${authTab === "signin" ? "on" : ""}" id="paneSignin">
          <div class="field"><label>${LGM.t("acc.identifier")}</label><input id="siId" placeholder="client@demo.ci"></div>
          <div class="field"><label>${LGM.t("acc.password")}</label><input id="siPass" type="password" placeholder="••••••••"></div>
          <div class="auth-err" id="siErr"></div>
          <button class="btn btn-coral btn-block" id="siBtn">${LGM.t("acc.submitSignin")}</button>
          <div class="demo-hint">
            <b>🎬 ${LGM.t("acc.demoTitle")}</b><br>
            Email : <code>client@demo.ci</code> · ${LGM.t("acc.password")} : <code>gaufre123</code>
            <br><button class="demo-fill" id="demoFill">${L() === "en" ? "Fill demo login" : "Remplir la démo"}</button>
          </div>
          <p class="muted" style="text-align:center;margin-top:16px">${LGM.t("acc.noAccount")} <a href="#" id="toSignup" style="color:var(--coral);font-weight:600">${LGM.t("acc.signup")}</a></p>
        </div>
        <div class="auth-pane ${authTab === "signup" ? "on" : ""}" id="paneSignup">
          <div class="field"><label>${LGM.t("co.name")}</label><input id="suName" placeholder="Awa Koné"></div>
          <div class="form-row">
            <div class="field"><label>${LGM.t("acc.phoneLabel")}</label><input id="suPhone" placeholder="07 00 00 00 00"></div>
            <div class="field"><label>${LGM.t("acc.emailLabel")}</label><input id="suEmail" placeholder="awa@mail.ci"></div>
          </div>
          <div class="field"><label>${LGM.t("acc.address")}</label><input id="suAddress" placeholder="${LGM.t("acc.addressPh")}"></div>
          <div class="field"><label>${LGM.t("acc.password")}</label><input id="suPass" type="password" placeholder="••••••••"></div>
          <label class="consent"><input type="checkbox" id="suConsent"><span>${LGM.t("acc.consent")}</span></label>
          <div class="auth-err" id="suErr"></div>
          <button class="btn btn-coral btn-block" id="suBtn">${LGM.t("acc.submitSignup")}</button>
          <p class="muted" style="text-align:center;margin-top:16px">${LGM.t("acc.haveAccount")} <a href="#" id="toSignin" style="color:var(--coral);font-weight:600">${LGM.t("acc.signin")}</a></p>
        </div>
      </div>
    </div>
    <p style="text-align:center;margin-top:22px"><a href="index.html" class="muted" data-i18n="acc.backSite"></a></p>
    </div>`;
  }
  function wireAuth() {
    $$(".auth-tab").forEach(b => b.onclick = () => { authTab = b.dataset.tab; render(); });
    $("#toSignup") && ($("#toSignup").onclick = e => { e.preventDefault(); authTab = "signup"; render(); });
    $("#toSignin") && ($("#toSignin").onclick = e => { e.preventDefault(); authTab = "signin"; render(); });
    $("#demoFill") && ($("#demoFill").onclick = () => { $("#siId").value = "client@demo.ci"; $("#siPass").value = "gaufre123"; });
    $("#siBtn").onclick = () => {
      const r = S.authLogin($("#siId").value, $("#siPass").value);
      if (r.error) { $("#siErr").textContent = r.error === "badpass" ? LGM.t("acc.badPass") : LGM.t("acc.notFound"); return; }
      toast("👋 " + LGM.t("acc.greet") + " " + r.customer.name.split(" ")[0]); render(); scrollTo(0, 0);
    };
    $("#suBtn").onclick = () => {
      const name = $("#suName").value.trim(), phone = $("#suPhone").value.trim(), pass = $("#suPass").value;
      if (!name || !phone || !pass) { $("#suErr").textContent = L() === "en" ? "Name, phone & password required." : "Nom, téléphone et mot de passe requis."; return; }
      if (!$("#suConsent").checked) { $("#suErr").textContent = LGM.t("acc.consentReq"); return; }
      S.register({ name, phone, email: $("#suEmail").value.trim(), password: pass,
        address: $("#suAddress").value.trim(), consent: true });
      toast("🎉 " + (L() === "en" ? "Welcome" : "Bienvenue") + " " + name.split(" ")[0]); render(); scrollTo(0, 0);
    };
  }

  /* ---------- profile ---------- */
  function profileHTML(c) {
    const orders = S.ordersForCustomer(c.id);
    const badge = LGM.badgeFor(c.lifetimeSpend), next = LGM.nextBadge(c.lifetimeSpend);
    const prog = next ? Math.min(100, Math.round((c.lifetimeSpend - badge.min) / (next.min - badge.min) * 100)) : 100;
    const favs = (c.favItems || []).map(id => LGM.menu.find(m => m.id === id)).filter(Boolean).slice(0, 6);
    return `
    <section class="acc-hero">
      <h1>${LGM.t("acc.welcome")}, ${c.name.split(" ")[0]} 👋</h1>
      <p data-i18n="acc.profileSub"></p>
    </section>
    <div class="acc-wrap"><div class="acc-card">
      <div class="profile-head">
        <div class="pbadge" style="background:${badge.color}">${badge.emoji}</div>
        <div class="pwho"><b>${c.name}</b>
          <span class="tier" style="color:${badge.color}">${badge.emoji} ${LGM.nm(badge)} ${L() === "en" ? "member" : "membre"}</span>
          <small>${LGM.t("acc.memberSince")} ${new Date(c.createdAt).toLocaleDateString(L() === "en" ? "en-GB" : "fr-FR", { month: "long", year: "numeric" })}</small>
        </div>
      </div>
      <div class="profile-grid">
        <div class="pstats">
          <div class="pstat"><div class="n">${fmt(c.lifetimeSpend)}</div><div class="l">${LGM.t("acc.lifetime")}</div></div>
          <div class="pstat"><div class="n">${c.ordersCount}</div><div class="l">${LGM.t("acc.ordersCount")}</div></div>
          <div class="pstat"><div class="n">${LGM.points(c.lifetimeSpend)}</div><div class="l">${LGM.t("acc.pts")}</div></div>
        </div>
        ${next ? `<div class="muted">${LGM.t("acc.next")} : <b style="color:${next.color}">${next.emoji} ${LGM.nm(next)}</b> · ${LGM.t("acc.toNext", { n: fmt(next.min - c.lifetimeSpend) })}</div>
          <div class="progress" style="margin-top:8px"><i style="width:${prog}%"></i></div>` : `<div class="muted">🏆 ${L() === "en" ? "Top tier unlocked!" : "Palier maximum atteint !"}</div>`}
        <div class="badge-track" style="margin-top:14px">${LGM.badges.map(b => `<div class="bt ${c.lifetimeSpend >= b.min ? "on" : ""}"><span class="e">${b.emoji}</span>${LGM.nm(b)}</div>`).join("")}</div>

        ${infoHTML(c)}

        ${walletHTML(c)}

        ${surveysHTML(c)}

        ${(() => { const act = orders.find(o => !["completed", "cancelled"].includes(o.status)); return act ? `
          <div class="psection-title">📦 ${L() === "en" ? "Track your order" : "Suivi de votre commande"} <span class="muted" style="font-weight:400">${act.ref}</span></div>
          <div class="track-card">${LGM.trackerHTML(act, L())}
            ${act.paymentMode === "twostage" && !act.settlement ? `<div style="margin-top:12px;padding:10px 12px;border:1px dashed rgba(217,154,78,.5);background:rgba(217,154,78,.1);border-radius:12px;font-size:.85rem;color:var(--chocolate-2);display:flex;justify-content:space-between;gap:10px"><span>🤝 ${tx("Acompte payé", "Deposit paid")} <b>${fmt(act.deposit.amount)}</b></span><span>${tx("Solde à la livraison", "Balance on delivery")} <b style="color:var(--coral)">${fmt(act.total - act.deposit.amount)}</b></span></div>` : ""}
            ${act.type === "delivery" && !["completed", "cancelled"].includes(act.status) ? `<button class="btn yango-launch" id="yangoLaunch" style="margin-top:12px;width:100%;background:#FF3300;color:#fff;border:0">🚕 ${tx("Lancer la livraison", "Launch delivery")}</button>` : ""}
            ${act.status === "pending" ? `<button class="btn btn-ghost cancel-order" data-cancel="${act.id}" style="margin-top:12px;width:100%;color:var(--coral);border-color:rgba(232,57,74,.4)">✖ ${L() === "en" ? "Cancel order" : "Annuler la commande"}</button>
              <p class="muted" style="text-align:center;font-size:.78rem;margin-top:6px">${L() === "en" ? "You can cancel only before the order is accepted." : "Vous pouvez annuler uniquement avant l'acceptation."}</p>` : ""}
          </div>` : ""; })()}

        <div class="psection-title">⭐ ${LGM.t("acc.fav")}</div>
        ${favs.length ? `<div class="fav-row">${favs.map(f => `<span class="fav-chip">${f.img ? `<img src="${f.img}" alt="">` : ""}${LGM.nm(f)}</span>`).join("")}</div>` : `<p class="muted">${LGM.t("acc.favEmpty")}</p>`}

        <div class="psection-title">🧾 ${LGM.t("acc.history")}</div>
        <div class="order-hist">${orders.length ? orders.map(o => {
          const st = LGM.statusMeta(o.status);
          const depNote = o.paymentMode === "twostage" && !o.settlement
            ? ` · 🤝 ${tx("solde", "balance")} <b style="color:var(--coral)">${fmt(o.total - ((o.deposit && o.deposit.amount) || 0))}</b> ${tx("à la livraison", "on delivery")}` : "";
          const plannedNote = o.fulfilMode === "planned" && o.plannedAt
            ? ` · <b style="color:#6a3fd6">📅 ${new Date(o.plannedAt).toLocaleDateString(L() === "en" ? "en-GB" : "fr-FR", { day: "2-digit", month: "short" })} ${o.plannedSlot || ""}</b>` : "";
          return `<div class="hist-row"><div><div class="hr-ref">${o.ref}</div>
            <div class="hr-meta">${new Date(o.createdAt).toLocaleDateString(L() === "en" ? "en-GB" : "fr-FR")} · ${o.items.map(i => i.qty + "× " + (L() === "en" ? (LGM.menu.find(m => m.id === i.id)?.en || i.name) : i.name)).join(", ")} · ${fmt(o.total)}${plannedNote}${depNote}</div></div>
            <span class="status-pill" style="background:${st.color}">${LGM.nm(st)}</span></div>`;
        }).join("") : `<p class="muted">${LGM.t("acc.none")}</p>`}</div>

        <div class="profile-actions">
          <a href="index.html#menu" class="btn btn-coral">${LGM.t("acc.order")}</a>
          <button class="btn btn-ghost" id="logoutBtn" style="color:var(--chocolate);border-color:rgba(58,26,6,.25)">${LGM.t("acc.logout")}</button>
        </div>
      </div>
    </div></div>`;
  }
  // ---- my details (name, phone, email, delivery address) — auto-filled at checkout ----
  function infoHTML(c) {
    const addr = c.address || [c.quartier, c.commune].filter(Boolean).join(", ") || "";
    return `<div class="info-block">
      <div class="psection-title">👤 ${LGM.t("acc.myInfo")}</div>
      <div class="info-grid">
        <div class="field"><label>${LGM.t("co.name")}</label><input id="inName" value="${esc(c.name)}"></div>
        <div class="field"><label>${LGM.t("acc.phoneLabel")}</label><input id="inPhone" value="${esc(c.phone)}"></div>
        <div class="field"><label>${LGM.t("acc.emailLabel")}</label><input id="inEmail" value="${esc(c.email)}"></div>
        <div class="field"><label>${LGM.t("acc.address")}</label><input id="inAddress" value="${esc(addr)}"></div>
      </div>
      <button class="btn btn-ghost btn-block" id="saveInfo" style="color:var(--chocolate);border-color:rgba(58,26,6,.25);margin-top:12px">${LGM.t("acc.saveInfo")}</button>
    </div>`;
  }
  // ---- credit wallet (refund + goodwill), valid 90 days, usable on new orders ----
  function walletHTML(c) {
    const bal = S.creditBalance(c.id), entries = S.creditEntries(c.id).filter(e => !e.expired && e.remaining > 0);
    return `<div class="wallet-card ${bal > 0 ? "has" : ""}">
      <div class="wallet-top"><div><div class="wallet-l">${tx("Portefeuille crédit", "Credit wallet")}</div><div class="wallet-bal">${fmt(bal)}</div></div><div class="wallet-ic">🎁</div></div>
      ${bal > 0 ? `<div class="wallet-list">${entries.map(e => {
        const days = Math.max(0, Math.ceil((new Date(e.expiresAt).getTime() - Date.now()) / 86400000));
        return `<div class="wallet-row"><span>${e.type === "refund" ? (L() === "en" ? "Refund" : "Remboursement") : (L() === "en" ? "Goodwill" : "Geste commercial")}${e.note ? " · " + e.note : ""}</span><b>${fmt(e.remaining)}</b><small>${tx("expire dans", "expires in")} ${days} ${L() === "en" ? "d" : "j"}</small></div>`;
      }).join("")}</div>
      <p class="wallet-note">💡 ${tx("Vos crédits sont utilisables sur vos prochaines commandes, valables 90 jours à compter de leur attribution.", "Your credits can be used on your next orders, valid for 90 days from the date they are granted.")}</p>`
      : `<p class="wallet-note">${tx("Aucun crédit pour l'instant. Les remboursements et gestes commerciaux apparaîtront ici (valables 90 jours).", "No credit yet. Refunds and goodwill will appear here (valid 90 days).")}</p>`}
    </div>`;
  }

  // ---- post-order surveys (0–5 stars + comment) for completed, unrated orders ----
  function surveysHTML(c) {
    const pending = S.pendingSurveys(c.id);
    if (!pending.length) return "";
    return `<div class="survey-block">
      <div class="psection-title">⭐ ${LGM.t("survey.title")} <span class="survey-badge">${pending.length} ${LGM.t("survey.pending")}</span></div>
      ${pending.slice(0, 3).map(o => `<div class="survey-card" data-oid="${o.id}">
        <div class="survey-q">${LGM.t("survey.sub", { ref: o.ref })}</div>
        <div class="stars-input" data-rating="0">${[1, 2, 3, 4, 5].map(n => `<button type="button" class="star" data-n="${n}" aria-label="${n}">☆</button>`).join("")}</div>
        <textarea class="survey-comment" placeholder="${LGM.t("survey.comment")}"></textarea>
        <button class="btn btn-coral btn-block survey-send" disabled>${LGM.t("survey.submit")}</button>
      </div>`).join("")}
    </div>`;
  }
  function wireProfile(c) {
    $("#logoutBtn").onclick = () => { S.logout(); render(); scrollTo(0, 0); };
    $("#yangoLaunch") && ($("#yangoLaunch").onclick = LGM.openYango); // opens the delivery app on mobile if installed
    $("#saveInfo") && ($("#saveInfo").onclick = () => {
      const name = $("#inName").value.trim(), phone = $("#inPhone").value.trim();
      if (!name || !phone) return toast(tx("Nom et téléphone requis.", "Name and phone required."));
      S.updateCustomer(c.id, { name, phone, email: $("#inEmail").value.trim(), address: $("#inAddress").value.trim() });
      toast("✓ " + LGM.t("acc.infoSaved")); render();
    });
    $$(".cancel-order").forEach(b => b.onclick = () => {
      const res = S.cancelOrder(b.dataset.cancel);
      if (res.error === "too_late") toast(tx("Trop tard, déjà acceptée.", "Too late, already accepted."));
      else if (res.ok) { toast("✖ " + tx("Commande annulée", "Order cancelled")); render(); }
    });
    $$(".survey-card").forEach(card => {
      const stars = $$(".star", card); const sendBtn = $(".survey-send", card); const box = $(".stars-input", card);
      let rating = 0;
      const paint = v => stars.forEach((s, i) => { s.textContent = i < v ? "★" : "☆"; s.classList.toggle("on", i < v); });
      stars.forEach(s => {
        s.onmouseenter = () => paint(+s.dataset.n);
        s.onmouseleave = () => paint(rating);
        s.onclick = () => { rating = +s.dataset.n; box.dataset.rating = rating; paint(rating); sendBtn.disabled = false; };
      });
      sendBtn.onclick = () => {
        if (!rating) return;
        S.rateOrder(card.dataset.oid, rating, $(".survey-comment", card).value.trim());
        card.innerHTML = `<div class="survey-done">✅ ${LGM.t("survey.thanks")}</div>`;
        toast("🧡 " + LGM.t("survey.thanks"));
      };
    });
  }

  /* ---------- boot ---------- */
  $("#langBtn").onclick = () => LGM.setLang(L() === "fr" ? "en" : "fr");
  LGM.onLang(render);
  document.addEventListener("DOMContentLoaded", () => {
    S.freshenDemo(24);
    document.documentElement.lang = L();
    $("#year") && ($("#year").textContent = new Date().getFullYear());
    // footer socials
    const s = LGM.business.socials;
    const tkSvg = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="vertical-align:-2px"><path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.2v12.86a2.58 2.58 0 0 1-2.58 2.4 2.58 2.58 0 0 1-2.35-3.64 2.58 2.58 0 0 1 3.28-1.38V9.9a5.86 5.86 0 0 0-1-.08 5.86 5.86 0 1 0 5.86 5.86V8.9a7.5 7.5 0 0 0 4.4 1.4V7.1a4.28 4.28 0 0 1-2.35-1.28Z"/></svg>`;
    $("#footSocials").innerHTML = `<a href="${s.instagram}" target="_blank" aria-label="Instagram">📸</a><a href="${s.tiktok}" target="_blank" aria-label="TikTok">${tkSvg}</a><a href="${s.whatsapp}" target="_blank" aria-label="WhatsApp">💬</a><a href="${s.yango || "https://yango-delivery.com"}" target="_blank" aria-label="Livraison">🚕</a>`;
    // clicking a notification scrolls to the tracked order
    if (LGM.mountBell) LGM.mountBell(document.getElementById("notifMount"), () => { const c = S.currentCustomer(); return c ? c.id : null; }, () => {
      const el = document.querySelector(".track-card") || document.querySelector(".order-hist");
      if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); el.classList.add("row-flash"); setTimeout(() => el.classList.remove("row-flash"), 2200); }
    });
    render();
    // real-time refresh so the credit wallet / orders reflect checkout actions instantly.
    // skip while the user is typing (e.g. a survey) to avoid wiping their input.
    const liveRefresh = () => {
      const ae = document.activeElement, typing = ae && /INPUT|TEXTAREA/.test(ae.tagName);
      if (!typing && S.currentCustomer()) render();
    };
    // cross-tab: credit spent at checkout in another tab updates the balance here at once
    window.addEventListener("storage", e => { if (!e.key || e.key === "lgm_db_v9") liveRefresh(); });
    // returning to this tab (after ordering) re-reads the store — covers back-nav / bfcache
    window.addEventListener("pageshow", liveRefresh);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) liveRefresh(); });
    // periodic safety net (kept lightweight; refreshes the wallet even with no active order)
    setInterval(liveRefresh, 8000);
  });
})();
