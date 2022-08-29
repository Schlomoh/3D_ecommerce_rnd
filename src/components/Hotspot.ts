import { Event, Object3D, Vector3 } from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";

class Hotspot extends CSS2DObject {
  show: boolean = true;

  constructor() {
    const element = document.createElement("div");
    element.className = "hotspot";
    const dotSize = 10;
    const baseStyle = `
      width: ${dotSize}px;
      height: ${dotSize}px;
      border-radius: 50%;
    `;
    element.style.cssText = baseStyle;

    super(element);
    this.changeVisibility(element);
  }

  private changeVisibility(element: HTMLElement) {
    element.style.backgroundColor = this.show ? "white" : "black";
  }

  // // rotation around x axis
  // // |1     0           0| |x|   |        x        |   |x'|
  // // |0   cos θ    −sin θ| |y| = |y cos θ − z sin θ| = |y'|
  // // |0   sin θ     cos θ| |z|   |y sin θ + z cos θ|   |z'|
  // private applyRotation(deg: number, position: Vector3) {
  //   const radiant = (deg * Math.PI) / 180;
  //   const x = position.x;
  //   const y = position.y * Math.cos(radiant) - position.z * Math.sin(radiant);
  //   const z = position.y * Math.sin(radiant) + position.z * Math.cos(radiant);
  //   return [x, y, z];
  // }

  connectTo(target: Object3D<Event>, position: Vector3) {
    // const [x, y, z] = this.applyRotation(-90, position);
    const [x, y, z] = [position.x, position.y, position.z];
    this.position.set(x, y, z);
    target.add(this);
  }

  update(show: boolean) {
    this.show = show;
  }
}

export default Hotspot;
