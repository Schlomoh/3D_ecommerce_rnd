import { html, LitElement, PropertyValues, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Clock } from "three";

import playIcon from "./assets/playIconSvg";
import pauseIcon from "./assets/pauseIconSvg";

import Stats from "three/examples/jsm/libs/stats.module";

import {
  ModelRenderer,
  HotspotRenderer,
  ModelScene,
  Animations,
  Hotspot,
  viewerCss
} from "./components";

export type Constructor<T> = {
  new (...args: any[]): T;
  prototype: T;
};

import { StyleUpdater } from "./components/utils";
import closeIcon from "./assets/closeIconSvg";
import { HotspotConfigMixin } from "./components/HotspotConfig/HotspotConfig";

export class BMVBase extends LitElement {
  @property({ type: String })
  modelSrc: string = "";

  @property()
  enumerateHotspots = true;

  @state()
  playing = false;

  @state()
  protected showHotspotConfig = false;

  @state()
  protected focusing = false;

  protected selectedHotspot?: Hotspot;
  private animations: Animations;
  private styleUpdater: StyleUpdater;
  protected scene: ModelScene = new ModelScene();
  protected hotspotRenderer = new HotspotRenderer(this.scene, this.enumerateHotspots); // prettier-ignore
  private modelRenderer = new ModelRenderer(this.scene);
  private stats = Stats();

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.animations = this.scene.animationManager;
    this.styleUpdater = new StyleUpdater(this.shadowRoot);
  }

  protected start() {
    const clock = new Clock();
    const animate = () => {
      requestAnimationFrame(animate);

      if (this.scene.modelReady && this.animations.animationMixer) {
        this.animations.animationMixer.update(clock.getDelta());
      }

      // this.stats.update();
      this.hotspotRenderer.update();
      this.modelRenderer.render(this.scene, this.scene.camera);
      this.hotspotRenderer.render(this.scene, this.scene.camera);
    };
    animate();
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    // wait for first update so the viewer wrapper element has been rendered
    // and can be accessed
    const container = this.shadowRoot?.getElementById("viewer")!;
    // container.appendChild(this.stats.domElement);
    this.hotspotRenderer.connect(container);
    this.modelRenderer.connect(container);

    this.scene.loadModel(this.modelSrc);

    this.start();
  }

  protected updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);
    const hotspotConfig = this.shadowRoot?.getElementById("hotspotConfig");
    const hscfgHeight = hotspotConfig?.clientHeight;

    if (this.showHotspotConfig) this.styleUpdater.updateStyle('hotspotConfig', 'bottom', '0px' );
    else this.styleUpdater.updateStyle('hotspotConfig', 'bottom', `-${hscfgHeight! + 20}px`); // prettier-ignore

    if (this.focusing)
      this.styleUpdater.updateStyle("cancelFocus", "top", "0px");
    else this.styleUpdater.updateStyle("cancelFocus", "top", "-50px");
  }

  onPlayButtonClick() {
    if (this.playing) {
      this.animations.animationActions[0].fadeOut(0.25);
    } else {
      this.animations.animationActions[0].stop();
      this.animations.animationActions[0].play();
    }
    this.playing = !this.playing;
  }

  cancelFocus() {
    if (this.selectedHotspot) {
      this.selectedHotspot.focused = false;
      this.focusing = false;
      this.hotspotRenderer.prevHotspot?.detail?.updateVisibility(false);

      this.selectedHotspot.transitioner.startCameraPos =
        this.scene.camera.position;
      this.selectedHotspot.transitioner.startTarget =
        this.selectedHotspot.position;

      this.selectedHotspot.reset = true;
    }
  }

  showAnimationSettings() {}

  static styles = viewerCss;

  renderBase() {
    return html`
      <div class="buttonGroup">
        <button @click=${this.showAnimationSettings} class="groupButton">
          Animations
        </button>
        <button class="groupButton">HDR settings</button>
        <button class="groupButton">General</button>
      </div>

      <button @click=${this.onPlayButtonClick} class="playButton float">
        ${this.playing ? pauseIcon : playIcon}
      </button>
      <button
        @click=${this.cancelFocus}
        class="float skeleton"
        id="cancelFocus"
      >
        ${closeIcon} Cancel focus
      </button>
      <div id="viewer"></div>
    `;
  }
}

// // This can live anywhere in your codebase:
//
// function applyMixins(base: any, constructors: any[]) {
//   const getPropertyDesc = (proto: any, name: string) =>  Object.getOwnPropertyDescriptor(proto, name) || Object.create(null) // prettier-ignore
//   const defineProperty = (baseProto: any, extProto: any , name: string) => // prettier-ignore
//     (Object.defineProperty(baseProto, name, getPropertyDesc(extProto, name))) // prettier-ignore

//   constructors.forEach((extendeeConstr) => {
//     const propertyNames = Object.getOwnPropertyNames(extendeeConstr.prototype);
//     propertyNames.forEach((name) => {defineProperty(base.prototype, extendeeConstr.prototype, name)}); // prettier-ignore
//   });
// }

const Mixed = HotspotConfigMixin(BMVBase);

export class BMV extends Mixed {
  constructor() {
    super();
  }
  render() {
    return html`
      <div id="viewerContainer">
        ${this.renderHotspotConfig()} ${this.renderBase()}
      </div>
    `;
  }
}

customElements.define("bm-viewer", BMV);
