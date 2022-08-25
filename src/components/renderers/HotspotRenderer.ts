import { PerspectiveCamera, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import ModelScene from "../ModelScene";
import { WindowHandler } from "../utils";

class HotspotRenderer extends CSS2DRenderer {
  protected camera: PerspectiveCamera;
  protected windowHandler = new WindowHandler(this);
  controls: OrbitControls;
  container: HTMLElement;
  scene: ModelScene;
  hotspots: Vector3[] = [];

  constructor(scene: ModelScene) {
    super();
    this.scene = scene;
    this.camera = scene.camera;
    this.container = document.createElement("div"); // placeholder element

    this.domElement.style.position = "absolute";
    this.domElement.style.top = "0px";

    this.controls = new OrbitControls(this.camera, this.domElement);
    this.controls.autoRotate = true;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
  }

  connect(container: HTMLElement) {
    this.container = container;
    this.windowHandler.updateDimensions();

    container.appendChild(this.domElement);
  }
}

export default HotspotRenderer;
