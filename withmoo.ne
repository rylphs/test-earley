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
        dynfml: {match: /\%[\w]+[ \t]*\(/, push: "main"},
        rng: {match: /(?:[a-zA-Z]+[0-9]+(?:\:[a-zA-Z]+[0-9]+)?|[a-zA-Z]+\:[a-zA-Z]+|[0-9]+\:[0-9]+)/},
        dynrng: {match: /\%(?:cell|row|col)[0-9]*/ push:}
        nb: {match: /[0-9]*\,?[0-9]+/},
        pspl: {match: /;/},
        spc: {match: /[\t ]+/}
    },
    dynrng:{
        shftleft{match: /\</ push: dynrng},
        shftright{match: /\>/ push: dynrng},
        addright:{match: /\+/},
        addleft:{match: /\-/},
    },
    rng:{
        _rng: {match: /\]/, pop: true}
    },
    str:{
        cnst: {match: /[^"]+/, lineBreaks: true},
        _str: {match: '"', pop: true}
    }
})


%}

@lexer st

exp -> _ member _ (%op _ member):* {%flatten%}
member -> %nb  {%id%} | %rng {%id%} | "(" _ exp _ ")" {%notNull%} | fn _ exp nxtArg:* ")" {%formatFn%}
fn -> %fml {%id%} | %dynfml {%id%}
nxtArg -> _ ";" _ exp {%n(3)%}

_ -> %spc:? {%ignore%}