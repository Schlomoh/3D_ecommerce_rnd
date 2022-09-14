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
    overflow: scroll;
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

  #viewerContainer .settings .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: solid 1px rgba(255, 255, 255, 0.25);
    color: white;
    padding: 15px 20px;
    background-color: transparent;
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

  #viewerContainer form {
    display: flex;
    flex-direction: column;
    padding: 20px;
    color: white;
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
