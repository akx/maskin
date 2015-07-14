var Tone = require("Tone");
export var masterDelay = new Tone.FeedbackDelay("6n", 0.25);
masterDelay.toMaster();
export var master = masterDelay;
