var Session = require('./lib/Session')
  , Camera = require('./lib/Camera')
  , rtmp = require('./lib/rtmp')
  , url = require('url')
  , config = require('./config')
  , moment = require('moment')

var Stream = function() {}

Stream.prototype.save = function(camera) {
    var self = this
      , last_percent = 0
      , output = config.output_dir + 'surveillance ' + moment().format('MM-DD-YYYY hh:mm') + '.mp4'
      , rtmp_config = {
            target: output
          , session: Session.session_token
          , uuid: camera.uuid
          , host: config.host
          , app: config.app
          , seconds: config.seconds
          , onProgress: function(data) {
                var percent = Math.round(data.secondsLoaded/config.seconds*100)
                if(percent > last_percent) {
                    last_percent = percent
                    console.log(output + ': ' + Math.round(data.secondsLoaded/config.seconds*100) + '%')
                }
            }
          , onExit: function(data) {
                console.log('Successfully saved '+config.seconds + ' video as `' + output + '`')
                self.save(camera)
            }
        }

    console.log('Downloading new stream `'+output+'` for '+config.seconds + ' seconds')

    rtmp.download(rtmp_config)
}

Session.authenticate().then(function() {
    Camera.list(Session).then(function() {
        var camera = Camera.first()
          , stream = new Stream()
        stream.save(camera)
    })
})
