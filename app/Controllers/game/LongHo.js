
let ingame  = require('./LongHo/ingame');
let outgame = require('./LongHo/outgame');
let cuoc    = require('./LongHo/cuoc');
let history = require('./LongHo/history');

module.exports = function(client, data){
	if (!!data.ingame) {
		ingame(client);
	}
	if (!!data.outgame) {
		outgame(client);
	}
	if (!!data.cuoc) {
		cuoc(client, data.cuoc);
	}
	if (!!data.log) {
		history(client, data.log);
	}
	client = null;
	data   = null;
};
