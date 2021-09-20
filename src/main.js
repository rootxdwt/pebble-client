//(c) 2021 xdwhat
import React from 'react';
import ReactDOM from 'react-dom';
import {eclickdetector} from './index'
import {processpfp} from './pfphandler'
import {mobilenew} from './index'
import {Filecont, Overlay, Arrangebar, Dir, Alignicon, Mobilemenubtn, Group, Button, Searchico, Pfp, Lpfpmenu} from './comp'
import { encode, decode } from 'base64-arraybuffer';
import localforage from 'localforage';
import {uploadworker} from './uploadhandler.js'
import timeZoneConverter from 'time-zone-converter'

function convert_timezone(time) {
    var offset = new Date().getTimezoneOffset();
    var f = timeZoneConverter(time, offset/60, -2, 'YYYY/MM/DD HH:mm')
    return f
}
export function pfpmenu() {
    document.querySelector('.lpfpmenu').classList.toggle('active');
}
if(!(localStorage.getItem('arrange') == 1)) {
    localStorage.setItem('arrange', 0)
}
localStorage.removeItem("tk")

export function rclick(e) {
    e.stopPropagation();
    var main = document.querySelectorAll('.filecont');
    if(window.innerWidth < 760) {
        document.querySelector('.rclickmenu').classList.remove('hidden');
        eclickdetector()
        ReactDOM.render(
            <Overlay show={true}/>,
            document.querySelector('#olay')
        )
        main.forEach(element => {
        var clickelem = element.contains(e.target);
        if(clickelem) {
            eclickdetector(true, element.id)
            if(document.querySelector(".leftclicked") != undefined) {
                for(var i=0;i<document.querySelectorAll(".leftclicked").length;i++) {
                    document.querySelectorAll(".leftclicked")[i].classList.remove("leftclicked")
                }
            }
            element.classList.add("leftclicked")
        }else if(clickelem === false) {
            document.querySelector('.rclickmenu').style="";
            if(document.querySelector(".leftclicked") != undefined) {
                for(var i=0;i<document.querySelectorAll(".leftclicked").length;i++) {
                    document.querySelectorAll(".leftclicked")[i].classList.remove("leftclicked")
                }
            }
        }
        });
    }else if(window.innerWidth > 760){
        eclickdetector()
        main.forEach(element => {
        var clickelem = element.contains(e.target);
        if(clickelem) {
            eclickdetector(true, element.id)
            if(document.querySelector(".leftclicked") != undefined) {
                for(var i=0;i<document.querySelectorAll(".leftclicked").length;i++) {
                    document.querySelectorAll(".leftclicked")[i].classList.remove("leftclicked")
                }
            }
            element.classList.add("leftclicked")
        }

        })
        if(e.pageX+ 155 > cont.offsetWidth) {
            document.querySelector('.rclickmenu').style='top:'+e.pageY+'px;left:'+(cont.offsetWidth-165)+'px;';
            document.querySelector('.rclickmenu').classList.remove('hidden');
        }
        if(e.pageY-45 > cont.scrollHeight) {
            document.querySelector('.rclickmenu').style='top:'+(cont.scrollHeight+45)+'px;left:'+e.pageX+'px;';
            document.querySelector('.rclickmenu').classList.remove('hidden');
        }
        if(e.pageY-45 > cont.scrollHeight && e.pageX+ 100 > cont.offsetWidth) {
            document.querySelector('.rclickmenu').style='top:'+(cont.scrollHeight+45)+'px;left:'+(cont.offsetWidth-165)+'px;';
            document.querySelector('.rclickmenu').classList.remove('hidden');
        }
        else if(e.pageX+ 155 < cont.offsetWidth && e.pageY-45 < cont.scrollHeight) {
            document.querySelector('.rclickmenu').style='top:'+e.pageY+'px;left:'+e.pageX+'px;';
            document.querySelector('.rclickmenu').classList.remove('hidden');
        }
    }
}
export function showfilelabel() {
    document.querySelector('.fileoptions-pc').classList.toggle('hide');
}
export function hideoverlaycont() {
        document.querySelector('.overlayarea').classList.add('hide')
    
}

