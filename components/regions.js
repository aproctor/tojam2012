var POPULATION_UNIT = 1000000;

Crafty.c("ABWorld", {
  regions: null,
  time_bar: null,
  population: 0,
  
  init: function() {
    this.addComponent("2D, DOM, Image");
    this.attr({x: 0, y: 0, w: ABGame.width, h: ABGame.height});
    this.image(ABGame.ASSETS.tile, "repeat");
    
    this.regions = {};
    this.regions.NA = Crafty.e('ABRegNA');
    this.regions.MA = Crafty.e('ABRegMA');
    this.regions.SA = Crafty.e('ABRegSA');
    
    this.regions.AF = Crafty.e('ABRegAF');
    
    this.regions.EU = Crafty.e('ABRegEU');
    this.regions.RU = Crafty.e('ABRegRU');
    this.regions.MEA = Crafty.e('ABRegMEA');
    
    this.regions.DU = Crafty.e('ABRegDU');
    
    this.time_bar = Crafty.e('ABMeter').start({x: 10, y: 600});
    
    for(var r in this.regions) {
      this.regions[r].setup();
      this.population += this.regions[r].population;
    }
    
    this.bind("EnterFrame", this._ABWorld_enterframe);
  },
  
  selectedRegionRef: null,
  selectRegion: function(ref) {
    //TODO if null, set world stats
    $('.ABRegStats.vis').removeClass('vis');

    $('#reg_stats_'+ref||"world").addClass('vis');    
    
    this.selectedRegionRef = ref || null;
  },
  
  
  wtick: 0,
  lastFrame: 0,
  _ABWorld_enterframe: function (e) {
    if(e.frame - this.lastFrame >= 15) {
      this.lastFrame = e.frame;
      this.wtick += ABGame.tickRate;
      
      this.time_bar.deltaVal(ABGame.tickRate);
      
      for(var i in this.regions) {
        var r = this.regions[i];
        
        r._reg_tick();
        
        /*
         * Set Region color based on stats
         */
        if(ABGame.DEBUG.prettyMode === true) {
          var h = 20 + Math.random()*150;
          var s = (90 - 40)*(this.wtick / 500) + 40;
          var l = 65 + Math.random()*8;
          r.color('hsl('+h+','+s+'%,'+l+'%)');
        } else {
          var h = 62; /*45,  0 - 125*/
          var s = 96;
          var l = 65;
          if(r.regSelected && r.regSelected()) {
            l += 20;
          }
          r.color('hsl('+h+','+s+'%,'+l+'%)');
        }        
      }
    }
  },
  
  toString: function() {
    return "ABWorld<>";
  }
});

Crafty.c("ABRegion", {
    title: null,
    reference: null,
    titleEn: null,
    statsEn: null,
    statsViewEn: null,
    
    population: 1000000,
    num_exposed: 0,
    num_converted: 0,
    num_denying: 0,    
    exposure_rate: 0,
    conv_rate: 0.5,
  
    init: function() {
      this.addComponent("2D, DOM, MaskImage, Color, Mouse");     
      this.bind("Click", function(){
        ABGame.world.selectRegion(this.reference);
      });         
      this.attr({x: 0,
      	 y: 0,
      	 t_xoffset: 50,
         t_yoffset: 50
       });
      
      /*
       * Draw Func
       *
      var draw = function (e) {
			  $(e).css("opacity",""+Math.random());
  		};
  		this.bind("Draw", draw).bind("RemoveComponent", function (id) {
  			if (id === "Image") this.unbind("Draw", draw);
  		});*/
  		this.color('green');
      this.statsEn = Crafty.e("ABStats");
      this.statsViewEn = Crafty.e("ABRegStats");
    },
    
    _reg_tick: function() {
      var pop = this.exposure_rate * ABGame.tickRate;
      if(this.num_exposed + pop > this.population) {
        pop = this.population - this.num_exposed;
      }
      var converted = Math.floor(pop * this.conv_rate);
      this.num_converted += converted;
      this.num_denying += pop - converted;
      
      this.num_exposed += pop;
      
      console.log(this.num_converted);
      
      ABGame.campaign.chargeMoney(-1 * this.num_converted * ABGame.GOLD_PER_CONV);
      
      if(this.regSelected()) {
        /* update view components */
      }
    },
    
    setup: function() {
       this.image(ABGame.ASSETS[this.reference]);
       this.titleEn = Crafty.e("ABRegText");
       this.titleEn.text(this.title);
       this.titleEn.setup(this);
       this.statsViewEn.setup(this);
    },
    
    regSelected: function() {
    	return ABGame.world.selectedRegionRef == this.reference;
    },
    
    
    setTitle: function(t) {
      this.title = t;
    },
       
    toString: function() {
      return this.title;
    }
});

