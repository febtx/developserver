
let spin  = require('./audition/spin');
let bonus = require('./audition/bonus');
let log   = require('./audition/log');
let top   = require('./audition/top');

module.exports = function(client, data){
	if (!!data.bonus) {
		bonus(client, data.bonus);
	}
	if (!!data.spin) {
		spin(client, data.spin);
	}
	if (!!data.log) {
		log(client, data.log);
	}
	if (void 0 !== data.top) {
		top(client);
	}
};
