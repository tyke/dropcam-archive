var Session = require('./lib/Session')
  , Camera = require('./lib/Camera')
  , Stream = require('./lib/Stream')

Session.authenticate().then(function() {
    Camera.list(Session).then(function() {
        var camera = Camera.first()

        Stream.save(camera, Session)
    })
})
