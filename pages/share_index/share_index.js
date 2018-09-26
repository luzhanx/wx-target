const Api = require('./../../utils/api');
let app = getApp();
let user = {};

Page({
	/**
   * 页面的初始数据
   */
	data: {
		myRank: '',
		sign: 1 //0=可点赞 1=已点过赞 ， 2=不能给自己点赞
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function(options) {},

	/**
   * 生命周期函数--监听页面初次渲染完成
   */
	onReady: function() {},
	// 鼓励一下
	handZan(e) {
		let that = this;
		let target = e.currentTarget.dataset;
		let sign = target.sign;

		if (sign === 0) {
			let id = target.id;
			Api.probability(id).then(
				(result) => {
					console.log(result);
					// 点赞成功
					if (result.data.code == 0) {
						wx.showToast({
							title: result.data.msg,
							icon: 'none',
							mask: true
						});
						setTimeout(() => {
							that.probabilityPage(id);
						}, 1000);
					} else {
						// 已经点赞过
						wx.showToast({
							title: result.data.msg,
							icon: 'none',
							mask: true
						});
					}
				},
				(err) => {
					console.log(err);
				}
			);
		} else if (sign == 2) {
			wx.showToast({
				title: '不能给自己点赞',
				icon: 'none',
				mask: true
			});
			return;
		} else if (sign == 1) {
			wx.showToast({
				title: '你今日已帮他点赞过了',
				icon: 'none',
				mask: true
			});
			return;
		} else {
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
		}
		console.log();
	},
	/**
   * 获取信息
   */
	probabilityPage(id) {
		let that = this;

		Api.probabilityPage(id).then(
			(result) => {
				let res = result.data;

				that.setData({
					myRank: res.myRank,
					sign: res.sign
				});
				// console.log(res.myRank)
			},
			(err) => {
				console.log(err);
			}
		);
	},
	/**
   * 生命周期函数--监听页面显示
   */
	onShow: function() {
		let that = this;
		let cookie = '';
		let id = this.options.scene ? this.options.scene : this.options.id;

		try {
			user = wx.getStorageSync('user');
			cookie = wx.getStorageSync('cookie');

			// 登录了
			if (user !== '') {
				that.probabilityPage(id);
				// 没登录
			} else {
				that.probabilityPage(id);

				console.log('没登录');
			}
		} catch (e) {
			// user = that.data.user;
			// cookie = '';
			console.log(e);
			console.log('读取缓存失败');
		}
	},

	/**
   * 生命周期函数--监听页面隐藏
   */
	onHide: function() {},

	/**
   * 生命周期函数--监听页面卸载
   */
	onUnload: function() {},

	/**
   * 页面相关事件处理函数--监听用户下拉动作
   */
	onPullDownRefresh: function() {},

	/**
   * 页面上拉触底事件的处理函数
   */
	onReachBottom: function() {},

	/**
   * 用户点击右上角分享
   */
	onShareAppMessage: function() {}
});
