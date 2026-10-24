/* =====================================================================
   Les Gaufres de Marie — customer site logic
   ===================================================================== */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const S = LGM.store;
  const L = () => LGM.lang;
  const fmt = x => LGM.fmt(x, L());

  // ---------- cart state ----------
  let cart = JSON.parse(localStorage.getItem("lgm_cart") || "[]");
  const saveCart = () => localStorage.setItem("lgm_cart", JSON.stringify(cart));
  const cartTotal = () => cart.reduce((s, l) => s + l.price * l.qty, 0);
  const cartCount = () => cart.reduce((s, l) => s + l.qty, 0);

  function addToCart(id) {
    const it = LGM.menu.find(m => m.id === id); if (!it) return;
    const line = cart.find(l => l.id === id);
    if (line) line.qty++; else cart.push({ id, name: it.fr, en: it.en, price: it.price, qty: 1 });
    saveCart(); renderCart(); bumpCart(); toast(LGM.t("menu.added"));
  }
  function setQty(id, d) {
    const line = cart.find(l => l.id === id); if (!line) return;
    line.qty += d; if (line.qty <= 0) cart = cart.filter(l => l.id !== id);
    saveCart(); renderCart();
  }
  function clearCart() { cart = []; saveCart(); renderCart(); }

  // ---------- toast ----------
  let toastT;
  function toast(msg) {
    let el = $("#toast"); if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast"; document.body.appendChild(el); }
    el.textContent = msg; el.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("show"), 2200);
  }
  function bumpCart() { const b = $("#cartCount"); if (b) { b.style.transform = "scale(1.4)"; setTimeout(() => b.style.transform = "", 180); } }

  // ---------- render menu ----------
  function renderMenu() {
    const wrap = $("#menuWrap"); if (!wrap) return;
    const tabs = $("#catTabs");
    tabs.innerHTML = `<button class="cat-tab active" data-cat="all">${L() === "en" ? "All" : "Tout"}</button>` +
      LGM.categories.map(c => `<button class="cat-tab" data-cat="${c.id}">${c.icon} ${LGM.nm(c)}</button>`).join("");
    wrap.innerHTML = LGM.categories.map(c => {
      const dishes = LGM.menu.filter(m => m.cat === c.id);
      if (!dishes.length) return "";
      return `<div class="menu-cat" data-cat="${c.id}">
        <h3 class="cat-title">${c.icon} ${LGM.nm(c)}</h3>
        <div class="cat-desc">${LGM.desc(c)}</div>
        <div class="menu-grid">${dishes.map(dishCard).join("")}</div></div>`;
    }).join("");
    $$(".dish .add", wrap).forEach(b => b.addEventListener("click", () => {
      addToCart(b.dataset.id); b.classList.add("added"); b.innerHTML = LGM.t("menu.added");
      setTimeout(() => { b.classList.remove("added"); b.innerHTML = "➕ " + LGM.t("menu.add"); }, 1200);
    }));
    $$(".cat-tab", tabs).forEach(t => t.addEventListener("click", () => {
      $$(".cat-tab", tabs).forEach(x => x.classList.remove("active")); t.classList.add("active");
      const cat = t.dataset.cat;
      $$(".menu-cat", wrap).forEach(mc => mc.style.display = (cat === "all" || mc.dataset.cat === cat) ? "" : "none");
    }));
  }
  function dishCard(d) {
    const avail = S.isAvailable(d.id);
    const st = S.stockFor(d.id);
    const low = avail && st && st.qty <= (st.threshold || 10);
    const photo = (S.settings().menuImages || {})[d.id];
    const visual = photo ? `<img src="${photo}" alt="${LGM.nm(d)}" loading="lazy" style="width:100%;height:100%;object-fit:cover">` : LGM.dishArt(d);
    return `<div class="dish ${avail ? "" : "soldout"}">
      <div class="dish-img">${visual}
        <span class="price-tag">${fmt(d.price)}</span>
        ${!avail ? `<span class="stock-badge so">${LGM.t("menu.soldout")}</span>` : low ? `<span class="stock-badge low">${LGM.t("menu.low")}</span>` : ""}
      </div>
      <div class="dish-body">
        <div class="dish-top"><h4>${LGM.nm(d)}</h4></div>
        <p>${LGM.desc(d)}</p>
        ${d.priceEstimated ? `<span class="est">${LGM.t("menu.estimated")}</span>` : ""}
        <button class="add" data-id="${d.id}" ${avail ? "" : "disabled"}>${avail ? "➕ " + LGM.t("menu.add") : LGM.t("menu.soldout")}</button>
      </div></div>`;
  }

  // ---------- render cart (order section) ----------
  function renderCart() {
    const lines = $("#cartLines"), tot = $("#cartTotals");
    $$("#cartCount").forEach(b => { b.textContent = cartCount(); b.style.display = cartCount() ? "grid" : "none"; });
    if (!lines) return;
    if (!cart.length) {
      lines.innerHTML = `<div class="cart-empty">${LGM.t("cart.empty")}</div>`;
      tot.innerHTML = ""; return;
    }
    lines.innerHTML = cart.map(l => `<div class="cart-line">
      <div class="cl-name">${L() === "en" ? l.en : l.name}<small>${fmt(l.price)}</small></div>
      <div class="qtybox"><button data-m="${l.id}">−</button><span>${l.qty}</span><button data-p="${l.id}">+</button></div>
    </div>`).join("");
    tot.innerHTML = `<div class="row"><span>${LGM.t("cart.subtotal")}</span><span>${fmt(cartTotal())}</span></div>
      <div class="row total"><span>${LGM.t("cart.total")}</span><span>${fmt(cartTotal())}</span></div>`;
    $$("[data-m]", lines).forEach(b => b.onclick = () => setQty(b.dataset.m, -1));
    $$("[data-p]", lines).forEach(b => b.onclick = () => setQty(b.dataset.p, 1));
  }

  // ---------- schedule (Trouver le truck) ----------
  function renderSchedule() {
    const wrap = $("#truckLoc"); if (!wrap) return;
    const rows = S.schedule();
    wrap.innerHTML = rows.map(r => `<div class="loc-card">
      <div class="day">${LGM.day(r)}</div>
      <div class="place">${r.place}</div>
      <div class="time">${r.hours}</div>
      <div class="loc-actions">
        <a class="mini" target="_blank" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.mapsQuery || r.place)}">📍 ${LGM.t("truck.directions")}</a>
        ${r.phone ? `<a class="mini" href="tel:${r.phone.replace(/\s/g, "")}">📞 ${LGM.t("truck.call")}</a>` : ""}
      </div></div>`).join("");
    const upd = $("#truckUpdated");
    if (upd && rows[0]) { const d = new Date(rows[0].updatedAt || Date.now()); upd.textContent = LGM.t("truck.updated") + " " + d.toLocaleDateString(L() === "en" ? "en-GB" : "fr-FR"); }
  }

  // ---------- highlights (Marie's news) ----------
  function renderHighlights() {
    const grid = $("#highlightsGrid"); if (!grid) return;
    const set = S.settings();
    const title = $("#hlTitle");
    if (title) title.textContent = (L() === "en" ? set.highlightsTitleEn : set.highlightsTitleFr) || LGM.t("hl.title");
    const items = S.highlights();
    grid.innerHTML = items.map(h => `<figure class="hl-tile">
      <img src="${h.img}" alt="${(L() === "en" ? h.capEn : h.capFr) || ""}" loading="lazy">
      <figcaption>${(L() === "en" ? h.capEn : h.capFr) || ""}</figcaption></figure>`).join("");
  }

  // ---------- booking / quote ----------
  let bk = { basis: "people", people: 30, items: 0, eventType: "anniv" };
  function openBooking() { openModal($("#bookingModal")); renderBooking(); }
  function renderBooking() {
    const body = $("#bookingBody");
    body.innerHTML = `
      <div class="form-row">
        <div class="field"><label>${LGM.t("co.name")}</label><input id="bkName" placeholder="Awa Koné"></div>
        <div class="field"><label>${LGM.t("co.phone")}</label><input id="bkPhone" placeholder="07 00 00 00 00"></div>
      </div>
      <div class="form-row">
        <div class="field"><label>${LGM.t("book.type")}</label><select id="bkType">${LGM.eventTypes.map(t => `<option value="${t.id}" ${t.id === bk.eventType ? "selected" : ""}>${LGM.nm(t)}</option>`).join("")}</select></div>
        <div class="field"><label>${LGM.t("book.date")}</label><input id="bkDate" type="date"></div>
      </div>
      <div class="field"><label>${LGM.t("book.place")}</label><input id="bkPlace" placeholder="Cocody, Abidjan"></div>
      <div class="field"><label>${LGM.t("book.basis")}</label>
        <div class="seg-toggle"><button type="button" class="seg-b ${bk.basis === "people" ? "on" : ""}" data-b="people">${LGM.t("book.byPeople")}</button><button type="button" class="seg-b ${bk.basis === "items" ? "on" : ""}" data-b="items">${LGM.t("book.byItems")}</button></div>
      </div>
      <div class="field" id="bkCountField"><label id="bkCountLabel"></label><input id="bkCount" type="number" min="1" value="${bk.basis === "items" ? bk.items || 20 : bk.people}"></div>
      <div class="field"><label>${LGM.t("book.notes")}</label><textarea id="bkNotes" placeholder="${LGM.t("co.notesPh")}"></textarea></div>
      <div class="quote-box" id="bkQuote"></div>
      <button class="btn btn-coral btn-block" id="bkSend" style="margin-top:14px">${LGM.t("book.send")}</button>
      <p class="muted" style="text-align:center;margin-top:10px">${LGM.t("book.quoteNote")}</p>`;
    const sync = () => {
      $("#bkCountLabel").textContent = bk.basis === "items" ? LGM.t("book.items") : LGM.t("book.people");
      const n = +$("#bkCount").value || 0;
      if (bk.basis === "items") bk.items = n; else bk.people = n;
      bk.eventType = $("#bkType").value;
      const q = LGM.quote({ basis: bk.basis, people: bk.people, items: bk.items, eventType: bk.eventType });
      $("#bkQuote").innerHTML = `
        <div class="summary-line"><span>${bk.basis === "items" ? bk.items + " × " + LGM.t("book.byItems") : bk.people + " × " + LGM.t("book.byPeople")}</span><span>${fmt(q.base)}</span></div>
        <div class="summary-line"><span>${LGM.t("book.travel")}</span><span>${fmt(q.travel)}</span></div>
        ${q.staff ? `<div class="summary-line"><span>${LGM.t("book.staff")}</span><span>${fmt(q.staff)}</span></div>` : ""}
        ${q.eventFee ? `<div class="summary-line"><span>${LGM.t("book.eventFee")}</span><span>${fmt(q.eventFee)}</span></div>` : ""}
        <div class="summary-total"><span>${LGM.t("book.subtotal")}</span><span>${fmt(q.subtotal)}</span></div>
        <div class="summary-line" style="color:var(--coral);font-weight:700"><span>${LGM.t("book.deposit")}</span><span>${fmt(q.deposit)}</span></div>`;
    };
    $$("#bookingBody .seg-b").forEach(b => b.onclick = () => { bk.basis = b.dataset.b; renderBooking(); });
    $("#bkCount").oninput = sync; $("#bkType").onchange = sync;
    sync();
    $("#bkSend").onclick = () => {
      const name = $("#bkName").value.trim(), phone = $("#bkPhone").value.trim();
      if (!name || !phone) return toast(L() === "en" ? "Name & phone required" : "Nom & téléphone requis");
      const q = LGM.quote({ basis: bk.basis, people: bk.people, items: bk.items, eventType: bk.eventType });
      const rec = S.createBooking({ name, phone, eventType: bk.eventType, basis: bk.basis, people: bk.people, items: bk.items,
        place: $("#bkPlace").value.trim(), date: $("#bkDate").value ? new Date($("#bkDate").value).toISOString() : "", notes: $("#bkNotes").value.trim(), quote: q.subtotal });
      $("#bookingBody").innerHTML = `<div class="success-box"><div class="big">🎉</div><h4>${LGM.t("book.success")}</h4>
        <p class="muted">${LGM.t("book.successSub")}</p>
        <div class="ref">${LGM.t("book.deposit")}: ${fmt(q.deposit)}</div>
        <a class="btn btn-coral btn-block" href="${LGM.business.socials.whatsapp}" target="_blank" style="margin-top:12px">💬 WhatsApp</a>
        <button class="btn btn-ghost btn-block" id="bkDone" style="margin-top:10px;color:var(--chocolate);border-color:rgba(58,26,6,.25)">${LGM.t("co.continue")}</button></div>`;
      $("#bkDone").onclick = () => closeModal($("#bookingModal"));
    };
  }

  // ---------- Customer-service AI (knowledge base built from the live site) ----------
  const AI = {
    // find menu items mentioned in the question (used as a live product knowledge base)
    matchItems(q) {
      const norm = s => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
      const nq = norm(q);
      return LGM.menu.filter(m => {
        const words = norm(m.fr + " " + m.en).split(/[^a-z0-9]+/).filter(w => w.length > 2);
        return words.some(w => nq.includes(w));
      });
    },
    answer(qRaw) {
      const q = (qRaw || "").toLowerCase(), en = L() === "en";
      const has = (...w) => w.some(x => q.includes(x));

      // 1) specific product question (price / description) — searches the real menu
      const items = this.matchItems(q);
      if (items.length && (has("prix", "price", "coût", "cout", "combien", "cost", "how much", "c'est quoi", "what") || items.length <= 3)) {
        return items.slice(0, 4).map(m => `• ${LGM.nm(m)} — ${fmt(m.price)}\n  ${LGM.desc(m)}`).join("\n") +
          (en ? "\nAdd it to your cart from the Menu section 🛒" : "\nAjoute-le au panier depuis le Menu 🛒");
      }
      if (has("bonjour", "salut", "hello", "hi", "coucou", "hey")) return LGM.t("chat.greet");
      if (has("menu", "carte", "manger", "eat", "propose", "avez-vous", "options")) {
        const byCat = LGM.categories.map(c => `• ${c.icon} ${LGM.nm(c)}`).join("\n");
        return (en ? "Here's what we serve:\n" : "Voici ce qu'on propose :\n") + byCat + (en ? "\nAsk me the price of any item!" : "\nDemandez-moi le prix d'un produit !");
      }
      if (has("prix", "price", "coût", "cout", "combien", "cost", "tarif")) {
        const cats = LGM.categories.map(c => { const its = LGM.menu.filter(m => m.cat === c.id); const min = Math.min(...its.map(m => m.price)); return `• ${LGM.nm(c)} ${en ? "from" : "dès"} ${fmt(min)}`; }).join("\n");
        return (en ? "Prices:\n" : "Nos prix :\n") + cats;
      }
      if (has("heure", "horaire", "hour", "open", "ouvert", "ouvre", "when")) return en ? "We're open every day, 11:00–18:00 🧇" : "Ouvert tous les jours, 11h00–18h00 🧇";
      if (has("où", "ou ", "where", "adresse", "address", "emplacement", "truck", "spot", "trouver", "location", "find you")) {
        return (en ? "Where to find the truck:\n" : "Où trouver le truck :\n") + S.schedule().map(r => `• ${LGM.day(r)} : ${r.place} (${r.hours})`).join("\n");
      }
      if (has("livr", "deliver", "yango")) return en ? "We deliver to your door 🚕 — choose 'Delivery' at checkout." : "On livre à domicile 🚕 — choisissez « Livraison » au paiement.";
      if (has("pay", "paie", "wave", "orange", "momo", "mtn", "moov", "djamo", "genius", "carte", "card", "visa", "espèce", "cash")) {
        return (en ? "Accepted payments: " : "Paiements acceptés : ") + LGM.payments.map(p => LGM.nm(p)).join(", ") + ".";
      }
      if (has("crédit", "credit", "rembours", "refund", "wallet", "portefeuille", "avoir")) return en ? "Credit (refunds & goodwill) sits in your account wallet, is usable on new orders, and is valid 90 days. 🎁" : "Le crédit (remboursements & gestes commerciaux) est dans le portefeuille de votre compte, utilisable sur vos commandes, valable 90 jours. 🎁";
      if (has("suivi", "track", "statut", "status", "où en est", "ready", "prête", "prete")) return en ? "Track your order live in your account — Order received → Being prepared → Ready. You also get WhatsApp updates. 📦" : "Suivez votre commande en direct dans votre compte — Reçue → En préparation → Prête. Vous recevez aussi des notifs WhatsApp. 📦";
      if (has("annul", "cancel")) return en ? "You can cancel an order only before it's accepted, from your account. ✖️" : "Vous pouvez annuler une commande uniquement avant qu'elle soit acceptée, depuis votre compte. ✖️";
      if (has("réserv", "reserv", "devis", "book", "event", "événement", "evenement", "mariage", "anniv", "traiteur", "cater", "quote")) return en ? "You can book us for events and get an instant quote in the Events section. 🎪" : "Vous pouvez nous réserver pour un événement et obtenir un devis instantané dans la section Événements. 🎪";
      if (has("badge", "fidél", "fidel", "point", "loyal", "or", "gold", "vip")) return en ? "Earn 1 point per 100 F. Tiers: New → Bronze → Silver → Gold → VIP. 🏅" : "Gagne 1 point par 100 F. Paliers : Nouveau → Bronze → Argent → Or → VIP. 🏅";
      if (has("compte", "account", "inscri", "sign up", "register", "connect", "login")) return en ? "Create an account to track orders, earn points and see your credit — tap the 👤 icon." : "Créez un compte pour suivre vos commandes, cumuler des points et voir votre crédit — cliquez sur l'icône 👤.";
      if (has("merci", "thanks", "thank")) return en ? "With pleasure! 🧇" : "Avec plaisir ! 🧇";
      return null; // -> offer a human
    }
  };
  function initChat() {
    const root = $("#chatWidget"); if (!root) return;
    const log = $("#chatLog"), input = $("#chatInput");
    const add = (txt, who) => { const d = document.createElement("div"); d.className = "chat-msg " + who; d.textContent = txt; log.appendChild(d); log.scrollTop = log.scrollHeight; };
    const human = () => { const a = document.createElement("a"); a.className = "chat-human"; a.href = LGM.business.socials.whatsapp; a.target = "_blank"; a.textContent = "💬 " + LGM.t("chat.human"); log.appendChild(a); log.scrollTop = log.scrollHeight; };
    const chatHistory = [];
    async function send() {
      const v = input.value.trim(); if (!v) return; add(v, "me"); input.value = "";
      chatHistory.push({ role: "user", content: v });
      const typing = document.createElement("div"); typing.className = "chat-msg bot typing"; typing.textContent = "…"; log.appendChild(typing); log.scrollTop = log.scrollHeight;
      // Try the real AI backend (Claude) first; fall back to the rule engine.
      const ai = await LGM.ai.ask(v, chatHistory.slice(0, -1));
      typing.remove();
      if (ai && ai.reply) {
        add(ai.reply, "bot"); chatHistory.push({ role: "assistant", content: ai.reply });
        if (ai.handoff) human();
      } else {
        const a = AI.answer(v);
        if (a) { add(a, "bot"); chatHistory.push({ role: "assistant", content: a }); }
        else { add(L() === "en" ? "I'm not sure about that one. Let me connect you to Marie's team." : "Je ne suis pas sûr de celle-là. Je vous mets en relation avec l'équipe de Marie.", "bot"); human(); }
      }
    }
    $("#chatToggle").onclick = () => { root.classList.toggle("open"); if (root.classList.contains("open") && !log.dataset.greeted) { add(LGM.t("chat.greet"), "bot"); add(L() === "en" ? "Ask me about the menu, prices, hours, delivery, your order, credit… or talk to a human anytime 👇" : "Demandez-moi le menu, les prix, les horaires, la livraison, votre commande, votre crédit… ou parlez à un humain à tout moment 👇", "bot"); human(); log.dataset.greeted = "1"; } };
    $("#chatClose").onclick = () => root.classList.remove("open");
    $("#chatSend").onclick = send;
    input.onkeydown = e => { if (e.key === "Enter") send(); };
    input.placeholder = LGM.t("chat.ph");
    $("#chatTitleTxt").textContent = LGM.t("chat.title");
    $("#chatToggle").setAttribute("aria-label", LGM.t("chat.open"));
  }

  // ---------- account / badges ----------
  function badgeColor(id) { return (LGM.badges.find(b => b.id === id) || {}).color; }
  function renderAccount() {
    const body = $("#accountBody"); if (!body) return;
    const c = S.currentCustomer();
    if (!c) {
      body.innerHTML = `
        <p class="muted" data-i18n="acc.guestNote">${LGM.t("acc.guestNote")}</p>
        <div class="field"><label>${LGM.t("co.name")}</label><input id="regName" placeholder="Awa Koné"></div>
        <div class="form-row">
          <div class="field"><label>${LGM.t("co.phone")}</label><input id="regPhone" placeholder="07 00 00 00 00"></div>
          <div class="field"><label>${LGM.t("acc.emailLabel")}</label><input id="regEmail" placeholder="awa@mail.ci"></div>
        </div>
        <button class="btn btn-coral btn-block" id="regBtn">${LGM.t("acc.create")}</button>
        <p class="muted" style="text-align:center;margin-top:12px">${L() === "en" ? "Already a client? Just enter your phone." : "Déjà client(e) ? Entrez simplement votre téléphone."}</p>
        <button class="btn btn-ghost btn-block" id="loginBtn" style="margin-top:8px;color:var(--chocolate);border-color:rgba(58,26,6,.3)">${LGM.t("acc.login")}</button>`;
      $("#regBtn").onclick = () => {
        const name = $("#regName").value.trim(), phone = $("#regPhone").value.trim();
        if (!name || !phone) return toast(L() === "en" ? "Name & phone required" : "Nom & téléphone requis");
        S.register({ name, phone, email: $("#regEmail").value.trim() }); renderAccount(); updateAuthUI(); toast("👋 " + LGM.t("acc.welcome") + " " + name.split(" ")[0]);
      };
      $("#loginBtn").onclick = () => {
        const phone = $("#regPhone").value.trim(); const c = S.login(phone);
        if (!c) return toast(L() === "en" ? "No profile for that number" : "Aucun profil pour ce numéro");
        renderAccount(); updateAuthUI();
      };
      return;
    }
    const orders = S.ordersForCustomer(c.id);
    const badge = LGM.badgeFor(c.lifetimeSpend), next = LGM.nextBadge(c.lifetimeSpend);
    const prog = next ? Math.min(100, Math.round((c.lifetimeSpend - badge.min) / (next.min - badge.min) * 100)) : 100;
    body.innerHTML = `
      <div class="acc-head">
        <div class="acc-badge" style="background:${badge.color}">${badge.emoji}</div>
        <div class="who"><b>${LGM.t("acc.welcome")}, ${c.name.split(" ")[0]} 👋</b>
          <span class="tier" style="color:${badge.color}">${LGM.nm(badge)} ${L() === "en" ? "member" : "membre"}</span></div>
      </div>
      <div class="acc-stats">
        <div class="acc-stat"><div class="n">${fmt(c.lifetimeSpend)}</div><div class="l">${LGM.t("acc.lifetime")}</div></div>
        <div class="acc-stat"><div class="n">${c.ordersCount}</div><div class="l">${LGM.t("acc.ordersCount")}</div></div>
        <div class="acc-stat"><div class="n">${LGM.points(c.lifetimeSpend)}</div><div class="l">${LGM.t("acc.pts")}</div></div>
      </div>
      ${next ? `<div class="muted">${LGM.t("acc.next")}: <b style="color:${next.color}">${next.emoji} ${LGM.nm(next)}</b> — ${LGM.t("acc.toNext", { n: fmt(next.min - c.lifetimeSpend) })}</div>
      <div class="progress"><i style="width:${prog}%"></i></div>` : `<div class="muted">🏆 ${L() === "en" ? "Top tier unlocked!" : "Palier maximum atteint !"}</div>`}
      <div class="badge-track">${LGM.badges.map(b => `<div class="bt ${c.lifetimeSpend >= b.min ? "on" : ""}"><span class="e">${b.emoji}</span>${LGM.nm(b)}</div>`).join("")}</div>
      <h4 style="margin:20px 0 4px;color:var(--chocolate);font-family:'Playfair Display',serif">${LGM.t("acc.history")}</h4>
      <div class="order-hist">${orders.length ? orders.map(o => {
        const st = LGM.statusMeta(o.status);
        return `<div class="hist-row"><div><div class="hr-ref">${o.ref}</div>
          <div class="hr-meta">${new Date(o.createdAt).toLocaleDateString(L() === "en" ? "en-GB" : "fr-FR")} · ${o.items.reduce((s, i) => s + i.qty, 0)} ${L() === "en" ? "items" : "articles"} · ${fmt(o.total)}</div></div>
          <span class="status-pill" style="background:${st.color}">${LGM.nm(st)}</span></div>`;
      }).join("") : `<p class="muted">${LGM.t("acc.none")}</p>`}</div>
      <button class="btn btn-ghost btn-block" id="logoutBtn" style="margin-top:18px;color:var(--chocolate);border-color:rgba(58,26,6,.3)">${LGM.t("acc.logout")}</button>`;
    $("#logoutBtn").onclick = () => { S.logout(); renderAccount(); updateAuthUI(); };
  }
  function updateAuthUI() {
    const c = S.currentCustomer(); const lbl = $("#accountLabel");
    if (lbl) lbl.textContent = c ? c.name.split(" ")[0] : "";
    const badge = $("#accBadgeNav");
    if (badge) { if (c) { const b = LGM.badgeFor(c.lifetimeSpend); badge.textContent = b.emoji; badge.style.display = "inline"; } else badge.style.display = "none"; }
  }

  // ---------- slide-out drawer: cart -> checkout -> success ----------
  let coState = { payment: "wave", type: "takeaway", view: "cart", deposit: false, when: "asap", plannedDate: "", plannedSlot: "", calMonth: 0 };
  // available pickup/delivery time slots (11:00 → 18:00, every 30 min)
  const timeSlots = () => { const out = []; for (let h = 11; h <= 18; h++) { out.push((h < 10 ? "0" : "") + h + ":00"); if (h < 18) out.push((h < 10 ? "0" : "") + h + ":30"); } return out; };
  function openDrawer() { $("#cartDrawer").classList.add("open"); document.body.classList.add("overlay-open"); document.body.style.overflow = "hidden"; }
  function closeDrawer() { $("#cartDrawer").classList.remove("open"); document.body.classList.remove("overlay-open"); document.body.style.overflow = ""; }
  function openCart() { coState.view = "cart"; renderDrawer(); openDrawer(); }

  function renderDrawer() {
    if (coState.view === "cart") return renderCartView();
    if (coState.view === "checkout") return renderCheckoutView();
  }

  function renderCartView() {
    $("#drawerTitle").textContent = L() === "en" ? "Your Order" : "Votre commande";
    const body = $("#drawerBody"), foot = $("#drawerFoot");
    if (!cart.length) { body.innerHTML = `<div class="dr-empty">🛒<br>${LGM.t("cart.empty")}</div>`; foot.innerHTML = ""; return; }
    body.innerHTML = cart.map(l => `<div class="dr-line">
      <div class="nm">${L() === "en" ? l.en : l.name}</div>
      <div class="dr-qty"><button data-m="${l.id}">−</button><span>${l.qty}</span><button data-p="${l.id}">+</button></div>
      <div class="pr">${fmt(l.price * l.qty)}</div></div>`).join("");
    foot.innerHTML = `<div class="row total"><span>${LGM.t("cart.subtotal")}</span><span class="gold">${fmt(cartTotal())}</span></div>
      <button class="btn-place" id="drCheckout">${L() === "en" ? "Checkout" : "Passer au paiement"}</button>`;
    $$("[data-m]", body).forEach(b => b.onclick = () => { setQty(b.dataset.m, -1); renderCartView(); });
    $$("[data-p]", body).forEach(b => b.onclick = () => { setQty(b.dataset.p, 1); renderCartView(); });
    $("#drCheckout").onclick = () => { coState.view = "checkout"; renderCheckoutView(); };
  }

  function renderCheckoutView() {
    const c = S.currentCustomer();
    const defAddr = c ? (c.address || [c.quartier, c.commune].filter(Boolean).join(", ")) : "";
    $("#drawerTitle").textContent = L() === "en" ? "Checkout" : "Paiement";
    const body = $("#drawerBody"), foot = $("#drawerFoot");
    body.innerHTML = `
      <button class="dr-back" id="drBack">← ${L() === "en" ? "Back to order" : "Retour au panier"}</button>
      ${c ? `<div class="dr-prefill">✓ ${L() === "en" ? "Your details are pre-filled" : "Vos infos sont pré-remplies"}</div>` : ""}
      <div class="dr-section-label">${LGM.t("co.fulfilment")}</div>
      <div class="seg-pills" id="fulfilPills">${LGM.orderTypes.map(o => `<div class="seg-pill ${o.id === coState.type ? "on" : ""}" data-ful="${o.id}">${LGM.nm(o)}</div>`).join("")}</div>
      <div class="dr-field"><input id="coName" value="${c ? esc(c.name) : ""}" placeholder="${LGM.t("co.name")}"></div>
      <div class="dr-field"><input id="coPhone" value="${c ? esc(c.phone) : ""}" placeholder="${LGM.t("co.phonePay")}"><small class="dr-hint">💳 ${LGM.t("co.chargeNote")}</small></div>
      <div class="dr-field"><input id="coEmail" value="${c ? esc(c.email || "") : ""}" placeholder="${LGM.t("co.emailPh")}"></div>
      <div id="fulfilField"></div>
      <div class="dr-section-label">${LGM.t("co.when")}</div>
      <div class="seg-pills" id="whenPills">
        <div class="seg-pill ${coState.when === "asap" ? "on" : ""}" data-when="asap">⚡ ${LGM.t("co.asap")}</div>
        <div class="seg-pill ${coState.when === "planned" ? "on" : ""}" data-when="planned">📅 ${LGM.t("co.planned")}</div>
      </div>
      <div id="whenField"></div>
      ${(() => { const bal = c ? S.creditBalance(c.id) : 0; return bal > 0 ? `
      <label class="credit-apply"><input type="checkbox" id="coCredit" ${coState.applyCredit ? "checked" : ""}>
        <span>🎁 ${L() === "en" ? "Use my credit" : "Utiliser mon crédit"} (<b>${fmt(bal)}</b> ${L() === "en" ? "available" : "disponible"})</span></label>` : ""; })()}
      <div class="dr-section-label">${LGM.t("co.payment")}</div>
      <div class="pay-pills" id="payPills">${LGM.payments.map(p => `<div class="pay-pill ${p.id === coState.payment ? "on" : ""}" data-pay="${p.id}">${p.emoji} ${LGM.nm(p)}</div>`).join("")}</div>
      <div id="payField" style="margin-top:10px"></div>
      <div id="depoField" style="margin-top:10px"></div>`;
    const creditAvail = c ? S.creditBalance(c.id) : 0;
    const creditUsed = () => (coState.applyCredit && creditAvail > 0) ? Math.min(creditAvail, cartTotal()) : 0;
    const dueTotal = () => cartTotal() - creditUsed();
    // two-stage payment: deposit now (mobile money), balance on delivery
    const DEPO_PCT = 0.3;
    const isMomoPay = () => (LGM.payments.find(x => x.id === coState.payment) || {}).kind === "momo";
    const depoAmt = () => Math.max(0, Math.round(cartTotal() * DEPO_PCT / 100) * 100);
    const syncTotal = () => {
      if (LGM.isClosed()) { foot.innerHTML = `<div class="dr-closed">🧇 ${LGM.closedText(L())}</div>`; return; }
      if (coState.deposit && isMomoPay()) {
        const dep = depoAmt(), bal = cartTotal() - dep;
        foot.innerHTML = `<div class="row"><span>${LGM.t("cart.subtotal")}</span><span>${fmt(cartTotal())}</span></div>
          <div class="row" style="color:#e6c07a"><span>🤝 ${L() === "en" ? "Deposit now" : "Acompte maintenant"}</span><span>${fmt(dep)}</span></div>
          <div class="row total"><span>${L() === "en" ? "Balance on delivery" : "Solde à la livraison"}</span><span class="gold">${fmt(bal)}</span></div>
          <button class="btn-place" id="coPay">${L() === "en" ? "Pay deposit" : "Payer l'acompte"} · ${fmt(dep)}</button>`;
        $("#coPay").onclick = submitOrder;
        return;
      }
      const used = creditUsed(), due = dueTotal();
      foot.innerHTML = `<div class="row"><span>${LGM.t("cart.subtotal")}</span><span>${fmt(cartTotal())}</span></div>
        ${used ? `<div class="row" style="color:#8fbf73"><span>🎁 ${L() === "en" ? "Credit" : "Crédit"}</span><span>−${fmt(used)}</span></div>` : ""}
        <div class="row total"><span>${used ? LGM.t("co.remaining") : LGM.t("cart.total")}</span><span class="gold">${fmt(due)}</span></div>
        ${used && due > 0 ? `<div class="dr-hint" style="margin:0 0 8px">💳 ${L() === "en" ? "Your credit doesn't cover the full amount — pay the difference below." : "Votre crédit ne couvre pas tout — réglez la différence ci-dessous."}</div>` : ""}
        <button class="btn-place" id="coPay">${due > 0 ? (L() === "en" ? "Pay" : "Payer") + " · " + fmt(due) : (L() === "en" ? "Place order" : "Commander")}</button>`;
      $("#coPay").onclick = submitOrder;
    };
    // deposit toggle — only meaningful for mobile-money payment
    const syncDepo = () => {
      const box = $("#depoField"); if (!box) return;
      if (!isMomoPay()) { coState.deposit = false; box.innerHTML = ""; return; }
      const on = coState.deposit;
      box.innerHTML = `<label class="credit-apply"><input type="checkbox" id="coDepo" ${on ? "checked" : ""}>
          <span>🤝 ${L() === "en" ? "Pay a deposit now, balance on delivery" : "Payer un acompte maintenant, solde à la livraison"}</span></label>
        ${on ? `<div class="pay-note" style="color:#cdb6a2">${L() === "en" ? "Deposit" : "Acompte"} (${Math.round(DEPO_PCT * 100)}%): <b>${fmt(depoAmt())}</b> · ${L() === "en" ? "Balance on delivery" : "Solde à la livraison"}: <b>${fmt(cartTotal() - depoAmt())}</b></div>` : ""}`;
      const cd = $("#coDepo"); if (cd) cd.onchange = () => {
        coState.deposit = cd.checked;
        if (coState.deposit) { coState.applyCredit = false; const cc2 = $("#coCredit"); if (cc2) cc2.checked = false; }
        syncDepo(); syncTotal();
      };
    };
    const syncFulfil = () => {
      const f = LGM.fulfilmentMeta(coState.type);
      $("#fulfilField").innerHTML = f.id === "delivery"
        ? `<div class="dr-field"><label>${LGM.t("co.address")}</label><input id="coAddr" value="${esc(defAddr)}" placeholder="${L() === "en" ? "Neighbourhood, commune, landmark" : "Quartier, commune, repère"}"></div>`
        : `<div class="dr-field"><label>${LGM.t("co.location")}</label><select id="coLoc">${S.schedule().map(s => `<option>${esc(s.place)}</option>`).join("")}</select></div>`;
    };
    const syncPay = () => {
      const p = LGM.payments.find(x => x.id === coState.payment);
      $("#payField").innerHTML = p.kind === "momo" ? `<div class="pay-note" style="color:#cdb6a2">💳 ${LGM.t("co.chargeNote")}</div>`
        : p.id === "geniuspay" ? `<div class="pay-note" style="background:rgba(108,43,217,.15);border-color:rgba(108,43,217,.4);color:#cdb6ff">🧞 ${LGM.t("co.cardNote")}</div>`
        : p.id === "djamo" ? `<div class="pay-note" style="color:#cdb6a2">🔷 ${LGM.t("co.djamoNote")}</div>`
        : p.kind === "card" ? `<div class="pay-note" style="color:#cdb6a2">🔒 ${LGM.t("co.cardNote")}</div>`
        : `<div class="pay-note" style="color:#cdb6a2">💵 ${LGM.t("co.cashNote")}</div>`;
    };
    // scheduled orders: pick a date on a real calendar + a tappable time-slot grid
    const isoDate = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const syncWhen = () => {
      const box = $("#whenField"); if (!box) return;
      if (coState.when !== "planned") { box.innerHTML = ""; return; }
      const loc = L() === "en" ? "en-GB" : "fr-FR";
      const slots = timeSlots();
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const maxDate = new Date(today); maxDate.setDate(maxDate.getDate() + 45); // ~6-week booking horizon
      if (!coState.plannedDate) coState.plannedDate = isoDate(today);
      if (!coState.plannedSlot) coState.plannedSlot = slots[0];
      const drawCal = () => {
        const base = new Date(today.getFullYear(), today.getMonth() + (coState.calMonth || 0), 1);
        const monthName = base.toLocaleDateString(loc, { month: "long", year: "numeric" });
        const firstDow = (base.getDay() + 6) % 7; // Monday-first
        const dim = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
        const dow = (L() === "en" ? ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] : ["L", "Ma", "Me", "J", "V", "S", "D"]);
        let cells = "";
        for (let i = 0; i < firstDow; i++) cells += `<span class="cal-cell empty"></span>`;
        for (let d = 1; d <= dim; d++) {
          const date = new Date(base.getFullYear(), base.getMonth(), d), iso = isoDate(date);
          const disabled = date < today || date > maxDate;
          cells += `<button type="button" class="cal-cell${iso === coState.plannedDate ? " sel" : ""}${date.getTime() === today.getTime() ? " today" : ""}" data-date="${iso}" ${disabled ? "disabled" : ""}>${d}</button>`;
        }
        const canPrev = (coState.calMonth || 0) > 0;
        const canNext = new Date(base.getFullYear(), base.getMonth() + 1, 1) <= maxDate;
        box.innerHTML = `
          <div class="cal">
            <div class="cal-head">
              <button type="button" class="cal-nav" id="calPrev" ${canPrev ? "" : "disabled"} aria-label="prev">‹</button>
              <b>${monthName}</b>
              <button type="button" class="cal-nav" id="calNext" ${canNext ? "" : "disabled"} aria-label="next">›</button>
            </div>
            <div class="cal-dow">${dow.map(x => `<span>${x}</span>`).join("")}</div>
            <div class="cal-grid">${cells}</div>
          </div>
          <div class="dr-section-label" style="margin-top:14px">${LGM.t("co.slot")}</div>
          <div class="slot-grid">${slots.map(s => `<button type="button" class="slot${coState.plannedSlot === s ? " sel" : ""}" data-slot="${s}">${s}</button>`).join("")}</div>`;
        $("#calPrev") && ($("#calPrev").onclick = () => { coState.calMonth = (coState.calMonth || 0) - 1; drawCal(); });
        $("#calNext") && ($("#calNext").onclick = () => { coState.calMonth = (coState.calMonth || 0) + 1; drawCal(); });
        $$(".cal-cell[data-date]", box).forEach(b => b.onclick = () => { if (b.disabled) return; coState.plannedDate = b.dataset.date; drawCal(); });
        $$(".slot", box).forEach(b => b.onclick = () => { coState.plannedSlot = b.dataset.slot; $$(".slot", box).forEach(x => x.classList.toggle("sel", x === b)); });
      };
      drawCal();
    };
    const cc = $("#coCredit"); if (cc) cc.onchange = () => { coState.applyCredit = cc.checked; if (cc.checked) coState.deposit = false; syncDepo(); syncTotal(); };
    syncTotal();
    $("#drBack").onclick = () => { coState.view = "cart"; renderCartView(); };
    $$("#fulfilPills .seg-pill").forEach(o => o.onclick = () => { coState.type = o.dataset.ful; $$("#fulfilPills .seg-pill").forEach(x => x.classList.toggle("on", x === o)); syncFulfil(); });
    $$("#whenPills .seg-pill").forEach(o => o.onclick = () => { coState.when = o.dataset.when; if (o.dataset.when === "planned") coState.calMonth = 0; $$("#whenPills .seg-pill").forEach(x => x.classList.toggle("on", x === o)); syncWhen(); });
    $$("#payPills .pay-pill").forEach(o => o.onclick = () => { coState.payment = o.dataset.pay; $$("#payPills .pay-pill").forEach(x => x.classList.toggle("on", x === o)); syncPay(); syncDepo(); syncTotal(); });
    syncFulfil(); syncPay(); syncDepo(); syncWhen();
    $("#coPay").onclick = submitOrder;
  }
  const esc = s => String(s == null ? "" : s).replace(/"/g, "&quot;");

  async function submitOrder() {
    if (LGM.isClosed()) return toast(LGM.closedText(L())); // ordering paused (idle time)
    const name = $("#coName").value.trim(), phone = $("#coPhone").value.trim();
    if (!name) return toast(L() === "en" ? "Your name is required" : "Votre nom est requis");
    // the phone is the number the customer will be charged on — mandatory
    if (!phone) return toast(LGM.t("co.needPhone"));
    const email = ($("#coEmail") ? $("#coEmail").value.trim() : "") || (S.currentCustomer() || {}).email || "";
    const isDelivery = coState.type === "delivery";
    const address = isDelivery ? ($("#coAddr") ? $("#coAddr").value.trim() : "") : "";
    if (isDelivery && !address) return toast(L() === "en" ? "Delivery address required" : "Adresse de livraison requise");
    // scheduled (planned) order timing
    const fulfilMode = coState.when === "planned" ? "planned" : "asap";
    let plannedAt = "", plannedSlot = "";
    if (fulfilMode === "planned" && coState.plannedDate && coState.plannedSlot) {
      plannedSlot = coState.plannedSlot;
      plannedAt = new Date(coState.plannedDate + "T" + coState.plannedSlot + ":00").toISOString();
    }
    const btn = $("#coPay"); btn.disabled = true; btn.textContent = "⏳ …";
    const cust = S.currentCustomer();
    const items = cart.map(l => ({ id: l.id, name: l.name, price: l.price, qty: l.qty }));
    const location = isDelivery ? "" : (($("#coLoc") || {}).value || "");
    const isMomoPay = (LGM.payments.find(x => x.id === coState.payment) || {}).kind === "momo";
    const twoStage = coState.deposit && isMomoPay;
    const common = { customerName: name, customerPhone: phone, customerEmail: email, items, total: cartTotal(), type: coState.type, location, address, fulfilMode, plannedAt, plannedSlot, notes: "" };
    let order;
    if (twoStage) {
      // two-stage: charge the deposit now on the customer's phone, balance collected on delivery
      const dep = Math.max(0, Math.round(cartTotal() * 0.3 / 100) * 100);
      await S.api.createPayment({ payment: coState.payment, amount: dep, phone });
      order = S.createOrder(Object.assign({}, common, { payment: coState.payment, paymentMode: "twostage", deposit: { amount: dep, method: coState.payment }, balanceMethod: "cash", amountPaid: dep }));
    } else {
      // apply store credit, then charge the remaining difference on the customer's phone
      const bal = cust ? S.creditBalance(cust.id) : 0;
      const creditToUse = (coState.applyCredit && bal > 0) ? Math.min(bal, cartTotal()) : 0;
      const due = cartTotal() - creditToUse;
      if (due > 0) await S.api.createPayment({ payment: coState.payment, amount: due, phone });
      if (creditToUse && cust) S.useCredit(cust.id, creditToUse);
      order = S.createOrder(Object.assign({}, common, { creditUsed: creditToUse, amountPaid: due, payment: coState.payment, paymentStatus: (due > 0 && coState.payment === "cash") ? "pending" : "paid" }));
    }
    coState.applyCredit = false; coState.deposit = false; coState.when = "asap";
    if (!S.currentCustomer()) S.login(phone);
    // keep the account profile complete (name, phone, email, delivery address)
    const acc = S.currentCustomer();
    if (acc) { const patch = {}; if (email && email !== acc.email) patch.email = email; if (isDelivery && address && address !== acc.address) patch.address = address; if (name && !acc.name) patch.name = name; if (Object.keys(patch).length) S.updateCustomer(acc.id, patch); }
    clearCart(); updateAuthUI();
    // automatic order-confirmation WhatsApp (server auto-sends via Twilio in prod; demo = pre-filled send)
    const waUrl = LGM.waLink(phone, LGM.waMessage(order, "confirmation", L()));
    const deliveryUrl = LGM.business.socials.yango || "https://yango-delivery.com";
    $("#drawerTitle").textContent = LGM.t("co.success");
    $("#drawerBody").innerHTML = `<div class="success-box" style="color:var(--cream)">
      <div class="big">🧇</div><h4 style="color:var(--cream)">${LGM.t("co.success")}</h4>
      <p style="color:#cdb6a2">${LGM.t("co.successSub")}</p>
      <div class="ref">${LGM.t("co.ref")}: ${order.ref}</div>
      ${order.fulfilMode === "planned" && order.plannedAt ? `<div class="ref" style="margin-top:8px;background:rgba(123,92,255,.16);border-color:rgba(123,92,255,.4)">📅 ${L() === "en" ? "Scheduled for" : "Prévue pour"} ${new Date(order.plannedAt).toLocaleDateString(L() === "en" ? "en-GB" : "fr-FR", { weekday: "long", day: "2-digit", month: "long" })} · ${order.plannedSlot}</div>` : ""}
      ${order.paymentMode === "twostage" ? `<div class="ref" style="margin-top:8px;background:rgba(230,192,122,.14);border-color:rgba(230,192,122,.4)">🤝 ${L() === "en" ? "Deposit paid" : "Acompte payé"}: ${fmt(order.deposit.amount)} · ${L() === "en" ? "Balance on delivery" : "Solde à la livraison"}: ${fmt(order.total - order.deposit.amount)}</div>` : ""}
      <div style="margin:18px 0 6px;text-align:left">${LGM.trackerHTML(order, L())}</div>
      <div class="success-actions">
        <a class="btn-place" href="${waUrl}" target="_blank" rel="noopener">💬 ${LGM.t("co.waConfirm")}</a>
        ${isDelivery ? `<a class="btn-place btn-delivery" id="deliveryLaunch" href="${deliveryUrl}" target="_blank" rel="noopener">🚕 ${L() === "en" ? "Launch delivery" : "Lancer la livraison"}</a>` : ""}
        <a class="success-track" href="account.html">${L() === "en" ? "Track in my account →" : "Suivre dans mon compte →"}</a>
      </div>
    </div>`;
    $("#drawerFoot").innerHTML = `<button class="btn-place" id="coDone" style="background:rgba(255,248,240,.1);color:var(--cream)">${LGM.t("co.continue")}</button>`;
    $("#coDone").onclick = closeDrawer;
    $("#deliveryLaunch") && ($("#deliveryLaunch").onclick = LGM.openYango); // open the delivery app on mobile if installed
  }

  // ---------- modals (booking still uses a centered modal) ----------
  function openModal(m) { m.classList.add("open"); document.body.classList.add("overlay-open"); document.body.style.overflow = "hidden"; }
  function closeModal(m) { m.classList.remove("open"); document.body.classList.remove("overlay-open"); document.body.style.overflow = ""; }
  $$(".modal-backdrop").forEach(bd => { bd.addEventListener("click", e => { if (e.target === bd) closeModal(bd); }); });
  $$(".modal-close").forEach(b => b.addEventListener("click", () => closeModal(b.closest(".modal-backdrop"))));
  document.addEventListener("DOMContentLoaded", () => {
    $("#drawerClose") && ($("#drawerClose").onclick = closeDrawer);
    $("#cartDrawer") && $("#cartDrawer").addEventListener("click", e => { if (e.target.id === "cartDrawer") closeDrawer(); });
  });

  // ---------- nav / misc ----------
  function initNav() {
    const nav = $("#nav");
    addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 40));
    const toggle = $("#navToggle"), menu = $("#navMenu");
    const closeMenu = () => { toggle.classList.remove("open"); menu.classList.remove("open"); };
    toggle.onclick = e => { e.stopPropagation(); toggle.classList.toggle("open"); menu.classList.toggle("open"); };
    $$("a.link", menu).forEach(a => a.onclick = closeMenu);
    // tap anywhere outside the open menu (the main screen) closes it
    document.addEventListener("click", e => { if (menu.classList.contains("open") && !menu.contains(e.target) && !toggle.contains(e.target)) closeMenu(); });
    $("#cartBtn").onclick = openCart;
    $("#langBtn").onclick = () => { LGM.setLang(L() === "fr" ? "en" : "fr"); closeMenu(); };
    $$("#checkoutBtn,#checkoutBtn2").forEach(b => b && (b.onclick = openCart));
    $$("#bookBtn,#bookBtn2").forEach(b => b && (b.onclick = openBooking));
    const cb = $("#clearCartBtn"); if (cb) cb.onclick = clearCart;
    // clicking a notification takes the client to their account to track the order
    if (LGM.mountBell) LGM.mountBell($("#notifMount"), () => { const c = S.currentCustomer(); return c ? c.id : null; }, () => { location.href = "account.html"; });
    renderClosedBanner();
    // reflect open/closed changes made by Marie in the admin (cross-tab + periodic)
    window.addEventListener("storage", e => { if (!e.key || e.key === "lgm_db_v9") renderClosedBanner(); });
    setInterval(renderClosedBanner, 5000);
  }
  // idle-time banner: shown at the very top of the site while ordering is paused
  function renderClosedBanner() {
    const b = document.getElementById("closedBanner"); if (!b) return;
    if (LGM.isClosed()) { b.textContent = "🧇 " + LGM.closedText(L()); b.hidden = false; document.body.classList.add("has-closed-banner"); }
    else { b.hidden = true; document.body.classList.remove("has-closed-banner"); }
  }

  // ---------- language re-render ----------
  LGM.onLang(() => { renderMenu(); renderCart(); renderSchedule(); renderHighlights(); LGM.applyI18n(); $("#langBtn").textContent = LGM.t("lang.toggle"); updateAuthUI(); renderClosedBanner(); const ci = $("#chatInput"); if (ci) { ci.placeholder = LGM.t("chat.ph"); $("#chatTitleTxt").textContent = LGM.t("chat.title"); } });

  // ---------- reveal on scroll ----------
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });

  // ---------- boot ----------
  document.addEventListener("DOMContentLoaded", () => {
    S.freshenDemo(24); // keep the public demo data fresh (reseed if >24h old)
    document.documentElement.lang = L();
    LGM.applyI18n();
    $("#langBtn").textContent = LGM.t("lang.toggle");
    renderMenu(); renderCart(); renderSchedule(); renderHighlights(); updateAuthUI();
    initNav(); initChat();
    $$(".reveal").forEach(el => io.observe(el));
    $("#year") && ($("#year").textContent = new Date().getFullYear());
  });
})();
