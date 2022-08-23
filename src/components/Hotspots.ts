import { Group, Mesh } from "three";
import {
  CSS2DObject,
  CSS2DRenderer,
} from "three/examples/jsm/renderers/CSS2DRenderer";

class Hotspot extends CSS2DObject {
  constructor() {
    const shown = true;
    const element = document.createElement("div");
    element.style.width = "10px";
    element.style.height = "10px";
    element.style.borderRadius = "50%";
    element.style.backgroundColor = shown ? "white" : "black";
    super(element);
  }
  attachToObject(object: Group | Mesh) {
    object.add(this);
  }
}

class HotspotRenderer extends CSS2DRenderer {
    constructor() {
        super()

    }

    
}