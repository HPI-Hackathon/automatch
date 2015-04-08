
angular.module('automatch', ['ngTouch']);

/**
 * Returns a correctly formatted url for the image of a given car
 * @param Object car The car to take the image from
 * @return string The url to the image
 */
angular.module('automatch').constant('getImage', function getImage(car) {
	// use _27 for larger but significantly slower images
	return 'http://' + car.images[0] + '/_8.jpg';
});

/**
 * Open the given url in a new tab.
 *
 * @param String url The url to open
 */
angular.module('automatch').constant('openUrl', function openUrl(url) {
  window.open(url, '_blank');
});

