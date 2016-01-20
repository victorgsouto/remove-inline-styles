'use strict';

var $ = require('cheerio');
var fs = require('fs');

module.exports = function readFile(file) {
    fs.readFile(file, process);
};

function process(err, data) {
    if (err) throw err;
    getStyle(data.toString());
}

function getInlineStyles(html) {
    if (typeof html !== 'string') {
        throw new TypeError('get-inline-styles expected a string')
    }
    var inlinedStyles = [];
    var removeStyle = $.load(html);
    
    removeStyle('*[style]').each(function (i, element) {
        inlinedStyles.push({
            style: '.class' + i + ' { ' + element.attribs.style + ' }'
        });
        $(element).removeAttr('style').html();
        $(element).addClass('class' + i).html();
    });
    createNewHTML(removeStyle.html({decodeEntities: false}))
    return inlinedStyles;
}

function createNewHTML(data) {
    fs.writeFile('file-without-inline-styles.html', data, 'utf8', function (err) {
        if (err) return console.log(err);
        console.log('Created: file-without-inline-styles.html ');
    });
}

function getStyle(data) {
    var inlineCss = getInlineStyles(data);
    
    fs.writeFile('style.css', '', function (err) {
        if (err) return console.log(err);
        console.log('\n' + 'Created: style.css');
    }); 

    for (var name in inlineCss) {
        fs.appendFileSync('style.css', inlineCss[name].style + '\n');
    }
}

