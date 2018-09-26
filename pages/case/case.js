const Api = require('./../../utils/api');
let app = getApp();

//Page Object
Page({
	data: {
		failed: [],
		success: [],
		data: [],
		sle: 0
	},

	onLoad: function(options) {
		let that = this;

		Api.pigeonhole().then((result) => {
			let res = result.data.data;

			that.setData({
				failed: res.failed ? res.failed : [],
				data: res.success ? res.success : [],
				success: res.success ? res.success : []
			});
		});
	},
	sel(e) {
		let index = e.currentTarget.dataset.index;

		this.setData({
			sel: index,
			data: index == 0 ? this.data.success : this.data.failed
		});
	},
	onReady: function() {},
	onShow: function() {}
});
