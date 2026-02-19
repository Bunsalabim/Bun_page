document.addEventListener("DOMContentLoaded", () => {

    let characterHidden = false;

    let score = 0;
    let timeLeft = 30;
    let gameRunning = false;
    let enemies = [];
    let spawnTimeout;

    const scoreEl = document.getElementById("score");
    const timerEl = document.getElementById("game_timer");

    function spawnEnemy() {
        if (!gameRunning) return;

        const roll = Math.random();

        let type;
        if (roll < 0.65) {
            type = "circle";      
        } else if (roll < 0.90) {
            type = "square";      
        } else {
            type = "triangle";    
        }


        const enemy = document.createElement("img");
        enemy.draggable = false;

        let health, points, speed, size, enemyDeath, zIndex;

        switch (type) {
            case "circle":
                enemy.src = "pictures/animation/circle_walk.gif";
                enemyDeath = "pictures/animation/circle_death.gif";
                health = 1;
                points = 1;
                speed = 8000;
                size = 100;
                zIndex = 2;
                break;

            case "square":
                enemy.src = "pictures/animation/square_walk.gif";
                enemyDeath = "pictures/animation/square_death.gif";
                health = 5;
                points = 10;
                speed = 12000;
                size = 200;
                zIndex = 1; // behind circles
                break;

            case "triangle":
                enemy.src = "pictures/animation/triangle_walk.gif";
                enemyDeath = "pictures/animation/triangle_death.gif";
                health = 1;
                points = 20;
                speed = 2000;
                size = 100;
                zIndex = 3; // in front of everything
                break;
        }

        enemy.classList.add("enemy");
        enemy.style.position = "fixed";
        enemy.style.bottom = "70px";
        enemy.style.width = size + "px";
        enemy.style.zIndex = zIndex;

        // store data ON the enemy
        enemy.dataset.health = health;
        enemy.dataset.points = points;
        enemy.dataset.deathGif = enemyDeath;

        const fromRight = Math.random() < 0.5;
        if (fromRight) {
            enemy.style.left = "100vw";
            enemy.style.transform = "scaleX(-1)";
            enemy.style.animation = `moveLeft ${speed}ms linear forwards`;
        } else {
            enemy.style.left = "-100px";
            enemy.style.transform = "scaleX(1)";
            enemy.style.animation = `moveRight ${speed}ms linear forwards`;
        }

        enemy.addEventListener("click", () => {
            if (!gameRunning) return;

            let hp = parseInt(enemy.dataset.health);
            hp--;

            if (hp <= 0) {
                enemy.style.animationPlayState = "paused";
                enemy.src = enemy.dataset.deathGif;
                enemy.style.pointerEvents = "none";

                score += parseInt(enemy.dataset.points);
                scoreEl.textContent = "Score: " + score;

                setTimeout(() => {
                    enemy.remove();
                    enemies = enemies.filter(e => e !== enemy);
                }, 1000);
            } else {
                enemy.dataset.health = hp;
            }
        });

        document.body.appendChild(enemy);
        enemies.push(enemy);

        // random next spawn
        const delay = 200 + Math.random() * 500;
        spawnTimeout = setTimeout(spawnEnemy, delay);
    }

    function startGame() {
        if (gameRunning) return;

        gameRunning = true;

        scoreEl.textContent = "Score: 0";
        timerEl.textContent = "Time: " + timeLeft;
        document.getElementById("game_ui").style.display = "block";

        spawnEnemy();

        const timerInterval = setInterval(() => {
            timeLeft--;
            timerEl.textContent = "Time: " + timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                gameRunning = false;
                endGame();
            }
        }, 1000);
    }

    function showFinalScore() {
        const overlay = document.getElementById("final_score_overlay");
        const label = document.getElementById("final_score_label");
        const number = document.getElementById("final_score_number");

        label.textContent = "Score";
        number.textContent = score;

        overlay.style.display = "flex";
        document.getElementById("game_ui").style.display = "none";
    }
    function endGame() {
        clearTimeout(spawnTimeout);

        enemies.forEach(enemy => {
            enemy.style.animationPlayState = "paused";
            enemy.src = enemy.dataset.deathGif;
            enemy.style.pointerEvents = "none";
            setTimeout(() => enemy.remove(), 1000);
        });

        enemies = [];

        showFinalScore();

        if (score === 0) {
            setTimeout(() => {
                const overlay = document.getElementById("what_how_overlay");
                const sound = document.getElementById("what_how_sound");

                overlay.style.display = "block";
                sound.play();

                sound.addEventListener("ended", () => {
                    setTimeout(() => location.reload(), 500);
                });
            }, 2500);
        } else {
            setTimeout(() => location.reload(), 5000);
        }
    }

    const circle_walk = document.getElementById("circle_walk");
    circle_walk.addEventListener("click", () => {
        startGame();
        circle_walk.style.animationPlayState = "paused";
        circle_walk.src = "pictures/animation/circle_death.gif";
        circle_walk.style.pointerEvents = "none";
        setTimeout(() => circle_walk.remove(), 1000);
    });

});
