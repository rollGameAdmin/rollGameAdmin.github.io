let dimen = {
    ballRadius: scale(30),
    trackLength: canvas.width,
    trackThickness: scale(5),
    ballSpriteWidth: 649,
    ballSpriteHeight: 217,
    tunnelWidth: scale(214),
    tunnelHeight: scale(65),
    triangleWidth: scale(40),
    triangleHeight: scale(40),
    triangleStroke: scale(3.1),
    rectangleWidth: scale(90),
    rectangleHeight: scale(40),
    rectangleStroke: scale(3.5),
    deathTrapStroke: scale(4),
    cannonSpriteWidth: 822,
    cannonSpriteHeight: 657,
    cannonWidth: scale(112),
    cannonHeight: scale(112),
    dartWidth: scale(28),
    dartHeight: scale(28),
    dartStroke: scale(2.9)
};

let img = {
    tunnel: 'img/tunnel/tunnel5.png',
    ballSprite: 'img/ball/ball_spritesheet6.png',
    explodedBall: 'img/explode/exploded_orange_ball.png',
    cannonSprite: 'img/cannon/cannon_sprite5.png'
};

let colors = {
    darkGrey: '#273336',
    orange: '#F33B1B',
    lightGreen: '#00F69F',
    lightBlue: '#2FEAFF',
    purple: '#CD30E8',
    lightOrange: '#FF9933',
    oceanBlue: '#0090FF'
};

let trackPos = {
    y: canvas.height - dimen.trackThickness/2,
    beginX: 0,
    endX: canvas.width
};

let ballPos = {
    centerX: trackPos.beginX - scale(300),
    centerY: trackPos.y - dimen.trackThickness/2 - dimen.ballRadius
};

let tunnelPos = {
    centerX: trackPos.beginX + scale(50),
    centerY: trackPos.y - dimen.tunnelHeight/2,
};

let triPos = {
    beginX: tunnelPos.centerX + dimen.tunnelWidth/2 + scale(400),
    beginY: trackPos.y - dimen.trackThickness/2 - dimen.triangleStroke,
};

let pos = {
    secondTriDisplacement: scale(250),
    firstRecDisplacement: scale(350),
    recOnGroundY: trackPos.y - dimen.rectangleHeight / 2,
    minRectangleSpacing: scale(160),
    rectangleTowerSpacing: scale(165),
    rectangleTowerHeightDiff: scale(-15),
    deathTrapOnGroundY: trackPos.y - dimen.deathTrapStroke/2,
    newGraphicMinDisplacement: 200,
    newGraphicMaxDisplacement: 400,
    cannonDisplacement: scale(1700),
    cannonOnGroundY: trackPos.y - dimen.cannonHeight/2 + scale(10),
    dartDisplacementX: scale(20),
    dartDisplacementY: scale(10),
};

let num = {
    triangleAdditionsSecondRow: 1,
    deathTrapRowAdditions: 1,
    minRecDups: 0,
    maxRecDups: 1,
    minTriDups: 0,
    maxTriDups: 2,
    minDartDups: 1,
    maxDartDups: 2
};

let sprites = {
    ballTicksPerFrame: 2,
    ballNumColumns: 6,
    ballLastRowColumns: 6,
    ballNumRows: 2,
    cannonTicksPerFrame: 0,
    cannonNumRows: 4,
    cannonNumColumns: 5,
    cannonLastRowColumns: 5,
};

const gameSpeed = canvas.width * 6.7/1305;
const initialGameSpeed = gameSpeed;
const context = canvas.getContext("2d");
const NO_CHANGE = -1;
let graphicsToRender = new GraphicsToRender(context);
let graphicsToMonitor = new GraphicsList();
let graphicsToDelete = new GraphicsList();
let cannons = new GraphicsList();
let lastGraphicType = graphicTypes.cannon;

