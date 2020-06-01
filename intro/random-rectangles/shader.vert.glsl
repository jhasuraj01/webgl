// an attribute will receive data from a buffer

// We changed a_position to a vec2 since we're only using x and y anyway.
// A vec2 is similar to a vec4 but only has x and y.
attribute vec2 a_position; 
uniform vec2 u_resolution;

// all shaders have a main function
void main() {
	
	// convert the position from pixels to 0.0 to 1.0
    vec2 zeroToOne = a_position / u_resolution;
 
    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;
 
    // convert from 0->2 to -1->+1 (clip space)
    vec2 clipSpace = zeroToTwo - 1.0;

	// gl_Position is a special variable a vertex shader
	// is responsible for setting
	gl_Position = vec4(clipSpace, 0, 1); 
}