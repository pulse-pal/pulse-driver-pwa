<div class="onboarding-page">
  <button class="onboarding-back" id="password-back-btn" aria-label="Back">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>

  <div class="progress-dots">
    <span class="filled"></span>
    <span class="filled"></span>
    <span class="filled"></span>
  </div>

  <div class="onboarding-body">

    <div class="onboarding-icon">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.8"/>
        <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="12" cy="15" r="1.4" fill="currentColor"/>
      </svg>
    </div>
    <h1 class="onboarding-heading">Create Your Password</h1>
    <p class="onboarding-subtext">You'll use your phone number and password to login</p>

    <div class="field">
      <label class="field-label">Password</label>
      <div class="input-wrap">
        <input type="password" class="input" id="password-input" placeholder="At least 6 characters">
        <button class="input-icon-btn" id="password-toggle" type="button" aria-label="Show password">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 12C2 12 5.5 5.5 12 5.5C18.5 5.5 22 12 22 12C22 12 18.5 18.5 12 18.5C5.5 18.5 2 12 2 12Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="field">
      <label class="field-label">Confirm Password</label>
      <div class="input-wrap">
        <input type="password" class="input" id="password-confirm-input" placeholder="Re-enter password">
        <button class="input-icon-btn" id="password-confirm-toggle" type="button" aria-label="Show password">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 12C2 12 5.5 5.5 12 5.5C18.5 5.5 22 12 22 12C22 12 18.5 18.5 12 18.5C5.5 18.5 2 12 2 12Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/>
          </svg>
        </button>
      </div>
      <p id="password-error" style="font-size:11.5px;color:var(--color-danger);margin-top:4px;min-height:16px;"></p>
    </div>

  </div>

  <div class="onboarding-footer">
    <button class="btn btn-primary" id="password-submit-btn">
      <span class="btn-spinner"></span>
      <span id="password-submit-btn-text">CREATE ACCOUNT</span>
    </button>
  </div>
</div>

<script>
(function () {
  const backBtn = document.getElementById('password-back-btn')
  const pwInput = document.getElementById('password-input')
  const confirmInput = document.getElementById('password-confirm-input')
  const pwToggle = document.getElementById('password-toggle')
  const confirmToggle = document.getElementById('password-confirm-toggle')
  const errorText = document.getElementById('password-error')
  const submitBtn = document.getElementById('password-submit-btn')
  const submitBtnText = document.getElementById('password-submit-btn-text')

  backBtn.addEventListener('click', () => navigateTo('onboarding-verify'))

  function toggleVisibility(input) {
    input.type = input.type === 'password' ? 'text' : 'password'
  }
  pwToggle.addEventListener('click', () => toggleVisibility(pwInput))
  confirmToggle.addEventListener('click', () => toggleVisibility(confirmInput))

  submitBtn.addEventListener('click', () => {
    errorText.textContent = ''

    if (pwInput.value.length < 6) {
      errorText.textContent = 'Password must be at least 6 characters'
      return
    }
    if (pwInput.value !== confirmInput.value) {
      errorText.textContent = 'Passwords do not match'
      return
    }

    submitBtn.classList.add('btn-loading')
    submitBtn.disabled = true
    submitBtnText.textContent = 'Creating account...'

    setTimeout(() => {
      navigateTo('subscribe')
    }, 900)
  })
})()
</script>