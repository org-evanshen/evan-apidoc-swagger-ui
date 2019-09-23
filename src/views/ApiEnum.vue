<template>
    <div class="api_enums">
        <el-tabs v-model="activeTab" class="region" @tab-click="tabClick">
            <el-tab-pane :name="service.path" v-for="service in services" :label="service.name" :value="service.path" :key="service.path"></el-tab-pane>
        </el-tabs>

        <el-table :data="service.enums" highlight-current-row border>
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-table :data="scope.row.childList" border>
                        <el-table-column label="字段名称" prop="name" align="left"></el-table-column>
                        <el-table-column label="Code" prop="code" align="left"></el-table-column>
                        <el-table-column label="字段描述" prop="text" align="left"></el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column label="序号" width="50" align="center">
                <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column label="枚举类描述" prop="text" align="left"></el-table-column>
            <el-table-column label="枚举类名称" prop="name" align="left"></el-table-column>
            <el-table-column label="全类名" prop="className" align="left"></el-table-column>
            <el-table-column label="导出" prop="name" align="left" width="150">
                <template slot-scope="scope">
                    <el-button @click="exportToJs(scope.row.name)">导出</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="false">
            <export-enum-js-template :exportData="exportData" :enumName="exportEnumName"></export-enum-js-template>
        </div>
    </div>
</template>
<script>

    import ExportEnumJsTemplate from './template/ExportEnumJsTemplate.vue'
    import * as Constant from "@/constant/Constant";

    export default {
        data() {
            return {
                exportData:[],
                exportEnumName:'',
                services: Constant.REMOTE_URI,
                activeTab:'/api/base/',
                service:{
                    enums:[]
                }
            };
        },
        components:{
            ExportEnumJsTemplate
        },
        created() {
            this.tabClick({name: '/api/base/'});
        },
        methods:{
            tabClick(tab){
                for (let attr in this.services) {
                    if (this.services[attr].path == tab.name) {
                        this.service = this.services[attr];
                    }
                }

                if(!this.service.enums || this.service.enums.length == 0){
                    this.getEnums(tab.name);
                }
            },
            getEnums(path){
                let _this = this;
                VueHttp.get(path + 'apidoc/enum')
                    .then((res) => {
                        for( let attr in _this.services){
                            if(_this.services[attr].path == path){
                                _this.$nextTick(function () {
                                    _this.services[attr].enums = res.data;
                                    _this.service.enums = res.data;
                                })
                                _this.$forceUpdate()
                            }
                        }
                    });
            },
            exportToJs(enumName){
                let exportEnum = this.service.enums.find(o => {
                    return enumName == o.name;
                });
                if(!exportEnum){
                    this.$message({message: '未找到此枚举类'})
                }
                this.exportEnumName = enumName;
                let data = [];
                for (let child of exportEnum.childList){
                    try {
                        let code = parseInt(child.code);
                        if(code) child.code = code;
                    }catch (e) { }
                    data.push(child);
                }

                this.exportData = data;
            }
        }
    }
</script>
<style scoped>
    .api_enums{
        margin: 10px 20px;
    }
</style>
