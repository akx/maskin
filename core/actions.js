var _ = require("lodash");
var consts = require("./consts");
var actions = {};

function action(name, fn) {
    actions[name] = fn;
}

action("reset", function(ns) {
    ns.toSeq.reset();
});

action("step on", function(ns) {
    ns.toStep.value = 1;
});

action("step off", function(ns) {
    ns.toStep.value = 0;
});

action("step toggle", function(ns) {
    ns.toStep.value = 1 - ns.toStep.value;
});

action("step random", function(ns) {
    ns.toStep.value = Math.random();
});

action("direction forward", function(ns) {
    ns.toSeq.direction = +1;
});

action("direction backward", function(ns) {
    ns.toSeq.direction = -1;
});

action("direction toggle", function(ns) {
    ns.toSeq.direction *= -1;
});

action("pos random", function(ns) {
    ns.toSeq.position = 0 | (Math.random() * ns.toSeq.nSteps);
});

action("seq random", function(ns) {
    ns.toSeq.randomize();
});

action("seq clear", function(ns) {
    ns.toSeq.clear();
});

action("seq shift", function(ns) {
    ns.toSeq.shift();
});


function makeChoiceActions(prefix, attr, choices) {
    choices.forEach((value) => {
        action(prefix + " " + value, (ns) => { ns.toSeq[attr] = value; });
    });
    action(prefix + " ???", (ns) => { ns.toSeq[attr] = _.sample(choices); });
}

makeChoiceActions("wrap", "wrap", consts.seqWrapTypes);
makeChoiceActions("mode", "mode", consts.seqModes);

export default actions;