export function calcsize(length) {
    var fs
    if(typeof length == "number") {
        if(1024 >= length) {
            fs = Math.round(length) + "B"
    
        }else if(length > 1024 && length < 1024*1024) {
            fs = Math.round(length/1024) + "KB"
    
        }else if(length >= 1024*1024 && length < 1024*1024*1024) {
            fs = Math.round(length/(1024*1024)) + "MB"
    
        }else if(length >= 1024*1024*1024 && length < 1024*1024*1024*1024) {
            fs = Math.round(length/(1024*1024*1024)) + "GB"
            
        }
    }else {
        fs = "Unknown"
    }
    return fs
}

//fix pls pls
export function openleftbar() {
    document.querySelector('.leftmenubar').classList.remove('act');
    document.querySelector('.leftmenubar').classList.toggle('opened');
    document.querySelector('#folderico').classList.toggle('show');
    document.querySelector('#trashico').classList.toggle('show');
    document.querySelector('#share').classList.toggle('show');
    document.querySelector('#gico').classList.toggle('show');
}

export function arrange() {

    ReactDOM.render (
        <Alignicon />,
        document.querySelector(".aligniconArea")
    )
    var state;
    var elem2=[]
    if(localStorage.getItem("arrange") == 1) {
        localStorage.setItem("arrange", 0);
        state=""
    }else if(localStorage.getItem("arrange") == 0) {
        localStorage.setItem("arrange", 1);
        state = "row"
        elem2.unshift(<Arrangebar />)
    }
    var target = curdir
    for(var i=0;i<elem.length;i++) {
        var ea2 = elem[i]
        elem[i].state = state
        if(ea2.dir == target) {
            elem2.push(<Filecont name={ifempty(ea2.name)} size={ifempty(calcsize(ea2.size))} mime={ifempty(ea2.mime)} date={ea2.date} id={ea2.id} state={state} typ={ea2.typ} src={ea2.src}/>)
        }
    }
    ReactDOM.render(
        elem2,
        document.querySelector(".mainarea")
    )
    
}

    
    export async function getud() {
        var storedToken = await localforage.getItem("tk")
        if(storedToken == null) {
            document.location.href="https://petadrop.com/";
        }else {
            var resp = await fetch("https://petadrop.com/api/udfetch", {method: 'POST', headers:{'Authorization': storedToken.slice(0, 200), 'X-XWC-act': 'ludf'}})
            if(!resp.ok) {
                console.error(resp.status)
            }
            var json = await resp.json()
            callback(json);
        }

    }
    
    var curdir = "/ 0"
    
    export {curdir}
    
    getud()
    
    var curtime
    function sortResults(prop, asc) {
        elem.sort(function(a, b) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            } else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });
    }
    
    export function alignby(a, b) {
        sortResults(a, b)
        rerender()
    }
    export function ifempty(string) {
        if(string.length == 0) {
            return "unknown"
        }else {
            return string
        }
    }
    var cont = document.querySelector('body');
    cont.addEventListener('contextmenu', e => {
        e.preventDefault();
    });
    var area = document.querySelector('.mainarea');
    area.addEventListener('contextmenu', e => {
        e.preventDefault();
        rclick(e);
    });
    [document.querySelector(".mainarea"), document.querySelector(".mainheader")].forEach(itm =>{
        itm.addEventListener("click",function(){
            for(var i=0;i<document.querySelectorAll(".leftclicked").length;i++) {
                document.querySelectorAll(".leftclicked")[i].classList.remove("leftclicked")
            }
        
        
            document.querySelector('.rclickmenu').classList.add('hidden');
        });
    })
    window.addEventListener("resize", function(){
        document.querySelector('.rclickmenu').classList.add('hidden');
        document.querySelector('.rclickmenu').style="";
    });

    var elem = []
    var state;

    //pw: string, iv: arraybuffer, salt: arraybuffer, data: arraybuffer
    export async function decryptFromPw(pw, iv, salt, data) {
        var encodedpw = new TextEncoder().encode(pw)
        var importedKey = await crypto.subtle.importKey("raw", encodedpw, "PBKDF2", false, ["deriveKey", "deriveBits"])
        var derivedKey = await crypto.subtle.deriveKey({"name": "PBKDF2", salt: salt, "iterations": 100000, "hash": "SHA-256"}, importedKey, { "name": "AES-GCM", "length": 256}, false, [ "encrypt", "decrypt" ])
        try {
            var decData = await crypto.subtle.decrypt({name: 'AES-GCM', iv: iv}, derivedKey, data)
            return decData
        }
        catch(decryptionErr) {
            console.error(decryptionErr)
        }
    }

    async function callback(dta) {
        var storedToken = await localforage.getItem("tk")
        var percentage
        if(window.localStorage.getItem("arrange") == 1) {
            state = "row";
            document.querySelector('#grid').classList.toggle('transparent');
            document.querySelector('#row').classList.toggle('transparent');
        }
        else {
            state = "";
        }
            elem = []
            var res = dta;
            if (res.hasOwnProperty("Pfp")) {
            var val = res.Pfp.toString();
            if(val == "") {
                var l = document.querySelectorAll('.pfpimg');
                for(var i=0;i<l.length;i++) {
                l[i].src = "https://cdn.xdwhat.tech/pfp.png"
                }
            }else {
                var sarray = val.split("|");
                processpfp(sarray[0], sarray[1], sarray[2]);
            }
            if(res.Username == "") {
                console.error("no username")
            }
            ReactDOM.render(
                <>
                    <>
                    <div className="headerleft">
                    <div className="fileoptions-pc">
                        <label htmlFor="fileinput" className="fileoptbutton">Upload file</label>
                        <input id="fileinput" type="file" onChange={() => uploadworker()} multiple/>
                        <div className="fileoptbutton">Upload folder</div>
                        <div className="fileoptbutton"onClick={createfolder}>Create folder</div >
                    </div>
                    <Mobilemenubtn />
                    <Group />
                    <Button />
                    <Searchico />
                    </div>
                    </>
                    <div className="headerright">
                    <Pfp/>
                    </div>
                <Lpfpmenu userid={res.Username.split("@")[0]}/>
                </>,
                document.querySelector('.header')
            )
            curtime = res.Timestamp
            if(res.Folder != null) {
                var pww = storedToken.slice(200)
                decfolder(0)
                async function decfolder(nth) {
                    var folders = JSON.parse(res.Folder[nth])
                    var encryptedname = decode(folders.Name)
                    var salt = new Uint8Array(encryptedname.slice(0, 16))
                    var iv = new Uint8Array(encryptedname.slice(16, 28))
                    var realdata2 = new Uint8Array(encryptedname.slice(28))
                    try {
                        var decdata = await decryptFromPw(pww, iv, salt, realdata2)
                        var dec = new TextDecoder();
                        elem.push({name : dec.decode(decdata), size : folders.Size, mime : "N/A", date : convert_timezone(folders.Date), id : folders.Fid + " " +folders.Index.split(" ")[1], state : state, typ: "folder", dir : folders.Index}) 
                        if(res.File != null) {
                            percentage = elem.length/(res.File.length + res.Folder.length)
                        }else {
                            percentage = elem.length/(res.Folder.length)
                        }
                        document.querySelector(".loadinglabel").innerText = "Decrypting, "+Math.round(percentage*100)+"% Done"
                        document.querySelector("#loadwrapperloading").style="stroke-dashoffset:"+(1850 - (1850*(percentage)))+";fill:none;"
                        if(nth < res.Folder.length -1) {
                            decfolder(nth+1)
                        }else {
                            if(res.File == null) {
                                rerender()
                                mobilenew("bsc")
                                document.querySelector(".loadwrapper").classList.add("loadwrapperhide")
                            }
                        }
                    }
                    catch(decryptionErr) {
                        console.error(decryptionErr)
                    } 
    
                }
            }
            if(res.File != null) {
                var tk = await localforage.getItem("tk")
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", "https://petadrop.com/api/thumbhandle/")
                    xhr.setRequestHeader("Authorization", tk.slice(0, 200))           
                    xhr.setRequestHeader("x-xwc-act", "get") 
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === xhr.DONE) {
                            if (xhr.status === 200) {
                                    if(JSON.parse(xhr.response).Finaldta != null) {
                                        tmbloop(0)
                                        async function tmbloop(i) {
                                            var fid = JSON.parse(JSON.parse(xhr.response).Finaldta[i]).Id
                                            var raw = decode(JSON.parse(JSON.parse(xhr.response).Finaldta[i]).Thumb)
                                            var iv=raw.slice(0, 12);
                                            var salt=raw.slice(12, 28);
                                            var storedToken = await localforage.getItem("tk")
                                            var fle = raw.slice(28)
                                            var decrypted = await decryptFromPw(storedToken.slice(200), iv, salt, fle)
                                            var url = URL.createObjectURL(new Blob([decrypted], {type: "image/jpeg"}))
                                            var v = elem.findIndex(function(item) {return item.id === fid})
                                            if (v != -1 ) {
                                                elem[v].src= url
                                            }
                                            if(i == (JSON.parse(xhr.response).Finaldta).length -1) {
                                                rerender()
                                            }else {
                                                tmbloop(i+1)
                                            }
                                        }
                                    }
                                
                            }
                        }
                    }
                    xhr.send()
                var enc = new TextEncoder();
                var decer = new TextDecoder();
                decdata(0)
                async function decdata(datadecnth) {
                    var finalfiledata = JSON.parse(res.File[datadecnth])
                    var fnbuffer = decode(finalfiledata.Name)
                    var salt = fnbuffer.slice(0,16);
                    var iv = fnbuffer.slice(16,28);
                    var realname = fnbuffer.slice(28);
                    var impk = await crypto.subtle.importKey("raw", enc.encode(storedToken.slice(200)), "PBKDF2", false, ["deriveKey", "deriveBits"])
                    var derivedkey = await crypto.subtle.deriveKey({"name": "PBKDF2",salt: salt,"iterations": 100000, "hash": "SHA-256"}, impk, { name: "AES-GCM", length: 256},false,[ "encrypt", "decrypt" ])
                    var dec = await crypto.subtle.decrypt({name: 'AES-GCM',iv: iv}, derivedkey, realname)
                    elem.push({name : decer.decode(dec), size : finalfiledata.Size, mime : finalfiledata.Mime, date : convert_timezone(finalfiledata.Date), id : finalfiledata.Id, state : state, dir : finalfiledata.Dir, src: ""})
                    if(res.Folder != null) {
                        percentage = elem.length/(res.File.length + res.Folder.length)
                    }else {
                        percentage = elem.length/(res.File.length)
                    }
                    document.querySelector(".loadinglabel").innerText = "Decrypting, "+Math.round(percentage*100)+"% Done"
                    document.querySelector("#loadwrapperloading").style="stroke-dashoffset:"+(1850 - (1850*(percentage)))+";fill:none;"
                    if(datadecnth < res.File.length -1) {
                        decdata(datadecnth+1)
                    }else {
                        mobilenew("bsc")
                        document.querySelector(".loadwrapper").classList.add("loadwrapperhide")
                        rerender()
                    }
                }
            }
            if(res.File == null && res.Folder == null) {
                mobilenew("bsc")
                document.querySelector(".loadwrapper").classList.add("loadwrapperhide")
                ReactDOM.render(
                    <div class='filenotfound'>Nothing Here ..Yet</div>,
                    document.querySelector(".mainarea")
                )
            }
        }else {
            document.querySelector(".loadinglabel").innerText = res.Rcode.toString();
        }
    
    }
    
    export function logout() {
        localforage.getItem("tk").then(function(storedToken) {
            if(storedToken == null) {
                console.log("ur not even logged in bruh")
            }else {
                localforage.removeItem("tk");
            }
            document.location.href="https://petadrop.com/";
        })
    }
    var list1= []
    export async function getShared() {
        ReactDOM.render (
            <p className="dirbold"><b>Shared Files</b></p>,
            document.querySelector('.dirArea')
          )
          ReactDOM.render (
            <></>,
            document.querySelector('.aligniconArea')
          )
        ReactDOM.render(
            <div className="loading"><img src="https://cdn.xdcs.me/static/main/loading.gif" width="25px"></img></div>,
            document.querySelector(".mainarea")
        )
        var storedToken = await localforage.getItem("tk")
        let resp = await fetch("https://petadrop.com/api/udfetch",{method: 'POST', headers:{'Authorization': storedToken.slice(0,200), 'x-xwc-act': 'getshared'}})
        var json = await resp.json()
        console.log(json["Links"].length)
        var fl=[]
        if(localStorage.getItem("arrange") == 1) {
            fl.push(<Arrangebar />)
        }else if(localStorage.getItem("arrange") == 0) {
            fl.unshift(<Arrangebar />)
        }
        for(var i=0;i<json["Links"].length; i++) {
            var nthJson = JSON.parse(json["Links"][i])
            const itemToFind = elem.find(function(item) {return item.id === nthJson.Id})
            var index = elem.indexOf(itemToFind);
            if (index > -1) {
                var ea2 = elem[index]
                fl.push(<Filecont name={ifempty(ea2.name)} size={ifempty(calcsize(ea2.size))} mime={ifempty(ea2.mime)} date={ea2.date} id={ea2.id} state="row" typ={ea2.typ} src={ea2.src}/>)
            }
        }
        ReactDOM.unmountComponentAtNode(document.querySelector('.mainheader'))
        ReactDOM.render(
            fl,
            document.querySelector(".mainarea")
        )
    }

    export async function mainMenu() {
        rerender()
        ReactDOM.render (
            <Alignicon />,
            document.querySelector(".aligniconArea")
          )
        ReactDOM.render (
            [<Dir a={list1}/>],
            document.querySelector('.dirArea')
          )
    }
    var list1 = []
    export function gotofolder(target, name) {
        for(var i=0;i<document.querySelectorAll(".leftclicked").length;i++) {
            document.querySelectorAll(".leftclicked")[i].classList.remove("leftclicked")
        }
        if(target.split(" ")[1] != 0) {
            list1[target.split(" ")[1]] = (<b id={target} onClick={()=>gotofolder(target, name)}>&gt;{name}</b>)
        }else {
            list1 = []
        }
        if(list1.length>target.split(" ")[1]) {
            var i = list1.length - target.split(" ")[1]
            while(i > 1) {
                i = i-1
                list1.pop()
            }
        }
        ReactDOM.render(
            [<Dir a={list1}/>],
            document.querySelector(".dirArea")
        )
        var elem2 = []
            var target2 = target.split(" ")[0] +" "+ (parseInt(target.split(" ")[1]))
        
            var state;
            if(localStorage.getItem("arrange") == 1) {
                state = "row"
            }else {
                state = ""
            }

        curdir = target2
        for(var i=0;i<elem.length;i++) {
            var ea2 = elem[i]
            if(ea2.dir == target2) {
                elem2.push(<Filecont name={ifempty(ea2.name)} size={ifempty(calcsize(ea2.size))} mime={ifempty(ea2.mime)} date={ea2.date} id={ea2.id} state={state} typ={ea2.typ} src={ea2.src}/>)
            }
            
        }
        if(window.localStorage.getItem("arrange") == 1) {
            elem2.unshift(<Arrangebar />)
        }
        
        ReactDOM.render(
            elem2,
            document.querySelector(".mainarea")
        )
    }
    export async function delfile(id) {
        var storedToken = await localforage.getItem("tk")
            var form = new FormData();
            form.append("fid", id)
            try {
                let resp = await fetch("https://petadrop.com/api/udfetch",{method: 'DELETE',body: form,headers:{'Authorization': storedToken.slice(0,200)}})
                var json = await resp.json()
                if(json.Rcode == "Success") {
                    const itemToFind = elem.find(function(item) {return item.id === id})
                    var index = elem.indexOf(itemToFind);
                    if (index > -1) {
                        elem.splice(index, 1);
                        rerender()
                    }
                }
            }
            catch(e) {
                console.error(e)
            }

    }
    export function openSetting() {

    }
    export function createfolder() {
        function del() {
            ReactDOM.unmountComponentAtNode(document.querySelector("#sharearea"))
        }
        ReactDOM.render(
            <div class="sharebackground">
                    <div className="createfolder">
                <div className="folderheader">Create a folder</div>
                <div className="folderbody">
                    <input type="text" id="folder_name_cont" placeholder="Folder Name">
    
                </input>
                <div className="btnarea">
                    <div className="btn" onClick={send}>
                            Create
                    </div>
                    <div className="btn" onClick={del}>
                        Cancel
                    </div>
                </div>
                </div>
    
            </div>
            </div>,
            document.querySelector("#sharearea")
        )
        async function send() {
            var name = document.querySelector("#folder_name_cont").value
            if(name.length > 0) {
            var salt = crypto.getRandomValues(new Uint8Array(16))
            var iv = crypto.getRandomValues(new Uint8Array(12))
            let storedToken = await localforage.getItem("tk")
            var pww = storedToken.slice(200);
            var enc = new TextEncoder()
            try {
                var impk = await crypto.subtle.importKey("raw",enc.encode(pww),"PBKDF2",false,["deriveKey", "deriveBits"])
                var derivedkey = await crypto.subtle.deriveKey({"name": "PBKDF2",salt: salt, "iterations": 100000, "hash": "SHA-256" }, impk, {"name": "AES-GCM", "length": 256 }, false, [ "encrypt", "decrypt" ])
                var encryptedfn = await crypto.subtle.encrypt({ name: 'AES-GCM',iv: iv }, derivedkey, enc.encode(name))

                encryptedfn = new Uint8Array(encryptedfn)
                var finbuf = new Uint8Array(encryptedfn.length + 28)
                finbuf.set(salt, 0)
                finbuf.set(iv, 16)
                finbuf.set(encryptedfn, 28)
                var form = new FormData();
                form.append("curentdirindex", curdir.split(" ")[0] +" "+ ( parseInt(curdir.split(" ")[1])))
                form.append("name", encode(finbuf))
                form.append("action", "create")
                try {
                    var resp = await fetch("https://petadrop.com/api/folderhandle", {method: 'POST', body: form, headers:{'Authorization': storedToken.slice(0, 200)}})
                    var json = await resp.json()
                    if(json.Message == "success") {
                        updatedata()
                        del()
                    }else {
                        console.error("error")
                    }
                }
                catch(fetchErr) {
                    console.error(fetchErr)
                }
            }
            catch(decryptionErr) {
                console.error(decryptionErr)
            }
        }
    }}

    export async function singlefile(fid, link) {
        var form = new FormData()
        form.append("dir", new TextDecoder().decode(fid))
        var storedToken = await localforage.getItem("tk")
        try {
            var response = await fetch('https://petadrop.com/api/udfetch', {method: 'POST', body: form, headers:{'X-XWC-act': 'of', 'Authorization': storedToken.slice(0, 200)}})
            let rJson = await response.json()
            let originAb = decode(rJson.Name)
            var encryptedData = new Uint8Array(originAb.slice(28))
            var salt = new Uint8Array(originAb.slice(0, 16))
            var iv = new Uint8Array(originAb.slice(16, 28))
            var state;
            if(localStorage.getItem("arrange") == 1) {
                state = "row"
            }else {
                state = ""
            }
            try {
                var decData = await decryptFromPw(storedToken.slice(200), iv, salt, encryptedData)
                var dec = new TextDecoder();
                elem.push({name : dec.decode(decData), size : rJson.Size, mime : rJson.Mime, date : convert_timezone(rJson.Date), id : rJson.Id, state : state, dir : rJson.Dir, src : link})
                rerender()
            }
            catch(decryptionErr) {
                console.error(decryptionErr)
            }
        }
        catch(fetchErr) {
            console.error(fetchErr)
        }
    }


    export async function updatedata(link) {
        var insertedTmb
        if (link != null) {
            insertedTmb = link
        }else if (link == null) {
            insertedTmb = ""
        }
        var form = new FormData();
        form.append("lt", curtime)
        var storedToken = await localforage.getItem("tk")
        var resp = await fetch('https://petadrop.com/api/udfetch', {method: 'POST', body: form, headers:{'X-XWC-act': 'nf', 'Authorization': storedToken.slice(0, 200)}})
        if(!resp.ok) {
            console.error(resp.status)
        }
        var json = await resp.json()
        if(json.File != null || json.Folder != null || json.Deletedfile != null) {
            curtime = json.Timestamp
        }
        var state;
        if(json.Folder != null || json.File != null) {
            if(window.localStorage.getItem("arrange") == 1) {
                state = "row";
            }
            else {
                state = "";
            }
            if(json.Folder != null) {
                    decfolder(0)
                    async function decfolder(nth) {
                        var folders = JSON.parse(json.Folder[nth])
                        var encryptedname = decode(folders.Name)
                        var salt = new Uint8Array(encryptedname.slice(0, 16))
                        var iv = new Uint8Array(encryptedname.slice(16, 28))
                        var realdata2 = new Uint8Array(encryptedname.slice(28))
                        var decdata = await decryptFromPw(storedToken.slice(200), iv, salt, realdata2)
                        var dec = new TextDecoder();
                        elem.push({name : dec.decode(decdata), size : folders.Size, mime : "N/A", date : convert_timezone(folders.Date), id : folders.Fid + " " +folders.Index.split(" ")[1], state : state, typ: "folder", dir : folders.Index}) 
                        if(nth < json.Folder.length -1) {
                            decfolder(nth+1)
                        }else {
                            rerender()
                        }
                    }
                

            }
            if(json.File != null) {
                var decer = new TextDecoder();
                decdata(0)
                async function decdata(datadecnth) {
                    var finalfiledata = JSON.parse(json.File[datadecnth])
                    var fnbuffer = decode(finalfiledata.Name)
                    var salt = fnbuffer.slice(0,16);
                    var iv = fnbuffer.slice(16,28);
                    var realname = fnbuffer.slice(28);
                    var dec = await decryptFromPw(storedToken.slice(200), iv, salt, realname)
                    elem.push({name : decer.decode(dec), size : finalfiledata.Size, mime : finalfiledata.Mime, date : convert_timezone(finalfiledata.Date), id : finalfiledata.Id, state : state, dir : finalfiledata.Dir, src : insertedTmb})
                    if(datadecnth < json.File.length -1) {
                        decdata(datadecnth+1)
                    }else {
                        rerender()
                    }

                }
            }
        }
        if(json.Deletedfile != null) {
            for(var i=0;i<json.Deletedfile.length;i++) {
                const itemToFind = elem.find(function(item) {return item.id === JSON.parse(json.Deletedfile[i]).Id})
                var index = elem.indexOf(itemToFind);
                if (index > -1) {
                    elem.splice(index, 1);
                    rerender()
                }
            }
        }
    }
    function rerender() {
        var elem2 = []
        for(var i=0;i<elem.length;i++) {
            var ea2 = elem[i]
            if(ea2.dir == curdir) {
                elem2.push(<Filecont name={ifempty(ea2.name)} size={ifempty(calcsize(ea2.size))} mime={ifempty(ea2.mime)} date={ea2.date} id={ea2.id} state={ea2.state} typ={ea2.typ} src={ea2.src}/>)
            }
        }
        if(window.localStorage.getItem("arrange") == 1) {
            elem2.unshift(<Arrangebar />)
        }
    ReactDOM.render(
        elem2,
        document.querySelector(".mainarea")
    )
    elem2=[]
    }
    export {elem as originalelem};