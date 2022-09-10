import { html, LitElement, PropertyValues } from "lit";
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
  viewerCss,
} from "./components";
import { StyleUpdater } from "./components/utils";
import closeIcon from "./assets/closeIconSvg";
import { HotspotEvent } from "./components/Hotspot";

@customElement("bm-viewer")
export class BMV extends LitElement {
  @property({ type: String })
  modelSrc: string = "";

  @property()
  enumerateHotspots = true;

  @state()
  playing = false;

  @state()
  private showHotspotConfig = false;

  @state()
  private focusing = false;

  private selectedHotspot?: Hotspot;
  private animations: Animations;
  private styleUpdater: StyleUpdater;
  private scene: ModelScene = new ModelScene();
  private hotspotRenderer = new HotspotRenderer(this.scene, this.enumerateHotspots); // prettier-ignore
  private modelRenderer = new ModelRenderer(this.scene);
  private stats = Stats();

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.hotspotRenderer.domElement.addEventListener("addedHotspot", (e) =>
      this.onAddHotspot(e as HotspotEvent)
    );

    this.hotspotRenderer.domElement.addEventListener("clickedHotspot", (e) =>
      this.onClickedHotspot(e as HotspotEvent)
    );

    this.hotspotRenderer.domElement.addEventListener("editHotspot", (e) => {
      this.onAddHotspot(e as HotspotEvent);
    });

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

      this.stats.update();
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
    container.appendChild(this.stats.domElement);
    this.hotspotRenderer.connect(container);
    this.modelRenderer.connect(container);

    this.scene.loadModel(this.modelSrc);

    this.start();
  }

  protected updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);

    if (this.showHotspotConfig) this.styleUpdater.updateStyle('hotspotConfig', 'bottom', '0px' );
    else this.styleUpdater.updateStyle('hotspotConfig', 'bottom', '-55vh'); // prettier-ignore

    if (this.focusing)
      this.styleUpdater.updateStyle("cancelFocus", "top", "0px");
    else this.styleUpdater.updateStyle("cancelFocus", "top", "-50px");
  }

  private getFormElements() {
    const form = this.shadowRoot?.getElementById('configHotspotForm') as HTMLFormElement // prettier-ignore
    const title = form.elements.namedItem("title") as HTMLInputElement;
    const desc = form.elements.namedItem("desc") as HTMLTextAreaElement;
    return { title: title, desc: desc };
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

  onAddHotspot(e: HotspotEvent) {
    this.selectedHotspot = e.detail.hotspot;
    this.showHotspotConfig = true;
    if (this.selectedHotspot.detail) {
      const inputs = this.getFormElements();
      inputs.title.value = this.selectedHotspot.data.title;
      inputs.desc.value = this.selectedHotspot.data.desc;
    }
  }

  cancelHotspotConfig() {
    if (this.selectedHotspot?.focused) {
      this.cancelFocus();
    }

    if (!this.selectedHotspot?.detail) {
      if (this.selectedHotspot) {
        this.scene.remove(this.selectedHotspot);
        delete this.hotspotRenderer.hotspots[this.selectedHotspot.id];
      }
    }
    this.showHotspotConfig = false;
  }

  onHotspotConfigSubmit(e: SubmitEvent) {
    e.preventDefault();
    const inputs = this.getFormElements();

    const data = {
      title: inputs.title.value,
      desc: inputs.desc.value,
      media: null,
    };

    this.selectedHotspot!.data = data;

    const event = new CustomEvent("submitHotspot", {
      detail: { hotspot: this.selectedHotspot },
    });
    this.hotspotRenderer.domElement.dispatchEvent(event);

    inputs.title.value = inputs.desc.value = "";
    this.showHotspotConfig = false;
  }

  onClickedHotspot(e: HotspotEvent) {
    this.selectedHotspot = e.detail.hotspot;
    this.focusing = true;
  }

  cancelFocus() {
    if (this.selectedHotspot) {
      0;
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

  static styles = viewerCss;

  render() {
    return html`
      <div id="viewerContainer">
        <div id="hotspotConfig">
          <div class="header">
            <h3>Hotspot configuration</h3>
            <button @click=${this.cancelHotspotConfig} class="cancelButton">
              Cancel
            </button>
          </div>
          <form @submit=${this.onHotspotConfigSubmit} id="configHotspotForm">
            <label for="title">Title</label>
            <input type="text" name="title" id="title" />
            <label for="desc">Description</label>
            <textarea id="desc" rows="10"></textarea>
            <button type="submit">Set hotspot detail</button>
          </form>
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
      </div>
    `;
  }
}
