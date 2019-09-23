<template>
    <div class="container_api">
        <div class="api_title">
            <h3>
                {{title}}
            </h3>
            <!--<el-button type="success" @click="isShowDebugWin=true" size="mini"> Debug</el-button>-->
        </div>
        <el-tabs v-model="activeTab">
            <el-tab-pane label="Api Info" name="info">
                <api-info :currentApi="currentApi" :serviceId="serviceId"></api-info>
            </el-tab-pane>
            <el-tab-pane label="Api Debug" name="debug">
                <api-debug :currentApi="currentApi" :serviceId="serviceId" ref="apiDebug"></api-debug>
            </el-tab-pane>
        </el-tabs>

        <el-dialog :title="title + ' -- Debug'" :visible.sync="isShowDebugWin" width="70%"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false">

        </el-dialog>
    </div>
</template>

<script>
    import ApiInfo from './ApiInfo.vue';
    import ApiDebug from './ApiDebug.vue';

    export default {
        data() {
            return {
                currentApi: '',
                //definitions: [],
                activeTab: 'info',
                response: {},
                title: '...',
                isShowDebugWin: false
            };
        },
        created: function () {
            this.renderApi();
        },
        components: {
            ApiInfo, ApiDebug
        },
        methods: {
            renderApi() {
                var _this = this;
                //_this.definitions.splice(0, _this.definitions.length);

                _this.serviceId = _this.$route.params.serviceId;
                _this.moduleId = _this.$route.params.moduleName;
                _this.apiId = _this.$route.params.apiId;

                //console.log(_this.serviceId);
                //console.log(_this.moduleId);
                //console.log(_this.apiId);

                ApiDataParse.getApis(_this.serviceId, _this.moduleId, function (apis) {
                    _this.currentApi = apis[_this.apiId];

                    _this.title = _this.currentApi.summary;
                });
            }
        },
        watch: {
            "$route": function (to, from, next) {
                this.renderApi();
                this.$refs['apiDebug'].clearRes();
            }
        }
    }
</script>
