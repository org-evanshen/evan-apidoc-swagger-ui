<template src="./ApiDebug.html">
</template>
<script>
    import Model from './Model.vue';
    import Constant from '@/constant/Constant';
    import {Message, MessageBox} from 'element-ui';

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
                var params = {};

                //console.log(params);
                var body = null;
                var path = {};

                if(Array.isArray(this.currentApi.parameters)){
                    this.currentApi.parameters.forEach((parameter) => {
                        if (parameter.value) {
                            //console.log(parameter.name);
                            if (parameter.in == 'body') {
                                body = parameter.value;
                            } else if (parameter.in == 'path') {
                                path[parameter.name] = parameter.value;
                            } else {
                                params[parameter.name] = parameter.value;
                            }
                        }
                    });
                }

                var serviceUrl = Constant.REMOTE_URI[_this.serviceId].path + this.currentApi.path;

                if(body){
                    try {
                        body = JSON.parse(body);
                    }catch(ex){
                        console.error(ex)
                        this.$alert('请求数据格式不正确，请提交json格式的数据！','提示',{type:'warning'});
                        return;
                    }
                }

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
                    let config = {data: body, params: params};
                    VueHttp.post(serviceUrl, config).then((res)=>{
                        handler(res);
                    }).catch((res)=>{
                        handler(res);
                    });
                } else {
                    //console.log(params);
                    VueHttp.get(serviceUrl, params).then((res) => {
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
