attribute vec3 vertexPosition;
attribute vec2 vertexUV0;
attribute vec2 vertexUV1;

uniform mat4 viewProjectionMatrix;
uniform mat4 worldMatrix;

varying vec2 texCoord0;
varying vec2 texCoord1;

void main(void) {
	texCoord0 = vertexUV0 * vec2(10.0, 10.0);
	texCoord1 = vertexUV1;
	gl_Position = viewProjectionMatrix * worldMatrix * vec4(vertexPosition, 1.0);
}