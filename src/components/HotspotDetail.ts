import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import Hotspot from "./Hotspot";

const width = 250;
const padding = 15;

const baseStyle = `
    position: absolute;
    margin-left: calc(${width / 2}px + ${padding}px + 15px);
    background-color: rgba(0,0,0,.75);
    border-radius: 10px;
    width: ${width}px;
    color: white;
    padding: ${padding}px;
`;

const titleStyle = `
    margin-top: 0;
    border-bottom: solid .5px lightgrey;
    padding-bottom: 5px;
`;

class HotspotDetail extends CSS2DObject {
  hotspot: Hotspot;

  constructor(hotspot: Hotspot) {
    const element = document.createElement("div");
    element.className = "hotspotDetail";
    element.style.cssText = baseStyle;

    const data = hotspot.data;

    if (data.title) {
      const title = document.createElement("h3");
      title.innerText = data.title;
      title.style.cssText = titleStyle;
      element.appendChild(title);
    }
    if (data.desc) {
      const desc = document.createElement("p");
      desc.innerText = data.desc;
      desc.style.marginTop = "0";
      element.appendChild(desc);
    }

    const editButton = document.createElement("button");
    editButton.innerText = "edit";

    super(element);
    this.hotspot = hotspot;

    editButton.onclick = () => {}

    this.updateVisibility(false);
  }

  connect() {
    this.hotspot.detail = this;
    this.hotspot.add(this);
  }

  updateVisibility(show: boolean) {
    this.element.style.visibility = show ? "visible" : "hidden";
  }
}

export default HotspotDetail;
