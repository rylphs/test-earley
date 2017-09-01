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

const args = (arr) => [arr[0]].concat(arr.splice(1).map((item)=>item[0]))

const ungroup = (arr) => {
    return [arr[1]].concat(
        arr[3].reduce((flat, item) => {
            flat.push(item[0], item[2]);
            return flat;
        }, [])
    );
}

const joinOnFirst = (arr) => {
    arr[0].value = arr[0].text = arr[0].text + flatten(arr.splice(1)).reduce(
        (str, item) => !!item && item.value ? str + item.value : "", ""
    );
    return arr[0];
}

const n = function(n) { return (arr) => arr[n] };

const ignore = (arr) => {};

const st = moo.states({
    main: {
        op: {match: /[\+\*\-\^\/]/},
        str_: {match: '"', push: "str"},
        var: {match: /\$\{[0-9]+\}/},
        lp: {match: /\(/},
        rp: {match: /\)/, pop: true},
        fml: {match: /[a-zA-Z0-9]+[ \t]*\(/, push: "main"},
        dyn: {match: /\%/, push: "dyn"},
        //dynfml: {match: /\%[\w]+[ \t]*\(/, push: "main"},
        //dynrng: {match: /\%(?:cell|row|col)/, push:"rngsel"},
        rng: {match: /(?:[a-zA-Z]+[0-9]+(?:\:[a-zA-Z]+[0-9]+)?|[a-zA-Z]+\:[a-zA-Z]+|[0-9]+\:[0-9]+)/},
        nb: {match: /[0-9]*\,?[0-9]+/},
        pspl: {match: /;/},
        spc: {match: /[\t ]+/}
    },
    dyn: {
        dynfml: {match: /[\w]+[ \t]*\(/, next: "main"},
        dynrng: {match: /(?:cell|row|col)/, next:"rngsel"},
    },
    rngsel:{
        rngop: {match: /[\>\<\+\-]/},
        rngcount: {match: /[0-9]+/},
        rngtp: {match:/(?:rows|cols)/},
        rp: {match: /\)/, pop: true},
        pspl: {match: /;/, pop:true},
        spc: {match: /[\t ]+/, pop:true}
       // _dynrng: {match: /(?:[ \t\;\)])/, pop: true}
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
    {"name": "exp$ebnf$1$subexpression$1", "symbols": ["op", "_", "member", "_"]},
    {"name": "exp$ebnf$1", "symbols": ["exp$ebnf$1", "exp$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "exp", "symbols": ["_", "member", "_", "exp$ebnf$1"], "postprocess": ungroup},
    {"name": "member", "symbols": ["nb"], "postprocess": id},
    {"name": "member", "symbols": ["parentesis"], "postprocess": id},
    {"name": "member", "symbols": ["dynxp"]},
    {"name": "member", "symbols": ["fmlxp"]},
    {"name": "member", "symbols": ["rngxp"]},
    {"name": "dynxp", "symbols": [{"literal":"%"}, "rngxp"]},
    {"name": "dynxp", "symbols": [{"literal":"%"}, "fmlxp"]},
    {"name": "parentesis", "symbols": [{"literal":"("}, "_", "exp", "_", {"literal":")"}]},
    {"name": "rngxp", "symbols": ["rng"]},
    {"name": "rngxp", "symbols": ["dynrngxp"]},
    {"name": "dynrngxp$ebnf$1", "symbols": []},
    {"name": "dynrngxp$ebnf$1$subexpression$1", "symbols": ["rngop", "rngcount", "rngtp"]},
    {"name": "dynrngxp$ebnf$1", "symbols": ["dynrngxp$ebnf$1", "dynrngxp$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "dynrngxp", "symbols": ["dynrng", "dynrngxp$ebnf$1"]},
    {"name": "fmlxp", "symbols": ["fml", "args", "_", {"literal":")"}]},
    {"name": "fmlxp", "symbols": ["dynfml", "args", "_", {"literal":")"}]},
    {"name": "args$ebnf$1", "symbols": []},
    {"name": "args$ebnf$1$subexpression$1", "symbols": ["_", {"literal":";"}, "_", "exp"]},
    {"name": "args$ebnf$1", "symbols": ["args$ebnf$1", "args$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "args", "symbols": ["exp", "args$ebnf$1"]},
    {"name": "op", "symbols": [(st.has("op") ? {type: "op"} : op)], "postprocess": id},
    {"name": "nb", "symbols": [(st.has("nb") ? {type: "nb"} : nb)], "postprocess": id},
    {"name": "rng", "symbols": [(st.has("rng") ? {type: "rng"} : rng)]},
    {"name": "dynrng", "symbols": [(st.has("dynrng") ? {type: "dynrng"} : dynrng)]},
    {"name": "rngop", "symbols": [(st.has("rngop") ? {type: "rngop"} : rngop)]},
    {"name": "rngcount", "symbols": [(st.has("rngcount") ? {type: "rngcount"} : rngcount)]},
    {"name": "rngtp", "symbols": [(st.has("rngtp") ? {type: "rngtp"} : rngtp)]},
    {"name": "fml", "symbols": [(st.has("fml") ? {type: "fml"} : fml)]},
    {"name": "dynfml", "symbols": [(st.has("dynfml") ? {type: "dynfml"} : dynfml)]},
    {"name": "_$ebnf$1", "symbols": [(st.has("spc") ? {type: "spc"} : spc)], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": id}
]
  , ParserStart: "exp"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
