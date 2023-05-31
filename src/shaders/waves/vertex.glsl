uniform float uLargeWavesElevation;
uniform vec2 uLargeWavesFrequency;
uniform float uTime;
uniform float uLargeWavesSpeed;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * uLargeWavesFrequency.x + uTime * uLargeWavesSpeed) *
                  sin(modelPosition.z * uLargeWavesFrequency.y + uTime * uLargeWavesSpeed) *
                  uLargeWavesElevation;


    modelPosition.y += elevation;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;
    }
