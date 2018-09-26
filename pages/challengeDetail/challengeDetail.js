const Api = require('./../../utils/api');

Page({
	data: {
		challengeInfo: {},
		signList: [],
		pageIndex: 1
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
	},
	onShareAppMessage: function() {
		console.log(this.data.groupMess);
		return {
			title: this.data.challengeInfo.challenge_title,
			path: '/pages/challenge/challenge?id=' + this.data.challengeInfo.id
		};
	}
});
