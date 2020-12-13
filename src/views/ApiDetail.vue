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
<style lang="scss">
    .container_api {
        padding: 26px;
        padding-top: 5px;
        margin-left: 240px;

        .api_title {
            //padding: 0 16px ;
            height: 52px;
            line-height: 60px;
            //border-bottom: solid 1px #eaeaea;
            h3 {
                font-weight: 500;
                font-size: 25px;
                color: #333;
                display: inline-block;
            }

            .el-button {
                float: right;
            }
        }

        .el-tabs__header {
            margin-bottom: 0;

            .el-tabs__item {
                height: 49px;
                line-height: 49px;
                font-size: 16px;
            }
        }

        //面板内容
        .el-tabs__content {
            padding: 0;
        }

        .base-info {
            margin: 20px 0 25px;
            padding: 20px;
            //background: #f3f5f7;
            border-radius: 4px;
            border: solid 1px #eaeaea;
        }


        .el-collapse {
            border: none;

            .el-collapse-item {
                .el-collapse-item__header {
                    //border-left: solid 3px #bbb;
                    font-size: 17px;
                    //background: #f5f7fa;
                    height: 36px;
                    line-height: 36px;
                    //padding: 0 10px;
                    margin: 20px 0 5px;
                }

                .el-collapse-item__content {
                    padding: 0;
                }
            }

            .el-collapse-item__wrap {
                border: none;
            }
        }

        .region-inner {
            > .region-title {
                height: 36px;
                line-height: 36px;
                margin: 20px 0 5px;

                label {
                    font-size: 17px;
                    color: #303133;
                    font-weight: 500;
                }
            }

            .region-subtitle {
                font-weight: 500;
                height: 15px;
                line-height: 15px;
                border-left: solid 2px #999;
                padding-left: 11px;
                margin-bottom: 10px;
            }
        }

        .tb-detail {
            width: 100%;

            > tr {
                > th, > td {
                    vertical-align: top;
                }

                > th {

                    text-align: left;
                    padding: 2px;
                    color: #999;
                    white-space: nowrap;
                    width: 3%;
                    font-weight: 500;
                }

                > td {
                    padding: 3px;
                }
            }
        }

        .tb-list {
            width: 100%;
            border: #e0e3ea solid 1px;

            > tr {
                th, td {
                    padding: 10px 15px 10px 10px;
                    border-bottom: #e0e3ea solid 1px;
                    line-height: 16px;
                }

                th {
                    font-weight: 500;
                    background: #f3f5f7;
                }

                td {
                    vertical-align: top;
                    height: 35px;
                }
            }

            > tr:hover {
                td {
                    background: #f7f7f7
                }
            }
        }

        .code-box {
            padding: 12px 20px;
            background: #444;
            color: #ddd;
            border-radius: 4px;
            border: solid 1px #eaeaea;
        }

        .code-json {
            * {
                font-size: 13px;
                font-family: Menlo;
                line-height: 15px;
            }
            td {
                padding-bottom: 15px;
                padding-left: 5px;
                vertical-align: top;

            }
        }

        .debug-response {
            border: solid 1px #e0e3ea;
            border-radius: 3px;
            min-height: 200px;
            padding: 12px;
            background: #fbfbfb;
        }

        .model-popper {
            height: calc(100% - 60px);
            overflow-y: auto;
            overflow-x: hidden;
            z-index: 1000;
        }
    }
</style>
