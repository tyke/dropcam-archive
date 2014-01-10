var request = require('request')
  , querystring = require('querystring')
  , Request = function() {
        this.api = 'https://www.dropcam.com/api/v1/'
    }

Request.prototype.request = function(path, method, body, callback, cookie) {
    var jar = cookie || request.jar()
      , options = {
        url: this.api + path
      , headers: {
            'User-Agent': 'curl/7.24.0 (x86_64-apple-darwin12.0) libcurl/7.24.0 OpenSSL/0.9.8x zlib/1.2.5'
          , 'Content-Type': 'application/x-www-form-urlencoded'
        }
      , method: method
      , jar: jar
    }

    if(method === 'POST') options.body = querystring.stringify(body)

    request(options, function(a, b, c) {
        try {
            c = JSON.parse(c)
        } catch(e) {}

        callback(a, b, c, jar)
    })
}

Request.prototype.get = function(path, callback, cookie) {
    this.request(path, 'GET', null, callback, cookie)
}

Request.prototype.post = function(path, body, callback) {
    this.request(path, 'POST', body, callback)
}

module.exports = new Request()
