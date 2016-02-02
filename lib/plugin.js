var passport = require('passport');
var CertStrategy = require('./certStrategy');

var defaultConfig = {};

function create() {
    var pluginConfig = defaultConfig;

    function getConfig() {
        return pluginConfig;
    }

    function setConfig(config) {
        pluginConfig = config;
    }

    function info() {
        return require('../package.json');
    }

    function registerStrategy(app) {
        var users = app.users;
        var config = {
            field: pluginConfig.field,
            matchers: pluginConfig.matchers
        };

        passport.use(new CertStrategy(config,
            function(user, done) {
                return done(null, user);
            }
        ));
    }

    function registerContentRoutes(app) {
        app.addContentPage(__dirname + '/pages/auth-header.fragment.html');
    }

    function registerAuthRoutes(app) {
        var server = app.server;
        var models = app.config.models || {};
        var preflight = models.preflight;

        preflight.add(passport.authenticate('cert', {
            failureRedirect: '/docs/auth-header'
        }));

        preflight.add(function(req, res, next) {
            if (whitelisted(req)) {
                next();
            } else {
                var user = req.isAuthenticated() ? req.user : false;
                if (user) {
                    if (user.name && user.email) {
                        return next();
                    } else {
                        console.log('[Auth Header] Unrecognised user:', user);
                        return res.status(403).json({
                            message: 'Unrecognised user: ' + JSON.stringify(user)
                        });
                    }
                } else {
                    return res.status(403).json({
                        message: 'No authentication set'
                    });
                }
            }
        });

        app.enableAuthentication({
            name: 'auth-header',
            url: '/docs/auth-header'
        });
    }

    function whitelisted(req) {
        var path = req.path;
        if (req.hostname === 'localhost') {
            return true;
        }
        if (path === '/docs/auth-header' || path === '/api/monitorStatus') {
            return true;
        }
        return false;
    }

    function apply(app) {
        registerStrategy(app);
        registerContentRoutes(app);
        registerAuthRoutes(app);
    }

    return {
        info,
        apply,
        getConfig,
        setConfig
    };
}

module.exports = create;