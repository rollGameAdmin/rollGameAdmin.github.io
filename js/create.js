//original canvas width: 1300
const ballRadius = scale(30); //radius of Circle
let gameSpeed = canvas.width * 6.7/1305; //number of pixels graphics are displaced per anim frame
const initialGameSpeed = gameSpeed;
let colors = {
    darkGrey: '#273336',
    orange: '#F33B1B',
    lightGreen: '#00F69F',
    lightBlue: '#2FEAFF',
    purple: '#CD30E8',
    lightOrange: '#FF9933',
    oceanBlue: '#0090FF'
}


//Create graphics object
let graphics = new Graphics(canvas.getContext("2d")); //holds all graphics rendered in canvas

//reference classes.js for the different classes created below

let lineLength = canvas.width;
let beginLineX = 0; 
let width = scale(5);
let height;
//Create new Line object
let line = new Line({
    c: canvas.getContext("2d"), 
    beginX: 0,
    beginY: canvas.height - width/2, 
    endX: canvas.width, 
    endY: canvas.height - width/2, 
    color: colors.lightGreen, //orange
    width: width, //thickness original: 4
});
let line2 = new Line({
    c: canvas.getContext("2d"), 
    beginX: 0,
    beginY: canvas.height - line.width/2, 
    endX: 0, 
    endY: canvas.height - line.width/2, 
    color: colors.oceanBlue, //orange
    width: line.width, //thickness
});
let line1 = createArray();
line1.push(line);
let lines = createArray();
lines.push(line2);




//Create new Sprite object for ball
let ball = new Sprite({
    c: canvas.getContext("2d"), 
    spriteWidth: 649, 
    spriteHeight: 217, 
    src: 'img/ball/ball_spritesheet6.png', 
    width: ballRadius * 2, 
    height: ballRadius * 2, 
    centerX: line.beginX - scale(300), 
    centerY: line.beginY - ballRadius - line.width/2,
    ticksPerFrame: 2,
    numColumns: 6,
    lastRowColumns: 6,
    numRows: 2,
    speed: gameSpeed,
    loop: true,
    reverse: false
});
let ball1 = createArray();
ball1.push(ball);

let spaceship1 = new Sprite({
    c: canvas.getContext("2d"), 
    spriteWidth: 504, 
    spriteHeight: 328, 
    src: 'img/spaceship/spaceship1.png', 
    width: scale(124), 
    height: scale(25), 
    centerX: line.endX + canvas.width/2, 
    centerY: canvas.height/8,
    ticksPerFrame: 10,
    numColumns: 1,
    lastRowColumns: 1,
    numRows: 3,
    speed: canvas.width * (6.1 + 5)/1305,
    loop: true,
    reverse: false
});
let spaceships = createArray();
spaceships.push(spaceship1);

width = scale(214);
height = scale(65);
let tunnel = new Pic({
    c: canvas.getContext("2d"), 
    src: 'img/tunnel/tunnel5.png', 
    width: width,
    height: height,
    centerX: line.beginX + scale(50),
    centerY: line.beginY - height/2,
    speed: gameSpeed
});
let tunnelRow = createArray();
tunnelRow.push(tunnel);

width = spaceship1.width/2;
height = width;
let shotShip = new Pic({
    c: canvas.getContext("2d"), 
    src: 'img/spaceship/exploded_ship1.png', 
    width: width,
    height: height,
    centerX: 0,
    centerY: spaceship1.centerY,
    speed: spaceship1.speed
});


