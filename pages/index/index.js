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
    fraction: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.tabIndex = 0;
  },
  onShow() {
    let that = this;
    let cookie = '';

    try {
      user = wx.getStorageSync('user');
      cookie = wx.getStorageSync('cookie');

      // 登录了
      if (user !== '') {
        that.setData({
          user: user
        });
        // if()
        Api.userCenter().then(result => {
          let res = result.data;

          this.setData({
            item: res.targetList,
            fraction: res.user
          });
          if (res.getStars > 0) {
            wx.showToast({
              title: `今日共获得${res.getStars}颗星星`,
            })
          }
        }, (err) => {
          console.log(err);
        })
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
    this.data.user.id && wx.navigateTo({
      url: `/pages/share_index/share_index?id=${this.data.user.id}`
    })
  },
  // 目标详情
  report(e) {
    let sign = e.currentTarget.dataset.sign;
    let id = e.currentTarget.dataset.id;

    switch (sign) {
      case 0:
        wx.navigateTo({
          url: `/pages/report/report?id=${id}`
        });
        return;
      case 1:
        wx.showToast({
          title: '目标已经完成啦',
          icon: 'success'
        })
        return;
      case 2:
        wx.showToast({
          title: '目标已超时',
          icon: 'none'
        })
        return;
      case 3:
        wx.navigateTo({
          url: `/pages/report/report?id=${id}`
        });
        return;
    }

    // console.log(e)


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})