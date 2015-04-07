angular.module('automatch').directive('automatchSlider', ['$document', function($document) {
  return {
  	restrict: 'E',
    template: '<div class="slider"><div class="handle-upper"></div><div class="range"></div><div class="handle-lower"></div></div>',
    link: function(scope, element, attr) {

      window.a = element;
      var upper = $(".handle-upper", element);
      var lower = $(".handle-lower", element);
      var range = $(".range", element);
      var slider = $(".slider", element);

      var startX = 0, startY, y = 500,  x = 0;


      lower.on('mousedown', function(event) {
        // Prevent default dragging of selected content
        event.preventDefault();
        startX = event.pageX - x;
        $document.on('mousemove', lowerMousemove);
        $document.on('mouseup', lowerMouseup);
      });

      function lowerMousemove(event) {
        x = event.pageX - startX;
        if (x <= 500 && x >= -2.5 && (x+10) <= y){
          lower.css({
              left:  x + 'px'
          });
          range.css({
            left: x + 'px',
            width: (500-x-(500-y)) + 'px'
          });
        }
      }

      function lowerMouseup() {
        $document.off('mousemove', lowerMousemove);
        $document.off('mouseup', lowerMouseup);
      }
      upper.on('mousedown', function(event) {
        // Prevent default dragging of selected content
        event.preventDefault();
        startY = event.pageX - (y);
        $document.on('mousemove', upperMousemove);
        $document.on('mouseup', upperMouseup);
      });

      function upperMousemove(event) {
        y = event.pageX - startY;
        if (y <= 500 && y >= -2.5 && x <= (y-10)){
          upper.css({
            left:  y + 'px'
          });
          range.css({
            width: (500-(500-y)-x) + 'px'
          });
        }
      }

      function upperMouseup() {
        $document.off('mousemove', upperMousemove);
        $document.off('mouseup', upperMouseup);
      }
    }
  };
}]);
