const ALIENS_SPEED = 0.004;
const BULLETS_SPEED = 0.009;
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
class SpaceInvaders {
	constructor(ctx, ship_img, invader_img, bullet_img, save_ship_url, ship_position){
		this.new_game(ship_position);
		this.ctx = ctx;
		this.ship_img = ship_img;
		this.invader_img = invader_img;
		this.bullet_img = bullet_img;
		this.last_frame_timestamp = 0;
		this.save_ship_url = save_ship_url;
		requestAnimationFrame(this.step.bind(this));
	}
	new_game(ship_position) {
		this.bullets = [];
		this.dims = [25, 25];
		this.gamesize = 400;
		this.ship = ship_position === undefined  ? {x: 5, y:23} : ship_position;
		let x_pos, y_pos = 0;
		this.aliens = Array.from(Array(20), (x, index) => {
			if(index % 5 == 0){
				x_pos = 4;
				y_pos += 2;
			};
			let alien = {
				x:  x_pos,
				y: y_pos
			}
			x_pos += 4;
			return alien;
		})
		this.aliens_moves = 4;
		this.aliens_direction = 1;
	}

	step(timestamp){
		const delta_time = timestamp - this.last_frame_timestamp;
		this.move_bullets(delta_time);
		this.move_aliens(delta_time);
		this.alien_collisions();
		this.draw();
		this.last_frame_timestamp = timestamp;
		requestAnimationFrame(this.step.bind(this));
	}

	move_aliens(delta_time){
		const [dimx] = this.dims;
		const delta_position = delta_time * ALIENS_SPEED;
		this.aliens.map(e => {
			e.x += this.aliens_direction * delta_position;
			return e;
		});
		const aliens_out_of_game = this.aliens.filter(a => a.x > dimx || a.x < 0);
		this.aliens_direction = aliens_out_of_game.length > 1 ? this.aliens_direction * -1 : this.aliens_direction;
	}
	move_bullets(delta_time){
		const delta_position = delta_time * BULLETS_SPEED;
		this.bullets = this.bullets.map(b => {
			b.y -= delta_position;
			return b;
		});
		this.bullets = this.bullets.filter(b => b.y > 0);
	}


	move_ship(direction) {
		if (!direction) return;
		let new_position = this.ship.x + direction;
		this.ship.x = new_position < 24 && new_position >= 0 ? new_position : this.ship.x;
		this.save_ship_position();
	}

	save_ship_position(){
		fetch(this.save_ship_url, {
			body: JSON.stringify(this.ship),
			credentials: "same-origin",
            headers: {
                "X-CSRFToken": getCookie("csrftoken"),
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: 'POST'
		})
	}

	collide_with_alien(bullet){
		const box_size = 2;
		this.aliens = this.aliens.filter(a => {
			let conditions = [bullet.x > a.x - box_size,
			 				bullet.x < a.x + box_size,
			 				bullet.y > a.y -box_size,
			 				bullet.y < a.y + box_size];
			return !conditions.every(e => e)
		})

	}

	alien_collisions(){
		this.bullets.map(b => {
			this.collide_with_alien(b);
		})
	}


	add_bullet(){
		if(this.bullets.length > 5) return;
		let {x , y} = this.ship;
		this.bullets.push({x: x, y: y});
	}
	draw() {
		this.ctx.clearRect(0, 0, this.gamesize + 11, this.gamesize + 11);
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0, 0, this.gamesize +11 , this.gamesize +11);
		let dimx, dimy, sx, sy;
		[dimx, dimy] = this.dims;
		sx = (this.gamesize / dimx);
		sy = (this.gamesize / dimy);
		this.ctx.strokeRect(10, 10, this.gamesize, this.gamesize)
		this.ctx.drawImage(this.ship_img, 10 + sx * this.ship.x, 10 + sy * this.ship.y)
		this.aliens.map(alien => {
			this.ctx.drawImage(this.invader_img, 10 + sx * alien.x, 10 + sy * alien.y)
		})
		this.bullets.map(bullet => {
			this.ctx.drawImage(this.bullet_img, 10 + sx * bullet.x, 10 + sy * bullet.y);
		})
	}
	keypress(event) {
		if(event.keyCode === 32){
			this.add_bullet();
		}else{
			this.move_ship({
				37: -1, // Left
				39: 1, // Right
			}[event.keyCode]);
		}
	}
}