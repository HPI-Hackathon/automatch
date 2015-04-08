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

  favorite: function(req, res) {
    if (!req.session.user)
      return res.serverError();

    User.native(function(err, collection) {
      collection.update({
        identifier: req.session.user.identifier
      }, {
        $push: { favorites: req.body }
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
        // in case we need more info about user, add it here
        // we don't want to include all the data arrays.
        req.session.user = {
          identifier: user.identifier
        };
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
  },

  getSuggestions: function(req, res) {
    if (!req.session.user)
      return res.badRequest();

    var upperPrice = req.param('upper') || Infinity;
    var lowerPrice = req.param('lower') || 0;

    User.findOneByIdentifier(req.session.user.identifier).exec(function(err, user) {
      var attrs = ['color', 'brand', 'category'];
      var counts = {};
      var bestFit = {};

      attrs.forEach(function(attr) {
        counts[attr] = {};
      });

      user.liked.forEach(function(car) {
        attrs.forEach(function(attr) {
          if (!counts[attr][car[attr]])
            counts[attr][car[attr]] = 1;
          else
            counts[attr][car[attr]]++;
        });
      });

      user.favorites.forEach(function(car) {
        attrs.forEach(function(attr) {
          if (!counts[attr][car[attr]])
            counts[attr][car[attr]] = 5;
          else
            counts[attr][car[attr]] += 5;
        });
      });

      attrs.forEach(function(attr) {
        var max = -1;
        var maxKey;
        Object.keys(counts[attr]).forEach(function(key) {
          if (counts[attr][key] > max) {
            maxKey = key;
            max = counts[attr][key];
          }
        });

        bestFit[attr] = maxKey;
      });

      res.send(bestFit);
    });
  }

};

