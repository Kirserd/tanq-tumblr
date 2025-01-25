import { Vector3 } from 'three';
import { Component, Debug} from '../package.js';

export default class Transform extends Component {

    position = new Vector3(0,0,0);
    rotation = new Vector3(0,0,0);

    constructor(gameObject) {
        super(gameObject);
    }

    onEnable() {
    }

    onDisable() {
    }

    update(){
        super.update();

        if(this.gameObject.body){
            this.gameObject.body.position.set(
                this.position.x, 
                this.position.y, 
                this.position.z
            );
            this.gameObject.body.rotation.set(
                this.rotation.x, 
                this.rotation.y, 
                this.rotation.z
            );
        }
    }

    lookAt(target) {
        if(!this.gameObject.body)
            return;

        this.gameObject.body.lookAt(target);
    }
}