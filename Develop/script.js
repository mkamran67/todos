// 1. On Open -> Show Current Day -> Reload LocalStorage Data
// 2. On Scroll down show day planner.
/* 3. 
    -- Day Planner 📃
    [] Blocks of Time -> Color coded for time (Past,Present, Future)
    [] TimeBlock.onClick -> Ability to input an event -> Save to LocalStorage     
*/

// Variables
// Get today
const todayText = moment().format('[Today is] dddd [the] do');

// Get current hour
let nowHour = moment().format('hh');

// Will contain Time Block Data
let timeBlocksArray = [];

// 1. Display Today
$('#currentDay').text(todayText);

// 2. List time blocks for today current hour being Green past dues red,
$('document').ready(() => {
  // Listing times -> Load Initial Timeblocks
  // Business Hours so 9AM - 5PM
  let hour = 9,
    meridiem = 'AM';

  // Initial Blocks -- Empty
  for (let i = 0; i <= 8; i++) {
    if (hour > 12) {
      hour = 1;
    }
    if (hour === 12) {
      meridiem = 'PM';
    }

    $('#timeBlockList').append(
      `
        <li class="list-group-item p-0 ${i === 8 ? 'mb-5' : ''}" id=${i}>
            <div
                class="list-group-item d-flex justify-content-between align-items-center"
            >
            <input type="text" class="p-1 pl-2 mr-2" id="input-${i}"/>
            <span class="badge elegant-color-dark badge-pill fa-1x"
            >${hour} ${meridiem}</span
                    >
            <i class="far fa-save fa-lg ml-2 p-2"  id=${hour + meridiem}></i>
            </div>
        </li>
        `
    );

    hour++;
  } // For Loop

  // Get items from localstorage and set them in blocks
  if (localStorage.getItem('timeblocks') !== null) {
    timeBlocksArray = getBlocks();

    timeBlocksArray.forEach((element) => {
      reloadBlock(element.time, element.text);
    });
  }

  // Create Event listeners
  // Save -> onClick
  $('i').on('click', (e) => {
    // Getting Time
    let timeId = e.target.id;

    // Getting previous Stored Blocks
    if (localStorage.getItem('timeblocks') !== null) {
      timeBlocksArray = getBlocks();
    }

    // Get corresponding Text
    let relText = $(`#${timeId}`).siblings()[0].value;

    // Store Time + text
    let noteObj = {
      time: timeId,
      text: relText,
    };

    // check if previous blocks contains, will remove by reference
    checkForPreviousBlocks(noteObj);

    // push to array
    timeBlocksArray.push(noteObj);

    // set to storage
    setBlocks(timeBlocksArray);

    console.log(`set`);
  });

  colorCodeBlocks();
});

function colorCodeBlocks() {
  // Time Variables
  // Military time easier to subtract
  let currentHourNumber = parseInt(moment().format('HH'), 10);
  let previousHours = currentHourNumber === 9 ? 0 : currentHourNumber - 9; // Set to 0 if it's start of day
  let nextHours = 17 - currentHourNumber; // Subtract current hour
  let testString = '';
  nowHour = moment().format('HH');

  console.log(parseInt(nowHour, 10));

  // Set block colors Current -> Light Blue, Past Due -> Red, Future -> Green
  if (parseInt(nowHour, 10) < 17 && parseInt(nowHour, 10) > 9) {
    nowHour = moment().format('hA');
    // Set current hours block color to green-ish
    $(`#${nowHour}`).parent().css('background-color', '#90ee02');

    // Color code previous blocks
    if (previousHours > 0) {
      for (let i = 0; i < previousHours; i++) {
        testString = $(`#input-${i}`).val();
        $(`#${i}`).children().css('background-color', '#FF9E80');

        // check if text exists in block
        // if (
        //   testString.match(/^ *$/) === null &&
        //   testString !== null &&
        //   (testString !== '' && testString) !== undefined
        // ) {
        //   $(`#${i}`).children().css('background-color', '#f47100');
        // }
      }
    }
  } // For Previous blocks

  // Color code next blocks ->#1E88E5
  if (nextHours > 0) {
    for (let j = 0; j <= nextHours - 1; j++) {
      console.log(j + 1 + previousHours);

      // Adding 1 to ignore current hour
      testString = $(`#input-${j + previousHours + 1}`).val();
      console.log(testString);

      $(`#${j + 1 + previousHours}`)
        .children()
        .css('background-color', '#1E88E5');

      // This portion is if you only want to high light filled blocks
      // if (
      //   testString.match(/^ *$/) === null &&
      //   testString !== null &&
      //   (testString !== '' && testString) !== undefined
      // ) {
      //   $(`#${j + 1 + previousHours}`)
      //     .children()
      //     .css('background-color', '#1E88E5');
      // }
    }
  }
}

function getBlocks() {
  return JSON.parse(localStorage.getItem('timeblocks'));
}

function setBlocks(arrBlocks) {
  localStorage.setItem('timeblocks', JSON.stringify(arrBlocks));
}

function reloadBlock(time, text) {
  $(`#${time}`).siblings()[0].value = text;
}

function checkForPreviousBlocks(testObj) {
  console.log(`Checking for previous blocks`);

  // Filter out duplicates
  let temp = timeBlocksArray.filter((element) => element.time !== testObj.time);
  console.log(temp);
  timeBlocksArray = temp;
}
