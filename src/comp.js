import React from 'react';
import {openleftbar, arrange, pfpmenu, hideoverlaycont, showfilelabel, logout, alignby, delfile, gotofolder, rclick, createfolder, openSetting} from './main.js';
import {pfpinput} from './pfphandler.js';
import {rvf as newrvf, stopdownload} from './newviewfile'
import ReactDOM from 'react-dom';
import share from './createlink.js';
import copy from 'copy-text-to-clipboard';
import filename2prism from 'filename2prism';
import localforage from 'localforage';
import SyntaxHighlighter from "react-syntax-highlighter";
import { arta } from 'react-syntax-highlighter/dist/esm/styles/hljs';
const vars = require('./vars.json')

export class SharedArrangebar extends React.Component {
    render() {
        return(
            <div className="file_align_control_bar">
                <div className="align_by_name">
                    <b>Name</b></div>
                    <div className="align_not_name">
                                <div className="pre_revoke">
                                    <b>Revoke</b></div>
                                    <div className="align_by_date">
                                    <b>Date</b></div>
                    </div>
            </div>
        )
    }
}

export class SharedFileCont extends React.Component {
    constructor(props) {
        super(props)
        this.state = {revokestat: "Revoke", cls: ""}
    }
    async revoke() {
        if(this.state.revokestat == "Revoke") {
          this.setState({revokestat: "Revoking.."})
          var form = new FormData()
          form.append("target", this.props.id)
          var storedToken = await localforage.getItem("tk")
          var r = await fetch("https://petadrop.com/api/goshare", {method: 'DELETE', body: form, headers:{'Authorization': storedToken.slice(0, 200)}})
          if(r.ok) {
              var jsn = await r.json()
              if(jsn.Status == "Success") {
                 this.setState({cls: "hide"})
              }
          }
            
        }
        
    }
    render() {
        var icon
        var imgwidth
        if(!this.props.src) {
            var a = this.props.name.split(".")[this.props.name.split(".").length - 1];
            var base = "https://cdn.xdcs.me/static/main"
            if(vars.textfile.indexOf(a) != -1) {
                icon = base+"/tesxt.png"
            }else if(vars.imagefile.indexOf(a) != -1) {
                icon = base+"/img.png"
            }else if(vars.codefile.indexOf(a) != -1) {
                icon = base+"/code.png"
            }else if(vars.vidfile.indexOf(a) != -1) {
                icon = base+"/vid.png"
            }else if(vars.audiofile.indexOf(a) != -1){
                icon = base+"/mus.png"
            }else {
                icon=base+"/ssa.png"
            }
        }else {
            icon = this.props.src
        }
        if(this.props.state == "row") {
            imgwidth = "20px"
        }else if(this.props.state == "") {
            imgwidth = "50px"
            if(this.props.src != "") {
                imgwidth = "70px"
            }
        }
        if(this.props.typ == "folder") {
            var inx = this.props.id.split(" ")
            return(
                <>
                <div className={'filecont ' + this.props.state +" "+ this.state.cls} id={this.props.id} onDoubleClick={()=>gotofolder(inx[0] +" "+ parseInt(parseInt(inx[1]) + 1), this.props.name)}>
        
                    <div className={'imagecontainer' + this.props.state}>
                    <div className={'filecontmb ' + this.props.state} style={{borderRadius:"5px", background:"none"}}>
                    <svg version="1.1" x="0px" y="0px" className="foldericon" viewBox="0 0 600 600">
                    <g>
                        <path className="st0" style={{fill:"#FFFFFF"}} d="M302.06,549.6c-64.67,0-129.35,0.1-194.02-0.03c-48.6-0.1-84.46-25.41-99.43-70.95
                        c-3.19-9.7-4.39-20.45-4.43-30.73C3.86,357.02,3.76,266.16,4.07,175.3C4.32,105.16,58.61,51.11,128.85,50.43
                        c19.51-0.19,39.02,0.02,58.53-0.05c42.78-0.15,77.05,17.23,103.2,50.66c3.81,4.87,7.56,6.26,13.36,6.24
                        c63.87-0.18,127.74-0.1,191.61-0.12c37.49-0.02,67.42,14.66,88.27,46.15c9.59,14.48,15.6,30.58,15.64,48.17
                        c0.22,83.64,1.14,167.3-0.09,250.92c-0.83,56.44-45.34,97-103.3,97.16C431.41,549.74,366.73,549.6,302.06,549.6z"/>
                    </g>
                    </svg>

                    </div>
                    </div>
                  <div className={'label ' + this.props.state}>
                      <p className= {'text ' + this.props.state}>{this.props.name}</p>
                      <div className='filedetail'>
                      <p className={'text ' + this.props.state} id='dtl'>Shared</p>
                          <p className={'text ' + this.props.state} id='dtl'><div className="revokebtn">{this.state.revokestat}</div></p>
                          <p className={'text ' + this.props.state} id='dtl'>{this.props.date}</p>
                      </div>
                  </div>
                  <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 100 100" width="20px" onClick={(e)=>rclick(e)} className={'fileoptiontdot ' + this.props.state}><circle cx="50" cy="17.5" r="9.92"></circle><circle cx="50.21" cy="49" r="9.92"></circle><circle cx="50" cy="80.51" r="9.92"></circle></svg>
                </div>   
                </>
              )
        }else {
            return(
                <>
                <div className={'filecont ' + this.props.state +" "+ this.state.cls} id={this.props.id} onDoubleClick={()=> newrvf(this.props.id, "0:5242925")} onDrag={(e)=>this.dragstrt(e)}>
        
                    <div className={'imagecontainer' + this.props.state}>
                    <img className={'filecontmb ' + this.props.state} src={icon} width={imgwidth} height={imgwidth} style={{borderRadius:"5px"}}/>
                    </div>
                  <div className={'label ' + this.props.state}>
                      <p className= {'text ' + this.props.state}>{this.props.name}</p>
                      <div className='filedetail'>
                      <p className={'text ' + this.props.state} id='dtl'>Shared</p>
                      <p className={'text ' + this.props.state} id='dtl'><div className="revokebtn" onClick={()=>this.revoke()}><b>{this.state.revokestat}</b></div></p>
                          <p className={'text ' + this.props.state} id='dtl'>{this.props.date}</p>
                      </div>
                  </div>
                  <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 100 100" width="20px" onClick={(e)=>rclick(e)} className={'fileoptiontdot ' + this.props.state}><circle cx="50" cy="17.5" r="9.92"></circle><circle cx="50.21" cy="49" r="9.92"></circle><circle cx="50" cy="80.51" r="9.92"></circle></svg>
                </div>   
                </>
              )
        }
    }
}
export class Filecont extends React.Component {
    dragstrt(e) {
        e.preventDefault();

    }

