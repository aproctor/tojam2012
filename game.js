var ABGame = {
  DEBUG: {
    ALL: true,
    Regions: false,
    prettyMode: false,
    hitboxes: false
  },
  
  width: 704,
  height: 512,
  grid_size: 25,
  
  GOLD_PER_CONV: 0.01,
    
  curScene: 0,
  scenes: ['splash',
    'choose',
    'main-world',
    /* NEW SCENES HERE */
    'game_over'],
  
  ASSETS: {  
    tile: 'images/tile.png',
    NA: 'images/World/NA.png',
    MA: 'images/World/MA.png',
    SA: 'images/World/SA.png',
    AF: 'images/World/AF.png',
    EU: 'images/World/EU.png',
    RU: 'images/World/RU.png',
    MEA: 'images/World/MEA.png',
    DU: 'images/World/DU.png',
    
    choose_screen: 'images/Disasters/choose_screen.png',
    
    alien_32: 'images/Disasters/32/alien.png',
    com_32: 'images/Disasters/32/com.png',
    moral_32: 'images/Disasters/32/moral.png',
    nuke_32: 'images/Disasters/32/nuke.png',
    rap_32: 'images/Disasters/32/rap.png',
    warm_32: 'images/Disasters/32/warm.png',
    
    alien_96: 'images/Disasters/96/alien.png',
    com_96: 'images/Disasters/96/com.png',
    moral_96: 'images/Disasters/96/moral.png',
    nuke_96: 'images/Disasters/96/nuke.png',
    rap_96: 'images/Disasters/96/rap.png',
    warm_96: 'images/Disasters/96/warm.png'
  },
  
  disaster: null,
  campaign: null,
  chooseDisaster: function(reference) {
    //alert(I18n.t(reference));
    this.disaster = reference;
    this.campaign = Crafty.e("ABCampaign").start(reference);
    ABGame.nextScene();
  },
  
  restart: function() {
    this.curScene = 0;
    this.nextScene();
  },
  
  nextScene: function() {
    this.curScene += 1;
    if(this.curScene < this.scenes.length) {
      Crafty.scene(this.scenes[this.curScene]);
    }
  },
  
  restartScene: function() {
    Crafty.scene(this.scenes[this.curScene]);
  },
  
  gameOver: function() {
    Crafty.scene('game_over');
  },
  
  tickRate: 1,
  setTickRate: function(val) {
    this.tickRate = val;
  },
  
  /**
   *
   */
  communication: function(comRef,regRef) {
    var c = this.COMMS[comRef];
    if(this.campaign.chargeMoney(c.cost)) {
      if(regRef) {
        //Update Regional stats
        var r = this.world.regions[regRef];
        r.statsEn.updateStats(c);
        r.exposure_rate += c.exposure;
        r.updateConvRate();
      } else {
        //GLOBAL
        this.campaign.updateStats(c);
        for(var i in this.world.regions) {
          var r = this.world.regions[i];
          r.exposure_rate += c.exposure;
          r.updateConvRate();
        }
      }
    }
  },
  
  COMMS: [],
  
  toString: function() {
    return "ABGame";
  }
};


/**
 * On page load
 */
window.onload = (function() {
  Crafty.init(ABGame.width+324, ABGame.height);
  Crafty.background('#000');
  Crafty.scene("splash");
  
  Crafty.e("ABCommunication").setup("verbal");
  Crafty.e("ABCommunication").setup("pamph");
  Crafty.e("ABCommunication").setup("int");
  Crafty.e("ABCommunication").setup("radio");
  Crafty.e("ABCommunication").setup("ed");
  Crafty.e("ABCommunication").setup("tele");
  Crafty.e("ABCommunication").setup("lobby");
  Crafty.e("ABCommunication").setup("prop");
});

Number.prototype.formatMoney = function(c, d, t){
   var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};