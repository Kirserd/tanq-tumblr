import * as THREE from 'three';

export default class Materials {
    static textureLoader = new THREE.TextureLoader();

    static simpleTextureMaterial(texturePath, repeatX = 1, repeatY = 1){
        const texture = Materials.textureLoader.load(texturePath);

        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(repeatX, repeatY); 

        return new THREE.MeshStandardMaterial({
            map: texture,
        });
    }

    static async StandardMaterial(
        initPath = "noPath",
        mapsToUse = ["map", "roughnessMap", "metalnessMap", "normalMap", "aoMap", "displacementMap"] ,  
        repeatX = 1, 
        repeatY = 1,
        roughness = 0.5, 
        metallicness = 0
    ) {
        if (!initPath || initPath === "noPath") {
            return new THREE.MeshStandardMaterial({ roughness, metalness: metallicness });
        }
    
        const loadTexture = (path) => {
            return new Promise((resolve) => {
                Materials.textureLoader.load(
                    path,
                    (texture) => {
                        texture.wrapS = THREE.RepeatWrapping;
                        texture.wrapT = THREE.RepeatWrapping;
                        texture.repeat.set(repeatX, repeatY);
                        resolve(texture);
                    },
                    undefined,
                    () => {
                        resolve(null); 
                    }
                );
            });
        };
    
        const availableTextures = {
            map: `${initPath}/albedo.png`,
            roughnessMap: `${initPath}/roughness.png`,
            metalnessMap: `${initPath}/metallic.png`,
            normalMap: `${initPath}/normal.png`,
            aoMap: `${initPath}/ao.png`,
            displacementMap: `${initPath}/displacement.png`,
        };
    
        // Filter texture paths based on specified maps to use
        const selectedTextures = Object.fromEntries(
            Object.entries(availableTextures).filter(([key]) => mapsToUse.includes(key))
        );
    
        const texturePromises = Object.entries(selectedTextures).map(async ([key, path]) => {
            const texture = await loadTexture(path);
            return { key, texture };
        });
    
        const resolvedTextures = await Promise.all(texturePromises);
    
        const materialOptions = {
            roughness: roughness,
            metalness: metallicness,
        };
    
        resolvedTextures.forEach(({ key, texture }) => {
            if (texture) {
                materialOptions[key] = texture;
            }
        });
    
        return new THREE.MeshStandardMaterial(materialOptions);
    }
}