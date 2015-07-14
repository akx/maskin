var Tone = window.Tone = require("Tone");
var m = require("mithril");
var _ = require("lodash");
var UI = require("../ui/root");
var Synth = require("./Synth");

var seqs = [];
var actions = [];
var synths = [];

export function ignition() {
    var ui = m.mount(document.body, UI);
    ui.seqs = seqs;
    ui.actions = actions;
    ui.synths = synths;

    Tone.Transport.setInterval(function () {
        var maps = {seqs: {}, synths: {}};
        seqs.forEach((seq) => {maps.seqs[seq.id] = seq;});
        synths.forEach((synth) => {maps.synths[synth.id] = synth;});
        _.invoke(seqs, "tick", maps);
        _.invoke(actions, "run", maps);
        m.redraw();
    }, "16n");

    Tone.Transport.start();
}

