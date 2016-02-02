var expect = require('chai').expect;
var Strategy = require('../lib/certStrategy');

describe('Cert Strategy', function() {

    var instance;

    var request = {
        headers: {
            sslcertauthfield: 'Email=fate.t.haralown@tsab.global, CN=Fate T Haralown, OU=TSAB - Defense, O=Time-Space Administrative Bureau, L=TSAB Headquarters (Local Division), C=Midchilda'
        }
    };

    var config = {
        field: 'sslcertauthfield',
        matchers: {
            email: 'Email=([A-z0-9._%+-]+@tsab\.global),',
            name: 'CN=([A-z ()]+),',
            'org-unit': 'OU=([A-z ()-]+),',
            org: 'O=([A-z ()-]+),',
            location: 'L=([A-z ()-]+),',
            country: 'C=([A-z ()-]+)'
        },
        required: ['email', 'name']
    };

    it('should reject an invalid user request', function(done) {
        instance = new Strategy(config, function(user, verified) {
            try {
                expect(typeof verified).to.equal('function');
                expect(user).to.deep.equal({
                    email: null,
                    name: null,
                    'org-unit': null,
                    org: null,
                    location: null,
                    country: null
                });
                done();
            } catch (ex) {
                done(ex);
            }
        });

        instance.authenticate({
            headers: {}
        });
    });
});