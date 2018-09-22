// pages/Sign/Sign.js
var appInst =  getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    share: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      share:  appInst.globalData.share
    })
    console.log(appInst)
  },
  toshare(){
    wx.navigateTo({
      url: '/pages/share_edit/share_edit'
    });
  },
  toHome(){
    wx.reLaunch({
      url: '/pages/index/index',
    });
  },
  onShareAppMessage: function (res) {
    console.log(this.data.share.group)
    if (this.data.share.type === 2) {
      return {
        title: this.data.share.group.group_title,
        path: '/pages/qdetail/qdetail?id=' + this.data.share.group.group_id,
        imageUrl: this.data.share.group.group_images
      }
    }
    if (this.data.share.type === 1) {
      return {
        title: this.data.share.group.group_title,
        path: '/pages/share_index/share_index?id=' + this.data.share.user.id,
        imageUrl: this.data.share.group.images
      }
    }
  }
})
