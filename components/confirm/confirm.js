// components/confirm/confirm.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: 'success'
    },
    title: {
      type: String,
      value: '恭喜你完成目标'
    },
    num: {
      type: Number,
      value: 0
    },
    message: {
      type: String,
      value: '愿你不要屈从于命运的安排，坚韧不拔，锲而不舍，做永远的生活强者！'
    },
    btn: {
      type: Array,
      value: ['按钮1', '按钮2']
    },
    showConfirm: {
      type: Boolean,
      value: false,
      'observer': '_showConfirmChange'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    _showConfirmChange(newVal, oldVal) {
      if (newVal) {
        this.setData({
          showConfirm: newVal
        })
      }
    },
    handClickOne(e) {
      this.triggerEvent('handClickOne', this.data);
    },
    handClickTwo(e){
      this.triggerEvent('handClickTwo', this.data);
    }
  }
})
