var ABGame = {
  DEBUG: {
    ALL: false,
    ABScreen: false,
    
    hitboxes: false
  },
  
  width: 704,
  height: 512,
  grid_size: 25,
  
  max_lives: 1,
  cur_lives: 1,
  
  curScene: 0,
  scenes: ['splash',
    'scene1-1',
    /* NEW SCENES HERE */
    'game_over'],
    
  tile: 'images/tile.jpg',
  
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