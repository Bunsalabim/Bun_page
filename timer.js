document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("timer_clock");

  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resetBtn = document.getElementById("resetBtn");

  const modeSelect = document.getElementById("timer_mode");
  const cdBox = document.getElementById("countdown_inputs");
  const cdH = document.getElementById("cd_hours");
  const cdM = document.getElementById("cd_minutes");
  const cdS = document.getElementById("cd_seconds");

  // Safety: if HTML isn't updated yet, fail quietly.
  if (!display || !startBtn || !pauseBtn || !resetBtn || !modeSelect || !cdBox || !cdH || !cdM || !cdS) {
    return;
  }

  let interval = null;
  let seconds = 0;       // current time in seconds (up or down)
  let running = false;

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function formatHHMMSS(totalSeconds) {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${pad2(hrs)}:${pad2(mins)}:${pad2(secs)}`;
  }

  function updateDisplay() {
    display.textContent = formatHHMMSS(seconds);
  }

  function stopInterval() {
    if (interval) clearInterval(interval);
    interval = null;
    running = false;
  }

  function readCountdownInputsToSeconds() {
    const h = Math.max(0, Number(cdH.value) || 0);
    const m = Math.max(0, Number(cdM.value) || 0);
    const s = Math.max(0, Number(cdS.value) || 0);

    // Normalize weird inputs like 90 seconds
    return (h * 3600) + (m * 60) + s;
  }

  function syncModeUI() {
    const mode = modeSelect.value;
    cdBox.style.display = (mode === "down") ? "flex" : "none";

    // Reset when changing mode (simple + predictable)
    resetTimer();
  }

  function tick() {
    const mode = modeSelect.value;

    if (mode === "up") {
      seconds += 1;
      updateDisplay();
      return;
    }

    // countdown
    seconds -= 1;
    if (seconds <= 0) {
      seconds = 0;
      updateDisplay();
      stopInterval();

      // Optional: end sound / alert
      // alert("Time's up!");
      return;
    }
    updateDisplay();
  }

  function startTimer() {
    if (running) return;

    const mode = modeSelect.value;

    // Countdown: if we are at 0, read inputs at the moment you press Start
    if (mode === "down" && seconds === 0) {
      seconds = readCountdownInputsToSeconds();
      if (seconds <= 0) {
        seconds = 0;
        updateDisplay();
        return;
      }
      updateDisplay();
    }

    running = true;
    interval = setInterval(tick, 1000);
  }

  function pauseTimer() {
    stopInterval();
  }

  function resetTimer() {
    stopInterval();
    seconds = 0;
    updateDisplay();
  }

  // Events
  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);
  modeSelect.addEventListener("change", syncModeUI);

  // Init
  updateDisplay();
  syncModeUI();
});
