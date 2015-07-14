var Tone = window.Tone = require("Tone");
var m = require("mithril");
var _ = require("lodash");
var UI = require("../ui/root");

var seqs = [];
var actions = [];

export function ignition() {
    var ui = m.mount(document.body, UI);
    ui.seqs = seqs;
    ui.actions = actions;

    Tone.Transport.setInterval(function () {
        _.invoke(seqs, "tick");
        var seqMap = _.reduce(seqs, (map, seq) => {
            map[seq.id] = seq;
            return map;
        }, {});
        _.invoke(actions, "run", seqMap);
        m.redraw();
    }, "16n");

    Tone.Transport.start();
};

