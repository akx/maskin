var _ = require("lodash");
var gobble = require("./gobbledygook");

class Route {
    constructor() {
        this.id = gobble(16);
        this.active = true;
        this.synthId = null;
        this.destName = null;
        this.minValue = 0;
        this.maxValue = 1;
    }

    run(maps, data) {
        if(!this.active) return;
        var synth = maps.synths[this.synthId];
        if(!synth) return;
        data = _.extend({}, data, {
            original: data.value,
            value: this.minValue + data.value * (this.maxValue - this.minValue)
        });
        data.value = parseFloat(data.value);
        if(_.isNaN(data.value)) data.value = null;
        synth.trigger(this.destName, data);
    }
}

export default Route;
