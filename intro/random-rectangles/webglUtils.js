window.webglUtils = new class webglUtils {
    resizeCanvasToDisplaySize(canvas) {
        //...
        const realToCSSPixels = window.devicePixelRatio;
        console.log(realToCSSPixels);

        // Lookup the size the browser is displaying the canvas in CSS pixels
        // and compute a size needed to make our drawingbuffer match it in
        // device pixels.
        const displayWidth = Math.floor(canvas.clientWidth * realToCSSPixels);
        const displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels);

        // Check if the canvas is not the same size.
        if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
            // Make the canvas the same size
            canvas.width = displayWidth;
            canvas.height = displayHeight;
        }
    }
}

/**
 * @param {Number} min - Minimum
 * @param {Number} max - Maximum
 * @returns {Number} Random Integer between MIN and MAX passed
 */
window.randomInt = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}