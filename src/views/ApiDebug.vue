<template src="./ApiDebug.html">
</template>
<script>
    import Model from './Model.vue';
    import Constant from '@/constant/Constant';
    import {Message, MessageBox} from 'element-ui';
    import qs from 'qs';

    export default {
        data() {
            return {
                modelIsShow: {},
                loading: false,
                response: ''
            };
        },
        created: function () {
        },
        components: {
            Model
        },
        props: ['currentApi', 'serviceId'],
        methods: {
            toggle(name) {
                if (this.modelIsShow[name]) {
                    this.$set(this.modelIsShow, name, false);
                } else {
                    this.$set(this.modelIsShow, name, true);
                }
            },
            submit() {
                var _this = this;
                var contentType = 'application/x-www-form-urlencoded';
                var data = {};
                var path = {};

                if(Array.isArray(this.currentApi.parameters)){
                    this.currentApi.parameters.forEach((parameter) => {
                        if (parameter.value) {
                            // console.log(parameter.value);
                            if (parameter.in == 'body') {
                                data = parameter.value;
                                contentType = 'application/json'
                            } else if (parameter.in == 'path') {
                                path[parameter.name] = parameter.value;
                            } else {
                                data[parameter.name] = parameter.value;
                            }
                        }
                    });
                }

                if (this.currentApi.method == 'post') {
                    if ('application/json' == contentType) {
                        try {
                            data = JSON.parse(data);
                        } catch (ex) {
                            console.error(ex)
                            this.$alert('请求数据格式不正确，请提交json格式的数据！', '提示', {type: 'warning'});
                            return;
                        }
                    } else {
                        data = qs.stringify(data);
                    }
                }

                var serviceUrl = Constant.REMOTE_URI[_this.serviceId].path + this.currentApi.path;

                Loading.append(_this, 'loading');
                _this.response = '请稍候...';

                var handler = (res) => {
                    _this.response = res;
                    Loading.remove(_this, 'loading');
                };

                if (path && Object.keys(path).length != 0) {
                    for (let attr in path) {
                        serviceUrl = serviceUrl.replace('{' + attr + '}', path[attr])
                    }
                }

                if (this.currentApi.method == 'post') {
                    VueHttp.post(serviceUrl, data, contentType).then((res)=>{
                        handler(res);
                    }).catch((res)=>{
                        handler(res);
                    });
                } else {
                    //console.log(params);
                    VueHttp.get(serviceUrl, data).then((res) => {
                        handler(res);
                    }).catch((res) => {
                        handler(res);
                    });
                }
            },
            clearRes() {
                this.response = '';
            }
        }
    }
</script>
