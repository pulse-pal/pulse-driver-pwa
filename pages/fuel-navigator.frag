<div id="fuel-nav-search-state">

  <div style="display:flex;align-items:center;gap:12px;padding:14px 16px 8px;">
    <button id="fn-back-btn" aria-label="Back" style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;color:var(--color-text-secondary);flex-shrink:0;">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <p style="font-size:16px;font-weight:700;">Fuel Navigator</p>
  </div>

  <div style="padding:8px 16px 16px;">
    <div style="position:relative;padding-left:16px;">
      <div style="position:absolute;left:5px;top:20px;bottom:20px;width:1.5px;background:var(--color-border);"></div>

      <div style="display:flex;align-items:center;gap:12px;padding:10px 0;">
        <span style="width:8px;height:8px;border-radius:50%;background:var(--color-accent);flex-shrink:0;margin-left:-16px;"></span>
        <input type="text" class="input" id="fn-origin-input" style="border:none;background:var(--color-bg-card);" readonly>
      </div>
      <div style="display:flex;align-items:center;gap:12px;padding:10px 0;">
        <span style="width:8px;height:8px;border-radius:2px;background:var(--color-danger);flex-shrink:0;margin-left:-16px;"></span>
        <input type="text" class="input" id="fn-destination-input" placeholder="Choose destination">
      </div>
    </div>

    <p class="settings-group-label" style="margin-top:20px;">Suggested Destinations</p>
    <div id="fn-destination-list"></div>
  </div>

</div>

<script>
(function () {
  const origin = ACTIVE_VEHICLE
  document.getElementById('fn-origin-input').value = `${origin.location} (current location)`

  document.getElementById('fn-back-btn').addEventListener('click', () => navigateTo('map'))

  function selectDestination(dest) {
    ACTIVE_FUEL_ROUTE = {
      destinationName: dest.name,
      lat: dest.lat,
      lng: dest.lng,
      distance_km: dest.distance_km
    }
    navigateTo('map')
  }

  function renderDestinationList() {
    const list = document.getElementById('fn-destination-list')
    list.innerHTML = DESTINATIONS.map(d => `
      <div class="share-user-row" data-dest="${d.name}" style="cursor:pointer;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-text-secondary);flex-shrink:0;"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M12 7V12L15 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        <div style="flex:1;">
          <p style="font-size:13.5px;font-weight:600;">${d.name}</p>
          <p style="font-size:11.5px;color:var(--color-text-secondary);">${d.distance_km}km away</p>
        </div>
      </div>
    `).join('')

    list.querySelectorAll('[data-dest]').forEach(row => {
      row.addEventListener('click', () => {
        const dest = DESTINATIONS.find(d => d.name === row.dataset.dest)
        if (dest) selectDestination(dest)
      })
    })
  }

  document.getElementById('fn-destination-input').addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return
    const typed = e.target.value.trim().toLowerCase()
    const match = DESTINATIONS.find(d => d.name.toLowerCase() === typed)
    if (match) {
      selectDestination(match)
    } else {
      showToast('Destination not found in demo data', 'warning')
    }
  })

  renderDestinationList()
})()
</script>