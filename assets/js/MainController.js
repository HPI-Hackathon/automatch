
angular.module('automatch')
  .controller('MainController', ['$scope', 'CarProvider', 'UserService', 'getImage', 'openUrl', function($scope, CarProvider, UserService, getImage, openUrl) {

    document.body.scrollTop = 0;
    $scope.suggestionCriteria = {};
    $scope.suggestionsOnly = false;

    // export for usage in views
    $scope.getImage = getImage;
    $scope.openUrl = openUrl;
    $scope.openUrlDirect = function(url) { location.href = url; };

    UserService.init();

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
     * Update price boundaries and reload the cars
     *
     * @param min int Minimum price
     * @param max int Maximum price
     */
    $scope.updatePriceBoundaries = function updatePriceBoundaries(min, max) {
      $scope.suggestionCriteria.lowerPrice = min;
      $scope.suggestionCriteria.upperPrice = max;
      loadNewPage();
    };

    /**
     * Plays the animation of the big button showing and hides it again
     *
     * @param String action Either like, favorite or dislike
     */
    $scope.showBigButton = function(action) {
      $scope.action = action;
      var $button = $('.big-button').addClass('animate').show();
      setTimeout(function() {
        $button.removeClass('animate').hide();
      }, 800);
    };

    /**
     * Send a request to like a car, remove it from the list
     *
     * @param Object car The car to like or null to pick the current
     */
    $scope.like = function like(car) {
      $scope.sendAction(car, 'like');
    };

    /**
     * Send a request to dislike a car, remove it from the list
     *
     * @param Object car The car to dislike or null to pick the current
     */
    $scope.dislike = function dislike(car) {
      $scope.sendAction(car, 'dislike');
    };

    /**
     * Send a request to favorite a car, remove it from the list
     *
     * @param Object car The car to favorite or null to pick the current
     */
    $scope.favorite = function favorite(car) {
      car = car || $scope.cars[0];
      $scope.sendAction(car, 'favorite');
      $scope.showBigButton('favorite');
    };

    /**
     * Sets the suggestion criteria as given by the server or disables then
     *
     * @param enable boolean Whether to enable suggestion filter
     */
    $scope.toggleShowSuggestions = function toggleShowSuggestions(enable) {
      if (!enable) {
	$scope.suggestionCriteria = {
	  lowerPrice: $scope.lowerPrice,
	  upperPrice: $scope.upperPrice
	};
	return;
      }

      io.socket.get('/suggestions', function(data, jwres) {
	$scope.$apply(function() {
	  if (jwres.statusCode !== 200)
	    return alert('Vorschlägen konnten nicht geladen werden!');

	  data.lowerPrice = $scope.suggestionCriteria.lowerPrice;
	  data.upperPrice = $scope.suggestionCriteria.upperPrice;
	  $scope.suggestionCriteria = data;
	});
      });
    };

    /**
     * Send either like, favorite or dislike for the specified car and remove it
     * from the list afterwards
     *
     * @param Object car    The car for which to send the action
     * @param String action The action to send, either like, favorite or dislike
     */
    $scope.sendAction = function sendAction(car, action) {
      // we were called from a button without direct context.
      // Show the indicator.
      if (!car)
	$scope.showBigButton(action);

      car = car || $scope.cars[0];

      console.log('Request', action, car.id);

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

    $scope.$watch('suggestionCriteria', function(newVal) {
      loadNewPage();
    });

    /**
     * Queries the CarProvider for a new page and updates the model accordingly
     */
    function loadNewPage() {
      $scope.cars = [];

      CarProvider.fetchPage($scope.suggestionCriteria).then(function(data) {
	$scope.cars = data.items.filter(function(car) {
	  return car.numImages > 0;
	}).map(function(car) {
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
  }]);

