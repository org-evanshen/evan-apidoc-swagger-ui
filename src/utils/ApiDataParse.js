import VueHttp from '@/utils/VueHttp';
import Constant from '@/constant/Constant';

const ApiDataParse = {
    parseApiDocData(serviceId) {
        var service = Constant.REMOTE_URI[serviceId];
        service.id = serviceId;
        //console.log(service);
        var url = service.path + 'v2/api-docs'
        //var url = '/local-data/apidoc'
        return new Promise((resolve, reject) => {
            VueHttp.get(url)
                .then((res) => {
                    var data = res.data;
                    var paths = data.paths;

                    var apis = ApiDataParse._parseApis(paths);
                    //console.log(apis);
                    var modules = ApiDataParse._parseModules(data.tags, apis);
                    ApiDataParse._parseDef(data.definitions)

                    if (!top.modules) {
                        top.modules = {};
                    }
                    if (!top.apis) {
                        top.apis = {};
                    }
                    if (!top.definitions) {
                        top.definitions = {};
                    }

                    top.modules[serviceId] = modules;
                    top.apis[serviceId] = apis;
                    top.definitions[serviceId] = data.definitions;

                    resolve({data, service});

                }).catch((error => {
                reject(service)
            }))
        })
    },
    /**
     * 获取模块
     * @param serviceId
     * @param callback
     */
    getModules(serviceId, callback) {
        if (top.modules && top.modules[serviceId]) {
            callback(top.modules[serviceId]);
        } else {
            ApiDataParse.parseApiDocData(serviceId).then((res) => {
                callback(top.modules[serviceId]);
            })
        }
    },
    /**
     * 获取接口
     * @param serviceId
     * @param moduleName
     * @param callback
     */
    getApis(serviceId, moduleName, callback) {
        if (top.apis && top.apis[serviceId]) {
            callback(top.apis[serviceId]);
        } else {
            ApiDataParse.parseApiDocData(serviceId).then((res) => {
                callback(top.apis[serviceId]);
            })
        }
    },
    /**
     * 获取引用类
     * @param serviceId
     * @param definitionKey
     * @param callback
     */
    getDefinition(serviceId, definitionKey, callback) {
        if (top.definitions && top.definitions[serviceId]) {
            var definition = top.definitions[serviceId][definitionKey];
            callback(definition);
        } else {
            ApiDataParse.parseApiDocData(serviceId).then((res) => {
                var definition = top.definitions[serviceId][definitionKey];
                callback(definition);
            })
        }
    },
    /**
     * 获取引用类名称
     * @param ref
     * @returns {*|string}
     */
    getDefinitionType(ref) {
        if (!ref) return;

        var temps = ref.split('/');
        var key = temps[temps.length - 1];
        return key;
    },
    /**
     * 解析api
     * @param paths
     * @returns {{}}
     * @private
     */
    _parseApis(paths) {
        var apis = {};
        for (var pathKey in paths) {
            var path = paths[pathKey];
            //console.log(path);
            for (var apiKey in path) {
                var api = path[apiKey];
                api.method = apiKey;
                api.module = api.tags[0];
                api.id = api.module + '_' + api.operationId;
                api.path = pathKey

                //console.log(api.parameters);
                if (api.parameters) {
                    api.parameters.forEach((parameter, i) => {
                        if (parameter.in == 'body') {
                            //console.log(parameter.schema.$ref);
                            if (parameter.schema && parameter.schema.$ref) {
                                parameter.type = ApiDataParse.getDefinitionType(parameter.schema.$ref);
                            }
                        } else if (parameter.enum) {
                            parameter.description += ', 可选值[' + parameter.enum + ']';
                        }
                        //console.log(parameter);
                        if (parameter.name == 'columns' || parameter.name == 'sortCode' || parameter.name == 'sortByDefault' || parameter.name == 'includeDeleted') {
                            api.parameters.splice(i, 1);
                        }
                    });
                }

                apis[api.id] = api;
            }
        }

        return apis;
    },
    /**
     * 解析模块
     * @param tags
     * @param apis
     * @returns {{}}
     * @private
     */
    _parseModules(tags, apis) {
        var modules = {}
        var deleteTagIndex;
        tags.forEach(function (module, index) {
            if (module.name == "basic-error-controller") {
                deleteTagIndex = index;
                return;
            }
            module.apis = [];

            for (var apiKey in apis) {
                var api = apis[apiKey];
                // console.log(apis[apiKey].module);
                // console.log(module);
                if (api.module == module.name) {
                    module.apis.push(api);
                }
            }

            module.apis.sort(function (a, b) {
                return a.summary.localeCompare(b.summary);
            });

            //console.log(module);

            modules[module.name] = module;
        });

        // tags.splice(deleteTagIndex,1);

        return modules;
    },
    _parseDef(definitions) {
        for (var definitionKey in definitions) {
            var definition = definitions[definitionKey];
            //console.log(definition.properties)
            for (var proName in definition.properties) {
                if (proName.indexOf('ApiResponse') > -1) {
                    // TODO
                } else if (proName.indexOf('PageResult') == -1
                    && proName != 'View'
                    && proName != 'Page') {
                    var pro = definition.properties[proName];
                    pro.name = proName;
                    if (pro.type == 'array') {
                        if (pro.items.enum) {
                            pro.description += ', 可选值[' + pro.items.enum + ']';
                        } else if (pro.items.$ref) {
                            pro.items.type = ApiDataParse.getDefinitionType(pro.items.$ref);
                        }
                    } else if (pro.enum) {
                        pro.description += ', 可选值[' + pro.enum + ']';
                    } else if (pro.$ref) {
                        //console.log(pro);
                        pro.type = ApiDataParse.getDefinitionType(pro.$ref);
                    }
                }
            }
        }
    }
}

module.exports = ApiDataParse;
