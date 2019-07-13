function rollToConquer() {

    let gameStarted = false;
    let ballInPosition = false;
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
        inFrontOfTunnel: 100,
        closeToGround: 10
    };

    /* ----- Section: Event handling -----------*/
    $('html').on('keydown keyup', function (e) {

        if (e.type === 'keydown') {
            //bounce when pressing spacebar
            if (e.which === keyPress.spaceBar) {
                //TODO: handle game start on spacebar press
                if (!gameStarted) {
                    startGame();
                }

                if (!ball.isBouncing && ball.isReadyToBounce) {
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
        if (!gameStarted) {
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
        document.getElementById('score').innerHTML = 'Ouch! Try Again! <br> Score: ' + global.score;
        $('#shortcut').text('Shortcut: R Key');
    }
    /*---------------------------------------------------------------------*/

    /* ---- Section: Position Check Function Prototypes ---- */
        function isBehind(graphic, toCheck, distance) {
            return (graphic.getLeftX() < toCheck.getRightX() + scale(distance));
        }
    /*--------------------------------------------------------*/

    /* ---- Section: Animation Frame Function Prototypes ---- */
    function startAnimation(animRequest, callBack) {
        animRequest.setRequest(window.requestAnimationFrame(function () {
            callBack();
        }));
    }

    function cancelAnimation(animRequest) {
        window.cancelAnimationFrame(animRequest.getRequest());
    }

    function cancelAnimations(ignore) {
        animations.forEach( function(animationReq) {
            if (!ignore.has(animationReq)) {
                cancelAnimation(animationReq);
            }
        })
    }

    /**
     * Renders all graphicsToRender.
     */
    function renderGraphics() {
        startAnimation(renderGraphicsRequest, renderGraphics);
        graphicsToRender.render();
    }

    /**
     * Moves all graphicsToRender backwards.
     */
    function moveAllGraphicsBack() {
        startAnimation(moveGraphicsBackRequest, moveAllGraphicsBack);
        graphicsToRender.backAll(gameSpeed);
        monitorHits();
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
        let approachingGround = (Math.abs(ball.centerY - ball.initialCenterY) < scale(distance.closeToGround)) && ball.bounceSpeedY < 0;
        if (!approachingGround) {
            ball.bounce();
        } else {
            cancelAnimation(bounceBallRequest);
            ball.stopBouncing(ball.initialCenterY);
        }
    }

    /**
     * Moves ball to starting position and starts moving graphicsToRender back when finished.
     */
    function moveBallToStartAndBegin() {
        startAnimation(moveBallForwardRequest, moveBallToStartAndBegin);
        if (isBehind(ball, tunnel, distance.inFrontOfTunnel)) {
            ball.moveForward();
        } else {
            cancelAnimation(moveBallForwardRequest);
            ball.readyToBounce();
            //begin();
        }
    }

    /**
     * Stop ball moving forward, start ball rotation and start moving graphicsToRender back.
     */
    function begin() {
        ball.stopMovingForward();
        rotateBall();
        moveAllGraphicsBack();
    }
    /*-----------------------------------*/
    /*---------------------------------------------------------------------*/

    /*----- Section: Monitoring ---------------------*/

    function handleHits() {

    }

    /*----- Section: Game Start Function Prototypes ----------*/
    function startGame() {
        gameStarted = true;
        hideStartScreen();
        moveBallToStartAndBegin();
    }
    /*--------------------------------------*/
    let renderGraphicsRequest = new AnimationRequest();
    let moveGraphicsBackRequest = new AnimationRequest();
    let moveBallToStartRequest = new AnimationRequest();
    let rotateBallRequest = new AnimationRequest();
    let moveBallForwardRequest = new AnimationRequest();
    let bounceBallRequest = new AnimationRequest();
    animations.push(
        renderGraphicsRequest,
        moveGraphicsBackRequest,
        moveBallToStartRequest,
        rotateBallRequest,
        moveBallForwardRequest,
        bounceBallRequest);
    renderGraphics();
}

$(rollToConquer);