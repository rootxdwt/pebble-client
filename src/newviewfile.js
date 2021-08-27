import {Fileviewarea, Defaultxhrloading, Overlay} from './comp';
import React from 'react';
import {decryptFromPw} from './main'
import ReactDOM from 'react-dom';
import { decode } from 'base64-arraybuffer';
import localforage from 'localforage';
const vars = require('./vars.json')

let finaldecryptedfd
var finishlist = []
var currentlyrendered = []
async function defaultlp(element, range) {
    var storedToken = await localforage.getItem("tk")
    var prexhr = new XMLHttpRequest();
    prexhr.open("POST", "https://petadrop.com/api/udfetch", true);
    var preform = new FormData();
    prexhr.setRequestHeader("Authorization", storedToken.slice(0,200))
    preform.append('dir', element);
    prexhr.setRequestHeader("X-XWC-act", "vfi")
    prexhr.onreadystatechange = function() {
        if (prexhr.readyState === prexhr.DONE) {
            if (prexhr.status === 200) {
                precallback(prexhr.response, element, range);
            }
        }
    };
    prexhr.send(preform)
}
export function OnlyDownload(element) {
    defaultlp(element, "0:5242928")
}

export function rvf(element, range) {
    ReactDOM.render(
        <Overlay show ={false} />,
        document.querySelector('#olay')
        )
    document.querySelector(".fileviewer").classList.add("show")
    ReactDOM.render(
        <Defaultxhrloading />, 
        document.querySelector(".fileviewer")
        )
    if(currentlyrendered.length > 0) {
        var idlist = [],
            namelist = [],
            srclist = [],
            typelist = [],
            mimelist = [];
        for(var i = 0;i<currentlyrendered.length;i++) {
            var renderdta = JSON.parse(currentlyrendered[i])
            idlist.push(renderdta.id)
            namelist.push(renderdta.name)
            srclist.push(renderdta.blob)
            typelist.push(renderdta.ext)
            mimelist.push(renderdta.mime)
        }
            if(idlist.indexOf(element) != -1) {
                document.querySelector(".dark").classList.add("show")
                document.querySelector("body").classList.add("ovx")
                document.querySelector(".fileviewer").classList.remove("show")
                var n = idlist.indexOf(element)
                ReactDOM.render (
                    <Fileviewarea name={namelist[n]} ft={typelist[n]} src={srclist[n]} mime={mimelist[n]}/>,
                    document.querySelector(".dark")
                )
            }else {
                defaultlp(element, range)
            }
    }else {
        defaultlp(element, range)
    }
}
var stopped = ''
export function stopdownload(id, action) {
    stopped = id
    if(action == 1) {
        document.getElementById('fileloadingtxt').innerText = "Stopping.."
    }
}
async function precallback(data, element) {
    var storedToken = await localforage.getItem("tk")
    data = JSON.parse(data)
    var decer = new TextDecoder();
    var fnbuffer = decode(data.Name)
    var salt = fnbuffer.slice(0,16);
    var iv = fnbuffer.slice(16,32);
    var realname = fnbuffer.slice(32);
    var dec1 = await decryptFromPw(storedToken.slice(200), iv, salt, realname)

    var encryptedfileheader = decode(data.Filekey);

    var salt = encryptedfileheader.slice(0, 16)
    var iv = encryptedfileheader.slice(16, 32)
    var encryptedfilekey = encryptedfileheader.slice(32)
    var dec = await decryptFromPw(storedToken.slice(200), iv, salt, encryptedfilekey)

    var importedkey = await crypto.subtle.importKey("raw", dec,{name: 'AES-CBC'},false,["encrypt", "decrypt"])
    var filetype = decer.decode(dec1).split('.');
    var fileextension
    if(vars.imagefile.indexOf(filetype[filetype.length - 1].toLowerCase()) !== -1) {
        fileextension = "img"
    }
    else if(vars.vidfile.indexOf(filetype[filetype.length - 1].toLowerCase()) !== -1) {
        fileextension = "vid"

    }else if(vars.audiofile.indexOf(filetype[filetype.length - 1].toLowerCase()) !== -1){
        fileextension = "audio"

    }else {
        fileextension = "idk"
    }
    document.querySelector(".fileviewer").classList.add("show")
    ReactDOM.render(
        <Defaultxhrloading />, 
        document.querySelector(".fileviewer")
    )
        if(stopped.length == 0) {
            document.querySelector("#fileloadingtxt").innerText= "Preparing.."
        }
        var nth = 0
        viewfile(element, (((1024 * 1024)*5) + 48)*(nth)+":"+(((1024 * 1024)*5) + 48)*(nth+1), importedkey, decer.decode(dec1), data.Mime, nth, fileextension, true, data.Size)
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
var finalblob = new Blob([])
var bloblist = []
async function viewfile(element, range, deckey, filename, filemime, nth, extension, instantsave, originalfilesize) {
    var storedToken = await localforage.getItem("tk")

    async function processfile(data) {
    var file = data
    var aB = new Uint8Array(file)
    var fileiv = aB.slice(0, 16)
    var encfile = aB.slice(32)
    var decryptedfiledata = await crypto.subtle.decrypt({name: 'AES-CBC', iv: fileiv}, deckey, encfile)
    finishlist.push(nth)
        if(instantsave == false) {
            finaldecryptedfd.set(new Uint8Array(decryptedfiledata), parseInt(((1024 * 1024)*5)+1)*(nth))
            if(finishlist.length == calchunk(originalfilesize)) {
                var fileblob = URL.createObjectURL(new Blob([finaldecryptedfd], {type: filemime}))
                finaldecryptedfd = new Uint8Array(0)
                finishlist = []
                currentlyrendered.push(JSON.stringify({id : element, blob :fileblob, name : filename, ext : extension, mime : filemime}))
                document.querySelector(".fileviewer").classList.remove("show")
                document.querySelector(".dark").classList.add("show")
                ReactDOM.render (
                    <Fileviewarea name={filename} ft={extension} src={fileblob} mime={filemime}/>,
                    document.querySelector(".dark")
                )
                now = 0;
                currentupload = 0;
            }
        }else if(instantsave == true) {
            var newu8 = new Uint8Array(decryptedfiledata)
            var preblob = new Blob([newu8])
            bloblist[nth] = preblob
            finalblob = new Blob(bloblist)
            if(finalblob.size == originalfilesize) {
                var finurl = URL.createObjectURL(new Blob([finalblob], {type: filemime}))
                document.querySelector(".fileviewer").classList.remove("show")
                currentlyrendered.push(JSON.stringify({id : element, blob :finurl, name : filename, ext : extension, mime : filemime}))
                document.querySelector(".dark").classList.add("show")
                ReactDOM.render (
                    <Fileviewarea name={filename} ft={extension} src={finurl} mime={filemime}/>,
                    document.querySelector(".dark")
                )
                //init
                InitProg()
            }
        }  
    }
    function InitProg() {
        finalblob = new Blob([])
        bloblist = []
        currentupload = 0;
        now = 0;
    }
    var token = storedToken.slice(0, 200);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://storage.petadrop.com/vf/"+element+"/"+range, true)
    xhr.setRequestHeader("X-XWC-act", "ahf")
    xhr.responseType = "arraybuffer";
    var form = new FormData();
    form.append('dir', element +"|"+ token +"|"+ range);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                processfile(xhr.response);
            }else if (xhr.status == 0){
                document.querySelector("#fileloadingtxt").innerText= " ";
                document.querySelector(".fileviewer").classList.remove("show")
            }else {
                document.querySelector("#fileloadingtxt").innerText="oopsie i found an error: "+xhr.status;
            }
        } 
            
    };
    var RanFunc = false
    xhr.onprogress = function(e) {
        if(stopped.length == 0) {
            currentupload = e.loaded
            document.querySelector("#fileloadingtxt").innerText=  "Downloaded " + Math.round(((now+currentupload)/originalfilesize)*100) + "%"
            if(RanFunc == false && (e.loaded/5242928)*100 > 10) {
                viewfile(element, (((1024 * 1024)*5) + 48)*(nth+1)+":"+(((1024 * 1024)*5) + 48)*(nth+2), deckey, filename, filemime, nth+1, extension, instantsave, originalfilesize)
                RanFunc = true
            }
        }else {
            xhr.abort()
            stopped =''
            InitProg()
        }
        
    }
    xhr.onloadend = function() {
        now = currentupload + now
    }

    xhr.send(form);
}