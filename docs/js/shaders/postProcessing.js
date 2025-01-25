import { Debug, Game, CustomPasses } from '../package.js';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';


export default class PostProcessing{

    static composer;
    static starsPass;
    static glitchPass;

    static init(){
        this.composer = new EffectComposer(Game.renderer);

        const renderPass = new RenderPass(Game.scene, Game.camera);
        this.composer.addPass(renderPass);

        const vignettePass = new ShaderPass(CustomPasses.Vignette());
        this.composer.addPass(vignettePass);

        this.starsPass = new ShaderPass(CustomPasses.Skybox());
        this.starsPass.renderToScreen = true;
        this.composer.addPass(this.starsPass);

        this.glitchPass = new GlitchPass(8);
        this.composer.addPass(this.glitchPass );

        const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
        this.composer.addPass(smaaPass);
        
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.1,  // Strength of bloom
            2,  // Radius of bloom
            0.0  // Threshold
        );
        this.composer.addPass(bloomPass);

        const filmPass = new FilmPass(
            0.15,  // Intensity of noise
            0.5, // Scanline intensity
            240,   // Scanline count
            false  // Grayscale
        );
        this.composer.addPass(filmPass);
    }

}