//Triangle Details to be passed into Triangle object constructor (refer to classes.js)
let beginX = tunnel.getRightX() + scale(400);  //original: + 400
let beginY = line.beginY - line.width/2;
width = Math.floor(scale(40)); //original 40
height = Math.floor(scale(40)); //original 40
//Create new Triangle object according to triangleDetails1
let triangle1 = new Triangle({
    c: canvas.getContext("2d"),
    beginX: beginX,
    beginY: beginY,
    topX: beginX + width / 2, 
    topY: beginY - height,
    endX: beginX + width, 
    endY: beginY, 
    width: width,
    height: height,
    color: colors.lightGreen,
    strokeColor: colors.orange,
    strokeWidth: canvas.width * 3.1/1305, //original 3
    speed: gameSpeed,
    stopForward: line.endX,
    stopFall: line.beginY,
    spacing: 0
});
let triangles1 = createArray();
triangles1.push(triangle1);


height = scale(40)
//Create new Rectangle object according to rectangleDetails1
let rectangle1 = new Rectangle({
    c: canvas.getContext("2d"), 
    width: scale(90), //original 90
    height: height, //original 42
    centerX: triangle1.endX + scale(400), 
    centerY: line.beginY - height / 2,   
    color: colors.oceanBlue, 
    strokeColor: colors.lightGreen,
    strokeWidth: scale(3.5), //original 3.5
    speed: gameSpeed, 
    flatSpacing: scale(160), //original 150
    towerSpacing: scale(165),
    towerHeightDiff: scale(-15),
    stopForward: line.endX,
    stopFall: line.beginY
});

let rectangleRow = createArray();
rectangleRow.push(rectangle1);
let rectangleTrail = createArray();
width = scale(4);
let deathTrap1 = new Line({
    c: canvas.getContext("2d"), 
    beginX: 0,
    beginY: rectangle1.getBottomY() - width/2, 
    endX: 0, 
    endY: rectangle1.getBottomY() - width/2, 
    color: colors.orange,
    width: width, //thickness
    speed: gameSpeed
});
let deathTraps = createArray();
deathTraps.push(deathTrap1);
let deathTrapTrail = [];



//ExplodedBall Details to be passed into Pic object constructor (refer to classes.js)
let explodingBallDetails = {
    c: canvas.getContext("2d"), 
    src: 'img/explode/exploded_orange_ball.png', 
    width: ball.width,
    height: ball.height,
    centerX: ball.centerX,
    centerY: ball.centerY 
}
//Create explodedBall image as new Pic object according to explodingBallDetails
let explodedBall = new Pic(explodingBallDetails);
let exploded = createArray();
exploded.push(explodedBall);

let crownedBallDetails = {
    c: canvas.getContext("2d"), 
    src: 'img/crowned/crowned1.png', 
    width: ball.width,
    height: scale(82.8), //ballRadius * 2 * 1.38
    centerX: ball.centerX,
    centerY: ball.centerY 
}
let crownedBall = new Pic(crownedBallDetails);
let crowned = createArray();
crowned.push(crownedBall);

width = scale(107); //ballRadius * 2 * 1.78
height = scale(48.6); // ballRadius * 2 * .81
let trampo1 = new Sprite({
    c: canvas.getContext("2d"), 
    spriteWidth: 187, 
    spriteHeight: 180, 
    src: 'img/trampoline/trampo_sprite1.png', 
    width: width, 
    height: height, 
    centerX: rectangle1.centerX + scale(1250), //original: 1250
    centerY: line.beginY - height/2 + scale(10),
    ticksPerFrame: 0,
    numColumns: 1,
    lastRowColumns: 1,
    numRows: 2,
    speed: gameSpeed,
    loop: false,
    reverse: false
});
let trampos = createArray();
trampos.push(trampo1);

width = ball.loopRadius*2 + ball.width;
height =  ball.loopRadius*2 + ball.height;
let loop = new Pic({
    c: canvas.getContext("2d"), 
    src: 'img/loop/loop1.png', 
    width: width,
    height: height,
    centerX: 0,
    centerY: ball.centerY + ball.height/2 - height/2,
    speed: gameSpeed
});
let loops = createArray();
loops.push(loop);

