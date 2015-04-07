/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt');

module.exports = {

  attributes: {

    name: 'STRING',
    email: {
      type: 'STRING',
      unique: true
    },
    password: 'STRING',
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
    this.genPassword(attrs.password, function(err, hash) {
      if (err)
        return next(err);

      attrs.password = hash;
      next();
    });
  },
};

