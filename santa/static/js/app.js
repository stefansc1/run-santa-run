// Dont allow double jump DONE
// GameOver Done
// Score Top left Done
// Some Level Design Done
// Player stationary DONE
// Increasing speed
// Start Screen
// music
// DeltaTime DOne

// px per second per second
const width = 1800;
const height = 800;
// px per second
const jumpheight = 200; // px
const jumptime = 1.2; // second
const PLAYER_SPEED = 150;
const grav = jumpheight * 8 / jumptime / jumptime;
const jump_speed = grav * jumptime / 2;
const speed_up = 1 / 60; //per second
const playerSpeedUp = speed_up * PLAYER_SPEED;
const startEvent = new Event("StartGame");
const gameOverEvent = new Event("GameOver");
const deathEvent = new Event("Death");
const winEvent = new Event("Win");
class Gamestate {
  constructor() {
    this.drawables = new Array();
    this.player = null;
    this.currentMode = this.play;
    this.mode = "play";
    this.ctx = ctx;
    this.x_pos = 0;
    this.shouldJump = false;
    this.playTime = 0;
    this.dt = 1;
    this.debug = true;
    this.background = null;
    this.background_x = 0;
    this.playerSpeedUp = 0;
    this.checkPoints = [];
    this.checkPoint = null;
    this.textureImg = null;
  }

  addDrawable(drawable) {
    if (drawable instanceof Player) {
      console.log("player added");
      this.player = drawable;
    } else {
      this.drawables.push(drawable);
    }
  }

  generate_startscreen_level() {
    let drawables = [];
    drawables.push(new Box(0, 200, 1000, 20));
  }
  drawCountdown() {
    this.draw(this.ctx);
    this.playTime += this.dt;
    drawText("Start in " + (this.playTime * -1).toFixed(0) + " s", this.ctx, 500, 200);
    if (this.playTime >= 0) {
      this.switchMode("play4real");
    }
  }

  set_dt(dt) {
    if (this.debug) {
      this.dt = 1 / 60;
      return;
    }
    this.dt = dt;
  }

