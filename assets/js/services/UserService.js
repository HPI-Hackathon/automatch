
angular.module('automatch')
  .factory('UserService', ['$q', function($q) {

    /**
     * initialize local user account
     *
     * @return Promise Promise that is resolved once logged in
     */
    function init() {
      return $q(function(resolve, reject) {
        if (!localStorage.userId)
          localStorage.userId = generateId();

        io.socket.post('/user/login/' + localStorage.userId,
                       function(data, jwres) {
          if (jwres.statusCode !== 200) {
            alert('Eine Verbindung zum Server konnte nicht ' +
                  'hergestellt werden. Bitte die Seite neu laden.');
            return reject();
          }

          resolve();
        });
      });
    }

    /**
     * generates random string of characters
     */
    function generateId() {
      var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
      var str = '';
      for (var i = 0; i < 32; i++){
	str += chars[parseInt(Math.random() * chars.length)];
      }

      return str;
    }

    return {
      init: init
    };
  }]);

