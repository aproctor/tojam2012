Crafty.c("ABCampaign", {
  ref: null,
  
  init: function() {
    this.addComponent("ABStats");
    this.ref = '';
    
  },
  
  start: function(ref, attrs) {
    this.ref = ref;
    this.attr(attrs || {});
    this.getInitStatsForRef(this.ref);
    
    return this;
  },
  
  getInitStatsForRef: function(ref) {
    if(ref == "alien") {
      this.updateStats(ABGame.TAGS.crazy);
    } else if(ref == "com") {
      this.updateStats(ABGame.TAGS.con);
    } else if(ref == "moral") {
      this.updateStats(ABGame.TAGS.rel);
    } else if(ref == "nuke") {
      this.updateStats({
         p: -2
      });    
    } else if(ref == "rap") {
      this.updateStats({
         i: -1,
         l: 1
      });
    } else if(ref == "warm") {
    }
  },
  
  toString: function() {
    return "Campaign";
  }
});

Crafty.c("ABStats",{
  p: 0, /* politics */
  l: 0, /* loyalty */
  i: 0, /* intelligence */
  
  init: function() {
  },  
  
  getRatio: function() {
    var sum = Math.
    return {s: sum, v: val};
  },
  
  updateStats: function(anotherStats) {
     this.p += anotherStats.p || 0;
     this.l += anotherStats.l || 0;
     this.i += anotherStats.i || 0;
     
     return this;
  },
  
  /**
   * Combine for a result, but don't update stats
   */
  compound: function(anotherStats) {
    return {
      p: this.p + anotherStats.p || 0,
      l: this.l + anotherStats.l || 0,
      i: this.i + anotherStats.i || 0
    };
  },
});


var ABGame.TAGS = {};
ABGame.TAGS.lib = Crafty.e("ABStats").updateStats({
         p: -1,
         i: 1,
         l: -1
});
ABGame.TAGS.crazy = Crafty.e("ABStats").updateStats({
         p: -1,
         i: -1,
         l: 1
});
ABGame.TAGS.con = Crafty.e("ABStats").updateStats({
         p: 1,
         l: 1
});
ABGame.TAGS.rel = Crafty.e("ABStats").updateStats({
         i: -1,
         l: 1
});
ABGame.TAGS.rat = Crafty.e("ABStats").updateStats({
         i: 1
});
ABGame.TAGS.simple = Crafty.e("ABStats").updateStats({
         i: -1
});
ABGame.TAGS.cor = Crafty.e("ABStats").updateStats({
         p: 1
});
ABGame.TAGS.free = Crafty.e("ABStats").updateStats({
         p: -1
});