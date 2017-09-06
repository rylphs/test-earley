@{%
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


%}

@lexer lexer

exp -> member (op member):* {%ungroup(1)%}
member -> nb {%id%} | fmlxp {%id%} | parentesis {%id%} | 
    dynxp {%id%}| rngxp {%id%} |
    str_ cnst _str {%second%} | param
dynxp -> "%" rngxp {%second%}| "%" fmlxp {%second%}
parentesis -> "(" _ exp _ ")"
rngxp -> rng {%id%} | dynrngxp {%id%}
dynrngxp -> dynrng (rngop rngcount rngtp):* {%ungroup(1)%}
fmlxp -> fml exp (%pspl exp):* ")" {%parseFml%} | 
    dynfml exp (%pspl exp):* ")" {%parseFml%}

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