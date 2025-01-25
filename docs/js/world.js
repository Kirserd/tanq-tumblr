import { 
    GameObject, Game, Debug, Utils, Movement,
    Materials, PostProcessing,
    Rotating} from './package.js';
import * as THREE from 'three';

export default class World extends GameObject {

    static debug = true;

    switchPeriod = 5.0;
    switchCounter = 0.0;
    switchesDone = 0;

    constructor() {
        super("World");
    }

    start() {    
        super.start();

        this.addBody(new THREE.Object3D());

        this._cameraSetup();
        this._lightSetup();
        this._sceneSetup();

        if(World.debug){
            Debug.log(this.logComponents());
            Debug.log(this.logHierarchy());
        }
    }

    _cameraSetup(){
        this.addChild(new GameObject("cameraPivot"));
        const camera = this.findByName("cameraPivot");
        camera.addChild(new GameObject("camera"));
        this.findByName("camera").addBody(Game.camera);
        camera.transform.position.set(0,-3, 88);

        camera.addComponent(Movement);
        camera.getComponent("Movement").speed = 9.45;

        Game.scene.add(camera.body);
    }

    _lightSetup(){
        const scene = Game.scene;

        const pointLight = new THREE.PointLight(0xbb8c55, 100, 100);
        pointLight.position.set(0, 2, 3);
        scene.add(pointLight);
        
        const spotLight = new THREE.SpotLight(0xffbb77, 500);
        spotLight.position.set(-0, 10, 0);
        spotLight.angle = Math.PI / 6;  
        spotLight.penumbra = 1;       
        spotLight.castShadow = true;
        scene.add(spotLight); 

        const pointLight2 = new THREE.PointLight(0x558cbb, 100, 100);
        pointLight2.position.set(-40, 2, 13);
        scene.add(pointLight2);

        const spotLight2 = new THREE.SpotLight(0x77bbff, 500);
        spotLight2.position.set(-40, 10, 10);
        spotLight2.angle = Math.PI / 6;  
        spotLight2.penumbra = 1;       
        spotLight2.castShadow = true;
        spotLight2.target.position.set(-40, 0, 10);
        scene.add(spotLight2); 
        scene.add(spotLight2.target);

        const pointLight3 = new THREE.PointLight(0x8c55bb, 100, 100);
        pointLight3.position.set(40, 2, 13);
        scene.add(pointLight3);

        const spotLight3 = new THREE.SpotLight(0xbb77ff, 500);
        spotLight3.position.set(40, 10, 10);
        spotLight3.angle = Math.PI / 6;  
        spotLight3.penumbra = 1;       
        spotLight3.castShadow = true;
        spotLight3.target.position.set(40, 0, 10);
        scene.add(spotLight3); 
        scene.add(spotLight3.target);
        
        const playerPointLight = new THREE.PointLight(0xbb8c55, 80, 15);
        playerPointLight.position.set(0, 2, 0);
        this.findByName("cameraPivot").body.add(playerPointLight);

        this.addChild(new GameObject("WorldLight"));
        const ambientlight = new THREE.AmbientLight( 0x607099, 0 ); 
        this.findByName("WorldLight").body = ambientlight;
        scene.add( ambientlight );
    }

