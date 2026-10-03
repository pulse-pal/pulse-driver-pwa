<style>
  #fault-detail-page .fd-card-warning {
    background: linear-gradient(160deg, #FFF6EE 0%, var(--color-card-solid) 60%);
  }
  #fault-detail-page .fd-card-danger {
    background: linear-gradient(160deg, #FFF1F0 0%, var(--color-card-solid) 60%);
  }
  :root[data-theme="dark"] #fault-detail-page .fd-card-warning {
    background: linear-gradient(160deg, #2B2015 0%, var(--color-card-solid) 60%);
  }
  :root[data-theme="dark"] #fault-detail-page .fd-card-danger {
    background: linear-gradient(160deg, #2B1715 0%, var(--color-card-solid) 60%);
  }
</style>

<div id="fault-detail-page">

  <button class="onboarding-back" id="fd-back-btn" aria-label="Back" style="margin-bottom:8px;">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>

  <div id="fd-severity-banner" style="padding:12px 16px;border-radius:14px;font-weight:800;font-size:13px;text-align:center;letter-spacing:0.3px;margin-bottom:16px;"></div>

  <div id="fd-drive-card" class="card" style="text-align:center;padding:22px 16px;margin-bottom:20px;"></div>

  <div style="margin-bottom:20px;">
    <p style="font-size:14px;font-weight:700;color:var(--color-heading);margin-bottom:8px;">What This Means</p>
    <p id="fd-description" style="font-size:13.5px;color:var(--color-text-secondary);line-height:1.6;"></p>
  </div>

  <div style="margin-bottom:20px;">
    <p style="font-size:14px;font-weight:700;color:var(--color-heading);margin-bottom:8px;">You Might Notice</p>
    <ul id="fd-symptoms-list" style="display:flex;flex-direction:column;gap:6px;padding-left:18px;font-size:13px;color:var(--color-text-secondary);"></ul>
  </div>

  <div class="card" style="margin-bottom:20px;">
    <p style="font-size:11px;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.4px;margin-bottom:6px;">Most Likely Cause</p>
    <p id="fd-cause" style="font-size:14px;font-weight:700;color:var(--color-heading);margin-bottom:4px;"></p>
    <p id="fd-cause-note" style="font-size:12.5px;color:var(--color-text-secondary);"></p>
  </div>

  <div class="card" style="margin-bottom:20px;">
    <p style="font-size:11px;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.4px;margin-bottom:6px;">Estimated Repair Cost</p>
    <p id="fd-cost" style="font-size:22px;font-weight:800;color:var(--color-heading);"></p>
    <p style="font-size:12px;color:var(--color-text-secondary);margin-top:4px;">Depending on which part needs replacing</p>
  </div>

  <div style="margin-bottom:22px;">
    <p style="font-size:14px;font-weight:700;color:var(--color-heading);margin-bottom:10px;">What To Do</p>
    <div id="fd-steps"></div>
  </div>

  <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:22px;">
    <button class="btn btn-primary" id="fd-book-mechanic-btn" style="border-radius:999px;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.7 6.3a4 4 0 0 0-5.66 5.66L4 17l3 3 5.04-5.04a4 4 0 0 0 5.66-5.66l-2.4 2.4-2-2 2.4-2.4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
      BOOK A MECHANIC
    </button>
    <button class="btn btn-outline" id="fd-ask-ai-btn" style="border-radius:999px;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="7" width="16" height="12" rx="3" stroke="currentColor" stroke-width="1.6"/><circle cx="9" cy="13" r="1.2" fill="currentColor"/><circle cx="15" cy="13" r="1.2" fill="currentColor"/><path d="M12 7V4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="3" r="1" fill="currentColor"/></svg>
      ASK PULSE AI ABOUT THIS
    </button>
    <a id="fd-call-mechanic-btn" class="btn btn-secondary" style="border-radius:999px;text-decoration:none;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 3H9L10.5 7L8.5 8.5C9.25 10.5 10.5 11.75 12.5 12.5L14 10.5L18 12V14.5C18 16.9853 15.9853 19 13.5 19C7.7 19 3 14.3 3 8.5C3 6.01472 4.01472 4 6.5 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
      <span id="fd-call-btn-text">CALL NEAREST MECHANIC</span>
    </a>
  </div>

  <div>
    <button id="fd-tech-toggle" style="display:flex;align-items:center;justify-content:space-between;width:100%;padding:10px 0;font-size:13px;font-weight:600;color:var(--color-text-secondary);border-bottom:1px solid var(--color-border);">
      <span>Technical info for mechanic</span>
      <svg id="fd-tech-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="transition:transform 200ms ease;"><path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div id="fd-tech-details" style="display:none;padding-top:14px;"></div>
  </div>

</div>

