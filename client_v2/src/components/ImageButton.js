import React from "react";
import styled from "styled-components";

import { ReactComponent as UndoSVG } from "../images/undo.svg";
import { ReactComponent as NextSVG } from "../images/next.svg";
import { ReactComponent as DrawSVG } from "../images/plus.svg";

const ButtonContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 8vh;
  font-size: 2vh;
  margin-left: 10px;
  margin-right: 10px;
  cursor: pointer;
  userselect: "false";
`;

const ButtonText = styled.p`
  margin-top: 2px;
  margin-bottom: 2px;
  color: ${(props) => (props.disabled ? "gray" : "white")};
`;

const ImageButton = ({ disabled, onClick, text, type }) => {
  return (
    <ButtonContainer onClick={onClick} disabled={disabled}>
      {type === "undo" ? (
        <UndoSVG
          style={{
            width: "100%",
            color: disabled ? "grey" : "white",
          }}
        />
      ) : null}
      {type === "draw" ? (
        <DrawSVG
          style={{
            width: "100%",
            color: "white",
          }}
        />
      ) : null}
      {type === "next" ? (
        <NextSVG
          style={{
            width: "100%",
            height: "100%",
            color: "white",
          }}
        />
      ) : null}
      <ButtonText disabled={disabled}>{text}</ButtonText>
    </ButtonContainer>
  );
};

export default ImageButton;
