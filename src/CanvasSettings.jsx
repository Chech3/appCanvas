import { useState, useEffect } from "react"
import { Input } from "blocksin-system"
const CanvasSettings = ({ canvas }) => {
    const [canvasHeight, setCanvasHeight] = useState(600);
    const [canvasWidth, setCanvasWidth] = useState(600);



    const handleWidthChange = (e) => {
        const value = e.target.value.replace(/,/g, "");
        const intValue = parseInt(value, 10)
        if (!isNaN(intValue)) {
            setCanvasWidth(intValue);
        } else {
            setCanvasWidth("");
        }
    }

    const handleHeightChange = (e) => {
        const value = e.target.value.replace(/,/g, "");
        const intValue = parseInt(value, 10)
        if (!isNaN(intValue)) {
            setCanvasHeight(intValue);
        } else {
            setCanvasWidth("");
        }
    }

    useEffect(() => {
        if (canvas) {
            canvas.setWidth(canvasWidth);
            canvas.setHeight(canvasHeight);
            canvas.rennderAll;
        }
    }, [canvasHeight, canvasWidth, canvas])


    return (
        <div className="canvasSettings darkmode">
            <Input fluid label="Width" onChange={handleWidthChange} value={canvasWidth} />
            <Input fluid label="Height" onChange={handleHeightChange} value={canvasHeight} />
        </div>
    )
}

export default CanvasSettings