var Tone = window.Tone = require("Tone");
var m = require("mithril");
var _ = require("lodash");

var Sequencer = require("./Sequencer");
var UI = require("./UI");

var seqs = [];
var actions = [];
var ui = m.mount(document.body, UI);
ui.seqs = seqs;
ui.actions = actions;

//seqs[0].routes.push(new Tone.SimpleSynth().toMaster());
//seqs[1].routes.push(new Tone.SimpleSynth().toMaster());

Tone.Transport.bpm.value = 120;
Tone.Transport.setInterval(function(time){
    _.invoke(seqs, "tick");
    var seqMap = _.reduce(seqs, (map, seq) => {map[seq.id] = seq; return map}, {});
    _.invoke(actions, "run", seqMap);
    m.redraw();
}, "16n");

Tone.Transport.start();
