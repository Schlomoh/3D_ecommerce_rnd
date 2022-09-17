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

      return (indices.length > 0) ? indices.map((index, i ) => {
        const hotspot = hotspots[Number(index)];
        return html`
          <div  @click=${() => this.onHotspotCardClick(hotspot)} class="hotspotCard">
          <p class='hotspotId'>${'Hotspot #' + (i + 1)}</p> 
            <h3>${hotspot.data.title || "Hotspot ID: " + index}</h3>
            <p>${hotspot.data.desc || 'No description was defined.'}</p>
          </div>
        `;
      }) : html`<p><strong>No hotspots created yet.</strong></p>`
    }

    private onHotspotCardClick(hotspot: Hotspot) {
      this.showHotspotOverview = false;
      hotspot.select()
    }

    private cancelHotspotOverview () {
      this.showHotspotOverview = false
    }

    protected updated(_changedProperties: PropertyValues): void {
      super.updated(_changedProperties);

      const element = this.shadowRoot?.getElementById(ID)
      const height = element?.clientHeight
      
      if (this.showHotspotOverview) this.styleUpdater.updateStyle(ID, 'right', '0px') // prettier-ignore
      else this.styleUpdater.updateStyle(ID, 'right', `-${height! + 30}px` )
    }

    renderHotspotOverview() {
      return html`
        <div class='flyin' id=${ID}>
        <div class="header">
            <h3>Hotspot overview</h3>
            <button @click=${this.cancelHotspotOverview} class="cancelButton skeleton">
              Cancel
            </button>
          </div>
          ${this.listHotspots()}
        </div>
      `
    }
  };
};

export default HotspotOverviewMixin;
