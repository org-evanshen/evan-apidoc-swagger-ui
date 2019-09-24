import Vue from 'vue';
import {MessageBox} from 'element-ui';

const VueHttp = {

    /**
     * get 请求
     * @param url 请求地址
     * @param params 请求参数
     * @param isHandleWarn 是否需要处理警告 默认 false,当调用方传递时,表示不需要处理警告,调用方会自己处理
     * @returns {Promise<any>} 回调
     */
    get(url, params, isHandleWarn) {
        return new Promise((resolve, reject) => {
            Vue.axios.get(url, {params})
                .then((res) => {
                    if (res.data.success === undefined && res.status === 200) {
                        resolve(res);
                    } else if (res.data.success) {
                        resolve(res.data);
                    } else {
                        // if (!isHandleWarn) {
                        //     this.warn(res.data);
                        // }
                        reject(res.data);
                    }
                }).catch((error) => {
                    this.catch(error);
                });
        })
    },
    /**
     * post 请求
     * @param url 请求地址
     * @param config 请求参数 config 里面有 params 和 data 参数可选, 当请求参数格式类型为body时,应为data,其他则为 params
     * @param isHandleWarn 是否需要处理警告 默认 false,当调用方传递时,表示不需要处理警告,调用方会自己处理
     * @returns {Promise<any>} 回调
     */
    post(url, config, isHandleWarn) {
        return new Promise((resolve, reject) => {
            Vue.axios.post(url, null, config)
                .then((res) => {
                    if (res.data.success === undefined && res.status === 200) {
                        resolve(res);
                    } else if (res.data.success) {
                        resolve(res.data);
                    } else {
                        // if (!isHandleWarn) {
                        //     this.warn(res.data);
                        // }
                        reject(res.data);
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
            message: res.msg,
            title: '错误提示',
            type: 'warning'
        });
        //提示
        console.warn('>>>>>>>> warn >>>>>>>>>>')
    },
    /**
     * 异常处理
     * @param error 异常信息
     */
    catch(error) {
        // MessageBox({
        //     message: '系统维护中',
        //     title: '系统维护',
        //     type: 'error'
        // });
        //提示系统维护中
        console.error(error)
    },
};

module.exports = VueHttp;
