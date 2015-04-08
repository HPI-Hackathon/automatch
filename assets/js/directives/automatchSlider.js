
angular.module('automatch').directive('automatchSlider', ['$document', '$swipe', function($document, $swipe) {
  function getPos($event) {
    if ($event.clientX !== undefined)
      return {
        x: $event.clientX,
        y: $event.clientY
      };
    else {
      var touches = $event.originalEvent ? $event.originalEvent.touches :
        $event.touches;
      return {
        x: touches[0].clientX,
        y: touches[0].clientY
      };
    }
  }

  function clamp(min, max, val) {
    return Math.max(min, Math.min(val, max));
  }

  return {
    restrict: 'E',
    scope: {
      min: '&',
      max: '&',
      onupdate: '&'
    },
    template: '<div class="slider">' +
        '<div class="handle-upper">{{ max == MAX_VALUE ? "MAX" : max + "€" }}</div>' +
        '<div class="range"></div>' +
        '<div class="handle-lower">{{ min + "€" }}</div>' +
      '</div>',
    link: function($scope, $element, $attrs) {

      var scale = [500, 600, 700, 800, 900, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000, 9000, 10000, 12500, 15000, 17500, 20000, 22500, 25000, 27500, 30000, 35000, 40000, 45000, 50000, 60000, 70000, 80000, 90000];

      $scope.MAX_VALUE = 9999999;

      var $upper = $(".handle-upper", $element);
      var $lower = $(".handle-lower", $element);
      var $range = $(".range", $element);
      var $slider = $(".slider", $element);

      $scope.upperCost = $slider.width();
      $scope.lowerCost = 0;

      var lowerValMoving = false;

      updatePositions(true);

      $lower.add($upper)
        .bind('touchstart mousedown', function($event) {
          $event.stopPropagation();
          $event.preventDefault();

          lowerValMoving = $event.target == $lower[0];

          $document.bind('mousemove touchmove', move);
          $document.bind('mouseup touchend touchcancel', end);
        });

      /**
       * Process touch or mouse move events and call @see updatePositions
       */
      function move($event) {
        $event.stopPropagation();
        $event.preventDefault();

        var pos = getPos($event);
        var offset = $element.offset();

        var x;
        var dx = pos.x - offset.left;
        if (lowerValMoving)
          x = clamp(0, $scope.upperCost, dx);
        else
          x = clamp($scope.lowerCost, $slider.width(), dx);

        if (lowerValMoving)
          $scope.lowerCost = x;
        else
          $scope.upperCost = x;

        updatePositions();
      }

      /**
       * Update positions of the handle elements and the range element and the labels
       * @param init boolean True if this is the initial placement
       */
      function updatePositions(init) {
        var lx = $scope.lowerCost - $lower.width() / 2;
        var ux = $scope.upperCost - $upper.width() / 2;
        $lower.css('left', lx + 'px');
        $upper.css('left', ux + 'px');

        $range.css('left', lx + 'px').width(ux - lx);

        var maxWidth = $slider.width();

        $scope.min = scale[parseInt($scope.lowerCost / maxWidth * scale.length)];
        $scope.max = scale[parseInt($scope.upperCost / maxWidth * scale.length)];
        if (!$scope.max)
          $scope.max = $scope.MAX_VALUE;

        if (!$scope.$$phase && !init)
          $scope.$apply();
      }

      /**
       * End of drag operation. Disconnect listeners
       */
      function end($event) {
        $event.stopPropagation();
        $event.preventDefault();

        function cb() {
          if ($scope.onupdate)
            $scope.onupdate({
              min: $scope.min,
              max: $scope.max
            });
        }

        if ($scope.$$phase)
          cb();
        else
          $scope.$apply(function() {
            cb();
          });

        $document.unbind('mousemove touchmove', move);
        $document.unbind('mouseup touchend touchcancel', end);
      }
    }
  };
}]);
