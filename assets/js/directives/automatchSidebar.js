angular.module('automatch')
.directive('automatchSidebar', ['$timeout', function($timeout) {
  return {
    restrict: 'C',
    template: '<div class="burger icon-cog-1"></div>',
    link: function(scope, element, attr) {

      window.a = element;

      var burger = $(".burger", element);

      var burgerToggle = true;



      burger.on('mousedown', function(event) {
        // Prevent default dragging of selected content
        event.preventDefault();
        burgerToggle = !burgerToggle;

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
        $document.on('mouseup', burgerMouseup);
      });



      function burgerMouseup() {

        $document.off('mouseup', burgerMouseup);
      }
    }
  };
}]);
