/* =====================================================================
   Les Gaufres de Marie — read-only employee portal (token link)
   Employees can VIEW their file, documents and pay history.
   The ONLY thing they can change is their photo/selfie.
   ===================================================================== */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const S = LGM.store, L = () => LGM.lang, fmt = x => LGM.fmt(x, L());
  const token = new URLSearchParams(location.search).get("e");

  function toast(m) { const e = $("#toast"); e.textContent = m; e.classList.add("show"); clearTimeout(e._t); e._t = setTimeout(() => e.classList.remove("show"), 2200); }
  const tx = (fr, en) => (L() === "en" ? en : fr);

  function resizeImage(file, max, q) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => { const img = new Image(); img.onload = () => { const s = Math.min(1, max / Math.max(img.width, img.height)); const w = img.width * s | 0, h = img.height * s | 0; const c = document.createElement("canvas"); c.width = w; c.height = h; c.getContext("2d").drawImage(img, 0, 0, w, h); res(c.toDataURL("image/jpeg", q || 0.72)); }; img.onerror = rej; img.src = r.result; };
      r.onerror = rej; r.readAsDataURL(file);
    });
  }

  function render() {
    const emp = token ? S.employeeByToken(token) : null;
    if (!emp) {
      $("#epRoot").innerHTML = `<div class="ep-bad"><svg style="width:72px;height:72px;margin:0 auto 14px"><use href="#lgmLogo"/></svg>
        <h2 style="font-family:'Playfair Display',serif;color:var(--chocolate)">${tx("Lien invalide", "Invalid link")}</h2>
        <p class="muted" style="margin-top:8px">${tx("Ce lien employé n'est pas valide. Demandez un nouveau lien à votre employeur.", "This employee link is not valid. Ask your employer for a new one.")}</p></div>`;
      return;
    }
    const c = LGM.contractTypes.find(x => x.id === emp.contract);
    const docs = emp.documents || {}, pays = emp.payHistory || [];
    $("#epRoot").innerHTML = `
      <section class="ep-hero">
        <svg style="width:64px;height:64px"><use href="#lgmLogo"/></svg>
        <h1 style="font-size:1.6rem;margin-top:10px">${tx("Espace employé", "Employee space")}</h1>
        <p style="opacity:.85">${LGM.business.name}</p>
      </section>
      <div class="ep-wrap"><div class="ep-card">
        <div class="ep-head">
          <div class="ep-ava" id="epAva">${emp.photo ? `<img src="${emp.photo}" alt="">` : `<span>${(emp.name || "?").split(" ").map(x => x[0]).slice(0, 2).join("")}</span>`}
            <label class="cam" title="${tx("Changer la photo", "Change photo")}">📷<input type="file" accept="image/*" id="epPhoto" hidden></label></div>
          <div class="ep-who"><b>${emp.name}</b><span class="role">${emp.role || ""}</span>
            <small>${c ? LGM.nm(c) : ""} · ${tx("Ancienneté", "Tenure")}: ${LGM.tenure(emp.startDate, L())}</small></div>
        </div>
        <div class="ep-body">
          <div class="ep-grid">
            ${field(tx("Date d'embauche", "Start date"), emp.startDate ? new Date(emp.startDate).toLocaleDateString(L() === "en" ? "en-GB" : "fr-FR") : "—")}
            ${field(tx("Type de contrat", "Contract"), c ? LGM.nm(c) : "—")}
            ${field(tx("Téléphone", "Phone"), emp.phone || "—")}
            ${field("Email", emp.email || "—")}
            ${field(tx("Adresse", "Address"), emp.address || "—")}
            ${field(tx("Numéro CNPS", "CNPS number"), emp.cnps || "—")}
            ${field(tx("Numéro CNI", "National ID"), emp.cni || "—")}
            ${field(tx("Passeport", "Passport"), emp.passport || "—")}
          </div>

          <div class="ep-title">📎 ${tx("Mes documents", "My documents")}</div>
          ${LGM.docTypes.map(dt => { const dv = docs[dt.id]; return `<div class="ep-doc"><span>${LGM.nm(dt)}</span>${dv ? `<a href="${dv.url}" download="${dv.name || dt.id}" target="_blank">${tx("Télécharger", "Download")} ↓</a>` : `<span class="miss">${tx("Non fourni", "Not provided")}</span>`}</div>`; }).join("")}

          <div class="ep-title">💵 ${tx("Mes paiements", "My payments")}</div>
          ${pays.length ? pays.map(p => `<div class="ep-pay"><span>${new Date(p.date).toLocaleDateString(L() === "en" ? "en-GB" : "fr-FR")} · ${p.period || ""}</span><b>${fmt(p.amount)}</b><span class="muted">${payName(p.method)}</span></div>`).join("") : `<p class="muted">${tx("Aucun paiement enregistré.", "No payments yet.")}</p>`}

          <div class="ep-note">🔒 ${tx("Cet espace est en lecture seule. Vous pouvez uniquement mettre à jour votre photo. Pour toute correction, contactez votre employeur.", "This space is read-only. You can only update your photo. For any correction, contact your employer.")}</div>
        </div>
      </div></div>`;

    $("#epPhoto").onchange = async ev => {
      const f = ev.target.files[0]; if (!f) return;
      try { const url = await resizeImage(f, 600, 0.78); S.setEmployeePhoto(emp.id, url); toast("📷 " + tx("Photo mise à jour", "Photo updated")); render(); }
      catch (e) { toast("⚠️ " + e); }
    };
  }
  function field(l, v) { return `<div class="ep-field"><div class="l">${l}</div><div class="v">${v}</div></div>`; }
  function payName(id) { const p = LGM.payments.find(x => x.id === id); return p ? LGM.nm(p) : (id || ""); }

  document.addEventListener("DOMContentLoaded", () => { document.documentElement.lang = L(); render(); });
})();
