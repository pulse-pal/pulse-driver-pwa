<style>
  #trips-page .trips-tabs {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    margin-bottom: 18px;
    padding-bottom: 2px;
  }
  #trips-page .trips-tab {
    flex-shrink: 0;
    padding: 8px 16px;
    border-radius: 999px;
    font-size: 12.5px;
    font-weight: 600;
    color: var(--color-text-secondary);
    background: transparent;
    transition: background var(--transition-fast), color var(--transition-fast);
  }
  #trips-page .trips-tab.active {
    background: linear-gradient(135deg, #FF9248 0%, var(--color-accent) 100%);
    color: #FFFFFF;
    box-shadow: 0 4px 12px rgba(255, 122, 26, 0.25);
  }
  #trips-page .trips-score {
    min-width: 46px;
    text-align: center;
    padding: 6px 10px;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 800;
    line-height: 1.1;
  }
  #trips-page .trips-score small {
    display: block;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.4px;
    opacity: 0.75;
    margin-top: 1px;
  }
  #trips-page .trips-stat-card {
    background: linear-gradient(150deg, #FFF3E6 0%, var(--color-card-solid) 62%);
  }
  :root[data-theme="dark"] #trips-page .trips-stat-card {
    background: linear-gradient(150deg, #2B2015 0%, var(--color-card-solid) 62%);
  }
</style>

<div id="trips-page">

  <div class="card trips-stat-card" style="padding:22px 20px 20px;margin-bottom:22px;">
    <p style="font-size:11px;font-weight:600;letter-spacing:0.5px;color:var(--color-text-secondary);text-transform:uppercase;">This Week</p>
    <div style="display:flex;align-items:baseline;gap:6px;margin-top:6px;">
      <span id="trips-stat-distance" style="font-size:36px;font-weight:800;color:var(--color-heading);line-height:1;">--</span>
      <span style="font-size:13px;font-weight:600;color:var(--color-text-secondary);">km driven</span>
    </div>
    <div style="display:flex;gap:26px;margin-top:18px;">
      <div>
        <p id="trips-stat-count" style="font-size:16px;font-weight:700;color:var(--color-heading);">--</p>
        <p style="font-size:11px;color:var(--color-text-secondary);margin-top:2px;">trips</p>
      </div>
      <div id="trips-stat-score-wrap">
        <p id="trips-stat-score" style="font-size:16px;font-weight:700;color:var(--color-heading);">--</p>
        <p style="font-size:11px;color:var(--color-text-secondary);margin-top:2px;">avg score</p>
      </div>
      <div>
        <p id="trips-stat-fuel" style="font-size:16px;font-weight:700;color:var(--color-heading);">--</p>
        <p style="font-size:11px;color:var(--color-text-secondary);margin-top:2px;">fuel used</p>
      </div>
    </div>
  </div>

  <div class="trips-tabs" id="trips-tabs">
    <button class="trips-tab active" data-filter="today">Today</button>
    <button class="trips-tab" data-filter="week">This Week</button>
    <button class="trips-tab" data-filter="month">This Month</button>
    <button class="trips-tab" data-filter="all">All</button>
  </div>

  <div id="trips-list"></div>

</div>