function addGraphicToRenderAndMonitor(graphic) {
    graphicsToRender.addToBack(graphic);
    graphicsToRender.addGraphicToMoveBack(graphic);
    graphicsToMonitor.addToBack(graphic);
}

function addCannonToList(cannon) {
    cannons.addToBack(cannon);
    addGraphicToRenderAndMoveBack(cannon);
}

function addGraphicToRenderAndMoveBack(graphic) {
    graphicsToRender.addToBack(graphic);
    graphicsToRender.addGraphicToMoveBack(graphic);
}

function duplicate(shape) {
    let copy = Object.assign(Object.create(Object.getPrototypeOf(shape)),shape);
    if (!(copy instanceof CannonSprite)) {
        addGraphicToRenderAndMonitor(copy);
    }
    return copy;
}

function duplicateForRow(shape) {
    let copy = duplicate(shape);
    if (shape instanceof Triangle) {
        if (shape.spacing !== NO_CHANGE) {
            copy.beginX = shape.endX + shape.spacing;
            copy.endX = copy.beginX + copy.width;
            copy.topX = copy.beginX + copy.width/2;
        }
    } else if (shape instanceof Rectangle) {
        copy.centerX = shape.centerX + shape.width + shape.flatSpacing;
    } else if (shape instanceof Line) {
        copy.beginX = shape.getRightX() + shape.spacing;
        copy.endX = copy.beginX + pos.minRectangleSpacing;
    } else if (shape instanceof Pic) {
        copy.image = new Image();
        copy.image.src = copy.src;
        copy.image.width = copy.width;
        copy.image.height = copy.height;
    }
    return copy;
}

//Creates array of adjacent rectangles
function createRowOfDuplicates(shape, amount) {
    let shapeToCopy = shape;
    for (let i = 0; i < amount; i++) {
        if (shape instanceof Dart) {
            shapeToCopy = shape.clone(shape.cannon);
            addGraphicToRenderAndMonitor(shapeToCopy);
        } else {
            shapeToCopy = duplicateForRow(shapeToCopy);
        }
    }
}

