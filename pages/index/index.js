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
    fraction: {},
    startX: 0,
    showModal: false,
    startNum: 0,
    tipNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.tabIndex = 0;

    if (!wx.getStorageSync('user')) {
      wx.navigateTo({
        url: '/pages/login/login'
      });
    }
  },
  onShow() {
    let that = this;

    try {
      user = wx.getStorageSync('user');

      // 登录了
      if (user !== '') {
        that.setData({
          user: user
        });
        // if()
        Api.userCenter().then(
          (result) => {
            let res = result.data;

            this.setData({
              item: res.targetList,
              fraction: res.user,
              moon: res.moon,
              tipNum: res.getStars
            });
            if (res.getStars > 0) {
              wx.showToast({
                title: `刚刚被${res.getStars}个人点赞了`,
                icon: 'none',
                mask: true,
                duration: 1500
              });
            }
          },
          (err) => {
            console.log(err);
          }
        );
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
    this.data.user.id &&
      wx.navigateTo({
        url: `/pages/center/center`
      });
  },
  toCreate() {
    this.setData({
      showModal: false
    });
    wx.navigateTo({
      url: '/pages/create/create'
    });
  },
  // https://www.jianshu.com/p/07c4ddf8a3d3
  // 手势开始
  itemTouchstart(e) {
    // console.log('itemTouchStart' + e);
    // //判断是否只有一个触摸点
    // if (e.touches.length == 1) {
    // 	this.setData({
    // 		//记录触摸起始位置的X坐标
    // 		startX: e.touches[0].clientX
    // 	});
    // }
  },
  // 手势移动
  itemTouchmove(e) {
    // console.log('touchM:' + e);
    // var that = this;
    // if (e.touches.length == 1) {
    // 	//记录触摸点位置的X坐标
    // 	var moveX = e.touches[0].clientX;
    // 	//计算手指起始点的X坐标与当前触摸点的X坐标的差值
    // 	var disX = that.data.startX - moveX;
    // 	//delBtnWidth 为右侧按钮区域的宽度
    // 	var delBtnWidth = that.data.delBtnWidth;
    // 	var txtStyle = '';
    // 	if (disX == 0 || disX < 0) {
    // 		//如果移动距离小于等于0，文本层位置不变
    // 		txtStyle = 'left:0px';
    // 	} else if (disX > 0) {
    // 		//移动距离大于0，文本层left值等于手指移动距离
    // 		txtStyle = 'left:-' + disX + 'px';
    // 		if (disX >= delBtnWidth) {
    // 			//控制手指移动距离最大值为删除按钮的宽度
    // 			txtStyle = 'left:-' + delBtnWidth + 'px';
    // 		}
    // 	}
    // 	console.log(txtStyle);
    //获取手指触摸的是哪一个item
    // var index = e.currentTarget.dataset.index;
    // var list = that.data.addressList;
    // //将拼接好的样式设置到当前item中
    // list[index].txtStyle = txtStyle;
    // //更新列表的状态
    // this.setData({
    // 	addressList: list
    // });
    // }
  },
  // 手势结束
  itemTouchend(e) {
    // console.log('touchE' + e);
    // var that = this;
    // if (e.changedTouches.length == 1) {
    // 	//手指移动结束后触摸点位置的X坐标
    // 	var endX = e.changedTouches[0].clientX;
    // 	//触摸开始与结束，手指移动的距离
    // 	var disX = that.data.startX - endX;
    // 	var delBtnWidth = that.data.delBtnWidth;
    // 	//如果距离小于删除按钮的1/2，不显示删除按钮
    // 	var txtStyle = disX > delBtnWidth / 2 ? 'left:-' + delBtnWidth + 'px' : 'left:0px';
    // 	//获取手指触摸的是哪0一项
    // 	var index = e.currentTarget.dataset.index;
    // 	var list = that.data.addressList;
    // 	list[index].txtStyle = txtStyle;
    // 	// //更新列表的状态
    // 	// that.setData({
    // 	//  addressList:list
    // 	// });
    // }
  },
  // 目标详情
  report(e) {
    let sign = e.currentTarget.dataset.sign;
    let id = e.currentTarget.dataset.id;
    let gid = e.currentTarget.dataset.gid;
    let url = '';

    switch (sign) {
      case 0:
        if (gid == 0) {
          url = `/pages/report/report?id=${id}`;
        } else {
          url = `/pages/qdetail/qdetail?id=${gid}`;
        }
        wx.navigateTo({
          url: url
        });
        return;
      case 1:
        wx.showToast({
          title: '目标已经完成啦',
          icon: 'success'
        });
        return;
      case 2:
        wx.showToast({
          title: '目标已超时',
          icon: 'none'
        });
        return;
      case 3:
        if (gid === 0) {
          url = `/pages/report/report?id=${id}`;
        } else {
          url = `/pages/qdetail/qdetail?id=${gid}`;
        }
        wx.navigateTo({
          url: url
        });
        return;
    }

    // console.log(e)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '中秋活动“爱要说出来”点击参与',
      path: '/pages/create/create',
      imageUrl: '/assets/img/hdong.png'
    }
  }
});
