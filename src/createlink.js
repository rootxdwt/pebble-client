
import { encode,decode } from 'base64-arraybuffer';
import {encode as urlencode, trim} from 'url-safe-base64';
import {Sharearea} from './comp'
import React from 'react';
import ReactDOM from 'react-dom';
import localforage from 'localforage';


    export default function share(fileid) {
        localforage.getItem("tk").then(function(storedToken) {
            ReactDOM.render(
                <Sharearea link={"aa"} loading={true}/>, 
                document.querySelector('#sharearea')
            )
            var form = new FormData();
            form.append("id", fileid)
            fetch('https://petadrop.com/api/udfetch', {method: 'POST', body: form, headers: {'X-XWC-act' : 'fel'}}).then(function(resp) {
                if(resp.ok) {
                    return resp.json()
                }
            }).then(function(json) {
                if(json.Status == "Success") {
                    var enclinkab = decode(json.Link)
                    var salt = enclinkab.slice(0, 16)
                    var enclinkiv = enclinkab.slice(16, 28)
                    var realencdata = enclinkab.slice(28)
                    var enc = new TextEncoder();
                    crypto.subtle.importKey("raw",enc.encode(storedToken.slice(200)),"PBKDF2",false,["deriveKey", "deriveBits"]).then(function(impkey) {
                        crypto.subtle.deriveKey({"name": "PBKDF2",salt: salt,"iterations": 100000,"hash": "SHA-256"}, impkey,{ name: "AES-GCM", length: 256},false,[ "encrypt", "decrypt" ]).then(function(derivedkey) {
                            crypto.subtle.decrypt({name: 'AES-GCM', iv: enclinkiv}, derivedkey, realencdata).then(function(declink) {
                                var dec = new TextDecoder();
                                ReactDOM.render(
                                    <Sharearea link={dec.decode(declink)} loading={false} id={fileid}/>, 
                                    document.querySelector('#sharearea')
                                )
                            })
                        })
                    })
                }else {
                    var form = new FormData();
                    form.append("dir", fileid)
                    fetch('https://petadrop.com/api/udfetch', {method: 'POST', body: form, headers: {'X-XWC-act' : 'vfi', 'Authorization' : storedToken.slice(0, 200)}}).then(function(resp) {
                        if(resp.ok) {
                            return resp.json()
                        }
                    }).then(function(json) {
                        var encryptedfilekey = decode(json.Filekey)
                        var encryptedname = decode(json.Name)
                
                        var salt = encryptedname.slice(0,16);
                        var nameiv = encryptedname.slice(16,28);
                        var realname = encryptedname.slice(28);
                        var keyiv = encryptedfilekey.slice(16,28);
                        var realkey = encryptedfilekey.slice(28);
                
                        var enc = new TextEncoder();
                        crypto.subtle.importKey("raw",enc.encode(storedToken.slice(200)),"PBKDF2",false,["deriveKey", "deriveBits"]).then(function(impkey) {
                            crypto.subtle.deriveKey({"name": "PBKDF2",salt: salt,"iterations": 100000,"hash": "SHA-256"}, impkey,{ name: "AES-GCM", length: 256},false,[ "encrypt", "decrypt" ]).then(function(derivedkey) {
                                crypto.subtle.decrypt({name: 'AES-GCM', iv: keyiv}, derivedkey, realkey).then(function(decryptedfilekey) {
                                    crypto.subtle.decrypt({name: 'AES-GCM', iv: nameiv}, derivedkey, realname).then(function(decryptedfilename) {
                                        crypto.subtle.generateKey({name: "AES-GCM", length: 128}, true, ["encrypt", "decrypt"]).then(function(sharekey){
                                            crypto.subtle.exportKey("raw", sharekey).then(function(sharekeyab) {
                                                var b64key = trim(urlencode(encode(sharekeyab)))
                                                var sharekeyiv = crypto.getRandomValues(new Uint8Array(12));
                                                var sharefilenameiv = crypto.getRandomValues(new Uint8Array(12));
                                                crypto.subtle.encrypt({name: "AES-GCM",iv: sharekeyiv},sharekey, decryptedfilekey).then(function(sharepreparedkey) {
                                                    crypto.subtle.encrypt({name: "AES-GCM",iv: sharefilenameiv},sharekey, decryptedfilename).then(function(sharepreparedfilename) {
                                                        var shareform = new FormData()
                                                        shareform.append('id', fileid)
                                                        sharepreparedfilename = new Uint8Array(sharepreparedfilename)
                                                        sharepreparedkey = new Uint8Array(sharepreparedkey)
                                                        var realsharepreparedfilename = new Uint8Array(sharepreparedfilename.length + 12)
                                                        realsharepreparedfilename.set(sharefilenameiv, 0)
                                                        realsharepreparedfilename.set(sharepreparedfilename, 12)
                                                        var realsharepreparedkey = new Uint8Array(sharepreparedkey.length + 12)
                                                        realsharepreparedkey.set(sharekeyiv, 0)
                                                        realsharepreparedkey.set(sharepreparedkey, 12)
                                                        var textenc = new TextEncoder();
                                                        var encodedlink = textenc.encode("https://petadrop.com/share/"+fileid+"/"+b64key)
                                                        var linkiv = crypto.getRandomValues(new Uint8Array(12))
                                                        var newsalt = crypto.getRandomValues(new Uint8Array(16))
                                                        crypto.subtle.deriveKey({"name": "PBKDF2",salt: newsalt,"iterations": 100000,"hash": "SHA-256"}, impkey,{ name: "AES-GCM", length: 256},false,[ "encrypt", "decrypt" ]).then(function(derivedkey) {
                                                            crypto.subtle.encrypt({name: "AES-GCM",iv: linkiv},derivedkey, encodedlink).then(function(encryptedlink) {
                                                                var finallinkab = new Uint8Array(new Uint8Array(encryptedlink).length + 28)
                                                                finallinkab.set(newsalt, 0)
                                                                finallinkab.set(linkiv, 16)
                                                                finallinkab.set(new Uint8Array(encryptedlink), 28)
                                                                var encryptedbase64link = encode(finallinkab)
                                                                shareform.append('name', encode(realsharepreparedfilename))
                                                                shareform.append('key', encode(realsharepreparedkey))
                                                                shareform.append('link', encryptedbase64link)
                                                                fetch('https://petadrop.com/api/goshare', {method: 'POST', body: shareform, headers:{'Authorization' : storedToken.slice(0, 200)}}).then(function(resp) {
                                                                    if(resp.ok) {
                                                                        return resp.json()
                                                                    }
                                                                }).then(function(json){
                                                                    if(json.Status == "Success") {
                                                                        ReactDOM.render(
                                                                            <Sharearea link={"https://petadrop.com/share/"+fileid+"/"+b64key} loading={false} id={fileid}/>, 
                                                                            document.querySelector('#sharearea')
                                                                        )
                                                                    }
                                                                })
                                                            })
                                                        }).catch(function(err) {
                                                            console.log(err)
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                }
            })
        })
    }
    export function revokeURL(id) {

    }