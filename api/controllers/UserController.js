/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  like: function(req, res) {
    if (!req.session.user)
      return res.serverError();

    User.native(function(err, collection) {
      collection.update({
        identifier: req.session.user.identifier
      }, {
        $push: { liked: req.body }
      }, function(err) {
        if (err)
          return res.negotiate(err);

        res.send();
      });
    });
  },

  dislike: function(req, res) {
    if (!req.session.user)
      return res.serverError();

    User.native(function(err, collection) {
      collection.update({
        identifier: req.session.user.identifier
      }, {
        $push: { hated: req.body }
      }, function(err) {
        if (err)
          return res.negotiate(err);

        res.send();
      });
    });
  },

  login: function(req, res) {
    var id = req.param('id');
    if (!id)
      return res.badRequest();

    User.findOneByIdentifier(id).exec(function(err, user) {
      if (err)
        return res.negotiate(err);

      if (user) {
        req.session.user = user.toJSON();
        return res.send();
      }

      User.create({
        identifier: req.param('id'),
        hated: [],
        liked: [],
        favorites: []
      }).exec(function(err, user) {
        if (err)
          return res.negotiate(err);

        req.session.user = user.toJSON();
        return res.send();
      });
    });
  }

};

