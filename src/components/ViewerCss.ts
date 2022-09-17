import { css } from "lit";

export const contrast = css`greenyellow`;
export const buttonHeight = 40;

export const viewerCss = css`
  #viewerContainer,
  #viewer {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  input:focus,
  select:focus,
  textarea:focus,
  button:focus {
    outline: none;
  }

  #viewerContainer .settings {
    position: absolute;
    overflow: hidden;
    left: 50%;
    transform: translateX(-50%);
    width: 50vw;
    min-width: 400px;
    max-height: calc(100vh - 40px);
    background-color: rgba(0, 0, 0, 0.75);
    border-radius: 15px;
    margin-bottom: 15px;
    z-index: 30005;
    transition: bottom 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  #viewerContainer .settings button {
    border: none;
    color: white;
    background: none;
  }

  #viewerContainer .settings button:hover {
    background: none;
  }

  #viewerContainer .settings button[type="submit"] {
    font-weight: bolder;
  }

  #viewerContainer .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: white;
    background-color: none;
  }

  #viewerContainer .header h3 {
    margin: 0;
  }

  #viewerContainer .settings .header {
    padding: 15px 20px;
    border-bottom: solid 1px rgba(255, 255, 255, 0.25);
  }

  #viewerContainer .settings .header button {
    padding: 0;
  }

  #viewerContainer .settings .header h3 {
    padding: 0;
    margin: 0;
  }

  #viewerContainer .settings form > input,
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

  .flyin {
    position: absolute;
    top: 0;
    width: 500px;
    height: 100vh;
    padding: 15px;
    background-color: rgba(0, 0, 0, 0.75);
    transition: right 0.5s;
  }

  #viewerContainer form {
    display: flex;
    flex-direction: column;
    padding: 20px;
    color: white;
    overflow-y: scroll;
    /* font-weight: 500; */
  }

  #viewerContainer button {
    border: none;
    cursor: pointer;
    padding: 5px 10px;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 50000;
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
    border-radius: ${buttonHeight / 2}px;
  }

  #viewerContainer button > svg,
  path {
    height: 10px;
    width: 10px;
    fill: white;
    stroke: white;
  }

  #viewerContainer button.skeleton {
    background-color: transparent;
    padding: 0;
    color: white;
  }
`;
