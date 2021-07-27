
let LongHo_phien = require('../../../Models/LongHo/LongHo_phien');
let LongHo_chat  = require('../../../Models/LongHo/LongHo_chat');
let LongHo_cuoc  = require('../../../Models/LongHo/LongHo_cuoc');
// LongHo longho
module.exports = function(client){
	let longho = client.redT.game.longho;
	if (longho.clients[client.UID] === client) {
		let phien = longho.phien;
		// Lấy thông tin phòng
		 console.log("tai game moi");
		let data = {};
		data.time   = longho.time;
		data.data   = longho.data;
		data.chip   = longho.chip;
		data.client = Object.keys(longho.clients).length + longho.botCount;

		var active1 = new Promise((resolve, reject) => {
			LongHo_phien.find({}, 'red1 red2 red3 red4', {sort:{'_id':-1}, limit:48}, function(err, logs) {
				Promise.all(logs.map(function(log){
					log = log._doc;
					delete log._id;
					return log;
				}))
				.then(function(result) {
					resolve(result);
				})
			});
		});

		var active2 = new Promise((resolve, reject) => {
			LongHo_chat.find({}, 'name value', {sort:{'_id':-1}, limit:20}, function(err, chats) {
				Promise.all(chats.map(function(chat){
					chat = chat._doc;
					delete chat._id;
					return chat;
				}))
				.then(function(result) {
					resolve(result);
				})
			});
		});

		var active3 = new Promise((resolve, reject) => {
			LongHo_cuoc.find({phien:phien}, 'bet type', {sort:{'_id':-1}}, function(err, phiens) {
				Promise.all(phiens.map(function(phien){
					phien = phien._doc;
					delete phien._id;
					return phien;
				}))
				.then(function(result) {
					resolve(result);
				})
			});
		});

		Promise.all([active1, active2, active3]).then(values => {
			data.logs  = values[0];
			data.chats = values[1];
			data.cuoc  = values[2];
			data.me = {};
			if (longho.ingame.red[client.profile.name]) {
				data.me.red = longho.ingame.red[client.profile.name]
			}
			data.listbott1 = "123";
			client.red({longho:{ingame:data}});
			values = null;
			data   = null;
			client = null;
			longho = null;
		});
	}else{
		// trở lại màn hình trang chủ
		client.red({toGame:'MainGame'});
		client = null;
		longho = null;
	}
};
