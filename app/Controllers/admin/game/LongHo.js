
let LongHo_setDice = require('./longho/set_dice');
let LongHo_getNew  = require('./longho/get_new');
let dashboard      = require('./longho/dashboard');
let resetTop       = require('./longho/resetTop');

module.exports = function(client, data) {
	if (void 0 !== data.view) {
		client.gameEvent.viewXocXoc = !!data.view;
	}
	if (void 0 !== data.get_new) {
		LongHo_getNew(client);
	}
	if (void 0 !== data.set_dice) {
		LongHo_setDice(client, data.set_dice);
	}
	if (!!data.dashboard) {
		dashboard(client, data.dashboard);
	}
	if (!!data.resetTop) {
		resetTop(client);
	}
}
