import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import Hotspot from "./Hotspot";

class HotspotDetail extends CSS2DObject {
  private detailElement: HTMLElement;
  hotspot: Hotspot;

  constructor(hotspot: Hotspot) {
    const wrapper = document.createElement("div"); // wrapper element is for positioning
    const element = document.createElement("div");
    element.className = "hotspotDetail";
    wrapper.appendChild(element);

    const data = hotspot.data;

    const header = document.createElement("div");
    header.className = "header";

    if (data.title) {
      const title = document.createElement("h3");
      title.innerText = data.title;
      header.appendChild(title);
    }

    const editButton = document.createElement("button");
    editButton.className = "skeleton";
    editButton.addEventListener("pointerdown", () => this.onEdit());
    editButton.innerText = "Edit";
    header.appendChild(editButton);
    element.appendChild(header);

    if (data.desc) {
      const desc = document.createElement("p");
      desc.innerText = data.desc;
      element.appendChild(desc);
    }

    super(wrapper);
    this.hotspot = hotspot;
    this.detailElement = element;

    this.updateVisibility(false);
  }

  onEdit() {
    const event = new CustomEvent("showHotspotConfig", {
      detail: { hotspot: this.hotspot },
    });
    this.hotspot.renderer.domElement.dispatchEvent(event);
  }

  connect() {
    this.hotspot.detail = this;
    this.hotspot.add(this);
  }

  updateVisibility(show: boolean) {
    this.detailElement.style.visibility = show ? "visible" : "hidden";
    this.detailElement.style.opacity = show ? "1" : "0";
  }
}

export default HotspotDetail;