//Create new Rectangle object according to rectangleDetails1
width = scale(3000); //original: 3000
height = scale(300); //original: 300
let rectangleWall = new Rectangle({
    c: canvas.getContext("2d"), 
    width: width, 
    height: height,
    centerX: trampo1.getRightX() + width/2 + scale(200),
    centerY: line.beginY - height/2,  
    color: colors.lightGreen, 
    strokeColor: colors.lightGreen,
    speed: gameSpeed, 
    flatSpacing: scale,
});
let rectangleWalls = createArray();
rectangleWalls.push(rectangleWall);


width = scale(112); // ballRadius * 3.12 * 1.2
height = scale(112); // ballRadius * 3.12 * 1.2
let cannon = new Sprite({
    c: canvas.getContext("2d"), 
    spriteWidth: 822, 
    spriteHeight: 657, 
    src: 'img/cannon/cannon_sprite5.png', 
    width: width, 
    height: height, 
    centerX: rectangleWall.getLeftX() + scale(2900), //original: 2900
    centerY: rectangleWall.getTopY() - height/2 + scale(12),
    ticksPerFrame: 2,
    numRows: 4,
    numColumns: 5,
    lastRowColumns: 5,
    speed: gameSpeed,
    loop: false
});
let cannonRow = createArray();
cannonRow.push(cannon);


beginX = cannon.getLeftX() + scale(20);
beginY = cannon.centerY + scale(10); //original: + 10
width = scale(28); //original 28
height = scale(28); //original 28
let dart = new Triangle({
    c: canvas.getContext("2d"),
    beginX: beginX,
    beginY: beginY,
    topX: beginX + width, 
    topY: beginY - height/2,
    endX: beginX + width, 
    endY: beginY + height/2, 
    width: width,
    height: height,
    color: colors.lightGreen,
    strokeColor: colors.orange,
    strokeWidth: canvas.width * 2.9/1305,
    speed: gameSpeed,
    stopForward: line.endX,
    stopFall: line.beginY,
    spacing: -1
});
let dartsToShoot = createArray();
dartsToShoot.push(dart);
let shotDarts = [];

let radius = scale(4);
let enemyAmmo1 = new Circle({
    c: canvas.getContext("2d"), 
    centerX: 0, 
    centerY: 0, 
    radius: radius, 
    color: colors.orange,
    strokeColor: colors.orange,
    strokeWidth: 0,
    speed: 0, 
});

width = (ballRadius * 285/100) * 1.2;
height = (ballRadius * 87/100) * 1.2;
let enemyUfo = new Pic({
    c: canvas.getContext("2d"), 
    src: 'img/ufo/enemy_ufo1.png', 
    width: width,
    height: height,
    centerX: 0,
    centerY: 0,
    speed: canvas.width * (6.1 + 5)/1305
});
let ufos = createArray();
ufos.push(enemyUfo);

width = (enemyUfo.width * 84/285)/1.2;
height = width;
let ufoAmmo1 = new Pic({
    c: canvas.getContext("2d"), 
    src: 'img/ufo/ufo_ammo5.png', 
    width: width,
    height: height,
    centerX: 0,
    centerY: 0,
    speed: enemyUfo.speed
});
let ufoAmmo = createArray();
let deployedAmmo = createArray();
let ufoAmmoTrail = createArray();
ufoAmmo.push(ufoAmmo1);

width = ((ufoAmmo1.width) * 236/34) * 1.5;
height = ((ufoAmmo1.height) * 162/34) * 1.5;
let explosion1 = new Sprite({
    c: canvas.getContext("2d"), 
    spriteWidth: 740, 
    spriteHeight: 513, 
    src: 'img/ufo/explosion1.png', 
    width: width, 
    height: height, 
    centerX: 0,
    centerY: 0,
    ticksPerFrame: 6,
    numRows: 3,
    numColumns: 3,
    lastRowColumns: 3,
    speed: gameSpeed,
    loop: false
});
let explosions = createArray();
explosions.push(explosion1);


