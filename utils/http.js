const { host } = require('./config');
const fetch = require('./fetch');

// console.log(fetch);

const http = {
  get(url, params) {
    return fetch(host + url, 'GET', null, params);
  },
  post(url, data, params) {
    return fetch(host + url, 'POST', data, params);
  },
  uploadFile(url, file, data) {
    let cookie = wx.getStorageSync('cookie');
    let headers = {
      'content-type': 'application/json',
      'Cookie': cookie
    };

    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: host + url,
        filePath: file.path[0],
        name: file.name,
        formData: data,
        header: headers,
        success(res) {
          var data = res.data
          //do something
          resolve(JSON.parse(data));
        },
        fail(err) {
          console.log(err);
          reject(err);
        }
      })
    });
  }
}

module.exports = http;
