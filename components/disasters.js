Crafty.c("Campaign", {
  ref: null,
  
  init: function() {
    this.ref = '';
    
  },
  
  start: function(ref, attrs) {
    this.ref = ref;
    this.attr(attrs || {});
  },
  
  getInitStatsForRef: function(ref) {
    if(ref == "") {
      
    }
  },
  
  toString: function() {
    return "Campaign";
  }
});