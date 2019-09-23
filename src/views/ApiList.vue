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
<style scoped lang="scss">

</style>
