import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Mobilenew, Lbtnclick,Alignicon,Dir} from "./comp";
import {openleftbar, getShared, mainMenu} from './main'

ReactDOM.render(
  <React.StrictMode>
  </React.StrictMode>,
  document.querySelector('#rt')
);

class Leftmenubar extends React.Component {
  constructor(props) {
    super(props)
    this.stle = {stroke: "#fff", fill: "#fff", color: "#fff"}

    this.state ={files: this.stle, recent: {}, trash: {}, share: {}}
  }
  makeactive(ctx) {
    this.setState({files: {}, recent: {}, trash: {}, share: {} })
    if(ctx == "files") {
      this.setState({files: this.stle})
      mainMenu()
    }else if(ctx == "recent") {
      this.setState({recent: this.stle})
    }else if(ctx == "trash") {
      this.setState({trash: this.stle})
    }else if(ctx == "share") {
      this.setState({share: this.stle})
      getShared()
    }
  }
  render() {
    return(
      <>
      <div className="leftmenubar">
      <div className="logocont" onClick={openleftbar}>
                <svg version="1.1" id="desktop-logo" x="0px" y="0px" viewBox="0 0 720 720">
                    <path id="logo-svg-path" d="M584.1,307.5c0-1.4,0.1-2.8,0.1-4.2c0-68.5-55.5-124.1-124.1-124.1c-32.4,0-61.9,12.5-84,32.8
                        c-22.7-26.1-56.2-42.7-93.6-42.7c-68.5,0-124.1,55.5-124.1,124.1c0,4.8,0.3,9.5,0.8,14.1c-2.5-0.2-5-0.3-7.6-0.3
                        c-62.9,0-113.9,49.3-113.9,110.2c0,60.9,51,110.2,113.9,110.2h425.7c58.5,0,105.9-49.3,105.9-110.2
                        C683.3,359,639.4,311.2,584.1,307.5z" />
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

        
        <div className="leftmenubtn" id="mpagecont" onClick={()=>this.makeactive("files")} style={this.state.files}>
                <svg version="1.1" id="desktop-leftmenubar-button" x="0px" y="0px" viewBox="0 0 720 720"> 
                    <path id="default-black-svg-path" style={this.state.files} d="M518,208.6H348.8c-10.1-24.9-34.6-42.6-63-42.6
                        h-47.7c-37.3,0-67.9,30.6-67.9,67.9v24.7v23V441c0,27.5,22.5,50,50,50H518c27.5,0,50-22.5,50-50V258.6
                        C568,231.1,545.5,208.6,518,208.6z" />
                    <g>
                    </g>
                    <g>
                    </g>
                    <g>
                    </g>
                    <g>
                    </g>
                </svg>
                <b className="exparea" id="folderico">Files</b>
            </div>
            <div className="leftmenubtn" onClick={()=>this.makeactive("recent")} style={this.state.recent}>          
                <svg version="1.1" id="desktop-leftmenubar-button" x="0px" y="0px" viewBox="0 0 720 720">
                    <circle id="default-black-svg-path" style={this.state.recent} cx="392.9" cy="261.9" r="99.8"/>
                    <path id="default-black-svg-path" style={this.state.recent} d="M393.5,361.8c-77.1,0-141.6,72.7-158.2,170.2
                        h316.3C535.1,434.5,470.6,361.8,393.5,361.8z"/>
                    <g>
                    </g>
                    <g>
                    </g>
                    <g>
                    </g>
                    <g>
                    </g>
                </svg>  
                <b className="exparea" id="gico">Recent</b>
            </div>
            <div className="leftmenubtn" onClick={()=>this.makeactive("trash")} style={this.state.trash}>
                <svg version="1.1" id="desktop-leftmenubar-button" x="0px"
                    y="0px" viewBox="0 0 720 720">
                    <path style={this.state.trash} id="default-black-svg-path" d="M478.9,523.4h-215c-2.8,0-5-2.2-5-5V247.7
                        c0-2.8,2.2-5,5-5h215c2.8,0,5,2.2,5,5v270.7C483.9,521.1,481.6,523.4,478.9,523.4z"/>
                    <line style={this.state.trash} id="default-black-svg-path" x1="368.8" y1="245.5" x2="370.5" y2="526.2"/>
                    <path style={this.state.trash} id="default-black-svg-path" d="M527.9,219.4H211.4c-3,0-5.4-2.4-5.4-5.4v0
                        c0-3,2.4-5.4,5.4-5.4h316.5c3,0,5.4,2.4,5.4,5.4v0C533.3,217,530.9,219.4,527.9,219.4z"/>
                    <path style={this.state.trash} id="default-black-svg-path" d="M396.5,186.4H348c-2.8,0-5-2.2-5-5v-20.7
                        c0-2.8,2.2-5,5-5h48.5c2.8,0,5,2.2,5,5v20.7C401.5,184.2,399.2,186.4,396.5,186.4z"/>
                    <g>
                    </g>
                    <g>
                    </g>
                    <g>
                    </g>
                    <g>
                    </g>
                </svg>
            <b className="exparea" id="trashico">Trash</b>
        </div>
        <div className="leftmenubtn" onClick={()=>this.makeactive("share")} style={this.state.share}>
            <svg version="1.1" id="desktop-leftmenubar-button" x="0px"
                 y="0px" viewBox="0 0 720 720">
            <circle style={this.state.share} id="default-black-svg-path" cx="243.6" cy="338.7" r="53.7"/>
            <line style={this.state.share} id="default-black-svg-path" x1="280.4" y1="298.2" x2="394.1" y2="229.8"/>
            <line style={this.state.share} id="default-black-svg-path" x1="282.9" y1="375.3" x2="378.9" y2="443.8"/>
            <circle style={this.state.share} id="default-black-svg-path" cx="427" cy="209.9" r="53.7"/>
            <circle style={this.state.share} id="default-black-svg-path" cx="413.1" cy="468.2" r="53.7"/>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            </svg>
            <b className="exparea" id="share">Share</b>
        </div>
      </div>
      </>
    );
  }
}

export function eclickdetector(aa, bb) {
  if(aa === true) {
    var instances = ['View', 'Delete', 'Share', 'Download', 'Change View', 'New'];
  }else {
    var instances = ['Change View', 'New'];
  }
  ReactDOM.render (
    <Lbtnclick blank_instances={instances} id={bb}/>,
    document.querySelector('#rbtn')
  );
}
ReactDOM.render (
  <Alignicon />,
  document.querySelector(".aligniconArea")
)
ReactDOM.render (
  [<Dir />],
  document.querySelector('.dirArea')
)
export async function mobilenew(prop, size, id, name) {
  ReactDOM.render (
    <Mobilenew propp={prop} size={size} id={id} name={name}/>,
    document.querySelector('#mbtn')
  )
}
ReactDOM.render (
  <Leftmenubar />,
  document.querySelector('#rt')
);