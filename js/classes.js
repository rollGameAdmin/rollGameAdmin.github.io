//original width was 1300px
let canvas = document.getElementById("game");
canvas.width = canvas.offsetWidth;
canvas.height =  canvas.width/2.3;
let changed = false;
if (canvas.width < 500) {
    document.getElementById('container').style.display = 'none';
    document.getElementById('credits').style.display = 'none';
    refresh();
}

function scale(px) {
    return Math.floor(canvas.width * px/1305);
}
function refresh() {
    let refreshReq = window.requestAnimationFrame(refresh);
    if (window.innerWidth > 500 && !changed) {
        location.reload();
        changed = true;
    } else if (changed) {
        window.cancelAnimationFrame(refreshReq);
    }
}

let graphicTypes = {
    rectangle: 1,
    deathTriangle: 2,
    cannon: 3,
    deathTrap: 4,
    dart: 5,
    trampo: 6,
    wall: 7
};

class Graphic {
    constructor(details) {
        this.c = details.c; //canvas context
        this.centerX = details.centerX; //x-coordinate of center
        this.centerY = details.centerY; //y-coordinate of center
        this.initialCenterX = this.centerX; //initial x-coordinate of center
        this.initialCenterY = this.centerY; //initial y-coordinate of center
        this.speed = details.speed; //amount of displacement per animation frame
        this.initialSpeed = this.speed;
        this.bounceSpeedY = canvas.width * 7.2/1305; //displacement of centerY when calling bounce() original: 7.2
        this.initialBounceSpeedY = this.bounceSpeedY; //initial displacement of centerY when calling bounce()
        this.deceleration = canvas.width * .42/1305; //number to subtract from bounceSpeedY when calling bounce() original: .37
        this.bounceSpeedX = scale(5); //displacement of centerX when calling bounceForward() and bounceBack() original: 5
        this.forwardDeceleration = canvas.width * .5/1305; //number to subtract from bounceSpeedY when calling bounceForward() original: .5
        this.backDeceleration = canvas.width * .5/1305; //number to subtract from bounceSpeedY when calling bounceBack() original = .5
        this.stopForward = details.stopForward; //x-coordinate where roll should stop
        this.stopFall = details.stopFall; //y-coordinate where fall should stop
        this.falling = false; //boolean to record whether or not circle is falling
        this.fallSpeedY = 0;
        this.fallDeceleration = scale(3); //original .8
        this.storeSpeed = scale(6); //original 6
        this.spacing = details.spacing;
        this.initialAngle = -Math.PI/2;
        this.angle = this.initialAngle;
        this.rotationRate = .1; //original .1
        this.loopRadius = scale(100); //original 100
        this.axisX =  this.centerX - (Math.cos(-Math.PI/2) * this.loopRadius);
        this.axisY =  this.centerY + (Math.sin(-Math.PI/2) * this.loopRadius);
        this.graphicType = details.graphicType;
        this.isStored = false;
        this.startedStoring = false;
    }

    reposition(newX) {
        this.centerX = newX;
        this.initialCenterX = newX;
    }

    //Add render method when you create class for a new shape :)

    //moves graphic forward
    forward() {
        this.centerX += this.speed;
    }

    //moves graphic backwards
    back(gameSpeed) {
        if (gameSpeed == -1) {
            this.centerX -= this.speed;
        } else {
            this.centerX -= gameSpeed
        }
    }

    //bounces graphic straight up
    bounce() {
        this.bounceSpeedY -= this.deceleration;
        this.centerY -= this.bounceSpeedY;
    }

    //bounces graphic forward
    bounceForward() {
        this.bounceSpeedY -= this.forwardDeceleration;
        this.centerY -= this.bounceSpeedY;
        this.centerX += this.bounceSpeedX; 
    }

    //bounces graphic backwards
    bounceBack() {
        this.bounceSpeedY -= this.backDeceleration;
        this.centerY -= this.bounceSpeedY;
        this.centerX -= this.bounceSpeedX;
    }


