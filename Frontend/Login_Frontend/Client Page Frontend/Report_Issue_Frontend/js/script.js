// ============================================================
// CivicLens — Report Issue page
// Voice-note record button visual state (no real audio capture)
// ============================================================

// --- Voice note record button (visual only) ------------------------
const voiceBox = document.getElementById('voiceBox');
const voiceLabel = document.getElementById('voiceLabel');
let recording = false;

voiceBox.addEventListener('click', function () {
  recording = !recording;
  voiceBox.classList.toggle('recording', recording);
  voiceLabel.textContent = recording ? 'Recording… tap to stop' : 'Tap to record';
});
