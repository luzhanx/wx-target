const Api = require('./../../utils/api');
let app = getApp();
let user = {};

Page({
	/**
   * 页面的初始数据
   */
	data: {
		template: {},
		fraction: {},
		newFix: false
	},

	onLoad: function() {
		// app.globalData.tabIndex = 1;
	},

	/**
   * 生命周期函数--监听页面显示
   */
	onShow: function(e) {
		let that = this;
		let cookie = '';

		try {
			user = wx.getStorageSync('user');
			cookie = wx.getStorageSync('cookie');

			// 登录了
			if (user !== '') {
				that.setData({
					user: user
				});
				Api.templateList().then(
					(result) => {
						let res = result.data;

						this.setData({
							template: res.template,
							fraction: res.user
						});
					},
					(err) => {
						console.log(err);
					}
				);

				// console.log('登录了');
				// 没登录
			} else {
				Api.templateList().then(
					(result) => {
						let res = result.data;

						that.setData({
							template: res.template
						});
						// console.log(res.template);
					},
					(err) => {
						console.log(err);
					}
				);

				console.log('没登录');
			}
		} catch (e) {
			// user = that.data.user;
			// cookie = '';
			console.log('读取缓存失败');
		}
	},
	showNewFix(e) {
		this.setData({
			newFix: !this.data.newFix
		});
	},
	// 点击跳转头像登录
	login() {
		if (user == '') {
			wx.navigateTo({
				url: '/pages/login/login'
			});
		}
	},
	// 添加目标
	link(e) {
		if (user == '') {
			wx.showModal({
				title: '提示',
				content: '登录后才能添加目标哦',
				success: function(res) {
					if (res.confirm) {
						// console.log('用户点击确定')
						wx.navigateTo({
							url: `/pages/login/login`
						});
					} else if (res.cancel) {
						// console.log('用户点击取消')
					}
				}
			});
			return;
		}
		let id = e.currentTarget.dataset.id;

		if (id !== undefined) {
			wx.navigateTo({
				url: `/pages/template/template?id=${id}`
			});
		} else {
			let type = e.currentTarget.dataset.type;
			if (type === 'geren') {
				wx.navigateTo({
					url: `/pages/new/new`
				});
			} else if (type === 'qun') {
				wx.navigateTo({
					url: `/pages/news/news`
				});
			}
		}
	}
});
