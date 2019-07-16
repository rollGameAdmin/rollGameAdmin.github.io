function main() {

    let backMusic = document.getElementById('background');

    let global = {
        startTime: 0,
        time: 0,
        elapsed: 0,
        bouncing: false,
        rotating: false,
        deathLand: false,
        dartNum: 1,
        dartsIndex: 0,
        rectangleTopY: firstRectangle.centerY - firstRectangle.height/2,
        tunnelTopY: tunnel.centerY - tunnel.height/2,
        wallTopY: rectangleWall.centerY - rectangleWall.height/2,
        rectangleLand: false,
        tunnelLand: false,
        on: false,
        onTunnel: false,
        hitRecOnGround: false,
        hitTrampoOnGround: false,
        passed: false,
        passedWall: false,
        passedTunnel: false,
        checkTunnel: false,
        backAll: true,
        trampoLand: false,
        tramped: false,
        repeatAnim: true,
        passedFirstFrame: false,
        wallLand: false,
        down: false,
        addedCannon: false,
        addedTrampo: false,
        addedWall: false,
        addedDarts: false,
        onWall: false,
        hitWall: false,
        shotDarts: false,
        cannonRepo: false,
        hitTri: false,
        passedTri: false,
        closeToGround: false,
        bounceSoundPlayed: false,
        playBounceSound: true,
        changedCanBounce: false,
        toggleMusicOff: true,
        toggleSoundsOff: true,
        soundsOn: true,
        canFall: true,
        onWall: false,
        shipShowing: false,
        shipAnimated: false,
        start: false,
        passedTriTrap: false,
        revealed: false,
        loopedIt: false,
        changeSpeed: true,
        changeSpeedLast: false,
        celebrate: false,
        bentKnees: false,
        replacedCharacter: false,
        calledFall: false,
        gameEnd: false,
        enemyShot: false,
        shotShip: false,
        removedShotShip: false,
        inBetweenRecs: false,
        showUfo: false,
        deployedFirst: false,
        deployed: false,
        addedDeployed: false,
        score: 0,
        canBounce: false,
        movingDown: false,
        keyUp: false,
        passedTunnel: false,
        changedLine2: false,
        triggerBounce: true
    }


    let renderReq = 0;
    function renderGraphics() {
        renderReq = window.requestAnimationFrame(renderGraphics);
        graphicsToRender.render();
    }

    
    renderGraphics(); //renders all graphicsToRender it holds

    let rotateReq = 0;
    function rotateBall() {
        rotateReq = window.requestAnimationFrame(rotateBall);
        if (global.rotating) {
            ball.update();
        } else {
            window.cancelAnimationFrame(rotateReq);
        }
    }

    function shootFirstDart() {
        dartsToShoot[0].speed = canvas.width * (6.7+4)/1305;
    }

    let shootDartsReq = 0;
    function shootDarts() {
        shootDartsReq = window.requestAnimationFrame(shootDarts);
        if ((dartsToShoot[global.dartNum-1].endX <= firstCannon.getLeftX()- scale(320)) && global.dartNum < dartsToShoot.length) {
            dartsToShoot[global.dartNum].speed = canvas.width * (6.7+4)/1305;
            global.dartNum++;
        } else if (global.dartNum == dartsToShoot.length) {
            window.cancelAnimationFrame(shootDartsReq);
        }
    }

    let storeCannonReq = 0;
    function storeCannon() {
        storeCannonReq = window.requestAnimationFrame(storeCannon);
        if (firstCannon.frameIndex < firstCannon.numFrames - 1) {
            firstCannon.update();
        } else if (firstCannon.centerY <= line.beginY + firstCannon.width) {
            firstCannon.store();
        } else {
            window.cancelAnimationFrame(storeCannonReq);
        }
    }

    let animShipReq = 0;
    function animateShip() {
        animShipReq = window.requestAnimationFrame(animateShip);
        if (global.shipShowing) {
            spaceship1.update();
        } else {
            window.cancelAnimationFrame(animShipReq);
        }
    }

    let shootShipReq = 0;
    function shootShip() {
        shootShipReq = window.requestAnimationFrame(shootShip);
        if (enemyAmmo.length > 0 && 
            enemyAmmoShot[enemyAmmoShot.lastIndex()].getRightX() < enemyShip1.getLeftX() - scale(20)) {
            enemyAmmo[0].speed = canvas.width * (11.1 + 6)/1305;
            enemyAmmoShot.push(enemyAmmo.shift());
        }
        if (enemyAmmoShot[0].getLeftX() < spaceship1.getRightX() && !global.shotShip) {
            spaceships.shift();
            spaceships.unshift(shotShip);
            global.shotShip = true;
        }
        if (enemyShip1.getRightX() < scale(-10) && !global.removedShotShip) {
            spaceships.shift();
            global.removedShotShip = true;
        }
    }
    
    let showShipsReq = 0;
    function showShips() {
        showShipsReq = window.requestAnimationFrame(showShips);
        if (ball.getRightX() < rectangleWall.getLeftX() - scale(500) ||
            ball.getLeftX() > rectangleWall.getRightX() + scale(200)) {
            if (spaceship1.getRightX() > scale(-1000) && !global.shotShip) {
                spaceship1.back(-1);
                shotShip.centerX = spaceship1.centerX;
            } else {
                spaceship1.centerX = canvas.width + scale(1000);
            }
            if (spaceship2.getRightX() > scale(-1000)) {
                spaceship2.back(-1);
            } else {
                spaceship2.centerX = canvas.width + scale(1000);
            }
            if (ball.getLeftX() > rectangleWall.getRightX() + scale(200)) {
                if (enemyShip1.getRightX() > scale(-1000)) {
                    enemyShip1.back(-1);
                    for (let i = 0; i < enemyAmmo.length; i++) {
                        enemyAmmo[i].back(-1);
                    }
                    for (let i = 0; i < enemyAmmoShot.length; i++) {
                        enemyAmmoShot[i].back(-1);
                    }
                } else {
                    enemyShip1.centerX = canvas.width + scale(1000);
                }
                if (spaceship1.getRightX() < canvas.width
                    && !global.enemyShot) {
                    enemyAmmo1.speed =  canvas.width * (11.1 + 6)/1305;
                    enemyAmmoShot.push(enemyAmmo.shift());
                    shootShip();
                    global.enemyShot = true;
                }
            }
        } else if (enemyShip1.getRightX() > scale(-100) && enemyShip1.getLeftX() < canvas.width) {
            spaceship1.back(-1);
            spaceship2.back(-1);
            enemyShip1.back(-1);
        } else {
            spaceship1.centerX = canvas.width + scale(1000);
            spaceship2.centerX = canvas.width + scale(1000);
        }  
    }

    function timer() {
        global.time = Date.now() - global.startTime;
        global.elapsed = Math.floor(global.time / 100) / 10;
    }

    let updateScoreReq = 0;
    let scoreCount = document.getElementById('score-counter');
    function updateScore() {
        updateScoreReq = window.requestAnimationFrame(updateScore);
        let newScore = global.elapsed * 100 | 0;
        global.score = newScore;
        scoreCount.innerHTML = '' + newScore;
    }

    let moveDownReq = 0;
    function moveDownAll() {
        moveDownReq = window.requestAnimationFrame(moveDownAll);
        if (rectangleWall.getTopY() < line.beginY - scale(150)) {
            graphicsToRender.moveGraphicsDown(scale(7));
            ball.initialCenterY = ball.centerY;
        } else {
            window.cancelAnimationFrame(moveDownReq);
            explodedBall.centerY = ball.initialCenterY;
            global.rectangleTopY = rectangleRow[0].getTopY();
            global.wallLand = false;
            global.canBounce = true;
            global.movingDown = false;
        }
    }

    let revealTrapReq = 0;
    function revealTrap() {
        revealTrapReq = window.requestAnimationFrame(revealTrap);
        let trapRow = triangleTraps[0];
        if (trapRow[0].getBottomY() > canvas.height) {
            trapRow.reveal(scale(10));
        } else {
            window.cancelAnimationFrame(revealTrapReq);
            for (let i = 0; i < trapRow.length; i++) {
                repositionTriangle(trapRow[i], -1, line.beginY);
            }
            global.revealed = false;
        }
    }

    function trampoJump() {
            global.rotating = false;
            ball.bounceSpeedY = scale(17); //original 16
            bounce();
            if (global.soundsOn) {
                bigBounce.play();
            }
    }

    let loopBallReq = 0;
    function loopBall() {
        loopBallReq = window.requestAnimationFrame(loopBall);
        if (ball.angle < ball.initialAngle + Math.PI * 2) {
            ball.loopIt();
        } else {
            window.cancelAnimationFrame(loopBallReq);
            ball.centerY = ball.initialCenterY;
            global.backAll = true;
            global.changeSpeedLast = true;
        }
    }

    let showUfosReq = 0;
    function showUfos() {
        showUfosReq = window.requestAnimationFrame(showUfos);
        if (enemyUfo.getRightX() > scale(-100)) {
            enemyUfo.back(enemyUfo.speed);
            for (let i = 0; i < ufoAmmo.length; i++) {
                ufoAmmo[i].back(enemyUfo.speed);
            }
        }
    }

    let deployAmmoReq = 0;
    function deployUfoAmmo() {
        deployAmmoReq = window.requestAnimationFrame(deployUfoAmmo);
        if (ufoAmmo[0].getBottomY() < lastRec3.getTopY()) {
            ufoAmmo[0].fall();
        } else {
            window.cancelAnimationFrame(deployAmmoReq);
            ufoAmmo[0].centerY = lastRec3.getTopY();
            ufoAmmo[0].height += scale(60);
            ufoAmmo[0].width = ufoAmmo[0].height;
            ufoAmmo[0].image.width = ufoAmmo[0].height;
            ufoAmmo[0].image.height = ufoAmmo[0].height;
            ufoAmmo[0].centerY = lastRec3.getTopY();
            deployedAmmo.push(ufoAmmo.shift());
            global.deployed = false;
        }
    }

    let runExplosionReq = 0;
    function runExplosion() {
        runExplosionReq = window.requestAnimationFrame(runExplosion);
        explosion1.update();
    }

    let celebrateReq = 0;
    function celebrate() {
        celebrateReq = window.requestAnimationFrame(celebrate);
        if (!global.celebrate) {
            ball.bounceSpeedY = ball.initialBounceSpeedY;
            global.celebrate = true;
            bounce();
        }
    }


    let manageRowsReq = 0;
    function manageRows(helloMsg) {
        manageRowsReq = window.requestAnimationFrame(manageRows);

        /*-- manage recs and death traps --*/
        if (rectangleRow.length > 0 &&
            (global.rectangleLand || rectangleRow[0].centerX == line.beginX)) {
            if (global.soundsOn) {
                recLandSound.play();
            }
            let removed = rectangleRow.splice(0,1);
            rectangleTrail.push(removed[0]);
            if (deathTraps.length > 0) {
                removed = deathTraps.splice(0,1);
                deathTrapTrail.push(removed[0]);
            }
        }

        //delete from trail
        if (rectangleTrail.length > 0 &&
            rectangleTrail[0].getRightX() < scale(-100)) {
            rectangleTrail.splice(0,1);
        }
        if (deathTrapTrail.length > 0 &&
            deathTrapTrail[0].getRightX() < scale(-100)) {
                deathTrapTrail.splice(0,1);
        }

        /*---move recs in recRow2 to rectangleRow---*/

        if (rectangleRow.length == 0 && rectangleTrail.length == 0) {
            if (rectangleRow != rectangleRow2) {
                rectangleRow = rectangleRow2;
            }
            if (global.passedWall) {
                rectangleRow = rectangleRow3;
            }
        }
        /*-----*/

        /*--manage tris --*/
        if (global.passedTri && triangles.length > 0) {
            let removed = triangles.splice(0,1);
            triangleTrail.push(removed[0]);
        }

        if (triangleTrail.length > 0) {
            let row = triangleTrail[0];
            if (row[row.length-1].getRightX() < scale(-100)) {
                triangleTrail.splice(0,1);
            }
        }
        /*----*/

        /* manage tunnel */
        if (tunnelRow.length > 0) {
            if (tunnelRow[0].getRightX() < scale(-100)) {
                tunnelRow.splice(0, 1);
            }
        }
        /*----*/

        /* manage tri traps */
        if (global.passedTriTrap && triangleTraps.length > 0) {
            triTrapsTrail.push(triangleTraps.shift());
        }
        if (triTrapsTrail.length > 0) {
            let trapTrail = triTrapsTrail[0];
            if (trapTrail[trapTrail.lastIndex()].getRightX() < scale(-100)) {
                triTrapsTrail.splice(0,1);
            }
        }
        /*---*/

        /* manage firstCannon and darts */
        if (firstCannon.getRightX() < scale(-100)) {
            graphicsToRender.remove(cannonRow);
        }
    
        if (dartsToShoot.length > 0 &&
            dartsToShoot[dartsToShoot.length - 1].endX < scale(-100)) {
            graphicsToRender.remove(dartsToShoot);
        }
        /*---*/

        /*manage trampo*/
        if (trampo1.getRightX() < scale(-100)) {
            graphicsToRender.remove(trampos);
        }
        /*---*/

        /*manage rec walls*/
        if (rectangleWall.getRightX() < scale(-100)) {
            graphicsToRender.remove(rectangleWalls);
        }
        /*---*/
    }


    let trackLandFlagsReq = 0;
    function trackLandFlags() {
        trackLandFlagsReq = window.requestAnimationFrame(trackLandFlags);
        /*track rectangles*/
        if (rectangleRow.length > 0) {
            let rectangle = rectangleRow[0];

            global.rectangleLand = ball.landedOnGraphic(rectangle, global.bouncing);

            global.hitRecOnGround = ball.hitOnGround(rectangle);

            if (global.hitRecOnGround) {
                endGame(-1, -1);
            }          
        } else if (rectangleTrail.length > 0) {
            let rectangle = rectangleTrail[0];
            global.rectangleLand = ball.landedOnGraphic(rectangle, global.bouncing);
        }

        /*track tunnel*/
        if (tunnelRow.length > 0) {
            global.tunnelLand = ball.landedOnTunnel(tunnelRow[0], global.bouncing);
        }

        /*track triangles*/
        if (triangles.length > 0) {
            let triRow = triangles[0];
            global.hitTri = ball.deathTri(triRow);
        }

        /*manage firstCannon shooting*/
        if (Math.abs((firstCannon.getLeftX()) - (ball.getRightX()) <= scale(2800)) &&
            !global.shotDarts) {
            shootFirstDart();
            shootDarts();
            shotDarts = true;
        }

        /*store firstCannon*/
        if (Math.abs((firstCannon.getLeftX()) - (ball.getRightX()) <= scale(400)) && !stored) {
            storeCannon();
            stored = true;
        }

        /*Check if ball has hit a firstDart*/
        if (dartsToShoot.length > 0) {
            let dart = dartsToShoot[global.dartsIndex];
            if (dart.beginX <= ball.getRightX() &&
                dart.endX >= ball.getLeftX() &&
                ball.centerY >= dart.topY) {
                    endGame(-1, -1);
                }
            }

        /*Update current firstDart being checked*/
        if (ball.getLeftX() >= dartsToShoot[global.dartsIndex].endX && global.dartsIndex < dartsToShoot.length - 1) {
            global.dartsIndex++;
        }

        /*Manage triangle hit or trampo on ground hit*/
        global.hitTrampoOnGround = ball.hitOnGround(trampo1);
        if (global.hitTrampoOnGround || global.hitTri) {
            let triRow = triangles[0];
            // triRow.changeColor(colors.oceanBlue);
            if (global.hitTri && ball.centerX > triRow[triRow.lastIndex()].getRightX()) {
                endGame(triRow[triRow.lastIndex()].getRightX(), -1);
            } else {
                endGame(-1, -1);
            }
        }

        /*manage trampo bounce and wall landing*/
        global.trampoLand = ball.landedOnGraphic(trampo1, global.bouncing);
        if (global.trampoLand && !global.tramped) {
            window.cancelAnimationFrame(bounceReq);
            trampo1.update();
            trampoJump();
            global.tramped = true;
        }
        if (!global.onWall) {
            global.wallLand = ball.landedOnGraphic(rectangleWall, global.bouncing);
            if (global.wallLand) {
                if (global.soundsOn) {
                    wallLand.play();
                }
                global.canBounce = false;
                global.onWall = true;
                global.movingDown = true;
                moveDownAll();
            }
        }   
        
    }

    let trackPassedFlagsReq = 0;
    function trackPassedFlags() {
        trackPassedFlagsReq = window.requestAnimationFrame(trackPassedFlags);
        if (rectangleTrail.length > 0 || rectangleRow.length > 0) {
            let bRectangle;
            let fRectangle;
            if (rectangleTrail.length > 0 && rectangleRow.length > 0) {
                global.inBetweenRecs = true;
            } else {
                global.inBetweenRecs = false;
            }
            if (rectangleTrail.length > 0) {
                let lastIndex = rectangleTrail.length - 1;
                bRectangle = rectangleTrail[lastIndex];
                bRectangle.changeColor(colors.lightGreen);
                if (rectangleRow.length > 0) {
                    fRectangle = rectangleRow[0];
                }
            } else if (rectangleRow.length > 0) {
                bRectangle = rectangleRow[0];
                fRectangle = rectangleRow[1];
            }

            if (rectangleTrail.length > 0) {
                global.on = ball.stillOnGraphic(bRectangle);
            }
 
            if (rectangleRow.length > 0) {
                if ((rectangleTrail.length > 0 && rectangleRow.length > 0) ||
                    (ball.getLeftX() > rectangleRow[0].getLeftX()))   {
                    global.deathLand = ball.centerY >= ball.initialCenterY;
                }
            }

            if (triangles.length > 0) {
                let firstRow = triangles[0];
                global.passedTri = ball.getLeftX() > firstRow[firstRow.length - 1].getRightX();
            }

            if (global.on) {
                global.passed = ball.passed(bRectangle);
            }

            if (global.deathLand) {
                endGame(-1, ball.initialCenterY + ballRadius);         
            }

            global.hitWall = ball.hitOnGround(rectangleWall);
            if (global.hitWall) {
                endGame(-1,-1);
            }

        } else {
            global.passedWall = ball.passed(rectangleWall);
            global.onWall = ball.stillOnGraphic(rectangleWall);
            if (global.passedWall) {
                ball.initialCenterY = line.beginY - ball.height/2 - line.width/2;
            }
            if (global.onWall) {
                if (global.passedWall && global.canFall) {
                    global.canFall = false;
                    if (!global.bouncing) {
                        fall();
                    }
                }
            }

            if (tunnelRow.length > 0) {
                global.onTunnel = ball.stillOnGraphic(tunnelRow[0]);
                if (global.onTunnel) {
                    global.passed = ball.passed(tunnelRow[0]);
                }
            }    
        }

        /*Manage sneaky little tri traps*/
        if (triangleTraps.length > 0) {
            let firstTraps = triangleTraps[0];
            global.passedTriTrap = ball.getLeftX() > firstTraps[firstTraps.lastIndex()].getRightX();

            if (Math.abs(ball.getRightX() - firstTraps[0].getLeftX()) < scale(250)) {
                if (!global.revealed) {
                    global.revealed = true;
                    revealTrap();
                }
            }

            global.hitTrap = ball.deathTri(firstTraps);
            if (global.hitTrap) {
                endGame(-1, -1);
            }
        }
        //----//

        /*Check if ball is inside tunnel to disable bounce*/
        if (tunnelRow.length > 0) {
            global.inTunnel = ball.throughTunnel(tunnelRow[0]);
            if (global.inTunnel) {
                global.canBounce = false;
            } else {
                global.passedTunnel = true;
            }
        }
        //---//
        if (ball.getLeftX() < line2.endX + scale(100)) {
            if (ball.centerX >= line2.beginX - scale(300) && ball.getRightX() <= line2.endX) {
                global.canBounce = false;
            }
        }
        if (ball.centerX >= line2.beginX) {
            if (global.changeSpeed) {
                gameSpeed = canvas.width * (6.1 + 9)/1305;
                ball.ticksPerFrame = 1;
                global.changeSpeed = false;
            }
            if (ball.centerX >= loop.centerX - scale(4)) {
                if (!global.loopedIt) {
                    ball.axisX =  ball.centerX - (Math.cos(ball.initialAngle) * ball.loopRadius);
                    ball.axisY =  ball.centerY + (Math.sin(ball.initialAngle) * ball.loopRadius);
                    global.backAll = false;
                    if (global.soundsOn) {
                        loopSound.play();
                    }
                    loopBall();
                    global.loopedIt = true;
                }
            }
            if (ball.centerX >= line2.endX) {
                if (global.changeSpeedLast) {
                    gameSpeed = initialGameSpeed;
                    global.changeSpeedLast = false;
                    ball.ticksPerFrame = 2;
                    global.canBounce = true;
                }
            }
            if (ball.getLeftX() >= flag.getRightX() + scale(100)) {
                global.backAll = false;
                window.cancelAnimationFrame(rotateReq);
                window.cancelAnimationFrame(manageRowsReq);
                window.cancelAnimationFrame(trackPassedFlagsReq);
                window.cancelAnimationFrame(trackLandFlagsReq);
                window.cancelAnimationFrame(updateScoreReq);
                window.cancelAnimationFrame(bounceReq);
                global.rectangleLand = false;
                global.wallLand = false;
                global.tunnelLand = false;
                crownedBall.centerY = ball.centerY;
                graphicsToRender.spliceAdd(0, 1, crowned);
                ball = crownedBall;
                crownedBall.initialCenterY = rectangleTrail[rectangleTrail.lastIndex()].getTopY() - crownedBall.height/2;
                global.playBounceSound = false;
                if (global.soundsOn) {
                    celebration.play();
                }
                ball.initialBounceSpeedY = scale(7);
                celebrate();
                document.getElementById('score').innerHTML = 'Conquered! Nice Job! <br> Score: ' + global.score;
                document.getElementById('screen').style.display = 'block';
            }
        }

        global.shipShowing = spaceship1.getLeftX() < canvas.width &&
                            spaceship1.getRightX() > 0;
        if (!global.shipAnimated && global.shipShowing) {
            animateShip();
            global.shipAnimated = true;
        }

        //deploy Ufo Ammo after showing Ufo
            if (ball.getRightX() > lastRec3.getLeftX() - scale(800) && !global.showUfo) {
                showUfos();
                global.showUfo = true;
            }
            if (enemyUfo.getLeftX() < canvas.width + scale(500) &&
                !global.deployedFirst) {
                deployUfoAmmo();
                global.deployedFirst = true;
            } else if (deployedAmmo.length == 0 && ufoAmmo.length > 1 &&
                    ufoAmmo[0].getLeftX() > ufoAmmo[1].getRightX() + scale(150) &&
                    !global.deployed) {
                deployUfoAmmo();
                global.deployed = true;
            } else if (ufoAmmo.length > 0 && deployedAmmo.length > 0 &&
                        deployedAmmo[deployedAmmo.lastIndex()].getLeftX() > ufoAmmo[0].getRightX() + scale(150) &&
                        !global.deployed) {
                deployUfoAmmo();
                global.deployed = true;
            }

            let hitUfoAmmo = false;
            if (deployedAmmo.length > 0) {
                hitUfoAmmo = ball.hitAmmo(deployedAmmo[deployedAmmo.lastIndex()]);
            }
            if (hitUfoAmmo) {
                explosion1.centerX = deployedAmmo[deployedAmmo.lastIndex()].centerX;
                explosion1.centerY = lastRec3.getTopY() - explosion1.height/2;
                graphicsToRender.addToBack(explosions);
                deployedAmmo.pop();
                detonation.play();
                runExplosion();
                global.soundsOn = false;
                endGame(-1,-1);
                graphicsToRender.remove(exploded);
            }

            if (deployedAmmo.length > 0) {
                if (ball.getLeftX() > deployedAmmo[deployedAmmo.lastIndex()].getRightX()) {
                    ufoAmmoTrail.push(deployedAmmo.pop());
                }
            }
        //
    }

    let beginGameReq = 0;
    function beginGame() {
        beginGameReq = window.requestAnimationFrame(beginGame);
        if (ball.getLeftX() < tunnel.getRightX() + scale(100)) {
            ball.forward();
        } else {
            window.cancelAnimationFrame(beginGameReq);
            explodedBall.centerX = ball.centerX;
            explodedBall.centerY = ball.centerY;
            crownedBall.centerX = ball.centerX - scale(3);
            crownedBall.centerY = ball.centerY - scale(13);
            // if (global.soundsOn) {
            //     goodLuck.play();
            // }
            begin();
            showShips();
            trackPassedFlags();
            trackLandFlags();
            manageRows();
            global.canBounce = true;
            shot = true;
        }
    }

    let beginReq = 0;
    let stored = false, shot = false;
    function begin() {
        beginReq = window.requestAnimationFrame(begin);

        if (global.backAll) {  
            graphicsToRender.backAll(gameSpeed);
        }

        if (global.passed) {
            if (!global.bouncing && global.canFall && (global.on || global.onTunnel)) {
                global.canFall = false;
                fall();
                // falling.play();
            }
        }
    }

    let bounceReq = 0;
    function bounce() {
        bounceReq = window.requestAnimationFrame(bounce);
        global.closeToGround = (Math.abs(ball.centerY - ball.initialCenterY) < scale(10)) && ball.bounceSpeedY < 0;
        if (!global.rectangleLand && !global.tunnelLand
            && !global.wallLand && !global.closeToGround) {
            global.bouncing = true;
            ball.bounce();
            explodedBall.centerY = ball.centerY;
            global.rotating = false; 
            if (!global.bounceSoundPlayed && global.playBounceSound) {
                if (global.soundsOn) {
                    bounceSound.play();
                }
                global.bounceSoundPlayed = true;
            }
        }
        else if (global.rectangleLand || global.tunnelLand
                || global.wallLand) {
            if (global.rectangleLand) {
                ball.centerY = rectangleTrail[rectangleTrail.lastIndex()].getTopY() - ballRadius; 
            } else if (global.tunnelLand) {
                ball.centerY = global.tunnelTopY - ballRadius;
            } else {
                ball.centerY = rectangleWall.getTopY()- ballRadius;
                ball.initialCenterY = ball.centerY;
            }       
            window.cancelAnimationFrame(bounceReq);
            explodedBall.centerY = ball.centerY;
            global.bounceSoundPlayed = false;
            global.bouncing = false;
            global.rotating = true;
            rotateBall();
        }
        else {
            ball.centerY = ball.initialCenterY; 
            explodedBall.centerY = ball.centerY;       
            window.cancelAnimationFrame(bounceReq);
            global.bounceSoundPlayed = false;
            global.bouncing = false;
            if (!global.celebrate) {
                global.rotating = true;
                rotateBall();
            } else {
                global.celebrate = false;
            }
        }
    }

    let fallReq = 0;
    function fall() {
        fallReq = window.requestAnimationFrame(fall);
        if ((!global.onWall || global.passedWall) &&
            ball.getBottomY() < line.beginY - ball.height/2 - line.width/2) {
            ball.fall();
        } else if (ball.getBottomY() < rectangleWall.getTopY() - ball.height/2) {
            ball.fall();
        } else if (global.inBetweenRecs) {
            ball.fall();
        } else {
            window.cancelAnimationFrame(fallReq);
            if (!global.onWall || global.passedWall) {
                ball.centerY = line.beginY - ball.height/2 - line.width/2;
            } else {
                ball.centerY = rectangleWall.getTopY() - ball.height/2;
            }
            ball.fallSpeedY = 0;
            ball.initialCenterY = ball.centerY;
            global.canFall = true;
            explodedBall.centerY = ball.centerY;
            global.passed = false;
        }
    }



    function startGame() {
        document.getElementById('screen').style.display = 'none';
        document.getElementById('instruction').style.display = 'none';
        document.getElementById('start').style.display = 'none';
        document.getElementById('score').style.display = 'block';
        document.getElementById('restart').style.display = 'block';
        $('#shortcut').text('Shortcut: R Key');
        global.startTime = Date.now();
        window.setInterval(timer, 100);
        if (global.toggleMusicOff) {
            backMusic.play();
        }
        updateScore();
        beginGame();
        global.rotating = true;
        rotateBall();
        backMusic.volume = 0.5;
    }

    function endGame(explodedX, explodedY) {
        window.cancelAnimationFrame(beginReq);
        window.cancelAnimationFrame(bounceReq);
        window.cancelAnimationFrame(trackPassedFlagsReq);
        window.cancelAnimationFrame(trackLandFlagsReq);
        window.cancelAnimationFrame(rotateReq);
        window.cancelAnimationFrame(manageRowsReq);
        window.cancelAnimationFrame(updateScoreReq);
        
        if (explodedX != -1) {
            explodedBall.centerX = explodedX;
        }
        if (explodedY != -1) {
            explodedBall.centerY = explodedY;
        }
        global.gameEnd = true;
        global.canBounce = false;
        if (global.soundsOn) {
            explode.play();
        }
        graphicsToRender.spliceAdd(0, 1, exploded);
        document.getElementById('score').innerHTML = 'Ouch! Try Again! <br> Score: ' + global.score;
        document.getElementById('screen').style.display = 'block';
    }


    // // let start = false;
    // let canBounce = false;
    $('html').on('keydown', function (event) {
        /*
            Key Codes:
            space bar: 32
            up arrow: 38
            left arrow: 37
            right arrow: 39
            down arrow: 40
        */

        //bounce when pressing spacebar
        if (event.which === 32) {
            if (!global.bouncing && global.canBounce && !global.celebrate
                && global.passedTunnel) {
                global.rectangleLand = false;
                ball.bounceSpeedY = ball.initialBounceSpeedY;
                bounce();
                global.canBounce = false;
            }

            if (!global.start) {
                startGame();
                global.start = true;
                var el = document.getElementsByTagName("html")[0];
                el.addEventListener("touchstart", handleTouch, false);
            }
        }

        if (event.which === 82) {
            location.reload();
        }

        if (event.which === 77) {
            if (global.toggleMusicOff) {
                backMusic.pause();
                global.toggleMusicOff = false;
                $('#musicButton').attr('src', "img/sounds/music_button2.png");
            } else {
                backMusic.play();
                global.toggleMusicOff = true;
                $('#musicButton').attr('src', "img/sounds/music_button1.png");
            }
        }

        if (event.which === 83) {
            if (global.toggleSoundsOff) {
                global.soundsOn = false;
                global.toggleSoundsOff = false;
                $('#soundsButton').attr('src', "img/sounds/sounds_button2.png");
            } else {
                global.soundsOn = true;
                global.toggleSoundsOff = true;
                $('#soundsButton').attr('src', "img/sounds/sounds_button1.png");
            }
        }
    });

    $('html').on('keyup', function (event) {
        if (event.which === 32) {
            if (!global.movingDown && !global.gameEnd) {
                global.canBounce = true;
            }
        }
    });

    function handleTouch(evt) {
        if(!global.start) {
            startGame();
            global.start = true;
        }
        if (!global.bouncing && global.canBounce) {
            global.rectangleLand = false;
            ball.bounceSpeedY = ball.initialBounceSpeedY;
            bounce();
        }
    }

    $('#restart').on('click', function() {
        location.reload();
    });

    $('#start').on('click', function() {
        if (!global.start) {
            startGame();
            global.start = true;
            var el = document.getElementsByTagName("html")[0];
            el.addEventListener("touchstart", handleTouch, false);
        }
    });

    $('#music').on('click', function() {
        if (global.toggleMusicOff) {
            backMusic.pause();
            global.toggleMusicOff = false;
            $('#musicButton').attr('src', "img/sounds/music_button2.png");
        } else {
            backMusic.play();
            global.toggleMusicOff = true;
            $('#musicButton').attr('src', "img/sounds/music_button1.png");
        }
    });

    $('#sounds').on('click', function() {
        if (global.toggleSoundsOff) {
            global.soundsOn = false;
            global.toggleSoundsOff = false;
            $('#soundsButton').attr('src', "img/sounds/sounds_button2.png");
        } else {
            global.soundsOn = true;
            global.toggleSoundsOff = true;
            $('#soundsButton').attr('src', "img/sounds/sounds_button1.png");
        }
    });

    $('#restartButton').hover(function() {
        $(this).attr('src', 'img/restart/restart_button1.png');
    },
    function () {
        $(this).attr('src', 'img/restart/restart_button2.png');
    });
    
}

$(main);

