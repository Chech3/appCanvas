import { useState, useEffect } from "react"
import Input from '@mui/joy/Input';
import FormLabel from '@mui/joy/FormLabel';
import FormControl from '@mui/joy/FormControl';

const Settings = ({ canvas }) => {
    const [selectedObject, setSelectedObject] = useState(null);
    const [widthOption, setWidthOption] = useState("");
    const [heightOption, setHeightOption] = useState("");
    const [diameter, setDiameter] = useState("");
    const [color, setColor] = useState("");


    const handledObjectSelection = (object) => {
        if (!object) return;

        setSelectedObject(object);

        console.log(object.type)

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
        } else if (object.type === "line") { // Detección de la línea
            setWidthOption(Math.round(object.strokeWidth)); // Grosor de la línea
            setColor(object.stroke); // Color de la línea
            setDiameter(""); // Limpiar opciones de círculo
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
            if (selectedObject.type === 'line') {
                selectedObject.set({ stroke: value }); // Cambio de color en la línea
            } else {
                selectedObject.set({ fill: value });
            }
            canvas.renderAll();
        }
    };

    const handleLineWidthChange = (e) => {
        const value = e.target.value.replace(/,/g, "");
        const intValue = parseInt(value, 10);
        setWidthOption(intValue);

        if (selectedObject && selectedObject.type === "line" && intValue >= 0) {
            selectedObject.set({ strokeWidth: intValue });
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
                    <FormControl>
                        <FormLabel style={{ color: "white" }}>Width</FormLabel>
                        <Input placeholder="Width" type="number" onChange={handleWidthChange} label="Width" value={widthOption} />
                    </FormControl>

                    <FormControl>
                        <FormLabel style={{ color: "white" }}>Height</FormLabel>
                        <Input placeholder="Height" type="number" onChange={handlHeightChange} label="Height" value={heightOption} />
                    </FormControl>
                    <FormControl>
                        <FormLabel style={{ color: "white" }}>Color</FormLabel>
                        <Input type="color" onChange={handleColorChange} label="Color" value={color} />
                    </FormControl>
                </>
            )}

            {selectedObject && selectedObject.type === "circle" && (
                <>
                    {/* <Input placeholder="Width" type="number" onChange={handleWidthChange}  label="Width" value={widthOption} /> */}
                    {/* <Input placeholder="Height" type="number" onChange={handlHeightChange}  label="Height" value={heightOption} /> */}
                    <FormControl>
                        <FormLabel style={{ color: "white", }}>Diameter</FormLabel>
                        <Input placeholder="Diameter" type="number" onChange={handleDiameterChange} label="Diameter" value={diameter} />
                    </FormControl>
                    <FormControl>
                    <FormLabel style={{ color: "white", }}>Color</FormLabel>
                        <Input type="color" onChange={handleColorChange} label="Color" value={color} />
                    </FormControl>
                </>
            )}

            {selectedObject && selectedObject?.type === 'line' && (
                <>
                    <FormControl>
                        <FormLabel style={{color:"white"}}>Width</FormLabel>
                        <Input type="number" onChange={handleLineWidthChange} label="Line Width" value={widthOption} />
                    </FormControl>
                    <FormControl >
                        <FormLabel style={{color:"white"}}>Color</FormLabel>
                        <Input type="color" onChange={handleColorChange} label="Line Color" value={color} />
                    </FormControl>
                </>
            )}
        </div>
    )
}

export default Settings