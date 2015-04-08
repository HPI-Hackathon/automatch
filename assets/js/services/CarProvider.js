
angular.module('automatch')
  .factory('CarProvider', ['$q', '$http', function($q, $http) {
    var PAGE_SIZE = 10;
    var errorCb = null;
    var maxResults = -1;

    /**
     * Main function that fetches a page of car objects as returned from mobile
     * API. Next call moves to next page.
     *
     * @return Promise The promise object that will hold an array of cars on success
     */
    function fetchPage() {
      return $q(function(resolve, reject) {
        var baseUrl = 'http://m.mobile.de/svc/s/?vc=Car';

        if (maxResults < 0) {
          $http.get(baseUrl + '&psz=1')
            .success(function(data) {
              maxResults = data.numResultsTotal;
              fetch();
            });
        } else
          fetch();

        function fetch() {
          var page = parseInt(Math.random() * maxResults) - PAGE_SIZE;

          $http.get(baseUrl + '&psz=' + PAGE_SIZE + '&ps=' + page)
            .success(function(data) {
              resolve(data);
            })
            .error(errorCb);
        }
      });
    }

    return {
      fetchPage: fetchPage,
      setErrorCb: function(cb) {
        errorCb = cb;
      }
    };
  }]);