    loopIt() {
        this.centerY = this.axisY - (Math.sin(this.angle) * this.loopRadius);
        this.centerX = this.axisX + (Math.cos(this.angle) * this.loopRadius);;
        this.angle += this.rotationRate;
    }

    moveDown(amount) {
        this.centerY += amount;
    }

    fall() {
        this.fallSpeedY += this.fallDeceleration;
        this.centerY += this.fallSpeedY;
    }

    store() {
        this.centerY += this.storeSpeed;
    }

    changeColor(color) {
        this.color = color;
    }

    getLeftX() {
        return (this.centerX - this.width/2);
    }

    getRightX() {
        return (this.centerX + this.width/2);
    }

    getTopY() {
        return (this.centerY - this.height/2);
    }

    getBottomY() {
        return (this.centerY + this.height/2);
    }

    isAbove(graphic) {
        return this.getTopY() < graphic.getTopY();
    }
}

class Circle extends Graphic {
    constructor(details) {
        super(details);
        this.color = details.color;
        this.radius = details.radius;
        this.width = this.radius*2;
        this.height = this.radius*2;
        this.startAngle = 0; //start angle for cing in canvas
        this.endAngle = Math.PI * 2; //end angle for cing in canvas
        this.strokeColor = details.strokeColor;
        this.strokeWidth = details.strokeWidth;
    }

    //cs circle according at it's center location
    render() {
        this.c.beginPath();
        this.c.arc(this.centerX, this.centerY, this.radius, this.startAngle, this.endAngle);
        this.c.fillStyle = this.color;
        this.c.strokeStyle = this.strokeColor;
        this.c.lineWidth = this.strokeWidth;
        this.c.stroke();
        this.c.fill();
        this.c.closePath();
    }
}

class Rectangle extends Graphic {
    constructor(details) {
        super(details);
        this.width = details.width; //width of rectangle
        this.height = details.height; //height of rectangle
        this.towerSpacing = details.towerSpacing;
        this.towerHeightDiff = details.towerHeightDiff;
        this.flatSpacing = details.flatSpacing;
        this.color = details.color;
        this.strokeColor = details.strokeColor;
        this.strokeWidth = details.strokeWidth;
    }

    reposition(newX) {
        this.centerX = newX;
    }

    //cs rectangle according to its center location
    render() {
        this.c.beginPath();
        this.c.rect(this.centerX-this.width/2, this.centerY-this.height/2, this.width, this.height);
        this.c.fillStyle = this.color;
        this.c.strokeStyle = this.strokeColor;
        this.c.lineWidth = this.strokeWidth;
        this.c.fill();
        this.c.stroke();
        this.c.closePath();
    }

    changeColor(color) {
        this.color = color;
    }
}

class Triangle extends Graphic {
    constructor(details) {
        super(details);
        this.beginX = details.beginX; //x-coordinate for left-bottom corner
        this.beginY = details.beginY; //y-coordinate for left-bottom corner
        this.width = details.width; //triangle width
        this.height = details.height; //triangle height
        this.topX = this.beginX + this.width/2; //x-coordinate for top corner
        this.topY = this.beginY - this.height; //y-coordinate for top corner
        this.endX = this.beginX + this.width;//x-coordinate for right-bottom corner
        this.endY = this.beginY; //y-coordinate for right-bottom corner
        this.centerX = this.beginX + this.width/2;
        this.color = details.color; //color of triangle
        this.strokeColor = details.strokeColor;
        this.strokeWidth = details.strokeWidth;
    }

    reposition(newX, newY) {
        if (newX !== -1) {
            this.beginX = newX;
            this.topX = this.beginX + this.width/2;
            this.endX = this.beginX + this.width;
        }
        if (newY !== -1) {
            this.beginY = newY;
            this.topY = this.beginY - this.height;
            this.endY = this.beginY;
        }
    }

