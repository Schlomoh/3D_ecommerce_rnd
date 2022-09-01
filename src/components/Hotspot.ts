import { Event, Object3D, Vector3 } from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";

const dotSize = 15;
const baseStyle = `
  width: ${dotSize}px;
  height: ${dotSize}px;
  border-radius: 50%;
  border: solid 1px white;
  transition: background-color .5s, opacity .5s;
`;

class Hotspot extends CSS2DObject {
  private _show: boolean = true;
  element: HTMLDivElement;

  constructor() {
    const element = document.createElement("div");
    element.className = "hotspot";
    element.style.cssText = baseStyle;
    super(element);

    this.element = element;
    this.update();
  }

  private update() {
    this.element.style.backgroundColor = this._show ? "rgba(0,0,0,0.25)" : "black"; //prettier-ignore
    this.element.style.opacity = this._show ? "1" : ".1";
  }

  connectTo(target: Object3D<Event>, position: Vector3) {
    const [x, y, z] = [position.x, position.y, position.z];
    this.position.set(x, y, z);
    target.add(this);
  }

  set show(val: boolean) {
    this._show = val;
    this.update();
  }

  get show() {
    return this._show;
  }
}

export default Hotspot;
