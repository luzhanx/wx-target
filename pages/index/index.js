const Api = require('./../../utils/api');
let app = getApp();
let user = {};

// console.log(app);

Page({
	/**
   * 页面的初始数据
   */
	data: {
		user: '',
		item: {},
		fraction: {},
		startX: 0,
		showModal: false,
		showModal2: false,
		startNum: 0,
    tipNum: 0,
    break: 0
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function(options) {
		app.globalData.tabIndex = 0;

		if (!wx.getStorageSync('user')) {
			wx.navigateTo({
				url: '/pages/login/login'
			});
		}
	},
	onShow() {
		let that = this;

		try {
			user = wx.getStorageSync('user');

			// 登录了
			if (user !== '') {
				that.setData({
					user: user
				});
				// if()
				Api.userCenter().then(
					(result) => {
						let res = result.data;

						this.setData({
							item: res.targetList,
							activeList: res.activeList,
							fraction: res.user,
							moon: res.moon ? res.moon : [],
              tipNum: res.getStars,
              brack: res.break,
							check: res.check ? res.check : 1
						});
						if (res.getStars > 0) {
							wx.showToast({
								title: `刚刚被${res.getStars}个人点赞了`,
								icon: 'none',
								mask: true,
								duration: 1500
							});
						}
						if (res.break > 0) {
							that.setData({
								showModal2: true
							});

							console.log('有消息');
						}
					},
					(err) => {
						console.log(err);
					}
				);
				// 没登录
			} else {
				console.log('没登录');
			}
		} catch (e) {
			// user = that.data.user;
			// cookie = '';
			console.log(e);
			console.log('读取缓存失败');
		}
	},
	// 点击跳转头像登录
	login() {
		if (user == '') {
			wx.navigateTo({
				url: '/pages/login/login'
			});
		}
	},
	shareIndex() {
		this.data.user.id &&
			wx.navigateTo({
				url: `/pages/center/center`
			});
  },
  toMsg(){
    this.setData({
			showModal: false
		});
		wx.navigateTo({
			url: '/pages/message/message'
		});
  },
	toCreate() {
		this.setData({
			showModal: false
		});
		wx.navigateTo({
			url: '/pages/create/create'
		});
  },
  closeShowModal2(){
    this.setData({
      showModal2: false
    })
  },
	guidang(e) {
		let gid = e.currentTarget.dataset.gid;
		let id = e.currentTarget.dataset.id;
		console.log(gid, id);
	},
	// https://www.jianshu.com/p/07c4ddf8a3d3

	// 目标详情
	report(e) {
		let that = this;
		let sign = e.currentTarget.dataset.sign;
		let id = e.currentTarget.dataset.id;
		let gid = e.currentTarget.dataset.gid;
		let tid = e.currentTarget.dataset.tid;
		let index = e.currentTarget.dataset.index;
		let url = '';
		console.log(id, gid, tid);
		switch (sign) {
			case 0:
				if (gid == 0) {
					url = `/pages/report/report?id=${id}`;
				} else if (tid) {
					url = `/pages/challenge/challenge?id=${tid}`;
				} else {
					url = `/pages/qdetail/qdetail?id=${gid}`;
				}
				wx.navigateTo({
					url: url
				});
				return;
			case 1:
				wx.showModal({
					content: '是否归档',
					success: (result) => {
						if (result.confirm) {
							Api.delTarget(id).then((result) => {
								let res = result.data;

								if (res.code === 0) {
									wx.showToast({
										title: res.msg,
										icon: 'none'
									});
									let tmep = [ ...that.data.item ];
									tmep.splice(index, 1);
									that.setData({
										item: tmep
									});
									return;
								} else {
									wx.showToast({
										title: res.msg,
										icon: 'none'
									});
								}
							});
						}
					}
				});
				return;
			case 2:
				wx.showModal({
					content: '是否归档',
					success: (result) => {
						if (result.confirm) {
							Api.delTarget(id).then((result) => {
								let res = result.data;

								if (res.code === 0) {
									wx.showToast({
										title: res.msg,
										icon: 'none'
									});
									let tmep = [ ...that.data.item ];
									tmep.splice(index, 1);
									that.setData({
										item: tmep
									});
									return;
								} else {
									wx.showToast({
										title: res.msg,
										icon: 'none'
									});
								}
							});
						}
					}
				});
				return;
			case 3:
				if (gid == 0) {
					url = `/pages/report/report?id=${id}`;
				} else if (tid) {
					url = `/pages/challenge/challenge?id=${tid}`;
				} else {
					url = `/pages/qdetail/qdetail?id=${gid}`;
				}
				wx.navigateTo({
					url: url
				});
				return;
		}

		// console.log(e)
	},
	/**
   * 生命周期函数--监听页面初次渲染完成
   */
	onReady: function() {},

	/**
   * 生命周期函数--监听页面隐藏
   */
	onHide: function() {},

	/**
   * 生命周期函数--监听页面卸载
   */
	onUnload: function() {},

	/**
   * 页面上拉触底事件的处理函数
   */
	onReachBottom: function() {},

	/**
   * 用户点击右上角分享
   */
	onShareAppMessage: function(res) {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(res.target);
		}
		return {
			title: '中秋活动“爱要说出来”点击参与',
			path: '/pages/create/create',
			imageUrl: '/assets/img/hdong.png'
		};
	}
});