  switchMode(mode) {
    switch (mode) {
      case "startscreen":
        this.player.x_pos = 0;
        this.player.y_pos = 0;
        this.player.x_speed = 150;
        this.player.y_speed = 0;
        this.currentMode = this.play;
        this.drawables = generate_startscreen_level();
        this.drawText = (_, __) => void 0;
        this.drawables.push;
        this.playerSpeedUp = 0;
        break;
      case "play":
        generatelevel(this);
        this.restoreFromCheckpoint();
        this.draw(this.ctx);
        this.playTime = -3;
        window.dispatchEvent(startEvent);
        this.currentMode = () => this.drawCountdown();
        break;
      case "play4real":
        generatelevel(this);
        this.player.x_speed = PLAYER_SPEED;
        if (this.checkPoint != null) {
            this.restoreFromCheckpoint();
        }

        console.log(this.checkPoints);
        let e = new CustomEvent("StartMove", { detail: this.playTime });
        window.dispatchEvent(e);
        this.playerSpeedUp = playerSpeedUp;
        this.drawText = drawText;
        this.currentMode = this.play;
        break;
      case "gameover":
        window.dispatchEvent(gameOverEvent);
		this.player.lifes = 3;
		this.checkPoint = null;
        this.currentMode = this.gameover;
		this.x_pos = 0;
        this.background_x = 0;
        break;
      default:
        assert(False);
        this.mode = mode;
    }
  }
  drawText(_, __) {
  }
  createCheckpoint() {
    console.log("Creating checkpoint" + this.x_pos)
    let check = new Checkpoint(this)
    return check;
  }
  restoreFromCheckpoint() {
    if (this.checkPoint == null) {
      return
    }
    this.x_pos = this.checkPoint.x_pos;
    this.player.y_pos = this.checkPoint.y_pos;
    this.playTime = this.checkPoint.playTime;
    this.background_x = this.checkPoint.background_x;
    this.player.y_speed = this.checkPoint.y_speed;
    this.player.x_speed = this.checkPoint.x_speed;
    this.checkPoints = this.checkPoint.checkPoints;
    this.drawables = deepcopyDrawables(this.checkPoint.drawables);
  }
  move() {
    this.background_x -= this.player.x_speed * this.dt / 8;
    let outside = []
    let i = 0;
    this.x_pos = this.x_pos + PLAYER_SPEED * this.dt;
    for (const drawable of this.drawables) {
      drawable.x_pos -= this.player.x_speed * this.dt;
      if (drawable.x_pos + drawable.width < -100) {
        outside.push(i)
      }
      i++;
    }
    for (const i of outside.reverse()) {
      this.drawables.splice(i, 1);
    }
    let d_y = this.player.y_speed * this.dt;
    this.player.y_pos += d_y;
    //  this.player.y_pos = this.player.y_pos % this.height;
    if (this.player.y_pos > this.ctx.canvas.height) {
	  if (this.player.lifes>1){
		  this.player.lifes -=1;
		  this.switchMode("play");
		  window.dispatchEvent(deathEvent);
		  return
	  }
      this.switchMode("gameover");
    }
  }
  scaleBySpeedUp(speedUp) {
    if (this.player.x_speed > 1) {

      let newPlayerSpeed = this.player.x_speed + speedUp * PLAYER_SPEED;

      for (const drawable of this.drawables) {
        let scale = (drawable.x_pos - this.player.x_pos) / this.player.x_speed;
        let new_x = this.player.x_pos + newPlayerSpeed * scale;
        scale = (drawable.width + drawable.x_pos - this.player.x_pos) / this.player.x_speed;
        let new_width = this.player.x_pos - new_x + scale * newPlayerSpeed
        drawable.x_pos = new_x;
        drawable.width = new_width;
      }
      this.player.x_speed = newPlayerSpeed;
    }
  }
  addCheckpoint(i) {
    this.checkPoints.push(i);
    this.checkPoints = this.checkPoints.sort();
    this.drawables.push(new Text("Checkpoint", i, 100, 50))
  }
  play() {
    //  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    this.playTime += this.dt;
    let currentSpeedUp = this.playerSpeedUp / PLAYER_SPEED * this.dt;
    this.scaleBySpeedUp(currentSpeedUp);
    this.draw(this.ctx);
    this.drawText("Score: " + (this.playTime * 10).toFixed(0), this.ctx, 50, 50);
    this.drawText("❤:" + (this.player.lifes).toFixed(0), this.ctx, 50, 100);
    this.player.update(this.dt, this.playerSpeedUp);
    this.move();
    if (this.checkPoints.length != 0 && this.x_pos > this.checkPoints[0]) {
      this.checkPoint = this.createCheckpoint();
      this.checkPoints.splice(0, 1);
    }
    this.player.canJump = false;
    // If player collides he can jump again
    this.checkCollision();
    if (this.player.shouldJump) {
      this.player.jump();
    }

    // lastRenderTime = currentTime;
    // better keep it at the end in case something throws in this callback,
    // we don't want it to throw every painting frames indefinitely
  }

  gameover() {
    let score = (this.playTime * 10).toFixed(0);
    this.draw(this.ctx);
    this.ctx.color = "beige";
    this.ctx.font = "40px serif";
    this.ctx.fillStyle = "black";
    this.ctx.fillText("You have failed. Now we have to wait for nuclear", 100, 100);
    this.ctx.fillText("fusion to provide us with clean energy.", 100, 150);
    this.ctx.fillText("Or ... You keep on trying!", 100, 200);
    this.ctx.font = "68px serif";
    this.ctx.fillText("Score: " + score, 100, 350);
    this.ctx.fillStyle = "beige";
  }

  draw(canvasContext) {
    canvasContext.fillRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
    let s = canvasContext.canvas.height / this.background.height
    canvasContext.drawImage(this.background, this.background_x, 0, this.background.width*s, this.background.height*s);
    for (let i = 0; i < this.drawables.length; i++) {
      this.drawables[i].draw(canvasContext);
    }
    if (this.player != null) {
      this.player.draw(canvasContext);
    }
  }

