const nearley = require("nearley");
const grammar = require("./withmoo.js");

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));


//parser.feed("=:fn(");
parser.feed('5+6"+5*6"+3');
console.log(parser.results);