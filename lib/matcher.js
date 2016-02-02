function match(matchers, string) {
    var result = {};
    string = string || '';

    Object.keys(matchers).forEach(function(key) {
        var matcher = new RegExp(matchers[key]);
        var matches = string.match(matcher);
        result[key] = (matches && matches.length > 1) ? matches[1] : matches;
    });

    return result;
}

module.exports = {
    match
};