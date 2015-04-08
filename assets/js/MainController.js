
angular.module('automatch')
  .controller('MainController', ['$scope', 'CarProvider', function($scope, CarProvider) {

    if (!localStorage.userId)
      localStorage.userId = generateId();

    io.socket.post('/user/login/' + localStorage.userId, function(data, jwres) {
      if (jwres.statusCode !== 200)
	return alert('Eine Verbindung zum Server konnte nicht hergestellt werden. Bitte die Seite neu laden.');
    });

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
      var fullHeight = $(document.body).height();
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

    /**
     * Plays the animation of the big button showing and hides it again
     *
     * @param String action Either like, favorite or dislike
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
      $scope.sendAction(car, 'like');
    };

    /**
     * Send a request to dislike a car, remove it from the list
     *
     * @param Object car The car to dislike
     */
    $scope.dislike = function dislike(car) {
      console.log('Request dislike', car.id);
      $scope.sendAction(car, 'dislike');
    };

    /**
     * Send a request to favorite a car, remove it from the list
     *
     * @param Object car The car to favorite
     */
    $scope.favorite = function favorite(car) {
      console.log('Request favorite', car.id);
      $scope.sendAction(car, 'favorite');
      $scope.showBigButton('favorite');
    };

    /**
     * Send either like, favorite or dislike for the specified car and remove it
     * from the list afterwards
     *
     * @param Object car    The car for which to send the action
     * @param String action The action to send, either like, favorite or dislike
     */
    $scope.sendAction = function sendAction(car, action) {
      $scope.cars.splice(0, 1);
      io.socket.put('/car/' + action, car, function(data, jwres) {
	if (jwres.statusCode === 200)
	  return;

	console.log('Failed to send action:', jwres);
	return alert('Bewertung konnte nicht abgesendet werden. Bitte die Seite neuladen.');
      });

      if ($scope.cars.length < 1)
	loadNewPage();
    };

    CarProvider.setErrorCb(function(err) {
      // TODO make this fancy
      alert('Oh No! Something went wrong! Please reload the page.');
    });

    /**
     * Queries the CarProvider for a new page and updates the model accordingly
     */
    function loadNewPage() {
      CarProvider.fetchPage().then(function(data) {
	$scope.cars = data.items.filter(function(car) {
	  return car.numImages > 0;
	}).map(function(car) {
	  console.log(car);
	  return {
	    color: car.attr.ecol,
	    brand: car.title.split(' ')[0],
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
    }

    loadNewPage();
  }]);

