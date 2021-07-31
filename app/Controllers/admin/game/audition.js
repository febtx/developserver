
let get_data = require('./audition/get_data');
let get_top  = require('./audition/get_top');
let name_hu  = require('./audition/name_hu');
let setChedo = require('./audition/setChedo');
let reset_top  = require('./audition/reset_top');
let reset_data = require('./audition/reset_data');

module.exports = function(client, data) {
	if (void 0 !== data.get_data) {
		get_data(client)
	}
	if (void 0 !== data.name_hu) {
		name_hu(client, data.name_hu)
	}
	if (void 0 !== data.get_top) {
		get_top(client, data.get_top)
	}
	if (void 0 !== data.chedo) {
		setChedo(client, data.chedo);
	}
	if (void 0 !== data.reset_top) {
		reset_top(client);
	}
	if (void 0 !== data.reset_data) {
		reset_data(client);
	}
}
