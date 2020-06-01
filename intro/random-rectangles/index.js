/**
 * Triangle in WebGL
 * Source: https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
 */

const canvas = document.getElementById("canvas");
const gl = canvas.getContext('webgl');

const app = async () => {
	const { program, positionAttributeLocation, positionBuffer, resolutionUniformLocation } = await initializeApp(gl);
	webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    /**
     * We need to tell WebGL how to convert from the clip space values
     * we'll be setting gl_Position to back into pixels, often called screen space.
     * To do this we call gl.viewport and pass it the current size of the canvas.
     * ----------
     * This tells WebGL the -1 +1 clip space maps to 0 <-> gl.canvas.width for x and 0 <-> gl.canvas.height for y.
     */
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	// Clear the canvas
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// We tell WebGL which shader program to execute. (pair of shaders)
	gl.useProgram(program);

	// set u_resolution value
	gl.uniform2f(resolutionUniformLocation, gl.canvas.clientWidth, gl.canvas.clientHeight);

    /**
     * Next we need to tell WebGL how to take data from the buffer we setup above and
     * supply it to the attribute in the shader.
     * ---------
     * First off we need to turn the attribute on
     */
	gl.enableVertexAttribArray(positionAttributeLocation);

    /**
     * Then we need to specify how to pull the data out
     */

	// Bind the position buffer.
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)

    /**
     * note that from the point of view of our GLSL vertex shader the a_position attribute is a vec4.
     * vec4 is a 4 float value.
     * In JavaScript we could think of it something like a_position = {x: 0, y: 0, z: 0, w: 0}.
     * Below we set size = 2.
     * Attributes default to 0, 0, 0, 1 so this attribute will get its first 2 values (x and y) from our buffer.
     * The z, and w will be the default 0 and 1 respectively.
     */
	const size = 2;          // 2 components per iteration
	const type = gl.FLOAT;   // the data is 32bit floats
	const normalize = false; // don't normalize the data
	const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
	const offset = 0;        // start at the beginning of the buffer
	gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
    /**
     * A hidden part of gl.vertexAttribPointer is that it binds the current ARRAY_BUFFER to the attribute.
     * In other words now this attribute is bound to positionBuffer.
     * That means we're free to bind something else to the ARRAY_BUFFER bind point.
     * The attribute will continue to use positionBuffer.
     */



	// After all that we can finally ask WebGL to execute our GLSL program.
	const primitiveType = gl.TRIANGLES;
	const offset2 = 0;
	const count = 6; //update count to 6 such that WebGl will parse all 6 points
	gl.drawArrays(primitiveType, offset2, count);
    /**
     * Because the count is 6 this will execute our vertex shader 6 times.
     * The first time a_position.x and a_position.y in our vertex shader attribute
     * will be set to the first 2 values from the positionBuffer.
     * The second time a_position.x and a_position.y will be set to the second 2 values.
     * The last time they will be set to the last 2 values.
     * ----------
	 * Because we set primitiveType to gl.TRIANGLES,
	 * each time our vertex shader is run 3 times WebGL will draw a triangle
	 * based on the 3 values we set gl_Position to.
	 * No matter what size our canvas is those values are in clip space coordinates
	 * that go from -1 to 1 in each direction.
	 * Because our vertex shader is simply copying our positionBuffer values to gl_Position
	 * the triangle will be drawn at clip space coordinates
	 * ----------
	 * WebGL will now render that triangle.
	 * For every pixel it is about to draw WebGL will call our fragment shader.
	 * Our fragment shader just sets gl_FragColor to 1, 0, 0.5, 1.
	 * Since the Canvas is an 8bit per channel, that means WebGL is going to
	 * write the values [255, 0, 127, 255] into the canvas.
     */
}
window.addEventListener('load', app);





const initializeApp = async (gl) => {
	// will created a GLSL program on the GPU
	const { program, vertexShader, fragmentShader } = await initializeProgram(gl);

    /**
     * Now we need to supply data to our GLSL program
     * Here our only input to our GLSL program is a_position which is an attribute
     * The first thing we should do is look up the location of the attribute for the program we just created
     * This will return a location of an attribute in a given program
     * ----------
     * Looking up attribute locations (and uniform locations) is something we should do during initialization, not in our render loop.
     */
	const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

	// get the location of u_resolution
	const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");


	// Attributes get their data from buffers so we need to create a buffer
	const positionBuffer = gl.createBuffer();

    /**
     * WebGL lets us manipulate many WebGL resources on global bind points.
     * We can think of bind points as internal global variables inside WebGL.
     * First we bind a resource to a bind point.
     * Then, all other functions refer to the resource through the bind point.
     * So, let's bind the position buffer.
     */
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Now we can put data in that buffer by referencing it through the bind point
	// three 2d points
	const positions = [ // Update positions in pixel form
		10, 60,
		10, 240,
		290, 60,
		290, 60,
		290, 240,
		10, 240,
	  ];

    /**
     * gl.bufferData copies the data to the positionBuffer on the GPU.
     * It's using the position buffer because we bound it to the ARRAY_BUFFER bind point above.
     * -----
     * we have positions which is a JavaScript array.
     * WebGL on the other hand needs strongly typed data
     * so the part new Float32Array(positions) creates a new array of 32bit floating point numbers
     * and copies the values from positions array
     * -----
     * gl.STATIC_DRAW is a hint to WebGL about how we'll use the data.
     * WebGL can try to use that hint to optimize certain things.
     * gl.STATIC_DRAW tells WebGL we are not likely to change this data much.
     */
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    /**
     * The code up to this point is initialization code.
     * Code that gets run once when we load the page.
     * The code below this point is rendering code or code that should get executed each time we want to render/draw.
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