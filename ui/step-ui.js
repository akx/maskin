var cx = require("classnames");
var m = require("mithril");
var Action = require("../core/Action");
var _ = require("lodash");

let stepBackgrounds = _.range(0, 101).map((val) => {
    val = 100 - val;
    var val1 = val + 1;
    return "linear-gradient(transparent " + val + "%, #dbff51 " + val1 + "%, #dbff51 100%)";
});

function stepComponent(ctrl, seq, stepData, step) {
    var key = seq.id + "-" + step;
    var props = {
        key: key,
        ondragover: (e) => {
            if (e.dataTransfer.types.indexOf("seq") > -1) {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.dropEffect = "move";
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
            tall: (seq.view == "tall"),
            current: (step == seq.position),
            div: (step % 4 == 0),
            rx: !!ctrl.stepActionMap.rx[key],
            tx: !!ctrl.stepActionMap.tx[key],
        }),
        oncontextmenu: () => false,
        onmousedown: (e) => {
            if (e.currentTarget != e.target) return;
            if (e.button == 2) {
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
            if (stepData.manip) {
                if (seq.view == "tall") {
                    stepData.value = 1.0 - (e.offsetY / e.target.offsetHeight);
                }
                else {
                    stepData.value = e.offsetX / e.target.offsetWidth;
                }
            }
        }
    };
    var bg = stepData.value > 0.01 ? stepBackgrounds[Math.min(100, Math.round(stepData.value * 100))] : null;
    if (bg) {
        props.style = "background-image:" + bg;
    }
    return m("div.step", props, [
        m("div.handle", {
            title: "link handle (drag to another step)",
            draggable: true,
            ondragstart: (e) => {
                e.dataTransfer.setData("seq", JSON.stringify({seqId: seq.id, step: step}));
            }
        })
        //m("input", {
        //    type: "range",
        //    min: 0,
        //    max: 1000,
        //    value: Math.round(stepData.value * 1000)
        //})
    ]);
};

export default stepComponent;
