var ABGame = {
  DEBUG: {
    ALL: true,
    Regions: false,
    
    hitboxes: false
  },
  
  width: 704,
  height: 512,
  grid_size: 25,
    
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
  chooseDisaster: function(reference) {
    alert('Chose '+reference);
    this.disaster = reference;
    //ABGame.nextScene();
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
  
  toString: function() {
    return "ABGame";
  }
};

/**
 * On page load
 */
window.onload = (function() {
  Crafty.init(ABGame.width, ABGame.height);
  Crafty.background('#111');
  Crafty.scene("splash");
});