var cx = require("classnames");
var m = require("mithril");
var _ = require("lodash");
var {select} = require("./uitools");
var scaleUi = require("./scale-ui");

function minMaxUi(ctrl, seq, route) {
    return m("span", [
        m("input", {type: "number", value: route.minValue, oninput: (e) => {route.minValue = e.target.valueAsNumber;}}),
        m("input", {type: "number", value: route.maxValue, oninput: (e) => {route.maxValue = e.target.valueAsNumber;}}),
    ]);
}

function routeComponent(ctrl, seq, route) {
    var key = seq.id + "-" + route.id;
    var props = {
        key: key,
    };
    var currentDest = (route.synthId ? route.synthId + "/" + route.destName : "");
    var routeDests = ctrl.routeDests;
    if(currentDest === "") {
        routeDests = [["", "--select--"]].concat(routeDests);
    }
    return m("div.route", props, [
        m("input", {type: "checkbox", checked: route.active, onclick: (e) => {
            route.active = !!e.target.checked;
        }}),
        select({value: currentDest, onchange: (e) => {
            var [synthId, destName] = e.target.value.split("/", 2);
            route.synthId = synthId;
            route.destName = destName;
        }}, routeDests),
        (currentDest ? (route.destName == "note" ? scaleUi(ctrl, seq) : minMaxUi(ctrl, seq, route)) : null),
        m("button", {onclick: (e) => {ctrl.delRoute(seq, route);}}, "del")
    ]);
};

export default routeComponent;
