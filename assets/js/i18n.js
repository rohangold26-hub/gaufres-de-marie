/* =====================================================================
   Les Gaufres de Marie — i18n (FR / EN)
   Usage: LGM.t('key'), LGM.setLang('en'|'fr'), LGM.lang
   data-i18n="key" on any element gets auto-translated by app.js/admin.js
   ===================================================================== */
(function (root) {
  const LGM = (root.LGM = root.LGM || {});

  const STR = {
    fr: {
      // nav
      "nav.menu": "Le Menu", "nav.about": "L'Histoire", "nav.truck": "Le Food Truck",
      "nav.order": "Commander", "nav.account": "Mon compte", "nav.cart": "Panier",
      "nav.cta": "Commander",
      // hero
      "hero.eyebrow": "Gaufres belges artisanales · Abidjan",
      "hero.title1": "Chaudes, dorées &", "hero.title2": "noyées de", "hero.titleEm": "chocolat",
      "hero.tag": "Pâte maison, sucre perlé belge et une rivière de chocolat qui ne s'arrête jamais. Foodtruck gourmand & fait maison, à Abidjan.",
      "hero.cta1": "Commander en ligne", "hero.cta2": "Trouver le truck",
      // menu
      "menu.kicker": "Le Menu", "menu.title": "Nos gourmandises",
      "menu.sub": "Cuites minute sur fer en fonte. Ajoutez au panier et commandez en quelques secondes.",
      "menu.add": "Ajouter", "menu.added": "Ajouté ✓", "menu.estimated": "prix indicatif",
      // about
      "about.kicker": "L'Histoire", "about.title": "Un foodtruck, une passion du fait maison",
      "about.lead": "Les Gaufres de Marie, c'est un foodtruck gourmand né à Abidjan d'une recette de famille et d'une obsession : la gourmandise bien faite.",
      "about.p1": "Tout est fait maison, de la pâte aux nappages, jusqu'à la limonade. Bruxelloises croustillantes, Liégeoises briochées au sucre perlé, bowls généreux : chaque gaufre est cuite minute.",
      "about.p2": "Le chocolat ? Coulé d'une main généreuse. Parce que le meilleur moment, c'est de le voir disparaître dans les alvéoles.",
      "about.stat1": "Fait maison", "about.stat1l": "Chaque jour",
      "about.stat2": "2", "about.stat2l": "Spots à Abidjan",
      "about.stat3": "5 000+", "about.stat3l": "Gourmands régalés",
      "social.followers": "abonnés", "social.proof": "Rejoignez la communauté",
      // truck
      "truck.kicker": "Sur la route", "truck.title": "Trouver le truck 🚚",
      "truck.sub": "Notre camion corail sillonne Abidjan. Voici où nous trouver cette semaine.",
      "truck.directions": "Itinéraire", "truck.call": "Appeler", "truck.updated": "Mis à jour",
      // order / checkout
      "order.kicker": "Commander & Contact", "order.title": "Passez votre commande",
      "order.sub": "Récupération au truck, événement ou livraison. On confirme par WhatsApp.",
      "cart.title": "Votre panier", "cart.empty": "Votre panier est vide. Ajoutez une gourmandise !",
      "cart.subtotal": "Sous-total", "cart.total": "Total", "cart.checkout": "Passer au paiement",
      "cart.clear": "Vider", "cart.qty": "Qté",
      "co.title": "Finaliser la commande", "co.your": "Vos infos", "co.name": "Nom complet",
      "co.phone": "Téléphone / WhatsApp", "co.email": "Email (optionnel)",
      "co.type": "Type de commande", "co.location": "Spot de récupération", "co.notes": "Note (optionnel)",
      "co.notesPh": "Ex : sans noisette, pour 14h…",
      "co.payment": "Moyen de paiement", "co.momo": "Numéro Mobile Money",
      "co.pay": "Payer", "co.placeFree": "Confirmer la commande",
      "co.success": "Commande confirmée !", "co.successSub": "Marie a bien reçu votre commande. Vous serez recontacté(e) par WhatsApp.",
      "co.ref": "Référence", "co.continue": "Continuer", "co.paywith": "Payer avec",
      "co.securedBy": "Paiement sécurisé", "co.points": "Vous gagnez {n} points fidélité",
      // account
      "acc.title": "Mon compte", "acc.login": "Se connecter", "acc.logout": "Déconnexion",
      "acc.create": "Créer mon profil", "acc.welcome": "Bonjour", "acc.guestNote": "Créez votre profil pour cumuler des points et débloquer des badges.",
      "acc.lifetime": "Total dépensé", "acc.ordersCount": "Commandes", "acc.pts": "Points",
      "acc.badge": "Badge", "acc.next": "Prochain badge", "acc.toNext": "Plus que {n} F",
      "acc.history": "Mes commandes", "acc.fav": "Vos favoris", "acc.none": "Pas encore de commande.",
      "acc.emailLabel": "Email", "acc.phoneLabel": "Téléphone",
      "acc.signin": "Se connecter", "acc.signup": "Créer un compte", "acc.password": "Mot de passe",
      "acc.identifier": "Email ou téléphone", "acc.submitSignin": "Connexion", "acc.submitSignup": "Créer mon compte",
      "acc.backSite": "← Retour au site", "acc.order": "Commander", "acc.reorder": "Recommander",
      "acc.badPass": "Mot de passe incorrect.", "acc.notFound": "Aucun compte pour cet identifiant.",
      "acc.haveAccount": "Déjà un compte ?", "acc.noAccount": "Pas encore de compte ?", "acc.demoTitle": "Compte de démonstration",
      "acc.greet": "Bon retour", "acc.memberSince": "Membre depuis", "acc.favEmpty": "Ajoute des favoris en commandant.",
      "acc.profileSub": "Votre espace fidélité",
      "survey.title": "Votre avis compte 🧡", "survey.sub": "Comment était votre commande {ref} ?",
      "survey.comment": "Un petit mot ? (optionnel)", "survey.submit": "Envoyer mon avis",
      "survey.thanks": "Merci pour votre avis !", "survey.pending": "À noter",
      "survey.rate": "Note de 0 à 5 étoiles",
      // footer
      "foot.sub": "Foodtruck gourmand & fait maison · Abidjan",
      "foot.rights": "Faites avec du beurre, du sucre & beaucoup d'amour",
      "foot.admin": "Espace Marie",
      "hl.kicker": "En ce moment", "hl.title": "Les actus de Marie", "hl.sub": "Nouveautés, événements et coups de cœur du foodtruck.",
      "book.kicker": "Événements & traiteur", "book.title": "Réserve le food truck",
      "book.sub": "Anniversaire, mariage, entreprise… reçois un devis automatique en quelques secondes.",
      "book.cta": "Demander un devis", "book.basis": "Estimer selon", "book.people": "Nombre de personnes",
      "book.items": "Nombre de gaufres", "book.place": "Lieu de l'événement", "book.type": "Type d'événement",
      "book.date": "Date", "book.notes": "Détails (optionnel)", "book.estimate": "Estimation",
      "book.send": "Envoyer la demande", "book.success": "Demande envoyée !",
      "book.successSub": "Marie a bien reçu votre demande et votre devis. Elle vous recontacte par WhatsApp pour confirmer.",
      "book.quoteNote": "Devis indicatif, ajustable selon le menu choisi.", "book.travel": "Déplacement & installation",
      "book.staff": "Service", "book.eventFee": "Forfait événement", "book.deposit": "Acompte (30%)",
      "book.byPeople": "Personnes", "book.byItems": "Gaufres", "book.subtotal": "Total estimé",
      "menu.soldout": "Épuisé", "menu.low": "Bientôt épuisé",
      "chat.title": "Assistant Marie", "chat.ph": "Posez votre question…",
      "chat.greet": "Bonjour ! 👋 Je suis l'assistant des Gaufres de Marie. Menu, prix, horaires, livraison, réservation… comment puis-je vous aider ?",
      "chat.human": "Parler à un humain (WhatsApp)", "chat.send": "Envoyer", "chat.open": "Une question ?",
      // misc
      "common.from": "dès", "common.close": "Fermer", "common.cancel": "Annuler", "common.save": "Enregistrer",
      "nav.signin": "Se connecter",
      "acc.quartier": "Quartier", "acc.commune": "Commune",
      "acc.consent": "J'accepte que mes données soient utilisées uniquement pour le traitement de mes commandes.",
      "acc.consentReq": "Merci d'accepter les conditions pour continuer.",
      "acc.addressOpt": "Adresse (utile pour la livraison)",
      "co.fulfilment": "Comment récupérer votre commande ?",
      "co.address": "Adresse de livraison (quartier, commune)",
      "co.cardNote": "Vous serez redirigé(e) vers le paiement sécurisé après validation.",
      "co.cashNote": "À régler en espèces à la récupération.",
      "co.djamoNote": "Paiement via l'app Djamo après validation.",
      "co.waConfirm": "Recevoir ma confirmation sur WhatsApp",
      "co.when": "Quand souhaitez-vous être servi(e) ?", "co.asap": "Dès que possible", "co.planned": "Planifier",
      "co.date": "Date", "co.slot": "Créneau horaire", "co.remaining": "Reste à payer",
      "co.chargeNote": "Vous serez débité(e) sur ce numéro de téléphone.", "co.emailPh": "Email (pour le reçu)",
      "co.phonePay": "Téléphone (numéro de paiement)", "co.needPhone": "Entrez le numéro de téléphone où vous serez débité(e).",
      "acc.address": "Adresse de livraison", "acc.myInfo": "Mes informations", "acc.saveInfo": "Enregistrer mes infos",
      "acc.infoSaved": "Informations mises à jour ✓", "acc.addressPh": "Quartier, commune, repère",
      "demo.cta": " · Je veux ce site pour mon business →",
      "lang.toggle": "EN"
    },
    en: {
      "nav.menu": "Menu", "nav.about": "Our Story", "nav.truck": "Food Truck",
      "nav.order": "Order", "nav.account": "My account", "nav.cart": "Cart",
      "nav.cta": "Order",
      "hero.eyebrow": "Artisan Belgian waffles · Abidjan",
      "hero.title1": "Warm, golden &", "hero.title2": "drowned in", "hero.titleEm": "chocolate",
      "hero.tag": "Homemade batter, Belgian pearl sugar and a river of chocolate that never stops. A gourmet, homemade food truck in Abidjan.",
      "hero.cta1": "Order online", "hero.cta2": "Find the truck",
      "menu.kicker": "The Menu", "menu.title": "Our treats",
      "menu.sub": "Cooked to order on cast-iron irons. Add to cart and order in seconds.",
      "menu.add": "Add", "menu.added": "Added ✓", "menu.estimated": "indicative price",
      "about.kicker": "Our Story", "about.title": "One food truck, a love of homemade",
      "about.lead": "Les Gaufres de Marie is a gourmet food truck born in Abidjan from a family recipe and one obsession: indulgence, done right.",
      "about.p1": "Everything is homemade, from the batter to the toppings and even the lemonade. Crisp Brussels waffles, brioche Liège waffles with pearl sugar, loaded bowls: each one cooked to order.",
      "about.p2": "The chocolate? Poured with a generous hand. Because the best part is watching it disappear into the pockets.",
      "about.stat1": "Homemade", "about.stat1l": "Every day",
      "about.stat2": "2", "about.stat2l": "Spots in Abidjan",
      "about.stat3": "5,000+", "about.stat3l": "Treats served",
      "social.followers": "followers", "social.proof": "Join the community",
      "truck.kicker": "On the road", "truck.title": "Find the truck 🚚",
      "truck.sub": "Our coral truck roams Abidjan. Here's where to find us this week.",
      "truck.directions": "Directions", "truck.call": "Call", "truck.updated": "Updated",
      "order.kicker": "Order & Contact", "order.title": "Place your order",
      "order.sub": "Pickup at the truck, event or delivery. We confirm on WhatsApp.",
      "cart.title": "Your cart", "cart.empty": "Your cart is empty. Add a treat!",
      "cart.subtotal": "Subtotal", "cart.total": "Total", "cart.checkout": "Go to payment",
      "cart.clear": "Clear", "cart.qty": "Qty",
      "co.title": "Complete your order", "co.your": "Your details", "co.name": "Full name",
      "co.phone": "Phone / WhatsApp", "co.email": "Email (optional)",
      "co.type": "Order type", "co.location": "Pickup spot", "co.notes": "Note (optional)",
      "co.notesPh": "e.g. no hazelnut, for 2pm…",
      "co.payment": "Payment method", "co.momo": "Mobile Money number",
      "co.pay": "Pay", "co.placeFree": "Confirm order",
      "co.success": "Order confirmed!", "co.successSub": "Marie received your order. You'll be contacted on WhatsApp.",
      "co.ref": "Reference", "co.continue": "Continue", "co.paywith": "Pay with",
      "co.securedBy": "Secure payment", "co.points": "You earn {n} loyalty points",
      "acc.title": "My account", "acc.login": "Log in", "acc.logout": "Log out",
      "acc.create": "Create my profile", "acc.welcome": "Hi", "acc.guestNote": "Create your profile to earn points and unlock badges.",
      "acc.lifetime": "Lifetime spend", "acc.ordersCount": "Orders", "acc.pts": "Points",
      "acc.badge": "Badge", "acc.next": "Next badge", "acc.toNext": "{n} F to go",
      "acc.history": "My orders", "acc.fav": "Your favourites", "acc.none": "No orders yet.",
      "acc.emailLabel": "Email", "acc.phoneLabel": "Phone",
      "acc.signin": "Sign in", "acc.signup": "Create account", "acc.password": "Password",
      "acc.identifier": "Email or phone", "acc.submitSignin": "Log in", "acc.submitSignup": "Create my account",
      "acc.backSite": "← Back to site", "acc.order": "Order", "acc.reorder": "Reorder",
      "acc.badPass": "Wrong password.", "acc.notFound": "No account for that login.",
      "acc.haveAccount": "Already have an account?", "acc.noAccount": "No account yet?", "acc.demoTitle": "Demo account",
      "acc.greet": "Welcome back", "acc.memberSince": "Member since", "acc.favEmpty": "Add favourites by ordering.",
      "acc.profileSub": "Your loyalty space",
      "survey.title": "Your feedback matters 🧡", "survey.sub": "How was your order {ref}?",
      "survey.comment": "A quick word? (optional)", "survey.submit": "Send my review",
      "survey.thanks": "Thanks for your review!", "survey.pending": "To rate",
      "survey.rate": "Rate from 0 to 5 stars",
      "foot.sub": "Gourmet, homemade food truck · Abidjan",
      "foot.rights": "Made with butter, sugar & a lot of love",
      "foot.admin": "Marie's space",
      "hl.kicker": "Right now", "hl.title": "Marie's highlights", "hl.sub": "News, events and favourites from the food truck.",
      "book.kicker": "Events & catering", "book.title": "Book the food truck",
      "book.sub": "Birthday, wedding, corporate… get an automatic quote in seconds.",
      "book.cta": "Get a quote", "book.basis": "Estimate by", "book.people": "Number of guests",
      "book.items": "Number of waffles", "book.place": "Event location", "book.type": "Event type",
      "book.date": "Date", "book.notes": "Details (optional)", "book.estimate": "Estimate",
      "book.send": "Send request", "book.success": "Request sent!",
      "book.successSub": "Marie received your request and quote. She'll reach out on WhatsApp to confirm.",
      "book.quoteNote": "Indicative quote, adjustable to the chosen menu.", "book.travel": "Travel & setup",
      "book.staff": "Service", "book.eventFee": "Event fee", "book.deposit": "Deposit (30%)",
      "book.byPeople": "Guests", "book.byItems": "Waffles", "book.subtotal": "Estimated total",
      "menu.soldout": "Sold out", "menu.low": "Almost gone",
      "chat.title": "Marie Assistant", "chat.ph": "Ask a question…",
      "chat.greet": "Hi! 👋 I'm the Gaufres de Marie assistant. Menu, prices, hours, delivery, booking… how can I help?",
      "chat.human": "Talk to a human (WhatsApp)", "chat.send": "Send", "chat.open": "Need help?",
      "common.from": "from", "common.close": "Close", "common.cancel": "Cancel", "common.save": "Save",
      "nav.signin": "Sign in",
      "acc.quartier": "Neighbourhood", "acc.commune": "Commune",
      "acc.consent": "I agree that my data is used only to process my orders.",
      "acc.consentReq": "Please accept the terms to continue.",
      "acc.addressOpt": "Address (useful for delivery)",
      "co.fulfilment": "How do you want your order?",
      "co.address": "Delivery address (neighbourhood, commune)",
      "co.cardNote": "You'll be redirected to secure payment after you confirm.",
      "co.cashNote": "Pay in cash on pickup.",
      "co.djamoNote": "Pay via the Djamo app after you confirm.",
      "co.waConfirm": "Get my confirmation on WhatsApp",
      "co.when": "When would you like to be served?", "co.asap": "As soon as possible", "co.planned": "Schedule",
      "co.date": "Date", "co.slot": "Time slot", "co.remaining": "Left to pay",
      "co.chargeNote": "You'll be charged on this phone number.", "co.emailPh": "Email (for the receipt)",
      "co.phonePay": "Phone (payment number)", "co.needPhone": "Enter the phone number you'll be charged on.",
      "acc.address": "Delivery address", "acc.myInfo": "My details", "acc.saveInfo": "Save my details",
      "acc.infoSaved": "Details updated ✓", "acc.addressPh": "Neighbourhood, commune, landmark",
      "demo.cta": " · I want this site for my business →",
      "lang.toggle": "FR"
    }
  };

  LGM.lang = localStorage.getItem("lgm_lang") || "fr";
  LGM._i18nListeners = [];

  LGM.t = function (key, vars) {
    let s = (STR[LGM.lang] && STR[LGM.lang][key]) || (STR.fr[key]) || key;
    if (vars) for (const k in vars) s = s.replace("{" + k + "}", vars[k]);
    return s;
  };
  LGM.setLang = function (lang) {
    LGM.lang = lang === "en" ? "en" : "fr";
    localStorage.setItem("lgm_lang", LGM.lang);
    document.documentElement.lang = LGM.lang;
    LGM.applyI18n();
    LGM._i18nListeners.forEach(fn => { try { fn(LGM.lang); } catch (e) {} });
  };
  LGM.onLang = function (fn) { LGM._i18nListeners.push(fn); };

  // apply to all [data-i18n], [data-i18n-ph] (placeholder), [data-i18n-html]
  LGM.applyI18n = function (scope) {
    const r = scope || document;
    r.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = LGM.t(el.getAttribute("data-i18n")); });
    r.querySelectorAll("[data-i18n-ph]").forEach(el => { el.setAttribute("placeholder", LGM.t(el.getAttribute("data-i18n-ph"))); });
    r.querySelectorAll("[data-i18n-html]").forEach(el => { el.innerHTML = LGM.t(el.getAttribute("data-i18n-html")); });
  };

  // pick localized field from a data object: nm(item,'fr'/'en') -> item.fr/item.en
  LGM.nm = function (obj) { return (obj && (obj[LGM.lang] || obj.fr)) || ""; };
  LGM.desc = function (obj) {
    if (!obj) return "";
    return LGM.lang === "en" ? (obj.descEn || obj.descFr || "") : (obj.descFr || obj.descEn || "");
  };
  LGM.day = function (obj) { return LGM.lang === "en" ? (obj.day_en || obj.day_fr) : (obj.day_fr || obj.day_en); };

})(window);
