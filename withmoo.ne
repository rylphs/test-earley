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


%}

@lexer st

exp -> _ member _ (op _ member _ ):*  {%ungroup%}
member -> nb {%id%}  | parentesis {%id%} | dynxp | fmlxp | rngxp
dynxp -> "%" rngxp | "%" fmlxp
parentesis -> "(" _ exp _ ")"
rngxp -> rng | dynrngxp
dynrngxp -> dynrng (rngop rngcount rngtp):*
fmlxp -> fml args _ ")" | dynfml args _ ")"
args -> exp (_ ";" _ exp):* 

op -> %op {%id%}
nb -> %nb {%id%}
rng -> %rng
dynrng -> %dynrng
rngop -> %rngop
rngcount -> %rngcount
rngtp -> %rngtp
#_dynrng -> %_dynrng
fml -> %fml
dynfml -> %dynfml
_ -> %spc:? {%id%}