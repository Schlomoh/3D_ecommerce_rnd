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
} from "./components";

import { StyleUpdater } from "./components/utils";

import {
  buttonGroupStyles,
  animationStyles,
  hotspotStyles,
  viewerCss,
} from "./components/styles";

import closeIcon from "./assets/closeIconSvg";

export type Constructor<T> = {
  new (...args: any[]): T;
  prototype: T;
};

export class BMVBase extends LitElement {
  @property({ type: String })
  modelSrc: string = "";

  @property()
  enumerateHotspots = true;

  @state()
  protected playing = false;

  @state()
  protected focusing = false;

  @state()
  protected showAnimationConfig = false;

  @state()
  protected showHotspotConfig = false;

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
    if (this.focusing)
      this.styleUpdater.updateStyle("cancelFocus", "top", "0px");
    else this.styleUpdater.updateStyle("cancelFocus", "top", "-50px");
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

  static styles = css`
    ${viewerCss}
    ${hotspotStyles}
    ${buttonGroupStyles} 
    ${animationStyles}
  `;

  renderBase() {
    return html`
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

const Mixed = ButtonGroup(HotspotConfig(AnimationConfig(BMVBase)));

export class BMV extends Mixed {
  constructor() {
    super();
  }

  render() {
    return html`
      <div id="viewerContainer">
        ${this.renderBase()} ${this.renderAnimationConfig()}
        ${this.renderHotspotConfig()} ${this.renderButtonGroup()}
      </div>
    `;
  }
}

customElements.define("bm-viewer", BMV);
