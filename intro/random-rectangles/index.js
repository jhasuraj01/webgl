/**
 * Triangle in WebGL
 * Source: https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
 */

const canvas = document.getElementById("canvas");
const gl = canvas.getContext('webgl');

const app = async () => {
	const { positionAttributeLocation, colorUniformLocation } = await initializeApp(gl);

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.enableVertexAttribArray(positionAttributeLocation);

	// Attributes get their data from buffers so we need to create a buffer
	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	const size = 2;          // 2 components per iteration
	const type = gl.FLOAT;   // the data is 32bit floats
	const normalize = false; // don't normalize the data
	const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
	const offset = 0;        // start at the beginning of the buffer
	gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
    /**
     * we're free to bind something else to the ARRAY_BUFFER bind point.
     * The attribute will continue to use positionBuffer.
     */

	// *********
	// draw 50 random rectangles in random colors
	for (var ii = 0; ii < 50; ii++) {
		// Setup a random rectangle
		// This will write to positionBuffer because
		// its the last thing we bound on the ARRAY_BUFFER
		// bind point
		setRandomRectangle(gl);

		// Set a random color.
		gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);

		// Draw the rectangle.
		gl.drawArrays(gl.TRIANGLES, 0, 6); // (primitiveType, offset, count)
	}
}
window.addEventListener('load', app);


// Fills the buffer with the values that define a rectangle.
const setRandomRectangle = (gl) => {
	var x1 = randomInt(0, gl.canvas.clientWidth);
	var x2 = x1 + randomInt(-gl.canvas.clientWidth/2, gl.canvas.clientWidth/2);
	var y1 = randomInt(0, gl.canvas.clientWidth);
	var y2 = y1 + randomInt(-gl.canvas.clientHeight/2, gl.canvas.clientHeight/2);

	// NOTE: gl.bufferData(gl.ARRAY_BUFFER, ...) will affect
	// whatever buffer is bound to the `ARRAY_BUFFER` bind point
	// but so far we only have one buffer. If we had more than one
	// buffer we'd want to bind that buffer to `ARRAY_BUFFER` first.

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		x1, y1,
		x2, y1,
		x1, y2,
		x1, y2,
		x2, y1,
		x2, y2]), gl.STATIC_DRAW);
}


const initializeApp = async (gl) => {
	// will created a GLSL program on the GPU
	const program = await initializeProgram(gl);
	gl.useProgram(program);

	webglUtils.resizeCanvasToDisplaySize(gl.canvas);

	const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
	gl.uniform2f(resolutionUniformLocation, gl.canvas.clientWidth, gl.canvas.clientHeight);

	const colorUniformLocation = gl.getUniformLocation(program, "u_color");
	const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    /**
     * The code up to this point is initialization code.
     * Code that gets run once when we load the page.
     * The code after this point is rendering code or code that should get executed each time we want to render/draw.
     */
	return { program, positionAttributeLocation, colorUniformLocation };
}

/**
 * 
 * @param {*} gl - WebGL canvas context
 */
const initializeProgram = async (gl) => {
	//...
	const vertexShader_sourceCode = await (await fetch('./shader.vert.glsl')).text();
	const fragmentShader_sourceCode = await (await fetch('./shader.frag.glsl')).text();

	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShader_sourceCode);
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader_sourceCode);
	const program = createProgram(gl, vertexShader, fragmentShader);
	return program;
}

/**
 * 
 * @param {*} gl - WebGL canvas context
 * @param {*} vertexShader - WebGL VERTEX SHADER
 * @param {*} fragmentShader - WebGL FRAGMENT SHADER
 * @returns program - WebGL program
 */
const createProgram = (gl, vertexShader, fragmentShader) => {
	//...
	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	// gl.getProgramParameter(program, gl.LINK_STATUS) : boolean
	if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
		// console.log(gl.getProgramParameter(program, gl.LINK_STATUS));
		return program;
	} else {
		console.error(gl.getProgramInfoLog(program));
		gl.deleteProgram(program);
	}
}

/**
 * 
 * @param {*} gl - WebGL canvas context
 * @param {Number} type - WebGL shader type
 * @param {String} sourceCode - WebGL shader source code
 * @returns shader - WebGL shader
 */
const createShader = (gl, type, sourceCode) => {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, sourceCode);
	gl.compileShader(shader);

	// gl.getShaderParameter(shader, gl.COMPILE_STATUS) : boolean
	if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		// console.log(gl.getShaderParameter(shader, gl.COMPILE_STATUS));
		return shader;
	} else {
		console.error(gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
	}
}