width = scale(100);
height = width * 77/155;
let flag = new Pic({
    c: canvas.getContext("2d"), 
    src: 'img/flag/flag1.png', 
    width: width,
    height: height,
    centerX: 0,
    centerY: 0,
    speed: gameSpeed
});
let flags = createArray();
flags.push(flag);




function duplicateForRow(shape) {
    let duplicate;
    duplicate = Object.assign(Object.create(Object.getPrototypeOf(shape)),shape);
    if (shape instanceof Triangle) {
        if (shape.spacing != -1) {
            duplicate.beginX = shape.endX + shape.spacing;
            duplicate.endX = duplicate.beginX + duplicate.width;
            duplicate.topX = duplicate.beginX + duplicate.width/2;
        }
    } else if (shape instanceof Rectangle) {
        duplicate.centerX = shape.centerX + shape.width + shape.flatSpacing;
    } else if (shape instanceof Line) {
        duplicate.beginX = shape.getRightX() + rectangle1.width;
        duplicate.endX = duplicate.beginX + rectangle1.flatSpacing;
    } else if (shape instanceof Pic) {
        duplicate.image = new Image();
        duplicate.image.src = duplicate.src;
        duplicate.image.width = duplicate.width;
        duplicate.image.height = duplicate.height;
    }
    return duplicate;
}

function duplicateForTower(shape, inverted) {
    if (!inverted) {
        let duplicate;
        if (shape instanceof Rectangle) {
            // duplicate = new Rectangle(rectangleDetails1);
            duplicate = Object.assign(Object.create(Object.getPrototypeOf(shape)),shape);
            duplicate.centerX = shape.centerX + shape.width + shape.towerSpacing;
            duplicate.centerY = shape.centerY - shape.height - shape.towerHeightDiff;
        }
        return duplicate;
    } else {
        let duplicate;
        if (shape instanceof Rectangle) {
            duplicate = Object.assign(Object.create(Object.getPrototypeOf(shape)),shape);
            duplicate.centerX = shape.centerX + shape.width + shape.towerSpacing;
            duplicate.centerY = shape.centerY + shape.height + shape.towerHeightDiff;
        }
        return duplicate;
    }
}

function extendDeathTraps(recs, traps, amount) {
    let lastRec = recs[recs.lastIndex()];
    let lastTrap = traps[traps.lastIndex()];
    for (let i = 0; i < amount; i++) {
        recs.push(duplicateForRow(lastRec));
        traps.push(duplicateForRow(lastTrap));
    }
}



//Creates array of adjacent rectangles
function addToRow(row, amount) {
    let lastIndex = row.lastIndex();
    for (let i = lastIndex; i < amount; i++) {
        let copy = duplicateForRow(row[i]);
        row.push(copy); 
    }  
}

function addToTower(row, amount, inverted) {
    if (!inverted) {
        for (let i = 0; i < amount; i++) {
            let copy = duplicateForTower(row[i], inverted);
            row.push(copy);
        }
    } else {
        for (let i = 2; i < amount - 1; i++) {
            let copy = duplicateForTower(row[i], inverted);
            row.push(copy);
        }
    }
}

function repositionDarts(darts) {
    for (let i = 0; i < darts.length; i++) {
        let dart = darts[i];
        dart.beginX = cannon.getLeftX() + scale(20);
        dart.beginY = cannon.centerY + scale(10);  
        dart.topX = dart.beginX + dart.width;
        dart.topY = dart.beginY - dart.height/2;
        dart.endX = dart.beginX + dart.width;
        dart.beginY + dart.height/2;       
    } 
}

function repositionTriangle(triangle, beginX, beginY) {
    if (beginX != -1) {
        triangle.beginX = beginX;
        triangle.topX = triangle.beginX + triangle.width/2;
        triangle.endX = triangle.beginX + triangle.width;
    }
    if (beginY != -1) {
        triangle.beginY = beginY;
        triangle.topY = triangle.beginY - triangle.height;
        triangle.endY = triangle.beginY;
    }
}



