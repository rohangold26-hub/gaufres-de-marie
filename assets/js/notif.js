/* =====================================================================
   Les Gaufres de Marie — header notification bell (sound + synced)
   LGM.mountBell(containerEl, audienceFn) — audienceFn returns "admin"
   or a customer id (or null when nobody is signed in / no bell).
   Polls the shared store + listens to cross-tab storage events, plays a
   chime on new items, badges the unread count, marks read on open.
   ===================================================================== */
(function (root) {
  const LGM = (root.LGM = root.LGM || {});
  function timeAgo(iso) {
    const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000), l = LGM.lang === "en";
    if (s < 60) return l ? "just now" : "à l'instant";
    if (s < 3600) return Math.floor(s / 60) + " min";
    if (s < 86400) return Math.floor(s / 3600) + " h";
    return Math.floor(s / 86400) + (l ? " d" : " j");
  }
  LGM.mountBell = function (container, audienceFn, onOpen) {
    if (!container) return;
    container.classList.add("notif-wrap");
    container.innerHTML = `
      <button class="notif-bell" id="notifBtn" aria-label="Notifications">🔔<span class="notif-badge" id="notifBadge">0</span></button>
      <div class="notif-panel" id="notifPanel">
        <div class="notif-head"><b id="notifTitle">Notifications</b><button class="notif-mute" id="notifMute" title="Son"></button></div>
        <div class="notif-list" id="notifList"></div>
      </div>`;
    const badge = container.querySelector("#notifBadge"), list = container.querySelector("#notifList"),
      panel = container.querySelector("#notifPanel"), muteBtn = container.querySelector("#notifMute");
    let lastUnread = -1;
    function refresh(withSound) {
      const aud = audienceFn();
      if (!aud) { container.style.display = "none"; return; }
      container.style.display = "";
      container.querySelector("#notifTitle").textContent = LGM.lang === "en" ? "Notifications" : "Notifications";
      const items = LGM.store.notifications(aud), unread = items.filter(n => !n.read).length;
      badge.textContent = unread; badge.style.display = unread ? "grid" : "none";
      container.querySelector("#notifBtn").classList.toggle("has-unread", unread > 0);
      if (withSound && lastUnread >= 0 && unread > lastUnread) LGM.playChime();
      lastUnread = unread;
      muteBtn.textContent = LGM.muted() ? "🔇" : "🔔";
      list.innerHTML = items.slice(0, 25).map(n => { const lb = LGM.notifLabel(n, LGM.lang);
        const clickable = n.orderId ? "clickable" : "";
        return `<div class="notif-item ${n.read ? "" : "unread"} ${clickable}" data-nid="${n.id}"><span class="ni-e">${lb.emoji}</span><div class="ni-t">${lb.text}<small>${timeAgo(n.at)}</small></div>${n.orderId ? '<span class="ni-go">›</span>' : ""}</div>`;
      }).join("") || `<div class="notif-empty">${LGM.lang === "en" ? "No notifications yet" : "Aucune notification"}</div>`;
    }
    // click a notification → jump to the order it refers to (page decides where)
    list.onclick = e => {
      const item = e.target.closest(".notif-item"); if (!item) return;
      const aud = audienceFn(); const n = (LGM.store.notifications(aud) || []).find(x => x.id === item.dataset.nid);
      if (!n) return;
      LGM.store.markRead(aud); panel.classList.remove("open"); refresh(false);
      if (typeof onOpen === "function") onOpen(n);
    };
    container.querySelector("#notifBtn").onclick = e => {
      e.stopPropagation();
      const open = panel.classList.toggle("open");
      if (open) { const aud = audienceFn(); if (aud) LGM.store.markRead(aud); refresh(false); }
    };
    muteBtn.onclick = e => { e.stopPropagation(); LGM.setMuted(!LGM.muted()); refresh(false); if (!LGM.muted()) LGM.playChime(); };
    document.addEventListener("click", e => { if (!container.contains(e.target)) panel.classList.remove("open"); });
    window.addEventListener("storage", e => { if (!e.key || e.key === "lgm_db_v9") refresh(true); });
    // resume audio on first user gesture (autoplay policy)
    window.addEventListener("pointerdown", () => { try { if (LGM._audio && LGM._audio.state === "suspended") LGM._audio.resume(); } catch (x) {} }, { once: true });
    refresh(false);
    setInterval(() => refresh(true), 4000);
    LGM._bellRefresh = refresh;
    return refresh;
  };
})(window);