    //cs triangle on Canvas
    render() {
        this.c.beginPath();
        this.c.moveTo(this.beginX, this.beginY);
        this.c.lineTo(this.topX, this.topY);
        this.c.lineTo(this.endX, this.endY);
        this.c.lineTo(this.beginX, this.beginY);
        this.c.strokeStyle = this.strokeColor;
        this.c.lineWidth = this.strokeWidth;
        this.c.fillStyle = this.color;
        this.c.fill();
        this.c.stroke();
        this.c.closePath();
    }

    //moves triangle backwards
    back() {
        this.beginX -= this.speed;
        this.topX -= this.speed;
        this.endX -= this.speed;
        this.centerX = this.beginX - this.width/2;
    }

    //moves triangle forwards
    forward() {
        this.beginX += this.speed;
        this.topX += this.speed;
        this.endX += this.speed;
        this.centerX = this.beginX - this.width/2;
    }

    getLeftX() {
        return this.beginX;
    }

    getRightX() {
        return this.endX;
    }

    getTopY() {
        return this.topY;
    }

    getBottomY() {
        return this.endY;
    }

    moveDown(rate) {
        this.beginY += rate;
        this.topY += rate;
        this.endY += rate;
    }

    reveal(rate) {
        this.beginY -= rate;
        this.topY -= rate;
        this.endY -= rate;
    }

}

class Line {
    constructor(details) {
        this.c = details.c;
        this.beginX = details.beginX; //x-coordinate to begin drawing line
        this.beginY = details.beginY; //y-coordinate to end drawing line
        this.endX = details.endX; //x-coordinate to end drawing line
        this.endY = details.endY; //y-coordinate to end drawing line
        this.color = details.color; //color of line
        this.width = details.thickness; //thickness of line
        this.length = this.beginX - this.endX;
        this.centerX = this.beginX - this.length/2;
        this.speed = details.speed;
        this.graphicType = details.graphicType;
        this.spacing = details.spacing
    }

    reposition(newX, length) {
        this.beginX = newX;
        this.endX = this.beginX + length;
    }

    //cs line on Canvas
    render() {
        this.c.beginPath();
        this.c.moveTo(this.beginX,this.beginY);
        this.c.lineTo(this.endX,this.endY);
        this.c.strokeStyle = this.color;
        this.c.lineWidth = this.width;
        this.c.stroke();
        this.c.closePath();
    }

    //moves graphic backwards
    back(gameSpeed) {
        this.beginX -= gameSpeed;
        this.endX -= gameSpeed;
        this.centerX = this.beginX - this.length/2;
    }

    moveDown(amount) {
        this.beginY += amount;
        this.endY += amount;
    }

    getLeftX() {
        return this.beginX;
    }

    getRightX() {
        return this.endX;
    }

    getTopY() {
        return this.beginY;
    }

    getBottomY() {
        return this.endY;
    }
}

class Pic extends Graphic {
    constructor(details) {
        super(details);
        this.image = new Image(); //image object
        this.src = details.src;
        this.image.src = this.src; //img src
        this.image.width = details.width; //img width
        this.image.height = details.height; //img height
        this.width = details.width; //pic width
        this.height = details.height; //pic height
    }

    //Renders image according to its center
    render() {
        this.c.drawImage(
            this.image,
            this.centerX - this.image.width/2,
            this.centerY - this.image.height/2,
            this.image.width,
            this.image.height
        );
    }

    changeSrc(src) {
        this.image.src = src;
    }
}

class Sprite extends Graphic {
    constructor(details) {
        super(details);
        this.image = new Image(); //image object
        this.image.src = details.src;
        this.spriteWidth = details.spriteWidth; //img width
        this.spriteHeight = details.spriteHeight; //img height
        this.width = details.width;
        this.height = details.height;
        this.centerX = details.centerX,
        this.centerY = details.centerY,
        this.columnIndex = 0;
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = details.ticksPerFrame;
        this.numColumns = details.numColumns;
        this.lastRowColumns = details.lastRowColumns;
        this.rowIndex = 0;
        this.numRows = details.numRows;
        this.numFrames = this.numColumns * this.numRows;
        this.loop = details.loop;
        this.reverse = details.reverse;
        this.renderForwards = true;
        this.finished = false;
    }

