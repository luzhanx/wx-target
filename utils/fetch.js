// fetch.js 最底层封装

module.exports = function(url, method, data, params) {
	let cookie = '1';
	try {
		cookie = wx.getStorageSync('cookie');
	} catch (e) {
		cookie = '';
	}
	// console.log(cookie);
	let headers = {
		'content-type': 'application/json',
		Cookie: cookie
	};

	return new Promise((resolve, reject) => {
		wx.showLoading({
			title: '加载中',
			mark: true
		});
		wx.showNavigationBarLoading();

		const URL = url + urlEncode(params);
		// console.log('[HTTP]', method, URL)
		wx.request({
			url: URL,
			method: method,
			data: Object.assign({}, data),
			header: headers,
			success: (res) => {
				wx.hideLoading();
				wx.hideNavigationBarLoading();
				if (res.statusCode >= 400 && res.statusCode < 600) {
					if (res.statusCode === 401) {
						wx.clearStorage();
						wx.reLaunch({
							url: '/pages/login/login'
						});
						wx.showToast({
							icon: 'loading',
							title: '请重新登录'
						});
					} else {
						console.log('fetch error', res);
						reject(res);
					}
				} else {
					resolve(res);
				}
			},
			fail: (error) => {
				wx.hideLoading();
				console.log('fetch error', error);
			}
		});
	});
};

function urlEncode(params) {
	if (params) {
		var result = '?';
		for (let key in params) {
			result += `${key}=${params[key]}&`;
		}
		return result;
	}
	return '';
}
