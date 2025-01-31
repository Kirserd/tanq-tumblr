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

    worldMode = "";
    
    //#region auroraGlitch
    
    auroraGlitchPrevState = 0;
    aurora8 = Materials.textureLoader.load(`assets/aurora8.png`);
    aurora7 = Materials.textureLoader.load(`assets/aurora7.png`);
    aurora6 = Materials.textureLoader.load(`assets/aurora6.png`);
    aurora5 = Materials.textureLoader.load(`assets/aurora5.png`);
    aurora4 = Materials.textureLoader.load(`assets/aurora4.png`);
    aurora3 = Materials.textureLoader.load(`assets/aurora3.png`);
    aurora2 = Materials.textureLoader.load(`assets/aurora2.png`);
    aurora1 = Materials.textureLoader.load(`assets/aurora1.png`);

    //#endregion

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
        const ambientlight = new THREE.AmbientLight( 0x998892, 0 ); 
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

        //#region artwork 1

        async function initArtwork(world, no, path, posX, posY, posZ, rotY){
            world.addChild(new GameObject(`artwork${no}_1`));

            gameObject = world.findByName(`artwork${no}_1`);
            gameObject.addBody(new THREE.Mesh(
                new THREE.PlaneGeometry(5, 5), 
                await Materials.ArtworkMaterial(`assets/art_1/${path}.png`)
            ));
            gameObject.transform.position.setX(posX);
            gameObject.transform.position.setZ(posZ);
            gameObject.transform.position.setY(posY);
            gameObject.transform.rotation.setY(rotY);  
        }
        async function artworkLayer(world, no, layer, path){
            world.findByName(`artwork${no}_${layer-1}`).addChild(new GameObject(`artwork${no}_${layer}`));

            gameObject = world.findByName(`artwork${no}_${layer}`);
            gameObject.addBody(new THREE.Mesh(
                new THREE.PlaneGeometry(5, 5), 
                await Materials.ArtworkMaterial(`assets/art_${no}/${path}.png`)
            ));
            gameObject.transform.position.setZ(0.6); 
            gameObject.body.scale.set(1.05,1.05,1.0); 
        }
        async function artworkCaption(world, no, text, width, height, xOffset, yOffset, bgColor, textStyle){ 
            world.findByName(`artwork${no}_1`).addChild(new GameObject(`artwork${no}_caption`));
            let material = await Materials.CaptionMaterial(text,width,height,xOffset,yOffset,bgColor='black',textStyle);

            gameObject = world.findByName(`artwork${no}_caption`);
            gameObject.addBody(new THREE.Mesh(
                new THREE.PlaneGeometry(5, 1), 
                material
            ));
            gameObject.transform.position.setZ(-2.5); 
            gameObject.transform.position.setY(-2); 
            gameObject.transform.rotation.setY(Math.PI);  
            gameObject.transform.rotation.setX(Math.PI / 4);  
            gameObject.body.scale.set(1.05,1.05,1.0); 

            function trace(gameObject, material, count){
                let trace = new THREE.Mesh(
                    new THREE.PlaneGeometry(5, 1), 
                    material.clone(),
                );
                trace.traverse(child => {
                    if (child.isMesh) {child.material.opacity = 0.8 - 0.1 * count;}
                });
                gameObject.body.add(trace);
                trace.position.setZ(count * -0.15);
            }

            trace(gameObject, material, 1);
            trace(gameObject, material, 2);
            trace(gameObject, material, 3);
            trace(gameObject, material, 4);
            trace(gameObject, material, 5);
            trace(gameObject, material, 6);
            trace(gameObject, material, 7);
        }

        await initArtwork(this, 1, 5, -8, -3, 74, -Math.PI / 2);
        await artworkLayer(this, 1, 2, 6);
        await artworkLayer(this, 1, 3, 4);
        await artworkLayer(this, 1, 4, 1);
        await artworkLayer(this, 1, 5, 2);
        await artworkLayer(this, 1, 6, 3);
        await artworkCaption(this, 1, `"[Peer] [pr-E55(sure)]"`, 512, 128, 20, 72, 'black', { 
            shadowColor: "rgba(185, 60, 255, 1)"
        });

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

        switch (this.worldMode) {
            case "auroraGlitch":
                    this._auroraGlitch();
                break;
        
            default:
                break;
        }
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

        if(this.switchesDone % 2 == 1)
            this.worldMode = "auroraGlitch";
        else{
            this.worldMode = "";
            PostProcessing.starsPass.uniforms.starsTexture.value = Materials.textureLoader.load(
                `assets/stars.png`
            );
        }

        this.findByName("WorldLight").body.intensity = this.switchesDone % 2 == 0? 0 : 5;

        
    }

    _auroraGlitch(){
        let state = Math.round(this.switchCounter * 12) % 9;
        if(this.auroraGlitchPrevState == state)
            return;

        this.auroraGlitchPrevState = state;
        if(state >= 7)
            PostProcessing.starsPass.uniforms.starsTexture.value = this.aurora8;
        else if(state >= 6)
            PostProcessing.starsPass.uniforms.starsTexture.value = this.aurora7;
        else if(state >= 5)
            PostProcessing.starsPass.uniforms.starsTexture.value = this.aurora6;
        else if(state >= 4)
            PostProcessing.starsPass.uniforms.starsTexture.value = this.aurora5;
        else if(state >= 3)
            PostProcessing.starsPass.uniforms.starsTexture.value = this.aurora4;
        else if(state >= 2)
            PostProcessing.starsPass.uniforms.starsTexture.value = this.aurora3;
        else if(state >= 1)
            PostProcessing.starsPass.uniforms.starsTexture.value = this.aurora2;
        else
            PostProcessing.starsPass.uniforms.starsTexture.value = this.aurora1;
    }
}