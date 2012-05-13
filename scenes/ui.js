Crafty.c("ABDisasterChoice", {
  ref: null,
  icon: null,
  
  init: function() {
    this.addComponent("2D, DOM, Mouse");
    this.attr({w: 6*32, h: 5*32});
    
    this.bind("Click", function() {
      ABGame.chooseDisaster(this.ref);
    });
  },
  
  setup: function(ref, attrs) {
    this.ref = ref;
    if(attrs) {
      this.attr(attrs);
    }
    return this;
  },
  
  toString: function() {
    return "ABDisasterChoice";
  }
});

Crafty.c("ABRegStats", {
  region: null,
  stats: null,
  statBoxEl: null,
  
  init: function() {
  },
  
  setup: function(region) {
    var ref = null;
    var global = true;
    if(region) {
      ref = region.reference;
      this.region = region;
      this.stats = region.statsEn;
      global = false;
    }
    
    var buffer = [];
    
    buffer.push('<div id="reg_stats_');
    if(!global) {
      buffer.push(ref);
    }
    buffer.push('" class="ABRegStats">');
    if(!global) {
      buffer.push('<a class="worldLink" href="#" style="float: right;" onclick="ABGame.world.selectRegion();">World</a>');
    }
    buffer.push('<h3>');
    if(global) {
      buffer.push("world");
    } else {
      buffer.push(region.title.toLowerCase());
    }
    buffer.push('</h3>');
    buffer.push('<div class="stats total">Total population: <em>');
    if(global) {
      buffer.push(ABGame.world.population.formatMoney(0,'.',','));
    } else {
      buffer.push(region.population.formatMoney(0,'.',','));
    }
    buffer.push('</em></div>');
    buffer.push('<div class="stats converted">Converted: <em>');
    buffer.push(0);
    buffer.push('</em></div>');
    buffer.push('<div class="stats disb">Disbelievers: <em>');
    buffer.push(0);
    buffer.push('</em></div>');
    buffer.push('<div class="stats unexposed">Unexposed: <em>');
    if(global) {
      buffer.push(ABGame.world.population.formatMoney(0,'.',','));
    } else {
      buffer.push(region.population.formatMoney(0,'.',','));
    }
    buffer.push('</em></div>');
    if(!global) {
      buffer.push('<div class="stats ratio">Conv. Rate: <em>');
      buffer.push(0.2);
      buffer.push('</em></div>');
    }
    buffer.push('<h4>communications</h4>');
    buffer.push('<div class="actions">');
    
    
    for(var c in ABGame.COMMS) {
      buffer.push(ABGame.COMMS[c].renderLink(ref));
    }

    buffer.push('</div></div>');
    
    $('body').append(buffer.join(''));
    
    return this;
  }
});


$('.intros > *').live('click', function(el){
  $(this).toggle();
});