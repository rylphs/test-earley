#@preprocessor typescript
@{%
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


    const sub = function(v){
        const map = {teste: ":testeB", testeB: "cirtim"}
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
%}

#main -> formula
#formula -> operand | operand (op operand):+
#op -> [\+\-\*\^] {% first %}
#operand -> fn | range | "(" formula ")"
#fn -> alpha "(" input:? ")" {% function(v) {return {name: v[0], type: "fn", input: v[2]}} %}

frase -> (item " "):+ {%all%}
item -> word | placeholder {%all%}
placeholder -> ":" word {%sub%}
word -> [a-zA-Z]:+ {%all%}

#range -> ":" alpha
