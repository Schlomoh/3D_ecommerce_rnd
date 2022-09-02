import { PerspectiveCamera, Raycaster, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";

import Hotspot from "../Hotspot";
import ModelScene from "../ModelScene";
import { ClickHandler, WindowHandler } from "../utils";

/**
 * The 2D-renderer responsible for rendering the hotspot 2D-objects
 *
 * This second dom element gets placed 'above' the scene renderers (webGL2 renderer)
 * which then also has to handle the orbit controls
 */
class HotspotRenderer extends CSS2DRenderer {
  protected camera: PerspectiveCamera;
  protected clickHandler: ClickHandler;
  protected windowHandler: WindowHandler;
  protected raycaster = new Raycaster();
  controls: OrbitControls;
  scene: ModelScene;
  hotspots: Hotspot[];
  container?: HTMLElement;

  constructor(scene: ModelScene) {
    super();
    this.scene = scene;
    this.camera = scene.camera;

    //position dom element on top
    this.domElement.style.position = "absolute";
    this.domElement.style.top = "0px";

    // configure controls
    this.controls = new OrbitControls(this.camera, this.domElement);
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.5;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;

    // register event handlers
    this.clickHandler = new ClickHandler(this, this.domElement);
    this.windowHandler = new WindowHandler(this);

    // hotspots and raycasting
    this.hotspots = [];
    this.raycaster.firstHitOnly = true;
  }

  private focusHotspot(hotspot: Hotspot) {
    this.controls.target = hotspot.transitioner.linear(hotspot);
  }

  /**
   * update hotspot visibility based on a raycast every frame
   * if the hit is close enough to the actual hotspot position it is shown
   * othwerwise not
   *
   * @param hotspot - single hotspot
   */
  private updateHotspotVisibility(hotspot: Hotspot) {
    /**
     * Create a string out of rounded position coordinates
     *
     * @param coord - a vector defining a point position
     * @returns - a string combining the rounded value of each axis coord
     */
    function roundCoord(coord: Vector3) {
      const decimalPosition = 6;
      return (
        coord.x.toPrecision(decimalPosition) +
        coord.y.toPrecision(decimalPosition) +
        coord.z.toPrecision(decimalPosition)
      );
    }
    // check which of the hotspots is visible using raycasting
    let intersects, cameraPosition, hotspotPosition, direction, hit;

    cameraPosition = this.camera.position.clone();
    hotspotPosition = hotspot.position.clone();
    direction = hotspotPosition.clone().sub(cameraPosition);

    this.raycaster.set(cameraPosition, direction);
    intersects = this.raycaster.intersectObjects(this.scene.children);

    // if an intersection occurs the ray hit and hotspot position are compared
    // they are first converted into strings and update the hotspot 'show' prop
    // accordigly
    if (intersects.length > 0) {
      hit             = roundCoord(intersects[0].point.clone()); // prettier-ignore
      hotspotPosition = roundCoord(hotspotPosition);

      if (hit == hotspotPosition) {
        if (!hotspot.show) hotspot.show = true;
      } else {
        if (hotspot.show) hotspot.show = false;
      }
    }
  }

  /**
   * gets called every frame
   * updates the visibility of each hotspot using raycasting
   *
   * also updates the orbit controls... since the 2D-renderers dom object
   * is placed 'above' the scene renderers
   *
   * calls 'focus hotspot' if one is clicked
   */
  update() {
    this.hotspots.forEach((hotspot) => {
      this.updateHotspotVisibility(hotspot);
      if (hotspot.focus) this.focusHotspot(hotspot);
    });

    this.controls.update();
  }

  connect(container: HTMLElement) {
    this.container = container;
    this.windowHandler.updateDimensions();
    this.container.appendChild(this.domElement);
  }
}

export default HotspotRenderer;
