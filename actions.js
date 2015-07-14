export function reset(ns) {
    ns.toSeq.reset();
};

export function stepOn(ns) {
    ns.toStep.value = 1;
}

export function stepOff(ns) {
    ns.toStep.value = 0;
}

export function stepToggle(ns) {
    ns.toStep.value = 1 - ns.toStep.value;
}

export function stepRandom(ns) {
    ns.toStep.value = Math.random();
}

export function directionForward(ns) {
    ns.toSeq.direction = +1;
}

export function directionBackward(ns) {
    ns.toSeq.direction = -1;
}

export function directionToggle(ns) {
    ns.toSeq.direction *= -1;
}

export function wrapWrap(ns) {
    ns.toSeq.wrap = "wrap";
}

export function wrapBounce(ns) {
    ns.toSeq.wrap = "bounce";
}

export function posRandom(ns) {
    ns.toSeq.position = 0 | (Math.random() * ns.toSeq.nSteps);
}
