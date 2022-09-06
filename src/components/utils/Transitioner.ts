import { Vector3 } from "three";
import { clamp } from "three/src/math/MathUtils";
import Hotspot from "../Hotspot";

const FPS = 60;

class Transitioner {
  private hotspot: Hotspot;
  private duration: number;
  private progress = 0;
  private step: number;
  private camEndPos?: Vector3;
  _startCoords = { target: new Vector3(), camera: new Vector3() };
  finished = false;

  constructor(hotspot: Hotspot, duration: number) {
    this.hotspot = hotspot;
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

  private caller(alpha: number, endCoord: Vector3) {
    this.progress += this.step;

    // new position reached - reset progress and disable focus
    if (this.progress >= 1) {
      this.progress = 0;
      this.hotspot.focus = false;
      return [endCoord, this.camEndPos]; // end position: ;
    }
    // else transition is ongoing
    else {
      const target = Transitioner.lerpVec3(this._startCoords.target, endCoord!, this.progress); // prettier-ignore
      const newCamPosition = Transitioner.lerpVec3(this._startCoords.camera, this.camEndPos!, this.progress); // prettier-ignore
      return [target, newCamPosition];
    }
  }

  linear(camEndPos: Vector3) {
    const endTarget = this.hotspot.position.clone();

    // new position reached - reset progress and disable focus
    if (this.progress >= 1) {
      this.progress = 0;
      this.hotspot.focus = false;
      return [endTarget, camEndPos]; // end position: ;
    }
    // else transition is ongoing
    else {
      const target = Transitioner.lerpVec3(this._startCoords.target, endTarget, this.progress); // prettier-ignore
      const newCamPosition = Transitioner.lerpVec3(this._startCoords.camera, camEndPos, this.progress); // prettier-ignore
      return [target, newCamPosition];
    }
  }

  ease(camEndPos: Vector3, endPos: Vector3) {
    this.progress += this.step;
    const alpha = Transitioner.easeInOut(this.progress);
    return this.caller(alpha, endPos);
  }

  focusHotspot(camEndPos: Vector3) {
    const endTarget = this.hotspot.position.clone();
    return this.ease(camEndPos, endTarget);
  }

  resetFocus(camEndPos: Vector3) {
    return this.ease(camEndPos, new Vector3(0, 0, 0));
  }

  set startTarget(val: Vector3) {
    this._startCoords.target = val;
  }

  set startCameraPos(val: Vector3) {
    this._startCoords.camera = val;
  }
}

export default Transitioner;
