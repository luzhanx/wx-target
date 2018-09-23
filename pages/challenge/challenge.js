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
    }
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
      h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
      m = Math.floor(leftTime / 1000 / 60 % 60);
      s = Math.floor(leftTime / 1000 % 60);
    } else {
      clearTimeout(timeOut)
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
    })
    //递归每秒调用countTime方法，显示动态时间效果
    timeOut = setTimeout(() => {
      // console.log(that.data.challengeInfo.residue)
      that.countTime(that.data.challengeInfo.residue)
    }, 1000);

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let id = this.options.id;

    Api.challengeDetails({
      id: id
    }).then(result => {

      let res = result.data;
      console.log(res);

      that.setData({
        challengeInfo: res.challengeInfo,
        challengeList: res.challengeList
      })
      this.countTime(res.challengeInfo.residue);

    }).catch(e => {
      wx.hideLoading();
    })
  },

  submit(e) {
    let formId = e.detail.formId;
    let id = this.options.id;

    if (!wx.getStorageSync('user')) {
      wx.showModal({
        title: '提示',
        content: '登录后才能点赞哦',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: `/pages/login/login`
            });
          } else if (res.cancel) {}
        }
      });
      return;
    }

    Api.challengeAdd({
      id: id,
      formId: formId
    }).then(result => {
      let res = result.data;

      if (res.code === 0) {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          mask: true,
        });
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          mask: true,
        });
      }

      console.log(res);

    }).catch(e => {
      wx.showToast({
        title: '网络异常',
        icon: 'none',
        mask: true,
      });
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    console.log(this.data.challengeInfo.challenge_show)
    return {
      title: `挑战-${this.data.challengeInfo.challenge_title}`,
      path: `/pages/challenge/challenge?id=${this.data.challengeInfo.id}`,
      imageUrl: `${this.data.challengeInfo.challenge_show}`
    }
  }
})
