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

type HotspotEvent = CustomEvent<{ hotspot: Hotspot }>;

@customElement("bm-viewer")
export class BMV extends LitElement {
  @property({ type: String })
  modelSrc: string = "";

  @state()
  playing = false;

  @state()
  private showHotspotConfig = false;

  @state()
  private focusing = false;
  private focusedHotspot?: Hotspot;

  private animations: Animations;
  private scene: ModelScene = new ModelScene();
  private hotspotRenderer = new HotspotRenderer(this.scene);
  private modelRenderer = new ModelRenderer(this.scene);
  private lastCreatedHotspot?: Hotspot;
  private styleUpdater: StyleUpdater;
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
    else this.styleUpdater.updateStyle('hotspotConfig', 'bottom', 'calc(-50vw - 15px - 20px)'); // prettier-ignore

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

  cancelHotspot() {
    const index = Object.keys(this.hotspotRenderer.hotspots).length;
    delete this.hotspotRenderer.hotspots[index];
    if (this.lastCreatedHotspot) this.scene.remove(this.lastCreatedHotspot);
    this.showHotspotConfig = false;
  }

  onAddHotspot(e: HotspotEvent) {
    this.lastCreatedHotspot = e.detail.hotspot;
    this.showHotspotConfig = true;
  }

  onClickedHotspot(e: HotspotEvent) {
    this.focusedHotspot = e.detail.hotspot;
    this.focusing = true;
  }

  onHotspotConfigSubmit(e: SubmitEvent) {
    e.preventDefault();
    const form = this.shadowRoot?.getElementById('configHotspotForm') as HTMLFormElement // prettier-ignore
    const title = form.elements.namedItem("title") as HTMLInputElement;
    const desc = form.elements.namedItem("desc") as HTMLTextAreaElement;

    const data = { title: title.value, desc: desc.value, media: null };

    const event = new CustomEvent("submitHotspot", { detail: { data: data } });
    this.hotspotRenderer.domElement.dispatchEvent(event);

    title.value = desc.value = "";

    this.showHotspotConfig = false;
  }

  cancelFocus() {
    if (this.focusedHotspot) {
      this.focusedHotspot.focused = false;
      this.focusing = false;
      this.hotspotRenderer.prevHotspot?.detail?.updateVisibility(false);

      this.focusedHotspot.transitioner.startCameraPos =
        this.scene.camera.position;
      this.focusedHotspot.transitioner.startTarget =
        this.focusedHotspot.position;
      this.focusedHotspot.reset = true;
    }
  }

  static styles = viewerCss;

  render() {
    return html`
      <div id="viewerContainer">
        <div id="hotspotConfig">
          <div class="header">
            <h3>Hotspot configuration</h3>
            <button @click=${this.cancelHotspot} class="cancelButton">
              Cancel
            </button>
          </div>
          <form @submit=${this.onHotspotConfigSubmit} id="configHotspotForm">
            <label for="title">Title</label>
            <input type="text" name="title" id="title" />
            <label for="desc">Description</label>
            <textarea id="desc" rows="10"></textarea>
            <button type="submit">Add hotspot</button>
          </form>
        </div>
        <button @click=${this.onPlayButtonClick} class="playButton float">
          ${this.playing ? pauseIcon : playIcon}
        </button>
        <button @click=${this.cancelFocus} id="cancelFocus" class="float">
          ${closeIcon} Cancel focus
        </button>
        <div id="viewer"></div>
      </div>
    `;
  }
}