//triangle row 2
let lastTriRow = triangles1[triangles1.length - 1];
let triangle2 = duplicateForRow(lastTriRow);
repositionTriangle(triangle2, lastTriRow.endX + scale(250), -1);
let triangles2 = createArray();
triangles2.push(triangle2);
addToRow(triangles2, 1);
//---//

//rectangle1 reposition
rectangle1.centerX = triangles2[triangles2.length-1].getRightX() + scale(400);
//--//

//array of triangle rows
let triangles = createArray();
triangles.push(triangles1);
triangles.push(triangles2);
let triangleTrail = [];
//--//

//add 3 more darts to dartsToShoot
addToRow(dartsToShoot, 3);
//---//

/*--Create recs/deathtrap 1 */

    // add to rectangleRow
    addToRow(rectangleRow, 1);
    //Reposition deathtrap
    deathTrap1.beginX = rectangleRow[0].getRightX();
    deathTrap1.endX = deathTrap1.beginX + rectangleRow[0].flatSpacing;
    //Extend death trap once
    extendDeathTraps(rectangleRow, deathTraps, 1);

//------//

/*--Create tris for wall*/
let triangle3 = duplicateForRow(triangle1);
repositionTriangle(triangle3,
                   rectangleWall.getLeftX() + scale(500),
                   rectangleWall.getTopY() - triangle3.strokeWidth);
let triangles3 = createArray();
triangles3.push(triangle3);
addToRow(triangles3, 2);
triangles.push(triangles3);
//---/

/*--Create recs/deathtrap2 for wall */
    let rectangle2 = duplicateForRow(rectangle1);
    rectangle2.centerX = triangles3[triangles3.lastIndex()].getRightX() + scale(300);
    rectangle2.centerY = rectangleWall.getTopY() - rectangle2.height/2;
    let rectangleRow2 = createArray();
    rectangleRow2.push(rectangle2);
    addToRow(rectangleRow2, 1);
    let deathTrap2 = duplicateForRow(deathTrap1);
    deathTrap2.width = scale(5);
    deathTrap2.beginX = rectangle2.getRightX();
    deathTrap2.endX = deathTrap2.beginX + rectangle2.flatSpacing;
    deathTrap2.beginY = rectangle2.getBottomY() - scale(4);
    deathTrap2.endY = rectangle2.getBottomY() - scale(4);
    deathTraps.push(deathTrap2);
//----//


let triangle4 = duplicateForRow(triangle1);
repositionTriangle(triangle4, rectangleWall.getRightX() + scale(300), canvas.height + triangle4.height + scale(2));
triangle4.spacing = scale(280);
let triangleTraps = createArray();
let triTrapsTrail = createArray();
let triangles4 = createArray();
triangles4.push(triangle4);
addToRow(triangles4, 2);
for (let i = 0; i < triangles4.length; i++) {
    let trapRow = createArray();
    trapRow.push(triangles4[i])
    if (i == 1) {
        trapRow[0].spacing = 0;
        addToRow(trapRow, 1);
    } else if (i == 2) {
        trapRow[0].spacing = 0;
        addToRow(trapRow, 2);
    }
    triangleTraps.push(trapRow);
}

//position loop according to last triangle
line2.beginX = triangles4[triangles4.lastIndex()].getRightX() + scale(400);
loop.centerX = line2.beginX + scale(200) + loop.width/2;
line2.endX = loop.getRightX() + scale(200);

let rectangleRow3 = createArray();
let rectangle3 = duplicateForRow(rectangle1);
rectangle3.centerX = line2.endX + scale(500);
rectangleRow3.push(rectangle3);
addToTower(rectangleRow3, 3, false);
let lastRec3 = rectangleRow3[rectangleRow3.lastIndex()];
lastRec3.centerX = lastRec3.getLeftX() + scale(3000/2);
lastRec3.width = scale(3000);
let line3 = duplicateForRow(line2);
line3.color = colors.orange;
line3.beginX = rectangle3.getRightX();
line3.endX = lastRec3.getRightX();
lines.push(line3);
flag.centerY = lastRec3.getTopY() - flag.height/2 - scale(10);
flag.centerX = lastRec3.getLeftX() + scale(1400);
flag.initialCenterX = flag.centerX;

