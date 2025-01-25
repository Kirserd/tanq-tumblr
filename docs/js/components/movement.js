import { Component, Debug, Game } from '../package.js';

export default class Movement extends Component {
    constructor(gameObject) {
        super(gameObject);
        this.cameraObject = gameObject.findByName("camera");

        this.speed = 5; 
        this.acceleration = 50;  
        this.deceleration = 5; 
        this.velocity = { x: 0, y: 0, z: 0 };

        this.rotationFactor = 0.005; 

        this.mouseSensitivity = 0.002; 
        this.rotationY = 0;  
        this.rotationX = 0; 

        this.wobbleAmount = 0.008;
        this.wobbleSpeed = 12;
        this.wobbleTime = 0;

        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
        };

        this.initInputListeners();
        this.initMouseListeners();
    }

    initInputListeners() {
        window.addEventListener('keydown', (event) => {
            if (this.keys.hasOwnProperty(event.key)) {
                this.keys[event.key] = true;
            }
        });

        window.addEventListener('keyup', (event) => {
            if (this.keys.hasOwnProperty(event.key)) {
                this.keys[event.key] = false;
            }
        });
    }

    initMouseListeners() {
        // Lock the mouse to the center and hide it when mouse is moved
        window.addEventListener('mousedown', () => {
            // Lock the mouse to the center of the screen
            if (document.documentElement.requestPointerLock) {
                document.documentElement.requestPointerLock();
            }
        });
    
        // Handle mouse movement
        window.addEventListener('mousemove', (event) => {
            // Mouse movement relative to the center of the screen
            this.rotationY -= event.movementX * this.mouseSensitivity; 
            this.rotationX -= event.movementY * this.mouseSensitivity; 
    
            // Limit vertical rotation to prevent flipping
            this.rotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.rotationX));
        });
    
        // Exit pointer lock when the user presses 'ESC'
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                if (document.exitPointerLock) {
                    document.exitPointerLock();
                }
            }
        });
    }

    update() {
        super.update();
        const deltaTime = Game.clock.getDelta();
        const transform = this.gameObject.transform;

        const forward = {
            x: -Math.sin(this.rotationY),
            z: -Math.cos(this.rotationY)
        };
        const right = {
            x: Math.cos(this.rotationY),
            z: -Math.sin(this.rotationY)
        };

        let moveX = 0;
        let moveZ = 0;

        if (this.keys.ArrowUp) {
            moveX += forward.x;
            moveZ += forward.z;
        }
        if (this.keys.ArrowDown) {
            moveX -= forward.x;
            moveZ -= forward.z;
        }
        if (this.keys.ArrowLeft) {
            moveX -= right.x;
            moveZ -= right.z;
        }
        if (this.keys.ArrowRight) {
            moveX += right.x;
            moveZ += right.z;
        }

        const magnitude = Math.sqrt(moveX * moveX + moveZ * moveZ);
        if (magnitude > 0) {
            moveX /= magnitude;
            moveZ /= magnitude;
        }

        this.velocity.x += moveX * this.acceleration * deltaTime;
        this.velocity.z += moveZ * this.acceleration * deltaTime;

        if (moveX === 0) this.velocity.x *= Math.max(1 - this.deceleration * deltaTime, 0);
        if (moveZ === 0) this.velocity.z *= Math.max(1 - this.deceleration * deltaTime, 0);

        const speedMagnitude = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z);
        if (speedMagnitude > this.speed) {
            this.velocity.x = (this.velocity.x / speedMagnitude) * this.speed;
            this.velocity.z = (this.velocity.z / speedMagnitude) * this.speed;
        }

        transform.position.set(
            transform.position.x + this.velocity.x * deltaTime,
            transform.position.y,
            transform.position.z + this.velocity.z * deltaTime
        );

        let tiltX = -this.velocity.z * this.rotationFactor; 
        let tiltZ = this.velocity.x * this.rotationFactor;

        transform.rotation.set(
            tiltX,    
            this.rotationY, 
            tiltZ    
        );
        this.cameraObject.transform.rotation.set(this.rotationX, 0, 0);

        if (magnitude > 0) {
            this.wobbleTime += deltaTime * this.wobbleSpeed;
            this.cameraObject.transform.position.set(
                this.cameraObject.transform.position.x,
                this.cameraObject.transform.position.y + Math.sin(this.wobbleTime) * this.wobbleAmount,
                this.cameraObject.transform.position.z
            );
        }
    }
}
