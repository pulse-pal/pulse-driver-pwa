<div class="auth-welcome">

  <div class="auth-welcome-hero">
    <img src="assets/images/logo.png" alt="PulsePal" class="auth-welcome-logo">
    <div class="auth-wordmark">PULSEPAL</div>
    <div class="auth-welcome-tagline">Vehicle Intelligence</div>
  </div>

  <div class="auth-welcome-panel">
    <h2>Welcome</h2>
    <p>Monitor vehicle health in real time, track live speed, engine health and precise fuel level.</p>
    <div class="auth-pill-row">
      <button class="auth-pill auth-pill-dark" id="welcome-signin-btn">Sign in</button>
      <button class="auth-pill auth-pill-light" id="welcome-start-btn">Get Started</button>
    </div>
  </div>

</div>

<script>
(function () {
  // Fleet drivers never see this screen: they are added by a fleet
  // manager and go straight to Login.
  if (isFleetDriver()) {
    navigateTo('login')
    return
  }

  document.getElementById('welcome-signin-btn').addEventListener('click', () => navigateTo('login'))
  document.getElementById('welcome-start-btn').addEventListener('click', () => navigateTo('onboarding-device'))
})()
</script>