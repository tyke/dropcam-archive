var Request = require('./Request')
  , Camera = function() {}
  , _ = require('underscore')
  , Q = require('q')

Camera.prototype.list = function(Session) {
    var deferred = Q.defer(), self = this

    Request.get('cameras.get_visible', function(a, b, c) {
        self.cameras = c.items
        deferred.resolve()
    }, Session.cookies)

    return deferred.promise
}

Camera.prototype.first = function() {
    return this.cameras[0]
}

module.exports = new Camera()
