import {mobilenew} from './index.js'
import { readAndCompressImage } from 'browser-image-resizer';
import { encode,decode } from 'base64-arraybuffer';
import {updatedata, curdir, singlefile} from './main.js';
import {Uploadnotify} from './comp'
import React from 'react';
import ReactDOM from 'react-dom';
import localforage from 'localforage';
const vars = require('./vars.json')

function size(s) {
    var fs
    if(1024 >= s) {
        fs = Math.round(s) + "B"

    }else if(s > 1024 && s < 1024*1024) {
        fs = Math.round(s/1024) + "KB"

    }else if(s >= 1024*1024 && s < 1024*1024*1024) {
        fs = Math.round(s/(1024*1024)) + "MB"

    }else if(s >= 1024*1024*1024 && s < 1024*1024*1024*1024) {
        fs = Math.round(s/(1024*1024*1024)) + "GB"    
    }
    return fs
}

function filedetail(file, id) {
    if(file == undefined || file == null || file == '') {
    }else {
        if(file === null) {
        }
        var fs= size(file.size)
        ReactDOM.render(
            <Uploadnotify name={file.name} size={fs} progid={id} act={""}/>,
            document.querySelector("#ules")
        )
    }
}

async function encthumbnail(fdata, id) {
    var iv = crypto.getRandomValues(new Uint8Array(12));
    var salt = crypto.getRandomValues(new Uint8Array(16));
    var fd = fdata
    var storedToken = await localforage.getItem("tk")
    var pww = storedToken.slice(200);
    let enc = new TextEncoder();
    var impk = await crypto.subtle.importKey("raw",enc.encode(pww), {name: "PBKDF2"},false,["deriveBits", "deriveKey"])
    var key = await crypto.subtle.deriveKey({"name": "PBKDF2",salt: salt,"iterations": 100000,"hash": "SHA-256"   }, impk,{ "name": "AES-GCM", "length": 256},false,[ "encrypt", "decrypt" ])
    var encrypted = await crypto.subtle.encrypt({'name': 'AES-GCM',iv }, key, fd)

    encrypted = new Uint8Array(encrypted)
    var fab = new Uint8Array(new Uint8Array(encrypted).length + 28)
    fab.set(iv, 0)
    fab.set(salt, 12)
    fab.set(encrypted, 28)
    var finblob = new Blob([fab])
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://petadrop.com/api/thumbhandle/", true)
    var tk = storedToken.slice(0,200);
    xhr.setRequestHeader("Authorization", tk)           
    xhr.setRequestHeader("x-xwc-act", "up")            
    var form = new FormData();
    form.append("thumb", finblob)
    form.append("tn", id)
    if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
            console.log("ok")
        }
    }
    xhr.send(form)
}

export function uploadworker() {
    var fl = document.querySelector('#fileinput').files
    var state;
    if(fl.length >1) {
        state=1
    }else {
        state=0
    }
    onetime(0)
}
var pfplink

function updateProg(offset) {
    if(document.querySelectorAll(".progrezz")[0].value < offset || offset == 0) {
        document.querySelectorAll(".progrezz")[0].value = offset
        document.querySelectorAll(".progrezz")[1].value = offset
    }
}

