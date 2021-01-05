import React from "react";
import IconButtonBase from "./IconButtonBase";

const NextIB = ({ disabled, onClick }) => {
  return (
    <IconButtonBase
      colour={"white"}
      disabled={disabled}
      onClick={onClick}
      text="End Turn"
      size="512"
    >
      <path d="m383.432 280h-335.432a24 24 0 0 1 0-48h335.432l24 24zm-46.461 136.971 144-144a24 24 0 0 0 0-33.942l-144-144a24 24 0 0 0 -33.942 33.942l127.03 127.029-127.03 127.029a24 24 0 0 0 33.942 33.942z" />
    </IconButtonBase>
  );
};

const UndoIB = ({ disabled, onClick }) => {
  return (
    <IconButtonBase
      colour={"white"}
      disabled={disabled}
      onClick={onClick}
      text="Undo Move"
      size="512"
    >
      <path d="M488,256A232.014,232.014,0,0,1,114.533,439.892,233.557,233.557,0,0,1,32.508,318.447a24,24,0,1,1,46.235-12.894,185.25,185.25,0,0,0,65.083,96.312A182.236,182.236,0,0,0,256,440c101.458,0,184-82.542,184-184S357.458,72,256,72a182.241,182.241,0,0,0-112.175,38.135,184.6,184.6,0,0,0-32.139,31.792l-18.549,5.456L90.161,93.807A231.977,231.977,0,0,1,488,256ZM62.771,223.024l136-40a24,24,0,1,0-13.543-46.048L78.282,168.43,71.962,54.669a24,24,0,1,0-47.924,2.662l8,144a24,24,0,0,0,30.734,21.693Z" />
    </IconButtonBase>
  );
};

const DrawIB = ({ disabled, onClick, text }) => {
  return (
    <IconButtonBase
      colour={"white"}
      disabled={disabled}
      onClick={onClick}
      text={text}
      size="20"
    >
      <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z"></path>
      <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z"></path>
    </IconButtonBase>
  );
};

const LeaveIB = ({ disabled, onClick, text }) => {
  return (
    <IconButtonBase
      colour={"white"}
      disabled={disabled}
      onClick={onClick}
      text={text}
    >
      <path
        fill-rule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clip-rule="evenodd"
      ></path>
    </IconButtonBase>
  );
};

const StartIB = ({ disabled, onClick, text }) => {
  return (
    <IconButtonBase
      colour={"white"}
      disabled={disabled}
      onClick={onClick}
      text={text}
      size="20"
    >
      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
    </IconButtonBase>
  );
};

export { NextIB, UndoIB, DrawIB, LeaveIB, StartIB };
