angular.module('automatch')
.directive('automatchSidebar', ['$timeout', function($timeout) {
  $(document.body).bind('touchstart touchend touchmove', function($event) {
    $event.preventDefault();
  });


  return {
    restrict: 'C',
    template: '<div class="burger icon-cog-1"></div>',
    link: function(scope, element, attr) {

      window.a = element;

      var burger = $(".burger", element);

      var burgerToggle = false;



      burger.on('mousedown', function(event) {
        // Prevent default dragging of selected content
        event.preventDefault();


        if (burgerToggle == false) {
          $(".automatchSidebar").animate({
              width: [ "20", "swing" ],
          }, 200, "linear", function() {});
        }
        if (burgerToggle == true) {
          $('.automatchSidebar').animate({
              width: [ "200", "swing" ],
          }, 200, "linear", function() {});
        }
        burgerToggle = !burgerToggle;
        $document.on('mouseup', burgerMouseup);
      });



      function burgerMouseup() {

        $document.off('mouseup', burgerMouseup);
      }
    }
  };
}]);
