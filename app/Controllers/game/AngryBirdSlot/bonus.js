
let HU            = require('../../../Models/HU');
let AngryBirdSlot_red  = require('../../../Models/AngryBirdSlot/AngryBirdSlot_red');
let AngryBirdSlot_user = require('../../../Models/AngryBirdSlot/AngryBirdSlot_user');
let UserInfo   = require('../../../Models/UserInfo');

function onSelectBox(client, box){
	box = box>>0;
	if (void 0 !== client.AngryBirdSlot &&
		client.AngryBirdSlot.bonus !== null &&
		client.AngryBirdSlot.bonusL > 0)
	{
		var index = box-1;
		if (void 0 !== client.AngryBirdSlot.bonus[index]) {
			if (!client.AngryBirdSlot.bonus[index].isOpen) {
				client.AngryBirdSlot.bonusL -= 1;
				client.AngryBirdSlot.bonus[index].isOpen = true;

				var bet = client.AngryBirdSlot.bonus[index].bet;
				client.AngryBirdSlot.bonusWin += bet;
				client.red({AngryBirdSlot:{bonus:{bonus: client.AngryBirdSlot.bonusL, box: index, bet: bet}}});
				if (!client.AngryBirdSlot.bonusL) {
					var betWin = client.AngryBirdSlot.bonusWin;
					var uInfo    = {};
					var gInfo    = {};
					var huUpdate = {};
						huUpdate.redWin = betWin;
						uInfo.red       = betWin;
						uInfo.redWin    = betWin;
						gInfo.win       = betWin;
						AngryBirdSlot_red.updateOne({'_id': client.AngryBirdSlot.id}, {$inc:{win:betWin}}).exec();
					}
					client.AngryBirdSlot.bonus    = null;
					client.AngryBirdSlot.bonusWin = 0;
					UserInfo.findOneAndUpdate({id:client.UID}, {$inc:uInfo}, function(err, user){
						setTimeout(function(){
								client.red({AngryBirdSlot:{bonus:{win: betWin}}, user:{red:user.red*1+betWin}});
						}, 700);
					});
					HU.updateOne({game:'AngryBirdSlot', type:client.AngryBirdSlot.bet}, {$inc:huUpdate}).exec();
					AngryBirdSlot_user.updateOne({'uid':client.UID}, {$inc:gInfo}).exec();
				}
			}
		}
	}

module.exports = function(client, data){
	if (void 0 !== data.box) {
		onSelectBox(client, data.box);
	}
};
