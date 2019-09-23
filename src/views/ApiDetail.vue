<template>
    <div class="container_api">
        <div class="api_title">
            <h3>
                {{title}}
            </h3>
            <!--<el-button type="success" @click="isShowDebugWin=true" size="mini"> Debug</el-button>-->
        </div>

        <div class="region">
            <div class="region-title"><label>Base info</label></div>
            <div class="region-content">
                <table class="tb-detail">
                    <tr >
                        <th width="15%">
                            Api path：
                        </th>
                        <td width="35%">
                            {{currentApi.path}}
                        </td>

                        <th width="15%">
                            Request method：
                        </th>
                        <td width="35%">
                            {{currentApi.method}}
                        </td>
                    </tr>
                    <!--<tr>-->
                    <!--<th >-->
                    <!--Request accepts：-->
                    <!--</th>-->
                    <!--<td colspan="3">-->
                    <!--{{currentApi.consumes}}-->
                    <!--</td>-->
                    <!--</tr>-->
                    <tr>
                        <th>
                            Description：
                        </th>
                        <td colspan="3">
                            {{currentApi.description}}
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <el-tabs v-model="activeTab" class="region">
            <el-tab-pane label="More info" name="info">
                <api-info :currentApi="currentApi" :serviceId="serviceId"></api-info>
            </el-tab-pane>
            <el-tab-pane label="Debug" name="debug">
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
