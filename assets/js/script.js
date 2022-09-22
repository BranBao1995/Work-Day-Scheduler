const currentDayDisplay = $("#currentDay"); // date display
const timeBlocksContainer = $(".container-fluid");

const currentDay = moment().format("dddd, MMMM Do, YYYY"); // current date with a specific format
const currentTimeDisplay = moment().format("hA"); // current time fetched with AM/PM format
const currentTime = moment(currentTimeDisplay, "hA"); // current time with minutes and seconds omitted, so we can only compare the hours.

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

let saveButtonArray = []; // array to store all 'save' buttons
let inputArray = []; // array to store all user input fields
let savedSuccessfully = []; // array to store all "saved successfully" messages

// an object storing only the input tasks
let savedTasks = {
  task: [],
};

init();

function init() {
  // fetch from local storage for all saved tasks
  if (localStorage.getItem("savedTasks") != null) {
    savedTasks = JSON.parse(localStorage.getItem("savedTasks"));
  } else {
    savedTasks = {
      task: [],
    };
  }

  // display current date in the header
  currentDayDisplay.text(currentDay);

  // start rendering UI elements
  renderElements();
}

function renderElements() {
  const timeBlocksUl = $("<ul>"); // create a list to store all time blocks
  timeBlocksUl.attr("class", "custom-timeBlocks"); // give it a class to add styling
  timeBlocksContainer.append(timeBlocksUl); // append newly created <ul>

  // for each work hour
  for (let i = 0; i < timeSlots.length; i++) {
    // create all necessary UI elements
    let timeBlock = $("<li>");
    let timeLabel = $("<label>");
    let taskInput = $("<input>");
    let saveIcon = $("<button>");
    let saved = $("<span>");

    timeLabel.text(timeSlots[i]); // display the target work hour on the left of the time block
    saved.text("Saved Successfully"); // set text content to be rendered when a user saves
    taskInput.val(savedTasks.task[i]); // all input fields will be filled with saved tasks at a specific hour

    // append elements
    timeBlocksUl.append(timeBlock);
    timeBlock
      .append(timeLabel)
      .append(taskInput)
      .append(saved)
      .append(saveIcon);
    saveIcon.append('<i class="icofont-save icofont-2x"></i>');

    taskInput.attr("type", "text");

    // add classes to give styling
    timeBlock.addClass("custom-time-block custom-row");
    timeLabel.addClass("custom-hour");
    saved.addClass("custom-saved");
    saveIcon.addClass("custom-saveBtn");

    // add classes conditionally to the input fields based on the current time
    if (moment(timeSlots[i], "hA").isSame(currentTime)) {
      taskInput.addClass("custom-input custom-present");
    } else if (moment(timeSlots[i], "hA").isBefore(currentTime)) {
      taskInput.addClass("custom-input custom-past");
    } else if (moment(timeSlots[i], "hA").isAfter(currentTime)) {
      taskInput.addClass("custom-input custom-future");
    }

    // push all created elements into respective arrays
    saveButtonArray.push(saveIcon);
    inputArray.push(taskInput);
    savedSuccessfully.push(saved);
  }

  saveTask();
}

// loop through the array to assign click event to all 'save' buttons
function saveTask() {
  for (let index = 0; index < saveButtonArray.length; index++) {
    saveButtonArray[index].on("click", function () {
      let taskContent = inputArray[index].val(); // get the content in the input field

      // if the element at the index position does not exist, add the task as an array element
      if (savedTasks.task[index] === null) {
        savedTasks.task.push(taskContent);
        // if the array element already exists, replace the string value instead of adding a new array element
      } else {
        savedTasks.task[index] = taskContent;
      }

      localStorage.setItem("savedTasks", JSON.stringify(savedTasks));
      savedSuccessfully[index].css("display", "inline-block");

      // when the 'save' button is clicked, a 'saved successfully' message will pop up for 1s
      const messageDisplayTimer = setInterval(function () {
        savedSuccessfully[index].css("display", "none");
        clearInterval(messageDisplayTimer);
      }, 1000);
    });
  }
}
