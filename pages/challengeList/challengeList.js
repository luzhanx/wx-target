const Api = require('./../../utils/api');

Page({
	/**
   * 页面的初始数据
   */
	data: {
		challenge: []
	},
	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function(options) {
		let that = this;
		let id = this.options.id;

		Api.challengeIndex().then((result) => {
			let res = result.data;

			that.setData({
				challenge: res.challenge
			});
		});
	},
	toChallenge(e) {
		let id = e.currentTarget.dataset.id;
    // console.log(id);
    wx.navigateTo({
      url: '/pages/challenge/challenge?id=' + id
    });
	}
});
