import { html, PropertyValues, TemplateResult } from "lit";
import { BMVBase, Constructor } from "../../bm-viewer";

export interface GeneralSettingsInterface {
  renderGeneralSettings: () => TemplateResult;
}

const ID = "generalSettings";

export const GeneralSettingsMixin = <T extends Constructor<BMVBase>>(
  BaseClass: T
): Constructor<GeneralSettingsInterface> & T => {
  class GeneralSettings extends BaseClass {
    protected cancelGeneralSettings() {
      this.showGeneralSettings = false;
    }

    protected updated(_changedProperties: PropertyValues): void {
      super.updated(_changedProperties);

      const element = this.shadowRoot?.getElementById(ID);
      const width = element?.clientWidth;

      if (this.showGeneralSettings)
        this.styleUpdater.updateStyle(ID, "right", "0px");
      else this.styleUpdater.updateStyle(ID, "right", `-${width! + 30}px`);
    }

    renderGeneralSettings() {
      return html`
        <div class="flyin" id=${ID}>
          <div class="header">
            <h3>General Settings</h3>
            <button
              @click=${this.cancelGeneralSettings}
              class="cancelButton skeleton"
            >
              Cancel
            </button>
          </div>
          <div class="flyinContainer"></div>
        </div>
      `;
    }
  }
  return GeneralSettings;
};
