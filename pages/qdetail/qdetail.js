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
	onShow: function() {
		let id = this.options.id;
		let that = this;

		Api.groupGroupDetails({ id: id }).then((result) => {
			let res = result.data;

			that.setData({
				groupMess: res.groupMess,
				signList: res.signList,
				sign: res.sign
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
		let that = this;

		if (!wx.getStorageSync('user')) {
			wx.showModal({
				title: '提示',
				content: '登录后才能点赞哦',
				success: function(res) {
					if (res.confirm) {
						wx.navigateTo({
							url: `/pages/login/login`
						});
					} else if (res.cancel) {
					}
				}
			});
			return;
		}
		Api.groupAddgrouptarget({ id: this.data.groupMess.id }).then((result) => {
			let res = result.data;

			if (res.code === 0) {
				wx.showToast({
					title: res.msg,
					icon: 'success',
					mask: true
				});
				that.setData({
					groupMess: { ...that.data.groupMess, join: 1 }
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
	xinzan(e) {
		let id = e.currentTarget.dataset.id;
    let allow_probability = e.currentTarget.dataset.allow_probability;

    console.log(e.currentTarget.dataset.allow_probability)

		if (allow_probability == 1) {
				wx.showToast({
					title: '已经点赞',
					icon: 'none',
					mask: true
				});
      return;
		} else if (allow_probability == 2) {
				wx.showToast({
					title: '不能给自己点赞',
					icon: 'none',
          mask: true
        })
      return;
		}
		Api.signSignProbability({ id: id }).then((result) => {
			let res = result.data;

			if (res.code === 0) {
				wx.showToast({
					title: res.msg,
					icon: 'success',
					mask: true
				});
			} else {
				wx.showToast({
					title: res.msg,
					icon: 'success',
					mask: true
				});
			}
			console.log(res);
		});
	},
	onReady: function() {},
	onHide: function() {},
	onUnload: function() {},
	onPullDownRefresh: function() {},
	onReachBottom: function() {},
	onShareAppMessage: function() {},
	onPageScroll: function() {},
	//item(index,pagePath,text)
	onTabItemTap: function(item) {}
});
