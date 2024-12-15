const app = new PIXI.Application();
const ufoList = [];

document.body.appendChild(app.view);

const rocket = PIXI.Sprite.from('assets/rocket.png');
rocket.x = 350;
rocket.y = 520;
rocket.scale.x = 0.05;
rocket.scale.y = 0.05;
app.stage.addChild(rocket);

gameInterval(function() {
    const ufo = PIXI.Sprite.from('assets/ufo' + random(1, 2) + '.png');
    ufo.x = random(0, 755);
    ufo.y = -35;
    ufo.scale.x = 0.07;
    ufo.scale.y = 0.07;
    app.stage.addChild(ufo);
    ufoList.push(ufo);
    flyDown(ufo, 1);

    waitForCollision(ufo, rocket).then(function() {
        app.stage.removeChild(rocket);
        stopGame();
    });
}, 300);

function leftKeyPressed() {
    rocket.x -= 5;
    if (rocket.x < 1) {
        rocket.x = 1;
    }
}

function rightKeyPressed() {
    rocket.x += 5;
    if (rocket.x >755) {
        rocket.x = 755;
    }
}

function spaceKeyPressed() {
    const bullet = PIXI.Sprite.from('assets/bullet.png');
    bullet.x = rocket.x + 14;
    bullet.y = 500;
    bullet.scale.x = 0.02;
    bullet.scale.y = 0.02;
    app.stage.addChild(bullet);
    flyUp(bullet);

    waitForCollision(bullet, ufoList).then(function([bullet, ufo]) {
        app.stage.removeChild(bullet);
        app.stage.removeChild(ufo);
    });
}

// make ufos disappear to save system resources 

gameInterval(function() {
    ufoList.forEach(function(ufo) {
        if (ufo.y > 600) {
            app.stage.removeChild(ufo);
            ufoList.splice(ufoList.indexOf(ufo), 1);
        }
    });
}, 1000);

// make bullets disappear to save system resources

gameInterval(function() {
    app.stage.children.forEach(function(child) {
        if (child.y < -50) {
            app.stage.removeChild(child);
        }
    });
}, 50);




// Focus canvas on mouse enter/leave

let isCanvasFocused = false;

app.view.addEventListener('mouseenter', () => {
    isCanvasFocused = true;
});

app.view.addEventListener('mouseleave', () => {
    isCanvasFocused = false;
});

window.addEventListener('keydown', (event) => {
    if (isCanvasFocused) {
        switch(event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                leftKeyPressed();
                break;
            case 'ArrowRight':
                event.preventDefault();
                rightKeyPressed();
                break;
            case ' ':
                event.preventDefault();
                spaceKeyPressed();
                break;
        }
    }
});



