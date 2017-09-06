const nearley = require("nearley");
const grammar = require("./parse-formula.js");


function replaceAt(str, st, end, value){
    return str.substring(0, end) + 
        value + str.substring(end+1);
}

function getFml(name){
    var fmls = {
        teste: "teste2(%0;3)+teste3(1)",
        teste2: "teste4(%0) + %1",
        teste4: "sum(%0;%0)",
        teste3: "count(%0)"
    };

    fmls.teste = "sum(%0)"
    return fmls[name];
}

function parse(str){
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(str);
    var parsed = "";
    var results = parser.results[0];

    for(var i in results){
        var token = results[i];
        var st = token.offset;
        var end = !!results[Number(i)+1] ? results[Number(i)+1].offset : str.length;
        var token = results[i]; 
        console.log(parsed, token, st, end, str.substring(st, end));
        console.log("====" + "\n")
        if(token.type === 'dynfml'){
            grammar.args = grammar.args || [];
            grammar.args.push(token.args);
            var fml = parse(getFml(token.value)); //TODO: get from somwhere
            grammar.args.pop();
            parsed += fml;
        }
        else parsed += str.substring(st, end);
        
    }

    return parsed;
}


console.log(parse("%teste(f(5))"));