spaceship2 = duplicateForRow(spaceship1);
spaceship2.centerY = spaceship1.getBottomY() + spaceship1.height/2 + scale(10);
spaceship2.centerX = spaceship2.centerX + scale(60);
spaceship2.speed = spaceship1.speed - scale(1);
spaceships.push(spaceship2);

enemyShip1 = duplicateForRow(spaceship1);
enemyShip1.image = new Image();
enemyShip1.image.src = 'img/spaceship/enemy_ship1.png';
enemyShip1.centerX = spaceship1.getRightX() + enemyShip1.width/2 + scale(1000);
spaceships.push(enemyShip1);

enemyAmmo1.centerX = enemyShip1.getLeftX() + scale(20);
enemyAmmo1.centerY = enemyShip1.getBottomY() - enemyAmmo1.radius - 1;
enemyAmmo1.speed = enemyShip1.speed;
let enemyAmmo = createArray();
enemyAmmo.push(enemyAmmo1);
addToRow(enemyAmmo, 3);
let enemyAmmoShot = createArray();

enemyUfo.centerX = line.endX + enemyUfo.width + scale(900);
enemyUfo.centerY = lastRec3.getTopY() - scale(300);
ufoAmmo1.centerX = enemyUfo.centerX;
ufoAmmo1.centerY = enemyUfo.centerY;
ufoAmmo1.fallDeceleration = scale(6);
addToRow(ufoAmmo,2);



let bounceSound = new sound("sounds/bounce4.mp3");
let recLandSound = new sound("sounds/rec-land1.mp3");
let goodLuck = new sound("sounds/goodluck1.mp3");
let explode = new sound("sounds/explode1.mp3");
let bigBounce = new sound("sounds/big-bounce1.mp3");
let wallLand = new sound("sounds/wall-land2.mp3");
let falling = new sound("sounds/fall1.mp3");
let loopCelebration = new sound("sounds/celebrate3.mp3");
let loopSound = new sound("sounds/loop1.mp3");
let celebration = new sound("sounds/celebrate1.mp3");
let detonation = new sound("sounds/explosion1.mp3");

graphics.pushMultToBack([
    tunnelRow,
    triangles,
    triangleTrail,
    deathTraps,
    deathTrapTrail,
    rectangleRow,
    rectangleTrail,
    rectangleRow2,
    rectangleRow3,
    dartsToShoot,
    cannonRow,
    trampos,
    rectangleWalls,
    triangleTraps,
    triTrapsTrail,
    lines,
    loops,
    flags,
    deployedAmmo,
    ufoAmmoTrail,
    explosions
]);

graphics.pushMultToRender([
    ball1,
    line1,
    tunnelRow,
    triangles,
    triangleTraps,
    triangleTrail,
    deathTraps,
    deathTrapTrail,
    ufoAmmo,
    ufos,
    deployedAmmo,
    ufoAmmoTrail,
    rectangleRow,
    rectangleTrail,
    rectangleRow2,
    dartsToShoot,
    cannonRow,
    rectangleWalls,
    trampos,
    lines,
    triangleTraps,
    triTrapsTrail,
    loops,
    enemyAmmo,
    enemyAmmoShot,
    spaceships,
    rectangleRow3,
    flags
]);

graphics.pushMultToDown([
    ball1,
    triangles,
    triangleTraps,
    triangleTrail,
    deathTraps,
    deathTrapTrail,
    rectangleRow,
    rectangleTrail,
    rectangleRow2,
    dartsToShoot,
    cannonRow,
    rectangleWalls
]);

// document.getElementById('screen').style.display = 'none';
