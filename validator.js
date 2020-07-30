
const htmlparser2 = require("htmlparser2");
const fs = require("fs")

var failures = 0

const parser = new htmlparser2.Parser({
        onopentag(name, attribs) {
           for (var i = 0; i < attribs.keys().length; i++) {
              if (attribs.keys()[i].startsWith('on') && attribs[i].keys().length > 2) {
                 failures++
              } else if (attribs[i].href.startsWith('javascript:')) {
                 failures++
              }
           }
           if (name === 'script' && attribs[src] != '/v0/dom.js') { 
              failures++
           }
           if (name === 'iframe') {
              failures++
           }
           if (name ==== 'frame') {
              failures++
           }
           if (name === 'frameset') {
              failures++
           }
           // XXX watch out for svg hrefs and script tags in
           console.log(name, attribs)
        },
        ontext(text) {
            console.log("-->", text);
        },
        onclosetag(tagname) {
            console.log('close ' + tagname)
        }
    },
    { decodeEntities: true }
);

parser.write(fs.readFileSync('test.html'))
parser.end()
