@{%
    const map = {
        teste: "sum(a1b1)/$teste2(5)",
        teste2: "count(3*4) + $0"
    }
    const first = function(v){ return (v instanceof Array) ? v[0] : v};
    const reduceFirst = function(v){ return [v[0]].concat(v[1].map(first)) }
    const second = function(v){ return v[1]};
    const reduceSecond = function(v){ return v.reduce(second) }
    const all = function(v){ return v[0].join("")};
    const flat = function(v) {
        return [v[0]].concat(v[1].reduce((p, c)=>{
            return p.concat(c);
        },[]));
    };
    const extractFn = function(v, location){
        return {name: v[0], type: "fn", input: v[2]}}
    };
%}

#main -> formula
#formula -> operand | operand (op operand):+
#op -> [\+\-\*\^] {% first %}
#operand -> fn | range | "(" formula ")"
#fn -> alpha "(" input:? ")" {% function(v) {return {name: v[0], type: "fn", input: v[2]}} %}

main -> formula {%first%}
formula -> operand multOps:* {%flat%}
multOps -> op operand {%function(v){return [v[0], v[1]]}%}
op -> [\+\-\*\^] {% first %}
operand -> fn {%first%} | "(" formula ")" {%second%}
fn -> alpha "(" input:? ")" {% function(v) {return {name: v[0], type: "fn", input: v[2]}} %}
input -> arg multArgs:* {% reduceFirst %}
multArgs -> ";" arg {%second%}
arg -> alpha {%first%} | fn #{% first %}
alpha -> [0-9A-Za-z]:+ {% all %}

#range -> ":" alpha
