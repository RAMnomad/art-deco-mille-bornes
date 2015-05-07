(function(){
  
  angular.module('app', []);
angular.module('app').config(['$controllerProvider', function($controllerProvider) {
  $controllerProvider.allowGlobals();
}]);
  app.controller('CardController',function(){
	  this.Deck = Deck;
  });
});
