var m = require("mithril");

var {select} = require("./uitools");

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
            m("label", [
                "attack", m("input", {
                    type: "number",
                    value: synth.synth.envelope.attack,
                    oninput: (e) => {
                        synth.synth.envelope.attack = e.target.valueAsNumber;
                    },
                })
            ]),
            m("label", [
                "release", m("input", {
                    type: "number",
                    value: synth.synth.envelope.release,
                    oninput: (e) => {
                        synth.synth.envelope.release = e.target.valueAsNumber;
                    },
                })
            ]),
        ])

    ]);
}

export default synthComponent;
