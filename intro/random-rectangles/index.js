/**
 * Triangle in WebGL
 * Source: https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
 */

const canvas = document.getElementById("canvas");
const gl = canvas.getContext('webgl');

const app = async () => {
	const { program, positionAttributeLocation, positionBuffer, resolutionUniformLocation } = await initializeApp(gl);
	webglUtils.resizeCanvasToDisplaySize(gl.canvas);

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.useProgram(program);

	gl.uniform2f(resolutionUniformLocation, gl.canvas.clientWidth, gl.canvas.clientHeight);

	gl.enableVertexAttribArray(positionAttributeLocation);

	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

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

	// ask WebGL to execute our GLSL program.
	const primitiveType = gl.TRIANGLES;
	const offset2 = 0;
	const count = 6;
	gl.drawArrays(primitiveType, offset2, count);
}
window.addEventListener('load', app);





const initializeApp = async (gl) => {
	// will created a GLSL program on the GPU
	const { program, vertexShader, fragmentShader } = await initializeProgram(gl);

	const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
	const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");


	// Attributes get their data from buffers so we need to create a buffer
	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	const positions = [
		10, 60,
		10, 240,
		290, 60,
		290, 60,
		290, 240,
		10, 240,
	  ];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    /**
     * The code up to this point is initialization code.
     * Code that gets run once when we load the page.
     * The code after this point is rendering code or code that should get executed each time we want to render/draw.
     */
	return { program, positionAttributeLocation, positionBuffer, resolutionUniformLocation };
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
	return { program, vertexShader, fragmentShader };
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