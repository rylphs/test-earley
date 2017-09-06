// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }

const moo = require("moo");

const second = ([,item]) => item;

const parseFml = (arr)=>{
    arr[1].args = arr.slice(2,-1); 
    arr[1].end = arr[arr.length-1].offset   ;
    return arr[1];
    return flatten(arr).slice(1,-1);
}

const parseRng = (arr)=> {
    arr[1].args = arr[2].map((arg)=> (
        {op:arg[0], count: arg[1], tp: arg[2]}
    ));
    return arr[1];
};

const parseParentesis = (arr)=> {
    var args = arr.slice(1, -1)[0];
    arr[0].args = args;
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

const flatten = (arr) => {
    return arr.reduce((flat, item) =>{
        if(item instanceof Array)
            flat.push.apply(flat, flatten(item));
        else if(!!item) flat.push(item);
        return flat;
    },[]);
}

const ignore = (arr) => null;
const getParam = (arr) => {
    return grammar.args[grammar.args.length-1][arr[0].value];
}

const ignoreFml = (arr) => flatten(arr).slice(1,-1);
const content = (arr) => arr.slice(1,-2)[0]; 

const value = (arr) => {
    arr[0].end = arr[0].offset + (arr[0].value.length - 1);
    return arr[0];
}

const join = (arr) => arr.join("");


const lexer = moo.states({
    main: {
        cnst: {match: /\"[^\"]*\"/},
        op: {match: /[\+\*\-\^\/]/},
        var: {match: /\$\{[0-9]+\}/},
        lp: {match: /\(/},
        rp: {match: /\)/, pop: true},
        fml: {match: /[a-zA-Z0-9]+[ \t]*\(/, push: "main", value: name => name.replace(/\($/, '')},
        param: {match: /\%(?:0|[1-9][0-9]*)/, 
            value: (n) => n.substring(1)},
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
    }
})


var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main", "symbols": ["exp"], "postprocess": id},
    {"name": "exp$ebnf$1", "symbols": []},
    {"name": "exp$ebnf$1$subexpression$1", "symbols": ["op", "member"]},
    {"name": "exp$ebnf$1", "symbols": ["exp$ebnf$1", "exp$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "exp", "symbols": ["member", "exp$ebnf$1"], "postprocess": flatten},
    {"name": "member", "symbols": ["cnst"], "postprocess": value},
    {"name": "member", "symbols": ["nb"], "postprocess": value},
    {"name": "member", "symbols": [{"literal":"("}, "exp", {"literal":")"}], "postprocess": second},
    {"name": "member$ebnf$1", "symbols": []},
    {"name": "member$ebnf$1$subexpression$1", "symbols": ["pspl", "exp"]},
    {"name": "member$ebnf$1", "symbols": ["member$ebnf$1", "member$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "member", "symbols": ["fml", "exp", "member$ebnf$1", {"literal":")"}]},
    {"name": "member", "symbols": ["rng"], "postprocess": id},
    {"name": "member$ebnf$2", "symbols": []},
    {"name": "member$ebnf$2$subexpression$1", "symbols": ["pspl", "exp"]},
    {"name": "member$ebnf$2", "symbols": ["member$ebnf$2", "member$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "member", "symbols": [{"literal":"%"}, "dynfml", "exp", "member$ebnf$2", {"literal":")"}], "postprocess": parseFml},
    {"name": "member$ebnf$3", "symbols": []},
    {"name": "member$ebnf$3$subexpression$1", "symbols": ["rngop", "rngcount", "rngtp"]},
    {"name": "member$ebnf$3", "symbols": ["member$ebnf$3", "member$ebnf$3$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "member", "symbols": [{"literal":"%"}, "dynrng", "member$ebnf$3"], "postprocess": parseRng},
    {"name": "member", "symbols": [(lexer.has("param") ? {type: "param"} : param)], "postprocess": getParam},
    {"name": "op", "symbols": [(lexer.has("op") ? {type: "op"} : op)], "postprocess": value},
    {"name": "nb", "symbols": [(lexer.has("nb") ? {type: "nb"} : nb)], "postprocess": id},
    {"name": "cnst", "symbols": [(lexer.has("cnst") ? {type: "cnst"} : cnst)], "postprocess": id},
    {"name": "rng", "symbols": [(lexer.has("rng") ? {type: "rng"} : rng)], "postprocess": id},
    {"name": "pspl", "symbols": [(lexer.has("pspl") ? {type: "pspl"} : pspl)], "postprocess": ignore},
    {"name": "dynrng", "symbols": [(lexer.has("dynrng") ? {type: "dynrng"} : dynrng)], "postprocess": id},
    {"name": "rngop", "symbols": [(lexer.has("rngop") ? {type: "rngop"} : rngop)], "postprocess": id},
    {"name": "rngcount", "symbols": [(lexer.has("rngcount") ? {type: "rngcount"} : rngcount)], "postprocess": id},
    {"name": "rngtp", "symbols": [(lexer.has("rngtp") ? {type: "rngtp"} : rngtp)], "postprocess": id},
    {"name": "fml", "symbols": [(lexer.has("fml") ? {type: "fml"} : fml)], "postprocess": id},
    {"name": "dynfml", "symbols": [(lexer.has("dynfml") ? {type: "dynfml"} : dynfml)], "postprocess": id},
    {"name": "param", "symbols": [(lexer.has("param") ? {type: "param"} : param)], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [(lexer.has("spc") ? {type: "spc"} : spc)], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": id}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