<script>
(function () {
  const fault = FAULT_CODES.find(f => f.code === ACTIVE_VEHICLE.fault_codes[0])

  if (!fault) {
    document.getElementById('fault-detail-page').innerHTML = `<div class="empty-state"><p>No fault to show.</p></div>`
    return
  }

  const titleEl = document.getElementById('top-bar-title')
  if (titleEl) titleEl.textContent = fault.code

  document.getElementById('fd-back-btn').addEventListener('click', () => navigateTo('faults'))

  const severityMeta = {
    critical: { emoji: '🔴', label: 'CRITICAL SEVERITY', bg: 'rgba(229,57,53,0.12)', color: 'var(--color-danger)' },
    high: { emoji: '🟠', label: 'HIGH SEVERITY', bg: 'rgba(255,107,0,0.12)', color: 'var(--color-warning)' },
    medium: { emoji: '🟡', label: 'MEDIUM SEVERITY', bg: 'rgba(255,107,0,0.10)', color: 'var(--color-warning)' },
    low: { emoji: '🟢', label: 'LOW SEVERITY', bg: 'rgba(34,165,89,0.12)', color: 'var(--color-success)' }
  }
  const sev = severityMeta[fault.severity] || severityMeta.medium

  const banner = document.getElementById('fd-severity-banner')
  banner.style.background = sev.bg
  banner.style.color = sev.color
  banner.textContent = `${sev.emoji} ${sev.label}`

  const driveCard = document.getElementById('fd-drive-card')
  if (fault.can_drive) {
    driveCard.classList.add('fd-card-warning')
    driveCard.innerHTML = `
      <p style="font-size:16px;font-weight:700;color:var(--color-warning);">⚠️ You can drive carefully</p>
      <p style="font-size:13px;color:var(--color-text-secondary);margin-top:6px;line-height:1.5;">${fault.action}</p>
    `
  } else {
    driveCard.classList.add('pulsing-fault-card', 'fd-card-danger')
    driveCard.innerHTML = `
      <p style="font-size:17px;font-weight:800;color:var(--color-danger);">🛑 STOP DRIVING IMMEDIATELY</p>
      <p style="font-size:13px;color:var(--color-text-secondary);margin-top:6px;line-height:1.5;">${fault.action}</p>
    `
  }

  document.getElementById('fd-description').textContent = fault.description_simple

  const symptomsList = document.getElementById('fd-symptoms-list')
  symptomsList.innerHTML = fault.symptoms.split(', ').map(s => `<li>${s}</li>`).join('')

  document.getElementById('fd-cause').textContent = fault.most_likely_cause
  document.getElementById('fd-cause-note').textContent = fault.cause_note

  document.getElementById('fd-cost').textContent = formatKESRange(fault.cost_min, fault.cost_max)

  const actionSentences = fault.action.split('. ').map(s => s.replace(/\.$/, ''))
  const steps = [
    fault.can_drive ? 'Continue driving carefully' : 'Stop driving — do not continue',
    actionSentences[1] || 'Avoid heavy acceleration',
    actionSentences[0] || 'Book a mechanic soon',
    `Tell mechanic: "${fault.code} — ${fault.title}"`
  ]

  document.getElementById('fd-steps').innerHTML = steps.map((step, i) => `
    <div style="display:flex;gap:10px;padding:7px 0;">
      <span style="width:22px;height:22px;border-radius:50%;background:var(--color-accent);color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${i + 1}</span>
      <span style="font-size:13px;color:var(--color-heading);padding-top:2px;">${step}</span>
    </div>
  `).join('')

  document.getElementById('fd-book-mechanic-btn').addEventListener('click', () => navigateTo('mechanics'))

  document.getElementById('fd-ask-ai-btn').addEventListener('click', () => {
    if (!checkPremium('pulse_ai_chatbot')) return
    const fab = document.getElementById('pulse-ai-fab')
    if (fab) fab.click()
    setTimeout(() => {
      const input = document.getElementById('pulse-ai-panel-input')
      const sendBtn = document.getElementById('pulse-ai-panel-send')
      if (input && sendBtn) {
        input.value = `Tell me more about ${fault.code} — ${fault.title}`
        sendBtn.click()
      }
    }, 100)
  })

  const nearestMechanic = MECHANICS[0]
  const callBtn = document.getElementById('fd-call-mechanic-btn')
  callBtn.href = `tel:${nearestMechanic.phone}`
  document.getElementById('fd-call-btn-text').textContent = `CALL ${nearestMechanic.garage.toUpperCase()}`

  document.getElementById('fd-tech-toggle').addEventListener('click', () => {
    const details = document.getElementById('fd-tech-details')
    const chevron = document.getElementById('fd-tech-chevron')
    const expanded = details.style.display === 'block'
    details.style.display = expanded ? 'none' : 'block'
    chevron.style.transform = expanded ? 'rotate(0deg)' : 'rotate(180deg)'
  })

  const ff = fault.freeze_frame
  document.getElementById('fd-tech-details').innerHTML = `
    <p style="font-size:12.5px;color:var(--color-text-secondary);line-height:1.6;margin-bottom:14px;">${fault.description_technical}</p>
    <p style="font-size:11px;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.4px;margin-bottom:8px;">Freeze Frame Data — ${fault.code}</p>
    <div class="fault-info-row"><span>Speed</span><span>${ff.speed} km/h</span></div>
    <div class="fault-info-row"><span>RPM</span><span>${ff.rpm.toLocaleString()}</span></div>
    <div class="fault-info-row"><span>Engine Temp</span><span>${ff.engine_temp}°C</span></div>
    <div class="fault-info-row"><span>Fuel Level</span><span>${ff.fuel_level}%</span></div>
    <div class="fault-info-row"><span>Engine Load</span><span>${ff.engine_load}%</span></div>
  `
})()
</script>