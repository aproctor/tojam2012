var POPULATION_UNIT = 1000000;

Crafty.c("ABWorld", {
  regions: null,
  time_bar: null,
  population: 0,
  statsViewEn: null,
  
  init: function() {
    this.addComponent("2D, DOM, Image");
    this.attr({x: 0, y: 0, w: ABGame.width, h: ABGame.height});
    this.image(ABGame.ASSETS.tile, "repeat");
    
    this.regions = {};
    this.regions.NA = Crafty.e('ABRegNA').updateConvRate();
    this.regions.MA = Crafty.e('ABRegMA').updateConvRate();
    this.regions.SA = Crafty.e('ABRegSA').updateConvRate();
    
    this.regions.AF = Crafty.e('ABRegAF').updateConvRate();
    
    this.regions.EU = Crafty.e('ABRegEU').updateConvRate();
    this.regions.RU = Crafty.e('ABRegRU').updateConvRate();
    this.regions.MEA = Crafty.e('ABRegMEA').updateConvRate();
    
    this.regions.DU = Crafty.e('ABRegDU').updateConvRate();
    
    this.time_bar = Crafty.e('ABMeter').start({x: 10, y: 600}).bind('MeterFill', function() {
      this.unbind("EnterFrame", this._ABWorld_enterframe);
      ABGame.world.selectRegion();
      ABGame.nextScene();
    });
    
    for(var r in this.regions) {
      this.regions[r].setup();
      this.population += this.regions[r].population;
    }
    
    this.bind("EnterFrame", this._ABWorld_enterframe);
  },
  
  setup: function() {
    this.statsViewEn = Crafty.e("ABRegStats").setup();
    this.selectRegion();
  },
  
  selectedRegionRef: null,
  selectRegion: function(ref) {
    $('.ABRegStats.vis').removeClass('vis');

    $('#reg_stats_'+(ref||"")).addClass('vis');    
    
    this.selectedRegionRef = ref || null;
  },
  
  
  wtick: 0,
  lastFrame: 0,
  _ABWorld_enterframe: function (e) {
    if(e.frame - this.lastFrame >= 15) {
      this.lastFrame = e.frame;
      this.wtick += ABGame.tickRate;
      
      this.time_bar.deltaVal(ABGame.tickRate);
      
      var totalConverted = 0;
      var totalDismissed = 0;
      
      for(var i in this.regions) {
        var r = this.regions[i];
        
        r._reg_tick();
        
        totalConverted += r.num_converted;
        totalDismissed += r.num_denying;
        
        /*
         * Set Region color based on stats
         */
        if(ABGame.DEBUG.prettyMode === true) {
          var h = 20 + Math.random()*150;
          var s = 100;
          var l = 65 + Math.random()*8;
          r.color('hsl('+h+','+s+'%,'+l+'%)');
        } else {
          var h = ((135) * r.conv_rate) + 0;
          var s = 96;
          var l = 55 + Math.random()*8;
          if(r.regSelected && r.regSelected()) {
            l += 20;
            /*h = 3;
            s = 100;
            l = 74 + Math.random()*8;*/
          }
          r.color('hsl('+h+','+s+'%,'+l+'%)');
        }        
      }
      
      /*
       * Update Global Stats
       */
      if(this.selectedRegionRef == null) {
        //totalConverted
        //totalDismissed
        var pref = "#reg_stats_";
        $(pref + ' .converted em').html(totalConverted.formatMoney(0,'.',','));
        $(pref + ' .disb em').html(totalDismissed.formatMoney(0,'.',','));
        $(pref + ' .unexposed em').html((this.population - (totalDismissed + totalConverted)).formatMoney(0,'.',','));
      }
      
      if(this.population - (totalDismissed + totalConverted) <= 0) {
        this.trigger("WorldExposed");
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
    conv_rate: 0.2,
  
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
      
      ABGame.campaign.chargeMoney(-1 * this.num_converted * ABGame.GOLD_PER_CONV);
      
      if(this.regSelected()) {
        /* update view components */
        var pref = "#reg_stats_"+this.reference;
        $(pref + ' .converted em').html(this.num_converted.formatMoney(0,'.',','));
        $(pref + ' .disb em').html(this.num_denying.formatMoney(0,'.',','));
        $(pref + ' .unexposed em').html((this.population - this.num_exposed).formatMoney(0,'.',','));
        $(pref + ' .ratio em').html(this.conv_rate.formatMoney(2,'.',','))
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
    
    updateConvRate: function() {
      var stats = this.statsEn.compound(ABGame.campaign);
      var val = 0;
      var pos = 0;
      var neg = 0;
      for(var s in stats) {
        var v = stats[s] * (this.dispoStats.attr(s) || 0);
        if(v < 0) {
          neg += -1*v;
        } else {
          pos += v;
        }
        val += v;
      }
      var size = pos + neg;
      if(size != 0) {
        var mult = (val < 0)       
        var newConv = pos / size * 0.7;
        this.conv_rate = newConv;
      }
      
      return this;
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
      this.attr({x: 258, y: 194, population: 400*POPULATION_UNIT});
      this.dispoStats = Crafty.e("ABStats").updateStats(ABGame.TAGS.rel).updateStats(ABGame.TAGS.simple);
    }
});

Crafty.c("ABRegEU", {
    init: function() {
      this.addComponent("ABRegion");
      this.reference = "EU";
      this.setTitle("Euro");
      this.attr({x: 282, y: 93, population: 300*POPULATION_UNIT});
      this.dispoStats = Crafty.e("ABStats").updateStats(ABGame.TAGS.lib).updateStats(ABGame.TAGS.free).updateStats(ABGame.TAGS.cor);
    }
});

Crafty.c("ABRegRU", {
    init: function() {
      this.addComponent("ABRegion");
      this.reference = "RU";
      this.setTitle("Russia");
      this.attr({x: 386, y: 88, population: 400*POPULATION_UNIT});
      this.dispoStats = Crafty.e("ABStats").updateStats(ABGame.TAGS.cor).updateStats(ABGame.TAGS.cor);
    }
});

Crafty.c("ABRegMEA", {
    init: function() {
      this.addComponent("ABRegion");
      this.reference = "MEA";
      this.setTitle("Mid.&nbsp;East&nbsp;Asia");
      this.attr({x: 357, y: 168, population: 5000*POPULATION_UNIT});
      this.dispoStats = Crafty.e("ABStats").updateStats(ABGame.TAGS.rel).updateStats(ABGame.TAGS.rel).updateStats(ABGame.TAGS.crazy);      
    }
});

Crafty.c("ABRegDU", {
    init: function() {
      this.addComponent("ABRegion");
      this.reference = "DU";
      this.setTitle("Australia");
      this.attr({x: 521, y: 237, population: 30*POPULATION_UNIT, t_xoffset: 0, t_yoffset: 85});
      this.dispoStats = Crafty.e("ABStats").updateStats(ABGame.TAGS.con).updateStats(ABGame.TAGS.simple);
    }
});
