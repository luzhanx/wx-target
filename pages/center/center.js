const Api = require('./../../utils/api');
let app = getApp();
let user = {};

// console.log(app);

Page({
	/**
   * 页面的初始数据
   */
	data: {
		user: ''
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function(options) {
		let that = this;

		wx.getStorage({
			key: 'user',
			success: (result) => {
				that.setData({
					user: result.data
				});
			}
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
	shareIndex() {
		this.data.user.id &&
			wx.navigateTo({
				url: `/pages/share_index/share_index?id=${this.data.user.id}`
			});
	}
});
