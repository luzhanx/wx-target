const Api = require('./../../utils/api');
let app = getApp();

//Page Object
Page({
	data: {
		balance: ''
	},
	//options(Object)
	onLoad: function(options) {
		let that = this;

		Api.withdrawIndex().then((result) => {
			let res = result.data;

			that.setData({
				balance: res.balance
			});
		});
	},
	tixian() {
		let that = this;
		if (parseFloat(that.data.balance) < 1) {
			wx.showToast({
				title: '提现金额不能小于1元',
				icon: 'none',
				mask: false
			});
			return;
		}
		wx.showModal({
			title: '提现',
			content: '确定要全部提现吗',
			success: (result) => {
				if (result.confirm) {
					Api.withdrawBalance({ price: that.data.balance }).then((result) => {
						let res = result.data;

						if (res.code === 0) {
							wx.showToast({
								title: res.msg,
								icon: 'none',
								mask: true
              });
              this.setData({
                balance: 0
              })
						} else {
							wx.showToast({
								title: res.msg,
								icon: 'none',
								mask: true
							});
						}
					});
				}
			}
		});
	},
	onReady: function() {},
	onShow: function() {}
});
