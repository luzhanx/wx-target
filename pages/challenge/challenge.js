// pages/challenge/challenge.js
let timeOut;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: {
      d: 0,
      h: 0,
      m: 0,
      s: 0
    }
  },
  countTime() {
    //获取当前时间
    var date = new Date();
    var now = date.getTime();
    //设置截止时间
    var endDate = new Date("2018-10-22 23:23:23");
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
    timeOut = setTimeout(this.countTime, 1000);

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.countTime()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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
