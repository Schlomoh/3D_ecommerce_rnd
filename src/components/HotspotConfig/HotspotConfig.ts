import { html, PropertyValues, TemplateResult } from "lit";
import { BMVBase, Constructor } from "../../bm-viewer";
import { HotspotEvent } from "../threeComponents";

export interface HotspotConfigInterface {
  renderHotspotConfig: () => TemplateResult;
}

export const HotspotConfigMixin = <T extends Constructor<BMVBase>>(
  BaseClass: T
): Constructor<HotspotConfigInterface> & T => {
  return class HotspotConfig extends BaseClass {
    private onShowHotspotConfig(e: HotspotEvent) {
      this.selectedHotspot = e.detail.hotspot;
      this.showHotspotConfig = true;
      // if the edit button was clicked
      if (this.selectedHotspot.detail) {
        const { title, desc } = this.getFormElements();
        title.value = this.selectedHotspot.data.title;
        desc.value = this.selectedHotspot.data.desc;
      }
    }

    private cancelHotspotConfig() {
      if (this.selectedHotspot?.focused) this.cancelFocus();

      if (!this.selectedHotspot?.detail) {
        if (this.selectedHotspot) {
          this.scene.remove(this.selectedHotspot);
          delete this.hotspotRenderer.hotspots[this.selectedHotspot.id];
        }
      }
      this.resetForm();
      this.showHotspotConfig = false;
    }

    private onHotspotConfigSubmit(e: SubmitEvent) {
      e.preventDefault();
      const { title, desc } = this.getFormElements();

      this.selectedHotspot!.data = {
        title: title.value,
        desc: desc.value,
        media: null,
      };

      const event = new CustomEvent("submitHotspot", {
           detail: { hotspot: this.selectedHotspot }}); // prettier-ignore
      this.hotspotRenderer.domElement.dispatchEvent(event);

      this.resetForm();
      this.showHotspotConfig = false;
    }

    private resetForm() {
      const { title, desc } = this.getFormElements();
      title.value = "";
      desc.value = "";
    }

    private getFormElements() {
      const form = this.shadowRoot?.getElementById('configHotspotForm') as HTMLFormElement // prettier-ignore
      const title = form.elements.namedItem("title") as HTMLInputElement;
      const desc = form.elements.namedItem("desc") as HTMLTextAreaElement;
      return { title: title, desc: desc };
    }

    private onClickedHotspot(e: HotspotEvent) {
      this.selectedHotspot = e.detail.hotspot;
      this.focusing = true;
    }

    protected firstUpdated(_changedProperties: PropertyValues): void {
      super.firstUpdated(_changedProperties);

      this.hotspotRenderer.domElement.addEventListener(
        "showHotspotConfig",
        (e) => this.onShowHotspotConfig(e as HotspotEvent)
      );

      this.hotspotRenderer.domElement.addEventListener("clickedHotspot", (e) =>
        this.onClickedHotspot(e as HotspotEvent)
      );
    }

    protected updated(_changedProperties: PropertyValues): void {
      super.updated(_changedProperties);
      const hotspotConfig = this.shadowRoot?.getElementById("hotspotConfig");
      const hscfgHeight = hotspotConfig?.clientHeight;

      if (this.showHotspotConfig) this.styleUpdater.updateStyle('hotspotConfig', 'bottom', '0px' );
      else this.styleUpdater.updateStyle('hotspotConfig', 'bottom', `-${hscfgHeight! + 20}px`); // prettier-ignore
    }

    renderHotspotConfig() {
      return html`
        <div class="settings" id="hotspotConfig">
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
      `;
    }
  };
};