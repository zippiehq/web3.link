/*
 * Copyright (C) 2020 Zippie Ltd.
 * 
 * Commercial License Usage
 * 
 * Licensees holding valid commercial Zippie licenses may use this file in
 * accordance with the terms contained in written agreement between you and
 * Zippie Ltd.
 * 
 * GNU Affero General Public License Usage
 * 
 * Alternatively, the JavaScript code in this page is free software: you can 
 * redistribute it and/or modify it under the terms of the GNU Affero General Public
 * License (GNU AGPL) as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.  The code
 * is distributed WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for
 * more details.
 * 
 * This license applies to this entire compilation.
 */

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import Router from 'express-promise-router'
import IpfsHttpClient from 'ipfs-http-client'
import htmlparser2 from 'htmlparser2'
import mime from 'mime-types'
import fs from 'fs'
import path from 'path'

const app = express()
const router = new Router();
const ipfs = IpfsHttpClient()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(router)

function validate(body) {
    return new Promise((resolve, reject) => {
        let failures = 0 
	let scripts = []
        let inside_tag
        const parser = new htmlparser2.Parser({
            onopentag(name, attribs) {
                inside_tag = name               
                // XXX watch out for svg hrefs and script tags in
                console.log(name, attribs)
    
                let attribs_keys = Object.keys(attribs)
                for (var i = 0; i < attribs_keys.length; i++) {
                    if (attribs_keys[i].startsWith('on') && attribs_keys[i].length > 2) {
                        failures++
                    }
                }
                if (attribs['href'] && attribs['href'].startsWith('javascript:')) {
                    failures++
                }            
                if (name === 'script' && attribs['src'] !== '/v0.idp-framework.eth/main.js') {
                    failures++
                }
                if (name === 'iframe') {
                    failures++
                }
                if (name === 'frame') {
                    failures++
                }
                if (name === 'frameset') {
                    failures++
                }
		if (name === 'idp-script') {
                    scripts.push(attribs['src'])
                }
            },
            ontext(text) {
                if (inside_tag === 'script')
                    failures++
                console.log("-->", text);
            },
            onclosetag(tagname) {
                inside_tag = null
                console.log('close ' + tagname)
            },
            onend() {
                resolve({failures, scripts: scripts})
            }
        },
            { decodeEntities: true }
        );    
        parser.write(body)
        parser.end()    
    })
}

async function ipfs_fetch(path) {
    if (fs.existsSync('dist/' + path.slice(1))) {
       return fs.readFileSync('dist/' + path.slice(1))
    } 
    const chunks = []
    for await (const chunk of ipfs.cat(path)) {
        chunks.push(chunk)
    }
    const contents = Buffer.concat(chunks)
    return contents
}

router.get(/.*$/, async (req, res) => {
    let content
    let brotli = false
    try {
      content = await ipfs_fetch(req.path + '.br')
      brotli = true
    } catch (err) {
    }
    try {
       if (!content) 
	  content = await ipfs_fetch(req.path)
    } catch (err) {
       res.status(500).send(err.toString())
       return
    }

    let type = mime.lookup(req.path)
    res.set('X-Content-Type-Options', 'nosniff')
    res.set('Content-Type', type)
    res.set('Cache-Control', 'max-age=3600')
    if (brotli) {
       res.set('Content-Encoding', 'br')
    }
    if (type === 'text/html') {
        let validation = await validate(content)
	if (validation.failures > 0) {
          res.status(400).send('Does not pass validation')
          return
       }
       let dirname = path.dirname(req.path)
       res.set('Service-Worker-Allowed', '/')
       res.set('Link', '</v0.idp-framework.eth/main.js>; as=script; rel=preload, </v0.idp-framework.eth/vendors~worker-dom.chunk.js>; as=script; rel=preload, </v0.idp-framework.eth/domworker.js>; as=fetch; rel=preload; crossorigin, <' + dirname + '/' + validation.scripts[0] + '>; as=fetch; rel=preload; crossorigin')
    }
    res.send(content)
})

async function init() {
    const port = process.env.PORT || 8099

    const server = app.listen(port, '0.0.0.0', function () {
        console.log('app listening at http://%s:%s', server.address().address, server.address().port)
    })
}

init()
