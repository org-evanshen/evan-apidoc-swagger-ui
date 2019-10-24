import Vue from 'vue';
import {MessageBox} from 'element-ui';
import qs from 'qs';

const VueHttp = {

    /**
     * get 请求
     * @param url 请求地址
     * @param params 请求参数
     * @param isHandleWarn 是否需要处理警告 默认 false,当调用方传递时,表示不需要处理警告,调用方会自己处理
     * @returns {Promise<any>} 回调
     */
    get(url, params, isWarn) {
        if(isWarn == null && isWarn == undefined){
            isWarn = true;
        }

        return new Promise((resolve, reject) => {
            Vue.axios.get(url, {params})
                .then((res) => {
                    if(res.data.code == undefined) {
                        resolve(res);
                    }else if(res.data.code == 'SUCCESS'){
                        resolve(res.data);
                    }else if (res.data.code =='ERROR' ) {
                        this.catch(res);
                    } else {
                        if (isWarn) {
                            this.warn(res);
                        }else{
                            resolve(res.data);
                        }
                    }
                }).catch((error) => {
                    this.catch(error);
                });
        })
    },
    /**
     * post 请求
     * @param url 请求地址
     * @data
     * @contentType
     * @returns {Promise<any>} 回调
     */
    post(url, data, contentType , isWarn) {
        if(!contentType){
            contentType = 'application/x-www-form-urlencoded';
        }

        if(isWarn == null && isWarn == undefined){
            isWarn = true;
        }

        return new Promise((resolve, reject) => {
            Vue.axios.post(url, data,{headers: { 'content-type': contentType }})
                .then((res) => {
                    if (res.data.code == undefined || res.data.code =='ERROR' ) {
                        this.catch(res);
                    } else if (res.data.code == 'SUCCESS') {
                        resolve(res.data);
                    } else {
                        if (isWarn) {
                            this.warn(res);
                        }else{
                            resolve(res.data);
                        }
                    }
                }).catch((error) => {
                    this.catch(error);
                });
        })
    },
    /**
     * 警告处理
     * @param res 后端返回信息
     */
    warn(res) {
        MessageBox({
            message: res.data.msg,
            title: '提示',
            type: 'warning'
        });
        // console.warn(res);
    },
    /**
     * 异常处理
     * @param error 异常信息
     */
    catch(error) {
        MessageBox({
            message: '系统出错',
            title: '提示',
            type: 'error'
        });
        console.error(error);
    }
};

module.exports = VueHttp;
