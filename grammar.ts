// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }

   /* const map = {
        teste: "sum(a1b1)/$teste2(5)",
        teste2: "count(3*4) + $0"
    }
    const first = function(v){ return (v instanceof Array) ? v[0] : v};
    const reduceFirst = function(v){ return [v[0]].concat(v[1].map(first)) }
    const second = function(v){ return v[1]};
    const reduceSecond = function(v){ return v.reduce(second) }*/
    const all = function(v){ 
        if(!(v instanceof Array)) return v;

        return v.map(function(x){
            if(x instanceof Array) return x.map(all).join("");
            return x;
        }).join("");
    };

    class Teste{}

    const sub = function(v){
        const map = {teste: ":teste2", teste2: "cirtim"}
        return map[v[1]];
    }
   /* const flat = function(v) {
        return [v[0]].concat(v[1].reduce((p, c)=>{
            return p.concat(c);
        },[]));
    };
    const extractFn = function(v, location){
        //return {name: v[0], type: "fn", input: v[2]}}
    };*/
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "frase$ebnf$1$subexpression$1", "symbols": ["item", {"literal":" "}]},
    {"name": "frase$ebnf$1", "symbols": ["frase$ebnf$1$subexpression$1"]},
    {"name": "frase$ebnf$1$subexpression$2", "symbols": ["item", {"literal":" "}]},
    {"name": "frase$ebnf$1", "symbols": ["frase$ebnf$1", "frase$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "frase", "symbols": ["frase$ebnf$1"], "postprocess": all},
    {"name": "item", "symbols": ["word"]},
    {"name": "item", "symbols": ["placeholder"], "postprocess": all},
    {"name": "placeholder", "symbols": [{"literal":":"}, "word"], "postprocess": sub},
    {"name": "word$ebnf$1", "symbols": [/[a-zA-Z]/]},
    {"name": "word$ebnf$1", "symbols": ["word$ebnf$1", /[a-zA-Z]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "word", "symbols": ["word$ebnf$1"], "postprocess": all}
]
  , ParserStart: "frase"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