    singleclick(id) {

        var inx = this.props.id.split(" ")
        if(id.split(" ").length > 1 && window.innerWidth < 760) {
            gotofolder(inx[0] +" "+ parseInt(parseInt(inx[1]) + 1), this.props.name)
        }else if(id.split(" ").length == 1 && window.innerWidth < 760) {
            newrvf(this.props.id, "0:5242925")
        }else {
            for(var i=0;i<document.querySelectorAll(".leftclicked").length;i++) {
                document.querySelectorAll(".leftclicked")[i].classList.remove("leftclicked")
            }
            document.getElementById(id).classList.add("leftclicked")
        }
        //document.querySelector("#"+el).classList.add("leftclicked")
    }
    render() {
        var icon
        var imgwidth
        if(!this.props.src) {
            var a = this.props.name.split(".")[this.props.name.split(".").length - 1];
            var base = "https://cdn.xdcs.me/static/main"
            if(vars.textfile.indexOf(a) != -1) {
                icon = base+"/tesxt.png"
            }else if(vars.imagefile.indexOf(a) != -1) {
                icon = base+"/img.png"
            }else if(vars.codefile.indexOf(a) != -1) {
                icon = base+"/code.png"
            }else if(vars.vidfile.indexOf(a) != -1) {
                icon = base+"/vid.png"
            }else if(vars.audiofile.indexOf(a) != -1){
                icon = base+"/mus.png"
            }else {
                icon=base+"/ssa.png"
            }
        }else {
            icon = this.props.src
        }
        if(this.props.state == "row") {
            imgwidth = "20px"
        }else if(this.props.state == "") {
            imgwidth = "50px"
            if(this.props.src != "") {
                imgwidth = "70px"
            }
        }
        if(this.props.typ == "folder") {
            var inx = this.props.id.split(" ")
            return(
                <>
                <div className={'filecont ' + this.props.state} id={this.props.id} onClick={()=>this.singleclick(this.props.id)} onDoubleClick={()=>gotofolder(inx[0] +" "+ parseInt(parseInt(inx[1]) + 1), this.props.name)}>
        
                    <div className={'imagecontainer' + this.props.state}>
                    <div className={'filecontmb ' + this.props.state} style={{borderRadius:"5px", background:"none"}}>
                    <svg version="1.1" x="0px" y="0px" className="foldericon" viewBox="0 0 600 600">
                    <g>
                        <path className="st0" style={{fill:"#FFFFFF"}} d="M302.06,549.6c-64.67,0-129.35,0.1-194.02-0.03c-48.6-0.1-84.46-25.41-99.43-70.95
                        c-3.19-9.7-4.39-20.45-4.43-30.73C3.86,357.02,3.76,266.16,4.07,175.3C4.32,105.16,58.61,51.11,128.85,50.43
                        c19.51-0.19,39.02,0.02,58.53-0.05c42.78-0.15,77.05,17.23,103.2,50.66c3.81,4.87,7.56,6.26,13.36,6.24
                        c63.87-0.18,127.74-0.1,191.61-0.12c37.49-0.02,67.42,14.66,88.27,46.15c9.59,14.48,15.6,30.58,15.64,48.17
                        c0.22,83.64,1.14,167.3-0.09,250.92c-0.83,56.44-45.34,97-103.3,97.16C431.41,549.74,366.73,549.6,302.06,549.6z"/>
                    </g>
                    </svg>

                    </div>
                    </div>
                  <div className={'label ' + this.props.state}>
                      <p className= {'text ' + this.props.state}>{this.props.name}</p>
                      <div className='filedetail'>
                          <p className={'text ' + this.props.state} id='dtl'>N/A</p>
                          <p className={'text ' + this.props.state} id='dtl'>Folder</p>
                          <p className={'text ' + this.props.state} id='dtl'>{this.props.date}</p>
                      </div>
                  </div>
                  <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 100 100" width="20px" onClick={(e)=>rclick(e)} className={'fileoptiontdot ' + this.props.state}><circle cx="50" cy="17.5" r="9.92"></circle><circle cx="50.21" cy="49" r="9.92"></circle><circle cx="50" cy="80.51" r="9.92"></circle></svg>
                </div>   
                </>
              )
        }else {
            return(
                <>
                <div className={'filecont ' + this.props.state} id={this.props.id} onClick={()=>this.singleclick(this.props.id)} onDoubleClick={()=> newrvf(this.props.id, "0:5242925")} onDrag={(e)=>this.dragstrt(e)}>
        
                    <div className={'imagecontainer' + this.props.state}>
                    <img className={'filecontmb ' + this.props.state} src={icon} width={imgwidth} height={imgwidth} style={{borderRadius:"5px"}}/>
                    </div>
                  <div className={'label ' + this.props.state}>
                      <p className= {'text ' + this.props.state}>{this.props.name}</p>
                      <div className='filedetail'>
                          <p className={'text ' + this.props.state} id='dtl'>{this.props.size}</p>
                          <p className={'text ' + this.props.state} id='dtl'>{this.props.mime}</p>
                          <p className={'text ' + this.props.state} id='dtl'>{this.props.date}</p>
                      </div>
                  </div>
                  <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 100 100" width="20px" onClick={(e)=>rclick(e)} className={'fileoptiontdot ' + this.props.state}><circle cx="50" cy="17.5" r="9.92"></circle><circle cx="50.21" cy="49" r="9.92"></circle><circle cx="50" cy="80.51" r="9.92"></circle></svg>
                </div>   
                </>
              )
        }
    }
}
export class Arrangebar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {namearrow: "", sizearrow: "", typearrow: "", datearrow: "", flipped:false }
        this.arrowpos = this.arrowpos.bind(this);
    }
    arrowpos(s) {
        var styledom
        if(this.state.flipped) {
            styledom = {transform : "rotate(180deg)"}
        }else {
            styledom = {transform : "rotate(0deg)"}
        }
        var arrow = <svg className="alignarrow" x="0px" y="0px" viewBox="0 0 720 720" style={styledom}>
        <path className="arrowpath" d="M330.2,227.2L187.7,474.1c-10.6,18.3,2.6,41.3,23.8,41.3h285c21.2,0,34.4-22.9,23.8-41.3L377.8,227.2
            C367.2,208.9,340.8,208.9,330.2,227.2z"/>
        </svg>
            if(s == "name") {
                this.setState({namearrow : arrow, sizearrow: "", typearrow: "", datearrow: ""})
            }else if(s == "size") {
                this.setState({namearrow : "", sizearrow: arrow, typearrow: "", datearrow: ""})
            }else if(s == "mime") {
                this.setState({namearrow : "", sizearrow: "", typearrow: arrow, datearrow: ""})
            }else if(s == "date") {
                this.setState({namearrow : "", sizearrow: "", typearrow: "", datearrow: arrow})
            }
            var direction;
            if(this.state.flipped) {
                this.setState({flipped:false})
                direction = false;
            }else {
                this.setState({flipped:true})
                direction = true;

            }
        alignby(s, direction)
    }
    render() {
        return(
            <div className="file_align_control_bar">
                <div className="align_by_name" onClick={()=>this.arrowpos("name")}>
                    <b>Name</b>{this.state.namearrow}</div>
                    <div className="align_not_name">
                        <div className="align_by_size" onClick={()=>this.arrowpos("size")}>
                            <b>Size</b>{this.state.sizearrow}</div>
                            <div className="align_by_type" onClick={()=>this.arrowpos("mime")}>
                                <b>Mime</b>{this.state.typearrow}</div>
                                <div className="align_by_date" onClick={()=>this.arrowpos("date")}>
                                    <b>Date</b>{this.state.datearrow}</div>
                    </div>
            </div>
        )
    }
}
export class Lbtnclick extends React.Component {
    render() {
        const binst = this.props.blank_instances;
        var id = this.props.id
        var a=[]
        binst.forEach(function(e) {
            if(e == "View") {
                a.push(<div className="rclickmenubtn" data-ctx={id}>{e}</div>)
            }else if(e == "Change View") {
                a.push(<div className="rclickmenubtn" onClick={arrange}>{e}</div>)
            }else if(e == "Share") {
                a.push(<div className="rclickmenubtn" onClick={()=> share(id)}>{e}</div>)
            }else if(e == "Delete") {
                a.push(<div className="rclickmenubtn" onClick={()=> delfile(id)}>{e}</div>)
            }else if(e == "Download") {
                a.push(<div className="rclickmenubtn">{e}</div>)
            }
            else {
                a.push(<div className="rclickmenubtn">{e}</div>)
            }
        })
        return(
                <div>
                    {a}
                </div>
        );
    }
}
  export class Overlay extends React.Component {
    render() {
        if(this.props.show) {
            return (
            <div className="overlayarea" onClick={()=>remove()}></div>
            )
        }
        else {
            return(
                <></>
            )
        }
    }
  }
  function remove() {
      document.querySelector(".rclickmenu").classList.add("hidden")
      ReactDOM.render(
      <Overlay show ={false} />,
      document.querySelector('#olay')
      )
  }
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  export class Sharearea extends React.Component {
    constructor(props) {
        super(props);
        this.copylink = this.copylink.bind(this);
        this.delete = this.delete.bind(this);
        this.state = {copystat: "Copy Link", revokestat: "Revoke"}
      }
    copylink() {
        copy(this.props.link)
        this.setState({copystat: "Copied!"})
        sleep(1000).then(()=> {this.setState({copystat: "Copy Link"})})
      }
      delete() {
        ReactDOM.unmountComponentAtNode(document.querySelector('#sharearea'))
      }
      async revoke() {
          if(this.state.revokestat == "Revoke") {
            this.setState({revokestat: "Revoking.."})
            var form = new FormData()
            form.append("target", this.props.id)
            var storedToken = await localforage.getItem("tk")
            var r = await fetch("https://petadrop.com/api/goshare", {method: 'DELETE', body: form, headers:{'Authorization': storedToken.slice(0, 200)}})
            if(r.ok) {
                var jsn = await r.json()
                if(jsn.Status == "Success") {
                    ReactDOM.unmountComponentAtNode(document.querySelector('#sharearea'))
                }
            }
              
          }
          
      }
      render() {
          var b
          var a
          if(this.props.loading) {
                b = <><b>Loading Data</b></>
                a=<></>
          }else {
                a= <b style={{color: "#ad3636"}} onClick={()=>this.revoke()}>{this.state.revokestat}</b>
                b = <div className="linkshare_area"><input type="text" id="linkareacopy"readOnly value={this.props.link}></input><b onClick={this.copylink}>{this.state.copystat}</b></div>
          }
          
          return(
              <div className="sharebackground">
                <div className="sharearea">
                  <div className="sharearea_header"><b>Share This File</b>
                  <div className="exit" onClick={this.delete}><span></span><span></span></div>
                  </div>
                  <div className="sharearea_body">{b}</div>
                  <div className="sharearea_footer">{a}</div>
                </div>
              </div>
          )
      }
  }
  export class Fileviewarea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {sc: -1};
        this.delete = this.delete.bind(this);
      }
      imgload() {
        if(document.querySelector(".viewerimage").width > window.innerWidth) {
            this.setState({
                sc: window.innerWidth
              })
        }else {
            this.setState({
                sc: document.querySelector(".viewerimage").width
              })
        }
      }
      listner(e) {
          if(!(this.state.sc < 100) || (e.deltaY/-100) == 1) {
            this.setState({
                sc: ((this.state.sc) + 70*(e.deltaY/-100))
              });
          }
      }
      vidload() {
        if(document.querySelector(".viewervid").videoWidth > window.innerWidth) {
            this.setState({
                sc: window.innerWidth
              })
        }else if((document.querySelector(".viewervid").videoWidth <= window.innerWidth)) {
            this.setState({
                sc: document.querySelector(".viewervid").videoWidth
              })
        }
      }
      delete(){
          document.querySelector(".dark").classList.remove("show")
          document.querySelector("body").classList.remove("ovx")
          this.setState({
            sc: -1
          })
          ReactDOM.unmountComponentAtNode(document.querySelector('.dark'))
          document.querySelector(".fileviewer").classList.remove("show")
          ReactDOM.unmountComponentAtNode(document.querySelector('.fileviewer'))
      };
      render() {
          var type
          var codetype = filename2prism(this.props.name)
          if(codetype.length != 0) {
              var xhr = new XMLHttpRequest();
              xhr.open( "GET",this.props.src, false)
              xhr.send()
            type = <SyntaxHighlighter style={arta} language={codetype[0].toLowerCase()} showLineNumbers={true} lineNumberContainerStyle={{marginLeft:"10px"}}customStyle={{position: "absolute",bottom: "0", display: "block", padding: "0",background: "transparent",marginBottom:"0", color: "rgb(170, 170, 170)", height: "calc(100% - 50px)", width: "100vw"}}>{xhr.responseText}</SyntaxHighlighter>
            if(xhr.response.length > 102400) {
                type = <div className="noprevdownload"><div className="downloadlabel">This File Is Too Big For Code Preview</div><a className="downloadbtn" href={this.props.src} download={this.props.name}>Download</a></div>
            }
          }else {
            if(this.props.ft == "img") {
                type = <img className="viewerimage"src={this.props.src} width={this.state.sc} onWheel={(e)=>{this.listner(e)}} onLoad={()=>{this.imgload()}}></img>
            }else if(this.props.ft == "vid") {
              type = <video width={this.state.sc} className = "viewervid" onLoadedMetadata={()=>{this.vidload()}} controls><source src={this.props.src} type={this.props.mime}/></video>
            }else if (this.props.ft == "audio"){
              type = <audio controls><source src={this.props.src} type={this.props.mime} /></audio>
            }else{
              type = <div className="noprevdownload"><div className="downloadlabel">No Preview Is Avalible For This Type Of File</div><a className="downloadbtn" href={this.props.src} download={this.props.name}>Download</a></div>
              //<iframe src={this.props.src} title={this.props.name} frameborder="0" border="0" cellspacing="0"></iframe>
            }
          }
          
            return(
                <div className="fileviewarea">
                    <div className="fileviewheader">
                        <div className="fileviewfilenamelabel">{this.props.name}</div>
                        <div className="exit" onClick={this.delete}>
                            <span></span><span></span>
                        </div>
                        </div>
                        <div className="filearea">
                            {type}
                        </div>
                </div>
                )
      }
}
  export class Defaultxhrloading extends React.Component {
      render() {
          return (
              <div className="xhrloading">
                  <div class="xhrexit exit" onClick={()=>stopdownload(1, 1)}><span></span><span></span></div>
                  <svg version="1.1" x="0px" y="0px" viewBox="0 0 720 720" width="80">
            <path id="loadwrapperloading" d="M584.1,307.5c0-1.4,0.1-2.8,0.1-4.2c0-68.5-55.5-124.1-124.1-124.1c-32.4,0-61.9,12.5-84,32.8 c-22.7-26.1-56.2-42.7-93.6-42.7c-68.5,0-124.1,55.5-124.1,124.1c0,4.8,0.3,9.5,0.8,14.1c-2.5-0.2-5-0.3-7.6-0.3 c-62.9,0-113.9,49.3-113.9,110.2c0,60.9,51,110.2,113.9,110.2h425.7c58.5,0,105.9-49.3,105.9-110.2 C683.3,359,639.4,311.2,584.1,307.5z">
        </path><g></g><g></g><g></g><g></g></svg>
        <b id="fileloadingtxt">Loading File</b>
              </div>
          )
      }
  }
  export class Searchico extends React.Component {
      render() {
            return(
              <div id="sc">
            <div id="searchcont">
                <svg id="search" version="1.1" x="0px" y="0px" viewBox="0 0 720 720">
                    <circle className="grey-svg-path" cx="315.6" cy="287.4" r="141.8"/>
                    <line className="grey-svg-path" x1="385.9" y1="410.6" x2="494.8" y2="562.1"/>
                    <g>
                    </g>
                    <g>
                    </g>
                    <g>
                    </g>
                    <g>
                    </g>
                </svg>
            </div>
        <input type="text" id="pc-search-text"/>
              </div>
          )
      }
  }
  export class Alignicon extends React.Component {
      componentDidMount() {
        var c = localStorage.getItem("arrange")
        if(c == 1) {
            this.setState({grid: 'none', row: ''})
        }else if(c == 0) {
            this.setState({grid: '', row: 'none'})
        } 
      }
      constructor(props) {
          super(props)
          this.state = {style : "rotate(0deg)"}
          this.state = {alignBy : "Name", grid: 'none', row: ''}
          this.arrangeElem = this.arrangeElem.bind(this);
      }
      changetyp() {
          var lst = ["Name", "Size", "Mime", "Date"]
          var n = lst.indexOf(this.state.alignBy)+ 1
          if(!(n > 3)) {
            this.setState({alignBy: lst[n]})
          }else {
            this.setState({alignBy: lst[0]})
          }
          alignby(this.state.alignBy.toLowerCase(), this.statetoBool())
      }
      statetoBool() {
        if(this.state.style == "rotate(180deg)") {
            return true
          }else {
            return false
          }
      }
      arrangeElem() {
        var c = localStorage.getItem("arrange")
        if(c == 0) {
            this.setState({grid: 'none', row: ''})
        }else if(c == 1) {
            this.setState({grid: '', row: 'none'})
        } 
        arrange()
      }
      changeasc() {
        if(this.state.style == "rotate(180deg)") {
            this.setState({style: "rotate(0deg)"})
          }else {
            this.setState({style: "rotate(180deg)"})
          }
          alignby(this.state.alignBy.toLowerCase(), this.statetoBool())
      }
      render() {
        var arrangeControl
        var real = <div className="alignMenu"><b onClick={()=>this.changetyp()}>{this.state.alignBy}</b><svg className="alignarrow" x="0px" y="0px" viewBox="0 0 720 720" style={{transform: this.state.style}} onClick={()=>this.changeasc()}>
        <path className="arrowpath" d="M330.2,227.2L187.7,474.1c-10.6,18.3,2.6,41.3,23.8,41.3h285c21.2,0,34.4-22.9,23.8-41.3L377.8,227.2
            C367.2,208.9,340.8,208.9,330.2,227.2z"/>
        </svg></div>
        if(window.innerWidth > 760) {
          if(localStorage.getItem("arrange") == 0) {
              arrangeControl = real
          }
        }else {
            arrangeControl = real
        }
          return(
            <>
            {arrangeControl}
            <div className="alignico" onClick={this.arrangeElem}>
            <div id="grid" style={{display: this.state.grid}}>
                <svg version="1.1" id="global-align-icon" x="0px"
                    y="0px" viewBox="0 0 720 720">
                <path id="default-white-svg-path" d="M499.8,279h-97.4c-17.6,0-32-14.4-32-32v-97.4
                    c0-17.6,14.4-32,32-32h97.4c17.6,0,32,14.4,32,32V247C531.8,264.6,517.4,279,499.8,279z"/>
                <path id="default-white-svg-path" d="M269.8,279h-97.4c-17.6,0-32-14.4-32-32v-97.4
                    c0-17.6,14.4-32,32-32h97.4c17.6,0,32,14.4,32,32V247C301.8,264.6,287.4,279,269.8,279z"/>
                <path id="default-white-svg-path" d="M269.8,510.9h-97.4c-17.6,0-32-14.4-32-32v-97.4
                    c0-17.6,14.4-32,32-32h97.4c17.6,0,32,14.4,32,32v97.4C301.8,496.5,287.4,510.9,269.8,510.9z"/>
                <path id="default-white-svg-path" d="M499.8,510.9h-97.4c-17.6,0-32-14.4-32-32v-97.4
                    c0-17.6,14.4-32,32-32h97.4c17.6,0,32,14.4,32,32v97.4C531.8,496.5,517.4,510.9,499.8,510.9z"/>
                <g>
                </g>
                <g>
                </g>
                <g>
                </g>
                <g>
                </g>
            </svg>
            </div>
            <div id="row" style={{display: this.state.row}}>
                    <svg version="1.1" id="global-align-icon" x="0px"
                        y="0px" viewBox="0 0 720 720">
                        <path id="default-white-svg-path" d="M499.8,279H172.4c-17.6,0-32-14.4-32-32v-97.4
                        c0-17.6,14.4-32,32-32h327.4c17.6,0,32,14.4,32,32V247C531.8,264.6,517.4,279,499.8,279z"/>
                        <path id="default-white-svg-path" d="M499.8,510.9H172.4c-17.6,0-32-14.4-32-32v-97.4
                            c0-17.6,14.4-32,32-32h327.4c17.6,0,32,14.4,32,32v97.4C531.8,496.5,517.4,510.9,499.8,510.9z"/>
                        <g>
                        </g>
                        <g>
                        </g>
                        <g>
                        </g>
                        <g>
                        </g>
                    </svg>
                </div>
            </div>
            </>
          );
      }
  }
  export class Dir extends React.Component {
      render() {
          return(
              <>
              <p className="dirbold"><b onClick={()=>gotofolder("/ 0")}>My Files</b><div>{this.props.a}</div></p>
              </>

          )
      }
  }
  export class Mobilemenubtn extends React.Component {
      render() {
          return(
            <div id="mobile-menu-btn" onClick={openleftbar}>
                <svg version="1.1" id="mobile-header-logo" x="0px"
                    y="0px" viewBox="0 0 720 720">
                    <path id="logo-svg-path" d="M584.1,307.5c0-1.4,0.1-2.8,0.1-4.2c0-68.5-55.5-124.1-124.1-124.1c-32.4,0-61.9,12.5-84,32.8
                        c-22.7-26.1-56.2-42.7-93.6-42.7c-68.5,0-124.1,55.5-124.1,124.1c0,4.8,0.3,9.5,0.8,14.1c-2.5-0.2-5-0.3-7.6-0.3
                        c-62.9,0-113.9,49.3-113.9,110.2c0,60.9,51,110.2,113.9,110.2h425.7c58.5,0,105.9-49.3,105.9-110.2
                        C683.3,359,639.4,311.2,584.1,307.5z"/>
                    <g>
                    </g>
                    <g>
                    </g>
                    <g>
                    </g>
                    <g>
                    </g>
                </svg>
            </div>
          );
      }
  }
  export class Group extends React.Component {
      render() {
          return(
              <>
                <div id="groupncont"></div>              
              </>
              //                <input type="file" className="fileselector" onChange={()=>fileadded(0)}></input>

                
          );
      }
  }
  export class Button extends React.Component {
    render() {
        return(
            <div className="header_new_button" onClick={()=>showfilelabel()}>
                            <svg version="1.1" id="desktop-leftmenubar-button" 
                x="0px" y="0px" viewBox="0 0 720 720" >
            <path id="default-black-svg-path" className="st0" d="M454,314.9H284.8c-10.1-24.9-34.6-42.6-63-42.6h-47.7c-37.3,0-67.9,30.6-67.9,67.9
                v24.7v23v159.4c0,27.5,22.5,50,50,50H454c27.5,0,50-22.5,50-50V364.9C504,337.4,481.5,314.9,454,314.9z"/>
            <g>
                <path id="default-g" d="M555.9,202.1v-53.9c0-4.7,1.7-8.8,5.2-12.1c3.5-3.3,7.7-5,12.7-5c4.7,0,8.8,1.7,12.1,5s5,7.4,5,12.1v53.9h53.9
                    c4.9,0,9.1,1.7,12.6,5.1c3.6,3.4,5.3,7.6,5.3,12.4c0,4.9-1.8,9-5.3,12.4c-3.6,3.4-7.8,5.1-12.6,5.1h-53.5v53.9
                    c0,5-1.8,9.3-5.3,12.7c-3.6,3.5-7.8,5.2-12.6,5.2c-4.9,0-9-1.7-12.4-5.2c-3.4-3.5-5.1-7.7-5.1-12.7v-53.9H502
                    c-4.7,0-8.8-1.7-12.3-5.1c-3.5-3.4-5.2-7.6-5.2-12.4c0-4.7,1.7-8.8,5.2-12.3c3.5-3.5,7.6-5.2,12.3-5.2H555.9z"/>
            </g>
            </svg><b>New</b>
            </div>
        );
    }
}
export class Pfp extends React.Component {
    render() {
        return(
            <div className="pfp" onClick={pfpmenu}>
                <img className="pfpimg" src="./loading.gif" />
            </div>
        );
    }
}
export class Lpfpmenu extends React.Component {
    render() {
        return(
            <div className="lpfpmenu">
                <div className="menupfp">
                    <label htmlFor="pfpuploader"><img className="pfpimg menu" src="./loading.gif"/></label>
                </div>
                <input type="file" id="pfpuploader" onChange={()=>pfpinput()}/>
                <b>{this.props.userid}</b>
                <div>
                    <small id="settingbtn" onClick={()=>openSetting()}>Setting </small>|<small id="logoutbtn" onClick={logout}> Logout</small>
                </div>
            </div>
        )
    }
}

