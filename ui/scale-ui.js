var m = require("mithril");
var {select} = require("./uitools");
var consts = require("../core/consts");

function scaleUi(ctrl, seq) {
    return m("span", [
        select({value: seq.scaleName, oninput: (e) => {seq.scaleName = e.target.value; seq.refreshScale();}}, consts.scaleNames),
        select({value: seq.scaleRoot, oninput: (e) => {seq.scaleRoot = e.target.value; seq.refreshScale();}}, consts.scaleRoots),
        m("input", {type: "number", value: seq.scaleOctave, min: -5, max: 16, oninput: (e) => {seq.scaleOctave = 0 | e.target.value; seq.refreshScale();}}),
        m("input", {type: "number", value: seq.scaleWidth, min: 2, max: 64, oninput: (e) => {seq.scaleWidth = 0 | e.target.value; seq.refreshScale();}})
    ]);
}

export default scaleUi;
