import { css, html, LitElement, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { Clock } from "three";

import Stats from "three/examples/jsm/libs/stats.module";

import {
  ModelRenderer,
  HotspotRenderer,
  ModelScene,
  Animations,
  Hotspot,
  AnimationConfig,
  HotspotConfig,
  ButtonGroup,
  HotspotOverview,
  GeneralSettings,
  BaseHotspotElements,
} from "./components";

import { StyleUpdater } from "./components/utils";

import {
  buttonGroupStyles,
  animationStyles,
  hotspotStyles,
  viewerCss,
  hotspotOverviewStyles,
  generalSettingsStyles,
  baseHotspotElementStyles
} from "./components/styles";

export type Constructor<T> = {
  new (...args: any[]): T;
  prototype: T;
};

/**
 * State handling and shadow dom creation connecting renderers
 */
export class BMVBase extends LitElement {
  @property({ type: String })
  modelSrc: string = "";

  @property()
  enumerateHotspots = true;

  @property()
  token: string = "";

  //

  @state()
  protected playing = false;

  @state()
  protected focusing = false;

  @state()
  protected showAnimationConfig = false;
  @state()
  protected showHotspotConfig = false;
  @state()
  protected showHotspotOverview = false;
  @state()
  protected showGeneralSettings = false;

  protected selectedHotspot?: Hotspot;
  protected animations: Animations;
  protected styleUpdater: StyleUpdater;
  protected scene: ModelScene = new ModelScene();
  protected hotspotRenderer = new HotspotRenderer(this.scene, this.enumerateHotspots); // prettier-ignore
  protected modelRenderer = new ModelRenderer(this.scene);
  private stats = Stats();

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.animations = this.scene.animationManager;
    this.styleUpdater = new StyleUpdater(this.shadowRoot);
  }

  protected cancelFocus() {
    if (this.selectedHotspot) {
      this.selectedHotspot.focused = false;
      this.focusing = false;
      this.hotspotRenderer.prevHotspot?.detail?.updateVisibility(false);

      this.hotspotRenderer.transitioner.startCameraPos = this.scene.camera.position; // prettier-ignore
      this.hotspotRenderer.transitioner.startTarget = this.selectedHotspot.position; // prettier-ignore

      this.hotspotRenderer.resettingFocus = true;
    }
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    // wait for first update so the viewer wrapper element has been rendered
    // and can be accessed
    const container = this.shadowRoot?.getElementById("viewer")!;
    container.appendChild(this.stats.domElement);
    this.hotspotRenderer.connect(container);
    this.modelRenderer.connect(container);

    this.scene.loadModel(this.modelSrc);

    this.start();
  }

  protected updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);
  }

  protected start() {
    const clock = new Clock();
    const animate = () => {
      requestAnimationFrame(animate);

      if (this.scene.modelReady && this.animations.animationMixer) {
        this.animations.animationMixer.update(clock.getDelta());
      }

      this.stats.update();
      this.hotspotRenderer.update();
      this.modelRenderer.render(this.scene, this.scene.camera);
      this.hotspotRenderer.render(this.scene, this.scene.camera);
    };
    animate();
  }

  renderBase() {
    return html` <div id="viewer"></div> `;
  }
}

const Mixed = BaseHotspotElements(
  GeneralSettings(
    HotspotOverview(ButtonGroup(HotspotConfig(AnimationConfig(BMVBase))))
  )
);

/**
 * Final class calling all the html rendering methods
 */

export class BMV extends Mixed {
  constructor() {
    super();
  }

  view() {
    const viewer = html` ${this.renderBase()} `;
    const editor = html`${viewer} ${this.renderAnimationConfig()}
    ${this.renderHotspotConfig()} ${this.renderButtonGroup()}
    ${this.renderHotspotOverview()} ${this.renderGeneralSettings()}`;

    if (this.token === "editor") {
      return editor;
    } else return viewer;
  }

  static styles = css`
    ${viewerCss}
    ${hotspotStyles}
    ${buttonGroupStyles} 
    ${animationStyles}
    ${hotspotOverviewStyles}
    ${generalSettingsStyles}
  `;

  render() {
    return html` <div id="viewerContainer">${this.view()}</div> `;
  }
}

customElements.define("bm-viewer", BMV);
