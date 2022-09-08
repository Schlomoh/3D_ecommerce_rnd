import { css } from "lit";

const dotSize = 15;
const contrast = css`greenyellow`;

const viewerCss = css`
  #viewerContainer,
  #viewer {
    width: 100%;
    height: 100%;
  }

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

  input:focus,
  select:focus,
  textarea:focus,
  button:focus {
    outline: none;
  }

  #viewerContainer #hotspotConfig {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 50vw;
    height: 50vh;
    background-color: rgba(0, 0, 0, 0.75);
    border-radius: 15px;
    margin-bottom: 20px;
    transition: bottom 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    z-index: 30005;
    // bottom property is set dynamically
  }

  #viewerContainer #hotspotConfig form {
    display: flex;
    flex-direction: column;
    padding: 20px;
    color: white;
    /* font-weight: 500; */
  }
  #viewerContainer #hotspotConfig form > input,
  textarea {
    margin-bottom: 20px;
    padding: 5px 10px;
    border: solid 1px rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    font-family: unset;
    background-color: transparent;
    color: ${contrast};
    font-weight: 400;
    font-size: 16px;
    resize: none;
  }

  #viewerContainer #hotspotConfig button {
    border: none;
    color: white;
    background-color: transparent;
  }
  #viewerContainer #hotspotConfig button[type="submit"] {
    font-weight: bolder;
  }

  #viewerContainer #hotspotConfig .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: solid 1px rgba(255, 255, 255, 0.25);
    color: white;
    padding: 15px 20px;
    background-color: transparent;
  }

  #viewerContainer #hotspotConfig .header button {
    padding: 0;
  }
  #viewerContainer #hotspotConfig .header h3 {
    padding: 0;
    margin: 0;
  }

  #viewerContainer button {
    border: none;
    cursor: pointer;
    border-radius: 15px;
    padding: 5px 10px;
    background-color: #aeaeae;
  }

  @media (hover: hover) {
    #viewerContainer button:hover {
      background-color: #bfbfbf;
    }
  }

  #viewerContainer button:active {
    background-color: #6f6f6f;
  }

  #viewerContainer button.float {
    position: absolute;
    z-index: 30000;
  }

  #viewerContainer .playButton {
    width: 30px;
    height: 30px;
    bottom: 0;
    right: 0;
    margin: 20px;
    padding: 8px 11px;
  }

  #viewerContainer button > svg,
  path {
    height: 10px;
    width: 10px;
    fill: white;
    stroke: white;
  }

  #viewerContainer button#cancelFocus.float {
    background-color: transparent;
    padding: 0;
    color: white;
    mix-blend-mode: difference;
    border-radius: 15px;
    top: 0;
    margin-top: 20px;
    left: 50%;
    transform: translateX(-50%);
    transition: top 0.25s;
    font-weight: 600;
  }
`;

export default viewerCss;
