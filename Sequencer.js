var _ = require("lodash");
var gobble = require("./gobbledygook");
var ScaleMaker = require('scale-maker');

class Sequencer {
    constructor(nSteps=16) {
        this.id = (Math.random() * 70000000).toString(36);
        this.name = gobble(8);
        this.run = true;
        this.speed = 1;
        this._move = 0;
        this._trigger = false;
        this.position = 0;
        this.direction = +1;
        this.stride = 1;
        this.wrap = "wrap";
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

    tick() {
        if(!this.run) return;
        var curStep = this.steps[this.position];
        if(this._trigger && curStep && curStep.value) {
            this._trigger = false;
            this.routes.map((route) => {
                if(route.triggerAttackRelease) {
                    var scaleHz = this.scale.inHertz;
                    var noteHz = scaleHz[(0 | Math.round(curStep.value * scaleHz.length)) % scaleHz.length];
                    route.triggerAttackRelease(noteHz, 0.1);
                }
            });
        }
        this._move ++;
        if(this._move < this.speed) return;
        this._move = 0;
        this.position += this.direction * this.stride;
        this._trigger = true;


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


}

Sequencer.scaleNames = ScaleMaker.getScaleNames();
Sequencer.scaleRoots = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
Sequencer.wrapTypes = ["wrap", "bounce"];

export default Sequencer;
