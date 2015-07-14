require("style!css!./maskin.css");
var m = require("mithril");
var _ = require("lodash");
var cx = require("classnames");
var Action = require("./Action");
var Sequencer = require("./Sequencer");
var Color = require("color");
var stepColors = _.range(0, 101).map((val) => Color("#dbff51").alpha(Math.sqrt(val / 100).toFixed(3)).rgbString());

function select(props, choices) {
    if(!_.isArray(choices)) choices = _.pairs(choices);
    return m("select", props, choices.map((pair) => {
        if(_.isString(pair)) pair = [pair, pair];
        return m("option", {value: pair[0]}, pair[1] || pair[0]);
    }));
}

function stepComponent(ctrl, seq, stepData, step) {
    var key = seq.id + "-" + step;
    var color = stepData.value > 0.05 ? stepColors[Math.min(100, Math.round(stepData.value * 100))] : null;
    var props = {
        key: key,
        ondragover: (e) => {
            if (e.dataTransfer.getData("seq")) e.preventDefault();
        },
        ondrop: (e) => {
            var d;
            if (d = e.dataTransfer.getData("seq")) {
                var from = JSON.parse(d);
                var action = new Action(from.seqId, from.step, seq.id, step);
                ctrl.addAction(action);
            }
        },
        className: cx({
            current: step == seq.position,
            div: step % 4 == 0,
            rx: !!ctrl.stepActionMap.rx[key],
            tx: !!ctrl.stepActionMap.tx[key],
        }),
        //onclick: (e) => {stepData.value = (stepData.value > 0.05 ? 0 : 1);},
        onmousedown: (e) => {e.target.manip = true;},
        onmouseup: (e) => {e.target.manip = false;},
        onmouseleave: (e) => {e.target.manip = false;},
        onmousemove: (e) => {if(e.target.manip) stepData.value = e.offsetX / e.target.offsetWidth;}
    };
    if(color) {
        props.style = "background:" + color;
    }
    return m("div.step", props, [
        m("div.handle", {
            title: "link handle (drag to another step)",
            draggable: true,
            ondragstart: (e) => {
                e.dataTransfer.setData("seq", JSON.stringify({seqId: seq.id, step: step}));
            },
        }),
        //m("input", {
        //    type: "range",
        //    min: 0,
        //    max: 1000,
        //    value: Math.round(stepData.value * 1000)
        //})
    ]);
}

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

    return m("div.seq", [
        m("div", [
            m("button", {onclick: (e) => {seq.reset();}}, "reset"),
            m("button", {onclick: (e) => {seq.randomize();}}, "rand"),
            m("button", {onclick: (e) => {seq.clear();}}, "clr"),
        ]),
        m("div", [
            m("div", [seq.name, " -- ", (seq.position + 1), "/", seq.nSteps].join("")),
            m("input", {title: "steps", type: "number", value: seq.nSteps, min: 1, max: 1024, oninput: (e) => {seq.setNSteps(e.target.value);}}),
            m("input", {title: "speed divisor", type: "number", value: seq.speed, min: 1, max: 16, oninput: (e) => {seq.speed = e.target.value;}}),
            m("input", {title: "stride", type: "number", value: seq.stride, min: 0, max: 16, oninput: (e) => {seq.stride = e.target.value;}}),
            select({title: "wrap type", value: seq.wrap, oninput: (e) => {seq.wrap = e.target.value;}}, Sequencer.wrapTypes),
            select({title: "view type", value: seq.view, oninput: (e) => {seq.view = e.target.value;}}, ["linear", "rect"]),
            m("input", {title: "forward", type: "checkbox", checked: (seq.direction > 0), onclick: (e) => {seq.direction = -seq.direction;}}),
        ]),
        m("div", [
            select({value: seq.scaleName, oninput: (e) => {seq.scaleName = e.target.value; seq.refreshScale();}}, Sequencer.scaleNames),
            select({value: seq.scaleRoot, oninput: (e) => {seq.scaleRoot = e.target.value; seq.refreshScale();}}, Sequencer.scaleRoots),
            m("input", {type: "number", value: seq.scaleOctave, min: 0, max: 16, oninput: (e) => {seq.scaleOctave = 0 | e.target.value; seq.refreshScale();}}),
            m("input", {type: "number", value: seq.scaleWidth, min: 2, max: 64, oninput: (e) => {seq.scaleWidth = 0 | e.target.value; seq.refreshScale();}})
        ]),
        m("div.steps", stepComps)
    ]);
};


function actionComponent(ctrl, action) {
    var fromSeq = ctrl.seqMap[action.fromSeqId];
    var toSeq = ctrl.seqMap[action.toSeqId];
    return m("div.action", {key: action.id}, [
        m("input", {type: "checkbox", checked: !!action.active, onclick: (e) => {action.active = !action.active;}}),
        m("span", [
            fromSeq.name, "/", action.fromStep, " => ",
            toSeq.name, "/", action.toStep
        ].join("")),
        m("label", [
            m("input", {type: "checkbox", checked: !!action.cond, onclick: (e) => {action.cond = !action.cond;}}),
            "cond"
        ]),
        select({value: action.action, onchange: (e) => {action.action = e.target.value;}}, Action.actions),
        m("button", {onclick: (e) => {ctrl.delAction(action);}}, "del")
    ]);
};


var UI = {
    controller: function () {
        var self = this;
        this.seqs = [];
        this.actions = [];
        this.addAction = (action) => {
            this.actions.push(action);
        };
        this.delAction = (action) => {
            var index = this.actions.indexOf(action);
            if(index > -1) this.actions.splice(index, 1);
        };
    },
    view: function(ctrl) {
        ctrl.seqMap = _.reduce(ctrl.seqs, (map, seq) => {map[seq.id] = seq; return map}, {});
        ctrl.stepActionMap = _.reduce(ctrl.actions, (map, action) => {
            if(action.active) {
                map.rx[action.toSeqId + "-" + action.toStep] = true;
                map.tx[action.fromSeqId + "-" + action.fromStep] = true;
            }
            return map;
        }, {rx: {}, tx: {}});
        return m("div", [
            m("div#seqs", [
                m("div.toolbar", [
                    m("button", {onclick: (e) => {_.invoke(ctrl.seqs, "reset");}}, "reset all"),
                    m("button", {onclick: (e) => {ctrl.seqs.push(new Sequencer(16));}}, "new seq"),
                ]),
                m("div#seqlist", ctrl.seqs.map(_.partial(seqComponent, ctrl)))
            ]),
            m("div#actions", ctrl.actions.map(_.partial(actionComponent, ctrl))),
        ]);
    }
};

export default UI;
