import { Vector3 } from "three";
import { clamp } from "three/src/math/MathUtils";
import { Hotspot, HotspotRenderer } from "../threeComponents";

const FPS = 60;

class Transitioner {
  private duration: number;
  private progress = 0;
  private step: number;

  private renderer?: HotspotRenderer = undefined;

  _startCoords = { target: new Vector3(), camera: new Vector3() };

  constructor(duration: number) {
    this.duration = duration;
    this.step = 1 / (this.duration * FPS);
  }

  private static lerp(a: number, b: number, alpha: number) {
    alpha = clamp(alpha, 0, 1);
    return a + (b - a) * alpha;
  }

  private static lerpVec3(
    startCoord: Vector3,
    endCoord: Vector3,
    alpha: number
  ) {
    return new Vector3(
      Transitioner.lerp(startCoord.x, endCoord.x, alpha),
      Transitioner.lerp(startCoord.y, endCoord.y, alpha),
      Transitioner.lerp(startCoord.z, endCoord.z, alpha)
    );
  }

  private static flip(t: number) {
    return 1 - t;
  }

  private static easeIn(t: number) {
    return Math.pow(t, 3);
  }

  private static easeOut(t: number) {
    return Transitioner.flip(Math.pow(Transitioner.flip(t), 3));
  }

  private static easeInOut(t: number) {
    return Transitioner.lerp(
      Transitioner.easeIn(t),
      Transitioner.easeOut(t),
      t
    );
  }

  private transition(
    alpha: number,
    camEndPos: Vector3,
    endTarget: Vector3,
    hotspot?: Hotspot
  ) {
    this.progress += this.step;

    // new position reached - reset progress and disable focus
    if (this.progress >= 1) {
      if (hotspot) hotspot.focus = false;
      else if (this.renderer) this.renderer.resettingFocus = false;

      this.progress = 0;
      return [endTarget, camEndPos]; // end position: ;
    }
    // else transition is ongoing
    else {
      const target = Transitioner.lerpVec3(this._startCoords.target, endTarget, alpha); // prettier-ignore
      const newCamPosition = Transitioner.lerpVec3(this._startCoords.camera, camEndPos, alpha); // prettier-ignore
      return [target, newCamPosition];
    }
  }

  // private linear(camEndPos: Vector3, endPos: Vector3) {
  //   return this.transition(this.progress, camEndPos, endPos);
  // }

  private ease(camEndPos: Vector3, endTarget: Vector3, hotspot?: Hotspot) {
    const alpha = Transitioner.easeInOut(this.progress);
    return this.transition(alpha, camEndPos, endTarget, hotspot);
  }

  focusHotspot(hotspot: Hotspot, camEndPos: Vector3) {
    const endTarget = hotspot.position.clone();
    return this.ease(camEndPos, endTarget, hotspot);
  }

  resetFocus(renderer: HotspotRenderer) {
    this.renderer = renderer;
    return this.ease(new Vector3(0, 0, -1), new Vector3(0, 0, 0));
  }

  set startTarget(val: Vector3) {
    this._startCoords.target = val;
  }

  set startCameraPos(val: Vector3) {
    this._startCoords.camera = val;
  }
}

export default Transitioner;
