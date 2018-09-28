const Api = require('./../../utils/api');

Page({
	data: {
		challengeInfo: {},
		signList: [],
		pageIndex: 1,
		sign: 0,
		showModal2: false
	},
	onLoad: function() {
		let id = this.options.id;
		let that = this;

		Api.challengeChallengeSign({
			id: id
		}).then((result) => {
			let res = result.data;

			that.setData({
				challengeInfo: res.challengeInfo,
				signList: res.signList,
				sign: res.sign
			});

			console.log(res);
		});
	},
	// 签到
	// "sign": 3 0 //当日是否可签到 0=可以签到，1=目标完成 2=超时 3=今日已签到 4=活动未开始 5=未到签到时间
	report() {
		if (this.data.sign === 1) {
			wx.showToast({
				title: '目标完成',
				icon: 'none',
				mask: true
			});
			return;
		}
		if (this.data.sign === 2) {
			wx.showToast({
				title: '挑战超时',
				icon: 'none',
				mask: true
			});
			return;
		}
		if (this.data.sign === 3) {
			wx.showToast({
				title: '今日已签到',
				icon: 'none',
				mask: true
			});
			return;
		}
		if (this.data.sign === 4) {
			wx.showToast({
				title: '活动未开始',
				icon: 'none',
				mask: true
			});
			return;
		}
		if (this.data.sign === 5) {
			wx.showToast({
				title: '未到签到时间',
				icon: 'none',
				mask: true
			});
			return;
		}
		console.log(this.data.sign, '签到时间。');
		// 签到页面
		wx.navigateTo({
			url: '/pages/challengeReport/challengeReport'
		});
	},
	onShow() {
		let res = this.data.result;
		if (res) {
			if (res.code === 1) {
				console.log('签到成功');
			} else if (res.code === 2) {
				this.setData({
					showModal2: true
				});
			}
		}
	},
	xinzan(e) {
		let id = e.currentTarget.dataset.id;
		let allow_probability = e.currentTarget.dataset.allowprobability;
		let index = e.currentTarget.dataset.index;
		let that = this;

		if (allow_probability == 1) {
			wx.showToast({
				title: '已经点赞',
				icon: 'none',
				mask: true
			});
			return;
		} else if (allow_probability == 2) {
			wx.showToast({
				title: '不能给自己点赞',
				icon: 'none',
				mask: true
			});
			return;
		}
		Api.signSignProbability({
			id: id
		}).then((result) => {
			let res = result.data;

			if (res.code === 0) {
				wx.showToast({
					title: res.msg,
					icon: 'success',
					mask: true
				});
				let data = [ ...that.data.signList ];
				data[index].allow_probability = 1;
				console.log(data);
				that.setData({
					signList: data
				});
			} else {
				wx.showToast({
					title: res.msg,
					icon: 'success',
					mask: true
				});
			}
			console.log(res);
		});
	},

	fangqi() {
		wx.showModal({
			title: '提示',
			content: '你确定要放弃挑战吗',
			success: (result) => {
				if (result.confirm) {
					let id = this.data.challengeInfo.target_id;
					Api.challengeDelTarget({ id: id }).then((result) => {
						let res = result.data;

						if (res.code === 0) {
							wx.showToast({
								title: res.msg,
								mask: true
							});
							wx.redirectTo({
								url: '/pages/index/index'
							});
						} else {
							wx.showToast({
								title: res.msg,
								mask: true
							});
						}
					});
				}
			}
		});
	},
	// 预览图
	handlePreviewImage(e) {
		let imgUrl = [ e.currentTarget.dataset.imgurl ];
		console.log(imgUrl);
		wx.previewImage({
			urls: imgUrl,
			current: imgUrl
		});
	},
	toHome() {
		wx.redirectTo({
			url: '/pages/index/index'
		});
	},
	// 删除吃打卡
	delTarget() {
		this.setData({
			confirm: {
				title: ``,
				message: '打卡项目删除后星币仍然保留给打卡用户, 但次打卡行动将在用户列表删除。',
				type: 'del',
				btn: [ '确定', '取消' ],
				showConfirm: true
			}
		});
	},
	onReachBottom() {
		let id = this.options.id;
		let that = this;
		Api.challengeChallengeSign({
			id: id,
			page: ++that.data.pageIndex
		})
			.then((result) => {
				let res = result.data;

				this.setData({
					signList: [ ...that.data.signList, ...res.signList ]
				});
			})
			.catch((e) => {
				wx.hideLoading();
			});

		console.log('onReachBottom');
	}
});
