import { Debug } from '../package.js';

export default class Component {

    constructor(gameObject) {
        this.gameObject = gameObject; 
    }

    onEnable() {}
    onDisable() {}

    start(){}
    update(){}
    exit(){}

}