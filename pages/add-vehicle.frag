<div class="onboarding-page" style="padding-top:8px;">
  <button class="onboarding-back" id="av-back-btn" aria-label="Back">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>

  <div class="onboarding-body">

    <div id="av-step-default">
      <div class="onboarding-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 3V7M15 3V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M6 7H18V12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12V7Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M12 18V21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M8 21H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </div>
      <h1 class="onboarding-heading">Add a Vehicle</h1>
      <p class="onboarding-subtext">Enter the code printed on the new PulsePal device label</p>
      <div class="field">
        <input type="text" id="av-code-input" class="input input-large" placeholder="e.g. PULSE-0099" maxlength="20">
      </div>
    </div>

    <div id="av-step-success" class="hidden">
      <div class="result-state">
        <div class="result-icon-success">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2 style="font-size:19px;font-weight:700;color:var(--color-heading);">Device Found!</h2>
      </div>
      <div class="card">
        <div class="fault-info-row"><span>Device</span><span id="av-found-code" style="font-weight:700;color:var(--color-text-primary);"></span></div>
        <div class="fault-info-row"><span>Status</span><span><span class="status-dot status-dot-online" style="display:inline-block;margin-right:5px;"></span>Online</span></div>
      </div>
      <p class="settings-group-label">Vehicle Auto-Detected</p>
      <div class="card">
        <p id="av-found-name" style="font-weight:700;font-size:15px;color:var(--color-heading);"></p>
        <p id="av-found-plate" style="font-size:13px;color:var(--color-text-secondary);margin-top:2px;"></p>
      </div>
    </div>

    <div id="av-step-notfound" class="hidden">
      <div class="result-state">
        <div class="result-icon-error">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
          </svg>
        </div>
        <h2 style="font-size:19px;font-weight:700;color:var(--color-heading);">Device not found</h2>
        <p style="font-size:13px;color:var(--color-text-secondary);">Check the code and try again</p>
        <p style="font-size:12.5px;color:var(--color-text-secondary);margin-top:6px;">Make sure device is plugged into the car's OBD port and ignition is on</p>
      </div>
    </div>

  </div>

  <div class="onboarding-footer">
    <button class="btn btn-primary" id="av-action-btn">
      <span class="btn-spinner"></span>
      <span id="av-action-btn-text">FIND MY DEVICE</span>
    </button>
  </div>
</div>

<script>
(function () {
  let step = 'default'
  let foundDevice = null

  const actionBtn = document.getElementById('av-action-btn')
  const actionBtnText = document.getElementById('av-action-btn-text')
  const backBtn = document.getElementById('av-back-btn')

  backBtn.addEventListener('click', () => navigateTo('my-vehicles'))

  actionBtn.addEventListener('click', () => {
    if (step === 'default') {
      searchDevice()
    } else if (step === 'success') {
      claimDevice()
    } else if (step === 'notfound') {
      resetForm()
    }
  })

  function searchDevice() {
    const input = document.getElementById('av-code-input')
    const code = input.value.trim().toUpperCase()

    actionBtn.classList.add('btn-loading')
    actionBtn.disabled = true
    actionBtnText.textContent = 'Searching...'

    setTimeout(() => {
      const device = AVAILABLE_DEVICES.find(d => d.device_code === code)

      actionBtn.classList.remove('btn-loading')
      actionBtn.disabled = false

      if (device) {
        foundDevice = device
        document.getElementById('av-step-default').classList.add('hidden')
        document.getElementById('av-step-success').classList.remove('hidden')
        document.getElementById('av-found-code').textContent = device.device_code
        document.getElementById('av-found-name').textContent = `${device.make} ${device.model} ${device.year}`
        document.getElementById('av-found-plate').textContent = `Plate: ${device.plate}`
        actionBtnText.textContent = 'ADD THIS VEHICLE →'
        step = 'success'
      } else {
        document.getElementById('av-step-default').classList.add('hidden')
        document.getElementById('av-step-notfound').classList.remove('hidden')
        actionBtnText.textContent = 'Try Again'
        step = 'notfound'
      }
    }, 1200)
  }

  function claimDevice() {
    actionBtn.classList.add('btn-loading')
    actionBtn.disabled = true
    actionBtnText.textContent = 'Adding vehicle...'

    setTimeout(() => {
      const newVehicle = {
        id: Date.now(),
        device_code: foundDevice.device_code,
        plate: foundDevice.plate,
        make: foundDevice.make,
        model: foundDevice.model,
        year: foundDevice.year,
        tank_size: foundDevice.tank_size,
        top_speed: foundDevice.top_speed,
        active: false,
        status: "active",
        speed: 0,
        rpm: 0,
        engine_temp: 25,
        fuel_level: 100,
        fuel_litres: foundDevice.tank_size,
        battery: 12.6,
        engine_load: 0,
        location: "Nairobi",
        current_road: "—",
        lat: -1.2864,
        lng: 36.8172,
        fault_codes: [],
        distance_today: 0,
        last_updated: "Just now"
      }

      VEHICLES.push(newVehicle)
      const idx = AVAILABLE_DEVICES.findIndex(d => d.device_code === foundDevice.device_code)
      if (idx > -1) AVAILABLE_DEVICES.splice(idx, 1)

      showToast(`${newVehicle.make} ${newVehicle.model} added`, 'success')
      navigateTo('my-vehicles')
    }, 900)
  }

  function resetForm() {
    document.getElementById('av-step-notfound').classList.add('hidden')
    document.getElementById('av-step-default').classList.remove('hidden')
    actionBtnText.textContent = 'FIND MY DEVICE'
    document.getElementById('av-code-input').value = ''
    foundDevice = null
    step = 'default'
  }
})()
</script>