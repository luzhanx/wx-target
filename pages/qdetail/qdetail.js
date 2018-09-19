const Api = require('./../../utils/api');

Page({
	data: {
		user: {
			avatar: './../../assets/img/share.png'
		},
		groupMess: {},
		signList: [],

		ShowText: false,
		ShowTextBtn: '点击全文'
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
	handleShowText() {
		let that = this;

		if (this.data.ShowText) {
			this.setData({
				ShowTextBtn: '点击收起',
				ShowText: !this.data.ShowText
			});
		} else {
			this.setData({
				ShowTextBtn: '点击全文',
				ShowText: !this.data.ShowText
			});
		}
	},
	// 加入群目标
	addgroup() {
		Api.groupAddgrouptarget({ id: this.data.id }).then((result) => {
			let res = result.data;

			if (res.code === 0) {
				wx.showToast({
					title: res.msg,
					icon: 'success',
					mask: true
				});
			} else if (res.code === 1) {
				wx.showToast({
					title: res.msg,
					icon: 'none',
					mask: true
				});
			} else {
				wx.showToast({
					title: res.msg,
					icon: 'none',
					mask: true
				});
			}
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
