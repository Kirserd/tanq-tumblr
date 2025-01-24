import { GameObject, Game, Debug, Utils } from './package.js';
import * as THREE from 'three';

export default class World extends GameObject {

    static debug = true;

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
        const camera = Game.camera;

        camera.position.set(5, 3, 8);
        camera.lookAt(0, 0, 0);
    }

    _lightSetup(){
        const scene = Game.scene;

        scene.fog = new THREE.Fog(0x111111, 5, 50); 
        // Ambient light (soft overall lighting)
        const ambientLight = new THREE.AmbientLight(0xff5566, 0.5);
        scene.add(ambientLight);
        
        // Directional light (strong directional effect)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        scene.add(directionalLight);
        
        // Point light (glowing effect near the object)
        const pointLight = new THREE.PointLight(0xff8c00, 100, 10);
        pointLight.position.set(0, 3, 3);
        scene.add(pointLight);
        
        // Spot light (focus on the icosphere)
        const spotLight = new THREE.SpotLight(0xffbb77, 500);
        spotLight.position.set(-0, 10, 0);
        spotLight.angle = Math.PI / 6;  // Light cone size
        spotLight.penumbra = 1;       // Soft edge
        spotLight.castShadow = true;
        scene.add(spotLight); 
    }

    async _sceneSetup(){
        let transform = this.getComponent("Transform");
        transform.position.set(0,0,0);

        let gameObject;

        this.addChild(new GameObject("icosphere"));
        this.findByName("icosphere").addChild(new GameObject("icosphereSmaller"));
        this.addChild(new GameObject("plane"));
        this.addChild(new GameObject("fbxTest"));

        //#region fbxTest

        gameObject = this.findByName("fbxTest");
        try{
        await Utils.loadFBX('models/test.fbx', gameObject);

        gameObject.body.traverse(child => {
            if (child.isMesh) {
                child.material.side = THREE.DoubleSide;
                child.material.transparent = true;
                child.material.opacity = 0.2;
            }
        });
        }
        catch{}

        transform = gameObject.getComponent("Transform");
        transform.position.set(-2,-8, 2);

        //#endregion

        //#region icosphere

        gameObject = this.findByName("icosphere");
        gameObject.addBody(new THREE.Mesh(
            new THREE.IcosahedronGeometry(2, 0), 
            new THREE.MeshStandardMaterial({
                color: 0xff8c00,
                metalness: 0.8,
                roughness: 0.4,
                emissive: 0x330011,
                emissiveIntensity: 0.2
            })
            ));
        transform = gameObject.getComponent("Transform");
        transform.position.set(0,0,0);

        //#endregion

        //#region icosphereSmaller

        gameObject = this.findByName("icosphereSmaller");
        gameObject.addBody(new THREE.Mesh(
            new THREE.IcosahedronGeometry(1, 0), 
            new THREE.MeshStandardMaterial({
                color: 0x008cff,
                metalness: 1,
                roughness: 0.3,
                emissive: 0x330011,
                emissiveIntensity: 0.2
            })
            ));
        transform = gameObject.getComponent("Transform");
        transform.position.set(1,2,-3);

        //#endregion

        //#region plane

        gameObject = this.findByName("plane");
        gameObject.addBody(new THREE.Mesh(
            new THREE.PlaneGeometry(2000, 2000), 
            new THREE.MeshStandardMaterial({
                color: 0x444444,
                roughness: 0.9,
                metalness: 0.5
            })
            ));
        transform = gameObject.getComponent("Transform");
        transform.position.setY(-8);
        transform.rotation.setX(-Math.PI / 2);  

        //#endregion
    }
}

