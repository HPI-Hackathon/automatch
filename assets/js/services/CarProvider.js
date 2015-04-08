
angular.module('automatch')
  .factory('CarProvider', ['$q', '$http', function($q, $http) {
    var PAGE_SIZE = 10;
    var errorCb = null;
    var maxResults = -1;
    var prevQuery = '';

    /**
     * Main function that fetches a page of car objects as returned from mobile
     * API. Next call moves to next page.
     *
     * @param Object criteria An optional object containing query criteria
     *
     * @return Promise The promise object that will hold an array of cars on success
     */
    function fetchPage(criteria) {
      var query;

      if (criteria)
        query =
          '&ecol=' + criteria.color.toUpperCase() +
          '&c=' + criteria.category +
          '&t=' + criteria.brand +
          '&np=' + criteria.lowerPrice + ':' + criteria.upperPrice;
      else
        query = '';

      // if we changed parameters, we no loner know how many results
      // we'll get
      if (query != prevQuery)
        maxResults = -1;

      return $q(function(resolve, reject) {
        var baseUrl = 'http://m.mobile.de/svc/s/?vc=Car' + query;
        console.log('Loading', baseUrl);

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

