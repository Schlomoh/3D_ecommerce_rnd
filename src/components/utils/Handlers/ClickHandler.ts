import { Raycaster } from "three";
import { HotspotRenderer } from "../../renderers";
import Hotspot from "../../Hotspot";

class ClickHandler {
  private renderer: HotspotRenderer;
  private raycaster = new Raycaster();

  constructor(renderer: HotspotRenderer, canvas: HTMLElement) {
    this.renderer = renderer;
    this.raycaster.firstHitOnly = true;

    canvas.addEventListener("dblclick", (e) => {
      this.doubleClickCallback(e);
    });
  }

  private getNormalizedCoords(e: MouseEvent) {
    return {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    };
  }

  doubleClickCallback(e: MouseEvent) {
    const scene = this.renderer.scene;
    const pointer = this.getNormalizedCoords(e);

    this.raycaster.setFromCamera(pointer, scene.camera);
    const intersects = this.raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
      const hotspot = new Hotspot(this.renderer);
      const firstIntersect = intersects[0];
      this.renderer.hotspots.push(hotspot);
      hotspot.connectTo(this.renderer.scene, firstIntersect);
    }
  }
}

export default ClickHandler;
