import { Vector3 } from "three";
import Hotspot from "../Hotspot";
declare class Transitioner {
    private hotspot;
    private duration;
    private alpha;
    _startCoords: {
        target: Vector3;
        camera: Vector3;
    };
    finished: boolean;
    constructor(hotspot: Hotspot, duration: number);
    private lerp;
    linear(camEndPos: Vector3): Vector3[];
    ease(hotspot: Hotspot): Vector3;
    set startTarget(val: Vector3);
    set startCameraPos(val: Vector3);
}
export default Transitioner;
