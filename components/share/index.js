var app = getApp();

var windowWidth;
var windowHeight;
const TEXT_COLOR = '#000000';
const WHITE = '#FFFFFF';
const THEME_COLOR = '#FF555C';
const GRAY_COLOR = '#333333';
const NORMAL_COLOR = '#666666';
const TINT_COLOR = '#747474';
const GOLD_COLOR = '#ffdb12';

const temp = 0.01;
//图片长宽比
const scale = 1.78;
//背景图高度
const bgScale = 0.7500;
//头像和宽的比
const avatarWidthScale = 0.260;
const avatarHeightScale = 0.45;
//头像白色圆形背景
const avatarStrokeWidth = 2;
//昵称高度比
const nicknameHeightScale = 0.615;

//邀请加入
const inviteTextScale = 0.187;
const inviteTextHeightScale = 0.27;
//分享内容
const adAwardHeightScale = 0.338;
const adAwardWidthScale = 0.187;
const contentHeightScale = 0.38;
const awardScale = 0.34;
const awardWidthScale = 0.51;
//二维码直径
const qrCodeWidthScale = 0.341;
//二维码高度
const qrCodeHeightScale = 0.69;
//极客文字
const bpbScale = 0.92 + temp * 2;
//识别文字
const decodeScale = 0.95 + temp * 2;

