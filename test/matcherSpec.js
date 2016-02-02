var expect = require('chai').expect;
var matcher = require('../lib/matcher');

describe('Matching fields', function() {

    var string = 'Email=nanoha.takamachi@tsab.global, CN=Nanoha Takamachi, OU=TSAB - Defense, O=Time-Space Administrative Bureau, L=TSAB Headquarters (Local Division), C=Midchilda';

    var matchers = {
        'email': 'Email=([A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,}),',
        'name': 'CN=([A-z ()]+),',
        'org-unit': 'OU=([A-z ()-]+),',
        'org': 'O=([A-z ()-]+),',
        'location': 'L=([A-z ()-]+),',
        'country': 'C=([A-z ()-]+)'
    };

    var single = {
        'email': 'Email=([A-z0-9._%+-]+@tsab\.global),'
    };
    it('should return an object', function() {
        var actual = matcher.match(matchers, string);
        expect(typeof actual).to.deep.equal('object');
    });

    it('should match fields by applying regexes', function() {
        var expected = {
            'email': 'nanoha.takamachi@tsab.global',
            'name': 'Nanoha Takamachi',
            'org-unit': 'TSAB - Defense',
            'org': 'Time-Space Administrative Bureau',
            'location': 'TSAB Headquarters (Local Division)',
            'country': 'Midchilda'
        };
        var actual = matcher.match(matchers, string);
        expect(actual).to.deep.equal(expected);
    });

    it('should be able to take extract single properties', function() {
        var expected = {
            'email': 'nanoha.takamachi@tsab.global'
        };
        var actual = matcher.match(single, string);
        expect(actual).to.deep.equal(expected);
    })
});