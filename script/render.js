/**
 * Module dependencies.
 */

var webpage = require('webpage');
var args = require('system').args;

/**
 * Arguments Mapping
 */

var url = args[1];
var width = args[2];
var height = args[3];
var timeout = args[4];
var format = args[5];


/**
 * Return JSON
 */
pack = {
  url: url, 
  html: '', 
  shot: '', 
  date: '',
  status: '',
  errors: [],
  width: width,
  height: height,
  timeout: timeout,
  format: format
}

var noop = function(e,s) {pack.errors.push(e)};

/**
 * Initialize page.
 */

var page = webpage.create()
page.settings.resourceTimeout = 60000
page.settings.webSecurityEnabled = false
page.settings.localToRemoteUrlAccessEnabled = true

page.viewportSize = {
  width: width,
  height: height
}
page.clipRect = {
  top: 0,
  left: 0,
  width: width,
  height: height
}

/**
 * Silence phantomjs.
 */
phantom.onError = 
page.onConsoleMessage =
page.onConfirm = 
page.onPrompt =
page.onError =
page.onResourceError = noop;


page.zoomFactor = 1.25

/**
 * Open and render page.
 */

page.open(url, function (status) {
  // if (status !== 'success') {
  //   console.log(JSON.stringify({ERROR:"status NOT success"}))
  //   phantom.exit(-1);
  // } 
  window.setTimeout(function () {
    pack.date = new Date()
    pack.html = page.evaluate(function() {

        if(status === 'success') {
           document.documentElement.innerHTML =
            "<head></head>"
            + "<body style='height:100px;font-size:30px;'> UNABLE TO RENDER "
            + new Date()
            +"</body>"
        }
        if (!document.body.style.background) {
          document.body.style.backgroundColor = 'white';
        }
        return document.documentElement.innerHTML
    })

    pack.shot = page.renderBase64(format)

    pack.status = status

    //process.stdout.write(JSON.stringify(pack))



    console.log(JSON.stringify(pack));
    setTimeout(function(){
        phantom.exit()
    }, 333);
  }, timeout);
});

