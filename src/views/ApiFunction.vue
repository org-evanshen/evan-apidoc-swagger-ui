<template>
    <div class="api_enums">
        <el-tabs v-model="activeTab" class="region" @tab-click="tabClick">
            <el-tab-pane v-for="(functions,name) of apidocMap" :key="name" :name="name" :label="name" :value="name"></el-tab-pane>
        </el-tabs>

        <el-table :data="cachedFunctionMap[activeTab]" highlight-current-row border>
            <el-table-column label="序号" width="50" align="center">
                <template slot-scope="scope">{{ scope.$index + 1 }}</template>
                <!--<template slot-scope="scope">{{ scope.row }}</template>-->
            </el-table-column>
            <el-table-column label="模块名称" prop="text" align="left"></el-table-column>
            <el-table-column label="类型 " align="left">
                <template slot-scope="scope">
                    <span :style="{ color: scope.row.action ? 'red' : ''}">
                        {{ scope.row.action ? '权限' : '菜单' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="ID" prop="id" align="left"></el-table-column>
            <el-table-column label="URL" prop="url" align="left"></el-table-column>
        </el-table>
    </div>
</template>
<script>

    import * as Constant from "@/constant/Constant";

    export default {
        data() {
            return {
                url: Constant.REMOTE_URI.userService.path + "functions/apidoc",
                activeTab:'平台用户',
                apidocMap:[],
                cachedFunctionMap:[],
                functions:[],
            };
        },
        components:{
        },
        created() {
            this.queryFunctions();
        },
        methods:{
            tabClick(tab){
                let functions = this.cachedFunctionMap[this.activeTab];
                if (!Array.isArray(functions) || functions.length == 0) {
                    this.cachedFunctionMap[this.activeTab] = this.reorganizeData(this.apidocMap[tab.name]);
                }
            },
            queryFunctions(){
                let _this = this;
                VueHttp.get(this.url).then(res=>{
                    this.apidocMap = res.data;

                    _this.cachedFunctionMap[_this.activeTab] = _this.reorganizeData(_this.apidocMap[_this.activeTab]);
                })
            },
            reorganizeData(functions) {
                let _this = this;
                let funs = [];
                functions.forEach(o => {
                    _this.recursion(o, funs);
                });
                return funs;
            },
            recursion(fun, funs) {
                let _this = this;
                if(!Array.isArray(fun.children) && !Array.isArray(fun.actions)){
                    return;
                }
                let children = Array.isArray(fun.children) && fun.children.length > 0 ? fun.children : fun.actions;
                children.forEach(o => {
                    o.text = fun.text + '>>' + o.text;
                    funs.push(o);
                    _this.recursion(o, funs);
                })
            }
        }
    }
</script>
<style scoped>
    .api_enums{
        margin: 10px 20px;
    }
</style>


