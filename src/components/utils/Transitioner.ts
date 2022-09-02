import { Vector3 } from "three";
import Hotspot from "../Hotspot";

class Transitioner {
  private duration: number;
  private alpha: number;
  _startCoord = new Vector3();
  finished = false;

  constructor(duration: number) {
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

  linear(hotspot: Hotspot) {
    this.alpha += 1 / (this.duration * 60);
    const endCoord = hotspot.position;

    if (this.alpha >= 1) {
      hotspot.focus = false;
      this.alpha = 0;
      return hotspot.position; // end position
    } else {
      return this.lerp(this._startCoord, endCoord); // way inbetween
    }
  }

  ease(hotspot: Hotspot) {
    const endCoord = hotspot.position;
    return this.lerp(this._startCoord, endCoord);
  }

  set startCoord(val: Vector3) {
    this._startCoord = val;
  }
}

export default Transitioner;
