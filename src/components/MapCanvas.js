import React, { useEffect, useRef, useState } from "react";
import background from "../statics/images/background.svg";
import wobbuffetsArray from "../statics/images/wobbuffetsArray";

const MAP_CONSTANTS = {};
MAP_CONSTANTS.IMG_WIDTH = 116;
MAP_CONSTANTS.IMG_HEIGHT = 125;
MAP_CONSTANTS.KEY_LEFT = 37;
MAP_CONSTANTS.KEY_DOWN = 38;
MAP_CONSTANTS.KEY_RIGHT = 39;
MAP_CONSTANTS.KEY_UP = 40;
MAP_CONSTANTS.SPEED = 8;
MAP_CONSTANTS.FRAMES_LENGTH = 23;

const MapCanvas = () => {
  const canvasRef = useRef(null);
  const requestAnimationRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const [pressedKey, setPressedKey] = useState(null);
  const [currentFrame, setCurrentFrame] = useState(0);

  const move = ({ x, y }) => {
    const newX = positionRef.current.x + x;
    const newY = positionRef.current.y + y;
    if (newX < 0 || newX > canvasRef.current.width - MAP_CONSTANTS.IMG_WIDTH)
      return;
    if (newY < 0 || newY > canvasRef.current.height - MAP_CONSTANTS.IMG_HEIGHT)
      return;
    positionRef.current = { x: newX, y: newY };
    setCurrentFrame((prev) =>
      prev < MAP_CONSTANTS.FRAMES_LENGTH ? prev + 1 : 0
    );
  };

  const render = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const wobbuffetsImage = new Image();
    wobbuffetsImage.src = wobbuffetsArray[currentFrame];
    wobbuffetsImage.onload = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      context.drawImage(
        wobbuffetsImage,
        positionRef.current.x,
        positionRef.current.y
      );
    };

    handleKey();
    requestAnimationRef.current = requestAnimationFrame(render);
  };

  const handleKey = () => {
    switch (pressedKey) {
      case MAP_CONSTANTS.KEY_LEFT:
        move({ x: -1 * MAP_CONSTANTS.SPEED, y: 0 });
        return;
      case MAP_CONSTANTS.KEY_DOWN:
        move({ x: 0, y: -1 * MAP_CONSTANTS.SPEED });
        return;
      case MAP_CONSTANTS.KEY_RIGHT:
        move({ x: MAP_CONSTANTS.SPEED, y: 0 });
        return;
      case MAP_CONSTANTS.KEY_UP:
        move({ x: 0, y: MAP_CONSTANTS.SPEED });
        return;
      case null:
        return;
      default:
        move({ x: 0, y: 0 });
        return;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      e.preventDefault();
      setPressedKey(e.keyCode);
    });
    window.addEventListener("keyup", () => setPressedKey(null));
    requestAnimationRef.current = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(requestAnimationRef.current);
    };
  });
  return (
    <canvas
      ref={canvasRef}
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        overflow: "hidden",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    ></canvas>
  );
};

export default MapCanvas;
