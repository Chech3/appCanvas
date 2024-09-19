import { Line } from "fabric"

const snapDistance = 10;



export const createVerticalGuideLine = (canvas,x,id) => {
    return new Line([x, 0, x, canvas.height], {
        id,
        stroke: 'red',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        strokeDashArray: [5, 5],
        opacity: 0.8,
    });
}

export const createHorizontalGuideLine = (canvas,y,id) => {
    return new Line([0, y, canvas.width, y], {
        id,
        stroke: 'red',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        strokeDashArray: [5, 5],
        opacity: 0.8,
    });
}

export const clearGuideLines = (canvas) => {
const objects = canvas.getObjects("line");
objects.forEach((obj) => {
if( obj.id && obj.id.startsWith("vertical-") || obj.id.startsWith("horizontal-")){
    canvas.remove(obj);
}
});
canvas.renderAll();
}


const guidelinesExist = (canvas, id) => {
    const objects = canvas.getObjects("line");
    return objects.some((obj) => obj.id === id);
}



export const handleObjectMoving = (canvas, obj, guidelines, setGuideLines) => {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const left = obj.left;
    const top = obj.top;
    const right = left + obj.width * obj.scaleX;
    const bottom = top + obj.height * obj.scaleY;

    const centerX = left + (obj.width * obj.scaleX) / 2;
    const centerY = top + (obj.height * obj.scaleY) / 2;

    let newGuideLines = [];
    clearGuideLines(canvas);


    let snapped = false;

    if (Math.abs(left) < snapDistance) {
        obj.set({ left: 0 });
        if (!guidelinesExist(canvas, "vertical-left")) {
            const line = createVerticalGuideLine(canvas, 0, "vertical-left")
            newGuideLines.push(line);
            canvas.add(line);
        }
        snapped = true;
    }

    if (Math.abs(top) < snapDistance) {
        obj.set({ top: 0 });
        if (!guidelinesExist(canvas, "horizontal-top")) {
            const line = createHorizontalGuideLine(canvas, 0, "horizontal-top")
            newGuideLines.push(line);
            canvas.add(line);
        }
        snapped = true;
    }

    if (Math.abs(right - canvasWidth) < snapDistance) {
        obj.set({ left: canvasWidth - obj.width * obj.scaleX });
        if (!guidelinesExist(canvas, "vertical-right")) {
            const line = createVerticalGuideLine(canvas, canvasWidth, "vertical-right")
            newGuideLines.push(line);
            canvas.add(line);
        }
        snapped = true;
    }


    if (Math.abs(bottom - canvasHeight) < snapDistance) {
        obj.set({ top: canvasHeight - obj.height * obj.scaleY });
        if (!guidelinesExist(canvas, "horizontal-bottom")) {
            const line = createHorizontalGuideLine(canvas, canvasHeight, "horizontal-bottom")
            newGuideLines.push(line);
            canvas.add(line);
        }
        snapped = true;
    }

    if (Math.abs(centerX - canvasWidth / 2) < snapDistance) {
        obj.set({ left: canvasWidth / 2 - (obj.width * obj.scaleX) / 2 });
        if (!guidelinesExist(canvas, "vertical-center")) {
            const line = createVerticalGuideLine(canvas, canvasWidth / 2, "vertical-center")
            newGuideLines.push(line);
            canvas.add(line);
        }
        snapped = true;
    }


    if (Math.abs(centerY - canvasHeight / 2) < snapDistance) {
        obj.set({ top: canvasHeight / 2 - (obj.height * obj.scaleY) / 2 });
        if (!guidelinesExist(canvas, "horizontal-center")) {
            const line = createHorizontalGuideLine(canvas, canvasHeight / 2, "horizontal-center")
            newGuideLines.push(line);
            canvas.add(line);
        }
        snapped = true;
    }


    if (!snapped) {
        clearGuideLines(canvas);
    } else {
        setGuideLines(newGuideLines);
    }

    canvas.renderAll();
};

