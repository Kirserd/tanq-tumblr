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

    static async ArtworkMaterial(path){
        const texture = Materials.textureLoader.load(path);
        const materialOptions = {
            map: texture,
            side: THREE.DoubleSide,
            transparent: true
        };
        return new THREE.MeshBasicMaterial(materialOptions);
    }

    static async CaptionMaterial(
        text,
        width = 512,
        height = 128,
        xOffset = 20,
        yOffset = 72,
        bgColor = 'black',
        textStyle = {}
    ) {
        var canvasB = document.createElement('CANVAS');
        canvasB.width = width;
        canvasB.height = height;
    
        var contextB = canvasB.getContext('2d');
    
        await document.fonts.ready;
    
        let {
            fontSize = "32px",
            fontWeight = "normal",
            fontStyle = "normal",
            fontFamily = "'Syne Mono', monospace",
            textAlign = "left",
            textBaseline = "middle",
            textColor = "white",
            shadowColor = "rgba(0, 0, 0, 1)",
            shadowBlur = 10,
            shadowOffsetX = 0,
            shadowOffsetY = 0
        } = textStyle;
    
        contextB.fillStyle = bgColor;
        contextB.fillRect(0, 0, width, height);
    
        contextB.font = `${fontStyle} ${fontWeight} ${fontSize} ${fontFamily}`;
        contextB.fillStyle = textColor;
        contextB.textAlign = textAlign;
        contextB.textBaseline = textBaseline;
    
        contextB.shadowColor = shadowColor;
        contextB.shadowBlur = shadowBlur;
        contextB.shadowOffsetX = shadowOffsetX;
        contextB.shadowOffsetY = shadowOffsetY;
    
        let adjustedXOffset = xOffset;
        if (textAlign === "center") adjustedXOffset = width / 2;
        else if (textAlign === "right") adjustedXOffset = width - xOffset;
    
        contextB.fillText(text, adjustedXOffset, yOffset);
    
        return new THREE.MeshBasicMaterial({
            map: new THREE.CanvasTexture(canvasB),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
    }
}