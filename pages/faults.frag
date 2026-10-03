<div id="faults-page">

  <div class="card" style="text-align:center;padding:26px 16px 22px;margin-bottom:22px;">
    <div style="position:relative;width:140px;height:140px;margin:0 auto 12px;">
      <div id="health-gauge-ring" style="width:100%;height:100%;border-radius:50%;display:flex;align-items:center;justify-content:center;">
        <div style="width:76%;height:76%;border-radius:50%;background:var(--color-card-solid);box-shadow:inset 0 2px 8px rgba(var(--shadow-rgb),0.04), 0 3px 10px rgba(var(--shadow-rgb),0.06);display:flex;flex-direction:column;align-items:center;justify-content:center;">
          <p id="health-score-value" style="font-size:30px;font-weight:800;color:var(--color-heading);text-shadow:0 1px 2px rgba(var(--shadow-rgb),0.08);">--</p>
          <p style="font-size:11px;color:var(--color-text-secondary);margin-top:1px;">out of 100</p>
        </div>
      </div>
    </div>
    <p id="health-label" style="font-size:16px;font-weight:700;"></p>
  </div>

  <div id="faults-active-section"></div>

  <div style="margin:24px 0 20px;">
    <button id="faults-history-toggle" style="display:flex;align-items:center;justify-content:space-between;width:100%;padding:10px 0;font-size:13px;font-weight:600;color:var(--color-text-secondary);border-bottom:1px solid var(--color-border);">
      <span>Past Faults</span>
      <svg id="faults-history-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="transition:transform 200ms ease;"><path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div id="faults-history-list" style="display:none;"></div>
  </div>

  <div style="margin-bottom:24px;">
    <p style="font-size:13px;font-weight:700;color:var(--color-heading);margin-bottom:10px;">Service Reminders</p>
    <div id="faults-service-list"></div>
  </div>

  <button class="btn btn-primary" id="faults-find-mechanic-btn" style="border-radius:999px;">FIND A MECHANIC →</button>

</div>

