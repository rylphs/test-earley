@{%
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


%}

@lexer lexer

main -> exp {%id%}
exp -> member (op member):* {%flatten%}
member -> 
    cnst {%value%} |
    nb {%value%} |
    "(" exp ")" {%second%} |
    fml exp (pspl exp):* ")" |
    rng {%id%} |
    "%" dynfml exp (pspl exp):* ")" {%parseFml%} |
    "%" dynrng (rngop rngcount rngtp):* {%parseRng%}|
    %param {%getParam%}

op -> %op {%value%}
nb -> %nb {%id%}
cnst -> %cnst {%id%}
rng -> %rng {%id%}
pspl -> %pspl {%ignore%}
dynrng -> %dynrng {%id%}
rngop -> %rngop {%id%}
rngcount -> %rngcount {%id%}
rngtp -> %rngtp {%id%}
fml -> %fml {%id%}
dynfml -> %dynfml {%id%}
param -> %param {%id%}
_ -> %spc:? {%id%}