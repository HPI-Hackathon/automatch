
angular.module('automatch')
  .directive('automatchClick', ['$parse', function($parse) {
    return {
      link: function($scope, $element, $attrs) {
        var caughtTouch = false;
        var handler = $parse($attrs.automatchClick);

        $element
          .bind('touchstart', function() {
            caughtTouch = true;
          })
          .bind('touchend', function() {
            caughtTouch = false;

            $scope.$apply(function() {
              handler($scope);
            });
          })
          .bind('click', function() {
            if (caughtTouch)
              return;

            $scope.$apply(function() {
              handler($scope);
            });
          });
      }
    };
  }]);

