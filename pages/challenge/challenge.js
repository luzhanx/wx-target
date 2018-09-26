// pages/challenge/challenge.js
let timeOut;
const Api = require('./../../utils/api');

Page({
	/**
   * 页面的初始数据
   */
	data: {
		challengeInfo: [],
		challengeList: [],
		time: {
			d: 0,
			h: 0,
			m: 0,
			s: 0
		},
		submit: '活动暂未开始',
		showModal2: false
	},
	countTime(residue) {
		let that = this;
		//获取当前时间
		var date = new Date();
		var now = date.getTime();
		//设置截止时间
		var endDate = new Date(residue);
		var end = endDate.getTime();
		//时间差
		var leftTime = end - now;
		//定义变量 d,h,m,s保存倒计时的时间
		var d, h, m, s;
		if (leftTime >= 0) {
			d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
			h = Math.floor((leftTime / 1000 / 60 / 60) % 24);
			m = Math.floor((leftTime / 1000 / 60) % 60);
			s = Math.floor((leftTime / 1000) % 60);
		} else {
			clearTimeout(timeOut);
			return;
		}
		//将倒计时赋值到div中
		// console.log(d + ":" + h + ":" + m + ":" + s)
		this.setData({
			time: {
				d: d,
				h: h,
				m: m,
				s: s
			}
		});
		//递归每秒调用countTime方法，显示动态时间效果
		timeOut = setTimeout(() => {
			// console.log(that.data.challengeInfo.residue)
			that.countTime(that.data.challengeInfo.residue);
		}, 1000);
	},
	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function(options) {
		let that = this;
		let id = this.options.id;

		Api.challengeDetails({
			id: id
		})
			.then((result) => {
				let res = result.data;
				console.log(res);

				let submitText = that.submitText(res.challengeInfo.challenge_state);

				that.setData({
					challengeInfo: res.challengeInfo,
					challengeList: res.challengeList,
					submitText: submitText
				});
				this.countTime(res.challengeInfo.residue);
			})
			.catch((e) => {
				wx.hideLoading();
			});
	},
	submitText(text) {
		// 0=正在报名 1=活动未开始 2=活动进行中 3=已报名（登陆后） 4=人数已上限
		if (text === 0) {
			return '参加挑战';
		} else if (text === 1) {
			return '活动未开始';
		} else if (text === 2) {
			return '活动进行中';
		} else if (text === 3) {
			return '进入挑战';
		} else if (text === 4) {
			return '人数已上限';
		} else if (text === 5) {
			return '已放弃挑战';
		}
		return '';
	},
	closeShowModal2() {
		if (!wx.getStorageSync('user')) {
			wx.showModal({
				title: '提示',
				content: '登录后才能参加活动哦',
				success: function(res) {
					if (res.confirm) {
						wx.navigateTo({
							url: `/pages/login/login`
						});
					} else if (res.cancel) {
					}
				}
			});
			return;
		}
		// 0=正在报名 1=活动未开始 2=活动进行中 3=已报名（登陆后） 4=人数已上限
		if (this.data.submitText === '活动未开始') {
			return wx.showToast({
				title: '活动未开始',
				mask: true
			});
			return;
		}
		if (this.data.submitText === '活动进行中') {
			return wx.showToast({
				icon: 'none',
				title: '挑战进行中',
				mask: true
			});
		}
		if (this.data.submitText === '人数已上限') {
			return wx.showToast({
				icon: 'none',
				title: '人数已上限',
				mask: true
			});
		}
		if (this.data.submitText === '已放弃挑战') {
			return wx.showToast({
				icon: 'none',
				title: '已放弃挑战',
				mask: true
			});
		}
		if (this.data.submitText === '进入挑战') {
			return wx.redirectTo({
				url: '/pages/challengeDetail/challengeDetail?id=' + that.data.challengeInfo.id
			});
		}
		this.setData({
			showModal2: !this.data.showModal2
		});
	},
	submit(e) {
		let formId = e.detail.formId;
		let id = this.options.id;
		let that = this;
		console.log('submit');

		Api.payIndex({
			challenge_money: that.data.challengeInfo.challenge_money
		}).then((result) => {
			let res = result.data;
			console.log(res);

			wx.requestPayment({
				timeStamp: res.timeStamp,
				nonceStr: res.nonceStr,
				package: res.package,
				signType: res.signType,
				paySign: res.paySign,
				success: (result) => {
					Api.challengeAdd({
						id: id,
						formId: formId
					})
						.then((result) => {
							let res = result.data;

							if (res.code === 0) {
								wx.showToast({
									title: res.msg,
									icon: 'none',
									mask: true
								});
								wx.redirectTo({
									url: '/pages/challengeDetail/challengeDetail?id=' + that.data.challengeInfo.id
								});
							} else {
								wx.showToast({
									title: res.msg,
									icon: 'none',
									mask: true
								});
							}

							console.log(res);
						})
						.catch((e) => {
							wx.showToast({
								title: '网络异常',
								icon: 'none',
								mask: true
							});
						});
				},
				fail: () => {
					wx.showToast({
						title: '支付失败',
						icon: 'none',
						mask: true
					});
				},
				complete: () => {}
			});
		});
		// Api.challengeAdd({
		//   id: id,
		//   formId: formId
		// }).then(result => {
		//   let res = result.data;

		//   if (res.code === 0) {
		//     wx.showToast({
		//       title: res.msg,
		//       icon: 'none',
		//       mask: true,
		//     });
		//   } else {
		//     wx.showToast({
		//       title: res.msg,
		//       icon: 'none',
		//       mask: true,
		//     });
		//   }

		//   console.log(res);

		// }).catch(e => {
		//   wx.showToast({
		//     title: '网络异常',
		//     icon: 'none',
		//     mask: true,
		//   });
		// })
	},

	/**
   * 用户点击右上角分享
   */
	onShareAppMessage: function() {
		console.log(this.data.challengeInfo.challenge_show);
		return {
			title: `挑战-${this.data.challengeInfo.challenge_title}`,
			path: `/pages/challenge/challenge?id=${this.data.challengeInfo.id}`,
			imageUrl: `${this.data.challengeInfo.challenge_show}`
		};
	}
});
