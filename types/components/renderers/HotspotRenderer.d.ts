import { PerspectiveCamera, Raycaster } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import Hotspot from "../Hotspot";
import ModelScene from "../ModelScene";
import { ClickHandler, WindowHandler } from "../utils";
declare class HotspotRenderer extends CSS2DRenderer {
    protected camera: PerspectiveCamera;
    protected clickHandler: ClickHandler;
    protected windowHandler: WindowHandler;
    protected raycaster: Raycaster;
    container: HTMLElement;
    controls: OrbitControls;
    scene: ModelScene;
    hotspots: Hotspot[];
    constructor(scene: ModelScene);
    update(): void;
    connect(container: HTMLElement): void;
}
export default HotspotRenderer;
