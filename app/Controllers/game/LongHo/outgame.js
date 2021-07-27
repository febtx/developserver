
module.exports = function(client){
	// longho 
	let longho = client.redT.game.longho;
	if (longho.clients[client.UID] === client) {
		delete longho.clients[client.UID];

		let clients = Object.keys(longho.clients).length + longho.botCount;
		Object.values(longho.clients).forEach(function(users){
			if (client !== users) {
				users.red({longho:{ingame:{client:clients}}});
			}
		});
	}
	longho = null;
	client = null;
};
