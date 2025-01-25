import * as THREE from 'three';
import { Game, Materials } from '../package.js';

export default class CustomPasses {
    
    static DepthShader(){
        return new THREE.ShaderMaterial({
            uniforms: {
                depthTexture: { value: Game.depthTexture },
                cameraNear: { value: Game.camera.near },
                cameraFar: { value: Game.camera.far }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                uniform sampler2D depthTexture;
                uniform float cameraNear;
                uniform float cameraFar;
        
                float linearizeDepth(float depth) {
                    float z = depth * 2.0 - 1.0; // Back to NDC
                    return (2.0 * cameraNear * cameraFar) / (cameraFar + cameraNear - z * (cameraFar - cameraNear));
                }
        
                void main() {
                    float depth = texture2D(depthTexture, vUv).r;
                    float linearDepth = linearizeDepth(depth) / cameraFar; // Normalize
                    gl_FragColor = vec4(vec3(linearDepth), 1.0);
                }
            `
        });
    }

    static Skybox() {
        return new THREE.ShaderMaterial({
            uniforms: {
                blitTexture: { value: Game.renderTarget.texture },
                starsTexture: { value: Materials.textureLoader.load('assets/stars.png') },
                depthTexture: { value: Game.depthTexture },
                cameraNear: { value: 0.1 },
                cameraFar: { value: 100 },
                cameraDirection: { value: new THREE.Vector3(0, 0, -1) } 
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                uniform sampler2D blitTexture;
                uniform sampler2D starsTexture;
                uniform sampler2D depthTexture;
                uniform float cameraNear;
                uniform float cameraFar;
                uniform vec3 cameraDirection; 
    
                float linearizeDepth(float depth) {
                    float z = depth * 2.0 - 1.0;
                    return (2.0 * cameraNear * cameraFar) / (cameraFar + cameraNear - z * (cameraFar - cameraNear));
                }
    
               void main() {
                vec2 shiftedUV = vUv;
                float angle = atan(cameraDirection.z, cameraDirection.x); 

                float u = (angle + 3.14159265359) / (2.0 * 3.14159265359); 

                shiftedUV.x += u * 2.0; 

                shiftedUV = mod(shiftedUV, 0.5);

                vec4 starsColor = texture2D(starsTexture, shiftedUV);
                vec4 blitColor = texture2D(blitTexture, vUv);

                float depth = texture2D(depthTexture, vUv).r;
                float linearDepth = linearizeDepth(depth) / cameraFar;

                gl_FragColor = mix(blitColor, starsColor, clamp(linearDepth, 0.0, 1.0));
            }
            `,
        });
    }

    static Vignette() {
        return new THREE.ShaderMaterial({
            uniforms: {
                blitTexture: { value: Game.renderTarget.texture },
                vignetteColor: { value: new THREE.Color(0x000000) }, // Default vignette color (black)
                vignetteRadius: { value: 0.7 }, // Radius of vignette effect
                vignetteSoftness: { value: 0.5 }, // Softness of vignette falloff
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                uniform sampler2D blitTexture;
                uniform vec3 vignetteColor;
                uniform float vignetteRadius;
                uniform float vignetteSoftness;

                void main() {
                    vec2 uv = vUv;
                    
                    // Calculate distance from the center of the screen
                    float dist = length(uv - vec2(0.5, 0.5));

                    // Apply vignette effect: smooth falloff with softness
                    // Inverted effect: the closer to the center, the more dark it gets
                    float vignette = smoothstep(vignetteRadius, vignetteRadius - vignetteSoftness, 1.0 - dist);

                    // Get the original color from the texture
                    vec4 color = texture2D(blitTexture, uv);
                    
                    // Blend the vignette color with the original color (inverted vignette)
                    gl_FragColor = vec4(mix(color.rgb, vignetteColor, vignette), color.a);
                }
            `
        });
    }
}