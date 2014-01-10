var spawn = require('child_process').spawn

exports.download = function(config) {

    var child = spawn('rtmpdump', [
        '--live'
      , '--app'
      , config.app
      , '--host'
      , config.host
      , '--playpath'
      , config.uuid
      , '--conn'
      , 'S:' + config.session
      , '--flv'
      , config.target
      , '-B'
      , config.seconds
    ])


    // Match something like
    var dataRegex = /(\d+\.\d+).kB.\/.(\d+\.\d+).sec/m

    child.on('close', config.onExit)

    child.stderr.on('data', function(data) {
        if (dataRegex.test(data)) {
            if (typeof config.onProgress === 'function') {
                config.onProgress(getData(data))
            }
        }
    })


    function getData(data) {
        var result = dataRegex.exec(data), kbLoaded, secondsLoaded, percent, info = null

        if (Array.isArray(result) && result.length > 2) {
            kbLoaded = parseFloat(result[1])
            secondsLoaded = parseFloat(result[2])

            info = {
                kbLoaded: kbLoaded
              , secondsLoaded: secondsLoaded
            }
        }

        return info
    }

}
