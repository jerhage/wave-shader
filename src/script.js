import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import waveVertexShader from './shaders/waves/vertex.glsl'
import waveFragmentShader from './shaders/waves/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
const debug = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
// more vertices gives more details in smaller waves
// this also increases demand on the GPU since it's the shader that is animating everything
const wavesGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

debug.depthColor = '#0087a8'
debug.surfaceColor = '#7cbbda'

// Material
const wavesMaterial = new THREE.ShaderMaterial({
    vertexShader: waveVertexShader,
    fragmentShader: waveFragmentShader,
    uniforms: {
        uTime: {value: 0},
        uLargeWavesElevation: {value: 0.2},
        uLargeWavesFrequency: {value: new THREE.Vector2(4, 1.5)},
        uLargeWavesSpeed: {value: 0.75},
        uSmallWavesElevation: { value: 0.12 },
        uSmallWavesFrequency: { value: 2 },
        uSmallWavesSpeed: { value: 0.22 },
        uSmallIterations: { value: 4 },
        uDepthColor: { value: new THREE.Color(debug.depthColor)},
        uSurfaceColor: { value: new THREE.Color(debug.surfaceColor)},
        uColorOffset: { value: 0.005 },
        uColorMultiplier: { value: 6 },
    },
    side: THREE.FrontSide

})

gui.add(wavesMaterial.uniforms.uLargeWavesElevation, 'value').min(0).max(1).step(0.001).name('uLargeWavesElevation')
gui.add(wavesMaterial.uniforms.uLargeWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uLargeWavesFrequencyX')
gui.add(wavesMaterial.uniforms.uLargeWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uLargeWavesFrequencyY')
gui.add(wavesMaterial.uniforms.uLargeWavesSpeed, 'value').min(0).max(1).step(0.001).name('uLargeWavesSpeed')
gui.add(wavesMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
gui.add(wavesMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name('uSmallWavesFrequency')
gui.add(wavesMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed')
gui.add(wavesMaterial.uniforms.uSmallIterations, 'value').min(0).max(5).step(1).name('uSmallIterations')
gui.addColor(debug, 'depthColor').onChange(() => {
    wavesMaterial.uniforms.uDepthColor.value.set(debug.depthColor)
})
gui.addColor(debug, 'surfaceColor').onChange(() => {
    wavesMaterial.uniforms.uSurfaceColor.value.set(debug.surfaceColor)
})
gui.add(wavesMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
gui.add(wavesMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier')
gui.add(wavesMaterial, 'side', [THREE.FrontSide, THREE.BackSide, THREE.DoubleSide]).name('Front / Back / Double Sided')
// Mesh
const waves = new THREE.Mesh(wavesGeometry, wavesMaterial)
waves.rotation.x = - Math.PI * 0.5
scene.add(waves)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    wavesMaterial.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
