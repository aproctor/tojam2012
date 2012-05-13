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
    this.region = region;
    this.stats = region.statsEn;
    
    var buffer = [];
    
    buffer.push('<div id="reg_stats_');
    buffer.push(region.reference);
    buffer.push('" class="ABRegStats">');
    buffer.push('<a href="#" style="float: right;" onclick="ABGame.world.selectRegion();">World</a>');
    buffer.push('<h3>');
    buffer.push(region.title.toLowerCase());
    buffer.push('</h3>');
    buffer.push('<div class="stats total">Total population: <em>');
    buffer.push(region.population);
    buffer.push('</em></div>');
    buffer.push('<div class="stats converted">Converted: <em>');
    //TODO buffer.push(10,000
    buffer.push('</em></div>');
    buffer.push('<div class="stats disb">Disbelievers: <em>');
    //TODO buffer.push(30,000
    buffer.push('</em></div>');
    buffer.push('<div class="stats unexposed">Unexposed: <em>');
    //TODO buffer.push(26,000,000
    buffer.push('</em></div>');
    buffer.push('<div class="stats ratio">Conv. Rate: <em>');
    //TODO buffer.push(0.75
    buffer.push('</em></div>');
    buffer.push('<h4>actions</h4>');
    buffer.push('<div class="actions">');
    
    
    for(var c in ABGame.COMMS) {
      buffer.push(ABGame.COMMS[c].renderLink(false));
    }

    buffer.push('</div></div>');
    
    $('body').append(buffer.join(''));
    
    return this;
  }
});


$('.intros > *').live('click', function(el){
  $(this).toggle();
});