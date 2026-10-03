<style>
  #trip-coaching-page .tc-clean-card {
    background: linear-gradient(160deg, #F0FBF3 0%, var(--color-card-solid) 60%);
  }
  :root[data-theme="dark"] #trip-coaching-page .tc-clean-card {
    background: linear-gradient(160deg, #13261A 0%, var(--color-card-solid) 60%);
  }
</style>

<div id="trip-coaching-page">

  <button id="tc-back-btn" aria-label="Back to trip detail" style="display:flex;align-items:center;gap:4px;margin:0 0 14px -6px;padding:8px 12px 8px 6px;border-radius:999px;font-size:13px;font-weight:600;color:var(--color-text-secondary);">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Trip Detail
  </button>

  <div id="tc-body"></div>

</div>

<script>
(function () {
  const body = document.getElementById('tc-body')
  const trip = TRIPS.find(t => t.id === ACTIVE_TRIP_ID)

  document.getElementById('tc-back-btn').addEventListener('click', () => navigateTo('trip-detail'))

  const TIPS = {
    harsh_braking: {
      title: 'Ease off the brake earlier',
      body: 'Try to spot slow traffic and traffic lights further ahead. Coasting off the throttle early gives you more time to brake gently instead of hard, which is easier on your brakes and smoother for fuel use.'
    },
    harsh_accel: {
      title: 'Build up speed gradually',
      body: 'Quick throttle jumps from a stop burn noticeably more fuel. Accelerating steadily over 3 to 4 seconds instead of 1 uses less fuel and puts less strain on the engine and transmission.'
    },
    speeding: {
      title: 'Watch your speed on open stretches',
      body: 'Speeding incidents usually happen on clear roads where it is easy to drift above the limit. A quick glance at your speedometer every so often keeps you within limits and out of camera zones.'
    }
  }

  function tipCard(key) {
    const t = TIPS[key]
    return `
      <div class="card" style="padding:16px 18px;">
        <p style="font-size:14px;font-weight:700;color:var(--color-heading);">${t.title}</p>
        <p style="font-size:12.5px;color:var(--color-text-secondary);line-height:1.55;margin-top:6px;">${t.body}</p>
      </div>
    `
  }

  function renderEmpty() {
    body.innerHTML = `
      <div class="empty-state">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.5"/></svg>
        <p style="font-weight:700;font-size:15px;color:var(--color-heading);">Trip not found</p>
        <p style="font-size:12.5px;margin-top:4px;">Pick a trip from your history.</p>
      </div>
    `
  }

  function renderLocked() {
    body.innerHTML = `
      <div class="card" style="text-align:center;padding:32px 20px;">
        <div class="upgrade-lock-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        </div>
        <p style="font-size:16px;font-weight:700;color:var(--color-heading);">Trip Coaching</p>
        <p style="font-size:12.5px;color:var(--color-text-secondary);margin:6px 0 20px;line-height:1.5;">Personalized driving tips are part of Premium.</p>
        <button class="btn btn-primary" id="tc-upgrade-btn" style="border-radius:999px;">UPGRADE TO PREMIUM</button>
      </div>
    `
    document.getElementById('tc-upgrade-btn').addEventListener('click', () => checkPremium('trip_coaching'))
  }

  function renderThisTrip() {
    const issues = []
    if (trip.harsh_braking > 0) issues.push('harsh_braking')
    if (trip.harsh_accel > 0) issues.push('harsh_accel')
    if (trip.speeding > 0) issues.push('speeding')

    if (issues.length === 0) {
      return `
        <div class="card tc-clean-card" style="padding:18px;">
          <p style="font-size:14px;font-weight:700;color:var(--color-success);">Clean trip, well driven</p>
          <p style="font-size:12.5px;color:var(--color-text-secondary);line-height:1.55;margin-top:6px;">No harsh braking, harsh acceleration or speeding on this trip. Keep it up.</p>
        </div>
      `
    }

    return `<div style="display:flex;flex-direction:column;gap:10px;">${issues.map(tipCard).join('')}</div>`
  }

  function renderPatterns() {
    const totals = TRIPS.reduce((acc, t) => {
      acc.braking += t.harsh_braking
      acc.accel += t.harsh_accel
      acc.speeding += t.speeding
      acc.score += t.score
      return acc
    }, { braking: 0, accel: 0, speeding: 0, score: 0 })

    const avgScore = Math.round(totals.score / TRIPS.length)

    const rows = [
      { label: 'Harsh braking', value: totals.braking, key: 'braking' },
      { label: 'Harsh acceleration', value: totals.accel, key: 'accel' },
      { label: 'Speeding incidents', value: totals.speeding, key: 'speeding' }
    ]

    const top = rows.reduce((a, b) => (b.value > a.value ? b : a), rows[0])
    const tipKeyMap = { braking: 'harsh_braking', accel: 'harsh_accel', speeding: 'speeding' }

    return `
      <div class="card" style="padding:18px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:14px;">
          <p style="font-size:13px;font-weight:700;color:var(--color-heading);">Across your last ${TRIPS.length} trips</p>
          <p style="font-size:13px;font-weight:700;color:var(--color-accent);">${avgScore}/100 avg</p>
        </div>
        ${rows.map(r => `
          <div style="display:flex;justify-content:space-between;align-items:baseline;padding:9px 0;">
            <span style="font-size:13px;color:var(--color-text-secondary);">${r.label}</span>
            <span style="font-size:13.5px;font-weight:700;color:${r.value === 0 ? 'var(--color-success)' : 'var(--color-heading)'};">${r.value}</span>
          </div>
        `).join('')}
      </div>
      ${top.value > 0 ? tipCard(tipKeyMap[top.key]) : ''}
    `
  }

  function renderPage() {
    body.innerHTML = `
      <div style="margin-bottom:20px;">
        <p style="font-size:11px;font-weight:600;color:var(--color-text-secondary);letter-spacing:0.3px;">${trip.date}</p>
        <p style="font-size:17px;font-weight:800;color:var(--color-heading);margin-top:4px;">${trip.start} to ${trip.end}</p>
      </div>

      <p style="font-size:12px;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.4px;margin-bottom:10px;">From this trip</p>
      ${renderThisTrip()}

      <p style="font-size:12px;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.4px;margin:24px 0 10px;">Your driving patterns</p>
      ${renderPatterns()}
    `
  }

  if (!trip) {
    renderEmpty()
  } else if (DRIVER.plan !== 'premium') {
    renderLocked()
  } else {
    renderPage()
  }
})()
</script>