import { Event, Intersection, Object3D } from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { HotspotRenderer } from "./renderers";
import { Transitioner } from "./utils";
declare class Hotspot extends CSS2DObject {
    private _show;
    private renderer;
    private camera;
    private controls;
    focus: boolean;
    transitioner: Transitioner;
    element: HTMLDivElement;
    associatedObject?: Object3D<Event>;
    constructor(renderer: HotspotRenderer);
    private handleClick;
    private updateStyle;
    connectTo(target: Object3D<Event>, intersection: Intersection): void;
    set show(val: boolean);
    get show(): boolean;
}
export default Hotspot;
