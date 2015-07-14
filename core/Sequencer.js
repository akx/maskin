var gobble = require("./gobbledygook");
var ScaleMaker = require("scale-maker");
var consts = require("./consts");

class Sequencer {
    constructor(nSteps=16) {
        this.id = gobble(16);
        this.ui = true;
        this.name = gobble(8);
        this.run = true;
        this.speed = 1;
        this._move = 0;
        this._trigger = false;
        this.position = 0;
        this.direction = +1;
        this.stride = 1;
        this.wrap = "wrap";
        this.mode = "walk";
        this.view = "linear";
        this.routes = [];
        this.scaleName = "major";
        this.scaleRoot = "C";
        this.scaleOctave = 4;
        this.scaleWidth = 9;
        this.scale = null;

        this.nSteps = nSteps;
        this.steps = null;
        this.initializeSteps();
        this.refreshScale();
    }

    initializeSteps() {
        if(!this.steps) this.steps = [];
        while(this.steps.length > this.nSteps) {
            this.steps.pop();
        }
        while(this.steps.length < this.nSteps) {
            this.steps.push({value: 0});
        }
    }

    setNSteps(nSteps) {
        if(nSteps < 1) nSteps = 1;
        this.nSteps = nSteps;
        this.initializeSteps();
    }

    refreshScale() {
        this.scale = ScaleMaker.makeScale(this.scaleName, this.scaleRoot + this.scaleOctave, this.scaleWidth);
    }

    tick(maps) {
        if(!this.run) return;
        var curStep = this.steps[this.position];
        if(this._trigger && curStep && curStep.value) {
            this._trigger = false;
            var scaleHz = this.scale.inHertz;
            var value = curStep.value;
            var noteHz = scaleHz[(0 | Math.round(value * scaleHz.length)) % scaleHz.length];
            _.invoke(this.routes, "run", maps, {value: value, noteHz: noteHz});
        }
        this._move ++;
        if(this._move < this.speed) return;
        this._move = 0;
        var lastPosition = this.position;
        var newPosition = lastPosition;
        switch(this.mode) {
            case "random":
                newPosition = 0 | (Math.random() * this.steps.length);
                break;
            default:
                newPosition += this.direction * this.stride;
                break;
        }
        this._trigger = (newPosition != lastPosition);
        this.position = newPosition;


        if(this.position < 0 || this.position >= this.steps.length) this.handleWrap();
    }

    handleWrap() {
        var underflow = (this.position < 0);
        var overflow = (this.position >= this.steps.length);
        switch(this.wrap) {
            case "bounce":
                if(overflow) {
                    this.direction = -1;
                    this.position = this.steps.length - 1;
                } else {
                    this.direction = +1;
                    this.position = 0;
                }
                break;
            default:
                if(underflow) this.position += this.steps.length;
                if(overflow) this.position -= this.steps.length;
        }
    }

    reset() {
        this._move = 0;
        this.position = 0;
        this.direction = +1;
    }

    randomize() {
        this.steps.forEach((step) => {step.value = Math.random();});
    }

    clear() {
        this.steps.forEach((s) => {s.value = 0;});
    }

    shift(times=1, left=false) {
        var steps = this.steps;
        for(var i = 0; i < times; i++) {
            if(left) {
                steps.push(steps.shift());
            } else {
                steps.unshift(steps.pop());
            }
        }
    }
}

export default Sequencer;
