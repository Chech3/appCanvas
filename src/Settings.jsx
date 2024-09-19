import { Input } from "blocksin-system";
import { useState, useEffect } from "react"
const Settings = ({ canvas }) => {
    const [selectedObject, setSelectedObject] = useState(null);
    const [widthOption, setWidthOption] = useState("");
    const [heightOption, setHeightOption] = useState("");
    const [diameter, setDiameter] = useState("");
    const [color, setColor] = useState("");


    const handledObjectSelection = (object) => {
        if (!object) return;

        setSelectedObject(object);

        if (object.type === "rect") {
            const width = object.width * object.scaleX; 
            const height = object.height * object.scaleY; 
            setWidthOption(Math.round(width));
            setHeightOption(Math.round(height));
            setColor(object.fill || "");
            setDiameter("");
        } else if (object.type === "circle") {
            const dia = object.radius * 2 * object.scaleX; 
            setDiameter(Math.round(dia));
            setColor(object.fill || "");
            setWidthOption("");
            setHeightOption("");
        }
    };

    const clearSettings = () => {
        setWidthOption("")
        setHeightOption("")
        setDiameter("")
        setColor("")
    }

    const handleWidthChange = (e) => {
        const value = e.target.value.replace(/,/g, "");
        const intValue = parseInt(value, 10)
        if (!isNaN(intValue)) {
            setWidthOption(intValue);

            if (selectedObject && selectedObject.type === "rect" && intValue >= 0) {
                selectedObject.set({ width: intValue / selectedObject.scaleX }); // Ajuste para `width`
                canvas.renderAll();
            }
        } else {
            setWidthOption("");
        }
    };
    const handlHeightChange = (e) => {
        const value = e.target.value.replace(/, /g, "");
        const intValue = parseInt(value, 10);

        if (!isNaN(intValue)) {
            setHeightOption(intValue);

            if (selectedObject && selectedObject.type === "rect" && intValue >= 0) {
                selectedObject.set({ height: intValue / selectedObject.scaleY }); // Ajuste para `height`
                canvas.renderAll();
            }
        } else {
            setHeightOption("");
        }
        
    };
    const handleDiameterChange = (e) => {
        const value = e.target.value.replace(/, /g, "");
        const intValue = parseInt(value, 10);
        setDiameter(intValue);
        if (selectedObject && selectedObject.type === "circle" && intValue >= 0) {
            selectedObject.set({ radius: intValue / 2 / selectedObject.scaleX });
            canvas.renderAll();
        }
    };
    const handleColorChange = (e) => {
        const value = e.target.value;
        setColor(value);

        if (selectedObject) {
            selectedObject.set({ fill: value });
            canvas.renderAll();
        }
    };


    useEffect(() => {
        if (canvas) {
            canvas.on('selection:created', (event) => {
                handledObjectSelection(event.selected[0])
            })

            canvas.on('selection:updated', (event) => {
                handledObjectSelection(event.selected[0])
            })
            canvas.on('selection:cleared', (event) => {
                setSelectedObject(null);
                clearSettings();
            })
            canvas.on('object:modified', (event) => {
                handledObjectSelection(event.target)
            })
            canvas.on('object:scaling', (event) => {
                handledObjectSelection(event.target)
            })
        }

    }, [canvas])

    return (
        <div className="settings darkmode">
            {selectedObject && selectedObject.type === "rect" && (
                <>
                    <Input placeholder="Width" type="number" onChange={handleWidthChange} fluid label="Width" value={widthOption} />
                    <Input placeholder="Height" type="number" onChange={handlHeightChange} fluid label="Height" value={heightOption} />
                    <Input type="color" onChange={handleColorChange} fluid label="Color" value={color} />
                </>
            )}

            {selectedObject && selectedObject.type === "circle" && (
                <>
                    {/* <Input placeholder="Width" type="number" onChange={handleWidthChange} fluid label="Width" value={widthOption} /> */}
                    {/* <Input placeholder="Height" type="number" onChange={handlHeightChange} fluid label="Height" value={heightOption} /> */}
                    <Input placeholder="Diameter" type="number" onChange={handleDiameterChange} fluid label="Diameter" value={diameter} />
                    <Input type="color" onChange={handleColorChange} fluid label="Color" value={color} />
                </>
            )}
        </div>
    )
}

export default Settings