<script>
(function () {
  const isPremium = DRIVER.plan === 'premium'

  function scoreStyle(score) {
    if (score >= 80) return { bg: 'rgba(34,165,89,0.12)', color: 'var(--color-success)' }
    if (score >= 65) return { bg: 'rgba(255,107,0,0.12)', color: 'var(--color-warning)' }
    return { bg: 'rgba(229,57,53,0.12)', color: 'var(--color-danger)' }
  }

  function renderStats() {
    const totalKm = TRIPS.reduce((s, t) => s + t.distance, 0)
    const totalFuel = TRIPS.reduce((s, t) => s + t.fuel_used, 0)
    const avgScore = TRIPS.length
      ? Math.round(TRIPS.reduce((s, t) => s + t.score, 0) / TRIPS.length)
      : 0

    document.getElementById('trips-stat-distance').textContent = totalKm.toFixed(1)
    document.getElementById('trips-stat-count').textContent = TRIPS.length
    document.getElementById('trips-stat-fuel').textContent = totalFuel.toFixed(1) + ' L'

    const scoreWrap = document.getElementById('trips-stat-score-wrap')
    if (isPremium) {
      document.getElementById('trips-stat-score').textContent = avgScore + '/100'
    } else {
      scoreWrap.style.display = 'none'
    }
  }

  function filterTrips(filter) {
    if (filter === 'today') return TRIPS.filter(t => t.date === 'Today')
    return TRIPS.slice()
  }

  function tripCard(t) {
    const s = scoreStyle(t.score)
    const harsh = t.harsh_braking + t.harsh_accel

    return `
      <div class="card" style="padding:18px 18px 16px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
          <div style="flex:1;min-width:0;">
            <p style="font-size:11px;font-weight:600;color:var(--color-text-secondary);letter-spacing:0.3px;">${t.date}</p>
            <div style="display:flex;align-items:center;gap:8px;margin-top:6px;flex-wrap:wrap;">
              <span style="font-size:15px;font-weight:700;color:var(--color-heading);">${t.start}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-accent);flex-shrink:0;"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span style="font-size:15px;font-weight:700;color:var(--color-heading);">${t.end}</span>
            </div>
          </div>
          ${isPremium ? `
            <div class="trips-score" style="background:${s.bg};color:${s.color};">
              ${t.score}<small>SCORE</small>
            </div>` : ''}
        </div>

        <div style="display:flex;align-items:baseline;gap:20px;margin-top:16px;">
          <div>
            <span style="font-size:22px;font-weight:800;color:var(--color-heading);">${t.distance}</span>
            <span style="font-size:12px;font-weight:600;color:var(--color-text-secondary);margin-left:2px;">km</span>
          </div>
          <div>
            <span style="font-size:14px;font-weight:700;color:var(--color-heading);">${t.duration}</span>
          </div>
        </div>

        <div style="display:flex;gap:22px;margin-top:12px;">
          <div>
            <p style="font-size:10.5px;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.4px;">Avg</p>
            <p style="font-size:13px;font-weight:700;color:var(--color-heading);margin-top:2px;">${t.avg_speed} km/h</p>
          </div>
          <div>
            <p style="font-size:10.5px;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.4px;">Max</p>
            <p style="font-size:13px;font-weight:700;color:var(--color-heading);margin-top:2px;">${t.max_speed} km/h</p>
          </div>
          <div>
            <p style="font-size:10.5px;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.4px;">Fuel</p>
            <p style="font-size:13px;font-weight:700;color:var(--color-heading);margin-top:2px;">${t.fuel_used} L</p>
          </div>
        </div>

        ${isPremium ? `
          <p style="font-size:12px;margin-top:14px;color:${harsh + t.speeding === 0 ? 'var(--color-success)' : 'var(--color-text-secondary)'};">
            ${harsh + t.speeding === 0
              ? 'Clean trip, no harsh events'
              : `${harsh} harsh event${harsh === 1 ? '' : 's'} · ${t.speeding} speeding incident${t.speeding === 1 ? '' : 's'}`}
          </p>` : ''}

        <button class="btn btn-outline btn-sm trip-view-btn" data-id="${t.id}" style="width:auto;border-radius:999px;margin-top:16px;">VIEW DETAILS</button>
      </div>
    `
  }

  function renderList(filter) {
    const list = document.getElementById('trips-list')
    const trips = filterTrips(filter)

    if (trips.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.5"/></svg>
          <p style="font-weight:700;font-size:15px;color:var(--color-heading);">No trips yet</p>
          <p style="font-size:12.5px;margin-top:4px;">Your trips will appear here after you drive.</p>
        </div>
      `
      return
    }

    list.innerHTML = trips.map(tripCard).join('')

    list.querySelectorAll('.trip-view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        ACTIVE_TRIP_ID = Number(btn.dataset.id)
        navigateTo('trip-detail')
      })
    })
  }

  document.querySelectorAll('#trips-tabs .trips-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#trips-tabs .trips-tab').forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      renderList(tab.dataset.filter)
    })
  })

  renderStats()
  renderList('today')
})()
</script>