    render() {
        this.c.drawImage(
            this.image,
            this.columnIndex * (this.spriteWidth / this.numColumns),
            this.rowIndex * (this.spriteHeight / this.numRows),
            this.spriteWidth / this.numColumns,
            this.spriteHeight / this.numRows,
            this.centerX - this.width/2,
            this.centerY - this.height/2,
            this.width,
            this.height
        );
    }

    restart() {
        this.columnIndex = 0;
        this.rowIndex = 0;
        this.frameIndex = 0;
    }

    update() {
        this.tickCount += 1;
        if (this.tickCount > this.ticksPerFrame) {

            this.tickCount = 1;

            if (!this.reverse) {
                if (this.rowIndex < this.numRows - 1) {
                    if (this.columnIndex < this.numColumns - 1) {
                        this.columnIndex++;
                        this.frameIndex++;
                    } else {
                        this.columnIndex = 0;
                        this.rowIndex++;
                        this.frameIndex++;
                    }
                } else {
                    if (this.columnIndex < this.lastRowColumns - 1) {
                        this.columnIndex++;
                        this.frameIndex++;
                    }  else if (this.loop) {
                        this.restart();
                    } else {
                        this.finished = true;
                    }
                }
            } else {
                if (this.renderForwards) {
                    if (this.rowIndex < this.numRows - 1) {
                        if (this.columnIndex < this.numColumns - 1) {
                            this.columnIndex++;
                            this.frameIndex++;
                        } else {
                            this.columnIndex = 0;
                            this.rowIndex++;
                            this.frameIndex++;
                        }
                    } else {
                        if (this.columnIndex < this.lastRowColumns - 1) {
                            this.columnIndex++;
                            this.frameIndex++;
                        }  else {
                            this.columnIndex = this.lastRowColumns - 1;
                            this.renderForwards = false;
                        }
                    }
                } else {
                    if (this.rowIndex > 0) {
                        if (this.columnIndex > 1) {
                            this.columnIndex--;
                            this.frameIndex--;
                        } else {
                            this.columnIndex = this.numColumns - 1;
                            this.rowIndex--;
                            this.frameIndex--;
                        }
                    } else if (this.columnIndex > 0) {
                        this.columnIndex--;
                        this.frameIndex--;
                    } else if (this.loop) {
                        this.restart();
                        this.renderForwards = true;
                    } else {
                        this.finished = true;
                    }
                }
            }
        }
    }

    landedOnGraphic(graphic) {
        let graphicLeftX = graphic.getLeftX();
        let graphicRightX = graphic.getRightX();
        let graphicTopY = graphic.getTopY();

        let thisLeftX = this.getLeftX();

        return this.centerY >= graphicTopY - this.height/2 &&
                   this.centerX + this.width/4 >= graphicLeftX &&
                   thisLeftX <= graphicRightX;
    }

    landedOnTunnel(graphic, bouncing) {
        let graphicLeftX = graphic.getLeftX();
        let graphicRightX = graphic.getRightX();
        let graphicTopY = graphic.getTopY();

        let thisLeftX = this.getLeftX();

        return this.centerY >= graphicTopY - this.height/2 &&
                   this.centerX >= graphicLeftX &&
                   thisLeftX <= graphicRightX && bouncing;
    }

    passed(graphic) {
        return this.getLeftX() >= graphic.getRightX();
    }

    changeImg(src) {
        this.image.src = src;
    }
}

class BallSprite extends Sprite {
    constructor(details) {
        super(details);
        this.isMovingForward = false;
        this.isRotating = false;
        this.isBouncing = false;
        this.isReadyToBounce = false;
        this.isFalling = false;
    }

    bounce() {
        super.bounce();
        this.isBouncing = true;
    }

    stopBouncing(centerYToStop) {
        this.isBouncing = false;
        this.centerY = centerYToStop;
        this.bounceSpeedY = this.initialBounceSpeedY;
        this.isReadyToBounce = true;
    }