<script>
(function () {
  function renderHealthGauge() {
    const faultCount = ACTIVE_VEHICLE.fault_codes.length
    const score = faultCount === 0 ? 100 : Math.max(40, 100 - faultCount * 28)
    const fillDeg = score * 3.6

    let gradient, label, labelColor

    if (score === 100) {
      gradient = `conic-gradient(from 0deg, #B9F6CA 0deg, var(--color-success) 360deg)`
      label = '✅ All Good'
      labelColor = 'var(--color-success)'
    } else {
      const midDeg = fillDeg * 0.55
      gradient = `conic-gradient(from 0deg, #FFD166 0deg, #FF7A1A ${midDeg}deg, #E53935 ${fillDeg}deg, rgba(var(--shadow-rgb), 0.08) ${fillDeg}deg 360deg)`
      label = score >= 60 ? 'Needs Attention' : 'Urgent Attention Needed'
      labelColor = score >= 60 ? 'var(--color-warning)' : 'var(--color-danger)'
    }

    const ring = document.getElementById('health-gauge-ring')
    ring.style.background = gradient
    ring.style.boxShadow = `0 10px 28px ${score === 100 ? 'rgba(34,165,89,0.14)' : score >= 60 ? 'rgba(255,107,0,0.14)' : 'rgba(229,57,53,0.14)'}`

    document.getElementById('health-score-value').textContent = score
    const labelEl = document.getElementById('health-label')
    labelEl.textContent = label
    labelEl.style.color = labelColor
  }

  function renderActiveFaults() {
    const section = document.getElementById('faults-active-section')
    const codes = ACTIVE_VEHICLE.fault_codes

    if (codes.length === 0) {
      section.innerHTML = `
        <div class="card" style="text-align:center;padding:32px 16px;">
          <div style="width:56px;height:56px;border-radius:50%;background:rgba(34,165,89,0.12);color:var(--color-success);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <p style="font-weight:700;font-size:15px;color:var(--color-heading);">✅ All Systems Normal</p>
          <p style="font-size:12.5px;color:var(--color-text-secondary);margin-top:4px;">No active fault codes detected</p>
          <p style="font-size:11.5px;color:var(--color-text-secondary);margin-top:8px;">Last checked ${ACTIVE_VEHICLE.last_updated}</p>
        </div>
      `
      return
    }

    let html = `<p style="font-size:13px;font-weight:700;color:var(--color-heading);margin-bottom:10px;">Active Faults (${codes.length})</p>`

    codes.forEach(code => {
      const fault = FAULT_CODES.find(f => f.code === code)
      if (!fault) return

      const isCritical = fault.severity === 'critical'
      const severityColors = {
        critical: 'var(--color-danger)',
        high: 'var(--color-danger)',
        medium: 'var(--color-warning)',
        low: 'var(--color-success)'
      }
      const borderColor = severityColors[fault.severity] || 'var(--color-border)'

      html += `
        <div class="card ${isCritical ? 'pulsing-fault-card' : ''}" style="border-left:4px solid ${borderColor};">
          ${isCritical ? `<div style="background:var(--color-danger);color:#fff;font-size:12px;font-weight:800;text-align:center;padding:7px;border-radius:8px;margin-bottom:12px;letter-spacing:0.4px;">🔴 CRITICAL — STOP DRIVING</div>` : ''}
          <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:10px;">
            <span class="badge ${fault.severity === 'low' ? 'badge-accent' : fault.severity === 'medium' ? 'badge-warning' : 'badge-danger'}" style="font-size:11px;">${fault.severity.toUpperCase()}</span>
            <span style="font-size:13px;font-weight:700;color:var(--color-heading);">${fault.code}</span>
            <span style="font-size:11.5px;color:var(--color-text-secondary);">${fault.system}</span>
          </div>
          <p style="font-size:17px;font-weight:700;margin-bottom:6px;color:var(--color-heading);">${fault.title}</p>
          <p style="font-size:12.5px;color:var(--color-text-secondary);line-height:1.55;margin-bottom:16px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${fault.description_simple}</p>
          <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;">
              <span style="font-size:10.5px;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.4px;">Detected</span>
              <span style="font-size:13px;font-weight:700;color:var(--color-heading);">${fault.detected_at}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:baseline;">
              <span style="font-size:10.5px;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.4px;">Status</span>
              <span style="font-size:13px;font-weight:700;color:${fault.can_drive ? 'var(--color-warning)' : 'var(--color-danger)'};">${fault.can_drive ? '⚠️ Drive carefully' : '🛑 Do not drive'}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:baseline;">
              <span style="font-size:10.5px;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.4px;">Est. Cost</span>
              <span style="font-size:13px;font-weight:700;color:var(--color-heading);">${formatKESRange(fault.cost_min, fault.cost_max)}</span>
            </div>
          </div>
          <button class="btn btn-outline btn-sm fault-view-details-btn" data-code="${fault.code}" style="width:auto;border-radius:999px;">VIEW DETAILS</button>
        </div>
      `
    })

    section.innerHTML = html

    section.querySelectorAll('.fault-view-details-btn').forEach(btn => {
      btn.addEventListener('click', () => navigateTo('fault-detail'))
    })
  }

  function renderHistory() {
    const list = document.getElementById('faults-history-list')
    if (FAULT_HISTORY.length === 0) {
      list.innerHTML = `<p style="font-size:12.5px;color:var(--color-text-secondary);padding:12px 0;">No past faults recorded</p>`
      return
    }
    list.innerHTML = FAULT_HISTORY.map((h, i) => `
      <div style="padding:${i === 0 ? '14px' : '12px'} 0 12px;opacity:0.72;${i < FAULT_HISTORY.length - 1 ? 'border-bottom:1px solid var(--color-border);' : ''}">
        <p style="font-size:13px;font-weight:600;color:var(--color-text-primary);">${h.title}</p>
        <p style="font-size:11.5px;color:var(--color-text-secondary);margin-top:3px;">${h.code} · Detected ${h.detected_at} · Cleared ${h.cleared_at}</p>
      </div>
    `).join('')
  }

  document.getElementById('faults-history-toggle').addEventListener('click', () => {
    const list = document.getElementById('faults-history-list')
    const chevron = document.getElementById('faults-history-chevron')
    const expanded = list.style.display === 'block'
    list.style.display = expanded ? 'none' : 'block'
    chevron.style.transform = expanded ? 'rotate(0deg)' : 'rotate(180deg)'
  })

  // Looser, more organic layout — grouped by spacing rather than
  // each reminder boxed in its own bordered card
  function renderServiceReminders() {
    const container = document.getElementById('faults-service-list')
    container.innerHTML = SERVICE_REMINDERS.map((r, i) => `
      <div style="display:flex;gap:12px;padding:${i === 0 ? '0' : '16px'} 0 0;">
        <span style="font-size:19px;margin-top:1px;">🔧</span>
        <div style="flex:1;">
          <div style="display:flex;justify-content:space-between;align-items:baseline;">
            <p style="font-weight:700;font-size:13.5px;color:var(--color-heading);">${r.title}</p>
            <p style="font-size:12.5px;font-weight:700;color:var(--color-accent);">${r.due_in}</p>
          </div>
          <p style="font-size:12px;color:var(--color-text-secondary);margin-top:3px;">${r.description}</p>
          <p style="font-size:11.5px;color:var(--color-text-secondary);margin-top:3px;">Est. ${r.estimated_cost}</p>
        </div>
      </div>
    `).join('')
  }

  document.getElementById('faults-find-mechanic-btn').addEventListener('click', () => {
    navigateTo('mechanics')
  })

  renderHealthGauge()
  renderActiveFaults()
  renderHistory()
  renderServiceReminders()
})()
</script>