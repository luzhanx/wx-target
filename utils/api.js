/**
 * Api 大全 
 * @Api文档  https://www.kancloud.cn/yrzeee/xmb_/
 * @sql数据库 http://120.24.240.216:888/phpmyadmin_F6D67EFF/
 * xdk_xtow_net
 * xdk123456
 */
const http = require('./http')
const api = {

    // queryAllQuestions(range, page, size) {
    //     return http.get(`/v1/questions`, { range: range, page: page, size: size, action: 'all' })
    // },
    /**
     * 我的目标 首页
     */
    userCenter() {
        return http.get('/index/userCenter');
    },
    /**
     * 获取排行榜列表
     */
    rankList() {
        return http.get('/rank/index');
    },
    /**
     * 点赞
     * @param {*点赞用户id} id 
     */
    probability(id) {
        return http.get('/index/probability', {
            id: id
        });
    },
    /**
     * 分享点赞页面
     * @param {*用户id} uid 
     */
    probabilityPage(uid) {
        return http.get('/index/probabilityPage', {
            id: uid
        });
    },
    /**
     * 签到详情
     * @param {*用户id} uid 
     */
    targetDetails(uid) {
        return http.get('/index/targetDetails', {
            id: uid
        });
    },
    /**
     * 签到
     * @param {*数据} formData
     */
    signTarget(formData) {
        return http.post('/index/signTarget', formData);
    },
    /**
     * 签到2
     * @param {*数据} formData 
     */
    signTarget2(formData) {
        return http.uploadFile('/index/signTarget', {
            path: formData.sign_images,
            name: 'sign_images'
        }, {
                sign_title: formData.sign_title,
                sign_place: formData.sign_place,
                sign_lng_lat: formData.sign_lng_lat,
                formId: formData.formId,
                id: formData.id
            });
    },
    /**
     * 模板列表
     */
    templateList() {
        return http.get('/template/index');
    },
    /**
     * 目标模板详情
     */
    templateDetails(id) {
        return http.get('/template/details', {
            id: id
        });
    },
    /**
     * 菊花码分享页面
     * @param {*用户ID} id 
     */
    chrysanthemum(id) {
        return http.get('/chrysanthemum/index', {
            id: id
        });
    },
    /**
     * 新建目标
     * @param {标题} title 
     * @param {简介} description 
     * @param {目标天数} day 
     * @param {是否开启提醒} remind 
     * @param {提醒时间} remind_time 
     * @param {封面} images 
     * @param {模板Id} fromId 
     */
    addTarget(file, data) {
        return http.uploadFile('/index/addTarget', {
            path: [file],
            name: 'images'
        }, data);
    },
    addTarget2(data) {
        return http.post('/index/addTarget', data);
    },
    /**
     * 删除目标
     * @param {*目标ID} id 
     */
    delTarget(id) {
        return http.get('/index/delTarget', {
            id: id
        });
    },
    /**
     * 编辑提醒页面
     * @param {*目标ID} id 
     */
    GeteditTargetPage(id) {
        return http.get('/index/editTargetPage', {
            id: id
        });
    },
    /**
     * 编辑提醒提交
     * @param {*目标ID} data
     */
    PosteditTargetPage(data) {
        return http.post('/index/editTarget', {
            id: data.id,
            remind: data.remind,
            remind_time: data.remind_time
        });
    }
}
module.exports = api;