  checkCollision() {
    if (this.player == null) {
      console.log("No PLayer -> no collision");
      return false;
    }
    let hasCollided1 = false;
    let hasCollided2 = false;

    for (let i = 0; i < this.drawables.length; i++) {
      // convex points of player penetrate verticies of drawable
      let drawable = this.drawables[i];
      hasCollided1 = drawable.checkCollision(this.player);
      hasCollided2 = this.player.checkCollision(drawable);
      if (!hasCollided1 && !hasCollided2) {
        continue;
      }
      let angle;
      let index;
      let collision;
      let old_x;
      let convexPoints;
      let old_y;
      let len;
      let firstVertice;
      let x_offset = this.player.x_speed * this.dt;
      let y_offset = this.player.y_speed * this.dt;
      let vertObject;
      let pointObject;
      if (hasCollided1) {
        vertObject = drawable;
        pointObject = this.player
      }
      if (hasCollided2 && !hasCollided1) {
        vertObject = this.player;
        pointObject = drawable;
      }

      index = vertObject.getFirstCollisionPointIndex(pointObject);
      convexPoints = pointObject.convexPoints();
      collision = convexPoints[index];
      len = convexPoints.length;
      let collVert1 = [convexPoints[cycle(index - 1, len)], convexPoints[index]];
      let collVert2 = [convexPoints[index], convexPoints[cycle(index + 1, len)]];
      let vec1 = leftTurn(verticeToVector(collVert1));
      let vec2 = leftTurn(verticeToVector(collVert2));
      old_x = collision[0] - x_offset;
      old_y = collision[1] - y_offset;
      if (hasCollided2 && !hasCollided1) {
        old_x = collision[0] + x_offset;
        old_y = collision[1] + y_offset;
      }
      firstVertice = vertObject.getRayCollision(old_x, old_y, x_offset, y_offset);
      angle = getCollisionVector(firstVertice, collision);
      if (hasCollided2 && !hasCollided1) {
        angle = angle.map((x) => -x);
      }
      let firstNormVec = leftTurn(verticeToVector(firstVertice));
      if (dotProduct(firstNormVec, vec1) < 0 || dotProduct(firstNormVec, vec2) < 0) {
        if (vecLength(angle) > 600) {
          console.log(angle);
        }
        this.player.collide(angle);
      }

    }
    return false;
  }
}




function drawText(text, canvasContext, x, y) {
  canvasContext.font = "48px serif";
  canvasContext.fillStyle = "black";
  canvasContext.fillText(text, x, y);
  canvasContext.fillStyle = "beige";
}
class Drawable {
  constructor(canCollide) {
    this.canCollide = canCollide;
  }
  draw(canvasContext) {
    console.log("Drawing");
  }

  checkCollision(drawable) {
    if (!this.canCollide || !drawable.canCollide) {
      return false;
    }
    return true;
  }

  convex_points() {
    return new [[2000, 2000], [2001, 2001], [2000, 2001]]();
  }
}
class Text extends Drawable {
  constructor(text, x_pos, y_pos, textSize) {
    super(false);
    this.x_pos = x_pos;
    this.y_pos = y_pos;
    this.textSize = textSize;
    this.text = text;
  }
  draw(canvasContext) {
    canvasContext.font = this.textSize + "px serif";
    canvasContext.fillStyle = "black";
    canvasContext.fillText(this.text, this.x_pos, this.y_pos);
    canvasContext.fillStyle = "beige";
  }


}


class Box extends Drawable {
  constructor(x_pos, y_pos, width, height) {
    super(true);
    this.x_pos = x_pos;
    this.y_pos = y_pos;
    this.width = width;
    this.height = height;
    this.color = "blue";
    this.y_speed = 0;
    this.x_speed = 0;
    this.images = null;
  }

  addImage(image) {
  }

  draw(canvasContext) {
    if (this.images == null) {
      let old_color = canvasContext.fillStyle;
      canvasContext.fillStyle = this.color;
      canvasContext.fillRect(this.x_pos, this.y_pos, this.width, this.height);
      canvasContext.fillStyle = old_color;
      return;
    }
    canvasContext.drawImage(this.images[0], this.x_pos, this.y_pos, this.width, this.height);
  }

  convexPoints() {
    return [[this.x_pos, this.y_pos], [this.x_pos + this.width, this.y_pos], [
      this.x_pos + this.width,
      this.y_pos + this.height,
    ], [this.x_pos, this.y_pos + this.height]];
  }

