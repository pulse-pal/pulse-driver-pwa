<div class="auth-page">

  <div class="auth-header">
    <div class="auth-topbar">
      <button class="auth-back" id="password-back-btn" aria-label="Back">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <h1 class="auth-title" id="password-title">Create Your Password</h1>
    <p class="auth-subtitle" id="password-subtitle">You'll use your phone number and password to login</p>
  </div>

  <div class="auth-card">

    <div class="auth-field">
      <label class="auth-field-label" for="password-input">Password</label>
      <div class="auth-input-wrap">
        <input type="password" class="auth-input has-eye" id="password-input" placeholder="At least 6 characters" autocomplete="new-password">
        <button class="auth-eye" id="password-toggle" type="button" aria-label="Show password">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 12C2 12 5.5 5.5 12 5.5C18.5 5.5 22 12 22 12C22 12 18.5 18.5 12 18.5C5.5 18.5 2 12 2 12Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="auth-field">
      <label class="auth-field-label" for="password-confirm-input">Confirm Password</label>
      <div class="auth-input-wrap">
        <input type="password" class="auth-input has-eye" id="password-confirm-input" placeholder="Re-enter password" autocomplete="new-password">
        <button class="auth-eye" id="password-confirm-toggle" type="button" aria-label="Show password">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 12C2 12 5.5 5.5 12 5.5C18.5 5.5 22 12 22 12C22 12 18.5 18.5 12 18.5C5.5 18.5 2 12 2 12Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/>
          </svg>
        </button>
      </div>
      <p class="auth-error" id="password-error"></p>
    </div>

    <button class="auth-btn" id="password-submit-btn">
      <span class="auth-btn-spinner"></span>
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

  // This screen is shared by three paths:
  //   password reset   -> new password, then back to Login
  //   fleet activation -> the account already exists (added by the fleet
  //                       manager), so they are setting a password, and
  //                       the next step is the fleet welcome screen
  //   new individual   -> creates the account, then Subscribe
  const resetFlow = window.pulsepalAuthFlow === 'reset'
  const fleet = isFleetDriver()

  if (resetFlow) {
    document.getElementById('password-title').textContent = 'Reset Your Password'
    document.getElementById('password-subtitle').textContent = 'Choose a new password for your account.'
    submitBtnText.textContent = 'RESET PASSWORD'
  } else if (fleet) {
    submitBtnText.textContent = 'SET PASSWORD'
  }

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

    submitBtn.classList.add('is-loading')
    submitBtn.disabled = true
    submitBtnText.textContent = resetFlow
      ? 'Updating password...'
      : (fleet ? 'Saving password...' : 'Creating account...')

    setTimeout(() => {
      if (resetFlow) {
        window.pulsepalAuthFlow = null
        navigateTo('login')
        showToast('Password updated. Please sign in.', 'success')
      } else if (fleet) {
        localStorage.setItem('pulsepal_fleet_activated', 'true')
        navigateTo('fleet-welcome')
      } else {
        navigateTo('subscribe')
      }
    }, 900)
  })
})()
</script>