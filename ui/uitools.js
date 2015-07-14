var m = require("mithril");
var _ = require("lodash");

export function select(props, choices) {
    if(!_.isArray(choices)) choices = _.pairs(choices);
    return m("select", props, choices.map((pair) => {
        if(_.isString(pair)) pair = [pair, pair];
        return m("option", {key: pair[0], value: pair[0]}, pair[1] || pair[0]);
    }));
};
