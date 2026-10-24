/* =====================================================================
   Les Gaufres de Marie — Admin / CRM / Dashboard
   ===================================================================== */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const S = LGM.store;
  const L = () => LGM.lang;
  const fmt = x => LGM.fmt(x, L());
  let period = "month";
  let charts = {};

  // ---- admin i18n (kept here to keep i18n.js lean) ----
  const A = {
    fr: {
      dash: "Tableau de bord", orders: "Commandes", clients: "Clients (CRM)", finances: "Finances",
      satisfaction: "Satisfaction", truck: "Trouver le truck", events: "Événements", settings: "Réseaux & Paiements",
      site: "Voir le site", logout: "Déconnexion", revenue: "Chiffre d'affaires", ordersN: "Commandes",
      aov: "Panier moyen", newC: "Nouveaux clients", revTrend: "Évolution du chiffre d'affaires",
      byLoc: "CA par emplacement", topP: "Top produits", payMix: "Moyens de paiement", typeMix: "Type de commande",
      recent: "Commandes récentes", avgRating: "Note moyenne", ratings: "avis", search: "Rechercher…",
      all: "Tous", status: "Statut", client: "Client", total: "Total", date: "Date", pay: "Paiement", actions: "",
      lifetime: "Dépensé", count: "Cmd", badge: "Badge", phone: "Téléphone", lastOrder: "Dernière cmd",
      saveSched: "Enregistrer le planning", addRow: "+ Ajouter un créneau", autoTitle: "Automatiser « Trouver le truck »",
      autoDesc: "Activez le rappel hebdomadaire pour mettre à jour les emplacements. Vos changements sont publiés instantanément sur le site.",
      autoOn: "Rappel hebdomadaire", publishNote: "Note de la semaine (affichée sur le site)",
      day: "Jour", place: "Lieu", hours: "Horaires", maps: "Recherche Maps", saved: "Enregistré ✓",
      satGood: "Clients satisfaits", satLow: "À améliorer", reviews: "Derniers avis", noReviews: "Pas encore d'avis.",
      addEvent: "+ Nouvel événement", evTitle: "Événement", guests: "Invités", evStatus: "Statut", evDate: "Date",
      socials: "Réseaux sociaux", socialsDesc: "Ces liens alimentent le site et les boutons de partage.",
      payTitle: "Moyens de paiement", payDesc: "Activez les fournisseurs. Les clés s'ajoutent côté serveur (.env). Tant qu'aucune clé n'est branchée, le site encaisse en mode démo.",
      live: "Actif", off: "Inactif", needKey: "clé requise", confirmReset: "Réinitialiser toutes les données de démo ?",
      welcome: "Bonjour Marie 👋", today: "Aujourd'hui", expCsv: "Exporter CSV", money30: "sur la période", vsPrev: "vs préc.",
      pDay: "Jour", pWeek: "Semaine", pMonth: "Mois", pQuarter: "Trimestre", pYear: "Année",
      budgetTitle: "Budget & rentabilité", budgetDesc: "Renseignez vos coûts pour calculer votre marge brute, votre bénéfice et votre rentabilité sur la période sélectionnée.",
      bRevenue: "Chiffre d'affaires", bCogsPct: "Coûts directs (matières) %", bDirect: "Coûts directs", bGrossProfit: "Marge brute",
      bGrossMargin: "Taux de marge brute", bFixed: "Charges fixes / mois", bFixedPeriod: "Charges fixes (période)",
      bNetProfit: "Bénéfice net", bNetMargin: "Marge nette", bTarget: "Objectif CA / mois", bTargetProgress: "Atteinte de l'objectif",
      bForPeriod: "pour la période sélectionnée", bSave: "Enregistrer le budget",
      team: "Équipe", empTitle: "Gestion des employés", empAdd: "+ Ajouter un employé", empEdit: "Fiche employé",
      empName: "Nom complet", empRole: "Poste / Rôle", empContract: "Type de contrat", empStart: "Date d'embauche",
      empTenure: "Ancienneté", empCnps: "Numéro CNPS", empCni: "Numéro CNI", empPassport: "Numéro passeport",
      empPhone: "Téléphone", empEmail: "Email", empAddress: "Adresse", empPhoto: "Photo / Selfie", empStatus: "Statut",
      empDocs: "Documents administratifs", empUploadDoc: "Importer", empNoDoc: "Aucun fichier", empView: "Voir",
      empPay: "Historique des paiements", empPayAmount: "Montant", empPayPeriod: "Période", empPayMethod: "Moyen",
      empSendSalary: "💸 Envoyer le salaire + notifier", empAddPay: "Enregistrer un paiement",
      empLink: "Lien espace employé (lecture seule)", empCopyLink: "Copier le lien", empCopied: "Lien copié ✓",
      empActive: "Actif", empInactive: "Inactif", empSave: "Enregistrer la fiche", empDelete: "Supprimer",
      empSalarySent: "Salaire enregistré + message prêt 💬", empAgent: "Agent IA paie", empAgentDesc: "À chaque salaire envoyé, l'employé reçoit automatiquement un message WhatsApp de confirmation.",
      prep: "Temps de prép.", prepTitle: "Temps de préparation (IA)", prepDesc: "L'algorithme apprend la durée réelle de préparation de chaque produit et se réajuste tous les 14 jours. L'IA reste prioritaire ; en mode manuel, vos valeurs s'appliquent.",
      aiPrepAgent: "Agent IA temps de prép.", aiPrepDesc: "Quand activé, l'IA apprend, fixe les temps et fait avancer les statuts automatiquement (réception → préparation → prête). Désactive pour tout gérer manuellement.",
      aiOn: "IA activée", aiOff: "Manuel", prepProduct: "Produit", prepDef: "Défaut", prepLearned: "Appris (IA)", prepManual: "Manuel", prepSamples: "Mesures (14j)", prepUsed: "Utilisé", prepLastAdj: "Dernier réajust.", prepNever: "jamais",
      autoAccept: "Acceptation automatique des commandes", autoAcceptDesc: "Si activé, les nouvelles commandes sont acceptées automatiquement et le suivi démarre. Sinon, accepte-les manuellement.",
      accept: "Accepter", pendingN: "à accepter", min: "min",
      autoTracker: "Suivi automatique", autoTrackerDesc: "Quand activé, le suivi avance tout seul selon le temps de prép. (reçue → en préparation → prête), peu importe le mode d'acceptation. Désactivez pour avancer les statuts à la main.",
      trackerOn: "Auto", trackerOff: "Manuel",
      creditGrant: "Accorder un crédit", creditTo: "à", creditType: "Type", creditRefund: "Remboursement", creditGoodwill: "Geste commercial",
      creditAmount: "Montant du crédit", creditNote: "Note (optionnel)", creditGive: "Accorder le crédit", creditGranted: "Crédit accordé ✓",
      creditBalance: "Solde crédit", creditValidity: "Valable 90 jours, utilisable sur les prochaines commandes.", creditBtn: "Crédit",
      paid: "encaissé", pending: "en attente", cash: "espèces", profitNote: "Estimation marge (60%)", margin: "Marge estimée",
      stock: "Stock", bookings: "Réservations", highlights: "Actus",
      stockItem: "Article", qty: "Quantité", threshold: "Seuil bas", availability: "Disponibilité",
      avail: "Disponible", soldout: "Épuisé", restock: "Réappro.", lowStock: "Stock bas",
      agentTitle: "Agent IA Stock (24/7)", agentDesc: "Surveille le stock en continu, met les articles en « épuisé » automatiquement et te prévient quand réapprovisionner.",
      agentActions: "Actions automatiques", agentRecs: "Recommandations", runAgent: "Lancer l'agent", noActions: "Tout est à jour ✓",
      bkClient: "Client", bkEvent: "Événement", bkWhen: "Date", bkSize: "Volume", bkQuote: "Devis", bkStatus: "Statut", bkPlace: "Lieu",
      bkNew: "Nouveau", bkContacted: "Contacté", bkConfirmed: "Confirmé", bkDeclined: "Refusé", noBookings: "Aucune réservation pour le moment.",
      saleTitle: "Enregistrer une vente (espèces / TPE)", saleMethod: "Moyen", saleAdd: "+ Article", saleCustomer: "Client (optionnel)",
      saleSave: "Enregistrer la vente", saleTotal: "Total", posTitle: "Caisse / TPE (POS)",
      posDesc: "Connectez un terminal de carte ou une caisse pour enregistrer automatiquement les ventes ici. Disponible si votre fournisseur propose une API (Square, SumUp, Yoco…). Sinon, utilisez « Vente espèces / TPE ».",
      posEnable: "Intégration POS / TPE", posProvider: "Fournisseur (ex : SumUp)",
      hlAdminTitle: "Actus & annonces", hlAdminDesc: "Ces images apparaissent sur la page d'accueil, section « Les actus de Marie ». Colle un lien d'image et une légende.",
      img: "Lien de l'image", capFr: "Légende (FR)", capEn: "Légende (EN)",
      photos: "Photos menu", photoTitle: "Photos des produits", photoDesc: "Chaque produit a une illustration par défaut. Importez une vraie photo (depuis votre téléphone) pour la remplacer. La photo s'affiche aussitôt sur le site.",
      uploadPhoto: "📷 Importer une photo", removePhoto: "Remettre l'illustration", generated: "Illustration", realPhoto: "Photo",
      depositLabel: "Acompte", balanceLabel: "Solde", balanceDue: "Solde à la livraison", depositTake: "💰 Prendre un acompte",
      markSettled: "✅ Encaisser le solde & clôturer", settleTitle: "Encaisser & consolider", depositAmount: "Montant de l'acompte",
      depositMethod: "Moyen (Mobile Money)", balanceMethod: "Règlement du solde", settleDo: "Confirmer l'encaissement",
      depositTaken: "Acompte enregistré ✓", settledOk: "Commande soldée ✓", depositsHeld: "Acomptes encaissés",
      balancesDue: "Soldes à encaisser", awaitBalance: "en attente de solde",
      settleNote: "L'acompte et le solde sont regroupés en une seule transaction et enregistrés dans les totaux du jour et les finances.",
      saleDeposit: "Encaisser un acompte (Mobile Money), solde à la livraison",
      closedTitle: "Boutique en pause", closedOn: "Fermé", closedOff: "Ouvert",
      closedDesc: "Affiche un bandeau « en pause » en haut du site et suspend les commandes. Active-le pendant les heures creuses : la nuit après la fermeture, le matin avant l'ouverture."
    },
    en: {
      dash: "Dashboard", orders: "Orders", clients: "Clients (CRM)", finances: "Finances",
      satisfaction: "Satisfaction", truck: "Find the truck", events: "Events", settings: "Socials & Payments",
      site: "View site", logout: "Log out", revenue: "Revenue", ordersN: "Orders",
      aov: "Avg. order", newC: "New clients", revTrend: "Revenue trend",
      byLoc: "Revenue by location", topP: "Top products", payMix: "Payment methods", typeMix: "Order type",
      recent: "Recent orders", avgRating: "Average rating", ratings: "reviews", search: "Search…",
      all: "All", status: "Status", client: "Client", total: "Total", date: "Date", pay: "Payment", actions: "",
      lifetime: "Spent", count: "Ord", badge: "Badge", phone: "Phone", lastOrder: "Last order",
      saveSched: "Save schedule", addRow: "+ Add a slot", autoTitle: "Automate “Find the truck”",
      autoDesc: "Turn on the weekly reminder to update locations. Your changes publish to the site instantly.",
      autoOn: "Weekly reminder", publishNote: "Note of the week (shown on site)",
      day: "Day", place: "Place", hours: "Hours", maps: "Maps query", saved: "Saved ✓",
      satGood: "Happy clients", satLow: "To improve", reviews: "Latest reviews", noReviews: "No reviews yet.",
      addEvent: "+ New event", evTitle: "Event", guests: "Guests", evStatus: "Status", evDate: "Date",
      socials: "Social media", socialsDesc: "These links power the site and share buttons.",
      payTitle: "Payment methods", payDesc: "Toggle providers. Keys are added server-side (.env). Until a key is connected, the site charges in demo mode.",
      live: "On", off: "Off", needKey: "key required", confirmReset: "Reset all demo data?",
      welcome: "Hi Marie 👋", today: "Today", expCsv: "Export CSV", money30: "in period", vsPrev: "vs prev.",
      pDay: "Day", pWeek: "Week", pMonth: "Month", pQuarter: "Quarter", pYear: "Year",
      budgetTitle: "Budget & profitability", budgetDesc: "Enter your costs to compute gross margin, profit and profitability for the selected period.",
      bRevenue: "Revenue", bCogsPct: "Direct costs (ingredients) %", bDirect: "Direct costs", bGrossProfit: "Gross profit",
      bGrossMargin: "Gross margin rate", bFixed: "Fixed costs / month", bFixedPeriod: "Fixed costs (period)",
      bNetProfit: "Net profit", bNetMargin: "Net margin", bTarget: "Revenue target / month", bTargetProgress: "Target reached",
      bForPeriod: "for the selected period", bSave: "Save budget",
      team: "Team", empTitle: "Employee management", empAdd: "+ Add employee", empEdit: "Employee file",
      empName: "Full name", empRole: "Role / Position", empContract: "Contract type", empStart: "Start date",
      empTenure: "Tenure", empCnps: "CNPS number", empCni: "National ID (CNI)", empPassport: "Passport no.",
      empPhone: "Phone", empEmail: "Email", empAddress: "Address", empPhoto: "Photo / Selfie", empStatus: "Status",
      empDocs: "Administrative documents", empUploadDoc: "Upload", empNoDoc: "No file", empView: "View",
      empPay: "Payment history", empPayAmount: "Amount", empPayPeriod: "Period", empPayMethod: "Method",
      empSendSalary: "💸 Send salary + notify", empAddPay: "Record a payment",
      empLink: "Employee space link (read-only)", empCopyLink: "Copy link", empCopied: "Link copied ✓",
      empActive: "Active", empInactive: "Inactive", empSave: "Save file", empDelete: "Delete",
      empSalarySent: "Salary recorded + message ready 💬", empAgent: "AI payroll agent", empAgentDesc: "Each time a salary is sent, the employee automatically gets a WhatsApp confirmation.",
      prep: "Prep time", prepTitle: "Preparation time (AI)", prepDesc: "The algorithm learns each product's real prep time and readjusts every 14 days. The AI stays in the lead; in manual mode your values apply.",
      aiPrepAgent: "AI prep-time agent", aiPrepDesc: "When ON, the AI learns, sets prep times and advances statuses automatically (received -> preparing -> ready). Turn OFF to manage everything manually.",
      aiOn: "AI on", aiOff: "Manual", prepProduct: "Product", prepDef: "Default", prepLearned: "Learned (AI)", prepManual: "Manual", prepSamples: "Samples (14d)", prepUsed: "Used", prepLastAdj: "Last adjust", prepNever: "never",
      autoAccept: "Auto-accept orders", autoAcceptDesc: "If ON, new orders are accepted automatically and tracking starts. Otherwise accept them manually.",
      accept: "Accept", pendingN: "to accept", min: "min",
      autoTracker: "Automatic tracking", autoTrackerDesc: "When ON, the tracker advances by itself using the prep time (received → preparing → ready), regardless of how the order was accepted. Turn OFF to move statuses by hand.",
      trackerOn: "Auto", trackerOff: "Manual",
      creditGrant: "Grant credit", creditTo: "to", creditType: "Type", creditRefund: "Refund", creditGoodwill: "Goodwill",
      creditAmount: "Credit amount", creditNote: "Note (optional)", creditGive: "Grant credit", creditGranted: "Credit granted ✓",
      creditBalance: "Credit balance", creditValidity: "Valid 90 days, usable on next orders.", creditBtn: "Credit",
      paid: "collected", pending: "pending", cash: "cash", profitNote: "Margin estimate (60%)", margin: "Est. margin",
      stock: "Stock", bookings: "Bookings", highlights: "Highlights",
      stockItem: "Item", qty: "Quantity", threshold: "Low threshold", availability: "Availability",
      avail: "Available", soldout: "Sold out", restock: "Restock", lowStock: "Low stock",
      agentTitle: "AI Stock Agent (24/7)", agentDesc: "Continuously watches stock, auto-marks items sold out, and alerts you when to restock.",
      agentActions: "Automatic actions", agentRecs: "Recommendations", runAgent: "Run agent", noActions: "All up to date ✓",
      bkClient: "Client", bkEvent: "Event", bkWhen: "Date", bkSize: "Size", bkQuote: "Quote", bkStatus: "Status", bkPlace: "Place",
      bkNew: "New", bkContacted: "Contacted", bkConfirmed: "Confirmed", bkDeclined: "Declined", noBookings: "No bookings yet.",
      saleTitle: "Record a sale (cash / card terminal)", saleMethod: "Method", saleAdd: "+ Item", saleCustomer: "Customer (optional)",
      saleSave: "Save sale", saleTotal: "Total", posTitle: "Till / Card terminal (POS)",
      posDesc: "Connect a card terminal or till to auto-log sales here. Available if your provider offers an API (Square, SumUp, Yoco…). Otherwise use ‘Record a sale’.",
      posEnable: "POS / terminal integration", posProvider: "Provider (e.g. SumUp)",
      hlAdminTitle: "News & announcements", hlAdminDesc: "These images show on the homepage ‘Marie's highlights’ section. Paste an image link and a caption.",
      img: "Image link", capFr: "Caption (FR)", capEn: "Caption (EN)",
      photos: "Menu photos", photoTitle: "Product photos", photoDesc: "Every product has a default illustration. Upload a real photo (from your phone) to replace it. It shows on the site right away.",
      uploadPhoto: "📷 Upload a photo", removePhoto: "Back to illustration", generated: "Illustration", realPhoto: "Photo",
      depositLabel: "Deposit", balanceLabel: "Balance", balanceDue: "Balance on delivery", depositTake: "💰 Take a deposit",
      markSettled: "✅ Collect balance & close", settleTitle: "Settle & consolidate", depositAmount: "Deposit amount",
      depositMethod: "Method (Mobile Money)", balanceMethod: "Balance payment", settleDo: "Confirm settlement",
      depositTaken: "Deposit recorded ✓", settledOk: "Order settled ✓", depositsHeld: "Deposits held",
      balancesDue: "Balances due", awaitBalance: "awaiting balance",
      settleNote: "Deposit and balance are merged into one transaction and logged to daily totals and finances.",
      saleDeposit: "Take a deposit now (Mobile Money), balance on delivery",
      closedTitle: "Shop on break", closedOn: "Closed", closedOff: "Open",
      closedDesc: "Shows a 'on a break' banner at the top of the site and pauses ordering. Turn it on during idle hours: at night after closing, in the morning before opening."
    }
  };
  const t = k => (A[L()] && A[L()][k]) || A.fr[k] || k;

  // ---- login gate ----
  const PASS_KEY = "lgm_admin_ok";
  const ADMIN_USER = localStorage.getItem("lgm_admin_user") || "marie";
  const ADMIN_PASS = localStorage.getItem("lgm_admin_pass") || "gaufre2025";
  function gate() {
    if (sessionStorage.getItem(PASS_KEY) === "1") { $("#gate").style.display = "none"; return true; }
    $("#gate").style.display = "grid";
    const fail = () => { $("#gateErr").textContent = L() === "en" ? "Wrong username or password." : "Identifiant ou mot de passe incorrect."; $("#gatePass").style.borderColor = "var(--coral)"; $("#gatePass").value = ""; };
    const ok = () => { sessionStorage.setItem(PASS_KEY, "1"); $("#gate").style.display = "none"; boot(); };
    const tryLogin = async () => {
      const u = ($("#gateUser").value || "").trim(), p = ($("#gatePass").value || "").trim();
      if (!u || !p) return fail();
      // 1) try real server-side auth (used in production behind the Node backend)
      try {
        const r = await fetch((window.LGM_API_BASE || "") + "/api/admin/login", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user: u, pass: p })
        });
        if (r.status === 200) { const j = await r.json(); if (j.ok && j.token) { sessionStorage.setItem("lgm_admin_token", j.token); return ok(); } return fail(); }
        if (r.status === 429) { const j = await r.json().catch(() => ({})); const m = Math.ceil((j.retryAfter || 900) / 60); $("#gateErr").textContent = L() === "en" ? `Too many attempts. Locked for ~${m} min.` : `Trop de tentatives. Bloqué ~${m} min.`; $("#gatePass").value = ""; return; }
        if (r.status === 401) { const j = await r.json().catch(() => ({})); $("#gatePass").value = ""; $("#gatePass").style.borderColor = "var(--coral)"; $("#gateErr").textContent = (L() === "en" ? "Wrong username or password." : "Identifiant ou mot de passe incorrect.") + (j.remaining != null ? ` (${j.remaining})` : ""); return; }
        // any other status (e.g. 404 on the static demo) -> fall through to local check
      } catch (e) { /* no backend reachable (static demo) -> local check */ }
      // 2) local fallback for the static/offline demo
      if (u.toLowerCase() === ADMIN_USER.toLowerCase() && p === ADMIN_PASS) ok(); else fail();
    };
    $("#gateBtn").onclick = tryLogin;
    $("#gatePass").addEventListener("keydown", e => { if (e.key === "Enter") tryLogin(); });
    $("#gateUser").addEventListener("keydown", e => { if (e.key === "Enter") $("#gatePass").focus(); });
    return false;
  }

  // ---- nav ----
  function initNav() {
    $$(".navlink[data-view]").forEach(b => b.onclick = () => showView(b.dataset.view));
    $("#logoutBtn").onclick = () => { sessionStorage.removeItem(PASS_KEY); location.reload(); };
    $("#langBtn").onclick = () => { LGM.setLang(L() === "fr" ? "en" : "fr"); render(); };
    $("#menuBtn") && ($("#menuBtn").onclick = e => { e.stopPropagation(); $(".side").classList.toggle("open"); });
    // tap the main area to close the open sidebar on mobile
    document.addEventListener("click", e => { const s = $(".side"); if (s && s.classList.contains("open") && !s.contains(e.target) && !(e.target.closest && e.target.closest("#menuBtn"))) s.classList.remove("open"); });
    $$(".range-seg button").forEach(b => b.onclick = () => { period = b.dataset.p; $$(".range-seg button").forEach(x => x.classList.toggle("on", x === b)); render(); });
    $("#recordSale") && ($("#recordSale").onclick = openSale);
    $("#saleClose") && ($("#saleClose").onclick = () => $("#saleModal").classList.remove("open"));
    $("#saleModal") && $("#saleModal").addEventListener("click", e => { if (e.target.id === "saleModal") $("#saleModal").classList.remove("open"); });
    $("#creditClose") && ($("#creditClose").onclick = () => $("#creditModal").classList.remove("open"));
    $("#creditModal") && $("#creditModal").addEventListener("click", e => { if (e.target.id === "creditModal") $("#creditModal").classList.remove("open"); });
    $("#empClose") && ($("#empClose").onclick = () => $("#empModal").classList.remove("open"));
    $("#empModal") && $("#empModal").addEventListener("click", e => { if (e.target.id === "empModal") $("#empModal").classList.remove("open"); });
    $("#settleClose") && ($("#settleClose").onclick = () => $("#settleModal").classList.remove("open"));
    $("#settleModal") && $("#settleModal").addEventListener("click", e => { if (e.target.id === "settleModal") $("#settleModal").classList.remove("open"); });
  }
  function showView(v) {
    $$(".view").forEach(x => x.classList.toggle("active", x.id === "view-" + v));
    $$(".navlink[data-view]").forEach(b => b.classList.toggle("active", b.dataset.view === v));
    $(".side").classList.remove("open");
    $("#viewTitle").textContent = t(v === "dash" ? "dash" : v);
    render();
  }
  function currentView() { return ($(".view.active") || {}).id?.replace("view-", "") || "dash"; }

  function toast(m) { let e = $("#toast"); e.textContent = m; e.classList.add("show"); clearTimeout(e._t); e._t = setTimeout(() => e.classList.remove("show"), 2000); }

  // ---- chart helper ----
  function mkChart(id, cfg) { if (charts[id]) charts[id].destroy(); const el = $("#" + id); if (!el) return; charts[id] = new Chart(el, cfg); }
  Chart.defaults.font.family = "Inter"; Chart.defaults.color = "#8a6c54";
  // on-slice % labels (chartjs-plugin-datalabels), off by default, enabled per doughnut
  if (window.ChartDataLabels) { Chart.register(window.ChartDataLabels); Chart.defaults.set("plugins.datalabels", { display: false }); }
  const pct = (v, arr) => { const tot = arr.reduce((s, x) => s + x, 0) || 1; return Math.round(v / tot * 100); };
  // doughnut with percentages on slices + precise tooltips
  function doughnutCfg(labels, data, colors, money) {
    return {
      type: "doughnut",
      data: { labels, datasets: [{ data, backgroundColor: colors, borderColor: "#fff", borderWidth: 2 }] },
      options: {
        cutout: "58%", maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { boxWidth: 12, padding: 10, font: { size: 11 },
            generateLabels: ch => ch.data.labels.map((l, i) => { const d = ch.data.datasets[0].data; return { text: `${l}  ${pct(d[i], d)}%`, fillStyle: ch.data.datasets[0].backgroundColor[i], strokeStyle: "#fff", index: i }; }) } },
          tooltip: { callbacks: { label: c => ` ${c.label}: ${money ? fmt(c.parsed) : c.parsed} (${pct(c.parsed, c.dataset.data)}%)` } },
          datalabels: window.ChartDataLabels ? { display: true, color: "#fff", font: { weight: 700, size: 11 },
            formatter: (v, ctx) => { const p = pct(v, ctx.dataset.data); return p >= 7 ? p + "%" : ""; } } : undefined
        }
      }
    };
  }

  // ===================== DASHBOARD =====================
  const POT_COLORS = ["#E8394A", "#E89A5C", "#d99a4e", "#8a4f1e", "#6bbf59", "#7b5cff", "#3aa0e8"];
  function renderDash() {
    const a = S.analytics(period, L());
    $("#kpis").innerHTML = [
      kpi("💰", t("revenue"), fmt(a.revenue), a.deltaRevenue, "#E8394A22"),
      kpi("🧾", t("ordersN"), a.count, a.deltaCount, "#E89A5C22"),
      kpi("🛒", t("aov"), fmt(Math.round(a.aov)), null, "#d99a4e22"),
      kpi("⭐", t("avgRating"), a.avgRating.toFixed(2) + "/5", null, "#2e7d3222")
    ].join("");

    // revenue trend (precise buckets for the chosen period) — line + per-bucket order counts
    mkChart("chRev", {
      type: "line",
      data: { labels: a.series.labels, datasets: [{ label: t("revenue"), data: a.series.data, borderColor: "#E8394A", backgroundColor: "rgba(232,57,74,.12)", fill: true, tension: .3, pointRadius: a.series.data.length > 40 ? 0 : 3, pointBackgroundColor: "#E8394A", borderWidth: 2.5 }] },
      options: baseOpt({ y: true, x: true, money: true, legend: true, counts: a.series.counts })
    });
    // by location (with %)
    const locs = Object.entries(a.byLoc).sort((x, y) => y[1] - x[1]);
    mkChart("chLoc", doughnutCfg(locs.map(l => l[0]), locs.map(l => l[1]), POT_COLORS, true));
    // top products
    $("#topProducts").innerHTML = a.topProducts.length ? a.topProducts.map((p, i) => {
      const max = a.topProducts[0].revenue || 1;
      return `<div class="lrow" style="display:block;border:0;padding:7px 0">
        <div style="display:flex;justify-content:space-between"><b style="color:var(--chocolate)">${i + 1}. ${p.name}</b><span style="font-weight:700">${fmt(p.revenue)}</span></div>
        <div class="bar"><i style="width:${Math.round(p.revenue / max * 100)}%"></i></div>
        <small class="muted">${p.qty} ${L() === "en" ? "sold" : "vendus"}</small></div>`;
    }).join("") : `<div class="empty">—</div>`;
    // payment mix (with %)
    const pm = Object.entries(a.byPay).sort((x, y) => y[1] - x[1]);
    mkChart("chPay", doughnutCfg(pm.map(p => payName(p[0])), pm.map(p => p[1]), POT_COLORS, false));
    // recent orders
    $("#dashOrders").innerHTML = ordersTable(S.orders().slice(0, 6), true);
    wireStatus($("#dashOrders"));
  }
  function kpi(ic, label, val, delta, bg) {
    return `<div class="card kpi"><div class="ic" style="background:${bg}">${ic}</div>
      <div class="label">${label}</div><div class="val">${val}</div>
      ${delta != null ? `<div class="delta ${delta >= 0 ? "up" : "down"}">${delta >= 0 ? "▲" : "▼"} ${Math.abs(delta)}% <span class="muted" style="font-weight:400">${t("vsPrev")}</span></div>` : `<div class="delta">&nbsp;</div>`}</div>`;
  }
  function baseOpt(ax) {
    return {
      maintainAspectRatio: false,
      plugins: {
        legend: { display: !!ax.legend, position: "top", labels: { boxWidth: 12, font: { size: 11 } } },
        datalabels: { display: false },
        tooltip: {
          backgroundColor: "rgba(58,26,6,.95)", padding: 10, titleFont: { size: 12 }, bodyFont: { size: 12 },
          callbacks: {
            label: c => { const lbl = c.dataset.label ? c.dataset.label + ": " : " "; return lbl + (ax.money ? fmt(c.parsed.y != null ? c.parsed.y : c.parsed) : (c.parsed.y != null ? c.parsed.y : c.parsed)); },
            afterLabel: ax.counts ? (c => { const n = (ax.counts[c.dataIndex] || 0); return n ? `${n} ${L() === "en" ? "orders" : "commandes"}` : ""; }) : undefined
          }
        }
      },
      scales: {
        x: { display: ax.x !== false, grid: { display: false }, ticks: { maxRotation: ax.rotate ? 45 : 0, autoSkip: true, maxTicksLimit: 14, font: { size: 10 } } },
        y: { display: ax.y !== false, beginAtZero: true, grid: { color: "#f0e6da" }, ticks: { precision: 0, callback: v => ax.money ? (v >= 1000 ? (v / 1000) + "k" : v) : v, font: { size: 10 } } }
      }
    };
  }
  const fmtDay = d => { const dt = new Date(d); return dt.toLocaleDateString(L() === "en" ? "en-GB" : "fr-FR", { day: "2-digit", month: "short" }); };
  function payName(id) { const p = LGM.payments.find(x => x.id === id); return p ? LGM.nm(p) : id; }

  // ===================== ORDERS =====================
  let orderFilter = "all", orderSearch = "";
  function renderOrders() {
    const set = S.settings(); const auto = !!(set.aiAgent && set.aiAgent.autoAccept);
    const autoTrk = !(set.aiAgent && set.aiAgent.autoTracker === false);
    // open/closed (idle-time pause) banner toggle
    const closed = !!set.closed;
    $("#closedToggleCard").innerHTML = `
      <div class="agent-banner" style="align-items:center">
        <div class="agent-ic" style="background:linear-gradient(135deg,${closed ? "#c0392b,#e8623a" : "#2e7d32,#6bbf59"})">${closed ? "🌙" : "🧇"}</div>
        <div style="flex:1"><h3 style="margin:0">${t("closedTitle")}</h3><p class="sub" style="color:var(--muted)">${t("closedDesc")}</p></div>
        <div style="display:flex;align-items:center;gap:10px"><span class="tag" style="background:${closed ? "#c0392b" : "#2e7d32"}">${closed ? t("closedOn") : t("closedOff")}</span><button class="toggle ${closed ? "on" : ""}" id="closedToggle"></button></div>
      </div>
      ${closed ? `<div class="closed-preview">🧇 ${LGM.closedText(L())}</div>` : ""}`;
    $("#closedToggle").onclick = () => { S.saveSettings({ closed: !closed }); toast(!closed ? "🌙 " + t("closedOn") : "🧇 " + t("closedOff")); renderOrders(); };
    const pending = S.orders().filter(o => o.status === "pending");
    // two independent toggles: accept gate + auto tracker
    $("#orderAccept").innerHTML = `
      <div class="agent-banner" style="align-items:center">
        <div class="agent-ic" style="background:linear-gradient(135deg,#caa14a,#e8c46a)">✋</div>
        <div style="flex:1"><h3 style="margin:0">${t("autoAccept")}</h3><p class="sub" style="color:var(--muted)">${t("autoAcceptDesc")}</p></div>
        <div style="display:flex;align-items:center;gap:10px">${pending.length ? `<span class="tag" style="background:#caa14a">${pending.length} ${t("pendingN")}</span>` : ""}<small class="muted">${auto ? t("trackerOn") : t("trackerOff")}</small><button class="toggle ${auto ? "on" : ""}" id="autoAcceptToggle"></button></div>
      </div>
      <div class="agent-banner" style="align-items:center;margin-top:12px">
        <div class="agent-ic" style="background:linear-gradient(135deg,#7b5cff,#a78bff)">⏱️</div>
        <div style="flex:1"><h3 style="margin:0">${t("autoTracker")}</h3><p class="sub" style="color:var(--muted)">${t("autoTrackerDesc")}</p></div>
        <div style="display:flex;align-items:center;gap:10px"><small class="muted">${autoTrk ? t("trackerOn") : t("trackerOff")}</small><button class="toggle ${autoTrk ? "on" : ""}" id="autoTrackerToggle"></button></div>
      </div>`;
    $("#autoAcceptToggle").onclick = () => { const a = Object.assign({}, set.aiAgent); a.autoAccept = !auto; S.saveSettings({ aiAgent: a }); toast(t("saved")); renderOrders(); };
    $("#autoTrackerToggle").onclick = () => { const a = Object.assign({}, set.aiAgent); a.autoTracker = !autoTrk; S.saveSettings({ aiAgent: a }); toast(t("saved")); renderOrders(); };
    // live tracker board (matches the customer view) for active orders
    const active = S.orders().filter(o => !["completed", "cancelled"].includes(o.status)).slice(0, 8);
    $("#orderBoard").innerHTML = active.length ? `<div class="board-grid">${active.map(o => `
      <div class="board-card ${o.fulfilMode === "planned" ? "planned" : "asap"}">
        <div class="board-top"><div><b>${o.ref}</b> ${whenTag(o)}<br><small class="muted">${o.customerName} · ${o.items.reduce((s, i) => s + i.qty, 0)} ${L() === "en" ? "items" : "art."}</small></div>
          ${o.status === "pending" ? `<button class="btn coral sm" data-accept="${o.id}">${t("accept")}</button>` : ""}</div>
        ${LGM.trackerHTML(o, L())}
        ${depStrip(o)}
        ${o.status !== "pending" ? `<select class="status-select" data-oid="${o.id}" style="margin-top:8px;width:100%">${LGM.orderStatuses.filter(s => s.id !== "pending").map(s => `<option value="${s.id}" ${s.id === o.status ? "selected" : ""}>${s.emoji} ${LGM.nm(s)}</option>`).join("")}</select>` : ""}
        ${boardActions(o)}
      </div>`).join("")}</div>` : `<div class="empty">${L() === "en" ? "No active orders" : "Aucune commande active"}</div>`;
    $$("[data-accept]", $("#orderBoard")).forEach(b => b.onclick = () => { const o = S.acceptOrder(b.dataset.accept); if (o && o.customerPhone) notifyWhatsApp(o, "received"); renderOrders(); toast("✓ " + LGM.nm(LGM.statusMeta("received"))); });
    $$("[data-settle]", $("#orderBoard")).forEach(b => b.onclick = () => openSettle(b.dataset.settle));
    $$("[data-deposit]", $("#orderBoard")).forEach(b => b.onclick = () => openDeposit(b.dataset.deposit));
    wireStatus($("#orderBoard"));

    $("#orderStatusFilter").innerHTML = `<option value="all">${t("all")} (${t("status")})</option>` + LGM.orderStatuses.map(s => `<option value="${s.id}">${LGM.nm(s)}</option>`).join("");
    $("#orderStatusFilter").value = orderFilter;
    $("#orderStatusFilter").onchange = e => { orderFilter = e.target.value; renderOrders(); };
    $("#orderSearch").placeholder = t("search"); $("#orderSearch").value = orderSearch;
    $("#orderSearch").oninput = e => { orderSearch = e.target.value.toLowerCase(); draw(); };
    $("#exportOrders").onclick = exportCsv;
    function draw() {
      let list = S.orders();
      if (orderFilter !== "all") list = list.filter(o => o.status === orderFilter);
      if (orderSearch) list = list.filter(o => (o.ref + o.customerName + o.location).toLowerCase().includes(orderSearch));
      $("#ordersTable").innerHTML = ordersTable(list, false);
      wireStatus($("#ordersTable"));
    }
    draw();
  }
  function fulfilCell(o) {
    const f = LGM.fulfilmentMeta(o.type);
    const where = o.type === "delivery" ? (o.address || "—") : (o.location || "—");
    return `${f.emoji} ${LGM.nm(f)}<br><small class="muted">${where}</small>`;
  }
  // ---- ASAP vs scheduled (planned) order tag ----
  function whenTag(o) {
    if (o.fulfilMode === "planned" && o.plannedAt) {
      const d = new Date(o.plannedAt), loc = L() === "en" ? "en-GB" : "fr-FR";
      return `<span class="when-tag planned">📅 ${L() === "en" ? "Scheduled" : "Planifiée"} · ${d.toLocaleDateString(loc, { day: "2-digit", month: "short" })} ${o.plannedSlot || d.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit" })}</span>`;
    }
    return `<span class="when-tag asap">⚡ ${L() === "en" ? "ASAP" : "Immédiate"}</span>`;
  }
  // ---- two-stage payment: deposit strip + board actions ----
  function depStrip(o) {
    if (o.paymentMode !== "twostage") return "";
    const dep = (o.deposit && o.deposit.amount) || 0;
    const settled = !!o.settlement;
    const bal = settled ? o.settlement.balanceAmount : Math.max(0, o.total - dep);
    const balMethod = settled ? o.settlement.balanceMethod : (o.balanceMethod || "cash");
    return `<div class="dep-strip ${settled ? "done" : ""}">
      <div class="dep-row"><span>${t("depositLabel")} · ${payName((o.deposit && o.deposit.method) || "")}</span><b>${fmt(dep)} ✓</b></div>
      <div class="dep-row"><span>${settled ? t("balanceLabel") + " · " + payName(balMethod) : t("balanceDue")}</span><b class="${settled ? "" : "due"}">${fmt(bal)} ${settled ? "✓" : "⏳"}</b></div>
    </div>`;
  }
  function boardActions(o) {
    const settle = o.paymentMode === "twostage" && !o.settlement
      ? `<button class="btn coral sm" data-settle="${o.id}">${t("markSettled")}</button>` : "";
    const deposit = !o.paymentMode && o.paymentStatus !== "paid" && !["completed", "cancelled"].includes(o.status)
      ? `<button class="btn ghost sm" data-deposit="${o.id}">${t("depositTake")}</button>` : "";
    return (settle || deposit) ? `<div class="board-actions">${settle}${deposit}</div>` : "";
  }
  // record a deposit (mobile money) on an existing order → turns it two-stage
  function openDeposit(id) {
    const o = S.orders().find(x => x.id === id); if (!o) return;
    let dmethod = "wave";
    const momo = LGM.payments.filter(p => p.kind === "momo");
    const suggested = Math.round(o.total * 0.3 / 100) * 100;
    $("#settleTitle").textContent = t("depositTake").replace(/^💰\s*/, "") + " · " + o.ref;
    $("#settleModal").classList.add("open");
    $("#settleBody").innerHTML = `
      <div class="bo"><span>${t("total")}</span><b>${fmt(o.total)}</b></div>
      <div class="field" style="margin-top:12px"><label>${t("depositAmount")}</label><input id="depAmt" type="number" min="0" max="${o.total}" value="${suggested}"></div>
      <div class="dr-section-label" style="color:var(--chocolate-2)">${t("depositMethod")}</div>
      <div class="seg-pills" id="depPills" style="margin-bottom:14px">
        ${momo.map(p => `<button type="button" class="seg-pill ${p.id === dmethod ? "on" : ""}" data-dm="${p.id}" style="${p.id === dmethod ? "background:var(--coral);color:#fff;" : ""}border-color:var(--line)">${p.emoji} ${LGM.nm(p)}</button>`).join("")}
      </div>
      <div id="depPreview" class="pay-note" style="background:rgba(217,154,78,.14);border:1px solid rgba(217,154,78,.4);color:#7a5a18"></div>
      <button class="btn coral" id="depGo" style="width:100%;margin-top:14px">${t("depositTake").replace(/^💰\s*/, "")}</button>`;
    const preview = () => { const a = Math.min(o.total, +$("#depAmt").value || 0); $("#depPreview").innerHTML = `${t("depositLabel")}: <b>${fmt(a)}</b> &nbsp;·&nbsp; ${t("balanceDue")}: <b>${fmt(Math.max(0, o.total - a))}</b>`; };
    $$("#depPills .seg-pill").forEach(p => p.onclick = () => { dmethod = p.dataset.dm; $$("#depPills .seg-pill").forEach(x => { const on = x === p; x.classList.toggle("on", on); x.style.background = on ? "var(--coral)" : ""; x.style.color = on ? "#fff" : "var(--chocolate)"; }); });
    $("#depAmt").oninput = preview; preview();
    $("#depGo").onclick = () => {
      const a = +$("#depAmt").value || 0; if (a <= 0) return toast(L() === "en" ? "Enter an amount" : "Saisis un montant");
      const r = S.takeDeposit(id, a, dmethod);
      if (r.error) return toast("⚠️");
      $("#settleModal").classList.remove("open"); toast("💰 " + t("depositTaken")); renderOrders();
    };
  }
  // collect the balance + consolidate both payments into one settled transaction
  function openSettle(id) {
    const o = S.orders().find(x => x.id === id); if (!o) return;
    const dep = (o.deposit && o.deposit.amount) || 0;
    const bal = Math.max(0, o.total - dep);
    let bmethod = o.balanceMethod || "cash";
    const balMethods = LGM.payments.filter(p => p.kind === "cash" || p.kind === "momo");
    $("#settleTitle").textContent = t("settleTitle") + " · " + o.ref;
    $("#settleModal").classList.add("open");
    const dm = LGM.payments.find(p => p.id === ((o.deposit && o.deposit.method) || "")) || {};
    $("#settleBody").innerHTML = `
      <div class="settle-hero">
        <span class="sh-label">${t("balanceLabel")} · ${L() === "en" ? "to collect now" : "à encaisser maintenant"}</span>
        <span class="sh-amt">${fmt(bal)}</span>
      </div>
      <div class="settle-breakdown">
        <div class="sb-row"><span>${t("total")}</span><b>${fmt(o.total)}</b></div>
        <div class="sb-row paid"><span><span class="sb-badge">✓ ${L() === "en" ? "paid" : "payé"}</span> ${t("depositLabel")} <span class="sb-chip" style="background:${dm.color || "#8a6c54"}">${dm.emoji || ""} ${LGM.nm(dm) || payName((o.deposit && o.deposit.method) || "")}</span></span><b>−${fmt(dep)}</b></div>
        <div class="sb-row bal"><span>${t("balanceLabel")}</span><b>${fmt(bal)}</b></div>
      </div>
      <div class="dr-section-label" style="color:var(--chocolate-2);margin-top:16px">${t("balanceMethod")}</div>
      <div class="seg-pills settle-pills" id="balPills" style="margin:8px 0 14px">
        ${balMethods.map(p => `<button type="button" class="seg-pill ${p.id === bmethod ? "on" : ""}" data-bm="${p.id}">${p.emoji} ${LGM.nm(p)}</button>`).join("")}
      </div>
      <div class="settle-note">🔗 ${t("settleNote")}</div>
      <button class="btn coral settle-confirm" id="settleGo">${t("settleDo")}</button>`;
    $$("#balPills .seg-pill").forEach(p => p.onclick = () => { bmethod = p.dataset.bm; $$("#balPills .seg-pill").forEach(x => x.classList.toggle("on", x === p)); });
    $("#settleGo").onclick = () => {
      S.settleOrder(id, bmethod);
      $("#settleModal").classList.remove("open"); toast("✅ " + t("settledOk"));
      const o2 = S.orders().find(x => x.id === id); if (o2 && o2.customerPhone) notifyWhatsApp(o2, "completed");
      renderOrders(); if (currentView() === "dash") renderDash();
    };
  }
  function ordersTable(list, compact) {
    if (!list.length) return `<div class="empty">— ${L() === "en" ? "No orders" : "Aucune commande"} —</div>`;
    return `<table><thead><tr>
      <th>${t("date")}</th><th>Ref</th><th>${t("client")}</th>${compact ? "" : `<th>${L() === "en" ? "Items" : "Articles"}</th><th>${L() === "en" ? "Fulfilment" : "Récupération"}</th>`}<th>${t("pay")}</th><th>${t("total")}</th><th>${t("status")}</th>${compact ? "" : `<th></th>`}</tr></thead><tbody>
      ${list.map(o => {
        const st = LGM.statusMeta(o.status);
        return `<tr class="${o.fulfilMode === "planned" ? "row-planned" : ""}"><td>${new Date(o.createdAt).toLocaleDateString(L() === "en" ? "en-GB" : "fr-FR", { day: "2-digit", month: "short" })}<br><small class="muted">${new Date(o.createdAt).toLocaleTimeString(L() === "en" ? "en-GB" : "fr-FR", { hour: "2-digit", minute: "2-digit" })}</small></td>
          <td><b>${o.ref}</b><br>${whenTag(o)}</td>
          <td><div class="cust-cell"><div class="avatar">${initials(o.customerName)}</div><div>${o.customerName}<br><small class="muted">${o.customerPhone || ""}</small></div></div></td>
          ${compact ? "" : `<td>${o.items.map(i => `${i.qty}× ${L() === "en" ? (LGM.menu.find(m => m.id === i.id)?.en || i.name) : i.name}`).join("<br>")}</td><td>${fulfilCell(o)}</td>`}
          <td>${payChip(o.payment)}<br><small class="muted">${o.paymentMode === "twostage" && !o.settlement ? "💰 " + fmt((o.deposit && o.deposit.amount) || 0) + " · " + t("awaitBalance") : (o.paymentStatus === "paid" ? "✓ " + t("paid") : "⏳ " + t("pending"))}</small></td>
          <td><b>${fmt(o.total)}</b></td>
          <td><select class="status-select" data-oid="${o.id}" style="color:${st.color};border-color:${st.color}66">
            ${LGM.orderStatuses.map(s => `<option value="${s.id}" ${s.id === o.status ? "selected" : ""}>${s.emoji} ${LGM.nm(s)}</option>`).join("")}</select></td>
          ${compact ? "" : `<td><button class="btn sm ghost wa-btn" data-oid="${o.id}" title="WhatsApp">💬</button></td>`}</tr>`;
      }).join("")}</tbody></table>`;
  }
  function notifyWhatsApp(o, kind) {
    if (!o.customerPhone) { toast(L() === "en" ? "No phone on file" : "Pas de numéro enregistré"); return; }
    const url = LGM.waLink(o.customerPhone, LGM.waMessage(o, kind, L()));
    window.open(url, "_blank");
  }
  function wireStatus(scope) {
    $$(".status-select", scope).forEach(sel => sel.onchange = () => {
      const st = LGM.statusMeta(sel.value); sel.style.color = st.color; sel.style.borderColor = st.color + "66";
      const o = S.updateOrder(sel.dataset.oid, { status: sel.value }); toast("✓ " + LGM.nm(st));
      // notify the client on WhatsApp for the key steps
      if (o && ["preparing", "ready", "completed", "cancelled"].includes(sel.value)) notifyWhatsApp(o, sel.value);
      if (currentView() === "dash") renderDash();
    });
    $$(".wa-btn", scope).forEach(b => b.onclick = () => { const o = S.orders().find(x => x.id === b.dataset.oid); if (o) notifyWhatsApp(o, o.status); });
  }
  function payChip(id) { const p = LGM.payments.find(x => x.id === id) || {}; return `<span class="badge-chip" style="background:${p.color || "#888"}">${p.emoji || ""} ${LGM.nm(p) || id}</span>`; }
  function initials(n) { return (n || "?").split(" ").map(x => x[0]).slice(0, 2).join("").toUpperCase(); }

  function exportCsv() {
    const rows = [["ref", "date", "client", "phone", "items", "location", "type", "payment", "paid", "total", "status", "rating"]];
    S.orders().forEach(o => rows.push([o.ref, o.createdAt, o.customerName, o.customerPhone || "", o.items.map(i => i.qty + "x" + i.name).join("; "), o.location, o.type, o.payment, o.paymentStatus, o.total, o.status, o.rating || ""]));
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "lgm-orders.csv"; a.click(); URL.revokeObjectURL(url);
  }

  // ===================== CLIENTS (CRM) =====================
  let custSearch = "", custSort = "lifetime";
  function renderClients() {
    $("#custSearch").placeholder = t("search"); $("#custSearch").value = custSearch;
    $("#custSearch").oninput = e => { custSearch = e.target.value.toLowerCase(); draw(); };
    $("#custSort").onchange = e => { custSort = e.target.value; draw(); };
    function draw() {
      let list = S.customers().slice();
      if (custSearch) list = list.filter(c => (c.name + c.phone + (c.email || "")).toLowerCase().includes(custSearch));
      list.sort((a, b) => custSort === "orders" ? b.ordersCount - a.ordersCount : custSort === "recent" ? new Date(b.createdAt) - new Date(a.createdAt) : b.lifetimeSpend - a.lifetimeSpend);
      const orders = S.orders();
      $("#custTable").innerHTML = `<table><thead><tr><th>${t("client")}</th><th>${t("badge")}</th><th>${t("count")}</th><th>${t("lifetime")}</th><th>${t("creditBalance")}</th><th></th></tr></thead><tbody>
        ${list.map(c => {
          const b = LGM.badgeFor(c.lifetimeSpend); const bal = S.creditBalance(c.id);
          return `<tr><td><div class="cust-cell"><div class="avatar" style="background:${b.color}">${initials(c.name)}</div><div>${c.name}<br><small class="muted">${c.phone || ""}</small></div></div></td>
            <td><span class="badge-chip" style="background:${b.color}">${b.emoji} ${LGM.nm(b)}</span></td>
            <td><b>${c.ordersCount}</b></td><td><b>${fmt(c.lifetimeSpend)}</b><br><small class="muted">${LGM.points(c.lifetimeSpend)} pts</small></td>
            <td>${bal > 0 ? `<b style="color:var(--coral)">${fmt(bal)}</b>` : "<span class='muted'>—</span>"}</td>
            <td style="white-space:nowrap"><button class="btn sm ghost" data-credit="${c.id}">🎁 ${t("creditBtn")}</button> <a class="btn sm ghost" href="${waLink(c.phone)}" target="_blank">💬</a></td></tr>`;
        }).join("")}</tbody></table>`;
      $$("[data-credit]", $("#custTable")).forEach(bn => bn.onclick = () => openCredit(bn.dataset.credit));
      // badge distribution
      const dist = {}; LGM.badges.forEach(b => dist[b.id] = 0);
      S.customers().forEach(c => dist[LGM.badgeFor(c.lifetimeSpend).id]++);
      mkChart("chBadges", { type: "bar", data: { labels: LGM.badges.map(b => b.emoji + " " + LGM.nm(b)), datasets: [{ label: t("clients"), data: LGM.badges.map(b => dist[b.id]), backgroundColor: LGM.badges.map(b => b.color), borderRadius: 6 }] }, options: baseOpt({ x: true, y: true, legend: true }) });
    }
    draw();
  }
  function waLink(phone) { return "https://wa.me/" + ("225" + (phone || "").replace(/\D/g, "")); }

  // ===================== FINANCES =====================
  function renderFinances() {
    const a = S.analytics(period, L());
    const collected = a.revenue;
    const cashPending = S.orders().filter(o => o.paymentStatus === "pending").reduce((s, o) => s + o.total, 0);
    const margin = Math.round(collected * 0.6);
    const held = S.depositsHeld();
    $("#finKpis").innerHTML = [
      kpi("💰", t("revenue"), fmt(collected), a.deltaRevenue, "#E8394A22"),
      kpi("📈", t("margin"), fmt(margin), null, "#2e7d3222"),
      kpi("🧾", t("ordersN"), a.count, a.deltaCount, "#E89A5C22"),
      kpi("⏳", t("pending"), fmt(cashPending), null, "#caa14a22"),
      kpi("🤝", t("depositsHeld"), fmt(held), null, "#7b5cff22")
    ].join("");
    mkChart("chFinRev", { type: "bar", data: { labels: a.series.labels, datasets: [
      { label: t("revenue"), data: a.series.data, backgroundColor: "#E8394A", borderRadius: 5 },
      { label: t("margin"), data: a.series.data.map(v => Math.round(v * 0.6)), backgroundColor: "#E89A5C", borderRadius: 5 }
    ] }, options: baseOpt({ x: true, y: true, money: true, legend: true, counts: a.series.counts }) });
    // payment mix (money, with %)
    const pm = Object.entries(a.byPayMoney).sort((x, y) => y[1] - x[1]);
    mkChart("chFinPay", doughnutCfg(pm.map(p => payName(p[0])), pm.map(p => p[1]), pm.map(p => (LGM.payments.find(x => x.id === p[0]) || {}).color || "#999"), true));
    $("#finNote").textContent = "ℹ️ " + t("profitNote");
    renderBudget(a);
  }
  // project budget & profitability (revenue from analytics + admin-entered costs)
  function renderBudget(a) {
    const b = Object.assign({ cogsPct: 40, fixedCosts: 0, target: 0 }, S.settings().budget);
    // build inputs once; only the results recompute on change (so inputs keep focus/values)
    $("#budgetCard").innerHTML = `
      <h3>🧮 ${t("budgetTitle")} <span class="muted">${t("bForPeriod")}</span></h3>
      <p class="sub" style="color:var(--muted);margin-bottom:14px">${t("budgetDesc")}</p>
      <div class="budget-grid">
        <label class="bfield"><span>${t("bCogsPct")}</span><input type="number" min="0" max="100" id="bCogs" value="${b.cogsPct}"></label>
        <label class="bfield"><span>${t("bFixed")}</span><input type="number" min="0" id="bFixed" value="${b.fixedCosts}"></label>
        <label class="bfield"><span>${t("bTarget")}</span><input type="number" min="0" id="bTarget" value="${b.target}"></label>
      </div>
      <div id="budgetOut"></div>`;
    const compute = () => {
      const cogsPct = +$("#bCogs").value || 0, fixedCosts = +$("#bFixed").value || 0, target = +$("#bTarget").value || 0;
      S.saveSettings({ budget: { cogsPct, fixedCosts, target } });
      const cur = S.analytics(period, L());
      const days = (cur.cfg && cur.cfg.days) || 30, proRate = days / 30, revenue = cur.revenue;
      const direct = Math.round(revenue * cogsPct / 100), grossProfit = revenue - direct, grossMargin = revenue ? grossProfit / revenue * 100 : 0;
      const fixedPeriod = Math.round(fixedCosts * proRate), netProfit = grossProfit - fixedPeriod, netMargin = revenue ? netProfit / revenue * 100 : 0;
      const targetPeriod = Math.round(target * proRate), progress = targetPeriod ? Math.min(100, Math.round(revenue / targetPeriod * 100)) : 0;
      const sign = v => (v >= 0 ? "" : "−") + fmt(Math.abs(v));
      $("#budgetOut").innerHTML = `
        <div class="budget-out">
          <div class="bo"><span>${t("bRevenue")}</span><b>${fmt(revenue)}</b></div>
          <div class="bo"><span>${t("bDirect")} (${cogsPct}%)</span><b class="neg">−${fmt(direct)}</b></div>
          <div class="bo hl"><span>${t("bGrossProfit")}</span><b>${sign(grossProfit)} · ${grossMargin.toFixed(1)}%</b></div>
          <div class="bo"><span>${t("bFixedPeriod")}</span><b class="neg">−${fmt(fixedPeriod)}</b></div>
          <div class="bo total ${netProfit >= 0 ? "pos" : "loss"}"><span>${t("bNetProfit")}</span><b>${sign(netProfit)} · ${netMargin.toFixed(1)}%</b></div>
        </div>
        ${target ? `<div style="margin-top:14px"><div class="bo" style="padding:0 2px"><span>${t("bTargetProgress")}</span><b>${progress}%</b></div><div class="bar" style="margin-top:6px"><i style="width:${progress}%"></i></div></div>` : ""}`;
    };
    $("#bCogs").oninput = compute; $("#bFixed").oninput = compute; $("#bTarget").oninput = compute;
    compute();
  }

  // ===================== SATISFACTION =====================
  function renderSatisfaction() {
    const rated = S.orders().filter(o => o.rating);
    const avg = rated.length ? rated.reduce((s, o) => s + o.rating, 0) / rated.length : 0;
    const good = rated.filter(o => o.rating >= 4).length, low = rated.filter(o => o.rating <= 3).length;
    $("#satKpis").innerHTML = [
      kpi("⭐", t("avgRating"), avg.toFixed(2) + "/5", null, "#2e7d3222"),
      kpi("😍", t("satGood"), Math.round(good / (rated.length || 1) * 100) + "%", null, "#E8B23A22"),
      kpi("🙁", t("satLow"), low, null, "#c0392b22"),
      kpi("🗣️", t("ratings"), rated.length, null, "#E89A5C22")
    ].join("");
    const dist = [0, 0, 0, 0, 0]; rated.forEach(o => dist[(o.rating || 1) - 1]++);
    mkChart("chSat", { type: "bar", data: { labels: ["★1", "★2", "★3", "★4", "★5"], datasets: [{ label: t("ratings"), data: dist, backgroundColor: ["#c0392b", "#e67e22", "#caa14a", "#9bbf59", "#2e7d32"], borderRadius: 6 }] }, options: baseOpt({ x: true, y: true, legend: true }) });
    // latest reviews — with the customer's written comment when present
    const withComments = rated.slice().sort((x, y) => new Date(y.ratedAt || y.createdAt) - new Date(x.ratedAt || x.createdAt));
    $("#satReviews").innerHTML = withComments.slice(0, 12).map(o => `<div class="review-row">
      <div class="review-head"><b>${o.customerName}</b><div class="stars">${"★".repeat(o.rating)}${"☆".repeat(5 - o.rating)}</div></div>
      <div class="review-meta">${o.ref} · ${new Date(o.ratedAt || o.createdAt).toLocaleDateString(L() === "en" ? "en-GB" : "fr-FR")}</div>
      ${o.comment ? `<div class="review-comment">“${o.comment}”</div>` : ""}
    </div>`).join("") || `<div class="empty">${t("noReviews")}</div>`;
  }

  // ===================== TRUCK SCHEDULE (automation) =====================
  function renderTruck() {
    const set = S.settings();
    const auto = set.autoSchedule || { enabled: true };
    $("#autoTitle").textContent = t("autoTitle"); $("#autoDesc").textContent = t("autoDesc");
    $("#autoLabel").textContent = t("autoOn");
    const tg = $("#autoToggle"); tg.classList.toggle("on", !!auto.enabled);
    tg.onclick = () => { auto.enabled = !auto.enabled; tg.classList.toggle("on", auto.enabled); S.saveSettings({ autoSchedule: auto }); toast(t("saved")); };
    $("#weekNote").value = L() === "en" ? (auto.note_en || "") : (auto.note_fr || "");
    $("#weekNote").placeholder = t("publishNote");
    $("#weekNote").oninput = e => { if (L() === "en") auto.note_en = e.target.value; else auto.note_fr = e.target.value; S.saveSettings({ autoSchedule: auto }); };

    drawSched();
    $("#addSched").textContent = t("addRow");
    $("#addSched").onclick = () => { S.upsertScheduleRow({ day_fr: "Nouveau", day_en: "New", place: "", hours: "", phone: "", mapsQuery: "" }); drawSched(); };
    $("#saveSched").textContent = t("saveSched");
    $("#saveSched").onclick = () => { saveSchedFromDOM(); toast("🚚 " + t("saved")); };
    function drawSched() {
      const rows = S.schedule();
      $("#schedHead").innerHTML = `<div>${t("day")}</div><div>${t("place")}</div><div>${t("hours")}</div><div>${t("maps")} / ${t("phone")}</div><div></div>`;
      $("#schedRows").innerHTML = rows.map(r => `<div class="sched-row" data-id="${r.id}">
        <input data-f="${L() === "en" ? "day_en" : "day_fr"}" value="${esc(L() === "en" ? r.day_en : r.day_fr)}" placeholder="${t("day")}">
        <input data-f="place" value="${esc(r.place)}" placeholder="${t("place")}">
        <input data-f="hours" value="${esc(r.hours)}" placeholder="11h-18h">
        <input data-f="mapsQuery" value="${esc(r.mapsQuery || "")}" placeholder="${t("maps")}">
        <button class="icon-x" data-del="${r.id}">✕</button></div>`).join("");
      $$("[data-del]", $("#schedRows")).forEach(b => b.onclick = () => { S.removeScheduleRow(b.dataset.del); drawSched(); });
    }
    function saveSchedFromDOM() {
      const list = $$(".sched-row", $("#schedRows")).map(row => {
        const o = { id: row.dataset.id };
        $$("input", row).forEach(inp => o[inp.dataset.f] = inp.value);
        const existing = S.schedule().find(s => s.id === o.id) || {};
        return Object.assign({}, existing, o);
      });
      S.setSchedule(list);
    }
  }

  // ===================== EVENTS =====================
  function renderEvents() {
    $("#addEvent").textContent = t("addEvent");
    $("#addEvent").onclick = () => { S.upsertEvent({ title: L() === "en" ? "New event" : "Nouvel événement", date: new Date(Date.now() + 7 * 864e5).toISOString(), guests: 50, status: "tentative" }); draw(); };
    function draw() {
      const evs = S.events().slice().sort((a, b) => new Date(a.date) - new Date(b.date));
      $("#eventsTable").innerHTML = `<table><thead><tr><th>${t("evTitle")}</th><th>${t("evDate")}</th><th>${t("guests")}</th><th>${t("evStatus")}</th><th></th></tr></thead><tbody>
        ${evs.map(e => `<tr data-id="${e.id}">
          <td><input class="sel" style="width:100%" data-f="title" value="${esc(e.title)}"></td>
          <td><input class="sel" type="date" data-f="date" value="${new Date(e.date).toISOString().slice(0, 10)}"></td>
          <td><input class="sel" style="width:80px" type="number" data-f="guests" value="${e.guests || 0}"></td>
          <td><select class="sel" data-f="status"><option value="tentative" ${e.status === "tentative" ? "selected" : ""}>${L() === "en" ? "Tentative" : "À confirmer"}</option><option value="confirmed" ${e.status === "confirmed" ? "selected" : ""}>${L() === "en" ? "Confirmed" : "Confirmé"}</option><option value="done" ${e.status === "done" ? "selected" : ""}>${L() === "en" ? "Done" : "Terminé"}</option></select></td>
          <td><button class="icon-x" data-del="${e.id}">✕</button></td></tr>`).join("") || `<tr><td colspan="5" class="empty">—</td></tr>`}
        </tbody></table>`;
      $$("#eventsTable tr[data-id]").forEach(tr => $$("[data-f]", tr).forEach(inp => inp.onchange = () => {
        const patch = { id: tr.dataset.id }; patch[inp.dataset.f] = inp.dataset.f === "date" ? new Date(inp.value).toISOString() : (inp.dataset.f === "guests" ? +inp.value : inp.value);
        S.upsertEvent(patch); toast(t("saved"));
      }));
      $$("[data-del]", $("#eventsTable")).forEach(b => b.onclick = () => { S.removeEvent(b.dataset.del); draw(); });
    }
    draw();
  }

  // ===================== SETTINGS (socials + payments) =====================
  function renderSettings() {
    const set = S.settings();
    $("#socialsTitle").textContent = t("socials"); $("#socialsDesc").textContent = t("socialsDesc");
    const tkIcon = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="vertical-align:-2px"><path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.2v12.86a2.58 2.58 0 0 1-2.58 2.4 2.58 2.58 0 0 1-2.35-3.64 2.58 2.58 0 0 1 3.28-1.38V9.9a5.86 5.86 0 0 0-1-.08 5.86 5.86 0 1 0 5.86 5.86V8.9a7.5 7.5 0 0 0 4.4 1.4V7.1a4.28 4.28 0 0 1-2.35-1.28Z"/></svg>`;
    const socs = [["instagram", "📸", "Instagram"], ["tiktok", tkIcon, "TikTok"], ["whatsapp", "💬", "WhatsApp"], ["yango", "🚕", "Livraison"]];
    $("#socialsBox").innerHTML = socs.map(([k, e, n]) => `<div class="social-set"><span class="se">${e}</span><input data-soc="${k}" value="${esc(set.socials[k] || "")}" placeholder="${n} URL"></div>`).join("");
    $$("[data-soc]").forEach(inp => inp.onchange = () => { const s = Object.assign({}, set.socials); s[inp.dataset.soc] = inp.value; S.saveSettings({ socials: s }); toast(t("saved")); });

    $("#payTitle").textContent = t("payTitle"); $("#payDesc").textContent = t("payDesc");
    const pset = set.payments || {};
    const provs = [["wave", "🐧", "Wave", "Mobile Money"], ["orange", "🟠", "Orange Money", "Mobile Money"], ["mtn", "🟡", "MTN MoMo", "Mobile Money"], ["moov", "🔵", "Moov Money", "Mobile Money"], ["djamo", "🔷", "Djamo", "Carte · Djamo"], ["geniuspay", "🧞", "GeniusPay", L() === "en" ? "Secure payment" : "Paiement sécurisé"], ["cinetpay", "🧩", "CinetPay", L() === "en" ? "Aggregator (MoMo + cards)" : "Agrégateur (MoMo + cartes)"]];
    $("#payBox").innerHTML = provs.map(([k, e, n, d]) => `<div class="pay-set"><div class="pl"><span class="pe">${e}</span><div class="pn"><b>${n}</b><small>${d}</small></div></div>
      <div style="display:flex;align-items:center;gap:10px"><small class="muted">${pset[k] ? t("live") : t("off")}</small><button class="toggle ${pset[k] ? "on" : ""}" data-pay="${k}"></button></div></div>`).join("")
      // POS / card terminal integration
      + `<div class="pay-set" style="margin-top:14px;align-items:flex-start;flex-direction:column;gap:10px">
          <div class="pl" style="width:100%;justify-content:space-between"><div style="display:flex;gap:11px;align-items:center"><span class="pe">🏧</span><div class="pn"><b>${t("posTitle")}</b><small>${t("posEnable")}</small></div></div>
            <button class="toggle ${(set.pos && set.pos.enabled) ? "on" : ""}" id="posToggle"></button></div>
          <small class="muted">${t("posDesc")}</small>
          <input class="sel" style="width:100%" id="posProvider" placeholder="${t("posProvider")}" value="${esc((set.pos && set.pos.provider) || "")}">
        </div>`;
    $$("[data-pay]").forEach(b => b.onclick = () => { const p = Object.assign({}, set.payments); p[b.dataset.pay] = !p[b.dataset.pay]; b.classList.toggle("on", p[b.dataset.pay]); S.saveSettings({ payments: p }); toast(p[b.dataset.pay] ? "✓ " + t("live") : t("off")); b.previousElementSibling.textContent = p[b.dataset.pay] ? t("live") : t("off"); });
    $("#posToggle") && ($("#posToggle").onclick = () => { const pos = Object.assign({ enabled: false, provider: "" }, set.pos); pos.enabled = !pos.enabled; $("#posToggle").classList.toggle("on", pos.enabled); S.saveSettings({ pos }); toast(pos.enabled ? "✓ " + t("live") : t("off")); });
    $("#posProvider") && ($("#posProvider").onchange = e => { const pos = Object.assign({ enabled: false }, set.pos); pos.provider = e.target.value; S.saveSettings({ pos }); toast(t("saved")); });

    $("#resetData").onclick = () => { if (confirm(t("confirmReset"))) { S.reset(); render(); toast(t("saved")); } };
  }

  // ===================== STOCK + AI AGENT =====================
  function renderStock() {
    const report = S.runStockAgent(); // auto-manages availability on each visit
    const acts = report.acts, recs = report.recs;
    $("#agentCard").innerHTML = `<div class="agent-banner">
      <div class="agent-ic">🤖</div>
      <div style="flex:1">
        <h3>${t("agentTitle")}</h3>
        <p class="sub" style="color:var(--muted)">${t("agentDesc")}</p>
        <div class="agent-log">
          ${acts.length ? acts.map(a => `<div class="agent-line">${a.type === "soldout" ? "⛔" : "✅"} ${a.type === "soldout" ? (L() === "en" ? "Marked sold out:" : "Mis en épuisé :") : (L() === "en" ? "Back in stock:" : "De retour :")} <b>${a.name}</b></div>`).join("") : `<div class="agent-line">${t("noActions")}</div>`}
          ${recs.map(r => `<div class="agent-line rec">🔔 ${t("lowStock")}: <b>${r.name}</b> — ${r.qty} ${L() === "en" ? "left, suggest restock" : "restants, à réapprovisionner"}</div>`).join("")}
        </div>
      </div>
      <button class="btn ghost sm" id="runAgent">${t("runAgent")}</button>
    </div>`;
    $("#runAgent").onclick = () => { renderStock(); toast("🤖 " + t("saved")); };

    const stock = S.stock();
    const imgs = S.settings().menuImages || {};
    $("#stockTable").innerHTML = `<table><thead><tr><th>${t("stockItem")}</th><th>${L() === "en" ? "Photo (URL, optional)" : "Photo (URL, optionnel)"}</th><th>${t("qty")}</th><th>${t("threshold")}</th><th>${t("availability")}</th><th>${t("restock")}</th></tr></thead><tbody>
      ${LGM.menu.map(m => {
        const s = stock[m.id] || { qty: 0, threshold: 10, available: true };
        const pct = Math.min(100, Math.round(s.qty / 60 * 100));
        const col = s.qty <= 0 ? "#c0392b" : s.qty <= s.threshold ? "#caa14a" : "#2e7d32";
        return `<tr data-id="${m.id}">
          <td><b>${L() === "en" ? m.en : m.fr}</b></td>
          <td><div style="display:flex;align-items:center;gap:8px">${imgs[m.id] ? `<img src="${imgs[m.id]}" style="width:34px;height:34px;border-radius:8px;object-fit:cover" onerror="this.style.opacity=.3">` : ""}<input class="sel" style="width:170px" data-img placeholder="https://…" value="${esc(imgs[m.id] || "")}"></div></td>
          <td><button class="qtybtn" data-dec>−</button> <b style="min-width:34px;display:inline-block;text-align:center">${s.qty}</b> <button class="qtybtn" data-inc>+</button>
            <span class="stock-meter"><i style="width:${pct}%;background:${col}"></i></span></td>
          <td><input class="sel" style="width:70px" type="number" data-th value="${s.threshold}"></td>
          <td><span class="tag" style="background:${s.qty > 0 && s.available !== false ? "#2e7d32" : "#c0392b"}">${s.qty > 0 && s.available !== false ? t("avail") : t("soldout")}</span></td>
          <td><button class="btn ghost sm" data-restock>+10</button></td></tr>`;
      }).join("")}</tbody></table>
      <p class="sub" style="color:var(--muted);margin-top:12px">📷 ${L() === "en" ? "Paste a real photo URL to replace the illustration for that item." : "Colle l'URL d'une vraie photo pour remplacer l'illustration de l'article."}</p>`;
    $$("#stockTable tr[data-id]").forEach(tr => {
      const idImg = tr.dataset.id;
      $("[data-img]", tr).onchange = e => { const mi = Object.assign({}, S.settings().menuImages); if (e.target.value.trim()) mi[idImg] = e.target.value.trim(); else delete mi[idImg]; S.saveSettings({ menuImages: mi }); toast(t("saved")); renderStock(); };
    });
    $$("#stockTable tr[data-id]").forEach(tr => {
      const id = tr.dataset.id;
      $("[data-dec]", tr).onclick = () => { const s = S.stockFor(id); S.setStock(id, { qty: Math.max(0, s.qty - 1), available: s.qty - 1 > 0 }); renderStock(); };
      $("[data-inc]", tr).onclick = () => { const s = S.stockFor(id); S.setStock(id, { qty: s.qty + 1, available: true }); renderStock(); };
      $("[data-restock]", tr).onclick = () => { S.restock(id, 10); renderStock(); toast(t("saved")); };
      $("[data-th]", tr).onchange = e => { S.setStock(id, { threshold: +e.target.value || 0 }); toast(t("saved")); };
    });
  }

  // ===================== BOOKINGS / QUOTES =====================
  function renderBookings() {
    const list = S.bookings();
    const evMap = id => (LGM.eventTypes.find(e => e.id === id) || {});
    const stById = { new: { c: "#3aa0e8", l: t("bkNew") }, contacted: { c: "#caa14a", l: t("bkContacted") }, confirmed: { c: "#2e7d32", l: t("bkConfirmed") }, declined: { c: "#c0392b", l: t("bkDeclined") } };
    $("#bookingsTable").innerHTML = list.length ? `<table><thead><tr><th>${t("bkClient")}</th><th>${t("bkEvent")}</th><th>${t("bkWhen")}</th><th>${t("bkSize")}</th><th>${t("bkPlace")}</th><th>${t("bkQuote")}</th><th>${t("bkStatus")}</th><th></th></tr></thead><tbody>
      ${list.map(b => `<tr data-id="${b.id}">
        <td><b>${b.name}</b><br><small class="muted">${b.phone || ""}</small></td>
        <td>${LGM.nm(evMap(b.eventType))}${b.notes ? `<br><small class="muted">${b.notes}</small>` : ""}</td>
        <td>${b.date ? new Date(b.date).toLocaleDateString(L() === "en" ? "en-GB" : "fr-FR") : "—"}</td>
        <td>${b.basis === "items" ? b.items + " 🧇" : b.people + " 👥"}</td>
        <td>${b.place || "—"}</td>
        <td><b>${fmt(b.quote)}</b></td>
        <td><select class="status-select" data-st style="color:${(stById[b.status] || stById.new).c}">
          ${Object.keys(stById).map(k => `<option value="${k}" ${b.status === k ? "selected" : ""}>${stById[k].l}</option>`).join("")}</select></td>
        <td><a class="btn sm ghost" target="_blank" href="https://wa.me/225${(b.phone || "").replace(/\D/g, "")}">💬</a></td></tr>`).join("")}</tbody></table>`
      : `<div class="empty">${t("noBookings")}</div>`;
    $$("#bookingsTable tr[data-id]").forEach(tr => { $("[data-st]", tr).onchange = e => { S.updateBooking(tr.dataset.id, { status: e.target.value }); toast(t("saved")); renderBookings(); }; });
  }

  // ===================== HIGHLIGHTS EDITOR =====================
  function renderHighlightsAdmin() {
    const set = S.settings();
    $("#hlAdminTitle").textContent = t("hlAdminTitle"); $("#hlAdminDesc").textContent = t("hlAdminDesc");
    $("#hlTitleFrLbl").textContent = "Titre (FR)"; $("#hlTitleEnLbl").textContent = "Title (EN)";
    $("#hlTitleFr").value = set.highlightsTitleFr || ""; $("#hlTitleEn").value = set.highlightsTitleEn || "";
    $("#hlTitleFr").onchange = e => { S.saveSettings({ highlightsTitleFr: e.target.value }); toast(t("saved")); };
    $("#hlTitleEn").onchange = e => { S.saveSettings({ highlightsTitleEn: e.target.value }); toast(t("saved")); };
    const list = S.highlights();
    $("#hlGrid").innerHTML = list.map(h => `<div class="hl-edit" data-id="${h.id}">
      <img src="${h.img}" alt="" onerror="this.style.opacity=.3">
      <div class="hl-fields">
        <input data-f="img" value="${esc(h.img)}" placeholder="${t("img")}">
        <input data-f="capFr" value="${esc(h.capFr)}" placeholder="${t("capFr")}">
        <input data-f="capEn" value="${esc(h.capEn)}" placeholder="${t("capEn")}">
        <button class="hl-del" data-del>🗑</button>
      </div></div>`).join("");
    $$("#hlGrid .hl-edit").forEach(card => {
      const id = card.dataset.id;
      $$("[data-f]", card).forEach(inp => inp.onchange = () => { const p = { id }; p[inp.dataset.f] = inp.value; S.upsertHighlight(p); toast(t("saved")); if (inp.dataset.f === "img") $("img", card).src = inp.value; });
      $("[data-del]", card).onclick = () => { S.removeHighlight(id); renderHighlightsAdmin(); };
    });
    $("#hlAdd").onclick = () => { S.upsertHighlight({ img: "assets/img/bowl.png", capFr: "Nouvelle actu", capEn: "New update" }); renderHighlightsAdmin(); };
  }

  // ===================== MANUAL SALE (cash / TPE) =====================
  let saleLines = [{ id: LGM.menu[0].id, qty: 1 }];
  let saleDeposit = false, saleDepAmt = 0;
  function openSale() {
    saleLines = [{ id: LGM.menu[0].id, qty: 1 }];
    saleDeposit = false; saleDepAmt = 0;
    $("#saleTitle").textContent = t("saleTitle");
    $("#saleModal").classList.add("open");
    drawSale();
  }
  function drawSale() {
    const cashMethods = LGM.payments.filter(p => ["cash", "card", "wave", "orange", "mtn", "moov", "revolut"].includes(p.id));
    const momoMethods = LGM.payments.filter(p => p.kind === "momo");
    const total = saleLines.reduce((s, l) => { const m = LGM.menu.find(x => x.id === l.id); return s + (m ? m.price * l.qty : 0); }, 0);
    const depOn = !!saleDeposit;
    $("#saleBody").innerHTML = `
      ${saleLines.map((l, i) => `<div class="sale-item">
        <select class="sel" data-line="${i}">${LGM.menu.map(m => `<option value="${m.id}" ${m.id === l.id ? "selected" : ""}>${L() === "en" ? m.en : m.fr} — ${fmt(m.price)}</option>`).join("")}</select>
        <input class="sel" style="width:64px" type="number" min="1" value="${l.qty}" data-qty="${i}">
        <button class="qtybtn" data-rm="${i}">✕</button></div>`).join("")}
      <button class="btn ghost sm" id="saleAdd" style="margin:4px 0 14px">${t("saleAdd")}</button>
      <div class="field"><label>${t("saleMethod")}</label><select class="field" id="saleMethod" style="width:100%">${cashMethods.map(p => `<option value="${p.id}">${p.emoji} ${LGM.nm(p)}</option>`).join("")}</select></div>
      <label class="dep-toggle"><input type="checkbox" id="saleDeposit" ${depOn ? "checked" : ""}><span>${t("saleDeposit")}</span></label>
      <div id="saleDepBox" style="display:${depOn ? "block" : "none"};margin-bottom:8px">
        <div class="row2">
          <div class="field"><label>${t("depositAmount")}</label><input id="saleDepAmt" type="number" min="0" max="${total}" value="${saleDepAmt || Math.round(total * 0.3 / 100) * 100}"></div>
          <div class="field"><label>${t("depositMethod")}</label><select id="saleDepMethod" style="width:100%">${momoMethods.map(p => `<option value="${p.id}">${p.emoji} ${LGM.nm(p)}</option>`).join("")}</select></div>
        </div>
      </div>
      <div class="row2"><div class="field"><label>${t("saleCustomer")}</label><input id="saleName" placeholder="—"></div><div class="field"><label>${t("phone")}</label><input id="salePhone" placeholder="—"></div></div>
      <div class="summary-total" style="display:flex;justify-content:space-between;font-weight:800;font-size:1.2rem;color:var(--chocolate);border-top:1px solid var(--line);padding-top:12px;margin:6px 0 14px"><span>${t("saleTotal")}</span><span>${fmt(total)}</span></div>
      <button class="btn coral" id="saleSave" style="width:100%">${t("saleSave")}</button>`;
    $$("[data-line]").forEach(s => s.onchange = e => { saleLines[+e.target.dataset.line].id = e.target.value; drawSale(); });
    $$("[data-qty]").forEach(s => s.onchange = e => { saleLines[+e.target.dataset.qty].qty = Math.max(1, +e.target.value); drawSale(); });
    $$("[data-rm]").forEach(b => b.onclick = e => { saleLines.splice(+e.target.dataset.rm, 1); if (!saleLines.length) saleLines = [{ id: LGM.menu[0].id, qty: 1 }]; drawSale(); });
    $("#saleAdd").onclick = () => { saleLines.push({ id: LGM.menu[0].id, qty: 1 }); drawSale(); };
    $("#saleDeposit").onchange = e => { saleDeposit = e.target.checked; const amt = $("#saleDepAmt"); if (amt) saleDepAmt = +amt.value || 0; drawSale(); };
    $("#saleDepAmt") && ($("#saleDepAmt").oninput = e => { saleDepAmt = +e.target.value || 0; });
    $("#saleSave").onclick = () => {
      const items = saleLines.map(l => { const m = LGM.menu.find(x => x.id === l.id); return { id: m.id, name: m.fr, price: m.price, qty: l.qty }; });
      const total = items.reduce((s, it) => s + it.price * it.qty, 0);
      const base = { customerName: $("#saleName").value.trim() || (L() === "en" ? "Walk-in" : "Client comptoir"), customerPhone: $("#salePhone").value.trim(), items, total, type: "pickup", location: "Comptoir", source: "pos" };
      if ($("#saleDeposit").checked) {
        // two-stage: deposit collected now (mobile money), stays active on the board until the balance is settled
        const depMethod = $("#saleDepMethod").value;
        const depAmt = Math.min(total, +$("#saleDepAmt").value || 0);
        const now = new Date().toISOString();
        S.createOrder(Object.assign({}, base, { payment: depMethod, paymentMode: "twostage", deposit: { amount: depAmt, method: depMethod }, balanceMethod: "cash", status: "received", statusTimes: { pending: now, received: now } }));
        toast("💰 " + t("depositTaken"));
      } else {
        S.createOrder(Object.assign({}, base, { payment: $("#saleMethod").value, paymentStatus: "paid", status: "completed" }));
        toast("💵 " + t("saved"));
      }
      $("#saleModal").classList.remove("open"); saleDeposit = false; saleDepAmt = 0;
      if (currentView() === "orders") renderOrders(); if (currentView() === "dash") renderDash();
    };
  }

  // ===================== MENU PHOTOS (uploader) =====================
  // shrink an uploaded image to a small JPEG data-URL so it fits in storage
  function resizeImage(file, max, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, max / Math.max(img.width, img.height));
          const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
          const c = document.createElement("canvas"); c.width = w; c.height = h;
          c.getContext("2d").drawImage(img, 0, 0, w, h);
          resolve(c.toDataURL("image/jpeg", quality || 0.72));
        };
        img.onerror = reject; img.src = reader.result;
      };
      reader.onerror = reject; reader.readAsDataURL(file);
    });
  }
  function renderPhotos() {
    $("#photoTitle").textContent = t("photoTitle"); $("#photoDesc").textContent = t("photoDesc");
    const imgs = S.menuImages();
    $("#photoGrid").innerHTML = LGM.menu.map(m => {
      const real = imgs[m.id];
      const thumb = real ? `<img src="${real}" alt="">` : `<div class="art-thumb">${LGM.dishArt(m)}</div>`;
      return `<div class="photo-card" data-id="${m.id}">
        <div class="photo-thumb">${thumb}<span class="photo-tag ${real ? "real" : ""}">${real ? "📷 " + t("realPhoto") : "🎨 " + t("generated")}</span></div>
        <div class="photo-name">${L() === "en" ? m.en : m.fr}</div>
        <div class="photo-actions">
          <label class="btn coral sm photo-up">${t("uploadPhoto")}<input type="file" accept="image/*" data-up="${m.id}" hidden></label>
          ${real ? `<button class="btn ghost sm" data-rm="${m.id}">↺ ${t("removePhoto")}</button>` : ""}
        </div></div>`;
    }).join("");
    $$("[data-up]", $("#photoGrid")).forEach(inp => inp.onchange = async e => {
      const file = e.target.files[0]; if (!file) return;
      try {
        const url = await resizeImage(file, 700, 0.72);
        S.setMenuImage(e.target.dataset.up, url); toast("📷 " + t("saved")); renderPhotos();
      } catch (err) { toast("⚠️ " + err); }
    });
    $$("[data-rm]", $("#photoGrid")).forEach(b => b.onclick = () => { S.clearMenuImage(b.dataset.rm); renderPhotos(); toast(t("saved")); });
  }

  // ===================== EMPLOYEES / HR =====================
  function empLinkFor(emp) { return location.origin + location.pathname.replace(/[^/]+$/, "") + "employee.html?e=" + emp.token; }
  function cName(id) { const c = LGM.contractTypes.find(x => x.id === id); return c ? LGM.nm(c) : id; }
  function readDoc(file) {
    return new Promise((resolve, reject) => {
      if (/^image\//.test(file.type)) { resizeImage(file, 1100, 0.7).then(url => resolve({ name: file.name, type: file.type, url })); return; }
      if (file.size > 1.4 * 1024 * 1024) { reject(L() === "en" ? "File too large (max ~1.4MB in demo)" : "Fichier trop lourd (max ~1,4 Mo en démo)"); return; }
      const r = new FileReader(); r.onload = () => resolve({ name: file.name, type: file.type, url: r.result }); r.onerror = reject; r.readAsDataURL(file);
    });
  }
  function renderEmployees() {
    const list = S.employees();
    $("#empBar").innerHTML = `<div><h3 style="margin:0">${t("empTitle")}</h3><div class="sub" style="color:var(--muted)">${list.length} ${L() === "en" ? "people" : "personnes"}</div></div>
      <button class="btn coral sm" id="empAdd">${t("empAdd")}</button>`;
    $("#empAdd").onclick = () => openEmp(null);
    $("#empGrid").innerHTML = list.length ? list.map(e => `<div class="emp-card" data-id="${e.id}">
      <div class="emp-ava">${e.photo ? `<img src="${e.photo}" alt="">` : `<span>${initials(e.name)}</span>`}</div>
      <div class="emp-info"><b>${e.name}</b><span>${e.role || "—"}</span>
        <div class="emp-tags"><span class="tag" style="background:${e.status === "inactive" ? "#9aa0a6" : "#2e7d32"}">${cName(e.contract)}</span>
        <small class="muted">${LGM.tenure(e.startDate, L())}</small></div></div>
      <button class="btn ghost sm" data-edit="${e.id}">${t("empEdit")} →</button></div>`).join("") : `<div class="empty">—</div>`;
    $$("[data-edit]", $("#empGrid")).forEach(b => b.onclick = () => openEmp(b.dataset.edit));
    $$(".emp-card", $("#empGrid")).forEach(c => c.onclick = e => { if (!e.target.closest("[data-edit]")) openEmp(c.dataset.id); });
  }
  let empId = null;
  function openEmp(id) {
    empId = id;
    const e = id ? S.getEmployee(id) : { name: "", role: "", contract: "cdi", startDate: "", cnps: "", cni: "", passport: "", phone: "", email: "", address: "", status: "active", documents: {}, payHistory: [] };
    $("#empModalTitle").textContent = id ? t("empEdit") : t("empAdd");
    $("#empModal").classList.add("open");
    drawEmp(e);
  }
  function drawEmp(e) {
    const docs = e.documents || {}, pays = e.payHistory || [];
    $("#empBody").innerHTML = `
      <div class="emp-head">
        <div class="emp-ava lg">${e.photo ? `<img src="${e.photo}" alt="">` : `<span>${initials(e.name || "?")}</span>`}</div>
        <div style="flex:1">
          <div class="row2"><label class="bfield"><span>${t("empName")}</span><input id="eName" value="${esc(e.name)}"></label>
          <label class="bfield"><span>${t("empRole")}</span><input id="eRole" value="${esc(e.role)}"></label></div>
        </div>
      </div>
      <div class="row2">
        <label class="bfield"><span>${t("empContract")}</span><select id="eContract">${LGM.contractTypes.map(c => `<option value="${c.id}" ${c.id === e.contract ? "selected" : ""}>${LGM.nm(c)}</option>`).join("")}</select></label>
        <label class="bfield"><span>${t("empStart")}</span><input id="eStart" type="date" value="${e.startDate ? new Date(e.startDate).toISOString().slice(0, 10) : ""}"></label>
      </div>
      <div class="row2">
        <label class="bfield"><span>${t("empPhone")}</span><input id="ePhone" value="${esc(e.phone)}"></label>
        <label class="bfield"><span>${t("empEmail")}</span><input id="eEmail" value="${esc(e.email)}"></label>
      </div>
      <label class="bfield"><span>${t("empAddress")}</span><input id="eAddress" value="${esc(e.address)}"></label>
      <div class="row2" style="margin-top:12px">
        <label class="bfield"><span>${t("empCnps")}</span><input id="eCnps" value="${esc(e.cnps)}"></label>
        <label class="bfield"><span>${t("empCni")}</span><input id="eCni" value="${esc(e.cni)}"></label>
      </div>
      <div class="row2">
        <label class="bfield"><span>${t("empPassport")}</span><input id="ePassport" value="${esc(e.passport)}"></label>
        <label class="bfield"><span>${t("empStatus")}</span><select id="eStatus"><option value="active" ${e.status !== "inactive" ? "selected" : ""}>${t("empActive")}</option><option value="inactive" ${e.status === "inactive" ? "selected" : ""}>${t("empInactive")}</option></select></label>
      </div>
      <div class="emp-section"><b>📎 ${t("empDocs")}</b>
        <div class="doc-grid">${LGM.docTypes.map(dt => { const dv = docs[dt.id]; return `<div class="doc-tile">
          <div class="doc-name">${LGM.nm(dt)}</div>
          ${dv ? `<a class="doc-have" href="${dv.url}" download="${esc(dv.name || dt.id)}" target="_blank">✅ ${t("empView")}</a><button class="doc-rm" data-docrm="${dt.id}">✕</button>`
            : `<label class="doc-up">⬆ ${t("empUploadDoc")}<input type="file" accept="image/*,application/pdf" data-doc="${dt.id}" hidden></label>`}
        </div>`; }).join("")}</div>
      </div>
      <div class="emp-section"><b>💵 ${t("empPay")}</b>
        <div class="pay-add">
          <input id="payAmount" type="number" placeholder="${t("empPayAmount")}" style="width:120px">
          <input id="payPeriod" placeholder="${t("empPayPeriod")}" style="width:140px">
          <select id="payMethod">${LGM.payments.filter(p => ["wave", "orange", "mtn", "moov", "djamo", "card", "cash"].includes(p.id)).map(p => `<option value="${p.id}">${LGM.nm(p)}</option>`).join("")}</select>
          <button class="btn coral sm" id="empSendSalary">${t("empSendSalary")}</button>
        </div>
        <div class="pay-list">${pays.length ? pays.map(p => `<div class="pay-row"><span>${new Date(p.date).toLocaleDateString(L() === "en" ? "en-GB" : "fr-FR")} · ${p.period || ""}</span><b>${fmt(p.amount)}</b><span class="muted">${payName(p.method)} ${p.ref ? "· " + p.ref : ""}</span><a class="btn ghost sm" target="_blank" href="${LGM.waLink ? LGM.waLink(e.phone, LGM.salaryMessage(e, p, empLinkFor(e), L())) : "#"}">💬</a></div>`).join("") : `<div class="muted" style="padding:8px 0">—</div>`}</div>
      </div>
      ${e.id ? `<div class="emp-section"><b>🔗 ${t("empLink")}</b>
        <div class="emp-linkbox"><input id="empLinkInput" readonly value="${empLinkFor(e)}"><button class="btn choc sm" id="empCopy">${t("empCopyLink")}</button></div></div>` : ""}
      <div style="display:flex;gap:10px;margin-top:18px">
        <button class="btn coral" id="empSave" style="flex:1">${t("empSave")}</button>
        ${e.id ? `<button class="btn ghost" id="empDel" style="color:var(--bad)">${t("empDelete")}</button>` : ""}
      </div>`;

    // photo upload (admin can set it too)
    // document uploads
    $$("[data-doc]", $("#empBody")).forEach(inp => inp.onchange = async ev => {
      const f = ev.target.files[0]; if (!f) return;
      try { const doc = await readDoc(f); if (!empId) { await ensureSaved(e); } S.setEmployeeDoc(empId, ev.target.dataset.doc, doc); openEmp(empId); toast(t("saved")); }
      catch (err) { toast("⚠️ " + err); }
    });
    $$("[data-docrm]", $("#empBody")).forEach(b => b.onclick = () => { S.removeEmployeeDoc(empId, b.dataset.docrm); openEmp(empId); });
    // record salary + notify (AI payroll agent)
    $("#empSendSalary").onclick = async () => {
      const amount = +$("#payAmount").value; if (!amount) return toast(L() === "en" ? "Enter an amount" : "Saisis un montant");
      await ensureSaved(e);
      const cur = S.getEmployee(empId);
      const pay = S.addPayment(empId, { amount, period: $("#payPeriod").value.trim() || (L() === "en" ? "This month" : "Ce mois"), method: $("#payMethod").value, ref: "PAY-" + Math.random().toString(36).slice(2, 6).toUpperCase() });
      // AI payroll agent: notify the employee on WhatsApp (auto via backend, else click-to-send)
      const url = LGM.waLink(cur.phone, LGM.salaryMessage(cur, pay, empLinkFor(cur), L()));
      window.open(url, "_blank");
      toast(t("empSalarySent")); openEmp(empId);
    };
    $("#empCopy") && ($("#empCopy").onclick = () => { const i = $("#empLinkInput"); i.select(); navigator.clipboard && navigator.clipboard.writeText(i.value); toast(t("empCopied")); });
    $("#empSave").onclick = async () => { await ensureSaved(e); $("#empModal").classList.remove("open"); renderEmployees(); toast(t("saved")); };
    $("#empDel") && ($("#empDel").onclick = () => { if (confirm(t("empDelete") + " ?")) { S.removeEmployee(empId); $("#empModal").classList.remove("open"); renderEmployees(); } });
  }
  // persist current form into the store (creating the employee if new) and keep empId in sync
  function ensureSaved(e) {
    const patch = {
      id: empId || undefined, name: $("#eName").value.trim(), role: $("#eRole").value.trim(), contract: $("#eContract").value,
      startDate: $("#eStart").value ? new Date($("#eStart").value).toISOString() : "", phone: $("#ePhone").value.trim(),
      email: $("#eEmail").value.trim(), address: $("#eAddress").value.trim(), cnps: $("#eCnps").value.trim(),
      cni: $("#eCni").value.trim(), passport: $("#ePassport").value.trim(), status: $("#eStatus").value
    };
    S.upsertEmployee(patch);
    if (!empId) { const created = S.employees().find(x => x.name === patch.name && x.role === patch.role); if (created) empId = created.id; }
    return Promise.resolve();
  }

  // ===================== GRANT CREDIT (refund / goodwill) =====================
  let creditType = "goodwill";
  function openCredit(customerId) {
    const c = S.getCustomer(customerId); if (!c) return;
    creditType = "goodwill";
    $("#creditTitle").textContent = t("creditGrant") + " " + t("creditTo") + " " + c.name.split(" ")[0];
    $("#creditModal").classList.add("open");
    $("#creditBody").innerHTML = `
      <div class="dr-section-label" style="color:var(--chocolate-2)">${t("creditType")}</div>
      <div class="seg-pills" style="margin-bottom:14px">
        <button type="button" class="seg-pill on" data-ct="goodwill" style="border-color:var(--line);color:var(--chocolate)">🎁 ${t("creditGoodwill")}</button>
        <button type="button" class="seg-pill" data-ct="refund" style="border-color:var(--line);color:var(--chocolate)">↩️ ${t("creditRefund")}</button>
      </div>
      <div class="field"><label>${t("creditAmount")}</label><input id="crAmount" type="number" min="0" placeholder="5000"></div>
      <div class="field"><label>${t("creditNote")}</label><input id="crNote" placeholder="—"></div>
      <div class="pay-note" style="background:rgba(217,154,78,.14);border:1px solid rgba(217,154,78,.4);color:#7a5a18">💡 ${t("creditValidity")}</div>
      <button class="btn coral" id="crGive" style="width:100%;margin-top:14px">${t("creditGive")}</button>`;
    $$("#creditBody .seg-pill").forEach(p => p.onclick = () => { creditType = p.dataset.ct; $$("#creditBody .seg-pill").forEach(x => { x.classList.toggle("on", x === p); x.style.background = x === p ? "var(--coral)" : ""; x.style.color = x === p ? "#fff" : "var(--chocolate)"; }); });
    $("#crGive").onclick = () => {
      const amt = +$("#crAmount").value; if (!amt) return toast(L() === "en" ? "Enter an amount" : "Saisis un montant");
      S.grantCredit(customerId, amt, creditType, $("#crNote").value.trim());
      $("#creditModal").classList.remove("open"); toast("🎁 " + t("creditGranted")); renderClients();
    };
  }

  // ===================== PREP TIME (learning algorithm + AI agent) =====================
  function renderPrep() {
    S.runPrepAgent(); // refresh learned values (respects the 14-day window)
    const set = S.settings(); const aiOn = !(set.aiAgent && set.aiAgent.prep === false);
    $("#prepBar").innerHTML = `
      <div class="agent-banner">
        <div class="agent-ic">🤖</div>
        <div style="flex:1"><h3 style="margin:0">${t("aiPrepAgent")}</h3><p class="sub" style="color:var(--muted)">${t("aiPrepDesc")}</p></div>
        <div style="display:flex;align-items:center;gap:10px"><small class="muted">${aiOn ? t("aiOn") : t("aiOff")}</small><button class="toggle ${aiOn ? "on" : ""}" id="aiPrepToggle"></button></div>
      </div>`;
    $("#aiPrepToggle").onclick = () => { const a = Object.assign({}, set.aiAgent); a.prep = !aiOn; S.saveSettings({ aiAgent: a }); toast(t("saved")); renderPrep(); };
    $("#prepTitle2").textContent = t("prepTitle"); $("#prepDesc2").textContent = t("prepDesc");
    $("#prepTable").innerHTML = `<table><thead><tr><th>${t("prepProduct")}</th><th>${t("prepDef")}</th><th>${t("prepLearned")}</th><th>${t("prepManual")}</th><th>${t("prepUsed")}</th><th>${t("prepSamples")}</th><th>${t("prepLastAdj")}</th></tr></thead><tbody>
      ${LGM.menu.map(m => { const p = S.prepInfo(m.id); const used = S.prepFor(m.id);
        return `<tr><td><b>${L() === "en" ? m.en : m.fr}</b></td>
          <td>${p.def} ${t("min")}</td>
          <td>${p.learned != null ? "<b style='color:#7b5cff'>" + p.learned + " " + t("min") + "</b>" : "—"}</td>
          <td><input class="sel" style="width:78px" type="number" min="0" data-prep="${m.id}" value="${p.manual != null ? p.manual : ""}" placeholder="${p.def}"></td>
          <td><span class="tag" style="background:${aiOn ? "#7b5cff" : "#caa14a"}">${used} ${t("min")}</span></td>
          <td>${p.samples}</td>
          <td>${p.lastAdjust ? new Date(p.lastAdjust).toLocaleDateString(L() === "en" ? "en-GB" : "fr-FR") : "<span class='muted'>" + t("prepNever") + "</span>"}</td></tr>`; }).join("")}
      </tbody></table>`;
    $$("[data-prep]", $("#prepTable")).forEach(inp => inp.onchange = () => { S.setManualPrep(inp.dataset.prep, inp.value); toast(t("saved")); renderPrep(); });
  }

  // ---- AI agent tick: auto-accept + auto-advance prep (runs while dashboard is open; prod uses a server cron) ----
  let agentTimer = null;
  function agentTick() {
    const set = S.settings(); const ai = set.aiAgent || {};
    let touched = false;
    S.orders().forEach(o => {
      // accept gate (independent of the tracker)
      if (ai.autoAccept && o.status === "pending") { S.acceptOrder(o.id); touched = true; }
      // auto tracker: runs on its own toggle, NOT tied to how the order was accepted.
      // scheduled (planned) orders don't start prep until their slot is near, and are ready by the slot.
      if (ai.autoTracker !== false) {
        const planned = o.fulfilMode === "planned" && o.plannedAt;
        const eta = o.etaMin || S.orderEta(o);
        if (o.status === "received") {
          const startDue = planned ? (new Date(o.plannedAt).getTime() - eta * 60000) : Date.now();
          if (Date.now() >= startDue) { S.updateOrder(o.id, { status: "preparing" }); touched = true; }
        }
        else if (o.status === "preparing" && o.statusTimes && o.statusTimes.preparing) {
          const due = planned ? new Date(o.plannedAt).getTime() : (new Date(o.statusTimes.preparing).getTime() + eta * 60000);
          if (Date.now() >= due) { S.updateOrder(o.id, { status: "ready" }); touched = true; } // prod: server auto-sends WhatsApp here
        }
      }
    });
    if (touched && ["dash", "orders"].includes(currentView())) render();
  }
  function startAgent() { if (agentTimer) clearInterval(agentTimer); agentTick(); agentTimer = setInterval(agentTick, 7000); }

  const esc = s => String(s == null ? "" : s).replace(/"/g, "&quot;");

  // ---- master render ----
  function render() {
    applyChrome();
    const v = currentView();
    if (v === "dash") renderDash();
    else if (v === "orders") renderOrders();
    else if (v === "clients") renderClients();
    else if (v === "finances") renderFinances();
    else if (v === "satisfaction") renderSatisfaction();
    else if (v === "truck") renderTruck();
    else if (v === "events") renderEvents();
    else if (v === "stock") renderStock();
    else if (v === "bookings") renderBookings();
    else if (v === "highlights") renderHighlightsAdmin();
    else if (v === "photos") renderPhotos();
    else if (v === "team") renderEmployees();
    else if (v === "prep") renderPrep();
    else if (v === "settings") renderSettings();
  }
  function applyChrome() {
    $("#langBtn").textContent = LGM.t("lang.toggle");
    $$(".navlink[data-view] .lbl").forEach(el => el.textContent = t(el.parentElement.dataset.view === "dash" ? "dash" : el.parentElement.dataset.view));
    $("#welcomeMsg").textContent = t("welcome");
    $("#viewSiteBtn").textContent = t("site");
    $("#viewTitle").textContent = t(currentView() === "dash" ? "dash" : currentView());
    const pl = { day: t("pDay"), week: t("pWeek"), month: t("pMonth"), quarter: t("pQuarter"), year: t("pYear") };
    $$(".range-seg button").forEach(b => { b.textContent = pl[b.dataset.p] || b.textContent; b.classList.toggle("on", b.dataset.p === period); });
    $("#empAgentTitle") && ($("#empAgentTitle").textContent = t("empAgent") + " — "); $("#empAgentDesc") && ($("#empAgentDesc").textContent = t("empAgentDesc"));
  }

  // clicking a notification jumps straight to the order it refers to
  function openNotif(n) {
    if (!n || !n.orderId) { showView("orders"); return; }
    const o = S.orders().find(x => x.id === n.orderId);
    orderFilter = "all"; orderSearch = o ? o.ref.toLowerCase() : "";
    showView("orders");
    setTimeout(() => {
      const sel = `[data-oid="${n.orderId}"],[data-accept="${n.orderId}"],[data-settle="${n.orderId}"],[data-deposit="${n.orderId}"]`;
      const hit = document.querySelector("#orderBoard " + sel) || document.querySelector("#ordersTable " + sel);
      const target = hit ? (hit.closest(".board-card") || hit.closest("tr")) : null;
      if (target) { target.scrollIntoView({ behavior: "smooth", block: "center" }); target.classList.add("row-flash"); setTimeout(() => target.classList.remove("row-flash"), 2200); }
    }, 180);
  }
  function boot() { initNav(); S.runPrepAgent(); startAgent(); if (LGM.mountBell) LGM.mountBell(document.getElementById("notifMount"), () => "admin", openNotif); showView("dash"); }

  document.addEventListener("DOMContentLoaded", () => {
    S.freshenDemo(24);
    document.documentElement.lang = L();
    if (gate()) boot();
  });
})();
