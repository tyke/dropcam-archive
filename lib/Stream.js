var moment = require('moment')
  , config = require('../config')
  , rtmp = require('./rtmp')
  , Stream = function() {}

Stream.prototype.save = function(camera, Session) {
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

module.exports = new Stream()
