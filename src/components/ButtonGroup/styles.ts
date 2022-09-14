import { css } from "lit";
import { buttonHeight } from "../ViewerCss";

export const styles = css`
  #viewerContainer .buttonGroup {
    position: absolute;
    bottom: 0;
    left: 0;
    height: ${buttonHeight}px;
    margin: 15px;
    border-radius: ${buttonHeight / 2}px;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    z-index: 30000;
  }

  #viewerContainer .buttonGroup .groupButton {
    padding: 8px 20px;
  }
`;
