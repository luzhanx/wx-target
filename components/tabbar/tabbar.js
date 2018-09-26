let app = getApp();

Component({
  properties: {
    isShandow: {
      type: Boolean,
      value: true
    },
    tab: {
      type: Number,
      value: 0
    },
    tipNum: {
      type: Number,
      value: 0
    }
  },
  data: {},
  ready() {
    this.setData({
      // tipNum: app.globalData.tipNum,
      tab: this.data.tab > 0 ? this.data.tab : app.globalData.tabIndex
    })
  },
  methods: {
    navLink(e) {
      let tab = e.currentTarget.dataset.tab;
      let url = './../index/index';

      console.log(tab)

      switch (tab) {
        case '0':
          url = './../index/index';
          break;
        case '1':
          url = './../challengeList/challengeList'
          break;

          // wx.showToast({
          //   title: '有彩蛋！国庆推出,敬请期待',
          //   icon: 'none',
          //   mask: true,
          // });
          // return;
        case '2':
          url = './../ranking/ranking';
          wx.navigateTo({
            url: url,
          })
          return;
      }
      app.globalData.tabIndex = tab;
      this.setData({
        tab: tab
      });
      wx.reLaunch({
        url: url,
      })
    }
  }
})
