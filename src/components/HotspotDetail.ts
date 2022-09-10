import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import Hotspot from "./Hotspot";

class HotspotDetail extends CSS2DObject {
  hotspot: Hotspot;

  constructor(hotspot: Hotspot) {
    const element = document.createElement("div");
    element.className = "hotspotDetail";
    element.style.zIndex = '4000'


    const data = hotspot.data;

    const header = document.createElement("div");
    header.className = "header";

    if (data.title) {
      const title = document.createElement("h3");
      title.innerText = data.title;
      header.appendChild(title);
    }

    const editButton = document.createElement("button");
    editButton.className = 'skeleton'
    editButton.addEventListener("pointerdown", (e) => this.onEdit(e));
    editButton.innerText = "Edit";
    header.appendChild(editButton);
    element.appendChild(header);

    if (data.desc) {
      const desc = document.createElement("p");
      desc.innerText = data.desc;
      element.appendChild(desc);
    }
    
    super(element);
    this.hotspot = hotspot;

    this.updateVisibility(false);
  }

  onEdit(e: MouseEvent) {
    const event = new CustomEvent("editHotspot", {
      detail: { hotspot: this.hotspot },
    });
    this.hotspot.renderer.domElement.dispatchEvent(event);
  }

  connect() {
    this.hotspot.detail = this;
    this.hotspot.add(this);
  }

  updateVisibility(show: boolean) {
    this.element.style.visibility = show ? "visible" : "hidden";
    this.element.style.opacity = show ? "1" : "0";
  }
}

export default HotspotDetail;
