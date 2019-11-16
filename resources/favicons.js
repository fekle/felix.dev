var favicons = require('favicons'),
  source = 'resources/favicon.png',
  configuration = {
    path: '/',
    appName: 'felix.dev',
    appShortName: 'felix.dev',
    appDescription: "Felix Klein's Homepage",
    developerName: 'Felix Klein',
    developerURL: 'https://felix.dev',
    dir: 'auto',
    lang: 'en-US',
    background: '#111111',
    theme_color: '#ffa86a',
    appleStatusBarStyle: 'black-translucent',
    display: 'standalone',
    orientation: 'any',
    scope: '/',
    start_url: '/',
    version: '1.0',
    icons: {
      android: true,
      appleIcon: true,
      appleStartup: true,
      coast: true,
      favicons: true,
      firefox: true,
      windows: true,
      yandex: true,
    },
  },
  callback = function(error, response) {
    if (error) {
      console.log(error.message);
      return;
    }
    console.log(response.images);
    console.log(response.files);
    console.log(response.html);
  };

favicons(source, configuration, callback);
