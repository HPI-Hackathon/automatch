
angular.module('automatch')
  .controller('MainController', ['$scope', 'CarProvider', function($scope, CarProvider) {

    document.body.scrollTop = 0;

    if (!localStorage.userId)
      localStorage.userId = generateId();

    io.socket.post('/user/login/' + localStorage.userId, function(data, jwres) {
      if (jwres.statusCode !== 200)
	return alert('Eine Verbindung zum Server konnte nicht hergestellt werden. Bitte die Seite neu laden.');
    });

    /**
     * generates random string of characters
     */
    function generateId() {
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
     * Open the given url in a new tab.
     *
     * @param String url The url to open
     */
    $scope.openUrl = function openUrl(url) {
      window.open(url, '_blank');
    };

    $scope.toggleShowSuggestions = function toggleShowSuggestions() {
      if ($scope.suggestionUrl) {
	$scope.suggestionCriteria = undefined;
	return;
      }

      io.socket.get('/suggestions', function(data, jwres) {
	$scope.$apply(function() {
	  if (jwres.statusCode !== 200)
	    return alert('Vorschlägen konnten nicht geladen werden!');

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

