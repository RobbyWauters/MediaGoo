attribute vec3 vertexPosition;
attribute vec2 vertexUV1;

uniform mat4 viewProjectionMatrix;
uniform mat4 worldMatrix;

varying vec2 texCoord0;

void main(void) {
	vec4 worldPos = worldMatrix * vec4(vertexPosition, 1.0);
	gl_Position = viewProjectionMatrix * worldPos;
	texCoord0 = vertexUV1 * vec2(5.0, 5.0);
}