Crafty.c("ABRegText", {
  region: null,
  
  init: function() {
    this.addComponent("DOM, Text");
    this.textColor("blue")
  },
  setup: function(region) {
    this.region = region;
    this.attr({x: region._x + region.t_xoffset, y: this.region._y + region.t_yoffset});
  }
});

/*
 * DISCLAIMER: The stats bellow do not represent any political views or personal opinions
 * they are just for a simulation and parody.  Please don't be upset as numbers have been
 * thrown around for balance and effect rather than any real world similarity.
 */
Crafty.c("ABRegNA", {
    init: function() {
      this.addComponent("ABRegion");
      this.reference = "NA";
      this.setTitle("N.&nbsp;Amer");
      this.attr({x: 1, y: 87, population: 80*POPULATION_UNIT});
      this.dispoStats = Crafty.e("ABStats").updateStats(ABGame.TAGS.lib).updateStats(ABGame.TAGS.crazy);
    }
});

Crafty.c("ABRegMA", {
    init: function() {
      this.addComponent("ABRegion");
      this.reference = "MA";
      this.setTitle("Mid.&nbsp;Amer");
      this.attr({x: 33, y: 175, population: 160*POPULATION_UNIT});
      this.dispoStats = Crafty.e("ABStats").updateStats(ABGame.TAGS.con).updateStats(ABGame.TAGS.rel).updateStats(ABGame.TAGS.crazy);
    }
});

Crafty.c("ABRegSA", {
    init: function() {
      this.addComponent("ABRegion");
      this.reference = "SA";
      this.setTitle("S.&nbsp;Amer");
      this.attr({x: 105, y: 254, population: 200*POPULATION_UNIT});
      this.dispoStats = Crafty.e("ABStats").updateStats(ABGame.TAGS.rel).updateStats(ABGame.TAGS.crazy);
    }
});

Crafty.c("ABRegAF", {
    init: function() {
      this.addComponent("ABRegion");
      this.reference = "AF";
      this.setTitle("Africa");
      this.attr({x: 258, y: 194, population: 300*POPULATION_UNIT});
      this.dispoStats = Crafty.e("ABStats").updateStats(ABGame.TAGS.rel).updateStats(ABGame.TAGS.simple);
    }
});

Crafty.c("ABRegEU", {
    init: function() {
      this.addComponent("ABRegion");
      this.reference = "EU";
      this.setTitle("Euro");
      this.attr({x: 282, y: 93, population: 200*POPULATION_UNIT});
      this.dispoStats = Crafty.e("ABStats").updateStats(ABGame.TAGS.lib).updateStats(ABGame.TAGS.free).updateStats(ABGame.TAGS.cor);
    }
});

Crafty.c("ABRegRU", {
    init: function() {
      this.addComponent("ABRegion");
      this.reference = "RU";
      this.setTitle("Russia");
      this.attr({x: 386, y: 88, population: 300*POPULATION_UNIT});
      this.dispoStats = Crafty.e("ABStats").updateStats(ABGame.TAGS.cor).updateStats(ABGame.TAGS.cor);
    }
});

Crafty.c("ABRegMEA", {
    init: function() {
      this.addComponent("ABRegion");
      this.reference = "MEA";
      this.setTitle("Mid.&nbsp;East&nbsp;Asia");
      this.attr({x: 357, y: 168, population: 500*POPULATION_UNIT});
      this.dispoStats = Crafty.e("ABStats").updateStats(ABGame.TAGS.rel).updateStats(ABGame.TAGS.rel).updateStats(ABGame.TAGS.crazy);      
    }
});

Crafty.c("ABRegDU", {
    init: function() {
      this.addComponent("ABRegion");
      this.reference = "DU";
      this.setTitle("Down&nbsp;Under");
      this.attr({x: 521, y: 237, population: 30*POPULATION_UNIT, t_xoffset: 0, t_yoffset: 85});
      this.dispoStats = Crafty.e("ABStats").updateStats(ABGame.TAGS.con).updateStats(ABGame.TAGS.simple);
    }
});