function createRowOfRecsAndTraps(rec, trap, amount) {
    let rectangle = rec;
    let deathTrap = trap;
    for (let i = 0; i < amount; i++) {
        rectangle = duplicateForRow(rectangle);
        deathTrap = duplicateForRow(deathTrap);
    }
    duplicateForRow(rectangle);
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getNextGraphicType() {
    let minGraphic = graphicTypes.rectangle;
    let maxGraphic = graphicTypes.cannon;
    return getRandom(minGraphic, maxGraphic);
}

function getNextGraphicDisplacement() {
    let minDisplacement = pos.newGraphicMinDisplacement;
    let maxDisplacement = pos.newGraphicMaxDisplacement;
    return getRandom(minDisplacement, maxDisplacement);
}

function getNextRecDupsAmount() {
    let minDups = num.minRecDups;
    let maxDups = num.maxRecDups;
    return getRandom(minDups, maxDups);
}

function getNextTriDupsAmount() {
    let minDups = num.minTriDups;
    let maxDups = num.maxTriDups;
    return getRandom(minDups, maxDups);
}

function getNextDartDups() {
    let minDups = num.minDartDups;
    let maxDups = num.maxDartDups;
    return getRandom(minDups, maxDups);
}

function getNextRecSpacing() {
    let minSpacing = pos.minRectangleSpacing;
    let maxSpacing = pos.minRectangleSpacing + scale(30);
    return getRandom(minSpacing, maxSpacing);
}

let numCreatedBeforeCannon = 0;
function createNextGraphic(lastGraphic) {
    let graphicType =  getNextGraphicType();
    let displacement = getNextGraphicDisplacement();
    switch(graphicType) {
        case graphicTypes.rectangle : {
            numCreatedBeforeCannon++;
            let numDups = getNextRecDupsAmount();

            let newRectangle = duplicate(firstRectangle);
            newRectangle.reposition(lastGraphic.getRightX() + displacement + dimen.rectangleWidth/2);
            newRectangle.changeColor(colors.oceanBlue);

            let newTrap = duplicate(firstDeathTrap);
            newTrap.reposition(newRectangle.getRightX(), pos.minRectangleSpacing);

            if (numDups > 0) {
                createRowOfRecsAndTraps(newRectangle, newTrap, numDups);
            } else {
                duplicateForRow(newRectangle);
            }
            break;
        }
        case graphicTypes.deathTriangle : {
            numCreatedBeforeCannon++;
            let numDups = getNextTriDupsAmount();

            let newTriangle = duplicate(firstTriangle);
            newTriangle.reposition(lastGraphic.getRightX() + displacement, triPos.beginY);
            createRowOfDuplicates(newTriangle, numDups);
            break;
        }
        case graphicTypes.cannon : {
            if (lastGraphicType !== graphicTypes.cannon && numCreatedBeforeCannon > 3) {
                numCreatedBeforeCannon = 0;
                let numDups = getNextDartDups();
                displacement = pos.cannonDisplacement;
                let newCannon = duplicate(firstCannon);
                newCannon.reset();
                if (numDups === 2)  {
                   displacement += scale(600);
                }
                newCannon.reposition(lastGraphic.getRightX() + displacement);
                newCannon.centerY = newCannon.initialCenterY;

                let newDart = firstDart.clone(newCannon);
                addGraphicToRenderAndMonitor(newDart);
                newDart.reposition(newCannon.getLeftX() + pos.dartDisplacementX);
                createRowOfDuplicates(newDart, numDups);

                addCannonToList(newCannon);
            }
            break;
        }
        default: {}
    }
    return graphicType;
}

let gameTrack = new Line({
    c: context,
    beginX: trackPos.beginX,
    beginY: trackPos.y,
    endX: trackPos.endX,
    endY: trackPos.y,
    color: colors.lightGreen, //orange
    thickness: dimen.trackThickness, //thickness original: 4
});
graphicsToRender.addToBack(gameTrack);

//Create new Sprite object for ball
let ball = new BallSprite({
    c: context,
    spriteWidth: dimen.ballSpriteWidth,
    spriteHeight: dimen.ballSpriteHeight,
    src: img.ballSprite,
    width: dimen.ballRadius * 2,
    height: dimen.ballRadius * 2,
    centerX: ballPos.centerX,
    centerY: ballPos.centerY,
    ticksPerFrame: sprites.ballTicksPerFrame,
    numColumns: sprites.ballNumColumns,
    lastRowColumns: sprites.ballLastRowColumns,
    numRows: sprites.ballNumRows,
    speed: gameSpeed,
    loop: true,
});
graphicsToRender.addToBack(ball);

let explodedBall = new Pic( {
    c: context,
    src: img.explodedBall,
    width: ball.width,
    height: ball.height,
    centerX: ball.centerX,
    centerY: ball.centerY
});

let tunnel = new Pic({
    c: context,
    src: 'img/tunnel/tunnel5.png',
    width: dimen.tunnelWidth,
    height: dimen.tunnelHeight,
    centerX: tunnelPos.centerX,
    centerY: tunnelPos.centerY,
    speed: gameSpeed
});
graphicsToRender.addToBack(tunnel);
graphicsToRender.addGraphicToMoveBack(tunnel);

//Create new Triangle object according to triangleDetails1
let firstTriangle = new Triangle({
    c: context,
    beginX: triPos.beginX,
    beginY: triPos.beginY,
    width: dimen.triangleWidth,
    height: dimen.triangleHeight,
    color: colors.lightGreen,
    strokeColor: colors.orange,
    strokeWidth: dimen.triangleStroke, //original 3
    speed: gameSpeed,
    spacing: 0,
    graphicType: graphicTypes.deathTriangle
});
addGraphicToRenderAndMonitor(firstTriangle);

let secondTriangle = duplicateForRow(firstTriangle);
secondTriangle.reposition(firstTriangle.endX + pos.secondTriDisplacement, NO_CHANGE);
createRowOfDuplicates(secondTriangle, num.triangleAdditionsSecondRow);

//Create new Rectangle object according to rectangleDetails1
let firstRectangle = new Rectangle({
    c: context,
    width: dimen.rectangleWidth, //original 90
    height: dimen.rectangleHeight, //original 42
    centerX: secondTriangle.endX + pos.firstRecDisplacement,
    centerY: pos.recOnGroundY,
    color: colors.oceanBlue,
    strokeColor: colors.lightGreen,
    strokeWidth: dimen.rectangleStroke, //original 3.5
    speed: gameSpeed,
    flatSpacing: pos.minRectangleSpacing, //original 150
    towerSpacing: pos.rectangleTowerSpacing,
    towerHeightDiff: pos.rectangleTowerHeightDiff,
    graphicType: graphicTypes.rectangle
});
addGraphicToRenderAndMonitor(firstRectangle);

let firstDeathTrap = new Line({
    c: canvas.getContext("2d"),
    beginX: firstRectangle.getRightX(),
    beginY: pos.deathTrapOnGroundY,
    endX: firstRectangle.getRightX() + pos.minRectangleSpacing,
    endY: pos.deathTrapOnGroundY,
    color: colors.orange,
    width: dimen.deathTrapStroke, //thickness
    speed: gameSpeed,
    graphicType: graphicTypes.deathTrap,
    spacing: dimen.rectangleWidth
});
addGraphicToRenderAndMonitor(firstDeathTrap);
createRowOfRecsAndTraps(firstRectangle, firstDeathTrap, num.deathTrapRowAdditions);

let firstCannon = new CannonSprite({
    c: context,
    spriteWidth: dimen.cannonSpriteWidth,
    spriteHeight: dimen.cannonSpriteHeight,
    src: img.cannonSprite,
    width: dimen.cannonWidth,
    height: dimen.cannonHeight,
    centerX: graphicsToMonitor.getLastGraphic().getRightX() + pos.cannonDisplacement, //original: 2900
    centerY: pos.cannonOnGroundY,
    ticksPerFrame: sprites.cannonTicksPerFrame,
    numRows: sprites.cannonNumRows,
    numColumns: sprites.cannonNumColumns,
    lastRowColumns: sprites.cannonLastRowColumns,
    speed: gameSpeed,
    loop: false,
    graphicType: graphicTypes.cannon
});
addCannonToList(firstCannon);

let firstDart = new Dart({
    c: canvas.getContext("2d"),
    beginX: firstCannon.getLeftX() + pos.dartDisplacementX,
    beginY: firstCannon.centerY + pos.dartDisplacementY,
    width: dimen.dartWidth,
    height: dimen.dartHeight,
    color: colors.orange,
    strokeColor: colors.orange,
    strokeWidth: dimen.dartStroke,
    speed: gameSpeed,
    spacing: NO_CHANGE,
    cannon: firstCannon,
    graphicType: graphicTypes.dart
});
firstDart.loadToCannon();
addGraphicToRenderAndMonitor(firstDart);
createRowOfDuplicates(firstDart, num.minDartDups);

width = ((37) * 236/34) * 1.5;
height = ((40) * 162/34) * 1.5;
let cloudExplosion = new Sprite({
    c: canvas.getContext("2d"),
    spriteWidth: 740,
    spriteHeight: 513,
    src: 'img/ufo/explosion1.png',
    width: width,
    height: height,
    centerX: 0,
    centerY: trackPos.y - height/2,
    ticksPerFrame: 6,
    numRows: 3,
    numColumns: 3,
    lastRowColumns: 3,
    speed: gameSpeed,
    loop: false
});














