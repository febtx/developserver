
let HU                 = require('../../../Models/HU');
let Audition_red   = require('../../../Models/Audition/Audition_red');
let Audition_users = require('../../../Models/Audition/Audition_users');
let UserInfo           = require('../../../Models/UserInfo');

function onSelectBox(client, box){
	box = box>>0;
	if (void 0 !== client.Audition &&
		client.Audition.bonus !== null &&
		client.Audition.bonusL > 0)
	{
		let index = box-1;
		if (void 0 !== client.Audition.bonus[index]) {
			if (!client.Audition.bonus[index].isOpen) {
				client.Audition.bonusL -= 1;
				client.Audition.bonus[index].isOpen = true;
				let bet = client.Audition.bonus[index].bet;
				client.Audition.bonusWin += bet;
				client.red({Audition:{bonus:{bonus: client.Audition.bonusL, box: index, bet: bet}}});
				if (!client.Audition.bonusL) {
					let betWin = client.Audition.bonusWin*client.Audition.bonusX;

					let uInfo    = {};
					let gInfo    = {};
					let huUpdate = {};

					huUpdate.redWin = betWin;
					uInfo.red       = betWin;
					uInfo.redWin    = betWin;
					uInfo.totall    = betWin;
					gInfo.win       = betWin;
					gInfo.totall    = betWin;

					Audition_red.updateOne({'_id': client.Audition.id}, {$inc:{win:betWin}}).exec();

					client.Audition.bonus    = null;
					client.Audition.bonusWin = 0;
					client.Audition.bonusX   = 0;

					UserInfo.findOneAndUpdate({id:client.UID}, {$inc:uInfo}, function(err, user){
						setTimeout(function(){
							client.red({Audition:{bonus:{win: betWin}}, user:{red:user.red*1+betWin}});
							client = null;
						}, 700);
					});
					HU.updateOne({game:'audition', type:client.Audition.bet}, {$inc:huUpdate}).exec();
					Audition_users.updateOne({'uid':client.UID}, {$inc:gInfo}).exec();
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
