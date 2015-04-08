
angular.module('automatch')
  .controller('FavoritesController', ['$scope', 'UserService', 'getImage', 'openUrl', function($scope, UserService, getImage, openUrl) {

    // export for usage in views
    $scope.getImage = getImage;
    $scope.openUrl = openUrl;

    UserService.init().then(function() {
      io.socket.get('/favorites', function(data, jwres) {
        if (jwres.statusCode !== 200)
          return alert('Favoriten konnten nicht geladen werden!');

        $scope.$apply(function() {
          $scope.favorites = data;
        });
      });
    });
  }]);

