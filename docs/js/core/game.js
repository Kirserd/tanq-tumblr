import { Debug, GameObject } from '../package.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


export default class Game{
    static clock = new THREE.Clock(true);
    static scene = new THREE.Scene();
    static camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    static renderer = new THREE.WebGLRenderer({ antialias: true });
    static controls = new OrbitControls(this.camera, this.renderer.domElement);

    static registered = new Map();

    constructor(){
        Game.setup();
        Game.update();
    }

    static setup(){
        Game.renderer.setSize(window.innerWidth, window.innerHeight);
        Game.renderer.setClearColor(0x111111); 
        Game.renderer.shadowMap.enabled = true;

        document.body.appendChild(Game.renderer.domElement);

        Game.controls.enableDamping = true; 
        Game.controls.dampingFactor = 0.05;
        Game.controls.enableZoom = true;     
        Game.controls.autoRotate = false;    
        Game.controls.target.set(0, 0, 0);

        window.addEventListener('resize', () => {
            Game.camera.aspect = window.innerWidth / window.innerHeight;
            Game.camera.updateProjectionMatrix();
            Game.renderer.setSize(window.innerWidth, window.innerHeight);
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
        requestAnimationFrame(Game.update);

        Game.controls.update();
        Game.registered.forEach(registered => registered.update());
        Game.renderer.render(Game.scene, Game.camera);
    }
}