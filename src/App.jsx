
import { useState, useEffect, useRef } from "react";
import { Canvas, Rect, Circle, Line } from "fabric";
import "./App.css";
import { IconButton } from "blocksin-system";
import { BsCircle, BsSquare, BsFillTrash3Fill, BsFillPencilFill } from "react-icons/bs";
import Settings from "./settings";
import CanvasSettings from "./CanvasSettings";
import { handleObjectMoving, clearGuideLines } from "./SnappingHelpers";
const CanvasApp = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [guidelines, setGuideLines] = useState([]);
  const [isDrawingLine, setIsDrawingLine] = useState(false);

  const addRectangle = () => {
    if (canvas) {
      setIsDrawingLine(false);
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
      setIsDrawingLine(false);
      const circle = new Circle({
        left: 100,
        top: 50,
        radius: 50,
        fill: "#426ad8",
      });
      canvas.add(circle);
    }
  };

  const clearCanvas = () => {
    if (canvas) {
      setIsDrawingLine(false);
      canvas.clear();
      canvas.backgroundColor = "#fff"; // para mantener el color del fondo
      canvas.renderAll();
    }
  };

  const toggleDrawingLine = () => {
    setIsDrawingLine(!isDrawingLine);
  };




  useEffect(() => {
    if (canvas) {
      let line; // Almacena la línea que se está dibujando temporalmente

      const startLine = (options) => {
        if (!isDrawingLine) return;

        // Desactivar selección y selección múltiple
        canvas.selection = false;
        canvas.getObjects().forEach((obj) => (obj.selectable = false));

        const pointer = canvas.getPointer(options.e);
        const points = [pointer.x, pointer.y, pointer.x, pointer.y];

        line = new Line(points, {
          strokeWidth: 2,
          fill: "black",
          stroke: "black",
          originX: "center",
          originY: "center",
          selectable: false,
          evented: false,
        });
        canvas.add(line);
      };

      const drawLine = (options) => {
        if (!isDrawingLine || !line) return;

        const pointer = canvas.getPointer(options.e);
        line.set({
          x2: pointer.x,
          y2: pointer.y,
        });
        canvas.renderAll();
      };

      const endLine = () => {
        if (line) {
          line.setCoords(); // Ajusta las coordenadas de la línea
        }

        // Activar selección y selección múltiple nuevamente
        canvas.selection = true;
        canvas.getObjects().forEach((obj) => (obj.selectable = true));
        line = null;
      };

      canvas.on("mouse:down", startLine);
      canvas.on("mouse:move", drawLine);
      canvas.on("mouse:up", endLine);

      return () => {
        canvas.off("mouse:down", startLine);
        canvas.off("mouse:move", drawLine);
        canvas.off("mouse:up", endLine);
      };
    }
  }, [canvas, isDrawingLine]);


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

        <IconButton onClick={toggleDrawingLine} variant={isDrawingLine ? "solid" : "ghost"} size="medium">
          <BsFillPencilFill style={{ color: "white" }} />
        </IconButton>
        <IconButton onClick={addRectangle} variant="ghost" size="medium">
          <BsSquare style={{ color: "white" }} />
        </IconButton>
        <IconButton onClick={addCircle} variant="ghost" size="medium">
          <BsCircle style={{ color: "white" }} />
        </IconButton>
        <IconButton onClick={clearCanvas} variant="ghost" size="medium">
          <BsFillTrash3Fill style={{ color: "white" }} />
        </IconButton>
      </div>

      <canvas id='canvas' ref={canvasRef} />
      <Settings canvas={canvas} />
      <CanvasSettings canvas={canvas} />
    </div>)
}

export default CanvasApp;