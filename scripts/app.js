var myApp = angular.module('myApp',['ngMaterial','ui.router']);

myApp.config(function($mdThemingProvider,$stateProvider){

  $mdThemingProvider
    .theme('default')
    .primaryPalette('purple')
    .accentPalette('pink');

  $stateProvider
    .state('items',{
      url:'/items',
      templateUrl:'components/items.html',
      controller:'mainCtrl'
    })
    .state('items.new',{
      url:'/new',
      templateUrl:'components/new.html',
      controller:'newCtrl'
    });
});

myApp.factory('items',function($http){

  function itemList(){
    return $http.get('../items.json');
  }
  return {
    itemList : itemList
  }
});

myApp.controller('mainCtrl',['$scope','$http','items','$mdSidenav','$mdToast','$mdDialog','$state', function($scope,$http,items,$mdSidenav,$mdToast,$mdDialog,$state){

  $scope.desc= false;
  items.itemList().then(function(items){
    $scope.items = items.data;
    $scope.categories = getCategories($scope.items);
  });

  $scope.showSidenav = function(){
    $scope.edit = false;
    $scope.item={};
    // $mdSidenav('left').open();
    $state.go('items.new');
  }
  $scope.hideSidenav = function(){

    $mdSidenav('left').close();
  }

  $scope.saveitem = function(item){
    if(item){
      $scope.items.push(item);
      $scope.item={};
      $scope.hideSidenav();
      $scope.showToast("Item saved !");

    }
  }
  $scope.editItem = function(item){
    $scope.edit= true;
    $mdSidenav('left').open();
    $scope.item= item;
  }

  $scope.saveEdited = function(){
    $scope.edit = false;
    $scope.hideSidenav();
    $scope.item={};
    $scope.showToast('Item edited !');

  }

  $scope.deleteItem = function(event,item){
    var confirm = $mdDialog.confirm()
    .title("Are you sure you want to delete "+item.title)
    .ok('Yes')
    .cancel('No')
    .targetEvent(event);
    $mdDialog.show(confirm).then(function(){
      var index = $scope.items.indexOf(item);
      $scope.items.splice(index,1);
      $scope.showToast('Item deleted !');
    }, function(){
    });
  }

  function getCategories(items){
    var categories = [];

    angular.forEach($scope.items, function(item){
      angular.forEach(item.categories, function(category){
        categories.push(category);
      });
    });
     return _.uniq(categories);

  }



  $scope.showToast = function(message){
    $mdToast.show(
      $mdToast.simple()
        .content(message)
        .position('top, right')
        .hideDelay(3000)
    )
  }

}]);

myApp.controller('newCtrl',['$scope','$http','items','$mdSidenav','$mdToast','$mdDialog','$state','$timeout', function($scope,$http,items,$mdSidenav,$mdToast,$mdDialog,$state,$timeout){


  $timeout(function () {
      $mdSidenav('left').open();
  });

  $scope.$watch('sidenavopen', function(value){
    if (value === false){
      $mdSidenav('left')
      .close()
      .then(function(){
        $state.go('items');
      });
    }
  });

  $scope.hideSidenav = function(){
    $scope.sidenavopen = false;
  }

}]);
