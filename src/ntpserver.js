



const NTPServer = require('ntp-time').Server;
const server = new NTPServer();

// Define your custom handler for requests
server.handle((message, response) => {
	console.log('Server message:', message);

	message.transmitTimestamp = Math.floor(Date.now() / 1000);

	response(message);
});


server.listen(3001, err => {
	if (err) throw err;

	console.log('Server listening');
});