import { Raycaster } from "three";
import { HotspotRenderer } from "../renderers";
import Hotspot, { HotspotDataEvent } from "../Hotspot";
import HotspotDetail from "../HotspotDetail";

class HotspotCreator {
  private renderer: HotspotRenderer;
  private raycaster = new Raycaster();
  private domElement: HTMLElement;
  private currentHotpot?: Hotspot;

  constructor(renderer: HotspotRenderer) {
    this.renderer = renderer;
    this.domElement = this.renderer.domElement;

    this.domElement.addEventListener("dblclick", (e) => {
      this.doubleClickCallback(e);
    });

    this.domElement.addEventListener("submitHotspot", (e) => {
      this.onSubmitHotspot(e as HotspotDataEvent);
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
      this.currentHotpot = hotspot;

      // add hotspot to scene as object
      const firstIntersect = intersects[0];
      hotspot.connectTo(this.renderer.scene, firstIntersect);

      // dispatch event for ui to show up
      const event = new CustomEvent("addedHotspot", {
        detail: { hotspot: hotspot },
      });
      this.domElement.dispatchEvent(event);
    }
  }

  private onSubmitHotspot(e: HotspotDataEvent) {
    const data = e.detail.data;
    this.currentHotpot!.data = data;
    // if no data is given no detail will be appended
    if (data?.title || data?.desc || data?.media) {
      const hotspotDetail = new HotspotDetail(this.currentHotpot!);
      hotspotDetail.connect();
      if (this.currentHotpot!.focused) hotspotDetail.updateVisibility(true); // show hotspot if already focused
    }
  }
}

export default HotspotCreator;
