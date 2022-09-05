import { Event, Intersection, Object3D, PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import HotspotDetail from "./HotspotDetail";
import { HotspotRenderer } from "./renderers";
import { Transitioner } from "./utils";

const dotSize = 15;
const baseStyle = `
  width: ${dotSize}px;
  height: ${dotSize}px;
  border-radius: 50%;
  border: solid 1px white;
  cursor: pointer;
  transition: background-color .5s, opacity .5s;
`;

export interface HotspotData {
  title: string;
  desc: string;
  media: any;
}

class Hotspot extends CSS2DObject {
  private _show: boolean = true;
  private renderer: HotspotRenderer;
  private camera: PerspectiveCamera;
  private controls: OrbitControls;

  data: HotspotData = {
    title: "",
    desc: "",
    media: null,
  };

  focus: boolean = false; // true while focusing
  focused: boolean = false; // true after focusing
  transitioner: Transitioner = new Transitioner(this, 0.8);
  hotspotElement: HTMLDivElement;
  associatedObject?: Object3D<Event>;
  detail?: HotspotDetail;

  constructor(renderer: HotspotRenderer) {
    const element = document.createElement("div");
    element.className = "hotspot";
    element.style.cssText = baseStyle;
    super(element);

    this.renderer = renderer;
    this.controls = this.renderer.controls;
    this.camera = this.renderer.scene.camera;

    this.hotspotElement = element;
    this.hotspotElement.addEventListener("pointerdown", () => this.onClick());

    this.updateStyle();
  }

  private onClick() {
    if (!this.focused) {
      if (this.renderer.prevHotspot) {
        this.renderer.prevHotspot.focused = false; // 'unfocus' previous hotspot
        this.renderer.prevHotspot.detail?.updateVisibility(false)
      }
      this.focus = true;
      this.focused = true;
      this.renderer.prevHotspot = this;
      this.transitioner.startTarget = this.controls.target.clone();
      this.transitioner.startCameraPos = this.camera.position.clone();

      if (this.detail) {
        this.detail.updateVisibility(true);
      }
    }
  }

  private updateStyle() {
    this.hotspotElement.style.backgroundColor = this._show ? "rgba(0,0,0,0.25)" : "black"; //prettier-ignore
    this.hotspotElement.style.opacity = this._show ? "1" : ".1";
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
