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

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const wavesGeometry = new THREE.PlaneGeometry(2, 2, 128, 128)

// Material
const wavesMaterial = new THREE.ShaderMaterial({
    vertexShader: waveVertexShader,
    fragmentShader: waveFragmentShader,
    uniforms: {
        uLargeWavesElevation: {value: 0.2},
        uLargeWavesFrequency: {value: new THREE.Vector2(4, 1.5)},
        uTime: {value: 0},
        uLargeWavesSpeed: {value: 0.75}
    }
})

gui.add(wavesMaterial.uniforms.uLargeWavesElevation, 'value').min(0).max(1).step(0.001).name('uLargeWavesElevation')
gui.add(wavesMaterial.uniforms.uLargeWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uLargeWavesFrequencyX')
gui.add(wavesMaterial.uniforms.uLargeWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uLargeWavesFrequencyY')
gui.add(wavesMaterial.uniforms.uLargeWavesSpeed, 'value').min(0).max(1).step(0.001).name('uLargeWavesSpeed')

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
