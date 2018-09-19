/**
 * Api 大全
 * @Api文档  https://www.kancloud.cn/yrzeee/xmb_/
 * @sql数据库 http://120.24.240.216:888/phpmyadmin_F6D67EFF/
 * xdk_xtow_net
 * xdk123456
 */
const http = require('./http');
const api = {
	// 我的目标 首页
	userCenter: () => http.get('/index/userCenter'),

	// 获取排行榜列表
	rankList: () => http.get('/rank/index'),

	/**
   * 点赞
   * @param {*点赞用户id} id
  */
	probability: (id) => http.get('/index/probability', { id: id }),

	/**
   * 分享点赞页面
   * @param {*用户id} uid
   */
	probabilityPage: (uid) => http.get('/index/probabilityPage', { id: uid }),

	/**
   * 签到详情
   * @param {*用户id} uid
   */
	targetDetails: (uid) => http.get('/index/targetDetails', { id: uid }),

	/**
   * 签到
   * @param {*数据} formData
   */
	signTarget: (formData) => http.post('/index/signTarget', formData),

	/**
   * 签到2
   * @param {*数据} formData
   */
	signTarget2: (formData) => {
		let data = {
			sign_title: formData.sign_title,
			sign_place: formData.sign_place,
			sign_lng_lat: formData.sign_lng_lat,
			formId: formData.formId,
			id: formData.id
		};
		let sign_images = { path: formData.sign_images, name: 'sign_images' };

		return http.uploadFile('/index/signTarget', sign_images, data);
	},
	// 模板列表
	templateList: () => http.get('/template/index'),

	/**
   * 目标模板详情
   * @param {*目标id} uid
   */
	templateDetails: (id) => http.get('/template/details', { id: id }),
	/**
   * 菊花码分享页面
   * @param {*用户ID} id
   */
	chrysanthemum: (id) => http.get('/chrysanthemum/index', { id: id }),
	/**
   * 新建目标
   * @param {*图片} file
   * @param {*数据} data
   */
	addTarget: (file, data) => http.uploadFile('/index/addTarget', { path: [ file ], name: 'images' }, data),
	addTarget2: (data) => http.post('/index/addTarget', data),
	/**
   * 删除目标
   * @param {*目标ID} id
   */
	delTarget: (id) => http.get('/index/delTarget', { id: id }),
	/**
   * 编辑提醒页面
   * @param {*目标ID} id
   */
	GeteditTargetPage: (id) => http.get('/index/editTargetPage', { id: id }),

	/**
   * 编辑提醒提交
   * @param {*数据} data
   */
	PosteditTargetPage: (data) =>
		http.post('/index/editTarget', { id: data.id, remind: data.remind, remind_time: data.remind_time }),
	/**
   * 新建群目标
   * @param {*文件} file
   * @param {*数据} data
   */
	groupAddgroup: (file, data) => {
		return http.uploadFile('/group/addgroup', file, data);
	},
	/**
   * 上传图片接口
   * @param {* 数据} data
   */
	dataImages: (data) => {
		return http.uploadFile('/data/images', { name: data.name, path: [ data.path ] }, {});
	},
	/**
   * 群目标详情页
   */
	groupGroupDetails: (data) => {
		return http.get('/group/groupDetails', data);
  },
  // 加入群目标
  groupAddgroup: (data) => {
		return http.post('/group/addgroup', data);
  },
};

module.exports = api;
