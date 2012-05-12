Crafty.scene('main-world', function() {
  ABGame.world = Crafty.e('ABWorld');
  
  $("#intro_"+ABGame.disaster).toggle();
});

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
    return "";
  }
});

$('.intros > *').live('click', function(el){
  $(this).toggle();
});