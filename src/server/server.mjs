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

        const parser = new htmlparser2.Parser({
            onopentag(name, attribs) {
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
            },
            ontext(text) {
                console.log("-->", text);
            },
            onclosetag(tagname) {
                console.log('close ' + tagname)
            },
            onend() {
                resolve(failures === 0)
            }
        },
            { decodeEntities: true }
        );    
        parser.write(body)
        parser.end()    
    })
}

async function ipfs_fetch(cid) {
    const chunks = []
    for await (const chunk of ipfs.cat(cid)) {
        chunks.push(chunk)
    }
    const contents = Buffer.concat(chunks)
    return contents
}

router.get(/.*\.html$/, async (req, res) => {
    res.set('Content-Type', 'text/html');
    res.set('X-Content-Type-Options', 'nosniff')
    let content = await ipfs_fetch(req.path)
    if (await validate(content))
        res.send(content)
    else 
        res.status(400).send('Does not pass validation')
})

async function init() {
    const port = process.env.PORT || 8099

    const server = app.listen(port, '0.0.0.0', function () {
        console.log('app listening at http://%s:%s', server.address().address, server.address().port)
    })
}

init()
