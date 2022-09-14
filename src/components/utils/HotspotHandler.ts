import { Raycaster } from "three";

import { HotspotRenderer } from "../threeComponents/renderers";
import { Hotspot, HotspotEvent } from "../threeComponents";
import { HotspotDetail } from "../threeComponents";

class HotspotHandler {
  private renderer: HotspotRenderer;
  private raycaster = new Raycaster();
  private domElement: HTMLElement;

  constructor(renderer: HotspotRenderer) {
    this.renderer = renderer;
    this.domElement = this.renderer.domElement;

    this.domElement.addEventListener("dblclick", (e) => {
      this.doubleClickCallback(e);
    });

    this.domElement.addEventListener("submitHotspot", (e) => {
      this.onSubmitHotspot(e as HotspotEvent);
    });

    this.raycaster.firstHitOnly = true;
  }

  private getNormalizedCoords(e: MouseEvent) {
    return {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    };
  }

  private doubleClickCallback(e: MouseEvent) {
    const scene = this.renderer.scene;
    const hotspots = this.renderer.hotspots;
    const pointer = this.getNormalizedCoords(e);

    this.raycaster.setFromCamera(pointer, scene.camera);
    const intersects = this.raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
      // add hotspot to renderer
      const hotspot = new Hotspot(this.renderer);
      hotspots[hotspot.id] = hotspot;

      // add hotspot to scene as object
      const firstIntersect = intersects[0];
      hotspot.connectTo(this.renderer.scene, firstIntersect);

      // dispatch event for ui to show up
      const event = new CustomEvent("showHotspotConfig", {
        detail: { hotspot: hotspot },
      });
      this.domElement.dispatchEvent(event);
    }
  }

  private onSubmitHotspot(e: HotspotEvent) {
    const hotspot = e.detail.hotspot;
    // if no data is given no detail will be appended
    const hotspotDetail = new HotspotDetail(hotspot);
    // remove previous hotspot detail
    if (hotspot.children.length > 0) hotspot.remove(hotspot.children[0]);
    if (hotspot.data.title || hotspot.data.desc) hotspotDetail.connect();
    if (hotspot.focused) hotspotDetail.updateVisibility(true); // show hotspot if already focused
  }
}

export default HotspotHandler;
