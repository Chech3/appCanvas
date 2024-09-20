import { useState, useEffect } from "react"
import Input from '@mui/joy/Input';
import FormLabel from '@mui/joy/FormLabel';
import FormControl from '@mui/joy/FormControl';
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
            <FormControl>
                <FormLabel style={{ color: "white" }} l>Width</FormLabel>
                <Input placeholder="Width" label="Width" onChange={handleWidthChange} value={canvasWidth} />
            </FormControl>
            <FormControl>
                <FormLabel style={{ color: "white" }} l>Height</FormLabel>
                <Input label="Height" onChange={handleHeightChange} value={canvasHeight} />
            </FormControl>
        </div>
    )
}

export default CanvasSettings