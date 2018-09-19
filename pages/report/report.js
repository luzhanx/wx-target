// pages/report/report.js
const imgBase64 = require('./../../assets/imgbase64/index.js');
const MONTHS = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June.', 'July.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
const Api = require('./../../utils/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    qdbg: imgBase64.qdbg,
    qd1: imgBase64.qd1,
    qd2: imgBase64.qd2,
    qd3: imgBase64.qd3,
    year: 1900, // 年份
    month: 2, // 月份
    day: 1, // 日
    signs: {},
    demo2_days_style: [],
    num: 0,
    sign: 0,
    title: '',
    sharePic: '',
    share: {
      avatar: '',
      nickname: '',
      day: 0,
      jhm: '',
      showShareModel: false,
    },
    signTarget: {
      star: 0,
      rank: 0
    },
    sum: 0,       // 您已坚持打卡
    confirm: {
      title: '',
      num: 0,
      message: '',
      type: 'success',
      showConfirm: false,
    },
    formId: '',
    code: -1
  },
  // 点击签到
  handReport(e) {
    let that = this;
    let id = that.options.id;
    let formId = e.detail.formId;

    //是否可以签到 0=可以签到，1=目标已结束 , 2=目标超时 3=今天已签到
    switch (that.data.sign) {
      case 0: // 可以签到
        this.setData({
          formId: formId
        })
        wx.navigateTo({
          url: '/pages/reportSubmit/reportSubmit'
        })
        return;
        break;
      case 1: // 目标已结束
        wx.showToast({
          title: '目标已结束',
          icon: 'none'
        });
        return;
      case 2: // 目标超时
        wx.showToast({
          title: '目标超时',
          icon: 'none'
        });
        return;
      case 3: // 今天已签到
        wx.showToast({
          title: '今天已签到',
          icon: 'none'
        });
        return;
    }
  },
  formatDateTime(inputTime) {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();

    return {
      year: y,
      month: m,
      day: d
    };
  },
  changeData(e) {
    let currentMonth = e.detail.currentMonth < 10 ? ('0' + e.detail.currentMonth) : e.detail.currentMonth;
    let json = this.data.signs[`${e.detail.currentYear}-${currentMonth}`];
    const days_count = new Date(e.detail.currentYear, e.detail.currentMonth, 0).getDate();
    let demo2_days_style = new Array;
    var tempi = 0;
    for (let i = 1; i <= days_count; i++) {
      tempi = i < 10 ? '0' + i : i;
      if (json && json.indexOf(String(tempi)) != -1) {
        demo2_days_style.push({
          month: 'current',
          day: i,
          color: '#777777',
          border: '4rpx solid #0075a9',
          background: e.detail.currentYear === this.data.year && e.detail.currentMonth === this.data.month && i === this.data.day ? '#9de8f7' : ''
        });
      } else {
        demo2_days_style.push({
          month: 'current',
          day: i,
          color: '#777777',
          background: e.detail.currentYear === this.data.year && e.detail.currentMonth === this.data.month && i === this.data.day ? '#9de8f7' : ''
        });
      }
    }
    this.setData({
      demo2_days_style
    });
  },
  // 点击今天
  onCurrentDay() {
    this.setData({
      year: this.data.year,
      month: this.data.month
    })
    let e = {
      detail: {
        currentYear: this.data.year,
        currentMonth: this.data.month
      }
    }
    this.changeData(e)
  },
  // 点击上个月
  onPrevMonth(e) {
    this.changeData(e)
  },
  // 点击下个月
  onnNxtMonth(e) {
    this.changeData(e)
  },
  // 日期选择器变化
  onDateChange(e) {
    this.changeData(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;

    Api.targetDetails(id).then(result => {
      let res = result.data;
      let that = this;

      // 设置标题
      wx.setNavigationBarTitle({
        title: res.title,
      })
      that.setData({
        id: that.options.id,
        title: res.title,
        sum: res.sum,
        sign: res.sign,
        sharePic: res.sharePic,
        signTarget: {
          star: res.star,
          rank: res.rank
        }
      })
      that.data.now = res.now;
      // 设置日历
      that.setRili({
        now: res.now,
        finData: res.finData
      });


    }, err => {
      console.log(err);
    });
  },
  // 设置日历
  setRili(result) {
    let that = this;
    let time = that.formatDateTime(result.now);

    that.setData({
      year: time.year,
      month: time.month,
      day: time.day,
      signs: result.finData,
    })
    const days_count = new Date(time.year, time.month, 0).getDate();

    let demo2_days_style = new Array;
    let currentMonth = time.month < 10 ? ('0' + time.month) : time.month;
    let json = that.data.signs[`${time.year}-${currentMonth}`];
    let tempi = 0;

    for (let i = 1; i <= days_count; i++) {
      tempi = i < 10 ? '0' + i : i;
      if (json && json.indexOf(String(tempi)) !== -1) {
        demo2_days_style.push({
          month: 'current',
          day: i,
          color: '#777777',
          border: '4rpx solid #0075a9',
          background: i === time.day ? '#9de8f7' : ''
        });
      } else {
        demo2_days_style.push({
          month: 'current',
          day: i,
          color: '#777777',
          background: i === time.day ? '#9de8f7' : ''
        });
      }
    }
    that.setData({
      demo2_days_style
    });
  },
  onShow() {
    let that = this;

    if (that.data.sign == 3) {

      if (that.data.code == 0) {
        // 生成菊花码
        let uid = wx.getStorageSync('user').id;
        wx.showLoading();
        wx.getImageInfo({
          src: 'https://xdk.xtow.net/api.php/chrysanthemum/index?id=' + uid,
          success: function (xres) {
            const share = { ...that.data.share };
            console.log(...that.data.share)
            share.jhm = xres.path;
            share.showShareModel = true;

            that.setData({
              share: share
            })
          }
        })
      } else if (that.data.code == 1) {
        const confirm = { ...that.data.confirm };
        console.log(confirm)
        confirm.showConfirm = true;
        that.setData({
          confirm: confirm
        })
      } else if (that.data.code == 2) {
        const confirm = { ...that.data.confirm };

        confirm.showConfirm = true;
        that.setData({
          confirm: confirm
        })
      }
    }
  },
  handClickOne(e) {
    let that = this;
    let data = e.detail;

    if (data.type === 'success') {
      wx.reLaunch({
        url: '/pages/index/index'
      })
    } else if (data.type === 'error') {
      wx.reLaunch({
        url: '/pages/index/index'
      })
    } else if (data.type === 'del') {
      that.data.confirm.showConfirm = false;

      that.setData({
        confirm: that.data.confirm
      });
    }

  },
  handClickTwo(e) {
    let data = e.detail;
    let that = this;

    if (data.type === 'success') {
      wx.reLaunch({
        url: '/pages/create/create'
      })
    } else if (data.type === 'error') {
      wx.reLaunch({
        url: '/pages/create/create'
      })
    } else if (data.type === 'del') {
      wx.showModal({
        content: '确定要删除次目标吗',
        success(showModelRes) {
          if (showModelRes.confirm) {
            let id = that.options.id;

            Api.delTarget(id).then(result => {
              let res = result.data;
              wx.showToast({
                title: res.msg,
                icon: 'none'
              });
              setTimeout(() => {
                wx.reLaunch({
                  url: '/pages/create/create'
                })
              }, 1000);
              console.log(res)
            }, err => {
              console.log(err);
            });
          }
        }
      })

    }
  },
  // 删除吃打卡
  delTarget() {
    this.setData({
      confirm: {
        title: ``,
        message: '愿你不要屈从于命运的安排，坚韧不拔，锲而不舍，做永远的生活强者！',
        type: 'del',
        btn: ['再坚持一下', '确定删除并开新建目标'],
        showConfirm: true,
      }
    })
  }
})
