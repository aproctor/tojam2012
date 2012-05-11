Crafty.c("ABEnemy", {
     init: function() {
         this.addComponent("2D, DOM, Color, Collision, Gravity, Jumper, playerSpr")
         this.w = 75;    // width
         this.h = 75;    // height
         this.color("#FF0000");
         this.x = 10;
         this.y = 10;
         
         this.damageVal = 0;
         
         this.onHit('ABPlayer', function() {
          
         });
    },
       
    toString: function() {
      return "";
    }
});