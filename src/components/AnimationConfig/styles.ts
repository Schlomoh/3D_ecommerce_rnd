import { css } from "lit";
import { buttonHeight } from "../ViewerCss";

export const styles = css`
  #viewerContainer .playButton {
    width: ${buttonHeight}px;
    height: ${buttonHeight}px;
    bottom: 0;
    right: 0;
    margin: 15px;
    padding: 13px 16px;
  }
`;
