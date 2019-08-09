let http = require('http');
let https = require('https');
let iconv = require('iconv-lite');

function http_https_proxy(url) {
    let resObj = {};
    let myPromise = new Promise((resolve, reject) => {
        let flag = url.substring(0, url.indexOf(':'));
        if (flag == 'http') {
            url = encodeURI(url);
            http.get(url, (res) => {
                resolve(res);
            })
        } else if (flag == 'https') {
            https.get(url, (res) => {
                resolve(res);
            })
        } else {
            reject();
        }
    });

    return myPromise.then(res => {
        return new Promise((resolve, reject) => {
            let conType = res.headers["content-type"];
            if (conType != undefined) {
                conType = conType.split('charset=')[1];
            }
            let arrBuf = [];    //用于存储 二进制片段的数组
            res.on('data', chunk => {
                arrBuf.push(chunk);
            });
            res.on('end', () => {
                let buff = Buffer.concat(arrBuf);   //合并buffer 数组
                let str = iconv.decode(buff, conType);
                resolve(str);
            })
        })
    }, () => {
        return new Promise((resolve, reject) => {
            resObj.code = '502';
            resObj.msg = '请求数据出错！';
            resObj.result = url;
            resolve(resObj);
        })
    });
}

module.exports = http_https_proxy;