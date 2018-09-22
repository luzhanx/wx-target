// pages/share_edit/share_edit.js
var appInst = getApp();

var windowWidth;
var windowHeight;

Page({
	/**
   * 页面的初始数据
   */
	data: {
    share: {},
		shareImgWidth: 0,
		src: '',
		imgIndex: 0,
		realShow: false,
		wxpath: '',
		avatarpath: ''
	},
	toHome() {
		wx.reLaunch({
			url: '/pages/index/index'
		});
	},
	shengc() {
		let that = this;
		wx.showLoading({
			title: '生成中',
			mask: true
		});
		const ctx = wx.createCanvasContext('shareCanvas', this);
		var sharePath = `/assets/img/share${this.data.imgIndex}.png`;

		// ctx.setFillStyle('#212d46');
		ctx.fillRect(0, 0, windowWidth, windowHeight);

		// 绘制图片
		ctx.drawImage(sharePath, 0, 0, windowWidth, windowWidth * 1.512);
		ctx.save();
		// 底部
		ctx.rect(0, windowWidth * 1.512, windowWidth, windowWidth * 0.533);
		ctx.setFillStyle('#ffffff');
		ctx.fill();

		// 1.6533
		ctx.save();
		ctx.beginPath();
		//圆的原点x坐标，y坐标，半径，起始弧度，终止弧度
		ctx.arc(windowWidth * 0.0933, windowWidth * 1.6533, windowWidth * 0.06666, 0, 2 * Math.PI);
		ctx.setStrokeStyle('transparent');
		ctx.stroke();
		ctx.clip();

		//绘制头像
		//图片路径，左上角x坐标，左上角y坐标，宽，高
		var avatarWidth = windowWidth * 0.1333; //头像半径
		ctx.drawImage(that.data.avatarpath, windowWidth * 0.0266, windowWidth * 1.5866, avatarWidth, avatarWidth);
		ctx.restore();
		// ctx.save();

		// 我是第 1023 个“爱要说出来”的传递者，
		ctx.setFillStyle('#000');
		ctx.setFontSize(windowWidth * 0.032);
		ctx.setTextAlign('left');
		let str = '';
		if (this.data.share.type === 2) {
			str = `我是第 ${that.data.share.group_rank} 个"${that.data.share.group.group_title}"的传递者`;
		} else if (this.data.share.type === 1) {
			str = `我的排名 ${that.data.share.user.rank} 名`;
		}
		ctx.fillText(str, windowWidth * 0.1866, windowWidth * 1.64);
		ctx.fillText('想起TA就告诉TA, 长按菊花码加入我们的行动', windowWidth * 0.1866, windowWidth * 1.6933);
		// ctx.fillText('快创建你要坚持的小目标吧！', windowWidth * 0.09, windowHeight * 0.94);

		// 菊花码
		ctx.drawImage(
			`${this.data.wxpath}`,
			windowWidth * 0.8533,
			windowWidth * 1.5866,
			windowWidth * 0.1453,
			windowWidth * 0.1453
		);
		ctx.restore();
		ctx.draw(
			true,
			setTimeout(function() {
				that.saveCanvasImage();
			}, 600)
		);
	},
	qiehuan() {
		let index = this.data.imgIndex;
		++index > 2 ? (index = 0) : index;
		console.log(index);
		this.setData({
			imgIndex: index
		});
	},
	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function(options) {
		let that = this;

		this.setData({
			share: appInst.globalData.share
    });

		// console.log(appInst.globalData.share.data);
		let uid = this.data.share.user.id;

		wx.showLoading({
			title: '加载中',
			mask: true
		});
		wx.getImageInfo({
			src: 'https://xdk.xtow.net/api.php/chrysanthemum/index?id=' + uid,
			success: function(xres) {
				that.setData({
					wxpath: xres.path
				});
				wx.getImageInfo({
					src: that.data.share.user.avatar,
					success(res) {
						that.setData({
							avatarpath: res.path
						});
						wx.hideLoading();
					}
				});
			},
			fail() {
				wx.hideLoading();
				wx.getImageInfo({
					src: that.data.share.user.avatar,
					success(res) {
						that.setData({
							avatarpath: res.path
						});
						wx.hideLoading();
					}
				});
			}
		});
		this.getSysInfo();
	},

	//转化为图片
	saveCanvasImage() {
		var that = this;

		wx.canvasToTempFilePath(
			{
				canvasId: 'shareCanvas',
				success: function(res) {
					that.setData({
						src: res.tempFilePath,
						realShow: true
					});
					wx.hideLoading();
					// that.requestAlbumScope()
					//设置事件回调
					// that.triggerEvent('hideDialog', myEventDetail, myEventOption);
				},
				complete: function(e) {
					// console.log(e);
					// that.hideLoading();
				}
			},
			this
		);
	},
	/**
     * 获取设备信息
     */
	getSysInfo() {
		let that = this;
		let res = wx.getSystemInfoSync();

		windowWidth = res.windowWidth;
		windowHeight = res.windowWidth * 1.78;

		that.setData({
			canvasHeight: windowHeight,
			imageWidth: windowWidth * 0.7,
			imageHeight: windowHeight * 0.7
		});
	},
	/**
     * 保存到相册
     */
	saveImageTap: function() {
		var that = this;
		that.requestAlbumScope();
	},
	/**
     * 检测相册权限
     */
	requestAlbumScope() {
		var that = this;
		// 获取用户信息
		wx.getSetting({
			success: (res) => {
				if (res.authSetting['scope.writePhotosAlbum']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					that.saveImageToPhotosAlbum();
				} else {
					wx.authorize({
						scope: 'scope.writePhotosAlbum',
						success(res) {
							that.saveImageToPhotosAlbum();
						},
						fail() {
							wx.showModal({
								title: '提示',
								content: '你需要授权才能保存图片到相册',
								success: function(res) {
									if (res.confirm) {
										wx.openSetting({
											success: function(res) {
												if (res.authSetting['scope.writePhotosAlbum']) {
													that.saveImageToPhotosAlbum();
												} else {
													//用户未同意保存图片权限
												}
											},
											fail: function() {
												//用户未同意保存图片权限
											}
										});
									}
								}
							});
						}
					});
				}
			}
		});
	},

	saveImageToPhotosAlbum: function() {
		var that = this;
		wx.saveImageToPhotosAlbum({
			filePath: that.data.src,
			success: function() {
				wx.showModal({
					title: '',
					content: '✌️图片保存成功，\n快去分享到朋友圈吧',
					showCancel: false
				});
				that.hideDialog();
			}
		});
	},

	closeModel: function() {
		this.hideDialog();
	},

	hideDialog: function() {
		this.setData({
			realShow: false,
			showShareModel: false
		});
	}
});
