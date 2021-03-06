// pages/reportSubmit/reportSubmit.js
const Api = require('./../../utils/api');
var appInst = getApp();

Page({
	/**
   * 页面的初始数据
   */
	data: {
		address: '',
		latitude: 0,
		longitude: 0,
		name: '所在地址',
		sign_title: '',
		sign_images: ''
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function(options) {
		let that = this;

		console.log(appInst);
	},
	back() {
		wx.navigateBack({
			delta: 1
		});
	},
	submit(e) {
		let that = this;

		if (that.data.sign_title === '') {
			wx.showToast({
				title: '打卡心情记录不能为空',
				mask: true,
				icon: 'none'
			});
			return;
		}
		let prePage = getCurrentPages()[getCurrentPages().length - 2];
		let data = prePage.data.challengeInfo;

		let formatData = {
			sign_title: that.data.sign_title,
			sign_place: that.data.address === '' ? '' : that.data.address + that.data.name,
			sign_lng_lat: that.data.latitude == 0 ? '' : `${that.data.longitude},${that.data.latitude}`,
			sign_images: that.data.sign_images === '' ? '' : that.data.sign_images,
			formId: e.detail.formId,
			id: data.target_id
		};

		if (formatData.sign_images === '') {
			Api.signTarget(formatData).then((result) => {
				let res = result.data;

				if (res.code == 0) {
					appInst.globalData.share = res.data;

					wx.reLaunch({
						url: '/pages/sign/sign'
					});
				} else if (res.code == 1) {
					prePage.setData(
						{
							result: res
						},
						() => {
							wx.navigateBack({
								delta: 1
							});
						}
					);
				} else if (res.code == 2) {
					prePage.setData(
						{
							result: res
						},
						() => {
							wx.navigateBack({
								delta: 1
							});
						}
					);
				} else {
					wx.showToast({
						title: res.msg,
						icon: 'none'
					});
					return;
				}
				console.log(res);
			});
		} else {
			Api.signTarget2(formatData).then((res) => {
				if (res.code == 0) {
					prePage.setRili({
						now: data.now,
						finData: res.data.finData
					});
					appInst.globalData.share = res.data;

					wx.reLaunch({
						url: '/pages/sign/sign'
					});
				} else if (res.code == 1) {
					prePage.setData(
						{
							result: res
						},
						() => {
							wx.navigateBack({
								delta: 1
							});
						}
					);
				} else if (res.code == 2) {
					prePage.setData(
						{
							result: res
						},
						() => {
							wx.navigateBack({
								delta: 1
							});
						}
					);
				} else {
					wx.showToast({
						title: res.msg,
						icon: 'none'
					});
					return;
				}
			});
		}
	},
	openImg() {
		let that = this;

		wx.chooseImage({
			count: 1,
			sizeType: [ 'original', 'compressed' ],
			sourceType: [ 'album', 'camera' ],
			success(res) {
				// tempFilePath可以作为img标签的src属性显示图片
				const tempFilePaths = res.tempFilePaths;
				that.setData({
					sign_images: tempFilePaths
				});
			}
		});
	},

	getMap() {
		let that = this;

		wx.chooseLocation({
			success(res) {
				if (res.errMsg === 'chooseLocation:ok') {
					that.setData({
						address: res.address,
						latitude: res.latitude,
						longitude: res.longitude,
						name: res.name
					});
				}
			},
			fail(err) {
				if (err.errMsg === 'chooseLocation:fail auth deny') {
					wx.showToast({
						title: '获取位置失败'
					});
				}
				console.log(err);
			}
		});
	},
	bindTextAreaBlur(e) {
		this.setData({
			sign_title: e.detail.value
		});
	},
	/**
   * 生命周期函数--监听页面初次渲染完成
   */
	onReady: function() {},

	/**
   * 生命周期函数--监听页面显示
   */
	onShow: function() {}
});