    readyToBounce() {
        this.isReadyToBounce = true;
    }

    fall() {
        super.fall();
        this.isFalling = true;
        this.isReadyToBounce = false;
    }

    stopFalling(centerYToStop) {
        this.isFalling = false;
        this.centerY = centerYToStop;
        this.bounceSpeedY = this.initialBounceSpeedY;
        this.isReadyToBounce = true;
        ball.fallSpeedY = 0;
    }

    isNotReadyToBounce() {
        this.isReadyToBounce = false;
    }

    update() {
    }

    rotate() {
        super.update();
        this.isRotating = true;
    }

    stopRotating() {
        this.isRotating = false;
    }

    moveForward() {
        this.forward();
        this.rotate();
        this.isMovingForward = true;
        this.isRotating = true;
    }
    stopMovingForward() {
        this.isMovingForward = false;
        this.isRotating = false;
    }

    isBehindGraphicPlusDisplacement(graphic, distance) {
        return this.getLeftX() < graphic.getRightX() + distance;
    }

    isWithinDistanceFromGraphic(graphic, distance) {
        return this.getRightX() > graphic.getLeftX() - distance;
    }

    hitAmmo(dart) {
        return this.getRightX() >= dart.getLeftX() &&
            this.getLeftX() <= dart.getRightX() &&
            this.centerY >= dart.getTopY();
    }

    stillOnGraphic(graphic) {
        let graphicLeftX = graphic.getLeftX();
        let graphicTopY = graphic.getTopY();
        let graphicRightX = graphic.getRightX();
        let thisLeftX = this.getLeftX();

        let on = this.centerY >= graphicTopY - this.height/2 &&
            thisLeftX >= graphicLeftX &&
            thisLeftX <= graphicRightX + scale(100);
        return on;
    }

    deathTri(tris) {
        let lastTri = tris[tris.length - 1];
        let firstTri = tris[0];
        let leftX = firstTri.getLeftX();
        let rightX = lastTri.getRightX();
        let topY = firstTri.getTopY();

        let deathLand = this.centerX >= leftX &&
            this.getLeftX() <= rightX &&
            this.centerY + this.height/8 >= topY;
        return deathLand;
    }

    killedByTri(triangle) {
        let leftX = triangle.getLeftX();
        let rightX = triangle.getRightX();
        let topY = triangle.getTopY();

        return this.centerX >= leftX &&
            this.getLeftX() <= rightX &&
            this.centerY + this.height/8 >= topY;
    }

    hitOnGround(graphic) {
        let graphicLeftX = graphic.getLeftX();
        let graphicRightX = graphic.getRightX();
        let hit;
        hit = this.centerX >= graphicLeftX &&
            this.centerX <= graphicRightX &&
            this.centerY >= graphic.getTopY();
        return hit;
    }

    deathByDeathTrap(deathTrap) {
        let dead = this.centerX >= deathTrap.getLeftX() &&
            this.centerX <= deathTrap.getRightX() &&
            (deathTrap.getTopY() - this.getBottomY()) <= 1;
        if (dead) {
            this.centerY = deathTrap.getBottomY();
        }
        return dead;
    }

    throughTunnel(tunnel) {
        let tunnelLeftX = tunnel.getLeftX();
        let tunnelRightX = tunnel.getRightX();
        let thisLeftX = this.getLeftX();
        let thisRightX = this.getRightX();
        let through = thisLeftX >= tunnelLeftX - scale(100) &&
            thisRightX <= tunnelRightX + scale(75) &&
            this.centerY === this.initialCenterY;
        return through;
    }
}

class CannonSprite extends Sprite {
    constructor(details) {
        super(details);
        this.darts = new GraphicsList();
        this.isFiring = false;
        this.justFired = null;
        this.nextRound = null;
    }

