Crafty.scene("splash", function() {
  Crafty.e("2D, DOM, Image, Mouse").attr({x:0, y:0, h: ABGame.height, w: ABGame.width}).image('images/Screens/TitleScreen.png', "repeat").bind("Click", function() {
      ABGame.nextScene();
    });
});

Crafty.scene("choose", function() {
    $('#controls').hide();
  Crafty.e("2D, DOM, Image").attr({x: 0, y: 0, w: ABGame.width, h: ABGame.height}).image(ABGame.ASSETS.choose_screen, "repeat");
  
  Crafty.e("ABDisasterChoice").setup("alien", {x: 32*1, y: 32*1});
  Crafty.e("ABDisasterChoice").setup("com", {x: 32*1, y: 32*7});
  Crafty.e("ABDisasterChoice").setup("moral", {x: 32*8, y: 32*7});
  Crafty.e("ABDisasterChoice").setup("nuke", {x: 32*8, y: 32*1});
  Crafty.e("ABDisasterChoice").setup("rap", {x: 32*15, y: 32*1});
  Crafty.e("ABDisasterChoice").setup("warm", {x: 32*15, y: 32*7});
});


Crafty.scene('main-world', function() {
  ABGame.world = Crafty.e('ABWorld');
  
  $("#intro_"+ABGame.disaster).toggle();
  $('#controls').show();
});


Crafty.scene("game_over", function() {
  $('#controls').hide();
  Crafty.e("2D, DOM, Image, Mouse").attr({x:0, y:0, h: ABGame.height, w: ABGame.width}).image('images/Screens/GameOver.png', "repeat").bind("Click", function() {
      ABGame.restart();
  });
});