var Service = require('node-windows').Service;
const sendmail = require('sendmail')({
  logger: {
    debug: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error
  },
  silent: true,
	/*
  dkim: { // Default: False
    privateKey: fs.readFileSync('./dkim-private.pem', 'utf8'),
    keySelector: 'mydomainkey'
  },
  */
  devPort: 587, // Default: False
//  devHost: 'localhost' // Default: localhost
});







// Create a new service object
var svc = new Service({
  name: 'Sample service',
  description: 'The nodejs.org example web server.',
  script: 'C:\\wamp\\www\\node-windows\\sample-service\\service.js',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});

svc.on('start', function () {
  console.log('The service is started');
  sendMail( '\n\nThe service is started' );
  return;
});

svc.on('restart', function () {
  console.log('The service is restarted');
  sendMail( '\n\nThe service is started' );
  return;
});

svc.on('stop', function () {
  console.log('The service is stopped');
  sendMail( '\n\nThe service is stopped' );
  return;
});

switch (process.argv[2]) {
  case 'install':
    svc.on('alreadyinstalled', function () {
      console.log('The service is already installed');
      return;
    });

    // Listen for the 'install' event, which indicates the
    // process is available as a service.
    svc.on('install', function () {
      svc.start();
      console.log('Install complete');
      sendMail( '\n\nService ' );
    });

    svc.install();
    break;

  case 'uninstall':
    // Listen for the 'uninstall' event so we know when it's done.
    svc.on('uninstall', function () {
      console.log('Uninstall complete.');
    });

    // Uninstall the service.
    svc.uninstall();
    break;
    
  case 'start':
    svc.start();
    break;

  case 'restart':
    svc.restart();
    break;

  case 'stop':
    svc.stop();
    break;

}

function sendMail( message ) {
  
  sendmail({
      from: 'no-reply@xxx.com',
      to: 'pie.piemontese@gmail.com',
      subject: 'Sample service',
      html: message,
    }, function(err, reply) {
      console.log(err && err.stack);
      console.dir(reply);
      console.log('sendmail error');
  });  
  

  /*
  mail({
      from: 'no-reply@xxx.yyy', // sender address
      to: 'pie.piemontese@gmail.com', // list of receivers
      subject: 'Sample service', // Subject line
      text: message, // plaintext body
      html: '<b>' + message + '</b>' // html body
  });
  */
}

