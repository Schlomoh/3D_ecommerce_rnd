import { html } from "lit";

import closeIcon from "../../assets/closeIconSvg";
import { BMVBase, Constructor } from "../../bm-viewer";

export interface BaseHotspotElementsInterface {}

export const BaseHotspotMixin = <T extends Constructor<BMVBase>>(
  BaseClass: T
): Constructor<BaseHotspotElementsInterface> & T => {
  class BaseHotspotElements extends BaseClass {
    renderBaseHotspotElements() {
      return html`
        <button
          @click=${this.cancelFocus}
          class="float skeleton"
          id="cancelFocus"
        >
          ${closeIcon} Cancel focus
        </button>
      `;
    }
  }
  return BaseHotspotElements;
};
