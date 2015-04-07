
angular.module('automatch')
  .controller('MainController', ['$scope', 'CarProvider',
              function($scope, CarProvider) {
    /**
     * Returns a correctly formatted url for the image of a given car
     * @param Object car The car to take the image from
     * @return string The url to the image
     */
    $scope.getImage = function getImage(car) {
      return 'http://' + car.images[0] + '/_27.jpg';
    };

    $scope.like = function like(car) {
      console.log('Request like', car.id);
      io.socket.put('/car/like/' + car.id);
      $scope.cars.splice(0, 1);
    };

    $scope.dislike = function dislike(car) {
      console.log('Request dislike', car.id);
      io.socket.put('/car/dislike/' + car.id);
      $scope.cars.splice(0, 1);
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

