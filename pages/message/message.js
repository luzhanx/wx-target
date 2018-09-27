const Api = require('./../../utils/api');

Page({
	/**
   * 页面的初始数据
   */
	data: {
		message: []
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function(options) {
		let that = this;

		that.getList();
	},
	getList() {
		let that = this;
		Api.signActivemess().then((result) => {
			let res = result.data;

			that.setData({
				message: res.message
			});
		});
	},
	// 补签
	handleBuqian(e) {
		let that = this;
    let id = e.currentTarget.dataset.id;
    let broken = e.currentTarget.dataset.broken;
    if(broken !== 0){
      return;
    }
		Api.signRetroactive({ id: id }).then((result) => {
			let res = result.data;

			console.log(res);
			if (res.code === 0) {
				wx.showToast({
					title: res.msg,
					icon: 'none',
					mask: false
				});
				setTimeout(() => {
					that.getList();
				}, 2000);
			} else {
				wx.showToast({
					title: res.msg,
					icon: 'none',
					mask: false
				});
			}
		});
	},
	/**
   * 生命周期函数--监听页面初次渲染完成
   */
	onReady: function() {},

	/**
   * 生命周期函数--监听页面显示
   */
	onShow: function() {}
});
