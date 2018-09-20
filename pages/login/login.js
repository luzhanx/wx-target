Page({
	data: {},
	onLoad: function() {},
	getPHPSESSION(cookie) {
		// return cookie.match(/PHPSESSID=\S+;/)[0];
		return cookie
			.replace(new RegExp(/expires=.+?HttpOnly/, 'gm'), '')
			.replace(new RegExp(/,/, 'gm'), '')
			.replace(new RegExp(/path=.+?HttpOnly/, 'gm'), '')
			.replace(/path=\//g, '');
	},
	getUserInfo(e) {
		let that = this;
		wx.showLoading({
			title: '登录授权中'
		});

		wx.login({
			success(wxres) {
				wx.request({
					url: 'https://xdk.xtow.net/api.php/login/index',
					method: 'Post',
					data: {
						code: wxres.code,
						encryptedData: e.detail.encryptedData,
						iv: e.detail.iv
					},
					success(res) {
						// 登录成功 {code:0, msg:"登录成功", result: json}
						if (res.data.code === 0) {
							let cookie = that.getPHPSESSION(res.header['Set-Cookie']);
							let user = res.data.result;

							// "first_login":0  0=已注册 ， 100=注册返回星星

							if (res.data.result.first_login == 0) {
								wx.showToast({
									title: res.data.msg,
									icon: 'success',
									duration: 2000
								});
							} else {
								getCurrentPages()[getCurrentPages().length - 2].setData({
									showModal: true,
									startNum: res.data.result.first_login
								});
								wx.showToast({
									title: `注册成功`,
									icon: 'none',
									duration: 2000,
									mask: true
								});
								// ${res.data.result.first_login}
							}

							setTimeout(() => {
								wx.setStorage({
									key: 'cookie',
									data: cookie,
									success() {
										wx.setStorage({
											key: 'user',
											data: user,
											success() {
												wx.navigateBack({
													delta: 1
												});
											}
										});
									}
								});
							}, 2000);
						} else {
							wx.showToast({
								title: res.data.msg,
								icon: 'none',
								duration: 1000
							});
						}
						// console.log(cookie);
					}
				});
			}
		});
	}
});