    async _sceneSetup(){
        let transform = this.getComponent("Transform");
        transform.position.set(0,0,0);

        let gameObject;

        this.addChild(new GameObject("icosphere"));
        this.findByName("icosphere").addChild(new GameObject("icosphereSmaller"));

        this.addChild(new GameObject("icosphere2"));
        this.addChild(new GameObject("icosphere3"));

        this.addChild(new GameObject("ground"));
        this.addChild(new GameObject("fbxTest"));

        //#region fbxTest

        gameObject = this.findByName("fbxTest");
        await Utils.loadFBX('models/test.fbx', gameObject);
        gameObject.body.traverse(child => {
            if (child.isMesh) {
                child.material.side = THREE.DoubleSide;
                child.material.transparent = true;
                child.material.opacity = 0.3;
            }
        });

       gameObject.transform.position.set(-2,-8, 2);

        //#endregion

        //#region icosphere

        gameObject = this.findByName("icosphere");
        gameObject.addBody(new THREE.Mesh(
            new THREE.IcosahedronGeometry(2, 0), 
            new THREE.MeshStandardMaterial({
                color: 0xff8c55,
                metalness: 0.8,
                roughness: 0.4,
                emissive: 0xff5555,
                emissiveIntensity: 0.2
            })
        ));
        gameObject.transform.position.set(0,0,0);
        gameObject.addComponent(Rotating);

        //#endregion

        //#region icosphere2

        gameObject = this.findByName("icosphere2");
        gameObject.addBody(new THREE.Mesh(
            new THREE.IcosahedronGeometry(2, 0), 
            new THREE.MeshStandardMaterial({
                color: 0x55bbff,
                metalness: 0.8,
                roughness: 0.4,
                emissive: 0x5555ff,
                emissiveIntensity: 0.2
            })
        ));
        gameObject.transform.position.set(-40,0,10);
        gameObject.addComponent(Rotating);

        //#endregion

        //#region icosphere3

        gameObject = this.findByName("icosphere3");
        gameObject.addBody(new THREE.Mesh(
            new THREE.IcosahedronGeometry(2, 0), 
            new THREE.MeshStandardMaterial({
                color: 0xbb55ff,
                metalness: 0.8,
                roughness: 0.4,
                emissive: 0xbb55ff,
                emissiveIntensity: 0.2
            })
        ));
        gameObject.transform.position.set(40,0,10);
        gameObject.addComponent(Rotating);

        //#endregion

        //#region icosphereSmaller

        gameObject = this.findByName("icosphereSmaller");
        gameObject.addBody(new THREE.Mesh(
            new THREE.IcosahedronGeometry(1, 0), 
            new THREE.MeshStandardMaterial({
                color: 0x008cff,
                metalness: 1,
                roughness: 0.3,
                emissive: 0x008cff,
                emissiveIntensity: 0.2
            })
        ));
        gameObject.transform.position.set(1,2,-3);

        //#endregion

        //#region ground

        gameObject = this.findByName("ground");
        gameObject.addBody(new THREE.Mesh(
            new THREE.PlaneGeometry(20000, 20000), 
            await Materials.StandardMaterial(
                'assets/floorMaterial', 
                ["map", "roughnessMap", "metalnessMap", "normalMap"], 
                2000, 2000,
            )
        ));
        gameObject.transform.position.setY(-8);
        gameObject.transform.rotation.setX(-Math.PI / 2);  

        //#endregion
        
    }

    update(){
        super.update();
        this._updateSwitch();
    }

    _updateSwitch() {
        if (isNaN(this.switchCounter)) {
            this.switchCounter = 0; 
        }

        if (this.switchCounter >= this.switchPeriod + 0.3) {
            this.switchCounter = 0;
            this.switchesDone++;
            this._updateWorld();
        } 
        else {
            let switchStage = this.switchCounter - this.switchPeriod;
    
            if (switchStage >= 0.3) {
                PostProcessing.glitchPass.curF = 0.1;
            } else if (switchStage >= 0.2) {
                PostProcessing.glitchPass.curF = 0;
            } else if (switchStage >= 0.1) {
                PostProcessing.glitchPass.curF = 0.1;
            } else {
                PostProcessing.glitchPass.curF = 0.2;
            }
    
            PostProcessing.glitchPass.randX = 1;
        }
    
        this.switchCounter += Game.deltaTime;
    }

    _updateWorld(){
        this.findByName("ground").body.traverse(child => {
            if (child.isMesh) {
                let texture = Materials.textureLoader.load(`assets/${
                    this.switchesDone % 2 == 0? "floorMaterial" : "floor2Material"
                }/albedo.png`);
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(2000, 2000); 

                child.material.map = texture;
            }
        });

        this.findByName("WorldLight").body.intensity = this.switchesDone % 2 == 0? 0 : 3;

        PostProcessing.starsPass.uniforms.starsTexture.value = Materials.textureLoader.load(
            `assets/${this.switchesDone % 2 == 0? "stars.png" : "stars2.png"}`
        );
    }
}