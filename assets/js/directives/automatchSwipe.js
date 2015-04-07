
angular.module('automatch')
  .directive('automatchSwipe', ['$swipe', function($swipe) {
    return {
      restrict: 'A',
      link: function($scope, $element, $attrs) {
        $swipe.bind($element, {
          start: function touchStart(pos) {
          },
          move: function touchMove(pos) {
          },
          end: function touchEnd(pos) {
          },
          cancel: function touchCancel(pos) {
          }
        });
      }
    };
  }]);

