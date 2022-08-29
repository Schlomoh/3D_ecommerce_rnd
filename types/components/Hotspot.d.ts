import { Event, Object3D, Vector3 } from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
declare class Hotspot extends CSS2DObject {
    show: boolean;
    constructor();
    private changeVisibility;
    connectTo(target: Object3D<Event>, position: Vector3): void;
    update(show: boolean): void;
}
export default Hotspot;
