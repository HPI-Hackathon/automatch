
angular.module('automatch')
  .directive('automatchSwipe', ['$timeout', function($timeout) {
    $(document.body).bind('touchstart touchend touchmove', function($event) {
      $event.preventDefault();
    });

    return {
      restrict: 'A',
      scope: {
        like: '&',
        dislike: '&',
        notify: '&'
      },
      link: function($scope, $element, $attrs) {
        var prev, start;
        var startTime;
        var x = 0, y = 0, dx = 0, dy = 0, scale = 1;

        var rotation = parseInt(Math.random() * 5);

        function applyPos() {
          var rot = $element.index() === 1 ? '0' : rotation;
          $element.css('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0) ' +
                       'scale(' + scale + ') rotate(' + rotation + 'deg)');
        }

        applyPos();

        function toggleTransitions(enable) {
          var duration = enable ? '300ms' : '0ms';
          $element.css({
            'transition-duration': duration,
            '-ms-transition-duration': duration,
            '-moz-transition-duration': duration,
            '-webkit-transition-duration': duration
          });
        }

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

        function touchMove($event) {
          $event.preventDefault();
          $event.stopPropagation();

          var pos = getPos($event);
          dx = pos.x - prev.x;
          dy = pos.y - prev.y;

          x += dx;
          y += dy;

          applyPos();

          startTime = +new Date();
          prev = pos;
        }

        /**
         * Removes a car from the list smoothly by applying a transition
         * @param bool top True if it should slide to the top, otherwise bottom
         */
        $scope.removeCar = function(top) {
          toggleTransitions(true);
          scale = 0.4;
          var OFFSET_TOP = 50;
          y = top ? -OFFSET_TOP - $element.height() :
            $(document.body).height() - OFFSET_TOP;
          $element.css('opacity', 0);
          applyPos();

          $timeout(function() {
            if (top)
              $scope.like();
            else
              $scope.dislike();
          }, 400);
        };

        function touchEnd($event) {
          $event.preventDefault();
          $event.stopPropagation();

          var THRESHOLD = 1;
          var BORDER = 100;

          var deltaTime = +new Date() - startTime;
          $document.unbind('touchmove mousemove', touchMove);
          $document.unbind('touchend mouseup', touchEnd);

          var found = false;
          var up = false;

          var pos;
          if ($event.originalEvent.touches)
            pos = prev;
          else
            pos = getPos($event);

          if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy / deltaTime) > THRESHOLD) {
            found = true;

            up = dy < 0;
          } else {
            up = pos.y < BORDER;
            found = up || pos.y > $(document.body).height() - BORDER;
          }

          toggleTransitions(true);

          if (found) {
            $scope.$apply(function() {
              $scope.notify({
                action: dy < 0 ? 'like' : 'dislike'
              });
            });

            if (up && $scope.like)
              $scope.removeCar(true);
            else if ($scope.dislike)
              $scope.removeCar(false);

            return;
          }

          x = 0;
          y = 0;
          scale = 1;
          applyPos();
        }

        var $document = $(document);

        $element.bind('touchstart mousedown', function touchStart($event) {
          if ($event.target.tagName.toLowerCase() === 'a')
            return;

          toggleTransitions(false);

          $event.preventDefault();
          $event.stopPropagation();

          var offset = $element.offset();
          prev = start = getPos($event);
          startTime = +new Date();

          x = 0;
          y = 0;

          $element.css('transform-origin', (prev.x - offset.left) + 'px ' +
                       (prev.y - offset.top) + 'px');

          applyPos();

          $document.bind('touchmove mousemove', touchMove);
          $document.bind('touchend touchcancel mouseup', touchEnd);
        });
      }
    };
  }]);

