
module.exports = function(client){
	let longho = client.redT.game.longho;
	//if (longho.clients[client.UID]) {
		// Bạn hoặc ai đó đang chơi Xóc Xóc bằng tài khoản này
	//	client.red({notice:{title:'CẢNH BÁO', text:'Bạn hoặc ai đó đang chơi Long Hổ bằng tài khoản này...', load: false}});
	//}else{
		// Vào Phòng chơi
		longho.clients[client.UID] = client;
		client.red({toGame:'LongHo'});

		Object.values(longho.clients).forEach(function(users){
			if (client !== users) {
				users.red({longho:{ingame:{client:Object.keys(longho.clients).length+longho.botCount}}});
			}
		});
	//}
	longho = null;
	client = null;
};
