var POPULATION_UNIT = 1000000;

Crafty.c("ABWorld", {
  regions: null,
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
    
    for(var r in this.regions) {
      this.regions[r].setup();
      this.population += this.regions[r].population;
    }
    
    this.bind("EnterFrame", this._ABWorld_enterframe);
  },
  
  selectedRegionRef: null,
  selectRegion: function(ref) {
    $('.ABRegStats.vis').removeClass('vis');

    $('#stats_'+ref).addClass('vis');    
    
    this.selectedRegionRef = ref;
  },
  
    
  i: 0,
  _ABWorld_enterframe: function () {
    console.log(this.i++);
	},
  
  toString: function() {
    return "ABWorld<>";
  }
});

Crafty.c("ABRegion", {
    title: null,
    reference: null,
    titleEn: null,
    
    population: 1,
    num_exposed: 0,
  
    init: function() {
      this.addComponent("2D, DOM, Image, Mouse");     
      this.bind("Click", function(){
        //click
        //alert(this.title);
      });         
      this.attr({x: 0, y: 0});
      
      /*
       * Draw Func
       *
      var draw = function (e) {
			  $(e).css("opacity",""+Math.random());
  		};
  		this.bind("Draw", draw).bind("RemoveComponent", function (id) {
  			if (id === "Image") this.unbind("Draw", draw);
  		});*/
    },
    
    setup: function() {
       this.image(ABGame.ASSETS[this.reference]);
       this.titleEn = Crafty.e("ABRegText");
       this.titleEn.text(this.title);
       this.titleEn.setup(this);
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
    this.attr({x: region._x + 50, y: this.region._y + 50});
  }
});

Crafty.c("ABRegNA", {
    init: function() {
      this.addComponent("ABRegion");
      this.reference = "NA";
      this.setTitle("N.&nbsp;Amer");
      this.attr({x: 0, y: 86, population: 80*POPULATION_UNIT});
    }
});

Crafty.c("ABRegMA", {
    init: function() {
      this.addComponent("ABRegion");
      this.reference = "MA";
      this.setTitle("Mid.&nbsp;Amer");
      this.attr({x: 33, y: 175, population: 160*POPULATION_UNIT});
    }
});

Crafty.c("ABRegSA", {
    init: function() {
      this.addComponent("ABRegion");
      this.reference = "SA";
      this.setTitle("S.&nbsp;Amer");
      this.attr({x: 105, y: 254, population: 200*POPULATION_UNIT});
    }
});

Crafty.c("ABRegAF", {
    init: function() {
      this.addComponent("ABRegion");
      this.reference = "AF";
      this.setTitle("Afrik");
      this.attr({x: 258, y: 194, population: 300*POPULATION_UNIT});
    }
});

Crafty.c("ABRegEU", {
    init: function() {
      this.addComponent("ABRegion");
      this.reference = "EU";
      this.setTitle("Euro");
      this.attr({x: 282, y: 93, population: 200*POPULATION_UNIT});
    }
});

Crafty.c("ABRegRU", {
    init: function() {
      this.addComponent("ABRegion");
      this.reference = "RU";
      this.setTitle("Russia");
      this.attr({x: 386, y: 88, population: 300*POPULATION_UNIT});
    }
});

Crafty.c("ABRegMEA", {
    init: function() {
      this.addComponent("ABRegion");
      this.reference = "MEA";
      this.setTitle("Mid.&nbsp;East&nbsp;Asia");
      this.attr({x: 357, y: 168, population: 500*POPULATION_UNIT});
    }
});

Crafty.c("ABRegDU", {
    init: function() {
      this.addComponent("ABRegion");
      this.reference = "DU";
      this.setTitle("Down&nbsp;Under");
      this.attr({x: 521, y: 237, population: 30*POPULATION_UNIT});
    }
});
