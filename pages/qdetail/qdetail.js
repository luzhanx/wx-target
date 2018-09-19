const Api = require('./../../utils/api');

Page({
	data: {
		user: {
			avatar: './../../assets/img/share.png'
		}
	},
	onLoad: function(options) {
		let id = options.id;
		Api.groupGroupDetails({id: id}).then((result) => {
			let res = result.data;

			console.log(res);
		});
	},
	onReady: function() {},
	onShow: function() {},
	onHide: function() {},
	onUnload: function() {},
	onPullDownRefresh: function() {},
	onReachBottom: function() {},
	onShareAppMessage: function() {},
	onPageScroll: function() {},
	//item(index,pagePath,text)
	onTabItemTap: function(item) {}
});
