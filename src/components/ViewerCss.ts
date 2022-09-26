import { css } from "lit";

export const contrast = css`greenyellow`;
export const buttonHeight = 40;

export const viewerCss = css`
  #viewer,
  #viewerContainer {
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

  .settings {
    position: absolute;
    overflow: hidden;
    left: 50%;
    transform: translateX(-50%);
    width: 50vw;
    min-width: 400px;
    max-width: 600px;
    max-height: calc(100vh - 40px);
    background-color: rgba(0, 0, 0, 0.75);
    border-radius: 15px;
    margin-bottom: 15px;
    z-index: 30005;
    transition: bottom 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .settings button {
    border: none;
    color: white;
    background: none;
  }

  .settings button:hover {
    background: none;
  }

  .settings button[type="submit"] {
    font-weight: bolder;
  }

  .settings button[type="submit"]:disabled {
    color: grey;
  }

  .settings .header,
  .flyin .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: white;
    background-color: none;
    border-bottom: solid 1px rgba(255, 255, 255, 0.2);
    padding: 15px 20px;
  }

  .header h3 {
    margin: 0;
  }

  .settings .header button {
    padding: 0;
  }

  .settings .header h3 {
    padding: 0;
    margin: 0;
  }

  .settings form > input,
  textarea {
    margin-bottom: 20px;
    padding: 5px 10px;
    border: solid 1px rgba(255, 255, 255, 0.2);
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
    max-width: 80vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.75);
    transition: right 0.5s;
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
  }

  .flyinContainer {
    padding: 15px;
  }

  .flyinContainer p {
    margin-top: 0;
  }

  form {
    display: flex;
    flex-direction: column;
    padding: 20px;
    color: white;
    overflow-y: scroll;
    /* font-weight: 500; */
  }

  button {
    border: none;
    cursor: pointer;
    padding: 5px 10px;
    background-color: rgba(0, 0, 0, 0.75);
    z-index: 50000;
  }

  @media (hover: hover) {
    button:hover {
      background-color: rgba(0, 0, 0, 0.5);
    }
  }

  button:active {
    background-color: rgba(0, 0, 0, 0.9);
  }

  button.float {
    position: absolute;
    z-index: 30000;
    border-radius: ${buttonHeight / 2}px;
  }

  button > svg,
  path {
    height: 10px;
    width: 10px;
    fill: white;
    stroke: white;
  }

  button.skeleton {
    background-color: transparent;
    padding: 0;
    color: white;
    margin-left: 15px;
  }
`;
