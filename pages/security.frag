<div id="security-page">

  <button id="sec-back-btn" aria-label="Back" style="display:flex;align-items:center;gap:4px;margin:0 0 14px -6px;padding:8px 12px 8px 6px;border-radius:999px;font-size:13px;font-weight:600;color:var(--color-text-secondary);">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Settings
  </button>

  <p style="font-size:19px;font-weight:800;color:var(--color-heading);margin-bottom:4px;">App Lock</p>
  <p style="font-size:12.5px;color:var(--color-text-secondary);margin-bottom:20px;">Require a PIN to open PulsePal</p>

  <div class="card" style="padding:0 18px;">
    <div class="toggle-row">
      <div>
        <p style="font-size:13.5px;font-weight:600;color:var(--color-heading);">Lock with PIN</p>
        <p style="font-size:11.5px;color:var(--color-text-secondary);margin-top:2px;" id="sec-status-line"></p>
      </div>
      <label class="toggle">
        <input type="checkbox" id="sec-lock-toggle">
        <span class="toggle-track"></span>
      </label>
    </div>
  </div>

  <div id="sec-change-pin-wrap" class="hidden" style="margin-top:16px;">
    <button class="btn btn-outline" id="sec-change-pin-btn" style="border-radius:999px;">CHANGE PIN</button>
  </div>

  <p style="font-size:11.5px;color:var(--color-text-secondary);margin:20px 4px 0;line-height:1.5;">
    Your PIN is stored only on this device. Fingerprint and Face ID unlock aren't available in this app yet — PIN entry is the current lock method.
  </p>

</div>

<script>
(function () {
  document.getElementById('sec-back-btn').addEventListener('click', () => navigateTo('settings'))

  const toggle = document.getElementById('sec-lock-toggle')
  const statusLine = document.getElementById('sec-status-line')
  const changePinWrap = document.getElementById('sec-change-pin-wrap')

  function render() {
    toggle.checked = SECURITY_SETTINGS.app_lock_enabled
    statusLine.textContent = SECURITY_SETTINGS.app_lock_enabled
      ? 'PIN set — required on next open'
      : 'Off — anyone can open the app'
    changePinWrap.classList.toggle('hidden', !SECURITY_SETTINGS.app_lock_enabled)
  }

  function openPinModal(mode) {
    // mode: "set" (first time) or "change" (already has a PIN)
    let step = mode === 'change' ? 'current' : 'new'
    let newPin = ''

    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay'
    document.body.appendChild(overlay)

    function draw() {
      let title, subtitle, showCurrentCheck
      if (step === 'current') {
        title = 'Enter Current PIN'
        subtitle = 'Confirm your existing PIN to continue'
      } else if (step === 'new') {
        title = 'Set a 4-digit PIN'
        subtitle = "You'll enter this to open the app"
      } else {
        title = 'Confirm PIN'
        subtitle = 'Enter the same PIN again'
      }

      overlay.innerHTML = `
        <div class="modal-card">
          <h3 style="font-size:16px;font-weight:700;margin-bottom:4px;color:var(--color-heading);">${title}</h3>
          <p style="font-size:12.5px;color:var(--color-text-secondary);margin-bottom:16px;">${subtitle}</p>
          <div class="otp-row">
            <input type="tel" inputmode="numeric" maxlength="1" class="otp-box" id="sec-pin-1">
            <input type="tel" inputmode="numeric" maxlength="1" class="otp-box" id="sec-pin-2">
            <input type="tel" inputmode="numeric" maxlength="1" class="otp-box" id="sec-pin-3">
            <input type="tel" inputmode="numeric" maxlength="1" class="otp-box" id="sec-pin-4">
          </div>
          <p id="sec-pin-error" style="font-size:11.5px;color:var(--color-danger);margin-top:10px;min-height:16px;text-align:center;"></p>
          <button class="btn btn-ghost" id="sec-pin-cancel" style="margin-top:8px;">CANCEL</button>
        </div>
      `

      const boxes = [1, 2, 3, 4].map(n => document.getElementById(`sec-pin-${n}`))
      boxes.forEach((box, i) => {
        box.addEventListener('input', () => {
          box.value = box.value.replace(/[^0-9]/g, '')
          if (box.value && i < 3) boxes[i + 1].focus()
          if (boxes.every(b => b.value.length === 1)) {
            handleComplete(boxes.map(b => b.value).join(''))
          }
        })
        box.addEventListener('keydown', (e) => {
          if (e.key === 'Backspace' && !box.value && i > 0) boxes[i - 1].focus()
        })
      })
      boxes[0].focus()

      document.getElementById('sec-pin-cancel').addEventListener('click', () => overlay.remove())
    }

    function handleComplete(entered) {
      const errorEl = document.getElementById('sec-pin-error')

      if (step === 'current') {
        if (entered !== SECURITY_SETTINGS.pin) {
          errorEl.textContent = 'Incorrect PIN'
          setTimeout(draw, 700)
          return
        }
        step = 'new'
        draw()
        return
      }

      if (step === 'new') {
        newPin = entered
        step = 'confirm'
        draw()
        return
      }

      if (step === 'confirm') {
        if (entered !== newPin) {
          errorEl.textContent = 'PINs do not match — try again'
          step = 'new'
          setTimeout(draw, 900)
          return
        }
        SECURITY_SETTINGS.pin = newPin
        SECURITY_SETTINGS.app_lock_enabled = true
        overlay.remove()
        render()
        showToast('App Lock enabled', 'success')
      }
    }

    draw()
  }

  toggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      openPinModal('set')
      // Revert the visible toggle until the PIN flow actually
      // completes — render() will flip it on once a PIN is set.
      e.target.checked = false
    } else {
      SECURITY_SETTINGS.app_lock_enabled = false
      SECURITY_SETTINGS.pin = null
      render()
      showToast('App Lock disabled', 'success')
    }
  })

  document.getElementById('sec-change-pin-btn').addEventListener('click', () => {
    openPinModal('change')
  })

  render()
})()
</script>