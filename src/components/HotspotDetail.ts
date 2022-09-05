import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import Hotspot from "./Hotspot";

const width = 250;
const padding = 15;

const baseStyle = `
    position: absolute;
    margin-left: calc(${width / 2}px + ${padding}px + 15px);
    background-color: white;
    border-radius: 5px;
    width: ${width}px;
    color: black;
    padding: ${padding}px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.15)
`;

class HotspotDetail extends CSS2DObject {
  //   data: HotspotData;
  hotspot: Hotspot;
  element: HTMLDivElement;

  constructor(hotspot: Hotspot) {
    const element = document.createElement("div");
    element.className = "hotspotDetail";
    element.style.cssText = baseStyle;

    const data = hotspot.data;

    if (data.title) {
      const title = document.createElement("h3");
      title.innerText = data.title;
      title.style.marginTop = '0'
      element.appendChild(title);
    }
    if (data.desc) {
      const desc = document.createElement("p");
      desc.innerText = data.desc;
      desc.style.marginTop = '0'
      element.appendChild(desc);
    }

    super(element);
    this.hotspot = hotspot;
    this.element = element;
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
