const Api = require('./../../utils/api');

Page({
	data: {
		user: {
			avatar: './../../assets/img/share.png'
		},
		groupMess: {},
		signList: []
	},
	onLoad: function(options) {
		let id = options.id;
		let that = this;

		Api.groupGroupDetails({ id: id }).then((result) => {
			let res = result.data;

			that.setData({
				groupMess: res.groupMess,
				signList: res.signList
			});

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
