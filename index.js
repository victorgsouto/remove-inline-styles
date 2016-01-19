'use strict';

var $ = require('cheerio');
var fs = require("fs");


module.exports = function leArquivo(arquivo) {
    //le o arquivo html
    fs.readFile(arquivo, resultado);
}


// funcao de resultado da leitura do html
function resultado(err, data) {
    if (err) throw err;
    pegaStyle(data.toString());
};

// pega os style do html e gera um objeto
function getInlineStyles(html) {
    if (typeof html !== 'string') {
        throw new TypeError('get-inline-styles expected a string')
    }
    var inlinedStyles = [];
    var removeStyle = $.load(html);
    //each para criar o objeto com os styles para o html e remover o style e atribuir a classe
    removeStyle('*[style]').each(function (i, element) {
        inlinedStyles.push({
            style: ".class" + i + " { " + element.attribs.style + " }"
        });
        $(element).removeAttr("style").html();
        $(element).addClass('class' + i).html();
    });
    criaNovoHtml(removeStyle.html())
    return inlinedStyles;
}

//Cria novo html sem style
function criaNovoHtml(data) {
    fs.writeFile("arquivo-sem-style.html", data, 'utf8', function (err) {
        if (err) return console.log(err);
        console.log("Criado: arquivo-sem-style.html ");
    });
}

//funcao para printa o objeto style do html
function pegaStyle(data) {
    var inlineCss = getInlineStyles(data);
    //cria arquivo css vazio
    fs.writeFile('style.css', '', function (err) {
        if (err) return console.log(err);
        console.log("\n" + "Criado: style.css");
    }); 
    //insere as class no css
    for (var name in inlineCss) {
        fs.appendFileSync("style.css", inlineCss[name].style + "\n");
    }
}