Component({
  /**
   * 组件属性列表
   */
  properties: {
    // 头像url
    avatar: {
      'type': String,
      'value': null
    },

    // 用户名称
    nickname: {
      'type': String,
      'value': 'null'
    },
    // 菊花码
    jhm: {
      'type': String,
      'value': 'null'
    },
    // 目标
    title: {
      'type': String,
      'value': ''
    },
    // 签到天数
    day: {
      'type': Number,
      'value': -1
    },
    // 超越人数
    rank: {
      'type': Number,
      'value': -1
    },
    // 背景图片
    sharePic: {
      'type': String,
      'value': ''
    },
    //隐藏显示，会触发事件
    showShareModel: {
      'type': Boolean,
      'value': false,
      'observer': '_propertyChange'
    }
  },
  data: {
    avatarPath: 'null',
    sharePicPath: 'null',
    canvasHeight: 0,
    imageWidth: 0,
    imageHeight: 0,
    realShow: false
  },
  /**
   * 组件方法
   */
  methods: {
    /**
     * 控件显示并且没有生成图片时，使用 canvas 生成图片
     */
    _propertyChange(newVal, oldVal) {
      if (newVal) {
        this.shareMoments();
      }
    },
    /**
     * 生成分享图到朋友圈
     */
    shareMoments() {
      let that = this;

      that.showLoading();
      that.downloadAvatar();
    },
    /**
     * 获取设备信息
     */
    getSysInfo() {
      let that = this;
      let res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
      // windowWidth = 375;
      windowHeight = res.windowWidth * scale;

      that.setData({
        canvasHeight: windowHeight,
        imageWidth: windowWidth * 0.7,
        imageHeight: windowHeight * 0.7
      })
    },
    /**
     * 下载头像
     */
    downloadAvatar() {
      let that = this;

      wx.getImageInfo({
        src: that.data.avatar,
        success(res) {
          console.log(res);
          that.setData({
            avatarPath: res.path
          })
          wx.getImageInfo({
            src: that.data.sharePic,
            success(res) {
              that.setData({
                sharePicPath: res.path
              })
              that.drawImage();
            },
            fail(err) {
              console.log(err);
              that.showErrorModel('网络错误');
            }
          })
        },
        fail(err) {
          console.log(err);
          that.showErrorModel('网络错误');
        }
      })
    },

    // 生成分享图
    drawImage: function () {
      let that = this;
      that.getSysInfo();

      const ctx = wx.createCanvasContext('shareCanvas', this);
      var bgPath = that.data.sharePicPath;
      var bgBorder = './../../assets/img/border.png';
      ctx.setFillStyle('#212d46');
      ctx.fillRect(0, 0, windowWidth, windowHeight);

      //绘制背景图片
      ctx.drawImage(bgPath, 0, 0, windowWidth, windowHeight * bgScale);
      ctx.drawImage(bgBorder, 0, 0, windowWidth, windowHeight * bgScale);

      //先绘制圆，裁剪成圆形图片
      ctx.save();
      ctx.beginPath();
      //圆的原点x坐标，y坐标，半径，起始弧度，终止弧度
      ctx.arc(windowWidth / 2, windowHeight * 0.175, (avatarWidthScale / 2) * windowWidth, 0, 2 * Math.PI);
      ctx.setStrokeStyle('transparent');
      ctx.stroke();
      ctx.clip();
      //绘制头像
      //图片路径，左上角x坐标，左上角y坐标，宽，高
      var avatarWidth = avatarWidthScale * windowWidth; //头像半径
      ctx.drawImage(that.data.avatarPath, windowWidth * (0.5 - avatarWidthScale / 2), windowHeight * 0.102, avatarWidth, avatarWidth);
      ctx.restore();

      var avatarBgW = windowWidth * (0.5 - avatarWidthScale / 2) * 0.96;
      ctx.drawImage('./../../assets/img/avatar_bg2.png', avatarBgW, windowHeight * 0.09, avatarWidth * 1.1, avatarWidth * 1.1);
      ctx.save();


      //绘制昵称
      ctx.setFillStyle(WHITE);
      ctx.setFontSize(14);
      ctx.setTextAlign('center');
      ctx.fillText(that.data.nickname, 0.5 * windowWidth, windowHeight * 0.285);

      ctx.beginPath()
      ctx.setStrokeStyle('#fff')
      ctx.moveTo(windowWidth * 0.31, windowHeight * 0.305)
      ctx.lineTo(windowWidth * 0.68, windowHeight * 0.305)
      ctx.stroke()

      // 我的小目标
      ctx.setFillStyle(WHITE);
      ctx.setFontSize(12);
      ctx.setTextAlign('center');
      ctx.fillText('我的小目标', 0.5 * windowWidth, windowHeight * 0.34);

      // 目标
      ctx.setFillStyle(WHITE);
      ctx.setFontSize(18);
      ctx.setTextAlign('center');
      ctx.fillText(that.data.title, 0.5 * windowWidth, windowHeight * 0.38);

      ctx.beginPath()
      ctx.setStrokeStyle('#fff')
      ctx.moveTo(windowWidth * 0.31, windowHeight * 0.40)
      ctx.lineTo(windowWidth * 0.68, windowHeight * 0.40)
      ctx.stroke()


      // 天数
      ctx.setFillStyle(WHITE);
      ctx.setFontSize(64);
      ctx.setTextAlign('center');
      ctx.fillText(that.data.day, 0.5 * windowWidth, windowHeight * 0.495);
      // 已坚持天数
      ctx.setFillStyle(WHITE);
      ctx.setFontSize(12);
      ctx.setTextAlign('center');
      ctx.fillText('已坚持天数', 0.5 * windowWidth, windowHeight * 0.525);

      // 今天超越了10%的朋友
      ctx.setFillStyle(WHITE);
      ctx.setFontSize(12);
      ctx.setTextAlign('center');
      ctx.fillText('今天超越了 ' + that.data.rank + '% 的朋友', 0.5 * windowWidth, windowHeight * 0.58);

      ctx.beginPath()
      ctx.setStrokeStyle('#fff')
      ctx.moveTo(windowWidth * 0.31, windowHeight * 0.54)
      ctx.lineTo(windowWidth * 0.68, windowHeight * 0.54)
      ctx.stroke()


      // 绘制底部
      let footerH = (windowHeight - windowHeight * bgScale) * 1.2;
      let footerY = (windowHeight * bgScale) * 0.94;
      ctx.drawImage('./../../assets/img/share_footer2.png', 0, footerY, windowWidth, footerH);
      ctx.save();

      // 21天，完成一个小目标
      // 快创建你要坚持的小目标吧！
      ctx.setFillStyle('#727272');
      ctx.setFontSize(12);
      ctx.setTextAlign('left');
      ctx.fillText('21天,完成一个小目标', windowWidth * 0.09, windowHeight * 0.915);
      ctx.fillText('快创建你要坚持的小目标吧！', windowWidth * 0.09, windowHeight * 0.940);


      // 绘制菊花码
      ctx.drawImage(that.data.jhm, windowWidth * 0.63, footerY * 1.10, 0.3 * windowWidth, 0.3 * windowWidth);
      ctx.save();

      // 长按识别二维码，关注也没有惊喜！
      ctx.setFillStyle('#727272');
      ctx.setFontSize(10);
      ctx.setTextAlign('center');
      ctx.fillText('长按识别小程序码，关注也没有惊喜！', 0.77 * windowWidth, windowHeight * 0.97);


      //绘制到 canvas 上

      ctx.draw(true, setTimeout(function () {
        that.saveCanvasImage();
      }, 2000));
    },

    /**
     * 改变字体样式
     */
    setFontStyle: function (ctx, fontWeight) {
      if (wx.canIUse('canvasContext.font')) {
        ctx.font = 'normal ' + fontWeight + ' ' + '14px' + ' sans-serif';
      }
    },

    //转化为图片
    saveCanvasImage() {
      var that = this;
      wx.canvasToTempFilePath({
        canvasId: 'shareCanvas',
        success: function (res) {
          that.setData({
            targetSharePath: res.tempFilePath,
            realShow: true,
          })
          //设置事件回调
          var myEventDetail = {}; // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          that.triggerEvent('hideDialog', myEventDetail, myEventOption);
        },
        complete: function () {
          that.hideLoading();
        }
      }, this)
    },


    showLoading() {
      wx.showLoading({
        title: '生成分享图中',
      })
    },
    hideLoading() {
      wx.hideLoading();
    },

    showErrorModel(content) {
      this.hideLoading();
      if (!content) {
        content = '网络错误';
      }
      wx.showModal({
        title: '提示',
        content: content,
      })
      //改变状态
      this.setData({
        showShareModel: false
      })
    },
    /**
     * 保存到相册
     */
    saveImageTap: function () {
      var that = this;
      that.requestAlbumScope();
    },

    /**
     * 检测相册权限
     */
    requestAlbumScope: function () {
      var that = this;
      // 获取用户信息
      wx.getSetting({
        success: res => {
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
                  success: function (res) {
                    if (res.confirm) {
                      wx.openSetting({
                        success: function (res) {
                          if (res.authSetting['scope.writePhotosAlbum']) {
                            that.saveImageToPhotosAlbum();
                          } else {
                            //用户未同意保存图片权限
                          }
                        },
                        fail: function () {
                          //用户未同意保存图片权限
                        }
                      })
                    }
                  }
                })
              }
            })
          }
        }
      })
    },

    saveImageToPhotosAlbum: function () {
      var that = this;
      wx.saveImageToPhotosAlbum({
        filePath: that.data.targetSharePath,
        success: function () {
          wx.showModal({
            title: '',
            content: '✌️图片保存成功，\n快去分享到朋友圈吧',
            showCancel: false
          })
          that.hideDialog();
        }
      })
    },

    closeModel: function () {
      this.hideDialog();
    },

    hideDialog: function () {
      this.setData({
        realShow: false,
        showShareModel: false
      })
    },
  }
});