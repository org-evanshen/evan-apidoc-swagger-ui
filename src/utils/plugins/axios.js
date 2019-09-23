import {MessageBox} from 'element-ui';

import axios from 'axios'
import Constant from "@/constant/Constant";
import UserAgent from "@/utils/UserAgent";

axios.defaults.timeout = 12000;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

const excludes = [
    '/upload/',
    '/picture/',
    '/validate-code/',
    '/region/all-level',
    '/v2/api-docs',
    // '/register/',
    // '/orgs/check-org-code',
    // '/orgs/check-org-name',
    '/init-pwd',
    '/portal-news',
];

/**
 * 请求拦截
 */
axios.interceptors.request.use((config) => {
    csrf(config);
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

// axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
//     var config = err.config;
//     // If config does not exist or the retry option is not set, reject
//     if(!config || !config.retry) return Promise.reject(err);
//
//     // Set the variable for keeping track of the retry count
//     config.__retryCount = config.__retryCount || 0;
//
//     // Check if we've maxed out the total number of retries
//     if(config.__retryCount >= config.retry) {
//         // Reject with the error
//         return Promise.reject(err);
//     }
//
//     // Increase the retry count
//     config.__retryCount += 1;
//
//     // Create new promise to handle exponential backoff
//     var backoff = new Promise(function(resolve) {
//         setTimeout(function() {
//             resolve();
//         }, config.retryDelay || 1);
//     });
//
//     // Return the promise in which recalls axios to retry the request
//     return backoff.then(function() {
//         return axios(config);
//     });
// });

/**
 * csrf
 */
function csrf(request) {
    if (request.data && request.data.csrfToken) {
        request.headers['csrf-token'] = request.data.csrfToken;
        request.data.csrfToken = null;
    }
}

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

    let userAgent = UserAgent.get();

    let token, secret;
    if (userAgent && !inExcludes(request.url, excludes)) {
        token = userAgent.token;
        secret = userAgent.tokenSecret;
    }
    else {
        token = Constant.DEFAULT_API_TOKEN; //固定，与服务端约定
        secret = Constant.DEFAULT_API_SECRET;//固定，与服务端约定
    }

    let random = new Date().getTime();

    let sign = Btbs.generateSign(request.params, random, secret);

    request.headers.token = token;
    request.headers.sign = sign;
    request.headers.random = random;
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
