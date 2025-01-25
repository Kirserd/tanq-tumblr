import * as THREE from 'three';
import { Debug, Game, Transform } from '../package.js';

export default class GameObject {
     
    static debug = false;

    //#region PROPERTIES

    constructor(name, bodyless=false) {
        this.name = name;
        this.parent = null;
        this.body = bodyless? null : new THREE.Object3D();

        this.children = new Map();  
        this.components = new Map(); 

        this.Transform = null;

        Game.register(this);
        this._initNecessaries();

        this.start();

        if(GameObject.debug){
            Debug.log(this.logComponents());
            Debug.log(this.logHierarchy());
        }
    }

    _initNecessaries(){
        this.addComponent(Transform);
        this.transform = this.getComponent("Transform");
    }

    //#endregion

    //#region HIERARCHY

    addChild(child) {
        if (child instanceof GameObject) {
            child.parent = this;

            this.children.set(child.name, child);
        } else {
            throw new Error("Only GameObject instances can be added as children.");
        }
    }
    removeChild(name) {
        if (this.children.has(name)) {
            const child = this.children.get(name);
            child.parent = null;
            this.children.delete(name);
            return child;
        }
        return null;
    }
    deleteChild(name) {
        if (this.children.has(name)) {
            let child = this.children.get(name);
            child.exit();
            this.children.delete(name);
        }
    }
    deleteAllChildren() {
        this.children.forEach(child => child.deleteAllChildren());
        this.children.forEach(child => child.exit());
        this.children.clear();
    }
    findByName(name) {
        if (this.name === name) {
            return this;
        }

        for (let child of this.children.values()) {
            const found = child.findByName(name);
            if (found) {
                return found;
            }
        }

        return null;
    }
    logHierarchy(level = 0) {
        let result = `${level != 0? `${'&nbsp;'.repeat(level * 4)} └ ${this.name}` : `${this.name} > Hierarchy: ` } \n`;
        this.children.forEach(child => {
            result += child.logHierarchy(level + 1);
        });
        return result;
    }

    //#endregion

    //#region COMPONENTS

    addBody(body){
        this.body = body;
        this.body.castShadow = true;
        this.body.receiveShadow = true;

        if(this.parent && this.parent.body){
            this.parent.body.add(body);
        }
        else{
            Game.scene.add(body);
        }
    }

    addComponent(ComponentType) {
        if (this.components.has(ComponentType.name)) {
            console.assert("Component already exists.");
            return;
        }

        const component = new ComponentType(this);
        this.components.set(ComponentType.name, component);

        component.onEnable();
    }
    removeComponent(name) {
        if (this.components.has(name)) {
            const component = this.components.get(name);
            component.gameObject = null; 
            component.onDisable();
            this.components.delete(name);
            return component;
        }
        return null;
    }
    getComponent(name) {
        return this.components.get(name) || null;
    }
    logComponents() {
        let result = `${this.name} > Components: \n`;
        this.components.forEach(component => {
            result += `${'&nbsp;'.repeat(4)} - ${component.constructor.name}\n`;
        });
        return result;
    }

    //#endregion

    //#region LOOP

    start() {  
        this.children.forEach(child => child.start());
        this.components.forEach(component => component.start());
        this._start();
    }
    update() {
        this.children.forEach(child => child.update());
        this.components.forEach(component => component.update());
        this._update();
    }
    exit() {
        this.components.forEach(component => component.exit());
        this._exit();
    }

    _start(){}
    _update(){}
    _exit(){ 
        Game.unregister(this.name);
        if(this.body){
            if(this.parent && this.parent.body)
                this.parent.body.remove(this.body);
            else 
                Game.scene.remove(this.body) 
            this.body = null;
        }
    };

    //#endregion
}