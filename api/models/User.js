/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var request = require('request');
var bcrypt = require('bcrypt');

module.exports = {

  attributes: {

    name: 'STRING',
    email: {
      type: 'STRING',
      unique: true
    },
    password: 'STRING',
    identifier: 'STRING',
    liked: 'ARRAY',
    hated: 'ARRAY',
    favorites: 'ARRAY',

    /**
     * Matches the given password hash against the saved one
     *
     * @param string password Password hash to compare against
     * @param function cb Callback given an error and if it matched
     */
    authenticate: function authenticate(password, cb) {
      bcrypt.compare(password, this.password, function(err, match) {
        if (err)
          return cb(err);

        cb(null, match);
      });
    }

  },

  /**
   * Generate a password hash given a plaintext password
   * @param string password The plain text password
   * @param function cb     The callback to call given error and a hash
   */
  genPassword: function getPassword(password, cb) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err)
        return cb(err);

      bcrypt.hash(password, salt, function(err, hash) {
        if (err)
          return cb(err);

        cb(null, hash);
      });
    });
  },

  beforeUpdate: function beforeUpdate(attrs, next) {
    if (!attrs.password)
      return next();

    this.genPassword(attrs.password, function(err, hash) {
      if (err)
        return next(err);

      attrs.password = hash;
      next();
    });
  },

  beforeCreate: function beforeCreate(attrs, next) {
    if (!attrs.password)
      return next();

    this.genPassword(attrs.password, function(err, hash) {
      if (err)
        return next(err);

      attrs.password = hash;
      next();
    });
  },

  /**
   * Loads an object mapping category names as returned by the mobile
   * API to names as used by the mobile API
   *
   * @param function cb The callback to call once finished
   */
  loadCategoryMap: function loadCategoryMap(cb) {
    var self = this;

    request('http://m.mobile.de/svc/r/Car', {
      headers: {
        'Accept-Language': 'en-US,en'
      }
    }, function(err, res, body) {
      if (err)
        return cb(err);

      // we want a potential exception to be fatal
      var data = JSON.parse(body);

      self.categoryMap = data.categories;
      cb();
    });
  },

  /**
   * Translates a given category name to the category as used by the
   * API. @see loadCategoryMap
   *
   * @param String category The category to be translated
   * @return String         The translated category name
   */
  translateCategory: function translateCategory(category) {
    var map = this.categoryMap;

    for (var i = 0; i < map.length; i++) {
      if (map[i].n == category) {
        return map[i].i;
      }
    }
  },



};

