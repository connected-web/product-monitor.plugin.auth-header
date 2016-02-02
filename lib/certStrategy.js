/**
 * Module dependencies.
 */
var passport = require('passport-strategy'),
    util = require('util'),
    matcher = require('./matcher');

function CertStrategy(options, verify) {
    if (typeof options == 'function') {
        verify = options;
        options = {};
    }
    if (!verify) throw new Error('Cert authentication strategy requires a verify function');

    passport.Strategy.call(this);
    this.name = 'cert';
    this._verify = verify;
    this._field = options.field || 'User';
    this._matchers = options.matchers || {};
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(CertStrategy, passport.Strategy);

/**
 * Authenticate request based on the contents of matched headers
 * header.
 *
 * @param {Object} req
 * @api protected
 */
CertStrategy.prototype.authenticate = function(req) {
    var authorization = req.headers[this._field];
    var user = matcher.match(this._matchers, authorization);

    if (!user) {
        return this.fail(this._challenge());
    }

    var self = this;

    function verified(err, user) {
        if (err) {
            return self.error(err);
        }
        if (!user) {
            return self.fail(self._challenge());
        }
        self.success(user);
    }

    this._verify(user, verified);
}

/**
 * Authentication challenge.
 *
 * @api private
 */
CertStrategy.prototype._challenge = function() {
    return 'Expected header="' + this._header + '"';
}

module.exports = CertStrategy;