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
  init: function() {
    this.attr({
      visible: false
    });
  },
  
  setup: function(attrs) {
    this.attr(attrs);
  },
  
  
  
  toString: function() {
    return "ABRegStats";
  }
});

$('.intros > *').live('click', function(el){
  $(this).toggle();
});