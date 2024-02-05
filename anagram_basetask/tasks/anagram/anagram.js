//---------------------------------------//
// Define experiment parameters.
//---------------------------------------//

// Define trial timing.
const trial_duration = null;             // No time limit

// Define randomization.
const randomize_item_order = true;       // Randomize item order
const randomize_choice_order = true;     // Randomize choice order

// Define prompt.
//const prompt = "this is a prompt"

//---------------------------------------//
// Define  anagram images to load
const anagram = jsPsych.randomization.shuffle([1,2,3,4]).map((j,i) => {
  return './img'+j+'.jpeg';
});
// Define task_info
const task_info = {
  'anagram': anagram
};
const preload_images = task_info['anagram'].concat(anagram);

//---------------------------------------//

//---------------------------------------//
// Define anagram test.
//---------------------------------------//
// Note: correct answers are 0-indexed.

var items = [
  {
    item: 1,
    stimulus: "aalrys",
    choices: [],
    correct: "salary"
  },
  {
    item: 2,
    stimulus: "ahsdow",
    choices: [],
    correct: "shadow"
  },
  {
    item: 3,
    stimulus: "alipnxe",
    choices: [],
    correct: "explain"
  },
  {
    item: 4,
    stimulus: "anytugh",
    choices: [],
    correct: "haughty"
  },
  {
    item: 5,
    stimulus: "axpline",
    choices: [],
    correct: "explain"
  },
  {
    item: 6,
    stimulus: "aykwajl",
    choices: [],
    correct: "jaywalk"
  },
  {
    item: 7,
    stimulus: "crlaige",
    choices: [],
    correct: "glacier"
  },
  {
    item: 8,
    stimulus: "donro",
    choices: [],
    correct: "donor"
  },
  {
    item: 9,
    stimulus: "drunef",
    choices: [],
    correct: "refund"
  },
  {
    item: 10,
    stimulus: "eganv",
    choices: [],
    correct: "vegan"
  },
  {
    item: 11,
    stimulus: "erlk",
    choices: [],
    correct: "lark"
  },
  {
    item: 12,
    stimulus: "hakmocm",
    choices: [],
    correct: "mohawk"
  },
  {
    item: 13,
    stimulus: "lubmjd",
    choices: [],
    correct: "jumbled"
  },
  {
    item: 14,
    stimulus: "iegwht",
    choices: [],
    correct: "weight"
  },
  {
    item: 15,
    stimulus: "marnod",
    choices: [],
    correct: "random"
  },
  {
    item: 16,
    stimulus: "matcile",
    choices: [],
    correct: "climate"
  },
  {
    item: 17,
    stimulus: "naytugh",
    choices: [],
    correct: "haughty"
  },
  {
    item: 18,
    stimulus: "nitga",
    choices: [],
    correct: "giant"
  },
  {
    item: 19,
    stimulus: "pmuoi",
    choices: [],
    correct: "impou"
  },
  {
    item: 20,
    stimulus: "saosi",
    choices: [],
    correct: "oasis"
  },
]

//---------------------------------------//
// Define timeline.
//---------------------------------------//

// Preallocate space.
ANAGRAM = [];

// Predefine fixation cross.
const fixation = {
  type: 'image-keyboard-response',
  stimulus: '<div style="font-size: 48px"></div>',
  choices: jsPsych.NO_KEYS,
  trial_duration: 600
}

// Randomize item order (if applicable).
if (randomize_item_order) { items = jsPsych.randomization.shuffle(items); }

// Iteratively define trials.
items.forEach((item, i) => {

  // Define choice order.
  var order = [...Array(item.choices.length).keys()];

  // Randomize choice order (if applicable).
  if (randomize_choice_order) { order = jsPsych.randomization.shuffle(order); }

  // Define choices.
  const choices = order.map(k => item.choices[k]);

  // Define trial.
  const trial = {
    type: 'image-keyboard-response',
    stimulus: '<h3>' + item.stimulus + '</h3>',
    choices: 'ALL_KEYS',
    prompt: "<p><i><small>" + prompt + "</small></i></p>",
    trial_duration: trial_duration,
    data: {item: item.item, correct: order.indexOf(item.correct)},
    on_finish: function(data) {

      // Store number of browser interactions.
      data.browser_interactions = jsPsych.data.getInteractionData().filter({trial: data.trial_index}).count();

      // Store choices.
      data.choices = choices;

      // Score trial.
      data.accuracy = (data.correct == data.response) ? 1 : 0;

    }
  }

  // Define trial node.
  const trial_node = {
    timeline: [fixation, trial]
  }

  // Append trial.
  ANAGRAM.push(trial_node);

});

//---------------------------------------//
// Define instructions.
//---------------------------------------//

var instructions_01 = {
  type: 'instructions',
  pages: [
    `<h3>ANAGRAM Test</h3>In this task, you will be shown a series of words. Your goal is to select one word<br>that comes closest to the meaning of the word in capital letters.</p><p>Now let's  practice. Press the "Next" button to get started.</p>`
  ],
  allow_keys: true,
  show_clickable_nav: true,
  button_label_previous: "Prev",
  button_label_next: "Next"
}

var practice = {
  type: 'image-keyboard-response',
  stimulus: "<h3>lubmjd</h3>",
  choices: [],
  trial_duration: trial_duration,
  data: {item: "practice", correct: "jumbled"},
  on_start: function(trial) {

    // Check if previously run.
    const isRepeat = jsPsych.data.get().filter({item: "practice"}).count();

    // If not repeat, then add instructions.
    if (isRepeat == 0) {

      trial.prompt = "<p><i><small>" + prompt + "</small></i></p>";

    // If repeat, update instructions.
    } else {

      trial.prompt = "<p><i><small>Not quite! Look carefully - what is this word?</small></i></p>";

    }

  }

}

var practice_node = {
  timeline: [practice],
  loop_function: function(data) {

    // Score trial.
    [data] = data.values();
    data.accuracy = (data.correct == data.response) ? 1 : 0;

    // Repeat trial if incorrect.
    if (data.accuracy == 1) {
      return false;
    } else {
      return true;
    }

  }
}

var instructions_02 = {
  type: 'instructions',
  pages: [
    '<p>Great job! Now you understand what to do.</p><p>Now, we will move onto the real words.</p>',
    '<p>There are 20 anagrams in total and no time limit.</p><p>Take as much time as you need and try to be as accurate as you can be.</p><p>If you really do not know an answer, then you should guess.</p><p>You will <u>not</u> receive feedback after you make your choice.</p><p>Press the "Next" button to get started.</p>'
  ],
  allow_keys: true,
  show_clickable_nav: true,
  button_label_previous: "Prev",
  button_label_next: "Next"
}

var INSTRUCTIONS = [
  instructions_01,
  practice_node,
  instructions_02
];
