var m = require("mithril");

var {select} = require("./uitools");

function synthComponent(ctrl, synth) {
    return m("div", [
        m("div", [
            synth.name,
            m("button", {onclick: (e) => {if(e.ctrlKey) ctrl.delSynth(synth);}, title: "hold ctrl for safety"}, "del"),
        ]),
        select({
            value: synth.synth.oscillator.type,
            onchange: (e) => {synth.synth.oscillator.type = e.target.value;}
        }, ["sine", "square", "triangle", "sawtooth", "pulse"])
    ]);
}

export default synthComponent;