  getFirstCollisionPointIndex(drawable) {
    let points = drawable.convexPoints();
    for (let i = 0; i < points.length; i++) {
      let x = points[i][0];
      let y = points[i][1];
      if (x > this.x_pos && x < this.x_pos + this.width) {
        if (y > this.y_pos && y < this.y_pos + this.height) {
          return i;
        }
      }
    }
    return null;
  }
  getRayCollision(x, y, x_speed, y_speed) {
    let points = this.convexPoints();
    let minIndex = null;
    let minDistance = null;
    for (let i = 0; i < points.length; i++) {
      let px1 = points[i][0];
      let py1 = points[i][1];
      let dx1 = points[(i + 1) % (points.length)][0] - px1;
      let dy1 = points[(i + 1) % (points.length)][1] - py1;
      let crossPoint = getCrossPoint(px1, py1, dx1, dy1, x, y, x_speed, y_speed);
      if (crossPoint == null) {
        continue;
      }
      let dist = ((x - crossPoint[0]) ** 2 + (y - crossPoint[1]) ** 2) ** 0.5;
      if (minIndex == null || dist <= minDistance) {
        minIndex = i;
        minDistance = dist;
      }
    }
    if (minIndex == null) {
      return null;
    }

    return [[points[minIndex][0], points[minIndex][1]], [
      points[(minIndex + 1) % (points.length)][0],
      points[(minIndex + 1) % (points.length)][1],
    ]];
  }

  checkCollision(drawable) {
    if (!super.checkCollision(drawable)) {
      return false;
    }
    var collison = this.getFirstCollisionPointIndex(drawable);
    if (collison != null) {
      return true;
    }
    return false;
  }

  collide(angle) {
  }
}

function getCrossPoint(px1, py1, dx1, dy1, px2, py2, dx2, dy2) {
  let lambda;
  if (dx1 == 0) {
    if (dx2 == 0) {
      return null;
    }
    lambda = (px1 - px2) / dx2;
  } else {
    let denom = dy2 - dx2 * dy1 / dx1;
    if (denom == 0) {
      return null;
    }
    lambda = (-(py1 - py2) + (px1 - px2) * dy1 / dx1) / (-denom);
  }
  if (lambda > 1 || lambda < 0) {
    // console.log([lambda, px1, py1, dx1,dy1, px2, py2, dx2, dy2]);
  }
  return [px2 + lambda * dx2, py2 + lambda * dy2];
}

function getCollisionVector(points, collision) {
  let dir_vec_xy = [points[1][0] - points[0][0], points[1][1] - points[0][1]];
  let base_vec_xy = [points[0][0], points[0][1]];
  let diff_vec = [base_vec_xy[0] - collision[0], base_vec_xy[1] - collision[1]];
  let res_top = diff_vec[0] * dir_vec_xy[1] - diff_vec[1] * dir_vec_xy[0];
  res_top = res_top / Math.sqrt(dir_vec_xy[0] ** 2 + dir_vec_xy[1] ** 2);

  let vec_length = Math.sqrt(dir_vec_xy.reduce((r, v) => r + v ** 2, 0));
  dir_vec_xy = dir_vec_xy.map((x) => x / vec_length * res_top);
  // Orthogonaler Vektor Weg vom Objekt
  return [dir_vec_xy[1], -dir_vec_xy[0]];
}

class Player extends Box {
  constructor(x_pos, y_pos, width, height) {
    super(true);
    this.x_pos = x_pos;
    this.y_pos = y_pos;
    this.width = width;
    this.height = height;
    this.color = "blue";
    this.y_speed = 0;
    this.x_speed = 0;
    this.images = null;
	this.jumpImg = null;
    this.canJump = false;
	this.lifes  = 3;
    this.i = 0;
  }

  draw(canvasContext) {
    if (this.canJump) {
      canvasContext.drawImage(this.images[Math.floor(this.i)], this.x_pos, this.y_pos, this.width, this.height);
	  // assume that images show two steps -> x width of movement// assume for 60fps
      this.i =(this.i + (this.x_speed *(1/60)*this.images.length)/(1.5*this.width))% (this.images.length);

      return;
    }
	var jump = this.images[0];
	if (this.jumpImg !=null){
			jump = this.jumpImg;
	}
    canvasContext.drawImage(jump, this.x_pos, this.y_pos, this.width, this.height);
  }

  update(dt, playerSpeedUp) {
    // forces changing speed
    this.y_speed = this.y_speed + grav * dt;
  }


