@{%
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
  }, []);
}

const second = ([,item]) => item;

const notNull = (item) => !!item;

const parseFml = (arr)=>{
    arr[0].args = (arr.slice(1,-1)); 
    arr[0].value = arr[0].text = arr[0].value.replace(/ *\($/, '');
    return arr[0];
}

const args = (arr) => [arr[0]].concat(arr.splice(1).map((item)=>item[0]))

const ungroup = (n) => (arr) => {
    return arr.slice(0,n).concat(
        arr[n].reduce((flat, item) => {
            flat.push.apply(flat, item);
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
        param: {match: /\%[0-9]+/},
        dyn: {match: /\%/, push: "dyn"},
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


%}

@lexer st

exp -> _ member _ (op _ member _ ):* {%ungroup(3)%}
member -> nb {%id%}  | parentesis {%id%} | dynxp {%id%}| fmlxp {%id%}| rngxp {%id%} | str_ cnst _str {%second%} | param
dynxp -> "%" rngxp | "%" fmlxp {%second%}
parentesis -> "(" _ exp _ ")"
rngxp -> rng {%id%} | dynrngxp {%id%}
dynrngxp -> dynrng (rngop rngcount rngtp):* {%ungroup(1)%}
fmlxp -> fml args _ ")" {%parseFml%} | dynfml args _ ")" {%parseFml%}
args -> exp (_ ";" _ exp):* {%ungroup(1)%}

op -> %op {%id%}
nb -> %nb {%id%}
rng -> %rng {%id%}
dynrng -> %dynrng {%id%}
rngop -> %rngop {%id%}
rngcount -> %rngcount {%id%}
rngtp -> %rngtp {%id%}
#_dynrng -> %_dynrng
fml -> %fml {%id%}
dynfml -> %dynfml {%id%}
_str -> %_str {%id%}
str_ -> %str_ {%id%}
cnst -> %cnst {%id%}
param -> %param {%id%}
_ -> %spc:? {%id%}