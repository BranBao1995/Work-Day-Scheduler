const currentDayDisplay = $("#currentDay");
const timeBlocksContainer = $(".container-fluid");

const currentDay = moment().format("dddd, MMMM Do, YYYY");
const currentTimeDisplay = moment().format("hA");
const currentTime = moment(currentTimeDisplay, "hA");

const timeSlots = [
  "9AM",
  "10AM",
  "11AM",
  "12PM",
  "1PM",
  "2PM",
  "3PM",
  "4PM",
  "5PM",
  "6PM",
  "7PM",
];

let saveButtonArray = [];
let inputArray = [];
let savedSuccessfully = [];

let savedTasks = {
  task: [],
};

init();

function init() {
  if (localStorage.getItem("savedTasks") != null) {
    savedTasks = JSON.parse(localStorage.getItem("savedTasks"));
  } else {
    savedTasks = {
      task: [],
    };
  }

  currentDayDisplay.text(currentDay);

  renderElements();
}

function renderElements() {
  const timeBlocksUl = $("<ul>");
  timeBlocksUl.attr("class", "custom-timeBlocks");
  timeBlocksContainer.append(timeBlocksUl);

  for (let i = 0; i < timeSlots.length; i++) {
    let timeBlock = $("<li>");
    let timeLabel = $("<label>");
    let taskInput = $("<input>");
    let saveIcon = $("<button>");
    let saved = $("<span>");

    timeLabel.text(timeSlots[i]);
    saved.text("Saved Successfully");
    taskInput.val(savedTasks.task[i]);

    timeBlocksUl.append(timeBlock);
    timeBlock
      .append(timeLabel)
      .append(taskInput)
      .append(saved)
      .append(saveIcon);
    saveIcon.append('<i class="icofont-save icofont-2x"></i>');

    taskInput.attr("type", "text");

    timeBlock.addClass("custom-time-block custom-row");
    timeLabel.addClass("custom-hour");
    saved.addClass("custom-saved");
    saveIcon.addClass("custom-saveBtn");

    if (moment(timeSlots[i], "hA").isSame(currentTime)) {
      taskInput.addClass("custom-input custom-present");
    } else if (moment(timeSlots[i], "hA").isBefore(currentTime)) {
      taskInput.addClass("custom-input custom-past");
    } else if (moment(timeSlots[i], "hA").isAfter(currentTime)) {
      taskInput.addClass("custom-input custom-future");
    }

    saveButtonArray.push(saveIcon);
    inputArray.push(taskInput);
    savedSuccessfully.push(saved);
  }

  saveTask();
}

function saveTask() {
  for (let index = 0; index < saveButtonArray.length; index++) {
    saveButtonArray[index].on("click", function () {
      let taskContent = inputArray[index].val();

      if (savedTasks.task[index] === null) {
        savedTasks.task.push(taskContent);
      } else {
        savedTasks.task[index] = taskContent;
      }

      localStorage.setItem("savedTasks", JSON.stringify(savedTasks));
      savedSuccessfully[index].css("display", "inline-block");
      const messageDisplayTimer = setInterval(function () {
        savedSuccessfully[index].css("display", "none");
        clearInterval(messageDisplayTimer);
      }, 1000);
    });
  }
}
