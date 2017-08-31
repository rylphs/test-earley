main -> fn {%(v)=>v[0]%}
fn -> "$" fnName "(" input ")" {% (v) => ({ type: "fn", name: v[1], args: v[3] }) %}
param -> [0-9A-Za-z]:+ {% (v) => v[0].join("") %} | fn
input -> null | param {% function(v) {return v[0]} %} | param ("," param):* {% function (v){ return [v[0]].concat(v[1].map(function(v){ return v[1]}))}%}
fnName -> [a-zA-Z] [0-9A-Za-z]:+ {% function(d) {return d[0] + d[1].join("") } %}
