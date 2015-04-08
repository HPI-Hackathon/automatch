
angular.module('automatch')
  .directive('automatchTouchClickFix', function() {
    return {
      restrict: 'A',
      link: function($scope, $element, $attrs) {
        $element.bind('touchstart', function() {
          $element.click();
          $scope.$parent.$apply();
        });
      }
    };
  });

