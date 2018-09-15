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
    }
  },
  data: {},
  ready() {
    this.setData({
      tab: this.data.tab > 0 ? this.data.tab : app.globalData.tabIndex
    })
  },
  methods: {
    navLink(e) {
      let tab = e.currentTarget.dataset.tab;
      let url = './../index/index';

      switch (tab) {
        case '0':
          url = './../index/index';
          break;
        case '1':
          url = './../create/create';
          return;
          break;
        case '2':
          url = './../ranking/ranking';
          wx.navigateTo({
            url: url,
          })
          return;
          break;
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