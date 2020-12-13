<template>
    <div id="container_module">
<!--        <div class="container_module_title"><h1></h1></div>-->
        <div class="container_apis">
            <div class="container_apis_nav">
                <h2>{{currentModule.description}}</h2>
                <ul>
                    <template v-for="api in apisToRender">
                        <li :class="{active : api.id == currentApiId}" @click="selectApi(api.id)">
                            <!--<i class="el-icon-menu"></i>-->
                            <el-tooltip effect="dark" :content="api.summary" placement="right-end" :open-delay="300">
                                <span>{{api.summary}}</span>
                            </el-tooltip>
                        </li>
                    </template>
                </ul>
            </div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                currentModule: '',
                currentApiId: '',
                apisToRender: []
            };
        },
        created: function () {
            this.renderApiNav();
        },
        methods: {
            renderApiNav() {
                var _this = this;

                _this.serviceId = _this.$route.params.serviceId;
                _this.moduleName = _this.$route.params.moduleName;
                _this.currentApiId = _this.$route.params.apiId;

                ApiDataParse.getModules(_this.serviceId, function (modules) {
                    var module = modules[_this.moduleName];
                    _this.currentModule = module;
                    _this.apisToRender = module.apis;
                });
            },
            selectApi(apiId) {
                this.currentApiId = apiId;
                this.$router.push({path: "/" + this.serviceId + "/" + this.moduleName + "/" + apiId});
            }
        },
        watch: {
            "$route": function (to, from, next) {
                this.renderApiNav();
            }
        }
    }
</script>
<style lang="scss">
    .container_apis {
        .container_apis_nav {
            background: #fff;
            border-right: 1px solid #eaeaea;
            width: 250px;
            position: fixed;
            height: 100vh;

            h2 {
                padding: 0 16px;
                height: 50px;
                line-height: 50px;
                font-size: 16px;
                border-bottom: solid 1px #eaeaea;
                font-weight: 500;
                color: #333;
            }

            ul {
                overflow: auto;
                height: calc(100% - 95px);

                li {
                    padding: 10px 17px;
                    width: 100%;
                    cursor: pointer;
                }

                li:hover {
                    color: #999;
                }

                li.active {
                    background: #fff;
                    color: #409EFF;
                    font-weight: 500;
                }
            }
        }
    }
</style>
