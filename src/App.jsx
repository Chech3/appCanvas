
import { useState, useEffect, useRef } from "react";
import { Canvas, Rect, Circle } from "fabric";
import "./App.css";
import { IconButton } from "blocksin-system";
import { BsCircle, BsSquare } from "react-icons/bs";
import Settings from "./settings";
import CanvasSettings from "./CanvasSettings";
import { handleObjectMoving, clearGuideLines } from "./SnappingHelpers";
const CanvasApp = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [guidelines, setGuideLines] = useState([]);

  const addRectangle = () => {
    if (canvas) {
      const rect = new Rect({
        left: 100,
        top: 50,
        width: 100,
        height: 100,
        fill: "#D84D42",
      });
      canvas.add(rect);
    }
  };

  const addCircle = () => {
    if (canvas) {
      const circle = new Circle({
        left: 100,
        top: 50,
        radius: 50,
        fill: "#426ad8",
      });
      canvas.add(circle);
    }
  };


  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 500,
        height: 500,
      });

      initCanvas.backgroundColor = "#fff";
      initCanvas.renderAll();

      setCanvas(initCanvas);

      initCanvas.on("object:moving", (e) => handleObjectMoving(initCanvas, e.target, guidelines, setGuideLines))


      initCanvas.on("object:modified", () => clearGuideLines(initCanvas, guidelines, setGuideLines))

      return () => {
        initCanvas.dispose();
      };
    }
  }, []);

  return (
    <div className="App">
      <div className="toolBar darkmode">
        <IconButton onClick={addRectangle} variant="ghost" size="medium">
          <BsSquare style={{ color: "white" }} />
        </IconButton>
        <IconButton onClick={addCircle} variant="ghost" size="medium">
          <BsCircle style={{ color: "white" }} />
        </IconButton>
      </div>

      <canvas id='canvas' ref={canvasRef} />
      <Settings canvas={canvas} />
      <CanvasSettings canvas={canvas} />
    </div>)
}

export default CanvasApp;