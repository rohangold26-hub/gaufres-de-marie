/* =====================================================================
   Les Gaufres de Marie — shared business data
   Currency: XOF (FCFA). Abidjan, Côte d'Ivoire.
   ===================================================================== */
(function (root) {
  const LGM = (root.LGM = root.LGM || {});

  // ---- Brand / business ----
  LGM.business = {
    name: "Les Gaufres de Marie",
    tagline_fr: "Foodtruck gourmand & fait maison",
    tagline_en: "Gourmet, homemade food truck",
    city: "Abidjan, Côte d'Ivoire",
    currency: "XOF",
    currencySymbol: "F",
    locale_fr: "fr-CI",
    locale_en: "en-CI",
    phones: ["07 05 75 24 27", "07 03 82 27 00"],
    whatsapp: "2250705752427",
    email: "bonjour@lesgaufresdemarie.ci",
    socials: {
      instagram: "https://www.instagram.com/lesgaufresdemarie",
      tiktok: "https://www.tiktok.com/@lesgaufresdemarie",
      yango: "https://yango-delivery.com",
      whatsapp: "https://wa.me/2250705752427"
    }
  };

  // ---- Money helpers ----
  LGM.fmt = function (xof, lang) {
    const n = Math.round(Number(xof) || 0);
    const s = n.toLocaleString(lang === "en" ? "en-US" : "fr-FR").replace(/ /g, " ");
    return s + " F";
  };

  // ---- Menu (extracted from Marie's posts) ----
  // price in XOF. img optional.
  LGM.categories = [
    { id: "bruxelloises", icon: "🧇", fr: "Les Bruxelloises", en: "Brussels Waffles",
      descFr: "Croustillante dehors, légère dedans.", descEn: "Crisp outside, light inside." },
    { id: "liegeoises", icon: "✨", fr: "Les Liégeoises", en: "Liège Waffles",
      descFr: "Pâte briochée au sucre perlé caramélisé.", descEn: "Brioche dough with caramelised pearl sugar." },
    { id: "minis", icon: "🥞", fr: "Les Minis", en: "Minis",
      descFr: "Minis gaufres & pancakes à partager.", descEn: "Mini waffles & pancakes to share." },
    { id: "bowls", icon: "🥣", fr: "Les Waffles Bowls", en: "Waffle Bowls",
      descFr: "Gaufre coupée, nappée, gourmande.", descEn: "Chopped waffle, loaded & indulgent." },
    { id: "box", icon: "📦", fr: "Les Box Gourmandes", en: "Sharing Boxes",
      descFr: "Pour la famille ou la team.", descEn: "For the family or the team." },
    { id: "boissons", icon: "🥤", fr: "Boissons", en: "Drinks",
      descFr: "Fait maison.", descEn: "Homemade." }
  ];

  LGM.menu = [
    // Bruxelloises
    { id: "brx-nature", cat: "bruxelloises", price: 1000, fr: "Bruxelloise Nature", en: "Plain Brussels", img: "assets/img/bruxelloise.png",
      descFr: "La classique, légère et croustillante, voile de sucre glace.", descEn: "The classic, light and crisp, dusted with icing sugar." },
    { id: "brx-nutella", cat: "bruxelloises", price: 3000, fr: "Bruxelloise Nutella", en: "Brussels Nutella", img: "assets/img/bruxelloise.png",
      descFr: "Généreusement nappée de Nutella fondant.", descEn: "Generously topped with melting Nutella." },
    { id: "brx-cbs", cat: "bruxelloises", price: 3000, fr: "Bruxelloise Caramel beurre salé", en: "Brussels Salted Caramel", img: "assets/img/bruxelloise.png",
      descFr: "Avec notre caramel beurre salé fait maison.", descEn: "With our homemade salted butter caramel." },
    { id: "brx-miel", cat: "bruxelloises", price: 3000, fr: "Bruxelloise Miel", en: "Brussels Honey", img: "assets/img/bruxelloise.png",
      descFr: "Un beau filet de miel doré.", descEn: "A beautiful drizzle of golden honey." },

    // Liégeoises
    { id: "lg-nature", cat: "liegeoises", price: 2500, fr: "Liégeoise Nature", en: "Plain Liège", img: "assets/img/box-liege.png",
      descFr: "Pâte briochée au sucre perlé caramélisé.", descEn: "Brioche dough with caramelised pearl sugar." },
    { id: "lg-nutella", cat: "liegeoises", price: 3500, fr: "Liégeoise Nutella", en: "Liège Nutella", img: "assets/img/box-liege.png",
      descFr: "Brioche moelleuse et Nutella fondant.", descEn: "Soft brioche and melting Nutella." },
    { id: "lg-cbs", cat: "liegeoises", price: 3500, fr: "Liégeoise Caramel beurre salé", en: "Liège Salted Caramel", img: "assets/img/box-liege.png",
      descFr: "Notre caramel beurre salé maison.", descEn: "Our homemade salted butter caramel." },
    { id: "lg-oreo", cat: "liegeoises", price: 3500, fr: "Liégeoise Oréo Nutella", en: "Liège Oreo Nutella", img: "assets/img/box-liege.png",
      descFr: "Nutella et éclats d'Oréo croquants.", descEn: "Nutella and crunchy Oreo pieces." },

    // Minis
    { id: "min-gaufres", cat: "minis", price: 1500, fr: "4 Minis gaufres", en: "4 Mini Waffles", img: "assets/img/bruxelloise.png",
      descFr: "Quatre minis gaufres dorées à partager.", descEn: "Four golden mini waffles to share." },
    { id: "min-pan-nature", cat: "minis", price: 1500, fr: "3 Minis pancakes nature", en: "3 Plain Mini Pancakes", img: "assets/img/bruxelloise.png",
      descFr: "Trois pancakes moelleux nature.", descEn: "Three soft plain pancakes." },
    { id: "min-pan-oreo", cat: "minis", price: 3500, fr: "3 Minis pancakes Oréo", en: "3 Oreo Mini Pancakes", img: "assets/img/bowl.png",
      descFr: "Pancakes garnis d'Oréo croquant.", descEn: "Pancakes loaded with crunchy Oreo." },
    { id: "min-pan-spec", cat: "minis", price: 3500, fr: "3 Minis pancakes Spéculoos", en: "3 Speculoos Mini Pancakes", img: "assets/img/bowl.png",
      descFr: "Pancakes nappés de spéculoos.", descEn: "Pancakes topped with speculoos." },

    // Bowls
    { id: "bowl-nutban", cat: "bowls", price: 4000, fr: "Bowl Nutella Banane", en: "Nutella Banana Bowl", img: "assets/img/bowl.png",
      descFr: "Gaufre coupée, Nutella et banane fraîche.", descEn: "Chopped waffle, Nutella and fresh banana." },
    { id: "bowl-cookie", cat: "bowls", price: 4000, fr: "Bowl Cookie Caramel", en: "Cookie Caramel Bowl", img: "assets/img/bowl.png",
      descFr: "Gaufre coupée, cookie et caramel.", descEn: "Chopped waffle, cookie and caramel." },
    { id: "bowl-crispy", cat: "bowls", price: 4000, fr: "Bowl Crispy Chocolat Noisette", en: "Crispy Choc Hazelnut Bowl", img: "assets/img/bowl.png",
      descFr: "Chocolat noisette croustillant à souhait.", descEn: "Wonderfully crispy chocolate hazelnut." },

    // Box
    { id: "box-brux", cat: "box", price: 10000, fr: "Big Bruxelles Box", en: "Big Brussels Box", img: "assets/img/bruxelloise.png",
      descFr: "2 natures, 1 Nutella et 1 caramel beurre salé.", descEn: "2 plain, 1 Nutella and 1 salted caramel." },
    { id: "box-liege", cat: "box", price: 10500, fr: "Box de Liège", en: "Liège Box", img: "assets/img/box-liege.png",
      descFr: "2 natures, 1 Nutella et 1 caramel beurre salé.", descEn: "2 plain, 1 Nutella and 1 salted caramel." },

    // Drinks
    { id: "dr-limonade", cat: "boissons", price: 2000, fr: "Limonade maison", en: "Homemade Lemonade", img: "assets/img/limonade.png",
      descFr: "Citron pressé, préparée maison.", descEn: "Fresh pressed lemon, made in house.", priceEstimated: true }
  ];

  // ---- Truck locations (real spots from her profile) ----
  LGM.defaultSchedule = [
    { day_fr: "Lundi au mercredi", day_en: "Monday to Wednesday", place: "Temple du Foot, Vallon", phone: "07 05 75 24 27",
      hours: "11h00 à 18h00", mapsQuery: "Temple du Foot Vallon Abidjan" },
    { day_fr: "Jeudi et vendredi", day_en: "Thursday and Friday", place: "L'Atelier Épicé, Mermoz", phone: "07 03 82 27 00",
      hours: "11h00 à 18h00", mapsQuery: "Atelier Epice Mermoz Abidjan" },
    { day_fr: "Samedi et dimanche", day_en: "Saturday and Sunday", place: "Événements & privatisations", phone: "07 05 75 24 27",
      hours: "Sur réservation", mapsQuery: "Abidjan" }
  ];

  // ---- Loyalty / badge tiers (Gold = good client) ----
  // tier chosen by lifetime spend (XOF). points = 1 per 100 F spent.
  LGM.badges = [
    { id: "nouveau", fr: "Nouveau", en: "New", min: 0,     color: "#9aa0a6", emoji: "🌱" },
    { id: "bronze",  fr: "Bronze",  en: "Bronze", min: 10000, color: "#cd7f32", emoji: "🥉" },
    { id: "argent",  fr: "Argent",  en: "Silver", min: 30000, color: "#9fa8b3", emoji: "🥈" },
    { id: "or",      fr: "Or",      en: "Gold",   min: 75000, color: "#E8B23A", emoji: "🥇" },
    { id: "vip",     fr: "VIP Platine", en: "VIP Platinum", min: 150000, color: "#7b5cff", emoji: "💎" }
  ];
  LGM.badgeFor = function (lifetimeSpend) {
    let b = LGM.badges[0];
    for (const t of LGM.badges) if (lifetimeSpend >= t.min) b = t;
    return b;
  };
  LGM.nextBadge = function (lifetimeSpend) {
    for (const t of LGM.badges) if (lifetimeSpend < t.min) return t;
    return null;
  };
  LGM.points = function (lifetimeSpend) { return Math.floor((lifetimeSpend || 0) / 100); };

  // ---- Payment methods (Côte d'Ivoire first) ----
  // 'live' true means a real integration adapter exists in the backend scaffold.
  // kind: momo -> opens a mobile-money number field; card -> secure redirect (no inline fields); cash -> none
  LGM.payments = [
    { id: "wave",     fr: "Wave",            en: "Wave",            kind: "momo", color: "#1DC8F2", emoji: "🐧", live: true,
      noteFr: "Mobile Money", noteEn: "Mobile Money" },
    { id: "orange",   fr: "Orange Money",    en: "Orange Money",    kind: "momo", color: "#FF7900", emoji: "🟠", live: true,
      noteFr: "Mobile Money", noteEn: "Mobile Money" },
    { id: "mtn",      fr: "MTN MoMo",        en: "MTN MoMo",        kind: "momo", color: "#FFCC00", emoji: "🟡", live: true,
      noteFr: "Mobile Money", noteEn: "Mobile Money" },
    { id: "moov",     fr: "Moov Money",      en: "Moov Money",      kind: "momo", color: "#0066B3", emoji: "🔵", live: true,
      noteFr: "Mobile Money", noteEn: "Mobile Money" },
    { id: "djamo",    fr: "Djamo",           en: "Djamo",           kind: "card", color: "#11131A", emoji: "🔷", live: true,
      noteFr: "Carte / Djamo", noteEn: "Card / Djamo" },
    { id: "geniuspay", fr: "GeniusPay",      en: "GeniusPay",       kind: "card", color: "#6C2BD9", emoji: "🧞", live: true,
      noteFr: "Paiement sécurisé", noteEn: "Secure payment" },
    { id: "card",     fr: "Visa / Mastercard", en: "Visa / Mastercard", kind: "card", color: "#1A1F71", emoji: "💳", live: true,
      noteFr: "Carte bancaire", noteEn: "Bank card" },
    { id: "cash",     fr: "Espèces au truck", en: "Cash at the truck", kind: "cash", color: "#5fae6b", emoji: "💵", live: true,
      noteFr: "À la récupération", noteEn: "On pickup" }
  ];

  // order fulfilment progress (admin advances these; client is notified on WhatsApp)
  LGM.orderStatuses = [
    { id: "pending",   fr: "Nouvelle (à accepter)", en: "New (to accept)",    color: "#caa14a", emoji: "🆕" },
    { id: "received",  fr: "Commande acceptée",     en: "Order received",      color: "#3a86c8", emoji: "📥" },
    { id: "preparing", fr: "En préparation",        en: "Being prepared",      color: "#3aa0e8", emoji: "👩‍🍳" },
    { id: "ready",     fr: "Prête",                 en: "Ready",               color: "#6bbf59", emoji: "✅" },
    { id: "completed", fr: "Terminée",              en: "Completed",           color: "#2e7d32", emoji: "🎉" },
    { id: "cancelled", fr: "Annulée",               en: "Cancelled",           color: "#c0392b", emoji: "✖️" }
  ];
  LGM.statusMeta = id => LGM.orderStatuses.find(s => s.id === id) || LGM.orderStatuses[0];

  // ---- notifications: label + text per type (client & admin) ----
  LGM.notifLabel = function (n, lang) {
    const l = lang || LGM.lang || "fr", f = x => LGM.fmt(x, l), ref = n.ref || "";
    const M = {
      new_order:  { e: "🧾", fr: `Nouvelle commande ${ref}${n.customerName ? " · " + n.customerName : ""} · ${f(n.total || 0)}`, en: `New order ${ref}${n.customerName ? " · " + n.customerName : ""} · ${f(n.total || 0)}` },
      received:   { e: "📥", fr: `Votre commande ${ref} a été acceptée`, en: `Your order ${ref} was accepted` },
      preparing:  { e: "👩‍🍳", fr: `Votre commande ${ref} est en préparation`, en: `Your order ${ref} is being prepared` },
      ready:      { e: "✅", fr: `Votre commande ${ref} est prête !`, en: `Your order ${ref} is ready!` },
      completed:  { e: "🎉", fr: `Commande ${ref} terminée. Merci !`, en: `Order ${ref} completed. Thank you!` },
      cancelled:  { e: "✖️", fr: `Commande ${ref} annulée`, en: `Order ${ref} cancelled` },
      credit:     { e: "🎁", fr: `Vous avez reçu un crédit de ${f(n.amount || 0)} (${n.ctype === "refund" ? "remboursement" : "geste commercial"})`, en: `You received ${f(n.amount || 0)} credit (${n.ctype === "refund" ? "refund" : "goodwill"})` }
    };
    const m = M[n.type] || { e: "🔔", fr: "Notification", en: "Notification" };
    return { emoji: m.e, text: l === "en" ? m.en : m.fr };
  };
  // short pleasant two-tone chime via Web Audio (no asset needed); respects a mute flag
  LGM.playChime = function () {
    if (localStorage.getItem("lgm_muted") === "1") return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext; if (!Ctx) return;
      const ctx = LGM._audio || (LGM._audio = new Ctx());
      if (ctx.state === "suspended") ctx.resume();
      [[880, 0], [1174, 0.12]].forEach(([freq, t]) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine"; o.frequency.value = freq; o.connect(g); g.connect(ctx.destination);
        const s = ctx.currentTime + t;
        g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(0.18, s + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, s + 0.35);
        o.start(s); o.stop(s + 0.36);
      });
    } catch (e) {}
  };
  LGM.muted = () => localStorage.getItem("lgm_muted") === "1";
  LGM.setMuted = m => localStorage.setItem("lgm_muted", m ? "1" : "0");
  // the live "tracker" stages shown to the customer once an order is accepted
  LGM.trackerStages = ["received", "preparing", "ready"];
  LGM.stageMeta = id => LGM.orderStatuses.find(s => s.id === id);

  // shared live "life-bar" tracker markup — identical on customer + admin so they always match
  LGM.trackerHTML = function (order, lang) {
    const l = lang || LGM.lang || "fr";
    const st = order.status, times = order.statusTimes || {};
    const order_done = st === "completed";
    if (st === "cancelled") return `<div class="trk cancelled"><div class="trk-cancel">✖️ ${l === "en" ? "Order cancelled" : "Commande annulée"}</div></div>`;
    if (st === "pending") return `<div class="trk"><div class="trk-pending">🆕 ${l === "en" ? "Awaiting acceptance…" : "En attente d'acceptation…"}</div></div>`;
    const stages = LGM.trackerStages, curIdx = order_done ? stages.length : stages.indexOf(st);
    const fmtT = iso => iso ? new Date(iso).toLocaleTimeString(l === "en" ? "en-GB" : "fr-FR", { hour: "2-digit", minute: "2-digit" }) : "";
    const deliver = order.type === "delivery";
    const labels = {
      received: l === "en" ? "Order received" : "Commande reçue",
      preparing: l === "en" ? "Being prepared" : "En préparation",
      ready: deliver ? (l === "en" ? "Out for delivery" : "En livraison") : (l === "en" ? "Ready for pickup" : "Prête à récupérer")
    };
    const steps = stages.map((id, i) => {
      const done = i < curIdx, on = i === curIdx;
      return `<div class="trk-step ${done ? "done" : ""} ${on ? "on" : ""}">
        <div class="trk-dot">${done ? "✓" : (on ? "●" : i + 1)}</div>
        <div class="trk-lbl">${labels[id]}</div>
        <div class="trk-time">${fmtT(times[id])}</div></div>`;
    }).join("");
    // ETA line
    let eta = "";
    if (st === "preparing" && times.preparing && order.etaMin) {
      const ready = new Date(new Date(times.preparing).getTime() + order.etaMin * 60000);
      eta = `<div class="trk-eta">⏱️ ${l === "en" ? "Ready around" : "Prête vers"} ${fmtT(ready.toISOString())} (${order.etaMin} min)</div>`;
    } else if (st === "received" && order.etaMin) {
      eta = `<div class="trk-eta">⏱️ ${l === "en" ? "Est. prep" : "Préparation estimée"} ~${order.etaMin} min</div>`;
    } else if (order_done) {
      eta = `<div class="trk-eta done">🎉 ${l === "en" ? "Completed" : "Terminée"}</div>`;
    }
    const pct = order_done ? 100 : Math.round((curIdx / (stages.length - 1)) * 100);
    return `<div class="trk"><div class="trk-bar"><i style="width:${pct}%"></i></div><div class="trk-steps">${steps}</div>${eta}</div>`;
  };

  // per-item default prep time (minutes) by category; learned values can override
  LGM._prepDefault = { bruxelloises: 4, liegeoises: 5, minis: 4, bowls: 6, box: 12, boissons: 1 };
  LGM.menu.forEach(m => { if (m.prep == null) m.prep = LGM._prepDefault[m.cat] || 5; });

  // ---- Employees / HR ----
  LGM.contractTypes = [
    { id: "cdi", fr: "CDI", en: "Permanent (CDI)" },
    { id: "cdd", fr: "CDD", en: "Fixed-term (CDD)" },
    { id: "stage", fr: "Stage", en: "Internship" },
    { id: "freelance", fr: "Freelance / Prestataire", en: "Freelance / Contractor" },
    { id: "essai", fr: "Période d'essai", en: "Probation" }
  ];
  LGM.docTypes = [
    { id: "cni", fr: "CNI (Carte Nationale d'Identité)", en: "National ID (CNI)" },
    { id: "passport", fr: "Passeport", en: "Passport" },
    { id: "residence", fr: "Justificatif de domicile", en: "Proof of residence" },
    { id: "casier", fr: "Casier judiciaire", en: "Criminal record" },
    { id: "contract", fr: "Contrat de travail", en: "Employment contract" },
    { id: "cnps", fr: "Attestation CNPS", en: "Social security (CNPS) doc" },
    { id: "other", fr: "Autre document", en: "Other document" }
  ];
  // tenure in human form from a start date
  LGM.tenure = function (startISO, lang) {
    if (!startISO) return "—";
    const s = new Date(startISO), now = new Date();
    let months = (now.getFullYear() - s.getFullYear()) * 12 + (now.getMonth() - s.getMonth());
    if (now.getDate() < s.getDate()) months--;
    months = Math.max(0, months);
    const y = Math.floor(months / 12), m = months % 12;
    const en = lang === "en";
    const yr = y ? y + (en ? (y > 1 ? " yrs" : " yr") : " an" + (y > 1 ? "s" : "")) : "";
    const mo = m ? m + (en ? " mo" : " mois") : "";
    return [yr, mo].filter(Boolean).join(" ") || (en ? "< 1 mo" : "< 1 mois");
  };
  // WhatsApp message telling an employee their salary was paid
  LGM.salaryMessage = function (emp, pay, link, lang) {
    const l = lang || LGM.lang || "fr";
    const name = (emp.name || "").split(" ")[0] || "";
    const amount = LGM.fmt(pay.amount || 0, l);
    if (l === "en") return `Hi ${name}! 💸\nYour salary of ${amount} (${pay.period || ""}) has just been sent to your account. ✅\nView your payslip & info in your employee space:\n${link}\n\n${LGM.business.name}`;
    return `Bonjour ${name} ! 💸\nVotre salaire de ${amount} (${pay.period || ""}) vient d'être envoyé sur votre compte. ✅\nRetrouvez votre bulletin et vos infos dans votre espace employé :\n${link}\n\n${LGM.business.name}`;
  };

  // ---- Event booking / quote ----
  LGM.eventTypes = [
    { id: "anniv", fr: "Anniversaire", en: "Birthday" },
    { id: "mariage", fr: "Mariage", en: "Wedding" },
    { id: "entreprise", fr: "Entreprise / Bureau", en: "Corporate / Office" },
    { id: "bapteme", fr: "Baptême / Religieux", en: "Christening / Religious" },
    { id: "autre", fr: "Autre", en: "Other" }
  ];
  // simple, transparent quote engine (XOF)
  LGM.quote = function ({ basis, people, items, eventType }) {
    const perPerson = 3500;        // avg waffle + topping per guest
    const perItem = 3200;          // avg item price
    let base = basis === "items" ? (items || 0) * perItem : (people || 0) * perPerson;
    const travel = 15000;          // truck travel / setup
    const staff = base > 150000 ? 30000 : base > 60000 ? 15000 : 0;
    const eventFee = eventType === "mariage" ? 20000 : eventType === "entreprise" ? 10000 : 0;
    const subtotal = base + travel + staff + eventFee;
    const deposit = Math.round(subtotal * 0.3 / 500) * 500;
    return { base, travel, staff, eventFee, subtotal, deposit, perPerson, perItem };
  };

  // how the client gets the order (chosen before payment)
  LGM.orderTypes = [
    { id: "takeaway", fr: "À emporter", en: "Takeaway", emoji: "🥡", descFr: "Commande prête à emporter au food truck.", descEn: "Ready to grab and go at the truck." },
    { id: "pickup",   fr: "Récupération sur place", en: "Pick up at the truck", emoji: "🚚", descFr: "Vous venez chercher votre commande au truck.", descEn: "Collect your order at the truck." },
    { id: "delivery", fr: "Livraison", en: "Delivery", emoji: "🚕", descFr: "Livrée à votre adresse.", descEn: "Delivered to your address.", yango: true }
  ];
  LGM.fulfilmentMeta = id => LGM.orderTypes.find(o => o.id === id) || LGM.orderTypes[0];

  // ---- WhatsApp message templates (personalised per client) ----
  // kind: "confirmation" | a status id (received/preparing/ready/completed/cancelled)
  LGM.waMessage = function (order, kind, lang) {
    const l = lang || LGM.lang || "fr";
    const f = x => LGM.fmt(x, l);
    const name = (order.customerName || "").split(" ")[0] || (l === "en" ? "there" : "");
    const lines = (order.items || []).map(i => `• ${i.qty}× ${l === "en" ? (LGM.menu.find(m => m.id === i.id)?.en || i.name) : i.name}`).join("\n");
    const ful = LGM.fulfilmentMeta(order.type);
    const fulName = l === "en" ? ful.en : ful.fr;
    const where = order.type === "delivery"
      ? (l === "en" ? `Delivery to: ${order.address || "your address"}` : `Livraison à : ${order.address || "votre adresse"}`)
      : (l === "en" ? `Pickup at: ${order.location || "the truck"}` : `À récupérer à : ${order.location || "le food truck"}`);
    const ref = order.ref || "";
    const total = f(order.total || 0);
    const H = l === "en"
      ? { hi: `Hi ${name}! 🧇`, brand: "Les Gaufres de Marie",
          confirmation: `Thanks for your order! We've received it and we'll keep you posted.`,
          received: `We've received your order. ✅`,
          preparing: `Good news, your order is now being prepared. 👩‍🍳`,
          ready: order.type === "delivery" ? `Your order is ready and on its way! 🚕` : `Your order is ready for pick-up! ✅`,
          completed: `Thanks again, enjoy your waffles! 🎉 We'd love your feedback — rate your order in your account: ${LGM.business.siteUrl || "our website"}/account.html ⭐`,
          cancelled: `Your order has been cancelled. Please contact us if this is a mistake.`,
          det: "Order", total: "Total", way: "Method" }
      : { hi: `Bonjour ${name} ! 🧇`, brand: "Les Gaufres de Marie",
          confirmation: `Merci pour votre commande ! Nous l'avons bien reçue et nous vous tenons au courant.`,
          received: `Nous avons bien reçu votre commande. ✅`,
          preparing: `Bonne nouvelle, votre commande est en préparation. 👩‍🍳`,
          ready: order.type === "delivery" ? `Votre commande est prête et part en livraison ! 🚕` : `Votre commande est prête à être récupérée ! ✅`,
          completed: `Merci encore, régalez-vous ! 🎉 Votre avis nous ferait plaisir — notez votre commande dans votre compte : ${LGM.business.siteUrl || "notre site"}/account.html ⭐`,
          cancelled: `Votre commande a été annulée. Contactez-nous si c'est une erreur.`,
          det: "Commande", total: "Total", way: "Mode" };
    const intro = H[kind] || H.received;
    // two-stage payment: show the deposit paid + balance still due on delivery
    const depoLine = (order.paymentMode === "twostage" && order.deposit)
      ? "\n" + (l === "en"
          ? `Deposit paid: ${f(order.deposit.amount)} · Balance on delivery: ${f((order.total || 0) - (order.deposit.amount || 0))}`
          : `Acompte payé : ${f(order.deposit.amount)} · Solde à la livraison : ${f((order.total || 0) - (order.deposit.amount || 0))}`)
      : "";
    return `${H.hi}\n${intro}\n\n${H.det} ${ref}\n${lines}\n${H.way} : ${fulName}\n${where}\n${H.total} : ${total}${depoLine}\n\n${H.brand}`;
  };
  LGM.waLink = function (phone, text) {
    const p = ("225" + String(phone || "").replace(/\D/g, "")).replace(/^2252250/, "225");
    return "https://wa.me/" + p + "?text=" + encodeURIComponent(text || "");
  };

  // ---- store open/closed banner (idle time: night / before opening) ----
  LGM.closedMessage = {
    fr: "Nos gaufres prennent une petite pause ! 🧇 Nous ne prenons pas de commandes pour le moment. Merci pour votre fidélité, on se retrouve très vite pour de nouvelles douceurs croustillantes !",
    en: "Our waffles are taking a little break! 🧇 We're not taking orders right now. Thank you for your loyalty — see you very soon for more crispy treats!"
  };
  LGM.isClosed = function () {
    try { const s = LGM.store && LGM.store.settings ? LGM.store.settings() : null; return !!(s && s.closed); } catch (e) { return false; }
  };
  LGM.closedText = function (lang) { return LGM.closedMessage[(lang || LGM.lang) === "en" ? "en" : "fr"]; };

  // ---- Yango delivery: open the native app on mobile if installed, else the web/app store ----
  LGM.yangoUrl = function () {
    let url = "";
    try { const s = LGM.store && LGM.store.settings ? LGM.store.settings().socials : null; if (s && s.yango) url = s.yango; } catch (e) {}
    return url || (LGM.business.socials && LGM.business.socials.yango) || "https://yango.go.link";
  };
  LGM.openYango = function (ev) {
    if (ev && ev.preventDefault) ev.preventDefault();
    const web = LGM.yangoUrl();
    const ua = navigator.userAgent || "";
    const isMobile = /android|iphone|ipad|ipod/i.test(ua);
    // desktop: just open the configured link in a new tab
    if (!isMobile) { window.open(web, "_blank"); return; }
    // A Yango universal link (yango.go.link / yango.com) is opened directly by the OS
    // in the installed app on both iOS and Android — no scheme hack needed.
    if (/yango\.(go\.link|com|ru)|yandex/i.test(web)) { window.location.href = web; return; }
    // Otherwise best-effort: try the app's custom scheme, fall back to the web link.
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const store = isIOS
      ? "https://apps.apple.com/app/yango/id1437157286"
      : "https://play.google.com/store/apps/details?id=com.yandex.yango";
    const fallback = setTimeout(() => { window.location.href = web || store; }, 1200);
    // if the app opens, the page is hidden → cancel the fallback
    document.addEventListener("visibilitychange", function h() { if (document.hidden) { clearTimeout(fallback); document.removeEventListener("visibilitychange", h); } });
    try { window.location.href = "yango://"; } catch (e) { clearTimeout(fallback); window.location.href = web; }
  };

})(window);
