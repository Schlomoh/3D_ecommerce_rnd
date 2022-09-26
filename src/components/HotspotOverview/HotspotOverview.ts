import { html, PropertyValues, TemplateResult } from "lit";
import { BMVBase, Constructor } from "../../bm-viewer";
import { Hotspot } from "../threeComponents";

export interface HotspotOverviewInterface {
  renderHotspotOverview: () => TemplateResult;
}

const ID = "hotspotOverview";

export const HotspotOverviewMixin = <T extends Constructor<BMVBase>>(
  BaseClass: T
): Constructor<HotspotOverviewInterface> & T => {
  class HotspotOverview extends BaseClass {
    private hotspots: Hotspot[] = [];

    private onHotspotCardClick(hotspot: Hotspot) {
      hotspot.select();
      this.showHotspotOverview = false;
    }

    private onClickRemove(hotspot: Hotspot) {
      // reset focus if currently focused hotspot is removed
      hotspot.focused && this.cancelFocus();
      hotspot.delete();

      this.getHotspotData(); // create updated hotspot array
      this.showHotspotConfig = false;
      this.requestUpdate(); // make ui rerender
    }

    private onClickEdit(hotspot: Hotspot) {
      const event = new CustomEvent("showHotspotConfig", {
        detail: { hotspot: hotspot },
      });
      hotspot.renderer.domElement.dispatchEvent(event);
      hotspot.select();
    }

    private cancelHotspotOverview() {
      this.showHotspotOverview = false;
    }

    private getHotspotData() {
      const hotspotObject = this.hotspotRenderer.hotspots;
      this.hotspots = Object.keys(hotspotObject).reduce((accu, key: string) => {
        accu.push(hotspotObject[key as unknown as number]);
        return accu;
      }, [] as Hotspot[]);
    }

    private listHotspots() {
      const hotspotElements = this.hotspots.map((hotspot, i) => {
        return html`
          <div class="hotspotCard">
            <div class="header">
              <p class="hotspotId">${"Hotspot #" + (i + 1)}</p>
              <div>
                <button
                  @click=${() => this.onClickEdit(hotspot)}
                  class="cancelButton skeleton"
                >
                  Edit
                </button>
                <button
                  @click=${() => this.onClickRemove(hotspot)}
                  class="cancelButton skeleton"
                >
                  Remove
                </button>
              </div>
            </div>
            <div
              class="cardContainer"
              @click=${() => this.onHotspotCardClick(hotspot)}
            >
              <h3>
                ${hotspot.data.title || "ID-" + hotspot.id + " (No title)"}
              </h3>
              <p>${hotspot.data.desc || "No description defined."}</p>
            </div>
          </div>
        `;
      });

      const elements =
        this.hotspots.length > 0
          ? hotspotElements
          : html`<p><strong>No hotspots created yet.</strong></p>`;
      return elements;
    }

    protected updated(_changedProperties: PropertyValues): void {
      super.updated(_changedProperties);

      this.getHotspotData();

      const element = this.shadowRoot?.getElementById(ID);
      const width = element?.clientWidth;

      if (this.showHotspotOverview)
        this.styleUpdater.updateStyle(ID, "right", "0px");
      else this.styleUpdater.updateStyle(ID, "right", `-${width! + 30}px`);
    }

    renderHotspotOverview() {
      return html`
        <div class="flyin" id=${ID}>
          <div class="header">
            <h3>Hotspot overview</h3>
            <button
              @click=${this.cancelHotspotOverview}
              class="cancelButton skeleton"
            >
              Cancel
            </button>
          </div>
          <div class="flyinContainer">${this.listHotspots()}</div>
        </div>
      `;
    }
  }
  return HotspotOverview;
};

export default HotspotOverviewMixin;
