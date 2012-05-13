Crafty.c("ABCampaign", {
  ref: null,
  money: 0,
  
  init: function() {
    this.addComponent("ABStats");
    this.ref = '';
    
  },
  
  start: function(ref, attrs) {
    this.ref = ref;
    this.attr(attrs || {});
    this.getInitStatsForRef(this.ref);
    
    this.updateMoney(300);
    
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
      this.updateStats(ABGame.TAGS.lib);
      this.updateStats(ABGame.TAGS.crazy);
    } else if(ref == "rap") {
      this.updateStats(ABGame.TAGS.crazy);
      this.updateStats(ABGame.TAGS.rel);
    } else if(ref == "warm") {
      this.updateStats(ABGame.TAGS.lib);
      this.updateStats(ABGame.TAGS.rat);
    }
  },
  
  chargeMoney: function(delta) {
   if(this.money < delta) {
     return false;
   }
   this.updateMoney(this.money - delta);
  },
  
  updateMoney: function(value) {
   this.money = value;
   $('#money').html('$'+(this.money).formatMoney(0,'.',',')); //sorry
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
    var sum = Math.abs(this.p) + Math.abs(this.l) + Math.abs(this.i);
    var val = this.p + this.l + this.i;
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

Crafty.c("ABCommunication",{
   init: function() {
     this.addComponent("ABStats");
   
     this.attr({
        cost: 10,
        exposure: 10,
        ref: null,
        title: '',
        global: false
     });
   },
   
   setup: function(ref) {
     this.ref = ref;
     
     if(ref == "ed") {
       this.attr({
         title: "Editorial",
         cost: 3000,
         exposure: 3000
       });
     } else if(ref == "int") {
       this.attr({
         title: "Internet",
         cost: 800,
         exposure: 100,
         global: true
       });
     } else if(ref == "lobby") {
	this.attr({
         title: "Lobby Govt.",
         cost: 5000000,
         exposure: 5000000,
       });
     } else if(ref == "pamph") {
       this.attr({
         title: "Pamphlets",
         cost: 100,
         exposure: 100,
       });
     } else if(ref == "prop") {
	this.attr({
         title: "Lobby Govt.",
         cost: 800000,
         exposure: 100000,
         global: true
       });
     } else if(ref == "radio") {
	this.attr({
         title: "Talk Radio",
         cost: 2000,
         exposure: 2000,
       });
     } else if(ref == "tele") {
	this.attr({
         title: "Television",
         cost: 30000,
         exposure: 10000,
         global: true
       });
     } else if(ref == "verbal") {
	this.attr({
         title: "Verbal",
         cost: 10,
         exposure: 10,
       });
     }
     
     ABGame.COMMS[ref] = this;
     
     return this;
   },
   
   renderLink: function(global) {
     var buff = [];
     
     if(global === true && this.global === true || global === false && this.global === false) {
       buff.push('<a href="#" onclick="ABGame.communication(\'');
       buff.push(this.ref);
       buff.push('\'); return false;" class="commLink" style="background-image: url(\'images/Comms/');
       buff.push(this.ref);
       buff.push('.png\')">');
       buff.push(this.title);
       buff.push('<em>$');
       buff.push(this.cost);
       buff.push('</em></a>');
     }
     
     return buff.join('');
   }
});

ABGame.COMMS = {};
ABGame.TAGS = {};
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