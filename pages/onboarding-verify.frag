<div class="onboarding-page">
  <button class="onboarding-back" id="verify-back-btn" aria-label="Back">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>

  <div class="progress-dots">
    <span class="filled"></span>
    <span class="filled"></span>
    <span></span>
  </div>

  <div class="onboarding-body">

    <div id="verify-step-default">
      <div class="onboarding-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="7" y="2" width="10" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/>
          <path d="M11 17H13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="17" cy="7" r="4" fill="var(--color-bg-card)" stroke="currentColor" stroke-width="1.8"/>
          <path d="M15.5 7L16.5 8L18.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1 class="onboarding-heading">Verify Your Phone</h1>
      <p class="onboarding-subtext" id="verify-subtext">We sent a 4-digit code to<br><strong id="verify-phone-number"></strong></p>

      <div class="otp-row">
        <input type="tel" inputmode="numeric" maxlength="1" class="otp-box" id="otp-1">
        <input type="tel" inputmode="numeric" maxlength="1" class="otp-box" id="otp-2">
        <input type="tel" inputmode="numeric" maxlength="1" class="otp-box" id="otp-3">
        <input type="tel" inputmode="numeric" maxlength="1" class="otp-box" id="otp-4">
      </div>

      <div class="resend-row" id="verify-resend-row">
        Didn't receive code? Resend in <span id="verify-countdown">45</span> seconds
      </div>
    </div>

    <div id="verify-step-success" class="hidden">
      <div class="result-state">
        <div class="result-icon-success">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2 style="font-size:19px;font-weight:700;">Phone Verified!</h2>
      </div>
    </div>

  </div>

  <div class="onboarding-footer" id="verify-footer">
    <button class="btn btn-primary" id="verify-action-btn">
      <span class="btn-spinner"></span>
      <span id="verify-action-btn-text">VERIFY</span>
    </button>
  </div>
</div>

<script>
(function () {
  let countdownSeconds = 45
  let countdownTimer = null

  const backBtn = document.getElementById('verify-back-btn')
  const actionBtn = document.getElementById('verify-action-btn')
  const actionBtnText = document.getElementById('verify-action-btn-text')
  const resendRow = document.getElementById('verify-resend-row')
  const countdownSpan = document.getElementById('verify-countdown')
  const otpInputs = [1, 2, 3, 4].map(n => document.getElementById(`otp-${n}`))

  backBtn.addEventListener('click', () => navigateTo('onboarding-device'))

  // Show driver's phone as +254 format
  const rawPhone = DRIVER.phone.replace(/^0/, '254')
  document.getElementById('verify-phone-number').textContent = `+${rawPhone}`

  // OTP box behavior: auto-focus next, auto-submit on 4th digit
  otpInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^0-9]/g, '')
      if (input.value && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus()
      }
      if (otpInputs.every(box => box.value.length === 1)) {
        verifyCode()
      }
    })

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && index > 0) {
        otpInputs[index - 1].focus()
      }
    })
  })

  otpInputs[0].focus()

  actionBtn.addEventListener('click', verifyCode)

  function verifyCode() {
    actionBtn.classList.add('btn-loading')
    actionBtn.disabled = true
    actionBtnText.textContent = 'Verifying...'

    setTimeout(() => {
      document.getElementById('verify-step-default').classList.add('hidden')
      document.getElementById('verify-step-success').classList.remove('hidden')
      document.getElementById('verify-footer').classList.add('hidden')
      clearInterval(countdownTimer)

      setTimeout(() => {
        navigateTo('onboarding-password')
      }, 1200)
    }, 900)
  }

  function startCountdown() {
    countdownSeconds = 45
    countdownSpan.textContent = countdownSeconds
    resendRow.innerHTML = `Didn't receive code? Resend in <span id="verify-countdown">${countdownSeconds}</span> seconds`

    countdownTimer = setInterval(() => {
      countdownSeconds -= 1
      const span = document.getElementById('verify-countdown')
      if (span) span.textContent = countdownSeconds

      if (countdownSeconds <= 0) {
        clearInterval(countdownTimer)
        resendRow.innerHTML = `<a href="#" id="verify-resend-link">Resend Code</a>`
        document.getElementById('verify-resend-link').addEventListener('click', (e) => {
          e.preventDefault()
          showToast('New code sent', 'success')
          startCountdown()
        })
      }
    }, 1000)
  }

  startCountdown()
})()
</script>