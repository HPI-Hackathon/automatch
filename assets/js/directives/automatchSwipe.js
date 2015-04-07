
angular.module('automatch')
  .directive('automatchSwipe', ['$swipe', '$timeout', function($swipe, $timeout) {
    return {
      restrict: 'A',
      link: function($scope, $element, $attrs) {
        var prev = { x: 0, y: 0 };
        var x, y;
        var disableAnimationTimeout;

        function applyPos() {
          $element.css('transform', 'translate(' + x + 'px, ' + y + 'px) ' +
                       'scale(' + scale + ')');
        }

        function toggleTransitions(enable) {
          var duration = enable ? '150ms' : '0ms';
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
          var dx = pos.x - prev.x;
          var dy = pos.y - prev.y;

          x += dx;
          y += dy;

          applyPos();

          prev = pos;
        }

        function touchEnd($event) {
          $event.preventDefault();
          $event.stopPropagation();

          x = 0; y = 0; scale = 1.0;
          toggleTransitions(true);
          applyPos();
          $document.unbind('touchmove mousemove', touchMove);
          $document.unbind('touchend mouseup', touchEnd);
        }

        var $document = $(document);

        $element.bind('touchstart mousedown', function touchStart($event) {
          $event.preventDefault();
          $event.stopPropagation();

          console.log($element);
          var offset = $element.offset();
          prev = getPos($event);

          x = 0;
          y = 0;
          scale = 0.4;

          $element.css('transform-origin', (prev.x - offset.left) + 'px ' +
                       (prev.y - offset.top) + 'px');

          toggleTransitions(true);
          applyPos();

          clearTimeout(disableAnimationTimeout);
          disableAnimationTimeout = setTimeout(function() {
            toggleTransitions(false);
          }, 150);

          $document.bind('touchmove mousemove', touchMove);
          $document.bind('touchend touchcancel mouseup', touchEnd);
        });
      }
    };
  }]);

