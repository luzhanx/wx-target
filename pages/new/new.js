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
    remind: true, // 提醒功能
    remind_time: '' // 提醒时间,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
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
  // 立即添加
  submit(e) {
    let that = this;
    let formId = e.detail.formId;

    if (that.data.title === '') {
      wx.showToast({
        title: '标题不能为空',
        icon: 'none'
      });
      return;
    } else if (that.data.title > 8) {
      wx.showToast({
        title: '标题文字不能超过8个字',
        icon: 'none'
      });
      return;
    }
    if (that.data.description === '') {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none'
      });
      return;
    }
    if (that.data.day === '') {
      wx.showToast({
        title: '目标天数不能为空',
        icon: 'none'
      });
      return;
    }
    if (parseInt(that.data.day) > 365) {
      wx.showToast({
        title: '目标天数不能大于365天',
        icon: 'none',
        mask: true
      });
      return;
    }

    if (that.data.photo === '') {
      wx.showToast({
        title: '请选择图片再上传',
        icon: 'none'
      });
      return;
    }

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

    Api.addTarget(that.data.photo, formData).then(
      (result) => {
        if (result.code == 0) {
          wx.showToast({
            title: result.msg,
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
            title: result.msg,
            icon: 'none',
            mask: true
          });
        }

        console.log(result);
      },
      (err) => {
        console.log(err);
      }
    );
  }
});
