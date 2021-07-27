
let LongHo = require('./LongHo/reg');

module.exports = function(client, game){
	switch(game) {
	  	case 'LongHo':
	    	LongHo(client);
	   	break;
	}
	client = null;
	game = null;
};
