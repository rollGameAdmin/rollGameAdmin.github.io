function rollToConquer() {

    let flag = {
        gameStarted: false,
        ballInPosition: false
    };
    let animations = [];
    let keyPress = {
        spaceBar: 32,
        upArrow: 38,
        leftArrow: 37,
        rightArrow: 39,
        downArrow: 40,
        letterM: 77,
        letterR: 82,
        letterS: 83
    };
    let distance = {
        inFrontOfTunnel: scale(100),
        closeToGround: scale(10),
        fromCannonToFire: scale(3000),
        fromCannonToStore: scale(170),
        dartSpacing: scale(300)
    };
    let speed = {
        cannonFire: scale(11)
    };
    let score = 0;
    let startTime = 0;
    let elapsed = 0;
    let graphicsToRenderSizes = [];

    let graphicInFront = graphicsToMonitor.getFirstGraphic();
    let lastGraphic = graphicsToMonitor.getLastGraphic();
    let nextCannon = cannons.getFirstGraphic();
    /* ----- Section: Event handling -----------*/
    $('html').on('keydown keyup', function (e) {

        if (e.type === 'keydown') {
            //bounce when pressing spacebar
            if (e.which === keyPress.spaceBar) {
                //TODO: handle game start on spacebar press
                if (!flag.gameStarted) {
                    startGame();
                }

                if (!ball.isBouncing && ball.isReadyToBounce) {
                    cancelAnimation(rotateBallRequest);
                    ball.stopRotating();
                    bounceBall();
                }
            }

            if (e.which === keyPress.letterR) {
                location.reload();
            }

            if (e.which === keyPress.letterM) {
                //TODO: implement
            }

            if (e.which === keyPress.letterS) {
                //TODO: implement
            }
        } else {
            //TODO: implement for re-enabling bounce
        }

    });

    $('#music').on('click', function() {
        //TODO: handle music
    });

    $('#sounds').on('click', function() {
       ///TODO: handle sound
    });

    $('#restart').on('click', function() {
        location.reload();
    });

    $('#start').on('click', function() {
        //TODO: handle game start
        if (!flag.gameStarted) {
            startGame();
        }
    });

    $('#restartButton').hover(function() {
        $(this).attr('src', 'img/restart/restart_button1.png');
    },
    function () {
        $(this).attr('src', 'img/restart/restart_button2.png');
    });

    function handleTouch(evt) {
        //TODO: handle game start on spacebar press
        ball.bounceSpeedY = ball.initialBounceSpeedY;
        //bounce();
    }
    /*---------------------------------------------------------------*/

    /* ----- Section: Start and End Screen Handling Function Prototypes --------*/
    function hideStartScreen() {
        document.getElementById('screen').style.display = 'none';
        document.getElementById('instruction').style.display = 'none';
        document.getElementById('start').style.display = 'none';
    }

    function showFailedScreen() {
        document.getElementById('screen').style.display = 'block';
        document.getElementById('score').style.display = 'block';
        document.getElementById('restart').style.display = 'block';
        document.getElementById('score').innerHTML = 'Ouch! Try Again! <br> Score: ' + score;
        $('#shortcut').text('Shortcut: R Key');
    }
    /*---------------------------------------------------------------------*/

    /* ---- Section: Animation Frame Function Prototypes ---- */
    function startAnimation(animRequest, callBack) {
        animRequest.setRequest(window.requestAnimationFrame(function () {
            callBack();
        }));
    }

    function cancelAnimation(animRequest) {
        window.cancelAnimationFrame(animRequest.getRequest());
    }

    function cancelAnimations() {
        animations.forEach( function(animationReq) {
                cancelAnimation(animationReq);
        })
    }

    /**
     * Returns whether or not two graphics have a certain distance between them.
     */
    function hasDistanceBetween(graphic1, graphic2, distance) {
        return (Math.abs(graphic1.getRightX() - graphic2.getLeftX())) >= distance;
    }

    /**
     * Renders all graphics.
     */
    function renderGraphics() {
        startAnimation(renderGraphicsRequest, renderGraphics);
        graphicsToRender.render();
    }

    /**
     * Moves all graphics backwards.
     */
    function moveGraphicsBack() {
        startAnimation(moveGraphicsBackRequest, moveGraphicsBack);
        graphicsToRender.moveBack(gameSpeed);
        monitorGraphics();
    }

    /**
     * Rotates ball.
     */
    function rotateBall() {
        startAnimation(rotateBallRequest, rotateBall);
        ball.rotate();
    }

    /**
     * Bounces ball.
     */
    function bounceBall() {
        startAnimation(bounceBallRequest, bounceBall);
        let approachingGround = (Math.abs(ball.centerY - ball.initialCenterY) < distance.closeToGround) && ball.bounceSpeedY < 0;
        if (!approachingGround) {
            ball.bounce();
        } else {
            cancelAnimation(bounceBallRequest);
            ball.stopBouncing(ball.initialCenterY);
            rotateBall();
        }
    }

    /**
     * Make ball fall.
     */
    function makeBallFall(timestamp, centerYToStopFall) {
        makeBallFallRequest.setRequest(window.requestAnimationFrame( function (timestamp) {
            makeBallFall(timestamp, centerYToStopFall);
        }));
        if (ball.getBottomY() < centerYToStopFall) {
            ball.fall();
        } else {
            cancelAnimation(makeBallFallRequest);
            ball.stopFalling(centerYToStopFall);
            rotateBall();
        }
    }

    /**
     * Moves ball to starting position and starts moving graphics back when finished.
     */
    function moveBallToStartAndBegin() {
        startAnimation(moveBallForwardRequest, moveBallToStartAndBegin);
        if (ball.isBehindGraphicPlusDisplacement(tunnel, distance.inFrontOfTunnel)) {
            ball.moveForward();
        } else {
            cancelAnimation(moveBallForwardRequest);
            ball.readyToBounce();
            begin();
        }
    }

    /**
     * Explodes ball.
     */
    function explodeBall() {
        explodedBall.centerY = ball.centerY;
        explodedBall.centerX = ball.centerX;
        graphicsToRender.remove(ball);
        graphicsToRender.addToFront(explodedBall);
    }

    /**
     * Fires cannon.
     */
    function fireCannon() {
        startAnimation(fireCannonRequest, fireCannon);
        if (!cannon.isFiring) {
            cannon.fire(speed.cannonFire);
        } else if (cannon.hasAmmo() && hasDistanceBetween(cannon.justFired, cannon.nextRound, distance.dartSpacing)) {
            cannon.fire(speed.cannonFire);
        } else if (!cannon.hasAmmo()) {
            cancelAnimation(fireCannonRequest)
        }
    }

    /**
     * Stores cannon.
     */
    function storeCannon() {
        startAnimation(storeCannonRequest, storeCannon);
        if (cannon.frameIndex < cannon.numFrames - 1) {
            cannon.update();
        } else if (cannon.isAbove(gameTrack)) {
            cannon.store();
        } else {
            cancelAnimation(storeCannonRequest);
        }
    }

    /**
     * Runs explosion.
     */
    function runExplosion() {
        startAnimation(runExplosionRequest, runExplosion);
        if (!explosion.finished) {
            explosion.update();
        } else {
            cancelAnimations(runExplosionRequest);
        }
    }
    /*-----------------------------------*/
    /*---------------------------------------------------------------------*/

    /*----- Section: Graphic Monitoring ---------------------*/
    function updateGraphicToMonitor() {
        graphicsToDelete.addToBack(graphicsToMonitor.removeFront());
        graphicInFront = graphicsToMonitor.getFirstGraphic();
    }
    function updateLastGraphic() {
        lastGraphic = graphicsToMonitor.getLastGraphic();
    }
    function isLastGraphicVisible() {
        return (lastGraphic != null) && lastGraphic.getLeftX() < canvas.width;
    }
    function shouldDeleteGraphic() {
        if (!graphicsToDelete.isEmpty()) {
            let graphic = graphicsToDelete.getFirstGraphic();
            return graphic.getRightX() < -100;
        } else {
            return false;
        }
    }

    function handleCannons() {
        if (ball.isWithinDistanceFromGraphic(nextCannon, distance.fromCannonToFire)
            && nextCannon.hasAmmo() && !nextCannon.isFiring) {
            fireCannon();
        } else if (!nextCannon.hasAmmo() &&
            hasDistanceBetween(nextCannon.justFired, nextCannon, distance.fromCannonToStore)) {
            if (!nextCannon.isStored) {
                storeCannon();
                nextCannon.isStored = true;
                cannons.removeFront();
                nextCannon = cannons.getFirstGraphic();
            }
        }
    }
    function monitorGraphics() {
        if (graphicInFront != null) {
            switch (graphicInFront.graphicType) {
                case  graphicTypes.deathTriangle : {
                    if (ball.killedByTri(graphicInFront)) {
                        endGame(false);
                    } else if (ball.passed(graphicInFront)) {
                        updateGraphicToMonitor();
                    }
                    break;
                }
                case graphicTypes.rectangle : {
                    if (ball.hitOnGround(graphicInFront)) {
                        endGame(false);
                    } else if (ball.isBouncing && ball.landedOnGraphic(graphicInFront)) {
                        cancelAnimation(bounceBallRequest);
                        graphicInFront.changeColor(colors.lightGreen);
                        ball.stopBouncing(graphicInFront.getTopY() - dimen.ballRadius);
                        if (!ball.isRotating) {
                            rotateBall();
                        }
                    } else if (ball.passed(graphicInFront)) {
                        updateGraphicToMonitor();
                        if (!ball.isFalling && !ball.isBouncing) {
                            cancelAnimation(rotateBallRequest);
                            ball.stopRotating();
                            makeBallFall(null, ball.initialCenterY);
                        }
                    }
                    break;
                }
                case graphicTypes.deathTrap : {
                    if (ball.deathByDeathTrap(graphicInFront)) {
                        endGame(false);
                    } else if  (ball.centerX >= graphicInFront.getRightX()) {
                        updateGraphicToMonitor();
                    }
                    break;
                }
                case graphicTypes.dart : {
                    let itsCannon = dart.cannon;
                    if (ball.hitAmmo(graphicInFront)) {
                        endGame(true);
                    } else if (ball.passed(graphicInFront)) {
                        updateGraphicToMonitor();
                    }
                    break;
                }
                default: {}
            }
        }
        if (!cannons.isEmpty()) {
            handleCannons();
        }

        if (isLastGraphicVisible()) {
            //createNextGraphic(lastGraphic);
            //updateLastGraphic();
        }

        if (shouldDeleteGraphic()) {
            graphicsToRender.remove(graphicsToDelete.removeFront());
        }
        graphicsToRenderSizes.push(graphicsToRender.size());
    }

    /*----- Section: Game Start Function Prototypes ----------*/
    function timer() {
        let time = Date.now() - startTime;
        elapsed = Math.floor(time / 100) / 10;
    }

    function startGame() {
        flag.gameStarted = true;
        hideStartScreen();
        moveBallToStartAndBegin();
        startTime = Date.now();
        window.setInterval(timer, 100);
    }

    /**
     * Stop ball moving forward, start ball rotation and start moving graphics back.
     */
    function begin() {
        ball.stopMovingForward();
        rotateBall();
        moveGraphicsBack();
        updateScore();
    }

    let scoreCount = document.getElementById('score-counter');
    function updateScore() {
        updateScoreRequest.setRequest(window.requestAnimationFrame(updateScore));
        let newScore = elapsed * 100 | 0;
        score = newScore;
        scoreCount.innerHTML = '' + newScore;
    }
    /*--------------------------------------*/

    /*------ Section: Game End Function Prototypes -------*/
    function setUpExplosion() {
        explosion.centerX = graphicInFront.centerX;
        graphicsToRender.remove(ball);
        if (graphicInFront.graphicType !== graphicTypes.deathTrap) {
            graphicsToRender.remove(graphicInFront);
        }
        graphicsToRender.addToFront(explosion);
    }

    function endGame(shouldExplode) {
        cancelAnimations();
        if (!shouldExplode) {
            explodeBall();
            showFailedScreen();
            let total = 0;
            for (let i = 0; i < graphicsToRenderSizes.length; i++) {
                total += graphicsToRenderSizes[i];
            }
        } else {
            setUpExplosion();
            runExplosion();
            showFailedScreen();
        }

    }
    let renderGraphicsRequest = new AnimationRequest();
    let moveGraphicsBackRequest = new AnimationRequest();
    let moveBallToStartRequest = new AnimationRequest();
    let rotateBallRequest = new AnimationRequest();
    let moveBallForwardRequest = new AnimationRequest();
    let bounceBallRequest = new AnimationRequest();
    let makeBallFallRequest = new AnimationRequest();
    let updateScoreRequest = new AnimationRequest();
    let storeCannonRequest = new AnimationRequest();
    let fireCannonRequest = new AnimationRequest();
    let runExplosionRequest = new AnimationRequest();
    animations.push(
        moveGraphicsBackRequest,
        moveBallToStartRequest,
        rotateBallRequest,
        moveBallForwardRequest,
        bounceBallRequest,
        makeBallFallRequest,
        updateScoreRequest,
        fireCannonRequest);
    renderGraphics();
}

$(rollToConquer);