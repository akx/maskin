var _ = require("lodash");
var gobble = require("./gobbledygook");
var Tone = require("Tone");

class Synth {
    constructor() {
        this.id = gobble(16);
        this.name = gobble(8);
        this.active = true;
        this.dests = [
            "note",
            "volume",
            "cutoffMin",
            "cutoffMax",
            "resonance"
        ];
        this.synth = new Tone.MonoSynth();
        this.synth.toMaster();
        this.trigger("cutoffMin", {value: 50000});
        this.trigger("cutoffMax", {value: 50000});
    }

    trigger(dest, data) {
        if(!this.active) return;
        switch(dest) {
            case "note":
                if(data.value > 0.05) {
                    this.synth.triggerAttackRelease(data.noteHz, 0.1);
                }
                break;
            case "cutoffMin":
                if(data.value !== null) this.synth.filterEnvelope.min = data.value;
                break;
            case "cutoffMax":
                if(data.value !== null) this.synth.filterEnvelope.max = data.value;
                break;
            case "resonance":
                if(data.value !== null) this.synth.filter.Q.value = data.value;
                break;
        }
    }
}

export default Synth;
