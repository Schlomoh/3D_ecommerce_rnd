import { Event, Intersection, Object3D, PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import HotspotDetail from "./HotspotDetail";
import { HotspotRenderer } from "./renderers";
import ModelScene from "./ModelScene";

export interface HotspotData {
  title: string;
  desc: string;
  media: any;
}

export type HotspotEvent = CustomEvent<{ hotspot: Hotspot }>;
export type HotspotDataEvent = CustomEvent<{ data: HotspotData }>;

const background = { show: "black", hide: "rgba(0,0,0, 0.1)" };

class Hotspot extends CSS2DObject {
  private _show: boolean = true;
  private scene: ModelScene;
  private camera: PerspectiveCamera;
  private controls: OrbitControls;

  data: HotspotData = {
    title: "",
    desc: "",
    media: null,
  };

  focus: boolean = false; // true while focusing
  focused: boolean = false; // true after focusing
  renderer: HotspotRenderer;
  associatedObject?: Object3D<Event>;
  detail?: HotspotDetail;

  constructor(renderer: HotspotRenderer) {
    const element = document.createElement("div");
    element.className = "hotspot";

    super(element);

    this.renderer = renderer;
    this.controls = this.renderer.controls;
    this.scene = this.renderer.scene;
    this.camera = this.renderer.scene.camera;

    if (this.renderer.enumerateHotspots) {
      const numberElement = document.createElement("p");
      const count = Object.keys(this.renderer.hotspots).length + 1;
      numberElement.innerText = String(count);
      this.element.appendChild(numberElement);
    }

    this.element.addEventListener("pointerdown", () => this.select());

    this.updateStyle();
  }

  private updateStyle() {
    this.element.style.backgroundColor = this._show ? background.show : background.hide; //prettier-ignore
    this.element.style.opacity = this._show ? "1" : ".1";
  }

  delete() {
    this.scene.remove(this);
    delete this.renderer.hotspots[this.id];
  }

  select() {
    if (!this.focused) {
      if (this.renderer.prevHotspot) {
        this.renderer.prevHotspot.focused = false; // 'unfocus' previous hotspot
        this.renderer.prevHotspot.detail?.updateVisibility(false);
      }
      this.focus = true;
      this.focused = true;
      this.renderer.prevHotspot = this;
      this.renderer.transitioner.startTarget = this.controls.target.clone();
      this.renderer.transitioner.startCameraPos = this.camera.position.clone();

      if (this.detail) {
        this.detail.updateVisibility(true);
      }

      const event = new CustomEvent("clickedHotspot", {
        detail: { hotspot: this },
      });
      this.renderer.domElement.dispatchEvent(event);
    }
  }

  connectTo(target: Object3D<Event>, intersection: Intersection) {
    const position = intersection.point;
    const object = intersection.object;

    const [x, y, z] = [position.x, position.y, position.z];
    this.position.set(x, y, z);
    this.associatedObject = object;
    target.add(this);
  }

  set show(val: boolean) {
    this._show = val;
    this.updateStyle();
  }

  get show() {
    return this._show;
  }
}

export default Hotspot;
