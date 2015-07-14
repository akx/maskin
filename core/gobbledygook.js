var _ = require("lodash");

var cons = "zxcbnmsdfghjklqwrtp";
var vow = "aeiou";

function generate(length=16) {
    var s = "";
    while(s.length < length) {
        s += _.sample([cons, vow][s.length % 2]);
    }
    return s;
}

export default generate;