export class Uploadnotify extends React.Component {
    render() {
        var cont
        if(this.props.size == "" || this.props.size== null) {
            cont = this.props.name
        }else {
            cont=this.props.name + " | "+ this.props.size
        }
        var progress
        if(this.props.act != "pfp") {
            progress = <progress id={this.props.progid} value="0" max="100" className="progrezz"><div></div></progress>
        }
        return (
            <div className="uploadnotify show">
            <div className="percetage">
                <div id="plabelarea">
                    <p className="uploaderlabel">{cont}</p>
                    {progress}
                </div>
            </div>
        </div>
        )
    }
}
export class Lmenuact extends React.Component {
    render() {
        var aa = this.props.html
        return(
            {aa}
        );
    }
}
export class Overlayarr extends React.Component {
    render() {
        return (
            <div className="overlayarea hide" onClick={()=>hideoverlaycont()}></div>
        )
    }
}
export class Mobilenew extends React.Component {
    constructor(props) {
        super(props);
        this.state = {act: "", act2: ""}
    }
    clickedbtn() {
        if(this.state.act == "") {
            this.setState({act: " focused", act2: " focused"})
        }else {
            this.setState({act: "", act2: ""})
        }

    }
    render() {
        if(this.props.propp == "bsc") {
            var cont = <><div className={"mobile-uploadbtn"+this.state.act} onClick={()=>this.clickedbtn()}>＋</div><div className={"mobile-upload-options"+ this.state.act2}>
            <label htmlFor="fileinput" className="mobile-upload-options-label">
            <svg id="mobile-option-btn" version="1.1" x="0px" y="0px" viewBox="0 0 720 720" >
            <path id="default-black-svg-path" d="M286.8,244.8h-85.9c-9.9,0-19.4,3.7-26.2,10.3c-7,6.6-10.9,15.7-10.9,25.2v284.1c0,9.5,3.9,18.4,10.9,25.2
	c7,6.6,16.5,10.3,26.2,10.3h198.2c9.9,0,19.4-3.7,26.2-10.3c7-6.6,10.9-15.7,10.9-25.2V362.1c0-9.5-3.9-18.4-10.9-25.2l-112.1-81.8
	C306.2,248.5,296.7,244.8,286.8,244.8L286.8,244.8z"/>
            </svg>
            </label>
            <div className="mobile-upload-options-label" onClick={()=>createfolder()}>
            <svg id="mobile-option-btn"  className="st0" version="1.1" x="0px" y="0px" viewBox="0 0 720 720" >
            <path id="default-black-svg-path" d="M454,314.9H284.8c-10.1-24.9-34.6-42.6-63-42.6h-47.7c-37.3,0-67.9,30.6-67.9,67.9
            v24.7v23v159.4c0,27.5,22.5,50,50,50H454c27.5,0,50-22.5,50-50V364.9C504,337.4,481.5,314.9,454,314.9z"/></svg>
            </div>
            </div>
            </>
        }else if(this.props.propp == "upchk") {
            var cont = <div className="mobile-uploadbtn uploading"><p className="uploaderlabel">{this.props.name + " | "+ this.props.size}</p>
            <progress id={this.props.id} value="0" max="100" className="progrezz"><div></div></progress></div>
        }else if(this.props.propp == "preup") {
            var cont = <div className="mobile-uploadbtn uploading"><p className="uploaderlabel">Preparing..</p></div>
        }else if(this.props.propp == "changepfp") {
            var cont = <div className="mobile-uploadbtn uploading"><p className="uploaderlabel">Changing Profile Picture..</p></div>
        }
        return(
            <>
            {cont}
            </>
        )
    }
}