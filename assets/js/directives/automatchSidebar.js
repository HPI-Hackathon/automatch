angular.module('automatch')
.directive('automatchSidebar', ['$timeout', function($timeout) {
  return {
    restrict: 'C',
    template: '<div class="burger icon-cog-1"></div><div class="content"></div>',
    link: function(scope, element, attr) {

      var $document = $(document);
      var burger = $(".burger", element);
      var burgerToggle = false;
      var WIDTH = 200;
      var $sidebar = $('.automatchSidebar');

      var opened = false, revealX;

      var startX;
      element.bind('touchstart', function($event) {
        startX = $event.originalEvent.touches[0].clientX;

        $document.bind('touchmove', touchMove);
        $document.bind('touchend', touchEnd);
      });

      function touchMove($event) {
        var nowX = $event.originalEvent.touches[0].clientX;
        revealX = opened ? Math.min(Math.max(-WIDTH, startX - nowX), 0) :
          Math.min(0, -WIDTH + (startX - nowX));

        $sidebar.css('right', revealX + 'px');
      }

      function touchEnd($event) {
        $document.unbind('touchmove', touchMove);
        $document.unbind('touchend', touchEnd);

        if (revealX > -WIDTH / 2) {
          opened = true;
          $sidebar.css('right', 0);
        } else {
          opened = false;
          $sidebar.css('right', -WIDTH + 'px');
        }
      }

      burger.on('mousedown', function(event) {
        // Prevent default dragging of selected content
        event.preventDefault();

        if (!burgerToggle) {
          $sidebar.animate({
            right: '0px'
          }, 200);
        } else {
          $sidebar.animate({
            right: '-' + WIDTH + 'px'
          }, 200);
        }

        burgerToggle = !burgerToggle;
      });
    }
  };
}]);
