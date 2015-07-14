require("style!css!./maskin.css");
var Tone = require("Tone");
var m = require("mithril");
var _ = require("lodash");
var Sequencer = require("../core/Sequencer");
var seqComponent = require("./seq-ui");
var actionComponent = require("./action-ui");
var synthComponent = require("./synth-ui");

var UI = {
    controller: function () {
        this.seqs = [];
        this.actions = [];
        this.synths = [];
        this.seqMap = {};
        this.stepActionMap = {};

        this.addAction = (action) => {
            this.actions.push(action);
            this.updateMaps();
        };
        this.delAction = (action) => {
            var index = this.actions.indexOf(action);
            if(index > -1) this.actions.splice(index, 1);
            this.updateMaps();
        };
        this.addSeq = (seq) => {
            this.seqs.push(seq);
            this.updateMaps();
        };
        this.delSeq = (seq) => {
            var index = this.seqs.indexOf(seq);
            if(index > -1) this.seqs.splice(index, 1);
            this.updateMaps();
        };
        this.updateMaps = () => {
            this.seqMap = _.reduce(this.seqs, (map, seq) => {
                map[seq.id] = seq;
                return map;
            }, {});
            this.stepActionMap = _.reduce(this.actions, (map, action) => {
                if (action.active) {
                    map.rx[action.toSeqId + "-" + action.toStep] = true;
                    map.tx[action.fromSeqId + "-" + action.fromStep] = true;
                }
                return map;
            }, {rx: {}, tx: {}});
        };
    },
    view: function(ctrl) {
        return m("div#ui", [
            m("div#seqs", [
                m("div.toolbar", [
                    m("input", {
                        type: "number", min: 10, max: 600, value: Tone.Transport.bpm.value,
                        oninput: (e) => {Tone.Transport.bpm.value = 0 | e.target.value; },
                    }),
                    m("button", {onclick: () => {ctrl.addSeq(new Sequencer(16));}}, "new seq"),
                    m("button", {onclick: () => {_.invoke(ctrl.seqs, "reset");}}, "reset all"),
                    m("button", {onclick: () => {ctrl.seqs.forEach((s) => {s.ui = false;});}}, "collapse all")
                ]),
                m("div#seqlist", ctrl.seqs.map(_.partial(seqComponent, ctrl)))
            ]),
            m("div#actions", ctrl.actions.map(_.partial(actionComponent, ctrl))),
            m("div#synths", ctrl.synths.map(_.partial(synthComponent, ctrl))),
        ]);
    }
};

export default UI;
