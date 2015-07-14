
var cx = require("classnames");
var m = require("mithril");
var Color = require("color");
var Action = require("../core/Action");
var _ = require("lodash");

let stepColors = _.range(0, 101).map((val) => {
    return Color("#dbff51").alpha(Math.sqrt(val / 100).toFixed(3)).rgbString(); // eslint-disable-line new-cap
});

function stepComponent(ctrl, seq, stepData, step) {
    var key = seq.id + "-" + step;
    var color = stepData.value > 0.05 ? stepColors[Math.min(100, Math.round(stepData.value * 100))] : null;
    var props = {
        key: key,
        ondragover: (e) => {
            if (e.dataTransfer.getData("seq")) {
                e.preventDefault();
            }
        },
        ondrop: (e) => {
            var d;
            if ((d = e.dataTransfer.getData("seq"))) {
                var from = JSON.parse(d);
                var action = new Action(from.seqId, from.step, seq.id, step);
                ctrl.addAction(action);
            }
        },
        className: cx({
            current: (step == seq.position),
            div: (step % 4 == 0),
            rx: !!ctrl.stepActionMap.rx[key],
            tx: !!ctrl.stepActionMap.tx[key],
        }),
        oncontextmenu: () => false,
        onmousedown: (e) => {
            if(e.currentTarget != e.target) return;
            if(e.button == 2) {
                stepData.value = (stepData.value > 0.05 ? 0 : 1);
                e.preventDefault();
                stepData.manip = false;
                return;
            }
            stepData.manip = true;
            e.target.onmousemove(e);
        },
        onmouseup: () => {
            stepData.manip = false;
        },
        onmouseleave: () => {
            stepData.manip = false;
        },
        onmousemove: (e) => {
            if(stepData.manip) stepData.value = e.offsetX / e.target.offsetWidth;
        }
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
};

export default stepComponent;
