/* =====================================================================
   Les Gaufres de Marie — local data store + mock API
   ---------------------------------------------------------------------
   In production this proxies to the REST backend (server/server.js).
   With no backend reachable it falls back to localStorage so the whole
   app (orders, accounts, badges, admin, dashboard) works offline/in-preview.
   ===================================================================== */
(function (root) {
  const LGM = (root.LGM = root.LGM || {});
  const KEY = "lgm_db_v9";
  const API = (root.LGM_API_BASE || ""); // set to e.g. "http://localhost:4242" to use backend

  // ---------- low level ----------
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; }
  }
  function save(db) { localStorage.setItem(KEY, JSON.stringify(db)); }
  function uid(p) { return (p || "") + Math.random().toString(36).slice(2, 9); }
  function ref() { return "LGM-" + Math.random().toString(36).slice(2, 7).toUpperCase(); }
  function todayISO(d) { return (d || new Date()).toISOString(); }

  // ---------- seed (demo data for the dashboard) ----------
  function seed() {
    const locations = ["Temple du Foot, Vallon", "L'Atelier Épicé, Mermoz", "Événement privé"];
    const items = LGM.menu;
    const firstNames = ["Awa", "Koffi", "Marie", "Yann", "Aïcha", "Ibrahim", "Fatou", "Jean", "Nadia", "Serge",
      "Mariam", "David", "Grace", "Eric", "Sandra", "Olivier", "Rachelle", "Moussa", "Lina", "Patrick"];
    const lastNames = ["Koné", "Touré", "Diallo", "Bamba", "Yao", "Coulibaly", "N'Guessan", "Traoré", "Kouassi", "Ouattara"];

    // customers
    const customers = [];
    for (let i = 0; i < 20; i++) {
      const fn = firstNames[i % firstNames.length], ln = lastNames[i % lastNames.length];
      customers.push({
        id: uid("c_"), name: fn + " " + ln,
        phone: "07 " + String(10 + i).padStart(2, "0") + " 00 00 " + String(10 + i),
        email: (fn + "." + ln).toLowerCase().replace(/[^a-z.]/g, "") + "@mail.ci",
        createdAt: todayISO(new Date(Date.now() - (90 - i) * 86400000)),
        lifetimeSpend: 0, ordersCount: 0, favItems: [], notes: "", password: null
      });
    }

    // demo client (for sign-in simulation) — fixed id + password
    const demoClient = {
      id: "c_demo", name: "Awa Koné", phone: "07 00 00 00 01", email: "client@demo.ci",
      password: "gaufre123", createdAt: todayISO(new Date(Date.now() - 120 * 86400000)),
      lifetimeSpend: 0, ordersCount: 0, favItems: ["lg-nutella", "bowl-nutban"], notes: "Cliente fidèle"
    };
    customers.unshift(demoClient);

    // orders across last 60 days
    const orders = [];
    const now = Date.now();
    let oc = 0;
    for (let d = 60; d >= 0; d--) {
      const dayLoad = 2 + Math.floor(Math.random() * 6) + (d % 7 === 0 || d % 7 === 6 ? 4 : 0); // busier weekends
      for (let k = 0; k < dayLoad; k++) {
        const cust = customers[Math.floor(Math.random() * customers.length)];
        const nLines = 1 + Math.floor(Math.random() * 3);
        const lines = [];
        for (let l = 0; l < nLines; l++) {
          const it = items[Math.floor(Math.random() * items.length)];
          const qty = 1 + Math.floor(Math.random() * 2);
          lines.push({ id: it.id, name: it.fr, price: it.price, qty });
        }
        const total = lines.reduce((s, x) => s + x.price * x.qty, 0);
        const created = new Date(now - d * 86400000 - Math.floor(Math.random() * 8) * 3600000);
        const pm = LGM.payments[Math.floor(Math.random() * 5)].id; // momo/card weighted
        const loc = locations[Math.floor(Math.random() * locations.length)];
        const rating = Math.random() < 0.7 ? (4 + (Math.random() < 0.6 ? 1 : 0)) : (3 + Math.floor(Math.random() * 2));
        orders.push({
          id: uid("o_"), ref: ref(), customerId: cust.id, customerName: cust.name, customerPhone: cust.phone,
          items: lines, total, payment: pm, paymentStatus: "paid",
          type: Math.random() < 0.75 ? "pickup" : (Math.random() < 0.5 ? "event" : "delivery"),
          location: loc, status: d === 0 ? (Math.random() < 0.5 ? "preparing" : "ready") : "completed",
          rating: d < 58 ? rating : null, createdAt: todayISO(created), notes: ""
        });
        oc++;
      }
    }
    // give the demo client a rich history (lands her in the Gold tier)
    const demoPicks = ["lg-nutella", "bowl-nutban", "brx-cbs", "box-liege", "lg-oreo", "brx-nutella", "bowl-cookie", "dr-limonade"];
    for (let i = 0; i < 13; i++) {
      const it = items.find(x => x.id === demoPicks[i % demoPicks.length]) || items[0];
      const qty = 1 + (i % 2);
      const created = new Date(now - (i * 4 + 1) * 86400000);
      orders.push({
        id: uid("o_"), ref: ref(), customerId: "c_demo", customerName: "Awa Koné", customerPhone: "07 00 00 00 01",
        items: [{ id: it.id, name: it.fr, price: it.price, qty }], total: it.price * qty,
        payment: LGM.payments[i % 4].id, paymentStatus: "paid",
        type: "pickup", location: locations[i % 2], status: i === 0 ? "ready" : "completed",
        rating: i % 3 === 0 ? 5 : 4, createdAt: todayISO(created), notes: ""
      });
    }

    // two-stage payment demo: deposit paid upfront (mobile money), balance due on delivery
    const tsPicks = ["box-liege", "bowl-nutban"];
    for (let i = 0; i < 2; i++) {
      const cust = customers[(i + 4) % customers.length];
      const it = items.find(x => x.id === tsPicks[i]) || items[0];
      const qty = 2 + i;
      const total = it.price * qty;
      const dep = Math.round(total * 0.3 / 100) * 100; // 30% deposit, rounded
      const created = new Date(now - (i + 1) * 3600000);
      orders.push({
        id: uid("o_"), ref: ref(), customerId: cust.id, customerName: cust.name, customerPhone: cust.phone,
        items: [{ id: it.id, name: it.fr, price: it.price, qty }], total,
        payment: "wave", paymentStatus: "partial", paymentMode: "twostage",
        deposit: { amount: dep, method: "wave", paidAt: todayISO(created) },
        balanceMethod: "cash", balanceDue: total - dep,
        type: i === 0 ? "delivery" : "event",
        location: i === 0 ? locations[0] : locations[2], address: i === 0 ? "Cocody, Rue des Jardins" : "",
        status: i === 0 ? "ready" : "preparing", rating: null,
        statusTimes: { pending: todayISO(created), received: todayISO(created), preparing: todayISO(created) },
        createdAt: todayISO(created), notes: ""
      });
    }

    // scheduled (planned) order demo: chosen for a future date + time slot
    {
      const cust = customers[7 % customers.length];
      const it = items.find(x => x.id === "lg-nutella") || items[0];
      const plannedDate = new Date(now + 86400000); // tomorrow
      plannedDate.setHours(14, 30, 0, 0);
      const created = new Date(now - 2 * 3600000);
      orders.push({
        id: uid("o_"), ref: ref(), customerId: cust.id, customerName: cust.name, customerPhone: cust.phone, customerEmail: cust.email,
        items: [{ id: it.id, name: it.fr, price: it.price, qty: 3 }], total: it.price * 3,
        payment: "orange", paymentStatus: "paid",
        type: "pickup", location: locations[0], address: "",
        fulfilMode: "planned", plannedAt: plannedDate.toISOString(), plannedSlot: "14:30",
        status: "received", rating: null,
        statusTimes: { pending: todayISO(created), received: todayISO(created) },
        createdAt: todayISO(created), notes: ""
      });
    }

    // recompute customer aggregates
    orders.forEach(o => {
      const c = customers.find(x => x.id === o.customerId);
      if (c && o.paymentStatus === "paid") { c.lifetimeSpend += o.total; c.ordersCount += 1; }
    });

    // stock per menu item (with a couple low to demo auto-availability)
    const stock = {};
    LGM.menu.forEach(m => { stock[m.id] = { qty: 40, threshold: 10, available: true }; });
    if (stock["lg-oreo"]) stock["lg-oreo"].qty = 4;       // low
    if (stock["min-pan-spec"]) stock["min-pan-spec"].qty = 7;

    const db = {
      version: 3,
      seededAt: Date.now(),
      customers, orders, stock, prep: {}, notifications: [],
      schedule: LGM.defaultSchedule.map(s => ({ ...s, id: uid("s_"), updatedAt: todayISO() })),
      events: [
        { id: uid("e_"), title: "Mariage privé, Cocody", date: todayISO(new Date(now + 6 * 86400000)), guests: 120, status: "confirmed" },
        { id: uid("e_"), title: "Marché de Noël, Plateau", date: todayISO(new Date(now + 20 * 86400000)), guests: 300, status: "tentative" }
      ],
      bookings: [
        { id: uid("b_"), name: "Aminata Bamba", phone: "07 88 11 22 33", eventType: "anniv",
          basis: "people", people: 35, items: 0, place: "Riviera Golf, Abidjan",
          date: todayISO(new Date(now + 12 * 86400000)), notes: "Anniversaire 30 ans, thème corail.",
          quote: 137500, status: "new", createdAt: todayISO(new Date(now - 1 * 86400000)) }
      ],
      highlights: [
        { id: uid("h_"), img: "assets/img/bowl.png", capFr: "Waffle bowl choco spéculoos", capEn: "Choco speculoos waffle bowl" },
        { id: uid("h_"), img: "assets/img/box-liege.png", capFr: "Box de Liège 🧇", capEn: "Liège box 🧇" },
        { id: uid("h_"), img: "assets/img/bruxelloise.png", capFr: "Le plateau du vendredi", capEn: "Friday sharing platter" },
        { id: uid("h_"), img: "assets/img/limonade.png", capFr: "Limonade maison 🍋", capEn: "Homemade lemonade 🍋" }
      ],
      employees: [
        { id: uid("e_"), token: "emp" + Math.random().toString(36).slice(2, 10), name: "Koffi N'Guessan", role: "Chef gaufrier",
          phone: "07 11 22 33 44", email: "koffi@equipe.ci", address: "Yopougon, Abidjan",
          contract: "cdi", startDate: todayISO(new Date(now - 540 * 86400000)), cnps: "CI-CNPS-204517", cni: "C00489213", passport: "",
          photo: null, documents: {}, status: "active",
          payHistory: [
            { id: uid("p_"), date: todayISO(new Date(now - 31 * 86400000)), amount: 180000, period: "Mois précédent", method: "wave", ref: "PAY-8841", sentAt: todayISO(new Date(now - 31 * 86400000)) },
            { id: uid("p_"), date: todayISO(new Date(now - 2 * 86400000)), amount: 180000, period: "Ce mois", method: "wave", ref: "PAY-9032", sentAt: todayISO(new Date(now - 2 * 86400000)) }
          ] },
        { id: uid("e_"), token: "emp" + Math.random().toString(36).slice(2, 10), name: "Aïcha Touré", role: "Vente & caisse",
          phone: "07 55 66 77 88", email: "aicha@equipe.ci", address: "Cocody, Abidjan",
          contract: "cdd", startDate: todayISO(new Date(now - 150 * 86400000)), cnps: "CI-CNPS-209884", cni: "C00731902", passport: "",
          photo: null, documents: {}, status: "active",
          payHistory: [{ id: uid("p_"), date: todayISO(new Date(now - 2 * 86400000)), amount: 120000, period: "Ce mois", method: "orange", ref: "PAY-9033", sentAt: todayISO(new Date(now - 2 * 86400000)) }] }
      ],
      session: null, // logged-in customer id
      settings: {
        socials: { ...LGM.business.socials },
        autoSchedule: { enabled: true, weekday: 0, note_fr: "", note_en: "" },
        payments: { wave: true, orange: true, mtn: true, moov: true, djamo: true, geniuspay: true, card: true, cash: true, cinetpay: false },
        pos: { enabled: false, provider: "", note: "" },
        aiAgent: { stock: true, chatbot: true, prep: true, autoAccept: false, autoTracker: true },
        closed: false,
        highlightsTitleFr: "Les actus de Marie", highlightsTitleEn: "Marie's highlights"
      }
    };
    save(db);
    return db;
  }

  function db() { return load() || seed(); }

  // ---------- public store API (sync, localStorage) ----------
  const Store = {
    reset() { localStorage.removeItem(KEY); return seed(); },
    // keep the public demo fresh: reseed if data is missing or older than maxHours
    freshenDemo(maxHours) {
      const d = load();
      if (!d || !d.seededAt || (Date.now() - d.seededAt) > (maxHours || 24) * 3600000) return this.reset();
      return d;
    },
    all() { return db(); },

    // ----- customers / auth -----
    customers() { return db().customers; },
    getCustomer(id) { return db().customers.find(c => c.id === id) || null; },
    findCustomerByPhone(phone) {
      const p = (phone || "").replace(/\D/g, "");
      return db().customers.find(c => (c.phone || "").replace(/\D/g, "") === p) || null;
    },
    currentCustomer() { const d = db(); return d.session ? d.customers.find(c => c.id === d.session) : null; },
    login(phone) {
      const d = db(); const c = this.findCustomerByPhone(phone);
      if (!c) return null; d.session = c.id; save(d); return c;
    },
    logout() { const d = db(); d.session = null; save(d); },
    register({ name, phone, email, password, quartier, commune, address, consent }) {
      const d = db();
      let c = this.findCustomerByPhone(phone) || (email ? d.customers.find(x => (x.email || "").toLowerCase() === email.toLowerCase()) : null);
      if (!c) {
        c = { id: uid("c_"), name, phone, email: email || "", password: password || null,
              quartier: quartier || "", commune: commune || "", address: address || "", consent: !!consent, consentAt: consent ? todayISO() : null,
              createdAt: todayISO(), lifetimeSpend: 0, ordersCount: 0, favItems: [], notes: "" };
        d.customers.push(c);
      } else {
        c.name = name || c.name; c.email = email || c.email; if (password) c.password = password;
        if (quartier) c.quartier = quartier; if (commune) c.commune = commune; if (address) c.address = address;
        if (consent) { c.consent = true; c.consentAt = todayISO(); }
      }
      d.session = c.id; save(d); return c;
    },
    // sign in with email OR phone + password. returns {customer} or {error}
    authLogin(identifier, password) {
      const d = db(); const idl = (identifier || "").trim().toLowerCase(); const idp = (identifier || "").replace(/\D/g, "");
      const c = d.customers.find(x => (x.email || "").toLowerCase() === idl || ((x.phone || "").replace(/\D/g, "") === idp && idp.length >= 6));
      if (!c) return { error: "notfound" };
      if (c.password && c.password !== password) return { error: "badpass" };
      d.session = c.id; save(d); return { customer: c };
    },
    updateCustomer(id, patch) {
      const d = db(); const c = d.customers.find(x => x.id === id); if (!c) return null;
      Object.assign(c, patch); save(d); return c;
    },

    // ----- orders -----
    orders() { return db().orders.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); },
    ordersForCustomer(id) { return this.orders().filter(o => o.customerId === id); },
    createOrder(order) {
      const d = db();
      const auto = !!(d.settings && d.settings.aiAgent && d.settings.aiAgent.autoAccept);
      const now = todayISO();
      // two-stage payment: a deposit is collected upfront (mobile money), balance on delivery.
      // such orders stay "partial" so their full value only hits revenue once settled.
      const isTwoStage = !!(order.paymentMode === "twostage" && order.deposit && +order.deposit.amount > 0);
      const o = Object.assign({
        id: uid("o_"), ref: ref(), createdAt: now, status: auto ? "received" : "pending",
        statusTimes: auto ? { pending: now, received: now } : { pending: now },
        etaMin: 0, paymentStatus: isTwoStage ? "partial" : (order.payment === "cash" ? "pending" : "paid"), rating: null
      }, order);
      if (isTwoStage) {
        const depAmt = Math.min(o.total, Math.max(0, Math.round(+order.deposit.amount) || 0));
        o.paymentMode = "twostage";
        o.deposit = { amount: depAmt, method: order.deposit.method || o.payment, paidAt: now };
        o.balanceMethod = order.balanceMethod || "cash";
        o.balanceDue = Math.max(0, o.total - depAmt);
      }
      o.etaMin = this.orderEta(o);
      d.orders.push(o);
      // attach / create customer + loyalty
      let c = order.customerId ? d.customers.find(x => x.id === order.customerId) : null;
      if (!c && order.customerPhone) c = d.customers.find(x => (x.phone || "").replace(/\D/g, "") === order.customerPhone.replace(/\D/g, ""));
      if (!c) { c = { id: uid("c_"), name: order.customerName, phone: order.customerPhone, email: order.customerEmail || "",
                      createdAt: todayISO(), lifetimeSpend: 0, ordersCount: 0, favItems: [], notes: "", password: null };
                d.customers.push(c); }
      o.customerId = c.id;
      if (o.paymentStatus === "paid") { c.lifetimeSpend += o.total; c.ordersCount += 1; }
      // track favourites
      o.items.forEach(it => { if (!c.favItems.includes(it.id)) c.favItems.push(it.id); });
      // decrement stock + auto-availability
      d.stock = d.stock || {};
      o.items.forEach(it => {
        const s = d.stock[it.id]; if (!s) return;
        s.qty = Math.max(0, s.qty - it.qty);
        if (s.qty <= 0) s.available = false;
      });
      save(d);
      // notify the admin of a new order
      this.notify({ audience: "admin", type: "new_order", ref: o.ref, orderId: o.id, customerName: o.customerName, total: o.total });
      return o;
    },
    updateOrder(id, patch) {
      const d = db(); const o = d.orders.find(x => x.id === id); if (!o) return null;
      const wasPaid = o.paymentStatus === "paid";
      const prevStatus = o.status;
      Object.assign(o, patch);
      // timestamp each status transition
      if (patch.status && patch.status !== prevStatus) {
        o.statusTimes = o.statusTimes || {}; o.statusTimes[patch.status] = todayISO();
        // when an order becomes Ready, learn the actual prep duration per item
        if (patch.status === "ready" && o.statusTimes.preparing) {
          const mins = Math.max(1, Math.round((Date.now() - new Date(o.statusTimes.preparing).getTime()) / 60000));
          if (mins <= 180) (o.items || []).forEach(it => this._recordPrep(d, it.id, mins));
        }
      }
      // completing a two-stage order consolidates the deposit + balance into one settled transaction
      if (patch.status === "completed" && o.paymentMode === "twostage" && !o.settlement) this._consolidate(d, o);
      if (!wasPaid && o.paymentStatus === "paid") {
        const c = d.customers.find(x => x.id === o.customerId);
        if (c) { c.lifetimeSpend += o.total; c.ordersCount += 1; }
      }
      save(d);
      // notify the customer of meaningful status changes
      if (patch.status && patch.status !== prevStatus && ["preparing", "ready", "completed"].includes(patch.status)) {
        this.notify({ audience: o.customerId, type: patch.status, ref: o.ref, orderId: o.id });
      }
      return o;
    },
    acceptOrder(id) { const o = this.updateOrder(id, { status: "received" }); if (o) { this.notify({ audience: o.customerId, type: "received", ref: o.ref, orderId: o.id }); } return o; },
    // client can cancel ONLY while still pending (not yet accepted)
    cancelOrder(id) {
      const d = db(); const o = d.orders.find(x => x.id === id); if (!o) return { error: "notfound" };
      if (o.status !== "pending") return { error: "too_late" };
      o.status = "cancelled"; o.statusTimes = o.statusTimes || {}; o.statusTimes.cancelled = todayISO();
      // reverse loyalty + restock
      if (o.paymentStatus === "paid") { const c = d.customers.find(x => x.id === o.customerId); if (c) { c.lifetimeSpend = Math.max(0, c.lifetimeSpend - o.total); c.ordersCount = Math.max(0, c.ordersCount - 1); } }
      d.stock = d.stock || {}; (o.items || []).forEach(it => { const s = d.stock[it.id]; if (s) { s.qty += it.qty; if (s.qty > 0) s.available = true; } });
      save(d);
      this.notify({ audience: "admin", type: "cancelled", ref: o.ref, orderId: o.id, customerName: o.customerName });
      this.notify({ audience: o.customerId, type: "cancelled", ref: o.ref, orderId: o.id });
      return { ok: true, order: o };
    },
    // ----- two-stage payment (deposit upfront + balance on delivery) -----
    // record a deposit on an existing order, turning it into a two-stage order (money held, not yet revenue)
    takeDeposit(id, amount, method) {
      const d = db(); const o = d.orders.find(x => x.id === id); if (!o) return { error: "notfound" };
      if (o.settlement) return { error: "settled" };
      if (o.paymentStatus === "paid") return { error: "already_paid" };
      const amt = Math.min(o.total, Math.max(0, Math.round(+amount) || 0));
      if (amt <= 0) return { error: "amount" };
      const now = todayISO();
      o.paymentMode = "twostage";
      o.deposit = { amount: amt, method: method || "wave", paidAt: now };
      o.balanceMethod = o.balanceMethod || "cash";
      o.balanceDue = Math.max(0, o.total - amt);
      o.paymentStatus = "partial";
      save(d);
      this.notify({ audience: "admin", type: "deposit", ref: o.ref, orderId: o.id, amount: amt });
      return { ok: true, order: o };
    },
    // merge deposit + balance into ONE transaction record on the order (no save; caller saves)
    _consolidate(d, o, balanceMethod) {
      if (o.settlement) return o;
      const now = todayISO();
      const dep = o.deposit || { amount: 0, method: null };
      const balanceAmt = Math.max(0, Math.round((o.total || 0) - (dep.amount || 0)));
      const bMethod = balanceMethod || o.balanceMethod || "cash";
      o.balance = { amount: balanceAmt, method: bMethod, paidAt: now };
      // the single consolidated transaction the finances/daily totals read from
      o.settlement = {
        total: o.total, depositAmount: dep.amount || 0, depositMethod: dep.method || null,
        balanceAmount: balanceAmt, balanceMethod: bMethod, at: now
      };
      o.paymentStatus = "paid";
      o.settledAt = now;
      o.status = "completed";
      o.statusTimes = o.statusTimes || {}; if (!o.statusTimes.completed) o.statusTimes.completed = now;
      return o;
    },
    // "Mark settled": collect the balance, consolidate, log the FULL order value to revenue
    settleOrder(id, balanceMethod) {
      const d = db(); const o = d.orders.find(x => x.id === id); if (!o) return { error: "notfound" };
      if (o.settlement) return { ok: true, order: o };
      const wasPaid = o.paymentStatus === "paid";
      this._consolidate(d, o, balanceMethod);
      if (!wasPaid) { const c = d.customers.find(x => x.id === o.customerId); if (c) { c.lifetimeSpend += o.total; c.ordersCount += 1; } }
      save(d);
      this.notify({ audience: "admin", type: "settled", ref: o.ref, orderId: o.id, total: o.total });
      this.notify({ audience: o.customerId, type: "completed", ref: o.ref, orderId: o.id });
      return { ok: true, order: o };
    },
    // deposits physically collected but not yet realized as revenue (awaiting settlement)
    depositsHeld() {
      return (db().orders || []).filter(o => o.paymentMode === "twostage" && !o.settlement && o.deposit)
        .reduce((s, o) => s + (o.deposit.amount || 0), 0);
    },
    // outstanding balances still to collect on two-stage orders
    balancesDue() {
      return (db().orders || []).filter(o => o.paymentMode === "twostage" && !o.settlement)
        .reduce((s, o) => s + Math.max(0, (o.total || 0) - ((o.deposit && o.deposit.amount) || 0)), 0);
    },
    rateOrder(id, rating, comment) { return this.updateOrder(id, { rating, comment: comment || "", ratedAt: todayISO() }); },
    pendingSurveys(customerId) { return this.ordersForCustomer(customerId).filter(o => o.status === "completed" && !o.rating); },

    // ----- notifications (synced admin <-> client, with sound on the client side) -----
    notify(n) {
      const d = db(); d.notifications = d.notifications || [];
      d.notifications.unshift(Object.assign({ id: uid("n_"), at: todayISO(), read: false }, n));
      if (d.notifications.length > 300) d.notifications = d.notifications.slice(0, 300);
      save(d); return d.notifications[0];
    },
    notifications(audience) { const list = (db().notifications || []); return audience ? list.filter(n => n.audience === audience) : list; },
    unreadCount(audience) { return this.notifications(audience).filter(n => !n.read).length; },
    markRead(audience) { const d = db(); (d.notifications || []).forEach(n => { if (n.audience === audience) n.read = true; }); save(d); },

    // ----- credit wallet (refund + goodwill), valid 90 days, usable on new purchases -----
    grantCredit(customerId, amount, type, note) {
      const d = db(); const c = d.customers.find(x => x.id === customerId); if (!c) return null;
      c.credits = c.credits || [];
      const cr = { id: uid("cr_"), amount: Math.round(+amount) || 0, type: type || "goodwill", note: note || "",
        at: todayISO(), expiresAt: new Date(Date.now() + 90 * 86400000).toISOString(), used: 0 };
      c.credits.push(cr); save(d);
      this.notify({ audience: customerId, type: "credit", amount: cr.amount, ctype: cr.type });
      return cr;
    },
    creditEntries(customerId) {
      const c = this.getCustomer(customerId); if (!c || !c.credits) return [];
      return c.credits.map(cr => ({ ...cr, remaining: Math.max(0, cr.amount - (cr.used || 0)), expired: new Date(cr.expiresAt).getTime() < Date.now() }));
    },
    creditBalance(customerId) {
      return this.creditEntries(customerId).filter(e => !e.expired).reduce((s, e) => s + e.remaining, 0);
    },
    // spend credit (oldest non-expired first); returns amount actually applied
    useCredit(customerId, amount) {
      const d = db(); const c = d.customers.find(x => x.id === customerId); if (!c || !c.credits) return 0;
      let need = Math.round(amount) || 0, applied = 0;
      c.credits.filter(cr => new Date(cr.expiresAt).getTime() >= Date.now()).sort((a, b) => new Date(a.expiresAt) - new Date(b.expiresAt))
        .forEach(cr => { if (need <= 0) return; const rem = cr.amount - (cr.used || 0); const take = Math.min(rem, need); cr.used = (cr.used || 0) + take; need -= take; applied += take; });
      save(d); return applied;
    },

    // ----- prep-time learning algorithm -----
    _prepStore() { const d = db(); d.prep = d.prep || {}; return d; },
    _recordPrep(d, itemId, minutes) {
      d.prep = d.prep || {};
      const p = d.prep[itemId] || (d.prep[itemId] = { samples: [], learned: null, manual: null, lastAdjust: null });
      p.samples.push({ at: todayISO(), min: minutes });
      if (p.samples.length > 200) p.samples = p.samples.slice(-200);
      this._maybeAdjust(p);
    },
    // readjust the learned value at most once every 14 days (averaging that window's samples)
    _maybeAdjust(p) {
      const FOURTEEN = 14 * 86400000, now = Date.now();
      if (p.lastAdjust && now - new Date(p.lastAdjust).getTime() < FOURTEEN) return;
      const since = now - FOURTEEN;
      const recent = p.samples.filter(s => new Date(s.at).getTime() >= since);
      const use = recent.length ? recent : p.samples;
      if (use.length) { p.learned = Math.round(use.reduce((a, s) => a + s.min, 0) / use.length); p.lastAdjust = todayISO(); }
    },
    // AI agent pass: refresh learned values for all items (call periodically / on dashboard load)
    runPrepAgent() {
      const d = this._prepStore(); let changed = 0;
      Object.values(d.prep).forEach(p => { const before = p.learned; this._maybeAdjust(p); if (p.learned !== before) changed++; });
      save(d); return { items: Object.keys(d.prep).length, changed };
    },
    prepInfo(itemId) {
      const d = this._prepStore(); const m = LGM.menu.find(x => x.id === itemId) || {};
      const p = d.prep[itemId] || { samples: [], learned: null, manual: null, lastAdjust: null };
      return { def: m.prep || 5, learned: p.learned, manual: p.manual, samples: p.samples.length, lastAdjust: p.lastAdjust };
    },
    // effective prep: AI ON -> learned (or default); AI OFF -> manual (or default)
    prepFor(itemId) {
      const d = this._prepStore(); const ai = !(d.settings && d.settings.aiAgent && d.settings.aiAgent.prep === false);
      const m = LGM.menu.find(x => x.id === itemId) || {}; const p = d.prep[itemId] || {};
      const def = m.prep || 5;
      return ai ? (p.learned || def) : (p.manual || def);
    },
    setManualPrep(itemId, minutes) { const d = this._prepStore(); const p = d.prep[itemId] || (d.prep[itemId] = { samples: [], learned: null, manual: null, lastAdjust: null }); p.manual = minutes ? +minutes : null; save(d); return p; },
    // estimated minutes for a whole order = the slowest item + 1 min per extra distinct item
    orderEta(order) {
      const items = order.items || []; if (!items.length) return 0;
      const max = Math.max(...items.map(it => this.prepFor(it.id)));
      return max + Math.max(0, items.length - 1);
    },

    // ----- schedule / events -----
    schedule() { return db().schedule; },
    setSchedule(list) { const d = db(); d.schedule = list.map(s => ({ ...s, updatedAt: todayISO() })); save(d); return d.schedule; },
    upsertScheduleRow(row) {
      const d = db();
      if (row.id) { const r = d.schedule.find(s => s.id === row.id); if (r) Object.assign(r, row, { updatedAt: todayISO() }); }
      else { d.schedule.push({ ...row, id: uid("s_"), updatedAt: todayISO() }); }
      save(d); return d.schedule;
    },
    removeScheduleRow(id) { const d = db(); d.schedule = d.schedule.filter(s => s.id !== id); save(d); return d.schedule; },
    events() { return db().events; },
    upsertEvent(ev) {
      const d = db();
      if (ev.id) { const e = d.events.find(x => x.id === ev.id); if (e) Object.assign(e, ev); }
      else d.events.push({ ...ev, id: uid("e_") });
      save(d); return d.events;
    },
    removeEvent(id) { const d = db(); d.events = d.events.filter(e => e.id !== id); save(d); return d.events; },

    // ----- stock -----
    stock() { return db().stock || {}; },
    stockFor(id) { return (db().stock || {})[id] || null; },
    setStock(id, patch) { const d = db(); d.stock = d.stock || {}; d.stock[id] = Object.assign({ qty: 0, threshold: 10, available: true }, d.stock[id], patch); save(d); return d.stock[id]; },
    isAvailable(id) { const s = (db().stock || {})[id]; return !s ? true : (s.available !== false && s.qty > 0); },
    restock(id, qty) { const d = db(); const s = d.stock[id]; if (s) { s.qty += qty; if (s.qty > 0) s.available = true; save(d); } return s; },
    // rule-based stock agent: returns the actions it took + recommendations
    runStockAgent() {
      const d = db(); const acts = [], recs = []; d.stock = d.stock || {};
      Object.keys(d.stock).forEach(id => {
        const s = d.stock[id]; const item = LGM.menu.find(m => m.id === id); if (!item) return;
        if (s.qty <= 0 && s.available !== false) { s.available = false; acts.push({ id, type: "soldout", name: item.fr }); }
        else if (s.qty > 0 && s.available === false) { s.available = true; acts.push({ id, type: "back", name: item.fr }); }
        if (s.qty > 0 && s.qty <= (s.threshold || 10)) recs.push({ id, name: item.fr, qty: s.qty });
      });
      save(d); return { acts, recs, at: todayISO() };
    },

    // ----- highlights (admin news/announcements) -----
    highlights() { return db().highlights || []; },
    setHighlights(list) { const d = db(); d.highlights = list; save(d); return d.highlights; },
    upsertHighlight(h) { const d = db(); d.highlights = d.highlights || []; if (h.id) { const x = d.highlights.find(y => y.id === h.id); if (x) Object.assign(x, h); } else d.highlights.push({ ...h, id: uid("h_") }); save(d); return d.highlights; },
    removeHighlight(id) { const d = db(); d.highlights = (d.highlights || []).filter(h => h.id !== id); save(d); return d.highlights; },

    // ----- bookings / quotes -----
    bookings() { return (db().bookings || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); },
    createBooking(b) { const d = db(); d.bookings = d.bookings || []; const rec = { id: uid("b_"), status: "new", createdAt: todayISO(), ...b }; d.bookings.push(rec); save(d); return rec; },
    updateBooking(id, patch) { const d = db(); const b = (d.bookings || []).find(x => x.id === id); if (b) Object.assign(b, patch); save(d); return b; },
    removeBooking(id) { const d = db(); d.bookings = (d.bookings || []).filter(b => b.id !== id); save(d); return d.bookings; },

    // ----- settings -----
    settings() { return db().settings; },
    saveSettings(patch) { const d = db(); d.settings = Object.assign({}, d.settings, patch); save(d); return d.settings; },

    // ----- stock -----
    stock() { const d = db(); if (!d.stock) { d.stock = {}; save(d); } return d.stock; },
    stockFor(id) { const s = this.stock(); return s[id] || { qty: 0, threshold: 10, available: true }; },
    setStock(id, patch) { const d = db(); if (!d.stock) d.stock = {}; d.stock[id] = Object.assign({ qty: 0, threshold: 10, available: true }, d.stock[id], patch); save(d); return d.stock[id]; },
    restock(id, n) { const s = this.stockFor(id); return this.setStock(id, { qty: s.qty + n, available: true }); },
    itemAvailable(id) { const s = this.stockFor(id); return s.qty > 0 && s.available !== false; },
    // 24/7-style agent: reconciles availability with stock, returns actions + low-stock recs
    runStockAgent() {
      const d = db(); if (!d.stock) d.stock = {};
      const acts = [], recs = [];
      LGM.menu.forEach(m => {
        const s = d.stock[m.id] || (d.stock[m.id] = { qty: 40, threshold: 10, available: true });
        if (s.qty <= 0 && s.available !== false) { s.available = false; acts.push({ id: m.id, name: m.fr, type: "soldout" }); }
        else if (s.qty > 0 && s.available === false) { s.available = true; acts.push({ id: m.id, name: m.fr, type: "back" }); }
        if (s.qty > 0 && s.qty <= (s.threshold || 10)) recs.push({ id: m.id, name: m.fr, qty: s.qty });
      });
      d.settings = d.settings || {}; d.settings.lastAgentRun = todayISO(); save(d);
      return { acts, recs, ranAt: d.settings.lastAgentRun };
    },

    // ----- bookings / quotes -----
    bookings() { return (db().bookings || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); },
    createBooking(b) { const d = db(); if (!d.bookings) d.bookings = []; const bk = Object.assign({ id: uid("b_"), status: "new", createdAt: todayISO() }, b); d.bookings.push(bk); save(d); return bk; },
    updateBooking(id, patch) { const d = db(); const b = (d.bookings || []).find(x => x.id === id); if (b) { Object.assign(b, patch); save(d); } return b; },

    // ----- highlights / announcements -----
    highlights() { return db().highlights || []; },
    upsertHighlight(h) { const d = db(); if (!d.highlights) d.highlights = []; if (h.id) { const e = d.highlights.find(x => x.id === h.id); if (e) Object.assign(e, h); } else d.highlights.push(Object.assign({ id: uid("h_") }, h)); save(d); return d.highlights; },
    removeHighlight(id) { const d = db(); d.highlights = (d.highlights || []).filter(h => h.id !== id); save(d); return d.highlights; },

    // ----- menu photos (override the generated illustration; data-URL from upload) -----
    menuImages() { const d = db(); d.settings = d.settings || {}; return d.settings.menuImages || {}; },
    menuImage(id) { return this.menuImages()[id] || null; },
    setMenuImage(id, dataUrl) { const d = db(); d.settings = d.settings || {}; d.settings.menuImages = d.settings.menuImages || {}; d.settings.menuImages[id] = dataUrl; save(d); return dataUrl; },
    clearMenuImage(id) { const d = db(); if (d.settings && d.settings.menuImages) { delete d.settings.menuImages[id]; save(d); } },

    // ----- employees / HR -----
    employees() { return (db().employees || []).slice().sort((a, b) => (a.name || "").localeCompare(b.name || "")); },
    getEmployee(id) { return (db().employees || []).find(e => e.id === id) || null; },
    employeeByToken(tok) { return (db().employees || []).find(e => e.token === tok) || null; },
    upsertEmployee(emp) {
      const d = db(); if (!d.employees) d.employees = [];
      if (emp.id) { const e = d.employees.find(x => x.id === emp.id); if (e) Object.assign(e, emp); }
      else d.employees.push(Object.assign({ id: uid("e_"), token: "emp" + Math.random().toString(36).slice(2, 10), documents: {}, payHistory: [], status: "active", createdAt: todayISO() }, emp));
      save(d); return d.employees;
    },
    removeEmployee(id) { const d = db(); d.employees = (d.employees || []).filter(e => e.id !== id); save(d); return d.employees; },
    setEmployeePhoto(id, dataUrl) { const d = db(); const e = (d.employees || []).find(x => x.id === id); if (e) { e.photo = dataUrl; save(d); } return e; },
    setEmployeeDoc(id, type, doc) { const d = db(); const e = (d.employees || []).find(x => x.id === id); if (e) { e.documents = e.documents || {}; e.documents[type] = doc; save(d); } return e; },
    removeEmployeeDoc(id, type) { const d = db(); const e = (d.employees || []).find(x => x.id === id); if (e && e.documents) { delete e.documents[type]; save(d); } return e; },
    addPayment(id, pay) {
      const d = db(); const e = (d.employees || []).find(x => x.id === id); if (!e) return null;
      e.payHistory = e.payHistory || [];
      const p = Object.assign({ id: uid("p_"), date: todayISO(), sentAt: todayISO() }, pay);
      e.payHistory.unshift(p); save(d); return p;
    },

    // ----- analytics -----
    // period: 'day' | 'week' | 'month' | 'quarter' | 'year'  (default 'month')
    // builds time-bucketed buckets so charts have real precision per granularity.
    periodConfig(period) {
      return ({
        day:     { n: 24, unit: "hour",  days: 1 },
        week:    { n: 7,  unit: "day",   days: 7 },
        month:   { n: 30, unit: "day",   days: 30 },
        quarter: { n: 13, unit: "week",  days: 91 },
        year:    { n: 12, unit: "month", days: 365 }
      })[period] || { n: 30, unit: "day", days: 30 };
    },
    _buckets(cfg, lang) {
      const loc = lang === "en" ? "en-GB" : "fr-FR";
      const now = new Date(); const b = [];
      for (let i = cfg.n - 1; i >= 0; i--) {
        let start, end, label;
        if (cfg.unit === "hour") { const d = new Date(now); d.setMinutes(0, 0, 0); d.setHours(d.getHours() - i); start = d.getTime(); end = start + 3600000; label = ("0" + d.getHours()).slice(-2) + "h"; }
        else if (cfg.unit === "day") { const d = new Date(now); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i); start = d.getTime(); end = start + 86400000; label = d.toLocaleDateString(loc, { day: "2-digit", month: "short" }); }
        else if (cfg.unit === "week") { const d = new Date(now); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i * 7); start = d.getTime() - 6 * 86400000; end = start + 7 * 86400000; label = new Date(start).toLocaleDateString(loc, { day: "2-digit", month: "short" }); }
        else { const d = new Date(now.getFullYear(), now.getMonth() - i, 1); start = d.getTime(); end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1).getTime(); label = d.toLocaleDateString(loc, { month: "short" }); }
        b.push({ start, end, label, value: 0, count: 0 });
      }
      return b;
    },
    analytics(period, lang) {
      const d = db();
      const cfg = this.periodConfig(typeof period === "string" ? period : "month");
      const buckets = this._buckets(cfg, lang || LGM.lang);
      const since = buckets[0].start, until = buckets[buckets.length - 1].end;
      const paidAll = d.orders.filter(o => o.paymentStatus === "paid");
      const inRange = paidAll.filter(o => { const t = new Date(o.createdAt).getTime(); return t >= since && t < until; });

      // time series (precise buckets)
      inRange.forEach(o => { const t = new Date(o.createdAt).getTime(); const bk = buckets.find(b => t >= b.start && t < b.end); if (bk) { bk.value += o.total; bk.count++; } });
      const series = { labels: buckets.map(b => b.label), data: buckets.map(b => b.value), counts: buckets.map(b => b.count) };

      const revenue = inRange.reduce((s, o) => s + o.total, 0);
      const count = inRange.length;
      const aov = count ? revenue / count : 0;

      // previous equivalent window (for deltas)
      const span = until - since;
      const prevOrders = paidAll.filter(o => { const t = new Date(o.createdAt).getTime(); return t >= since - span && t < since; });
      const prevRevenue = prevOrders.reduce((s, o) => s + o.total, 0);
      const prevCount = prevOrders.length;

      const byLoc = {}; inRange.forEach(o => { byLoc[o.location || "—"] = (byLoc[o.location || "—"] || 0) + o.total; });
      const byProd = {};
      inRange.forEach(o => (o.items || []).forEach(it => { byProd[it.name] = byProd[it.name] || { name: it.name, qty: 0, revenue: 0 }; byProd[it.name].qty += it.qty; byProd[it.name].revenue += it.price * it.qty; }));
      const topProducts = Object.values(byProd).sort((a, b) => b.revenue - a.revenue).slice(0, 6);
      const byPay = {}; inRange.forEach(o => { byPay[o.payment] = (byPay[o.payment] || 0) + 1; });
      const byPayMoney = {}; inRange.forEach(o => { byPayMoney[o.payment] = (byPayMoney[o.payment] || 0) + o.total; });
      const byType = {}; inRange.forEach(o => { byType[o.type] = (byType[o.type] || 0) + 1; });
      const rated = inRange.filter(o => o.rating);
      const avgRating = rated.length ? rated.reduce((s, o) => s + o.rating, 0) / rated.length : 0;

      return {
        period: typeof period === "string" ? period : "month", cfg, series,
        revenue, count, aov, prevRevenue, prevCount,
        deltaRevenue: prevRevenue > 0 ? Math.round((revenue - prevRevenue) / prevRevenue * 100) : null,
        deltaCount: prevCount > 0 ? Math.round((count - prevCount) / prevCount * 100) : null,
        byLoc, topProducts, byPay, byPayMoney, byType, avgRating, ratedCount: rated.length,
        newCustomers: d.customers.filter(c => new Date(c.createdAt).getTime() >= since).length,
        totalCustomers: d.customers.length, since, until
      };
    }
  };

  // Optional: thin async wrappers that try the backend first, else fall back to Store.
  // (Frontend code can use Store directly for the demo.)
  Store.api = {
    async createOrder(order) {
      if (API) {
        try {
          const r = await fetch(API + "/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(order) });
          if (r.ok) return await r.json();
        } catch (e) { /* fall through to local */ }
      }
      return Store.createOrder(order);
    },
    async createPayment(payload) {
      if (API) {
        try {
          const r = await fetch(API + "/api/pay", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
          if (r.ok) return await r.json();
        } catch (e) {}
      }
      // demo: pretend the payment provider approved it
      return { ok: true, demo: true, provider: payload.payment, status: "approved" };
    }
  };

  LGM.store = Store;

  // ---- AI bridge: real Claude via backend when configured, else rule engine fallback ----
  LGM.ai = {
    // Tries the backend (same-origin or LGM_API_BASE). On any failure returns
    // null so app.js falls back to the built-in rule engine.
    async ask(message, history) {
      try {
        const r = await fetch((API || "") + "/api/ai", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, history: history || [], lang: LGM.lang })
        });
        if (!r.ok) return null;
        const data = await r.json();
        return (data && data.reply) ? data : null; // demo/no-key -> {reply:null} -> rules
      } catch (e) { return null; }
    }
  };
})(window);
