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
  "8PM",
  "9PM",
  "10PM",
];

let saveButtonArray = [];
let inputArray = [];

let savedTasks = {
  task: [],
};

if (localStorage.getItem("savedTasks") != null) {
  savedTasks = JSON.parse(localStorage.getItem("savedTasks"));
} else {
  savedTasks = {
    timeBlock: [],
    task: [],
  };
}

const timeBlocksUl = $("<ul>");
timeBlocksUl.attr("class", "custom-timeBlocks");
timeBlocksContainer.append(timeBlocksUl);

currentDayDisplay.text(currentDay);

for (let i = 0; i < timeSlots.length; i++) {
  let timeBlock = $("<li>");
  let timeLabel = $("<label>");
  let taskInput = $("<input>");
  let saveIcon = $("<button>");

  timeLabel.text(timeSlots[i]);
  taskInput.val(savedTasks.task[i]);

  timeBlocksUl.append(timeBlock);
  timeBlock.append(timeLabel).append(taskInput).append(saveIcon);
  saveIcon.append('<i class="icofont-save icofont-2x"></i>');

  taskInput.attr("id", "timeBlock" + i);
  taskInput.attr("type", "text");
  saveIcon.attr("id", "timeBlock" + i);
  saveIcon.children().attr("id", "timeBlock" + i);

  timeBlock.addClass("custom-time-block custom-row");
  timeLabel.addClass("custom-hour");
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
}

for (let index = 0; index < saveButtonArray.length; index++) {
  saveButtonArray[index].on("click", function () {
    let taskContent = inputArray[index].val();

    if (savedTasks.task[index] === null) {
      savedTasks.task.push(taskContent);
    } else {
      savedTasks.task[index] = taskContent;
    }

    localStorage.setItem("savedTasks", JSON.stringify(savedTasks));
  });
}
