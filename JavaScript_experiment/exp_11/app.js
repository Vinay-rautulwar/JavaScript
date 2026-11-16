import { formatTime } from "./timer.js";

const timerMinutes = document.querySelector("#timer-minutes");
const timerDisplay = document.querySelector("#timer-display");
const timerStatus = document.querySelector("#timer-status");
const classForm = document.querySelector("#class-form");
const classList = document.querySelector("#class-list");
const emptyMessage = document.querySelector("#empty-message");
const classStatus = document.querySelector("#class-status");

let timerSeconds = Number(timerMinutes.value) * 60;
let timerInterval = null;
let statusTimeout = null;
const classes = [];

function showTimer() {
  timerDisplay.textContent = formatTime(timerSeconds);
}

function resetTimer() {
  clearInterval(timerInterval);
  clearTimeout(statusTimeout);
  timerInterval = null;
  timerSeconds = Number(timerMinutes.value) * 60;
  timerStatus.textContent = "";
  showTimer();
}

document.querySelector("#start-button").addEventListener("click", () => {
  if (timerInterval) return;

  if (timerSeconds <= 0) resetTimer();
  timerStatus.textContent = "";

  // Update the countdown once per second.
  timerInterval = setInterval(() => {
    timerSeconds -= 1;
    showTimer();

    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerStatus.textContent = "Time is up!";

      // Clear the message a few seconds after the timer finishes.
      statusTimeout = setTimeout(() => {
        timerStatus.textContent = "";
      }, 3000);
    }
  }, 1000);
});

document.querySelector("#pause-button").addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
});

document.querySelector("#reset-button").addEventListener("click", resetTimer);

timerMinutes.addEventListener("change", () => {
  const minutes = Number(timerMinutes.value);

  if (!Number.isInteger(minutes) || minutes < 1) {
    timerMinutes.value = "1";
  }
  resetTimer();
});

function renderClasses() {
  const now = Date.now();
  const upcomingClasses = classes
    .filter((scheduledClass) => scheduledClass.dateTime > now)
    .sort((first, second) => first.dateTime - second.dateTime);

  classList.replaceChildren();
  emptyMessage.hidden = upcomingClasses.length > 0;

  upcomingClasses.forEach((scheduledClass) => {
    const secondsLeft = Math.floor((scheduledClass.dateTime - now) / 1000);
    const item = document.createElement("li");
    const name = document.createElement("span");
    const countdown = document.createElement("span");

    item.className = "class-item";
    name.textContent = `${scheduledClass.name} - ${scheduledClass.displayDate}`;
    countdown.textContent = `In ${formatTime(secondsLeft)}`;
    item.append(name, countdown);
    classList.append(item);
  });
}

classForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.querySelector("#class-name").value.trim();
  const date = document.querySelector("#class-date").value;
  const time = document.querySelector("#class-time").value;
  const dateTime = new Date(`${date}T${time}`);

  if (!name || Number.isNaN(dateTime.getTime()) || dateTime.getTime() <= Date.now()) {
    classStatus.textContent = "Enter a class name and a future date and time.";
    return;
  }

  classes.push({
    name,
    dateTime: dateTime.getTime(),
    displayDate: dateTime.toLocaleString()
  });
  classStatus.textContent = "";
  classForm.reset();
  renderClasses();
});

showTimer();
renderClasses();
// Refresh class countdowns in real time.
setInterval(renderClasses, 1000);
