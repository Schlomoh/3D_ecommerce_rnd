import { PerspectiveCamera, Raycaster } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import Hotspot from "../Hotspot";
import ModelScene from "../ModelScene";
import { ClickHandler, WindowHandler } from "../utils";
/**
 * The 2D-renderer responsible for rendering the hotspot 2D-objects
 *
 * This second dom element gets placed 'above' the scene renderers (webGL2 renderer)
 * which then also has to handle the orbit controls
 */
declare class HotspotRenderer extends CSS2DRenderer {
    protected camera: PerspectiveCamera;
    protected clickHandler: ClickHandler;
    protected windowHandler: WindowHandler;
    protected raycaster: Raycaster;
    controls: OrbitControls;
    scene: ModelScene;
    hotspots: Hotspot[];
    container?: HTMLElement;
    constructor(scene: ModelScene);
    private focusHotspot;
    /**
     * update hotspot visibility based on a raycast every frame
     * if the hit is close enough to the actual hotspot position it is shown
     * othwerwise not
     *
     * @param hotspot - single hotspot
     */
    private updateHotspotVisibility;
    /**
     * gets called every frame
     * updates the visibility of each hotspot using raycasting
     *
     * also updates the orbit controls... since the 2D-renderers dom object
     * is placed 'above' the scene renderers
     *
     * calls 'focus hotspot' if one is clicked
     */
    update(): void;
    connect(container: HTMLElement): void;
}
export default HotspotRenderer;
