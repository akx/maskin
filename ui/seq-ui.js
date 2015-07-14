var m = require("mithril");
var _ = require("lodash");
var Sequencer = require("../core/Sequencer");
var {select} = require("./uitools");
var stepComponent = require("./step-ui");

function rectify(stepComps) {
    var s = 0 | Math.sqrt(stepComps.length), out = [];
    stepComps.forEach(function(comp, i) {
        out.push(comp);
        if(i % s == s - 1) {
            out.push(m("div"));
        }
    });
    return out;
}

function seqComponent(ctrl, seq) {
    var stepComps = seq.steps.map(_.partial(stepComponent, ctrl, seq));
    if(seq.view == "rect") stepComps = rectify(stepComps);

    var content = [
        m("div", [
            m("input", {title: "ui", type: "checkbox", checked: !!seq.ui, onclick: () => {seq.ui = !seq.ui;}}),
            m("span", [seq.name, " ", (seq.position + 1), "/", seq.nSteps].join("")),
        ])
    ];
    if(seq.ui) {
        content = content.concat([
            m("div.toolbar", [
                m("button", {onclick: () => {seq.reset();}}, "reset"),
                m("button", {onclick: () => {seq.randomize();}}, "rand"),
                m("button", {onclick: () => {seq.clear();}}, "clr"),
                m("button", {onclick: (e) => {if(e.ctrlKey) ctrl.delSeq(seq);}}, "del"),
            ]),
            m("div", [
                m("input", {title: "steps", type: "number", value: seq.nSteps, min: 1, max: 1024, oninput: (e) => {seq.setNSteps(e.target.value);}}),
                m("input", {title: "speed divisor", type: "number", value: seq.speed, min: 1, max: 1024, oninput: (e) => {seq.speed = e.target.value;}}),
                m("input", {title: "stride", type: "number", value: seq.stride, min: 0, max: 1024, oninput: (e) => {seq.stride = e.target.value;}}),
                select({title: "mode", value: seq.mode, oninput: (e) => {seq.mode = e.target.value;}}, Sequencer.modes),
                select({title: "wrap type", value: seq.wrap, oninput: (e) => {seq.wrap = e.target.value;}}, Sequencer.wrapTypes),
                select({title: "view type", value: seq.view, oninput: (e) => {seq.view = e.target.value;}}, ["linear", "rect"]),
                m("input", {title: "forward", type: "checkbox", checked: (seq.direction > 0), onclick: () => {seq.direction = -seq.direction;}}),
            ]),
            m("div", [
                select({value: seq.scaleName, oninput: (e) => {seq.scaleName = e.target.value; seq.refreshScale();}}, Sequencer.scaleNames),
                select({value: seq.scaleRoot, oninput: (e) => {seq.scaleRoot = e.target.value; seq.refreshScale();}}, Sequencer.scaleRoots),
                m("input", {type: "number", value: seq.scaleOctave, min: 0, max: 16, oninput: (e) => {seq.scaleOctave = 0 | e.target.value; seq.refreshScale();}}),
                m("input", {type: "number", value: seq.scaleWidth, min: 2, max: 64, oninput: (e) => {seq.scaleWidth = 0 | e.target.value; seq.refreshScale();}})
            ]),
            m("div.steps", stepComps)
        ]);
    }

    return m("div.seq", {key: seq.id}, content);
};

export default seqComponent;
