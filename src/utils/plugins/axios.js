import {MessageBox} from 'element-ui';

import axios from 'axios'
import Constant from "@/constant/Constant";
import LoginUser from "@/utils/LoginUser";
const sha256 = require('js-sha256')

axios.defaults.timeout = 12000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

const excludes = [
    '/upload/',
    '/picture/',
    '/validate-code/',
    '/region/all-level',
    '/v2/api-docs',
];

/**
 * 请求拦截
 */
axios.interceptors.request.use((config) => {
    urlParams(config);
    token(config);

    return config;
}, (error) => {
    return Promise.reject(error);
});

/**
 * 请求拦截
 */
axios.interceptors.response.use((response) => {
    if (response.status == 403) {
        MessageBox({
            message: '此接口需要授权后才可以使用！',
            title: '您无权使用此接口',
            type: 'warning'
        });
    }
    return response;
}, (error) => {
    //404等问题可以在这里处理
    return Promise.reject(error);
});


/**
 * url 参数处理
 */
function urlParams(request) {
    let url = request.url;
    if (url.indexOf("?") >= 0) {
        request.url = url + '&t=' + new Date().getTime();
    } else {
        request.url = url + '?t=' + new Date().getTime();
    }
}

/**
 * login token
 */
function token(request) {
    let loginUser = LoginUser.get();

    let token, tokenSecret;

    if(loginUser && !inExcludes(request.url, excludes)){
        token = loginUser.token;
        tokenSecret = loginUser.tokenSecret;
    }else{
        token = Constant.DEFAULT_API_TOKEN; //固定，与服务端约定
        tokenSecret = Constant.DEFAULT_API_SECRET;//固定，与服务端约定
    }

    let random = new Date().getTime();
    let sign = sha256(token + random + tokenSecret)

    request.headers['token'] = token;
    request.headers['random'] = random;
    request.headers['sign'] = sign;
}

function inExcludes(url, excludes) {
    //todo:url 排除服务url ,做匹配
    //todo: 正则获取
    for (var i in excludes) {
        if (url.startsWith(excludes[i])) {
            return true;
        }
    }
    return false;
}

export default axios
