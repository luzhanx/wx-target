const Api = require('./../../utils/api');

Page({
  data: {
    user: {
      avatar: './../../assets/img/share.png'
    },
    groupMess: {},
    signList: [],

    ShowText: true,
    ShowTextBtn: '点击收起',
    confirm: {
      title: '',
      num: 0,
      message: '',
      type: 'success',
      showConfirm: false
    }
  },
  onShow: function () {
    let id = this.options.id;
    let that = this;
    console.log(this.options)
    Api.groupGroupDetails({
      id: id
    }).then((result) => {
      let res = result.data;

      that.setData({
        groupMess: res.groupMess,
        signList: res.signList,
        sign: res.sign
      });

      console.log(res);
    });
  },
  handleShowText() {
    let that = this;

    if (this.data.ShowText) {
      this.setData({
        ShowTextBtn: '点击收起',
        ShowText: !this.data.ShowText
      });
    } else {
      this.setData({
        ShowTextBtn: '点击全文',
        ShowText: !this.data.ShowText
      });
    }
  },
  // 加入群目标
  addgroup() {
    let that = this;

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
    Api.groupAddgrouptarget({
      id: this.data.groupMess.id
    }).then((result) => {
      let res = result.data;

      if (res.code === 0) {
        wx.showToast({
          title: res.msg,
          icon: 'success',
          mask: true
        });
        that.setData({
          groupMess: { ...that.data.groupMess,
            join: 1,
            target_id: res.target_id
          }
        });
      } else if (res.code === 1) {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          mask: true
        });
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          mask: true
        });
      }
    });
  },
  xinzan(e) {
    let id = e.currentTarget.dataset.id;
    let allow_probability = e.currentTarget.dataset.allowprobability;
    let index = e.currentTarget.dataset.index;
    let that = this;

    if (allow_probability == 1) {
      wx.showToast({
        title: '已经点赞',
        icon: 'none',
        mask: true
      });
      return;
    } else if (allow_probability == 2) {
      wx.showToast({
        title: '不能给自己点赞',
        icon: 'none',
        mask: true
      });
      return;
    }
    Api.signSignProbability({
      id: id
    }).then((result) => {
      let res = result.data;

      if (res.code === 0) {
        wx.showToast({
          title: res.msg,
          icon: 'success',
          mask: true
        });
        let data = [...that.data.signList];
        data[index].allow_probability = 1;
        console.log(data)
        that.setData({
          signList: data
        })


      } else {
        wx.showToast({
          title: res.msg,
          icon: 'success',
          mask: true
        });
      }
      console.log(res);
    });
  },
  // 取消删除
  handClickTwo(e) {
    let that = this;
    let data = e.detail;

    if (data.type === 'success') {
      wx.reLaunch({
        url: '/pages/index/index'
      });
    } else if (data.type === 'error') {
      wx.reLaunch({
        url: '/pages/index/index'
      });
    } else if (data.type === 'del') {
      that.data.confirm.showConfirm = false;

      that.setData({
        confirm: that.data.confirm
      });
    }
  },
  // 确定删除
  handClickOne(e) {
    let data = e.detail;
    let that = this;

    if (data.type === 'success') {
      wx.reLaunch({
        url: '/pages/create/create'
      });
    } else if (data.type === 'error') {
      wx.reLaunch({
        url: '/pages/create/create'
      });
    } else if (data.type === 'del') {
      wx.showModal({
        content: '确定要删除群目标吗',
        success(showModelRes) {
          if (showModelRes.confirm) {
            let id = that.options.id;

            Api.groupDelGroup({
              id: id
            }).then(
              (result) => {
                let res = result.data;
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  mark: true
                });
                setTimeout(() => {
                  wx.reLaunch({
                    url: '/pages/index/index'
                  });
                }, 1000);
                console.log(res);
              },
              (err) => {
                console.log(err);
              }
            );
          }
        }
      });
    }
  },
  // 删除吃打卡
  delTarget() {
    this.setData({
      confirm: {
        title: ``,
        message: '打卡项目删除后星币仍然保留给打卡用户, 但次打卡行动将在用户列表删除。',
        type: 'del',
        btn: ['确定', '取消'],
        showConfirm: true
      }
    });
  },

  onShareAppMessage: function () {
    console.log(this.data.groupMess)
    return {
      title: this.data.groupMess.group_title,
      path: '/pages/qdetail/qdetail?id=' + this.data.groupMess.id,
      imageUrl: this.data.groupMess.group_show
    }
  },
});
