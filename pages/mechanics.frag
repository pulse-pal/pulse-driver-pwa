<style>
  #mechanics-page .mechanic-card-v2 {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    padding: 16px;
    border-radius: 18px;
    background: linear-gradient(160deg, var(--color-card-solid) 0%, var(--color-bg-card) 100%);
    border: 1px solid rgba(var(--shadow-rgb), 0.05);
    box-shadow: 0 2px 4px rgba(var(--shadow-rgb), 0.03), 0 10px 24px rgba(var(--shadow-rgb), 0.06);
    transition: transform var(--transition-fast);
  }
  #mechanics-page .mechanic-card-v2:active {
    transform: scale(0.98);
  }
  #mechanics-page .mech-avatar-wrap {
    position: relative;
    width: 56px;
    height: 56px;
    flex-shrink: 0;
  }
  #mechanics-page .mech-avatar-badge {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    font-weight: 800;
    color: #FFFFFF;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.14);
  }
  #mechanics-page .mech-verified-check {
    position: absolute;
    right: -4px;
    bottom: -4px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--color-success);
    border: 2.5px solid var(--color-card-solid);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #mechanics-page .mech-meta-row1 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    flex-wrap: wrap;
  }
  #mechanics-page .mech-open-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 9px 3px 7px;
    border-radius: 999px;
  }
  #mechanics-page .mech-open-badge.open {
    background: rgba(34, 165, 89, 0.12);
    color: var(--color-success);
  }
  #mechanics-page .mech-open-badge.closed {
    background: rgba(107, 114, 128, 0.1);
    color: var(--color-text-secondary);
  }
  #mechanics-page .mech-meta-row2 {
    font-size: 12px;
    color: var(--color-text-secondary);
    margin-top: 4px;
  }
  #mechanics-page .spec-chip-v2 {
    font-size: 10.5px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(255, 122, 26, 0.07);
    border: 1px solid rgba(255, 122, 26, 0.18);
    color: var(--color-accent);
  }
</style>

<div id="mechanics-page">

  <button id="mech-back-btn" aria-label="Back to vehicle health" style="display:flex;align-items:center;gap:4px;margin:0 0 14px -6px;padding:8px 12px 8px 6px;border-radius:999px;font-size:13px;font-weight:600;color:var(--color-text-secondary);">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Vehicle Health
  </button>

  <p id="mech-subtitle" style="font-size:12.5px;color:var(--color-text-secondary);margin-bottom:16px;"></p>

  <div id="mechanics-list" style="display:flex;flex-direction:column;gap:14px;"></div>

</div>

<script>
(function () {
  document.getElementById('mech-back-btn').addEventListener('click', () => navigateTo('faults'))
  document.getElementById('mech-subtitle').textContent = `Showing trusted pros near ${ACTIVE_VEHICLE.location}`

  const AVATAR_COLORS = ['#FF7A1A', '#22A559', '#3B82F6', '#B8860B', '#E5533C']

  function parseDistanceKm(str) {
    const match = str.match(/[\d.]+/)
    return match ? parseFloat(match[0]) : 999
  }

  function sortedMechanics() {
    return MECHANICS.slice().sort((a, b) => {
      if (a.priority !== b.priority) return a.priority ? -1 : 1
      return parseDistanceKm(a.distance) - parseDistanceKm(b.distance)
    })
  }

  function initials(name) {
    return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
  }

  function avatarColor(id) {
    return AVATAR_COLORS[id % AVATAR_COLORS.length]
  }

  function mechanicCard(m) {
    return `
      <div class="mechanic-card-v2" data-id="${m.id}" style="cursor:pointer;">
        <div class="mech-avatar-wrap">
          <div class="mech-avatar-badge" style="background:linear-gradient(145deg, ${avatarColor(m.id)}, ${avatarColor(m.id)}CC);">${initials(m.name)}</div>
          ${m.verified ? `
            <div class="mech-verified-check">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
          ` : ''}
        </div>

        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            <p style="font-size:14.5px;font-weight:700;color:var(--color-heading);">${m.garage}</p>
            ${m.priority ? '<span class="badge badge-premium">PRIORITY</span>' : ''}
          </div>

          <div class="mech-meta-row1">
            ${renderStars(m.rating)} <span style="font-size:12px;color:var(--color-text-secondary);">(${m.reviews})</span>
            <span class="mech-open-badge ${m.open ? 'open' : 'closed'}">
              <span class="status-dot ${m.open ? 'status-dot-online' : 'status-dot-offline'}"></span>${m.open ? 'Open now' : 'Closed'}
            </span>
          </div>

          <p class="mech-meta-row2">${m.name} · ${m.location} · ${m.distance}</p>

          <div class="mechanic-specialties" style="margin-top:10px;">
            ${m.specializations.map(s => `<span class="spec-chip-v2">${s}</span>`).join('')}
          </div>
        </div>
      </div>
    `
  }

  function render() {
    const list = document.getElementById('mechanics-list')
    const mechs = sortedMechanics()

    if (mechs.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M21 21L16.5 16.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          <p style="font-weight:700;font-size:15px;color:var(--color-heading);">No mechanics found nearby</p>
        </div>
      `
      return
    }

    list.innerHTML = mechs.map(mechanicCard).join('')

    list.querySelectorAll('.mechanic-card-v2').forEach(card => {
      card.addEventListener('click', () => {
        ACTIVE_MECHANIC_ID = Number(card.dataset.id)
        navigateTo('mechanic-detail')
      })
    })
  }

  render()
})()
</script>