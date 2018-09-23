//app.js
var aldstat= require("./utils/ald-stat.js");

App({
	onLaunch() {
		const updateManager = wx.getUpdateManager();

		updateManager.onCheckForUpdate((res) => {
			console.log(res.hasUpdate);
		});

		updateManager.onUpdateReady(() => {
			wx.showModal({
				title: '更新提示',
				content: '新版本已经准备好，是否重启应用？',
				success(res) {
					if (res.confirm) {
						wx.clearStorageSync();
						updateManager.applyUpdate();
					} else {
						wx.clearStorageSync();
						updateManager.applyUpdate()
					}
				}
			});
		});

		updateManager.onUpdateFailed(() => {
			// 新版本下载失败
		});
	},
	globalData: {
		userInfo: null,
    tabIndex: 0,
    tipNum: 0,
		share: {
			rank: 95,
			user: {
				nickname: '路栈',
				avatar:
					'https://wx.qlogo.cn/mmopen/vi_32/oic6pu4PMKTSLUKOibBAB0XLbYX7iaQaZaLx8wNEmovI1gpg2FDoLIcx8OEV5XfXBnGGPnbbGMtOZkfmCDMSsayYw/132',
				star: 118,
				id: 600035,
				rank: 2
			},
			finData: { '2018-09': [ '21' ] },
			count: 1
		}
	}
});
