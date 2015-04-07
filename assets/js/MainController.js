
angular.module('automatch')
  .controller('MainController', ['$scope', 'CarProvider',
              function($scope, CarProvider) {

	if (! localStorage.userId)
		localStorage.userId = generateId();
		
	/**
	 * generates random string of characters
	 */
	function generateId () {
		var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
		var str = '';
		for (var i = 0; i < 32; i++){
			str += chars[parseInt(Math.random() * chars.length)];
		}

		return str;
	}
    /**
     * positions the cards in the center of the screen in
     * a way that they fit the best possible
     */
    function reposition() {
      var fullWidth = $(document.body).width();
      $scope.cardWidth = Math.min(fullWidth * 0.9, 600);

      $scope.cardX = fullWidth / 2 - $scope.cardWidth / 2;

      if (!$scope.$$phase)
        $scope.$apply();
    }

    window.onresize = reposition;
    reposition();

    /**
     * Returns a correctly formatted url for the image of a given car
     * @param Object car The car to take the image from
     * @return string The url to the image
     */
    $scope.getImage = function getImage(car) {
      // use _27 for larger but significantly slower images
      return 'http://' + car.images[0] + '/_8.jpg';
    };

    $scope.action = 'dislike';

    /**
     * Plays the animation of the big button showing and hides it again
     *
     * @param String action Either like or dislike
     */
    $scope.showBigButton = function(action) {
      $scope.action = action;
      var $button = $('.big-button').show();
      setTimeout(function() {
        $button.hide();
      }, 800);
    };

    /**
     * Send a request to like a car, remove it from the list
     *
     * @param Object car The car to like
     */
    $scope.like = function like(car) {
      console.log('Request like', car.id);
      $scope.action = 'like';
      $scope.cars.splice(0, 1);
      io.socket.put('/car/like/' + car.id);
    };

    /**
     * Send a request to dislike a car, remove it from the list
     *
     * @param Object car The car to dislike
     */
    $scope.dislike = function dislike(car) {
      console.log('Request dislike', car.id);
      $scope.cars.splice(0, 1);
      io.socket.put('/car/dislike/' + car.id);
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

