import { Vector3 } from "three";
import Hotspot from "../Hotspot";

class Transitioner {
  private hotspot: Hotspot;
  private duration: number;
  private alpha: number;
  _startCoords = { target: new Vector3(), camera: new Vector3() };
  finished = false;

  constructor(hotspot: Hotspot, duration: number) {
    this.hotspot = hotspot;
    this.duration = duration;
    this.alpha = 0;
  }

  private lerp(startCoord: Vector3, endCoord: Vector3) {
    return new Vector3(
      startCoord.x + (endCoord.x - startCoord.x) * this.alpha,
      startCoord.y + (endCoord.y - startCoord.y) * this.alpha,
      startCoord.z + (endCoord.z - startCoord.z) * this.alpha
    );
  }

  linear(camEndPos: Vector3) {
    this.alpha += 1 / (this.duration * 60);
    const endTarget = this.hotspot.position.clone();

    // new position reached - reset alpha and disable focus
    if (this.alpha >= 1) {
      this.hotspot.focus = false;
      this.alpha = 0;
      return [endTarget, camEndPos]; // end position: ;
    }
    // esle transition is ongoing
    else {
      const target = this.lerp(this._startCoords.target, endTarget); // way inbetween
      const newCamPosition = this.lerp(this._startCoords.camera, camEndPos);
      return [target, newCamPosition];
    }
  }

  ease(hotspot: Hotspot) {
    const endCoord = hotspot.position;
    return this.lerp(this._startCoords.target, endCoord);
  }

  set startTarget(val: Vector3) {
    this._startCoords.target = val;
  }

  set startCameraPos(val: Vector3) {
    this._startCoords.camera = val;
  }
}

export default Transitioner;
