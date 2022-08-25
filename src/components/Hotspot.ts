import { Group, Mesh } from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";

class Hotspot extends CSS2DObject {
  show: boolean = true;

  constructor() {
    const element = document.createElement("div");
    const dotSize = 10;
    const baseStyle = `
      width: ${dotSize}px;
      height: ${dotSize}px;
      border-radius: 50px;
    `;
    element.style.cssText = baseStyle;

    super(element);
    this.changeVisibility(element);
  }

  private changeVisibility(element: HTMLElement) {
    element.style.backgroundColor = this.show ? "white" : "black";
  }

  attachToObject(object: Group | Mesh) {
    object.add(this);
  }

  update(show: boolean) {
    this.show = show;
  }
}

export default Hotspot;
