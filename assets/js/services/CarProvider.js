
angular.module('automatch')
  .factory('CarProvider', ['$q', '$http', function($q, $http) {
    var PAGE_SIZE = 30;
    var offset = 0;
    var errorCb = null;

    /**
     * Main function that fetches a page of car objects as returned from mobile
     * API. Next call moves to next page.
     *
     * @return Promise The promise object that will hold an array of cars on success
     */
    function fetchPage() {
      return $q(function(resolve, reject) {
        $http.get('http://m.mobile.de/svc/s/?vc=Car&psz=' + PAGE_SIZE + '&ps' + offset)
          .success(function(data) {
            offset += PAGE_SIZE;
            console.log(data);
            resolve(data);
          })
          .error(errorCb);
      });
    }

    return {
      fetchPage: fetchPage,
      setErrorCb: function(cb) {
        errorCb = cb;
      }
    };
  }]);

