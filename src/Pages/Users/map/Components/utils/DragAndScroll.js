import Click from './Click.js';

export default class DragClickHandler {
    constructor(element, camera, scene, dragThreshold = 5) {
        this.element = element;
        this.camera = camera;
        this.scene = scene;
        this.dragThreshold = dragThreshold; 

        this.isDragging = false;
        this.startPosition = { x: 0, y: 0 };

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

        this.element.addEventListener('mousedown', this.onMouseDown);
        this.element.addEventListener('mousemove', this.onMouseMove);
        this.element.addEventListener('mouseup', this.onMouseUp);
    }

    onMouseDown = (event) => {
        this.isDragging = false;
        this.startPosition.x = event.clientX;
        this.startPosition.y = event.clientY;
    }

    onMouseMove = (event) => {
        const dragDistance = Math.sqrt(
            Math.pow(event.clientX - this.startPosition.x, 2) +
            Math.pow(event.clientY - this.startPosition.y, 2)
        );

        if (dragDistance > this.dragThreshold) {
            this.isDragging = true;
        }
    }

    onMouseUp = (event) => {
        if (!this.isDragging) {
            new Click(event, this.camera, this.scene);
            console.log("Click is true")
        }
    }

    destroy() {
        this.element.removeEventListener('mousedown', this.onMouseDown);
        this.element.removeEventListener('mousemove', this.onMouseMove);
        this.element.removeEventListener('mouseup', this.onMouseUp);
    }
}
