uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;

void main() {

    float mixMultiplier = (vElevation + uColorOffset) * uColorMultiplier;
    // depdening on the elevation, we will have a stronger depth color or surface color
    vec3 color = mix(uDepthColor, uSurfaceColor, mixMultiplier);
    gl_FragColor = vec4(color, 1.0);
    }
