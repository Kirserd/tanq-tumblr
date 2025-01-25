import { Component, Debug, Game} from '../package.js';
import { Vector3 } from 'three';

export default class Rotating extends Component {

    constructor(gameObject) {
        super(gameObject);
    }

    update(){
        super.update();

        if(isNaN(Game.deltaTime))
            return;

        this.gameObject.transform.rotation.setY(
            this.gameObject.transform.rotation.y + (0.5 * Game.deltaTime));

    }
}