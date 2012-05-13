Crafty.c("ABMeter", {
  
  init: function() {
    this.addComponent("2D, DOM, Color");
    
    this.attr({
      min_val: 0,
      max_val: 300,
      init_val: 0,
      h: 28,
      x: 5*32+2,
      y: 15*32+2,
      z: 100,
      val: 0,
      w: 0,
      max_width: 16*32 - 4,
      barcolor: 'lightGreen'
    });
  },
  
  start: function(color, attrs) {
    if(attrs) {
      this.attr(attrs);
    }
    
    this.val = this.attr('init_val');
    
    var border = 2;
    Crafty.e("2D, DOM, Color").attr({w: this.w+2*border, h: this.h+2*border, x: this.x-border, y: this.y-border, z: 1}).color("#000000");
    this.color(this.attr('barcolor'));
    
    return this;
  },
  
  deltaVal: function(amt) {
    var target = this.val + amt;
    if(target < this.min_val) {
      target = this.min_val;
    }
    if(target > this.max_val) {
      target = this.max_val;
    }
    this.setVal(target);
  },
  
  setVal: function(amt) {
    if(this.val != amt) {
      this.val = amt;
      var pct = (amt - this.min_val) * 1.0 / (this.max_val - this.min_val);
      this.w = pct * this.max_width;
    }
  },
  
  toString: function() {
    return "ABMeter";
  }
});
















/**@
* #Image
* @category Graphics
* Draw an image with or without repeating (tiling).
*/
Crafty.c("MaskImage", {
	_repeat: "repeat",
	ready: false,

	init: function () {
		var draw = function (e) {
			if (e.type === "canvas") {
				//skip if no image
				if (!this.ready || !this._pattern) return;

				var context = e.ctx;

				context.fillStyle = this._pattern;

				//context.save();
				//context.translate(e.pos._x, e.pos._y);
				context.fillRect(this._x, this._y, this._w, this._h);
				//context.restore();
			} else if (e.type === "DOM") {
				if (this.__image) {
				  $(e).css('-webkit-mask-image',"url('" + this.__image + "') ");
			  }
			}
		};

		this.bind("Draw", draw).bind("RemoveComponent", function (id) {
			if (id === "Image") this.unbind("Draw", draw);
		});
	},

	/**@
	* #.image
	* @comp Image
	* @trigger Change - when the image is loaded
	* @sign public this .image(String url[, String repeat])
	* @param url - URL of the image
	* @param repeat - If the image should be repeated to fill the entity.
	* Draw specified image. Repeat follows CSS syntax (`"no-repeat", "repeat", "repeat-x", "repeat-y"`);
	*
	* *Note: Default repeat is `no-repeat` which is different to standard DOM (which is `repeat`)*
	*
	* If the width and height are `0` and repeat is set to `no-repeat` the width and
	* height will automatically assume that of the image. This is an
	* easy way to create an image without needing sprites.
	* @example
	* Will default to no-repeat. Entity width and height will be set to the images width and height
	* ~~~
	* var ent = Crafty.e("2D, DOM, Image").image("myimage.png");
	* ~~~
	* Create a repeating background.
	* ~~~
	* var bg = Crafty.e("2D, DOM, Image")
	*              .attr({w: Crafty.viewport.width, h: Crafty.viewport.height})
	*              .image("bg.png", "repeat");
	* ~~~
	* @see Crafty.sprite
	*/
	image: function (url, repeat) {
		this.__image = url;
		this._repeat = repeat || "no-repeat";


		this.img = Crafty.assets[url];
		if (!this.img) {
			this.img = new Image();
			Crafty.assets[url] = this.img;
			this.img.src = url;
			var self = this;

			this.img.onload = function () {
				if (self.has("Canvas")) self._pattern = Crafty.canvas.context.createPattern(self.img, self._repeat);
				self.ready = true;

				if (self._repeat === "no-repeat") {
					self.w = self.img.width;
					self.h = self.img.height;
				}

				self.trigger("Change");
			};

			return this;
		} else {
			this.ready = true;
			if (this.has("Canvas")) this._pattern = Crafty.canvas.context.createPattern(this.img, this._repeat);
			if (this._repeat === "no-repeat") {
				this.w = this.img.width;
				this.h = this.img.height;
			}
		}


		this.trigger("Change");

		return this;
	}
});