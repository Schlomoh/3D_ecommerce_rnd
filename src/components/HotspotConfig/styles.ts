import { css } from "lit";
import { contrast } from "../ViewerCss";

const dotSize = 15;
const hotspotDetail = {
  width: 350,
  padding: 15,
};

export const styles = css`
  #viewer .hotspot {
    width: ${dotSize}px;
    height: ${dotSize}px;
    border-radius: 50%;
    border: solid 1px white;
    cursor: pointer;
    transition: background-color 0.5s, opacity 0.5s;
    font-size: 10px;
  }

  #viewer .hotspot p {
    margin: 0;
    padding: 3px 4.5px;
    line-height: 1;
  }

  #viewer .hotspot:hover {
    border-color: ${contrast};
  }

  #viewer .hotspotDetail {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.75);
    border-radius: 10px;
    width: ${hotspotDetail.width}px;
    max-width: 75vw;
    color: white;
    transform: translate(-50%, 15px);
    padding: ${hotspotDetail.padding}px;
    transition: visibility 0.5s, opacity 0.5s;
  }

  #viewer .hotspotDetail .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  #viewer .hotspotDetail h3 {
    margin: 0;
  }

  #viewer .hotspotDetail p {
    border-top: solid 0.5px rgba(255, 255, 255, 0.2);
    margin-top: 10px;
    padding-top: 15px;
  }

  #viewer .hotspotDetail h3,
  #viewer .hotspotDetail p {
    word-break: break-all;
    line-break: auto;
  }

  #viewerContainer button#cancelFocus {
    mix-blend-mode: difference;
    top: 0;
    margin-top: 15px;
    left: 50%;
    transform: translateX(-50%);
    transition: top 0.25s;
    font-weight: 600;
  }
`;
