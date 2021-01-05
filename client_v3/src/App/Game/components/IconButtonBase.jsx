import React from "react";
import styled from "styled-components";

const ButtonContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 8vh;
  font-size: 2vh;
  margin-left: 10px;
  margin-right: 10px;
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  user-select: "false";
`;

const ButtonText = styled.p`
  margin-top: 2px;
  margin-bottom: 2px;
  user-select: "false";
  color: ${(props) => (props.disabled ? "gray" : "white")};
`;

const IconButtonBase = ({
  children,
  colour,
  disabled,
  onClick,
  size,
  text,
}) => {
  return (
    <ButtonContainer onClick={onClick} disabled={disabled}>
      <svg
        id="Solid"
        fill={disabled ? "grey" : colour}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {children}
      </svg>
      <ButtonText disabled={disabled}>{text}</ButtonText>
    </ButtonContainer>
  );
};

export default IconButtonBase;