  jump() {
    if (this.canJump == false) {
      return;

    }

    let e = new CustomEvent("jump", { time: this.playTime });
    window.dispatchEvent(e);
    this.y_speed -= jump_speed;
    this.canJump = false;
  }
  /*
    move(){
      this.x_pos =(this.x_pos+ this.x_speed) % canvas.width;
      this.y_pos = (this.y_pos+ this.y_speed) % canvas.height;
      this.x_speed = player_speed;
    }
  */

  collide(angle) {
    // collision only effects the drawable for now
    if (angle[1] < 0) {
      this.canJump = true;
    }
    let speed = [this.x_speed, this.y_speed];
    //  get the projection of the speed on the normalized normal vector of the vertice
    let dot_product = speed.reduce((sum, x, i) => sum + x * angle[i], 0);
    if (dot_product < 0) {
      let length_squared = angle.reduce((sum, x) => sum + x ** 2, 0);
      let projected = angle.map((x) => x * dot_product / length_squared);
      let new_speed = speed.map((x, i) => x - projected[i]);
      this.x_speed = new_speed[0];
      this.y_speed = new_speed[1];
    }
    // reset_state object to border of collision
    this.x_pos += angle[0];
    this.y_pos += angle[1];
  }
}

function leftTurn(vector) {
  // return the 90° left turned vector for the display ax-system, e.g. y axis
  // goes down
  return [vector[1], -vector[0]]
}
function verticeToVector(vert) {
  return [vert[1][0] - vert[0][0], vert[1][1] - vert[0][1]];

}
function dotProduct(vec1, vec2) {
  return vec1.reduce((sum, x, i) => sum + x * vec2[i], 0);

}
function cycle(i, len) {
  let k = i % len;
  while (k < 0) {
    k += len;
  }
  return k;

}
function vecLength(vec) {
  return Math.sqrt(vec.reduce((sum, x) => sum + x * x));
}
class Checkpoint {
  constructor(gamestate) {
    this.x_pos = gamestate.x_pos;
    this.background_x = gamestate.background_x;
    this.y_pos = gamestate.player.y_pos;
    this.x_speed = gamestate.player.x_speed;
    this.y_speed = gamestate.player.y_speed;
    this.playTime = gamestate.playTime;
    this.drawables = deepcopyDrawables(gamestate.drawables);
    this.checkPoints = gamestate.checkPoints;
  }
}

function deepcopyDrawables(drawables) {
  let new_drawables = []
  for (const drawable of drawables) {
    if (drawable instanceof Box) {
      let b = new Box(
        drawable.x_pos,
        drawable.y_pos,
        drawable.width,
        drawable.height,
      )
      b.images = drawable.images;
      new_drawables.push(b);
    }
    if (drawable instanceof Text) {
      let t = new Text(
        drawable.text,
        drawable.x_pos,
        drawable.y_pos,
        drawable.textSize
      )
      new_drawables.push(t);
    }
  }
  return new_drawables;

}


function generatelevel(gamestate) {
	gamestate.player.y_pos = 200;
	gamestate.player.x_pos = 100;
	gamestate.x_pos = 0 ;
      gamestate.drawables = [];
      if (svgDoc == null) {
        let new_box = new Box(0, 750, 50000,150)
        new_box.images =[gamestate.textureImg];
        gamestate.addDrawable(new_box);
        for (let i=1; i<50; i++){
           gamestate.addDrawable(new Text("Jump", i*600,500, 40));
        }
        gamestate.addDrawable(new Text("RLI-Claus needs your help to bring the many great decarbonisation", 200,100, 40));
        gamestate.addDrawable(new Text("concepts that his little helpers have produced in his workshop ", 200,100+50, 40));
        gamestate.addDrawable(new Text("in icy adlershof to the people.", 200,100+100, 40));
        return
        }
      let boxes = generateXmlLevel(svgDoc);
      this.gamestate.checkPoints = [];
      gamestate.addCheckpoint(0);
      gamestate.addCheckpoint(3000);
      gamestate.addCheckpoint(6000);
      let offset = 0;
      for (const box of boxes) {
        let new_box = new Box(box.x-offset, box.y, box.width, box.height);
        new_box.images =[gamestate.textureImg];
        gamestate.addDrawable(new_box);
      }
    }
