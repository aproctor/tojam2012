var I18n = {
  lang: "en",
  
  t: function(key) {
    return this.keys[this.lang][key];
  },
  
  keys: {
    en: {
      alien: "Alien Invasion",
      com: "Communism",
      moral: "Moral Decay",
      nuke: "Nuclear Warfare",
      rap: "The Rapture",
      warm: "Global Warming"
    }
  }
};