export async function hash(algo, data) {
    var digest = await window.crypto.subtle.digest(algo, data)
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}
var filehashes = []
async function onetime(i) {

    var file = document.querySelector('#fileinput').files[i];

    if(file == undefined || file == null || file == '') {

    }else {
    mobilenew("preup")   
    if(window.innerWidth > 760) {
        ReactDOM.render(
            <Uploadnotify name={"Preparing.."} size={""} progid={""} act={""}/>,
            document.querySelector("#ules")
        )
    }
        var storedToken = await localforage.getItem("tk")
        var salt = crypto.getRandomValues(new Uint8Array(16))
        var iv = crypto.getRandomValues(new Uint8Array(12))
        var pww = storedToken.slice(200);
        let enc = new TextEncoder();
        var fkey = await crypto.subtle.generateKey({name: "AES-GCM",length: 256},true,["encrypt", "decrypt"])
        var keybuff = await crypto.subtle.exportKey("raw", fkey)
        var impk = await crypto.subtle.importKey("raw",enc.encode(pww),"PBKDF2",false,["deriveKey", "deriveBits"])
        var derivedkey = await crypto.subtle.deriveKey({"name": "PBKDF2",salt: salt, "iterations": 100000, "hash": "SHA-256" }, impk, {"name": "AES-GCM", "length": 256 }, false, [ "encrypt", "decrypt" ])
        var encryptedfn = await crypto.subtle.encrypt({ name: 'AES-GCM',iv: iv }, derivedkey, enc.encode(file.name))

            var keyiv = crypto.getRandomValues(new Uint8Array(12))
            crypto.subtle.encrypt(
                {name: 'AES-GCM',
                iv: keyiv 
            }, derivedkey, keybuff).then(function(enc) {

                var xhr = new XMLHttpRequest;
                xhr.open('POST', "https://petadrop.com/api/preupload", true)
                var form = new FormData();
                xhr.setRequestHeader("Authorization", storedToken.slice(0,200))
                var enc = new Uint8Array(enc)
                var findata = new Uint8Array(new Uint8Array(enc).length+28)
                findata.set(salt, 0);
                findata.set(keyiv, 16);
                findata.set(enc, 28);

                var enf = new Uint8Array(encryptedfn)
                var fnfd = new Uint8Array(new Uint8Array(enf).length+28)
                fnfd.set(salt, 0);
                fnfd.set(iv, 16);
                fnfd.set(enf, 28);


                var string = encode(findata);
                form.append("key", string)
                form.append("fname", encode(fnfd))
                form.append("type", file.type)
                form.append("size", file.size)
                form.append("curdir", curdir)

                xhr.send(form);
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === xhr.DONE) {
                        if (xhr.status === 200) {
                            callback(xhr.response);
                            //filetype & thumbnail
                            var fileId = JSON.parse(xhr.response).Id
                            var filetype = file.name.split('.');
                            if(vars.imagefile.indexOf(filetype[filetype.length - 1].toLowerCase()) !== -1) {
                                var config = {
                                    quality: 1,
                                    maxWidth: 100,
                                    maxHeight: 100,
                                    autoRotate: false,
                                    debug: false
                                }
                                readAndCompressImage(file, config).then(function(resizedpfp) {
                                    const reader = new FileReader()
                                    reader.onloadend = function(e) {
                                        encthumbnail(e.target.result, fileId)
                                        pfplink = URL.createObjectURL(new Blob([e.target.result]))
                                    }
                                    reader.readAsArrayBuffer(resizedpfp)
                                })
                            }
                            else if(vars.codefile.indexOf(filetype[filetype.length - 1].toLowerCase()) !== -1) {
                                var read = new FileReader()
                                read.onload = function(e) {
                                    var finstringArr =  e.target.result.split("\n");
                                    var canvas = document.createElement("canvas");
                                    canvas.width = "100"
                                    canvas.height = "100"
                                    var ctx = canvas.getContext("2d");
                                    ctx.fillStyle = "white";
                                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                                    ctx.font = "7px Arial"
                                    ctx.fillStyle = "black"
                                    for(var i=0;i<20;i++) {
                                        if(!(i == undefined || finstringArr[i] == undefined)) {
                                            ctx.fillText(finstringArr[i].slice(0, 30), 5, 6*(i+1))
                                        }
                                        
                                    }
                                    canvas.toBlob(function(blob) {
                                        var reader = new FileReader()
                                        reader.onloadend = function(e) {
                                            encthumbnail(e.target.result, fileId)
                                            pfplink = URL.createObjectURL(new Blob([e.target.result]))
                                        }
                                        reader.readAsArrayBuffer(blob)
                                    })
                                }
                                read.readAsText(file)
                                
                            }else {
                                pfplink = ""
                            }
                        }
                    }
                };
                function callback(resp) {
                    var res = JSON.parse(resp);
                    var val = res.Id.toString();
                    var enc = new TextEncoder()
                    
                    val = enc.encode(val)
                    fileadded(0, 1, val, fkey)
                
                    mobilenew("upchk", size(file.size), res.Id.toString(), file.name).then(function() {
                        filedetail(file, res.Id.toString())
                    })
                }
            })
    }
    
    function calchunk(filelength) {
        var chunkcount
        chunkcount = parseInt(filelength / ((1024 * 1024)*5));
        if((filelength%((1024 * 1024)*5))>0) {
            chunkcount = chunkcount + 1;
        }
        return chunkcount;
    }
    var currentupload = 0;
    var now = 0;
    function fileadded(start, nth, identify, key) {
        var slice_size = (1024 * 1024)*5;
        var fread = new FileReader();
        var next_slice = start + slice_size + 1;
        var blob = file.slice( start, next_slice );
        
        fread.onloadend = async function(e) {
                if ( e.target.readyState !== FileReader.DONE ) {
                    return;
                }
                var buffer = new Uint8Array(e.target.result);
                hash('SHA-256', buffer).then(function(h) {
                    filehashes.push(h)
                })
                        var iv = crypto.getRandomValues(new Uint8Array(12));
                        crypto.subtle.encrypt({ 
                            'name': 'AES-GCM',
                                iv 
                            }, key, buffer) 

                        .then(encrypted => {
                                var encrypted2 = new Uint8Array(encrypted)
                                var findata = new Uint8Array(encrypted2.length+28)
                                findata.set(iv, 0);
                                findata.set(identify, 12);
                                findata.set(encrypted2, 28);
                                var fffd = new Blob([findata])
                                hash('SHA-512', findata).then(function(digest) {
                                        
                                        findata = null
                                        encrypted2 = null
                                        buffer = null

                                        var xhr = new XMLHttpRequest;
                                        xhr.open("POST", "https://storage.petadrop.com/upload?idnf="+digest+"&chnum="+nth+"&ttlch="+calchunk(file.size), true);

                                        var form = new FormData();

                                        form.append("file", fffd)
                                        var RanFunc = false
                                        xhr.upload.onprogress = function(e) {
                                            currentupload = e.loaded
                                            updateProg(((now + e.loaded)/file.size)*100)
                                            if(RanFunc == false && (e.loaded/5242925)*100 > 65 && nth+1 <= calchunk(file.size)) {
                                                fileadded( next_slice, nth+1 ,identify, key)
                                                RanFunc = true
                                            }
                                        }
                                        xhr.upload.onloadend =function() {
                                            now = currentupload + now
                                        }
                                        xhr.onreadystatechange = function() {
                                            if (xhr.readyState === xhr.DONE) {
                                                    if(xhr.status == 200) {
                                                        if(JSON.parse(xhr.response).Statusmsg !== "Success") {
                                                            ReactDOM.render(
                                                                <Uploadnotify name={"Failed"}/>,
                                                                document.querySelector("#ules")
                                                            )
                                                        }else {
                                                            
                                                            if ( next_slice < file.size ) {
                                                            } else {
                                                                singlefile(identify, pfplink)
                                                                updateProg(0)
                                                                if(i == document.querySelector('#fileinput').files.length -1) {
                                                                    var tx = new TextEncoder()
                                                                    var encoded_addedhash = tx.encode(filehashes.join(''))
                                                                    
                                                                    window.crypto.subtle.digest('SHA-256', encoded_addedhash).then(function(final_filehash) {
                                                                        final_filehash = Array.from(new Uint8Array(final_filehash)).map(b => b.toString(16).padStart(2, '0')).join('');
                                                                        console.log(final_filehash)
                                                                        filehashes = []
                                                                    })
                                                                    ReactDOM.unmountComponentAtNode(document.querySelector("#ules"))
                                                                    try {
                                                                        mobilenew("bsc")
                                                                    }
                                                                    catch(e){
                                                                    }
                                                                }else {
                                                                    onetime(i+1)
                                                                }
                                                            }   
                                                        }
                                                    }else {
                                                        ReactDOM.render(
                                                            <Uploadnotify name={"Failed "+"("+xhr.status+")"}/>,
                                                            document.querySelector("#ules")
                                                        )
                                                    }
                                            }
                                        };
                                        xhr.send(form);  
                                    })

                        })                              
    
    }
        fread.readAsArrayBuffer(blob)
    }
}