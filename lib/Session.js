var Request = require('./Request')
  , Q = require('q')
  , _ = require('underscore')

var Session = function() {
    this.username = process.env.USERNAME
    this.password = process.env.PASSWORD
}

Session.prototype.authenticate = function() {
    var deferred = Q.defer()
      , self = this

    Request.post('login.login', {
        username: this.username
      , password: this.password
    }, function(a, b, c, cookie) {
        if(c.status === 0) {
            self.session_token = c.items[0].session_token
            self.cookies = cookie
            deferred.resolve()
        } else {
            console.log('Invalid Credentials')
            deferred.reject()
            process.exit(1)
        }
    })

    return deferred.promise
}

module.exports = new Session()
