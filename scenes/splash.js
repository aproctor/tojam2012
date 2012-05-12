Crafty.scene("splash", function() {
  Crafty.e("2D, DOM, Image, Mouse").attr({x:0, y:0, h: ABGame.height, w: ABGame.width}).image('images/Screens/TitleScreen.jpg', "repeat").bind("Click", function() {
      ABGame.nextScene();
    });
});


Crafty.scene("game_over", function() {
  Crafty.e("2D, DOM, Image, Mouse").attr({x:0, y:0, h: ABGame.height, w: ABGame.width}).image('images/Screens/GameOver.png', "repeat").bind("Click", function() {
      ABGame.restart();
  });
});