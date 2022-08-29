import { PerspectiveCamera, Raycaster } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import Hotspot from "../Hotspot";
import ModelScene from "../ModelScene";
import { ClickHandler, WindowHandler } from "../utils";

class HotspotRenderer extends CSS2DRenderer {
  protected camera: PerspectiveCamera;
  protected clickHandler: ClickHandler;
  protected windowHandler: WindowHandler;
  protected raycaster = new Raycaster();
  container: HTMLElement;
  controls: OrbitControls;
  scene: ModelScene;
  hotspots: Hotspot[];

  constructor(scene: ModelScene) {
    super();
    this.scene = scene;
    this.camera = scene.camera;
    this.container = document.createElement("div"); // placeholder element

    this.domElement.style.position = "absolute";
    this.domElement.style.top = "0px";

    this.controls = new OrbitControls(this.camera, this.domElement);
    // this.controls.autoRotate = true;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;

    this.clickHandler = new ClickHandler(this, this.domElement);
    this.windowHandler = new WindowHandler(this);

    this.hotspots = [];
    this.raycaster.firstHitOnly = true;
  }

  update() {
    // let intersects, cameraPosition, hotspotPosition, direction, hit;
    // this.hotspots.forEach((hotspot) => {
    //   cameraPosition = this.camera.position.clone();
    //   hotspotPosition = hotspot.position.clone();
    //   direction = hotspotPosition.clone().sub(cameraPosition);

    //   this.raycaster.set(cameraPosition, direction);
    //   intersects = this.raycaster.intersectObjects(this.scene.children);
    //   hit = intersects[0];

    //   const roundedHitPos = new Vector3(
    //     Number(hit.point.x.toPrecision(1)),
    //     Number(hit.point.y.toPrecision(1)),
    //     Number(hit.point.z.toPrecision(1))
    //   );

    //   if (hit) {
    //     console.log("hit: ", roundedHitPos);
    //     console.log("point: ", hotspotPosition);
    //   }
    // });

    this.controls.update();
  }

  connect(container: HTMLElement) {
    this.container = container;
    this.windowHandler.updateDimensions();

    container.appendChild(this.domElement);
  }
}

export default HotspotRenderer;
