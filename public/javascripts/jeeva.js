!function () {
  var jeeva = window.jeeva = window.jeeva || [];
  if (jeeva.invoked) return;
  jeeva.invoked = true;
  jeeva.methods = ['identify', 'collect'];
  jeeva.factory = function (method) {
    return function () {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(method);
      jeeva.push(args);
      return jeeva;
    };
  };
  for (var i = 0; i < jeeva.methods.length; i++) {
    var key = jeeva.methods[i];
    jeeva[key] = jeeva.factory(key);
  }
  jeeva.load = function (key) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src =
      'https://r2d2-inbound-js-store-production.s3.us-east-1.amazonaws.com/' +
      key + '/jeeva.js';
    var first = document.getElementsByTagName('script')[0];
    first.parentNode.insertBefore(script, first);
  };
  jeeva.SNIPPET_VERSION = '1.0.';
  jeeva.load('72ae3458-ea94-4a1b-aca5-cd9e96a698c9');
}();
