/*
 * Define a custom player component
 */
Crafty.c("ABPlayer", {
     init: function() {
         this.addComponent("2D, DOM, Color, Collision, Multiway, Keyboard, Gravity, Jumper, SpriteAnimation, sandSpr")
         this.w = 75;    // width
         this.h = 75;    // height
         this.color("#FF0000");
         
         this.multiway(4, {LEFT_ARROW: 180, RIGHT_ARROW: 0, A: 180, D: 0});
         this.lives = ABGame.max_lives;
                  
         /*
          * Player state
          */
         this.max_hp = 1000.0;
         
         this.health_bar = Crafty.e("ABPlayerHealth");
         
         this.flipped = false;         
         this.sandTickRate = 2;
         
         
         this.gravity("ABPlatform");
         this.jumper();
        
         this.bind("EnterFrame", this._playerEnterKeyFrame);
         
         this.bind("JumpEnd", this.flipp);
         
         this.origin(this.w / 2, this.h / 2);
         
         this.animate('SandTick', 0, 0, 10);
         //this.animate('SandTick',30,0, -1);
         
         this.spawn();
         
         this.onHit('ABPlatform', function() {
           this.x -= this._movement.x;
           this.y -= this._movement.y;
         });
    },

    /* 
     *  Player entity update loop
     */
    _playerEnterKeyFrame: function () {
      
      if(this._jumping == false) {      
         this.harm(this.sandTickRate);
      }
      
      
      var hpRatio = this.cur_hp / this.max_hp;
      this.health_bar.setHp(hpRatio);      
      
      var frameSize = this.w;
     this.__coord[0] = Math.round(hpRatio * 10) * frameSize;
           
      if(this.cur_hp <= 0) {
        this.kill();
      }
    },
     
     
     harm: function(harmVal) {
       this.cur_hp -= harmVal;
     },
     
     flipp: function() {
       this.flipped = !this.flipped;
       //invert HP
       this.cur_hp = (this.max_hp - this.cur_hp);
       
       //this.rotation = (this.flipped)?180:0;
     },
     
     kill: function() {
       console.log('kill');
       ABGame.cur_lives -= 1;
       if(ABGame.cur_lives < 0) {
         ABGame.gameOver();
         ABGame.cur_lives = ABGame.max_lives;
       } else {
         ABGame.restartScene();
       }
     },
     
     spawn: function() {
      this.x = 10;
      this.y = ABGame.height - this.h - ABGame.grid_size;
      this.cur_hp = this.max_hp * 0.6;
     },
     
     
     toString: function() {
       return "ABPlayer";
     }
});




Crafty.c("ABPlayerHealth", {
  
  init: function() {
    this.addComponent("2D, DOM, Color");
    
    this.max_width = 300;
    this.w = this.max_width;
    this.h = 20;
    this.x = 15;
    this.y = 15;
    this.z = 100;
    
    this.color("#D5BD73")
    
    var border = 2;
    Crafty.e("2D, DOM, Color").attr({w: this.w+2*border, h: this.h+2*border, x: this.x-border, y: this.y-border, z: 1}).color("#000000");
  },
  
  setHp: function(hpRatio) {
    this.w = hpRatio * this.max_width;
  },
  
  toString: function() {
    return "hpbar";
  }
  
});







/**
 *
 */
Crafty.c("Jumper", {
    init: function() {
      this.addComponent('Tween');
      this.requires("Keyboard");
      this.jumpSpeed = 6;
      this._jumping = false;
      this._jy = 0;
      this.hangtime = 25;
      this._anti = null;
    },
     
    jumper: function(comp, jumpSpeed) { 
      this._anti = comp || this._anti;
      
      this.jumpSpeed = jumpSpeed || this.jumpSpeed;
      
      this.bind("KeyDown", function() {
        if(this.isDown("UP_ARROW") || this.isDown("W") || this.isDown("SPACEBAR")) {
          this.jump();
         }
      });
      
      /*
       * Update keyframes
       */
      this.bind("EnterFrame", this._jumperEnterKeyFrame);
    },
    
    _jumperEnterKeyFrame: function () {
      if(--this._jumpframes <= 0) {
        this.rotation = 0;
        this.stopJump();
        return;
      }
      
			if (this._jumping === true) {
				this._jy = this.jumpSpeed;
				this.y -= this._jy;
			} else {
  			this._jy = 0;
  			return;
  		}
  		
  		

      /* Project into the future to see if this jump will hit a platform */
  		var pos = this.pos();
  		pos._y--;
  		pos.x = pos._x;
  		pos.y = pos._y;
  		pos.w = pos._w;
  		pos.h = pos._h;
  		
  		var hit = false;
  		var q = Crafty.map.search(pos);
  		for (var i = 0; i < q.length; i++) {
  		  var obj = q[i];
  		  
  			//check for an intersection directly below the player
  			if (obj !== this && obj.has(this._anti) && obj.intersect(pos)) {
  				hit = obj;
  				//hit.color("#FFFFFF")
  				break;
  			}
  		}
  		
  		if(hit) {
  		  this.stopJump();
  		}
		},
    
    jump: function() {
      if(this._falling === false && this._jumping === false) {
        this._jumpframes = this.hangtime;
        this.trigger('Jumped');
        this._jumping = true;
        var self = this;
        
        var factor = (this._movement && this._movement.x < 0)? -1 : 1;
        this.tween({rotation: 180*factor}, this.hangtime);
      }
    },
    
    stopJump: function() {
      if(this._jumping === true) {
        this._jumping = false;
        this.trigger('JumpEnd');
        this._gy = 0;
      }
      
    },
    
		toString: function() {
		  return "Jumper";
		}
});


 