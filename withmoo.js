// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }

const moo = require("moo");

const lexer = moo.compile({
    op: /\+\*\-\/\^/,
    opar: /\(/,
    epar: /\)/,
    rng: /:[^;:)(]+:/,
    str: /"[^"]*"/,
    ws:  /[ \t]+/,
    prm: /\$[0-9]+/,
    fn: /:[a-zA-Z0-9]+\(/,
    w: /[a-z]/,
    literals: /[=&#]/
});

const flatten = function(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []).filter(notNull);
}

const notNull = (item) => !!item;

const formatFn = (arr)=>{
    arr[0].args = flatten(arr.slice(1,-1)); 
    arr[0].value = arr[0].text = arr[0].value.replace(/ *\($/, '');
    return arr[0];
}

const n = function(n) { return (arr) => arr[n] };

const ignore = (arr) => {};

const st = moo.states({
    main: {
        op: {match: /[\+\*\-\^\/]/},
        str_: {match: '"', push: "str"},
        
        var: {match: /\$\{[0-9]+\}/},
        rng_: {match: /\[/, push: "rng"},
        lp: {match: /\(/, push: "main"},
        rp: {match: /\)/, pop: true},
        fml: {match: /[\w]+[ \t]*\(/, push: "main"},
        fmlp: {match: /\%[\w]+[ \t]*\(/, push: "main"},
        rng: {match: /(?:[a-zA-Z]+[0-9]+(?:\:[a-zA-Z]+[0-9]+)?|[a-zA-Z]+\:[a-zA-Z]+|[0-9]+\:[0-9]+)/},
        nb: {match: /[0-9]*\,?[0-9]+/},
        pspl: {match: /;/},
        spc: {match: /[\t ]+/}
    },
    
    rng:{
        _rng: {match: /\]/, pop: true}
    },
    str:{
        cnst: {match: /[^"]+/, lineBreaks: true},
        _str: {match: '"', pop: true}
    }
})


var grammar = {
    Lexer: st,
    ParserRules: [
    {"name": "exp$ebnf$1", "symbols": []},
    {"name": "exp$ebnf$1$subexpression$1", "symbols": [(st.has("op") ? {type: "op"} : op), "_", "member"]},
    {"name": "exp$ebnf$1", "symbols": ["exp$ebnf$1", "exp$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "exp", "symbols": ["_", "member", "_", "exp$ebnf$1"], "postprocess": flatten},
    {"name": "member", "symbols": [(st.has("nb") ? {type: "nb"} : nb)], "postprocess": id},
    {"name": "member", "symbols": [(st.has("rng") ? {type: "rng"} : rng)], "postprocess": id},
    {"name": "member", "symbols": [{"literal":"("}, "_", "exp", "_", {"literal":")"}], "postprocess": notNull},
    {"name": "member$ebnf$1", "symbols": []},
    {"name": "member$ebnf$1", "symbols": ["member$ebnf$1", "nxtArg"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "member", "symbols": ["fn", "_", "exp", "member$ebnf$1", {"literal":")"}], "postprocess": formatFn},
    {"name": "fn", "symbols": [(st.has("fml") ? {type: "fml"} : fml)], "postprocess": id},
    {"name": "fn", "symbols": [(st.has("fmlp") ? {type: "fmlp"} : fmlp)], "postprocess": id},
    {"name": "nxtArg", "symbols": ["_", {"literal":";"}, "_", "exp"], "postprocess": n(3)},
    {"name": "_$ebnf$1", "symbols": [(st.has("spc") ? {type: "spc"} : spc)], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": ignore}
]
  , ParserStart: "exp"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
