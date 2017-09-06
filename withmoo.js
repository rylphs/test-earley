// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }

const moo = require("moo");

const second = ([,item]) => item;

const parseFml = (arr)=>{
    var args = arr.slice(1, -1);
    arr[0].args = args[0].concat(args[1].reduce((flat, item)=> {
        flat.push.apply(flat, item.map((i) => (i instanceof Array ? i[0] : i)))
        return flat;
    }, [])); 
    return arr[0];
}

const ungroup = (n) => (arr) => {
    return arr.slice(0,n).concat(
        arr[n].reduce((flat, item) => {
            flat.push.apply(flat, item);
            return flat;
        }, [])
    );
}

const lexer = moo.states({
    main: {
        op: {match: /[\+\*\-\^\/]/},
        str_: {match: '"', push: "str"},
        var: {match: /\$\{[0-9]+\}/},
        lp: {match: /\(/},
        rp: {match: /\)/, pop: true},
        fml: {match: /[a-zA-Z0-9]+[ \t]*\(/, push: "main", value: name => name.replace(/\($/, '')},
        param: {match: /\%(?:0|[1-9][0-9]*)/, value: n => Number(n.substring(1))},
        dyn: {match: /\%/, push: "dyn"},
        rng: {match: /(?:[a-zA-Z]+[0-9]+(?:\:[a-zA-Z]+[0-9]+)?|[a-zA-Z]+\:[a-zA-Z]+|[0-9]+\:[0-9]+)/},
        nb: {match: /[0-9]*\,?[0-9]+/},
        pspl: {match: /;/},
        spc: {match: /[\t ]+/}
        
    },
    dyn: {
        dynfml: {match: /[\w]+[ \t]*\(/, next: "main", value: name => name.replace(/\($/, '')},
        dynrng: {match: /(?:cell|row|col)/, next:"rngsel"},
    },
    rngsel:{
        rngop: {match: /[\>\<\+\-]/},
        rngcount: {match: /[0-9]+/, value: n => Number(n)},
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
    Lexer: lexer,
    ParserRules: [
    {"name": "exp$ebnf$1", "symbols": []},
    {"name": "exp$ebnf$1$subexpression$1", "symbols": ["op", "member"]},
    {"name": "exp$ebnf$1", "symbols": ["exp$ebnf$1", "exp$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "exp", "symbols": ["member", "exp$ebnf$1"], "postprocess": ungroup(1)},
    {"name": "member", "symbols": ["nb"], "postprocess": id},
    {"name": "member", "symbols": ["fmlxp"], "postprocess": id},
    {"name": "member", "symbols": ["parentesis"], "postprocess": id},
    {"name": "member", "symbols": ["dynxp"], "postprocess": id},
    {"name": "member", "symbols": ["rngxp"], "postprocess": id},
    {"name": "member", "symbols": ["str_", "cnst", "_str"], "postprocess": second},
    {"name": "member", "symbols": ["param"]},
    {"name": "dynxp", "symbols": [{"literal":"%"}, "rngxp"], "postprocess": second},
    {"name": "dynxp", "symbols": [{"literal":"%"}, "fmlxp"], "postprocess": second},
    {"name": "parentesis", "symbols": [{"literal":"("}, "_", "exp", "_", {"literal":")"}]},
    {"name": "rngxp", "symbols": ["rng"], "postprocess": id},
    {"name": "rngxp", "symbols": ["dynrngxp"], "postprocess": id},
    {"name": "dynrngxp$ebnf$1", "symbols": []},
    {"name": "dynrngxp$ebnf$1$subexpression$1", "symbols": ["rngop", "rngcount", "rngtp"]},
    {"name": "dynrngxp$ebnf$1", "symbols": ["dynrngxp$ebnf$1", "dynrngxp$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "dynrngxp", "symbols": ["dynrng", "dynrngxp$ebnf$1"], "postprocess": ungroup(1)},
    {"name": "fmlxp$ebnf$1", "symbols": []},
    {"name": "fmlxp$ebnf$1$subexpression$1", "symbols": [(lexer.has("pspl") ? {type: "pspl"} : pspl), "exp"]},
    {"name": "fmlxp$ebnf$1", "symbols": ["fmlxp$ebnf$1", "fmlxp$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "fmlxp", "symbols": ["fml", "exp", "fmlxp$ebnf$1", {"literal":")"}], "postprocess": parseFml},
    {"name": "fmlxp$ebnf$2", "symbols": []},
    {"name": "fmlxp$ebnf$2$subexpression$1", "symbols": [(lexer.has("pspl") ? {type: "pspl"} : pspl), "exp"]},
    {"name": "fmlxp$ebnf$2", "symbols": ["fmlxp$ebnf$2", "fmlxp$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "fmlxp", "symbols": ["dynfml", "exp", "fmlxp$ebnf$2", {"literal":")"}], "postprocess": parseFml},
    {"name": "op", "symbols": [(lexer.has("op") ? {type: "op"} : op)], "postprocess": id},
    {"name": "nb", "symbols": [(lexer.has("nb") ? {type: "nb"} : nb)], "postprocess": id},
    {"name": "rng", "symbols": [(lexer.has("rng") ? {type: "rng"} : rng)], "postprocess": id},
    {"name": "dynrng", "symbols": [(lexer.has("dynrng") ? {type: "dynrng"} : dynrng)], "postprocess": id},
    {"name": "rngop", "symbols": [(lexer.has("rngop") ? {type: "rngop"} : rngop)], "postprocess": id},
    {"name": "rngcount", "symbols": [(lexer.has("rngcount") ? {type: "rngcount"} : rngcount)], "postprocess": id},
    {"name": "rngtp", "symbols": [(lexer.has("rngtp") ? {type: "rngtp"} : rngtp)], "postprocess": id},
    {"name": "fml", "symbols": [(lexer.has("fml") ? {type: "fml"} : fml)], "postprocess": id},
    {"name": "dynfml", "symbols": [(lexer.has("dynfml") ? {type: "dynfml"} : dynfml)], "postprocess": id},
    {"name": "_str", "symbols": [(lexer.has("_str") ? {type: "_str"} : _str)], "postprocess": id},
    {"name": "str_", "symbols": [(lexer.has("str_") ? {type: "str_"} : str_)], "postprocess": id},
    {"name": "cnst", "symbols": [(lexer.has("cnst") ? {type: "cnst"} : cnst)], "postprocess": id},
    {"name": "param", "symbols": [(lexer.has("param") ? {type: "param"} : param)], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [(lexer.has("spc") ? {type: "spc"} : spc)], "postprocess": id},
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
