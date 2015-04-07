/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  like: function(req, res) {
    User.native(function(err, collection) {
      collection.update({
        id: req.session.user.id
      }, {
        $push: { liked: req.param('id') }
      });
    });
  },

  dislike: function(req, res) {
    User.native(function(err, collection) {
      collection.update({
        id: req.session.user.id
      }, {
        $push: { hated: req.param('id') }
      });
    });
  },

};

