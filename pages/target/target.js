const Api = require('./../../utils/api');
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',                        // 标题
    remind: false,                    // 提醒功能
    remind_time: '',                    // 提醒时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 开启提醒功能
  remindChange() {
    this.setData({
      remind: !this.data.remind
    })
  },
  // 设置每天提醒时间
  bindTimeChange(e) {
    // console.log(e.detail.value);
    this.setData({
      remind_time: e.detail.value
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    let that = this;
    let id = that.options.id;

    Api.GeteditTargetPage(id).then(result => {
      let res = result.data;

      that.setData({
        title: res.target.title,
        remind: res.target.remind ? true : false,
        remind_time: res.target.remind_time
      })
      wx.setNavigationBarTitle({
        title: res.target.title
      });

    }, err => {
      console.log(err);
    });
  },
  // 立即添加
  submit(e) {
    let that = this;

    if (that.data.remind) {
      console.log(that.data.remind_time);
      if (that.data.remind_time === '') {
        wx.showToast({
          title: '请设置每天提醒时间',
          icon: 'none'
        });
        return;
      }
    } else {
      that.data.remind_time = '';
    }

    let formData = {
      id: that.options.id,
      remind: that.data.remind ? 1 : 0,
      remind_time: that.data.remind_time,
    };

    wx.showLoading({
      title: '编辑提醒中'
    });

    Api.PosteditTargetPage(formData).then(result => {
      if (result.data.code == 0) {
        wx.showToast({
          title: result.data.msg,
          icon: 'success',
          mask: true
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000);
      } else {
        wx.showToast({
          title: result.msg,
        })
      }
    }, err => {
      console.log(err);
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
})