// DOM Elements
const box = document.getElementsByClassName("box")[0];
const start = document.getElementsByClassName("switcher")[0];
const main = document.getElementsByClassName("-main")[0];
const rest = document.getElementsByClassName("break")[0];
const setting = document.getElementsByClassName("setting")[0];
const pomodoroTime = document.getElementById("quantity");
const breakTime = document.getElementById("quantity2");
const container = document.getElementsByClassName("container")[0];
const closeBtn = document.getElementsByClassName("close")[0];
const progressBar = document.getElementById("myBar");

setting.style.cursor = "pointer";

// Timer Setup Function
function createTimer(element, timeValue, hidden = false) {
    const timer = document.createElement("div");
    timer.innerHTML = `${timeValue.padStart(2, "0")}:00`;
    timer.style.fontSize = "60px";
    timer.style.position = "fixed";
    timer.style.left = "39%";
    timer.style.bottom = "40%";
    timer.style.backgroundColor = "rgba(32, 30, 30, 0.08)";
    timer.style.visibility = hidden ? "hidden" : "visible";
    element.appendChild(timer);
    return timer;
}

// Initialize Pomodoro and Break Timers
let timer = createTimer(box, pomodoroTime.value || "25");
let timerb = createTimer(box, breakTime.value || "05", true);

let interval;
let isPomodoro = true; // Track which timer is active (Pomodoro or Break)

// Start Timer Function
function startTimer(timerElement) {
    let [min, sec] = timerElement.innerHTML.split(":").map(Number);
    let total = min * 60 + sec;  // Total seconds at the start of the timer
    let elapsed = 0; // Track the elapsed time

    interval = setInterval(function () {
        if (min > 0 || sec > 0) {
            if (sec <= 0 && min) {
                min--;
                sec = 59;
            } else {
                sec--;
            }

            elapsed++;  // Increment the elapsed time
            timerElement.innerHTML = `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
            
            // Calculate the progress percentage
            let progressPercentage = (elapsed / total) * 100;
            progressBar.style.width = `${progressPercentage}%`;

        } else {
            clearInterval(interval);
            document.getElementById("myAudio").play();
            start.textContent = "START";
            if (isPomodoro) {
                // Short delay before starting break
                setTimeout(() => {
                    switchMode(rest, timerb, timer);
                    start.click(); // Start break timer
                }, 5000);
            }
        }
    }, 1000);
}

// Switch between Pomodoro and Break
function switchMode(button, showTimer, hideTimer) {
    isPomodoro = button === main;
    showTimer.style.visibility = "visible";
    hideTimer.style.visibility = "hidden";
    clearInterval(interval);
    start.textContent = "START";
    document.title = isPomodoro ? "Time to work!" : "Time for a break!";
}

// Update Timer Values Function
function updateTimerValues() {
    clearInterval(interval);
    timer.innerHTML = `${(pomodoroTime.value || "25").padStart(2, "0")}:00`;
    timerb.innerHTML = `${(breakTime.value || "05").padStart(2, "0")}:00`;
    start.textContent = "START";
    progressBar.style.width = "0%";
}

// Event Listeners
main.addEventListener('click', function () {
    switchMode(main, timer, timerb);
});

rest.addEventListener('click', function () {
    switchMode(rest, timerb, timer);
});

start.addEventListener('click', function () {
    if (start.textContent === "START") {
        start.textContent = "PAUSE";
        const activeTimer = isPomodoro ? timer : timerb;
        startTimer(activeTimer);
        main.style.backgroundColor = isPomodoro ? "#fb806a" : "rgba(32, 30, 30, 0.025)";
        rest.style.backgroundColor = isPomodoro ? "rgba(32, 30, 30, 0.025)" : "#fb806a";
    } else {
        start.textContent = "START";
        clearInterval(interval);
    }
});

setting.addEventListener('click', function () {
    container.style.display = "block";
    updateTimerValues(); // Update timer values whenever settings are opened
});

closeBtn.addEventListener('click', function () {
    container.style.display = "none";
});

pomodoroTime.addEventListener('input', updateTimerValues);
breakTime.addEventListener('input', updateTimerValues);

// Hover Effects
function setHoverEffect(button, color) {
    button.addEventListener('mouseenter', function () {
        button.style.backgroundColor = color;
    });
    button.addEventListener('mouseleave', function () {
        button.style.backgroundColor = "rgba(32, 30, 30, 0.025)";
    });
}

setHoverEffect(main, "#fb806a");
setHoverEffect(rest, "#fb806a");
