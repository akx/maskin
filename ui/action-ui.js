var m = require("mithril");
var Action = require("../core/Action");
var {select} = require("./uitools");


function actionComponent(ctrl, action) {
    var fromSeq = ctrl.seqMap[action.fromSeqId];
    var toSeq = ctrl.seqMap[action.toSeqId];
    return m("div.action", {key: action.id}, [
        m("div", [
            m("input", {
                type: "checkbox", checked: !!action.active, onclick: () => {
                    action.active = !action.active;
                }
            }),
            m("span", [
                fromSeq.name, "/", action.fromStep, " => ",
                toSeq.name, "/", action.toStep
            ].join("")),
            m("button", {
                onclick: () => {
                    ctrl.delAction(action);
                }
            }, "del")
        ]),
        m("div", [
            m("label", [
                m("input", {
                    type: "checkbox", checked: !!action.cond, onclick: () => {
                        action.cond = !action.cond;
                    }
                }),
                "cond."
            ]),
            m("label", [
                "prob:",
                m("input", {
                    type: "range", min: 0, max: 100, value: action.prob, oninput: (e) => {
                        action.prob = 0 | e.target.value;
                    }
                }),
            ]),
        ]),
        select({
            value: action.action, onchange: (e) => {
                action.action = e.target.value;
            }
        }, Action.actions),
    ]);
}

export default actionComponent;
