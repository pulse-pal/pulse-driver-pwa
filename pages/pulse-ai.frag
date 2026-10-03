<div id="pulse-ai-page">

  <div class="chat-page">
    <div class="chat-messages" id="pai-messages"></div>

    <div class="chat-suggestions" id="pai-suggestions">
      <button class="chat-suggestion-chip" data-q="Explain my fault">Explain my fault</button>
      <button class="chat-suggestion-chip" data-q="When's my next service?">When's my next service?</button>
      <button class="chat-suggestion-chip" data-q="Estimate a repair cost">Estimate a repair cost</button>
    </div>

    <div class="chat-input-row">
      <input type="text" class="input" id="pai-input" placeholder="Ask about your vehicle...">
      <button class="chat-send-btn" id="pai-send-btn" aria-label="Send">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  </div>

</div>

<script>
(function () {
  const page = document.getElementById('pulse-ai-page')

  if (DRIVER.plan !== 'premium') {
    page.innerHTML = `
      <div class="card" style="text-align:center;padding:32px 20px;margin-top:8px;">
        <div class="upgrade-lock-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        </div>
        <p style="font-size:16px;font-weight:700;color:var(--color-heading);">Pulse AI</p>
        <p style="font-size:12.5px;color:var(--color-text-secondary);margin:6px 0 20px;line-height:1.5;">Chat with an AI that understands your vehicle's faults is part of Premium.</p>
        <button class="btn btn-primary" id="pai-upgrade-btn" style="border-radius:999px;">UPGRADE TO PREMIUM</button>
      </div>
    `
    document.getElementById('pai-upgrade-btn').addEventListener('click', () => checkPremium('pulse_ai_chatbot'))
    return
  }

  const messages = document.getElementById('pai-messages')
  const input = document.getElementById('pai-input')
  const sendBtn = document.getElementById('pai-send-btn')
  const suggestions = document.getElementById('pai-suggestions')

  function addUserMessage(text) {
    const bubble = document.createElement('div')
    bubble.className = 'chat-bubble chat-bubble-user'
    bubble.textContent = text
    messages.appendChild(bubble)
    messages.scrollTop = messages.scrollHeight
  }

  function addAiMessage(text) {
    const bubble = document.createElement('div')
    bubble.className = 'chat-bubble chat-bubble-ai'
    bubble.textContent = text
    messages.appendChild(bubble)
    messages.scrollTop = messages.scrollHeight
  }

  function nextServiceReminder() {
    return SERVICE_REMINDERS.slice().sort((a, b) => a.due_in_km - b.due_in_km)[0]
  }

  function respondTo(text) {
    const hasFault = ACTIVE_VEHICLE.fault_codes.length > 0
    const fault = hasFault ? FAULT_CODES.find(f => f.code === ACTIVE_VEHICLE.fault_codes[0]) : null

    if (/fault|wrong|problem|check engine/i.test(text)) {
      if (fault) return `${fault.title} (${fault.code}): ${fault.description_simple}`
      return `Good news — ${ACTIVE_VEHICLE.plate} has no active faults right now.`
    }

    if (/service|maintenance|oil|tyre|rotation/i.test(text)) {
      const r = nextServiceReminder()
      return `Your soonest upcoming item is "${r.title}", due in ${r.due_in}. Estimated cost: ${r.estimated_cost}.`
    }

    if (/cost|price|repair|expensive|how much/i.test(text)) {
      if (fault) return `Fixing ${fault.code} (${fault.title}) typically costs ${formatKESRange(fault.cost_min, fault.cost_max)} in Kenya, depending on the garage.`
      return `You have no active faults right now, so there's no repair cost to estimate. Your next service item is "${nextServiceReminder().title}".`
    }

    return "I'm still learning — try asking about a fault code, your next service, or a repair cost estimate."
  }

  function handleSend(presetText) {
    const text = (presetText || input.value).trim()
    if (!text) return
    addUserMessage(text)
    input.value = ''

    setTimeout(() => {
      addAiMessage(respondTo(text))
    }, 700)
  }

  sendBtn.addEventListener('click', () => handleSend())
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend()
  })

  suggestions.querySelectorAll('.chat-suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => handleSend(chip.dataset.q))
  })

  addAiMessage(`Hi ${DRIVER.name.split(' ')[0]}! Ask me anything about your ${ACTIVE_VEHICLE.make} ${ACTIVE_VEHICLE.model}.`)
})()
</script>