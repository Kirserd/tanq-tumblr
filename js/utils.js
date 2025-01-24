import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import * as THREE from 'three';

export default class Utils{
    static fbxLoader = new FBXLoader();

    static loadFBX(path, gameObject) {
        return new Promise((resolve, reject) => {
            Utils.fbxLoader.load(path, (fbx) => {
                fbx.scale.set(0.02, 0.02, 0.02);
                
                fbx.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;          
                        child.receiveShadow = true;
                    }
                });
    
                gameObject.addBody(fbx);
                resolve(gameObject);
            }, undefined, (error) => {
                reject(error);
            });
        });
    }
}