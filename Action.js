var actions = require("./actions");

class Action {
    constructor(fromSeqId, fromStep, toSeqId, toStep) {
        this.id = (Math.random() * 70000000).toString(36);
        this.fromSeqId = fromSeqId;
        this.fromStep = fromStep;
        this.toSeqId = toSeqId;
        this.toStep = toStep;
        this.active = true;
        this.cond = true;
        this.action = "";
    }

    run(seqMap) {
        if(!this.active) return;
        var actionFunc = actions[this.action];
        if(!actionFunc) return;
        var fromSeq = seqMap[this.fromSeqId];
        var toSeq = seqMap[this.toSeqId];
        if(!(fromSeq && toSeq)) return;
        if(fromSeq.position != this.fromStep) return;
        var fromStep = fromSeq.steps[this.fromStep];
        if(this.cond && !fromStep.value) return;
        var toStep = toSeq.steps[this.toStep];
        return actionFunc.call(this, {
            fromSeq: fromSeq,
            fromStep: fromStep,
            toSeq: toSeq,
            toStep: toStep
        });
    }
}


var exportedActionFnNames = _(actions).map((fn, name) => _.isFunction(fn) ? name : null).compact().sort().value();
Action.actions = ["noop"].concat(exportedActionFnNames);

export default Action;
