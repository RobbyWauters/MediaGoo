{
    "name": "art",
    "attributes": {
        "vertexPosition": "POSITION",
        "vertexUV1": "TEXCOORD1"
    },
    "uniforms": {
        "viewProjectionMatrix": "VIEW_PROJECTION_MATRIX",
        "worldMatrix": "WORLD_MATRIX",
        "texture1": "TEXTURE1",
        "texture2": "TEXTURE2",
        "time": "TIME",
        "fogDensity": 0.0001,
        "fogColor": [1, 1, 1]
    },
    "vshaderRef": "shaders/modelShader.vert",
    "fshaderRef": "shaders/modelShader.frag"
}