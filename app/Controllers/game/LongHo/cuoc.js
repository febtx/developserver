
let LongHo_cuoc = require('../../../Models/LongHo/LongHo_cuoc');
let UserInfo    = require('../../../Models/UserInfo');
let TopVip      = require('../../../Models/VipPoint/TopVip');
let getConfig   = require('../../../Helpers/Helpers').getConfig;

module.exports = function(client, data){
	if (!!data.cuoc && !!data.box) {
		let cuoc = data.cuoc>>0;
		let box  = data.box;
		// longho LongHo
		if (client.redT.game.longho.time < 2 || client.redT.game.longho.time > 30) {
			client.red({longho:{notice: 'Vui lòng cược ở phiên sau.!!'}});
			return;
		}

		if (!(cuoc === 1000 || cuoc === 10000 || cuoc === 50000 || cuoc === 100000 || cuoc === 1000000) ||
			!(box === 'chan' || box === 'le' || box === 'red3' || box === 'red4' || box === 'white3' || box === 'white4' || box === 'hoa')) {
			client.red({mini:{XocXoc:{notice: 'Cược thất bại...'}}});
		}else{
			let name = client.profile.name;
			UserInfo.findOne({id:client.UID}, 'red', function(err, user){
				if (!user || user.red < cuoc) {
					client.red({LongHo:{notice: 'Bạn không đủ Gold để cược.!!'}});
				}else{
					user.red -= cuoc;
					user.save();

					let longho = client.redT.game.longho;

					longho.chip[box][cuoc] += 1;

					LongHo_cuoc.findOne({uid:client.UID, phien:longho.phien}, function(err, checkOne) {
						if (checkOne){
							checkOne[box] += cuoc;
							checkOne.save();
						}else{
							var create = {uid:client.UID,name: name, phien:longho.phien, time: new Date()};
							create[box] = cuoc;
							LongHo_cuoc.create(create);
						}

						let newData = {
							'chan':   0,
							'le':     0,
							'red3':   0,
							'red4':   0,
							'white3': 0,
							'white4': 0,
							'hoa': 0,
						};
						newData[box] = cuoc;
						let me_cuoc = {};
						longho.data.red[box] += cuoc;
						longho.dataAdmin.red[box] += cuoc;
						if (longho.ingame.red[name]) {
							longho.ingame.red[name][box] += cuoc;
						}else{
							longho.ingame.red[name] = newData;
						}
						me_cuoc.red = longho.ingame.red[name];
						Object.values(longho.clients).forEach(function(users){
							if (client !== users) {
								users.red({longho:{chip:{box:box, cuoc:cuoc}}});
							}else{
								users.red({longho:{mechip:{box:box, cuoc:data.cuoc}, me:me_cuoc}, user:{red:user.red}});
							}
						});

						let vipStatus = getConfig('topVip');
						if (!!vipStatus && vipStatus.status === true) {
							TopVip.updateOne({'name':name}, {$inc:{vip:cuoc}}).exec(function(errV, userV){
								if (!!userV && userV.n === 0) {
									try{
						    			TopVip.create({'name':name, 'vip':cuoc});
									} catch(e){
									}
								}
								name = null;
								cuoc = null;
							});
						}else{
							name = null;
							cuoc = null;
						}
						client  = null;
						longho  = null;
						me_cuoc = null;
						newData = null;
						data    = null;
						box  = null;
					})
				}
			});
		}
	}
};
