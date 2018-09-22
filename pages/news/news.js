const Api = require('./../../utils/api');
let app = getApp();

Page({
	/**
   * 页面的初始数据
   */
	data: {
		title: '', // 标题
		description: '', // 内容
		day: '7', // 天数
		photo: '', // 封面图片
		photoS: '', // 展示图片
		remind: true, // 提醒功能
		remind_time: '' // 提醒时间,
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function(options) {},
	// 绑定标题内容输入
	bindTitle(e) {
		let title = e.detail.value;
		this.data.title = title;
	},
	// 绑定有什么话想要给正在坚持目标的自己说
	bindDescription(e) {
		let description = e.detail.value;
		this.data.description = description;
	},
	// 绑定目标天数
	bindDay(e) {
		let day = e.detail.value;
		this.data.day = day;
	},
	// 选择打卡天数
	shooseDay(e) {
		let day = e.currentTarget.dataset.day;

		this.setData({
			day: day
		});
	},
	// 开启提醒功能
	remindChange() {
		this.setData({
			remind: !this.data.remind
		});
	},
	// 设置每天提醒时间
	bindTimeChange(e) {
		// console.log(e.detail.value);
		this.setData({
			remind_time: e.detail.value
		});
	},
	// 剪裁图片页面
	linkTailoring() {
		wx.navigateTo({
			url: './../tailoring/tailoring'
		});
	},
	// 添加展示图片
	addPhotoS() {
		let that = this;

		wx.chooseImage({
			count: 1,
			sizeType: [ 'original', 'compressed' ],
			sourceType: [ 'album', 'camera' ],
			success: (result) => {
				console.log(result.tempFilePaths[0]);
				that.setData({
					photoS: result.tempFilePaths[0]
				});
			},
			fail: () => {},
			complete: () => {}
		});
	},
	// 立即添加
	submit(e) {
		let that = this;
		let formId = e.detail.formId;

		if (that.data.title === '') {
			wx.showToast({
				title: '标题不能为空',
				icon: 'none',
				mask: true
			});
			return;
		} else if (that.data.title.length > 8) {
			wx.showToast({
				title: '标题文字不能超过8个字',
				icon: 'none',
				mask: true
			});
			return;
		}
		if (that.data.description === '') {
			wx.showToast({
				title: '内容不能为空',
				icon: 'none',
				mask: true
			});
			return;
		}
		if (that.data.day === '') {
			wx.showToast({
				title: '目标天数不能为空',
				icon: 'none',
				mask: true
			});
			return;
		}

		if (that.data.photo === '') {
			wx.showToast({
				title: '请选择目标封面图片',
				icon: 'none',
				mask: true
			});
			return;
		}
		if (that.data.photoS === '') {
			wx.showToast({
				title: '请选择详情页展示图片',
				icon: 'none',
				mask: true
			});
			return;
		}

		if (that.data.remind) {
			console.log(that.data.remind_time);
			if (that.data.remind_time === '') {
				wx.showToast({
					title: '请设置每天提醒时间',
					icon: 'none',
					mask: true
				});
				return;
			}
		} else {
			that.data.remind_time = '';
		}

		let formData = {
			title: that.data.title,
			description: that.data.description,
			day: that.data.day,
			remind: that.data.remind ? 1 : 0,
			remind_time: that.data.remind_time,
			formId: formId,
			template: 2
		};

		// console.log(formData);
		wx.showLoading({
			title: '添加目标中'
		});

		Api.dataImages({ name: 'show', path: this.data.photoS }).then(
			(result) => {
				if (result.code == 0) {
					let formData = {
						group_title: that.data.title,
						group_text: that.data.description,
						group_day: that.data.day,
						group_remind: that.data.remind ? 1 : 0,
						group_remind_time: that.data.remind_time,
						formId: formId,
						group_show: result.data.url
					};
					let file = {
						name: 'group_images',
						path: [ that.data.photo ]
					};
					Api.groupAddgroup(file, formData)
						.then((res) => {
							if (res.code == 0) {
								wx.showToast({
									title: res.msg,
									icon: 'success',
									mask: true
                });
                setTimeout(() => {
                  wx.reLaunch({
                    url: '/pages/index/index'
                  });
                }, 2000);
							} else {
								wx.showToast({
									title: res.msg
								});
							}
						})
						.catch((err) => {
							wx.showToast({
								title: '网络异常',
								icon: '',
								mask: true
							});
						});
				} else {
					wx.showToast({
						title: '详情页展示图片上传失败',
						icon: '',
						mask: true
					});
				}
			},
			(err) => {
				wx.showToast({
					title: '网络异常',
					icon: '',
					mask: true
				});
			}
		);
	}
});
