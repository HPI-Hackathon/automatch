angular.module('automatch').directive('slider', ['$document', function($document) {
  return {
  	restrict: 'E',
    scope: {
      min: "=",
      max: "="
    },
    template: '<div class="slider"><div class="handle-upper">{{upperCost}}</div><div class="range"></div><div class="handle-lower">{{lowerCost}}</div></div>',
    link: function(scope, element, attr) {

      window.a = element;
      var upper = $(".handle-upper", element);
      var lower = $(".handle-lower", element);
      var range = $(".range", element);
      var slider = $(".slider", element);

      var startX = 0, startY, y = 371,  x = 0, max = 500;
      scope.upperCost = 'unbegrenzt';
      scope.lowerCost = x + '€';
      scope.min = parseInt(scope.lowerCost);
      scope.max = 9000000;

      function calculate(n){
        if ((n/max)*5*1000 <= 1000){
          return parseInt((n/max)*5*1000);
        }
        else if ((n/max)*10*5*1000-9000 <= 10000){
          return parseInt((n/max)*5*10000-9000);
        }
        else if ((n/max)*25*10000-85500 <= 100000){
          return parseInt((n/max)*25*10000-85500);
        }
        else {
          return "0";
        }
      }

      lower.on('mousedown', function(event) {
        // Prevent default dragging of selected content
        event.preventDefault();
        startX = event.pageX - x;
        $document.on('mousemove', lowerMousemove);
        $document.on('mouseup', lowerMouseup);
      });

      function lowerMousemove(event) {
        x = event.pageX - startX;
        if (x <= 373 && x >= -2.5 && (x+10) <= y){
          lower.css({
              left:  x + 'px'
          });
          scope.$apply(function(){
          scope.lowerCost = calculate(x) + '€';
          });
          range.css({
            left: x + 'px',
            width: (y-x) + 'px'
          });
        }
      }

      function lowerMouseup() {
        $document.off('mousemove', lowerMousemove);
        $document.off('mouseup', lowerMouseup);
        scope.min = parseInt(scope.lowerCost);
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
        if (y <= 373 && y >= -2.5 && x <= (y-10)){
          upper.css({
            left:  y + 'px'
          });
          scope.$apply(function(){
            if (y > 370)
            {
              scope.upperCost = 'unbegrenzt';
            }
            else{
              scope.upperCost = calculate(y) + '€';
            }
          });
          range.css({
            width: (y-x) + 'px'
          });
        }
      }

      function upperMouseup() {
        $document.off('mousemove', upperMousemove);
        $document.off('mouseup', upperMouseup);
            if (y > 370)
            {
              scope.max = 9000000;
            }
            else{
              scope.max = parseInt(scope.upperCost);
            }
      }
    }
  };
}]);