    reset() {
        this.restart();
        this.darts = new GraphicsList();
        this.isFiring = false;
        this.isStored = false;
        this.startedStoring = false;
        this.justFired = null;
        this.nextRound = null;
    }

    load(dart) {
        this.darts.addToBack(dart);
    }

    fire(fireSpeed) {
        if (!this.darts.isEmpty()) {
            this.justFired = this.darts.removeFront();
            this.nextRound = this.darts.getFirstGraphic();
            this.justFired.speed = fireSpeed;
        }
        this.isFiring = true;
    }

    stopFiring() {
        this.isFiring = false;
    }

    hasAmmo() {
        return !this.darts.isEmpty()
    }
}

class Dart extends Triangle {
    constructor(details) {
        super(details);
        this.cannon = details.cannon;
        this.finishSettingUp();
    }

    finishSettingUp() {
        this.topX = this.beginX + this.width;
        this.topY = this.beginY - this.height/2;
        this.endX = this.beginX + this.width;
        this.endY = this.beginY + this.height/2;
    }

    loadToCannon() {
        this.cannon.load(this);
    }

    reposition(newX) {
        this.beginX = newX;
        this.topX = this.beginX + dimen.dartWidth;
        this.endX = this.beginX + dimen.dartWidth;
    }

    clone(cannon) {
        let copy = Object.assign(Object.create(Object.getPrototypeOf(this)),this);
        copy.speed = copy.initialSpeed;
        copy.cannon = cannon;
        cannon.load(copy);
        return copy;
    }
}

class AnimationRequest {
    constructor() {
        this.request = null;
    }

    setRequest(request) {
        this.request = request;
    }

    getRequest() {
        return this.request;
    }
}

class Text {
    constructor(details) {
        this.c = details.c;
        this.text = details.text;
        this.font = details.font;
        this.x = details.x;
        this.y = details.y;
        this.color = details.color;
    }

    render() {
        this.c.font = this.font;
        this.c.fillStyle = this.color;
        this.c.fillText(this.text, this.x, this.y);
    }
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    };
    this.pause = function(){
        this.sound.pause();
    };
    this.sound.volume = .05;
}

function createArray() {
    let array = [];
    array.lastIndex = function () {
        return array.length - 1;
    };
    array.changeColor = function(color) {
        for (let i = 0; i < array.length; i++) {
            array[i].color = color;
        }
    };
    array.reveal = function(rate) {
        for (let i = 0; i < array.length; i++) {
            array[i].reveal(rate);
        }
    };
    return array;
}

class GraphicNode {
    constructor(graphic) {
        this.graphic = graphic;
        this.next = null;
        this.prev = null;
    }

    render() {
        this.graphic.render();
    }

    forward() {
        this.graphic.forward();
    }

    back(gameSpeed) {
        this.graphic.back(gameSpeed);
    }

    moveDown(gameSpeed) {
        this.graphic.moveDown(gameSpeed);
    }
}

class GraphicsList {
    constructor() {
        this.head = null;
        this.tail = this.head;
        this.length = 0;
        this.justRestored = false;
        this.iterator = {
            *[Symbol.iterator]() {
                let current = this.head;
                while (current != null) {
                    yield current;
                    current = current.next;
                }
            }
        };
    }

    addToBack(graphic) {
        this.justRestored = this.length === 0;
        this.length++;
        let newGraphic = new GraphicNode(graphic);
        if (this.head === null) {
            this.head = newGraphic;
            this.tail = newGraphic;
        } else {
            this.tail.next = newGraphic;
            newGraphic.prev = this.tail;
            this.tail = newGraphic;
        }
    }

    addToFront(graphic) {
        this.justRestored = this.length === 0;
        this.length++;
        let newGraphic = new GraphicNode(graphic);
        if (this.head == null) {
            this.head = newGraphic;
            this.tail = newGraphic;
        } else {
            newGraphic.next = this.head;
            this.head.prev = newGraphic;
            this.head = newGraphic;
        }
    }

    getFirst() {
        return this.head;
    }

    getLast() {
        return this.tail;
    }

