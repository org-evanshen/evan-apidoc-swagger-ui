<template src="./ApiInfo.html"></template>

<script>
    import Model from './Model.vue';

    export default {
        data() {
            return {
                modelIsShow: {},
                response: {},
                responseResult: [],
                responseData: ' ',
                isShowApiResponseCode: false,
                actives: ['Parameters', 'Responses'],
                host:''
            };
        },
        created: function () {
            this.host =  window.location.protocol + '//' + location.hostname
            this.parseResponse();
        },
        components: {
            Model
        },
        props: ['currentApi', 'serviceId'],
        methods: {
            parseResponse() {
                var _this = this;
                if (!_this.currentApi) {
                    return;
                }

                var response = _this.currentApi.responses['200'];
                // console.log(response)
                if (response.schema) {
                    if (response.schema.$ref) {
                        //console.log('response.schema.$ref',response.schema.$ref)
                        var key = ApiDataParse.getDefinitionType(response.schema.$ref);
                        ApiDataParse.getDefinition(_this.serviceId, key, (_apiResponse) => {
                            //console.log('_apiResponse',_apiResponse);
                            var apiResponse = _apiResponse.properties;
                            var apiResponseData = apiResponse.data;

                            //console.log('apiResponse',apiResponse);

                            _this.response.isRef = false;
                            _this.response.isArray = false;
                            _this.response.isMap = false;
                            _this.response.isSimple = false;//基本类型


                            if (apiResponseData.$ref) { //单个对象
                                _this.response.isRef = true;
                                var type = ApiDataParse.getDefinitionType(apiResponseData.$ref);
                                _this.response.type = type;
                                // console.log("单个对象" + type)
                            } else if (apiResponseData.type == 'array') {//集合
                                _this.response.isArray = true;
                                var type = ApiDataParse.getDefinitionType(apiResponseData.items.$ref);
                                _this.response.type = type;
                                _this.response.page = {};
                            } else if (apiResponseData.additionalProperties && apiResponseData.additionalProperties.$ref) { //map
                                _this.response.isMap = true;
                                var type = ApiDataParse.getDefinitionType(apiResponseData.additionalProperties.$ref);
                                _this.response.type = type;
                            } else if (apiResponseData.type && apiResponseData.type != 'object') { //基本类型
                                //console.log(apiResponseData.type)
                                _this.response.isSimple = true;
                                _this.response.type = apiResponseData.type;
                            } else { //无返回
                                _this.response.type = '无';
                            }

                            //console.log(_this.response.type);
                            let responseData = null;

                            if (_this.response.type != '无') {
                                if (_this.response.isSimple) {//基本类型
                                    if('OK' != response.description) {
                                        responseData = response.description;
                                    }
                                    //console.log(response);
                                } else {
                                    let responseDataTmp = {};
                                    ApiDataParse.getDefinition(_this.serviceId, _this.response.type, (obj) => {
                                        //console.log(obj);
                                        if (obj.properties) {
                                            let properties = obj.properties;
                                            for (var p in properties) {
                                                let property = properties[p];
                                                // console.log("property", property);
                                                if (property.$ref) {
                                                    getRes(property, responseDataTmp)
                                                } else {
                                                    responseDataTmp[p] = property.description;
                                                }
                                            }
                                        }
                                    });
                                    if (apiResponseData.type == 'array') {
                                        responseData = [];
                                        responseData.push(responseDataTmp)
                                    } else {
                                        responseData = responseDataTmp;
                                    }
                                    //console.log("object", responseData);
                                }
                            }

                            this.responseData = responseData;

                            function getRes(property, responseDataTmp) {
                                let propertyName = property.name;

                                var typeInner = ApiDataParse.getDefinitionType(property.$ref);
                                let responseDataTmp2 = {};
                                ApiDataParse.getDefinition(_this.serviceId, typeInner, (objInner) => {
                                    if (objInner.properties) {
                                        let propertiesInner = objInner.properties;
                                        for (var p in propertiesInner) {
                                            let property2 = propertiesInner[p];
                                            if (property2.$ref) {
                                                getRes(property, responseDataTmp2)
                                            }else{
                                                responseDataTmp2[p] = property2.description;
                                            }
                                        }
                                    }
                                });
                                responseDataTmp[propertyName] = responseDataTmp2;
                            }
                        });
                    }
                }
            },
            toggle(name) {
                if (this.modelIsShow[name]) {
                    this.$set(this.modelIsShow, name, false);
                    //console.log(this.modelIsShow)
                } else {
                    this.$set(this.modelIsShow, name, true);
                    //console.log(this.modelIsShow)
                }
            },
            loadResult() {
                var _this = this;
                _this.isShowApiResponseCode = true;

                if (_this.responseResult.length == 0) {
                    //console.log(Constant);
                    var service = Constant.REMOTE_URI[_this.serviceId];
                    VueHttp.get(service.path + 'apidoc/result')
                        .then((res) => {
                            //console.log(res.body);
                            var data = res.data;
                            _this.responseResult.splice(0, _this.responseResult.length);

                            for (var code in data) {
                                _this.responseResult.push({
                                    "code": code,
                                    "msg": data[code]
                                });
                            }
                        });
                }
            }
        },
        watch: {
            currentApi() {
                this.parseResponse();
            }
        }
    }
</script>
