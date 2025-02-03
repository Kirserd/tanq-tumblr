import { CustomPasses, Debug, GameObject, PostProcessing } from '../package.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';

export default class Game {
    static clock = new THREE.Clock(true);
    static scene = new THREE.Scene();
    static camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    static renderer = new THREE.WebGLRenderer();
    static controls = new OrbitControls(this.camera, this.renderer.domElement);

    static depthTexture = new THREE.DepthTexture();
    static renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
        format: THREE.RGBAFormat, 
        type: THREE.FloatType,
        depthBuffer: true,
        stencilBuffer: false,
        depthTexture: Game.depthTexture 
    });

    static focused = false;
    static registered = new Map();

    static deltaTime;
    static oldTime;

    static firstFrame = true;

    constructor(){
        Game.setup();
        Game.update();
    }

    static setup(){
        Game.renderer.setSize(window.innerWidth, window.innerHeight);
        Game.renderer.setClearColor(0x080509); 
        Game.renderer.shadowMap.enabled = true;

        document.body.appendChild(Game.renderer.domElement);

        PostProcessing.init();

        Game.depthTexture.format = THREE.DepthFormat;
        Game.depthTexture.type = THREE.UnsignedShortType; 
        Game.renderTarget.depthTexture = Game.depthTexture; 

        window.addEventListener('resize', () => {
            Game.camera.aspect = window.innerWidth / window.innerHeight;
            Game.camera.updateProjectionMatrix();
            Game.renderer.setSize(window.innerWidth, window.innerHeight);

            Game.renderTarget.setSize(window.innerWidth, window.innerHeight);
        });

        window.addEventListener('mousedown', () => {
            if (document.documentElement.requestPointerLock) {
                document.documentElement.requestPointerLock();
            }
        });

        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                if (document.exitPointerLock) {
                    document.exitPointerLock();
                }
            }
        });
    }

    static register(gameObject){
        if (gameObject instanceof GameObject) {
            this.registered.set(gameObject.name, gameObject);
        } else {
            throw new Error("Only GameObject instances can be added as children.");
        }
    }

    static unregister(name){
        if (this.registered.has(name)) {
            this.registered.delete(name);
        } else {
            throw new Error("There is no such GameObject registered");
        }
    }

    static update(){
        if(Game.oldTime != Game.clock.oldTime){
            Game.deltaTime = (Game.clock.oldTime - Game.oldTime) * 0.001;
            Game.oldTime = Game.clock.oldTime;
        }
        requestAnimationFrame(Game.update);

        Game.focused = document.pointerLockElement == document.documentElement;
        document.getElementById("focus-message").classList = Game.focused ? "hidden" : "none";

        if(Game.focused || Game.firstFrame){
            Game.controls.update();
        }
        Game.registered.forEach(registered => registered.update());

        Game.updatePasses();

        Game.renderer.setRenderTarget(Game.renderTarget);
        Game.renderer.render(Game.scene, Game.camera);
        Game.renderer.setRenderTarget(null);

        PostProcessing.composer.render();
    }

    static updatePasses() {
        const cameraDirection = new THREE.Vector3();
        Game.camera.getWorldDirection(cameraDirection);
        PostProcessing.starsPass.uniforms.cameraDirection.value = cameraDirection; 
    }
}