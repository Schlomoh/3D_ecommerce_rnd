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
  return class HotspotOverview extends BaseClass {
    private listHotspots() {
      const hotspots = this.hotspotRenderer.hotspots;
      const indices = Object.keys(hotspots);

      const hotspotElements = indices.map((index, i) => {
        const hotspot = hotspots[Number(index)] as Hotspot;
        return html`
          <div
            @click=${() => this.onHotspotCardClick(hotspot)}
            class="hotspotCard"
          >
            <div class="header">
              <p class="hotspotId">${"Hotspot #" + (i + 1)}</p>
            </div>
            <div class="cardContainer">
              <h3>${hotspot.data.title || "ID-" + index + " (No title)"}</h3>
              <p>${hotspot.data.desc || "No description defined."}</p>
            </div>
          </div>
        `;
      });

      const elements =
        indices.length > 0
          ? hotspotElements
          : html`<p><strong>No hotspots created yet.</strong></p>`;
      return elements;
    }

    private onHotspotCardClick(hotspot: Hotspot) {
      this.showHotspotOverview = false;
      hotspot.select();
    }

    private cancelHotspotOverview() {
      this.showHotspotOverview = false;
    }

    protected updated(_changedProperties: PropertyValues): void {
      super.updated(_changedProperties);

      const element = this.shadowRoot?.getElementById(ID);
      const height = element?.clientHeight;

      if (this.showHotspotOverview)
        this.styleUpdater.updateStyle(ID, "right", "0px");
      else this.styleUpdater.updateStyle(ID, "right", `-${height! + 30}px`);
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
  };
};

export default HotspotOverviewMixin;