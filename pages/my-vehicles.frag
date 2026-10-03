<div id="my-vehicles-page">

  <button id="mv-back-btn" aria-label="Back" style="display:flex;align-items:center;gap:4px;margin:0 0 14px -6px;padding:8px 12px 8px 6px;border-radius:999px;font-size:13px;font-weight:600;color:var(--color-text-secondary);">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Settings
  </button>

  <p style="font-size:19px;font-weight:800;color:var(--color-heading);margin-bottom:4px;">My Vehicles</p>
  <p style="font-size:12.5px;color:var(--color-text-secondary);margin-bottom:20px;">Tap a vehicle to switch to it</p>

  <div id="mv-list" style="display:flex;flex-direction:column;gap:12px;"></div>

  <button class="btn btn-outline" id="mv-add-btn" style="border-radius:999px;margin-top:18px;">+ ADD VEHICLE</button>

</div>

<script>
(function () {
  document.getElementById('mv-back-btn').addEventListener('click', () => navigateTo('settings'))
  document.getElementById('mv-add-btn').addEventListener('click', () => navigateTo('add-vehicle'))

  function vehicleCard(v) {
    const isSelected = v.id === ACTIVE_VEHICLE.id

    return `
      <div class="card card-tappable mv-vehicle-card ${isSelected ? 'card-active' : ''}" data-id="${v.id}" style="cursor:pointer;display:flex;gap:14px;align-items:center;">
        <div style="width:50px;height:50px;border-radius:14px;background:var(--color-bg-card);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:${isSelected ? 'var(--color-accent)' : 'var(--color-text-secondary)'};"><path d="M3 13l1.5-5A2 2 0 016.4 6.5h11.2a2 2 0 011.9 1.5L21 13M5 13h14v5a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H8v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-5z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7.5" cy="15.5" r="1.2" fill="currentColor"/><circle cx="16.5" cy="15.5" r="1.2" fill="currentColor"/></svg>
        </div>

        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:6px;">
            <p style="font-size:14.5px;font-weight:700;color:var(--color-heading);">${v.make} ${v.model}</p>
            ${isSelected ? `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-accent);flex-shrink:0;"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            ` : ''}
          </div>
          <p style="font-size:12px;color:var(--color-text-secondary);margin-top:2px;">${v.plate} · ${v.year} · ${v.device_code}</p>
          <div style="display:flex;align-items:center;gap:6px;margin-top:6px;">
            <span class="status-dot ${v.active ? 'status-dot-online' : 'status-dot-offline'}"></span>
            <span style="font-size:11.5px;color:var(--color-text-secondary);">${v.active ? 'Engine on' : 'Engine off'} · ${v.location}</span>
          </div>
        </div>
      </div>
    `
  }

  function render() {
    document.getElementById('mv-list').innerHTML = VEHICLES.map(vehicleCard).join('')

    document.querySelectorAll('.mv-vehicle-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = Number(card.dataset.id)
        if (id === ACTIVE_VEHICLE.id) return

        const chosen = VEHICLES.find(v => v.id === id)
        ACTIVE_VEHICLE = chosen
        showToast(`Switched to ${chosen.make} ${chosen.model}`, 'success')
        render()
      })
    })
  }

  render()
})()
</script>