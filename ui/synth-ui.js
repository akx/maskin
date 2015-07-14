var m = require("mithril");

var {select} = require("./uitools");

function labeledNumberInput(label, obj, path) {
    return m("label", [
        label, m("input", {
            step: 0.01,
            type: "number",
            value: _.get(obj, path),
            oninput: (e) => {
                _.set(obj, path, e.target.valueAsNumber);
            }
        })
    ]);
}

function synthComponent(ctrl, synth) {
    return m("div", [
        m("div", [
            synth.name,
            m("button", {
                onclick: (e) => {
                    if (e.ctrlKey) ctrl.delSynth(synth);
                }, title: "hold ctrl for safety"
            }, "del"),
        ]),
        select({
            value: synth.synth.oscillator.type,
            onchange: (e) => {
                synth.synth.oscillator.type = e.target.value;
            }
        }, ["sine", "square", "triangle", "sawtooth", "pulse"]),
        select({
            value: synth.synth.filter.type,
            onchange: (e) => {
                synth.synth.filter.type = e.target.value;
            }
        }, ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "notch", "allpass", "peaking"]),
        m("div", [
            labeledNumberInput("attack", synth, "synth.envelope.attack"),
            labeledNumberInput("release", synth, "synth.envelope.release"),
            labeledNumberInput("filterAttack", synth, "synth.filterEnvelope.attack"),
            labeledNumberInput("filterRelease", synth, "synth.filterEnvelope.release"),
            labeledNumberInput("cutoffMin", synth, "synth.filterEnvelope.min"),
            labeledNumberInput("cutoffMax", synth, "synth.filterEnvelope.max"),
            labeledNumberInput("detune", synth, "synth.detune.value"),
        ])

    ]);
}

export default synthComponent;
