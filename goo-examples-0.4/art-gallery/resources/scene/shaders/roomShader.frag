precision mediump float;

uniform sampler2D lightMap;
uniform sampler2D diffuseMap;

varying vec2 texCoord0;
varying vec2 texCoord1;

void main(void)
{
	vec4 lightCol = texture2D(lightMap, texCoord1);
	vec4 diffuseCol = texture2D(diffuseMap, texCoord0);
	gl_FragColor = diffuseCol * lightCol;
}