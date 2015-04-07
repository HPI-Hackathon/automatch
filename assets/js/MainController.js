
angular.module('automatch')
  .controller('MainController', ['$scope', 'CarProvider',
              function($scope, CarProvider) {
    $scope.price = 400;
    $scope.title = 'BMW Dings Kaputt';

    /**
     * Returns a correctly formatted url for the image of a given car
     * @param Object car The car to take the image from
     * @return string The url to the image
     */
    $scope.getImage = function getImage(car) {
      return 'http://' + car.images[0] + '/_27.jpg';
    };

    CarProvider.setErrorCb(function(err) {
      // TODO make this fancy
      alert('Oh No! Something went wrong! Please reload the page.');
    });

    CarProvider.fetchPage().then(function(data) {
      $scope.cars = data.items.filter(function(car) {
        return car.numImages > 0;
      }).map(function(car) {
        return {
          title: car.title,
          category: car.category,
          url: car.url,
          id: car.id,
          price: car.p,
          images: car.images.map(function(image) {
            return image.uri;
          })
        };
      });
    });
  }]);