    getFirstGraphic() {
        if (this.head !== null) {
            return this.head.graphic;
        } else {
            return null;
        }
    }

    getLastGraphic() {
        if (this.tail != null) {
            return this.tail.graphic;
        } else {
            return null;
        }
    }
    removeFront() {
        this.length--;
        let graphicToRemove = this.head;
        this.head = this.head.next;
        if (this.head == null) {
            this.tail = null;
        }
        return graphicToRemove.graphic;
    }

    isEmpty() {
        return this.length === 0;
    }

    size() {
        return this.length;
    }

    remove(graphic) {
        this.length--;
        let current = this.head;
        while (current != null && current.graphic !== graphic) {
            current = current.next;
        }
        if (current != null) {
            if (current.prev != null) {
                current.prev.next = current.next;
            } else {
                this.head = current.next;
            }
        }
        return current;
    }

    colorGraphics() {
        let current = this.darts.head;
        while (current != null) {
            current.graphic.changeColor('#0090FF');
            current = current.next;
        }
    }
}

class GraphicsToRender {
    constructor(context) {
        this.c = context;
        this.toMoveBack = new GraphicsList(); //array to contain all of the graphicsToRender of graphicTypes graphic in the canvas
        this.toRender = new GraphicsList();
        this.toMoveDown = new GraphicsList();
    }

    render() {
        this.c.clearRect(0, 0, canvas.width, canvas.height);
        let current = this.toRender.getFirst();
        while (current !== null) {
            current.render();
            current = current.next;
        }
    }

    size() {
        return this.toRender.size();
    }
    //adds new graphic to the graphicsToRender array
    addGraphicToMoveBack(graphic) {
        this.toMoveBack.addToBack(graphic);
    }

    addMultToMoveBack(graphicsToAdd) {
        for (let i = 0; i < graphicsToAdd.length; i++) {
            this.toMoveBack.addToBack(graphicsToAdd[i]);
        }
    }

    addMultToRender(graphicsToAdd) {
        for (let i = 0; i < graphicsToAdd.length; i++) {
            this.toRender.addToBack(graphicsToAdd[i]);
        }
    }

    addMultToMoveDown(graphicsToAdd) {
        for (let i = 0; i < graphicsToAdd.length; i++) {
            this.toMoveDown.addToBack(graphicsToAdd[i]);
        }
    }

    addToFront(graphic) {
        this.toRender.addToFront(graphic);
    }

    addToBack(graphic) {
        this.toRender.addToBack(graphic);
    }

    getLastGraphic() {
        return this.toRender.getLastGraphic();
    }

    getFirstGraphic() {
        return this.toRender.getFirstGraphic();
    }

    //removes and returns first element in the graphicsToRender array
    removeFront() {
        return this.toRender.removeFront();
    }

    moveDown() {
        let current = this.toMoveBack.getFirst();
        while (current != null) {
            if (current.graphic instanceof Rectangle || current.graphic instanceof Line) {
                    current.moveDown(120);
            }
            current = current.next
        }
    }

    moveBack(gameSpeed) {
        let current = this.toMoveBack.getFirst();
        while(current != null) {
            current.back(gameSpeed);
            current = current.next;
        }
    }

    remove(graphic) {
        return this.toRender.remove(graphic);
    }

    moveGraphicsDown(rate) {
        let i = 0;
        while (i < this.toMoveDown.length) {
            let row = this.toMoveDown[i];
            if (!(row[0] instanceof Array)) {
                for (let j = 0; j < row.length; j++) {
                    row[j].moveDown(rate);
                }
            } else {
                for (let j = 0; j < row.length; j++) {
                    let subRow = row[j];
                    for (let k = 0; k < subRow.length; k++) {
                        subRow[k].moveDown(rate);
                    }
                }
            }
            i++;
        }
    }


    moveGraphicsForward(graphicsToForward) {
        for (let i = 2; i <= graphicsToForward.length + 1; i++) {
            this.toMoveBack[i].forward();
        }
    }
}
