import { readAndCompressImage } from 'browser-image-resizer';
import { encode,decode } from 'base64-arraybuffer';
import {mobilenew} from './index.js'
import localforage from 'localforage';
import {Uploadnotify} from './comp'
import React from 'react';
import ReactDOM from 'react-dom';

  export function pfpinput() {
    const imgs = ['jpg', 'jpeg', 'png'];
      var file = document.querySelector('#pfpuploader').files[0]
      var filen = file.name.split('.')
      if(imgs.indexOf(filen[filen.length - 1].toLowerCase()) !== -1) {

        const config = {
          quality: 0.5,
          maxWidth: 500,
          maxHeight: 500,
          autoRotate: false,
          debug: false
        }
        readAndCompressImage(file, config).then(function(resizedpfp) {
          localforage.getItem("tk").then(function(storedToken) {
            var xhr = new XMLHttpRequest;
            xhr.open('POST', 'https://petadrop.com/api/pfph');
            xhr.onreadystatechange = function() {
                if (xhr.readyState === xhr.DONE) {
                    if (xhr.status === 200) {
                        var form = new FormData();
                        fetch('https://petadrop.com/api/udfetch', {method: 'POST', body: form, headers:{'X-XWC-act': 'pfpf', 'Authorization': storedToken.slice(0, 200)}}).then(function(resp) {
                          if(resp.ok) {
                            return resp.json()
                          }
                        }).then(function(json) {
                          console.log(json)
                          var pfpb64 = json.Pfp;
                          var sarray = pfpb64.split("|");
                          processpfp(sarray[0], sarray[1], sarray[2]);
                          mobilenew("bsc").then(function() {
                            if(window.innerWidth > 760) {
                              document.querySelector('.uploadnotify').classList.remove('show');
                              ReactDOM.render(
                                <></>,
                                document.querySelector("#ules")
                            )
                            }else {
                                document.querySelector('.mobile-uploadbtn').classList.remove('uploading');
                            }
                          })
                        })
                    }
                }
            };
            const reader = new FileReader()
            reader.onloadend = function() {
              var buffer = reader.result;
              var iv = crypto.getRandomValues(new Uint8Array(16));
              var salt = crypto.getRandomValues(new Uint8Array(16))
    
                  var pww = storedToken.slice(200);
                  let enc = new TextEncoder();
                  crypto.subtle.importKey(
    
                      "raw",
                      enc.encode(pww), 
                      {name: "PBKDF2"},
                      false,
                      ["deriveBits", "deriveKey"]
    
                  ).then(function(impk) {
                    crypto.subtle.deriveKey({
    
                      "name": "PBKDF2",
                      salt: salt,
                      "iterations": 100000,
                      "hash": "SHA-256"   
                      }, 
    
                      impk,
                      { "name": "AES-CBC", "length": 256},
                      false,
                      [ "encrypt", "decrypt" ]
    
                        ).then(function(key) {
                        crypto.subtle.encrypt({ 
                          'name': 'AES-CBC',
                            iv 
                          }, key, buffer).then(function(encrypted) {
                            mobilenew("upchk").then(function() {
                              if(window.innerWidth > 760) {
                            ReactDOM.render(
                                <Uploadnotify name={"Updating Profile Picture.."} size={""} progid={""} act={"pfp"} />,
                                document.querySelector("#ules")
                            )
                            document.querySelector('.uploadnotify').classList.add('show');
                            }else {
                                document.querySelector('.mobile-uploadbtn').classList.add('uploading');
                        
                            }
                          })
                            var tk = storedToken.slice(0,200);
                            console.log(encode(encrypted))
                            var form = new FormData();
                            form.append('pfp', encode(encrypted)+"|"+encode(iv)+"|"+encode(salt));
                            xhr.setRequestHeader("Authorization", tk)
                            xhr.send(form);
                          })
                        })
                  })
              }
              reader.readAsArrayBuffer(resizedpfp);
          })
        })
      }else {
        console.log("unallowed file type")
      }
  }
  export function processpfp(value, iv, salt) {
    var iv=decode(iv);
    var salt=decode(salt);

    var f = decode(value)
    localforage.getItem("tk").then(function(storedToken) {
      var pww = storedToken.slice(200);
      let enc = new TextEncoder();
      crypto.subtle.importKey(
        
        "raw",
        enc.encode(pww), 
        {name: "PBKDF2"},
        false,
        ["deriveBits", "deriveKey"]
  
    ).then(function(impk) {
      crypto.subtle.deriveKey({
  
        "name": "PBKDF2",
        salt: salt,
        "iterations": 100000,
        "hash": "SHA-256"   
        }, 
  
        impk,
        { "name": "AES-CBC", "length": 256},
        false,
        [ "encrypt", "decrypt" ]
  
         ).then(function(key) {
          crypto.subtle.decrypt({ 
            name: 'AES-CBC',
             iv: iv 
            }, key, f).then(function(decrypted) {
              
              encode(decrypted);
              var l = document.querySelectorAll('.pfpimg');
              for(var i=0;i<l.length;i++) {
                l[i].src = URL.createObjectURL(new Blob([decrypted], {type: "image/jpeg"}))
              }
            })
         })
      })
    })
}
