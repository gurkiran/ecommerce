var myApp = angular.module('myApp',['ngMaterial']);

myApp.config(function($mdThemingProvider){

  $mdThemingProvider
    .theme('default')
    .primaryPalette('purple')
    .accentPalette('pink');
});

myApp.factory('items',function($http){

  function itemList(){
    return $http.get('../items.json');
  }
  return {
    itemList : itemList
  }
});

myApp.controller('mainCtrl',['$scope','$http','items','$mdSidenav','$mdToast', function($scope,$http,items,$mdSidenav,$mdToast){

  $scope.showSidenav = function(){
    $mdSidenav('left').open();
  }
  $scope.hideSidenav = function(){
    $mdSidenav('left').close();
  }

  $scope.saveitem = function(item){
    console.log(item);
    if(item){
      $scope.items.push(item);
      $scope.item={};
      $scope.hideSidenav();
      $mdToast.show(
        $mdToast.simple()
          .content("Item saved !")
          .position('top, right')
          .hideDelay(3000)
      )
    }

  }

  $scope.desc= false;
  items.itemList().then(function(items){
    $scope.items = items.data;
    console.log(items);
  });

}]);
