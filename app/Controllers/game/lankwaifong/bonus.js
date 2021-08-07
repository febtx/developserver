
let HU                 = require('../../../Models/HU');
let LanKwaiFong_red   = require('../../../Models/LanKwaiFong/LanKwaiFong_red');
let LanKwaiFong_users = require('../../../Models/LanKwaiFong/LanKwaiFong_users');
let UserInfo           = require('../../../Models/UserInfo');
//lankwaifong LanKwaiFong
function onSelectBox(client, box){
	box = box>>0;
	if (void 0 !== client.LanKwaiFong &&
		client.LanKwaiFong.bonus !== null &&
		client.LanKwaiFong.bonusL > 0)
	{
		let index = box-1;
		if (void 0 !== client.LanKwaiFong.bonus[index]) {
			if (!client.LanKwaiFong.bonus[index].isOpen) {
				client.LanKwaiFong.bonusL -= 1;
				client.LanKwaiFong.bonus[index].isOpen = true;
				let bet = client.LanKwaiFong.bonus[index].bet;
				client.LanKwaiFong.bonusWin += bet;
				client.red({LanKwaiFong:{bonus:{bonus: client.LanKwaiFong.bonusL, box: index, bet: bet}}});
				if (!client.LanKwaiFong.bonusL) {
					let betWin = client.LanKwaiFong.bonusWin*client.LanKwaiFong.bonusX;

					let uInfo    = {};
					let gInfo    = {};
					let huUpdate = {};

					huUpdate.redWin = betWin;
					uInfo.red       = betWin;
					uInfo.redWin    = betWin;
					uInfo.totall    = betWin;
					gInfo.win       = betWin;
					gInfo.totall    = betWin;

					LanKwaiFong_red.updateOne({'_id': client.LanKwaiFong.id}, {$inc:{win:betWin}}).exec();

					client.LanKwaiFong.bonus    = null;
					client.LanKwaiFong.bonusWin = 0;
					client.LanKwaiFong.bonusX   = 0;

					UserInfo.findOneAndUpdate({id:client.UID}, {$inc:uInfo}, function(err, user){
						setTimeout(function(){
							client.red({LanKwaiFong:{bonus:{win: betWin}}, user:{red:user.red*1+betWin}});
							client = null;
						}, 700);
					});
					HU.updateOne({game:'lankwaifong', type:client.LanKwaiFong.bet}, {$inc:huUpdate}).exec();
					LanKwaiFong_users.updateOne({'uid':client.UID}, {$inc:gInfo}).exec();
				}else{
					client = null;
				}
			}
		}
	}
}

module.exports = function(client, data){
	if (void 0 !== data.box) {
		onSelectBox(client, data.box);
	}
};
