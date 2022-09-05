import { css } from "lit";

const viewerCss = css`
  #viewerContainer {
    width: 100%;
    height: 100%;
  }

  #viewerContainer > input:focus,
  select:focus,
  textarea:focus,
  button:focus {
    outline: none;
  }

  #viewerContainer #hotspotConfig {
    position: absolute;
    width: 35vw;
    max-width: 350px;
    height: 100vh;
    background-color: white;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
    z-index: 30005;
    transition: right 0.5s;
  }
  #viewerContainer #hotspotConfig form {
    display: flex;
    flex-direction: column;
    padding: 20px;
    color: grey;
    font-weight: 500;
  }
  #viewerContainer #hotspotConfig form > input,
  textarea {
    margin-bottom: 20px;
    padding: 5px;
    border: none;
    border-radius: 3px;
    font-family: unset;
    background-color: lightgray;
    color: black;
  }

  #viewerContainer button {
    border: none;
    cursor: pointer;
    border-radius: 3px;
    padding: 5px 10px;
  }

  #viewerContainer button.float {
    position: absolute;
    border-radius: 50%;
    z-index: 30000;
  }

  #viewerContainer .playButton {
    width: 30px;
    height: 30px;
    bottom: 0;
    right: 0;
    margin: 20px;
    fill: #fff;
    padding: 8px 11px;
  }
  #viewerContainer .cancelButton {
    width: fit-content;
    margin-bottom: 20px;
  }

  #viewerContainer .playButton > svg {
    height: 10px;
    width: 10px;
  }

  #viewer {
    width: 100%;
    height: 100%;
  }
`;

export default viewerCss;
