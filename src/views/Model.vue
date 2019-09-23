<template>
    <div>
        <el-tabs v-model="activeTab">
            <el-tab-pane label="Model" name="model">
                <table class="code-json">
                    <tr>
                        <td>{</td>
                    </tr>
                    <template v-for="(pro,index) in properties">
                        <tr>
                            <td style="padding-left: 20px">{{pro.name}}:</td>
                            <td>
                                {{pro.description}}
                                <div>
                                    <template v-if="pro.type=='array'">
                                        [
                                        <template v-if="pro.items.$ref">
                                            <a href="javascript:void(0);" @click="toggle(pro.name + index)">{{pro.items.type}}</a>
                                            <model style="padding-left: 20px" v-if="childIsShow[pro.name + index]"
                                                   :modelId="pro.items.type"
                                                   :serviceId="serviceId" :showAllowEmpty="showAllowEmpty"></model>

                                        </template>
                                        <template v-else><span style="color:green">{{pro.items.type}}</span></template>
                                        ]
                                    </template>
                                    <template v-else-if="pro.$ref">
                                        <a href="javascript:void(0);"
                                           @click="toggle(pro.name + index)">{{pro.type}}</a>
                                        <model v-if="childIsShow[pro.name+index]" :modelId="pro.type"
                                               :serviceId="serviceId"
                                               :showAllowEmpty="showAllowEmpty"></model>
                                    </template>
                                    <template v-else>
                                        <span style="color:green">{{pro.type}}</span>
                                    </template>

                                    <template v-if="showAllowEmpty & !pro.allowEmptyValue">
                                        , <span style="color:orange">not blank</span>
                                    </template>
                                </div>
                            </td>
                        </tr>
                    </template>
                    <tr>
                        <td>}</td>
                    </tr>
                </table>
            </el-tab-pane>
            <el-tab-pane label="Example" name="example" class="code-json">
                <ul>
                    {
                    <template v-for="(pro,index) in properties">
                        <li style="padding-left: 20px">"{{pro.name}}": "{{pro.description}}",</li>
                    </template>
                    }
                </ul>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>
<script>
    import Model from './Model.vue';

    export default {
        name: 'Model',
        data() {
            return {
                childIsShow: {},
                properties: [],
                activeTab: 'model'
            };
        },
        created: function () {
            //this.getDefinition();
        },
        mounted: function () {
            this.getDefinition();
        },

        components: {
            Model
        },
        props: ['modelId', 'serviceId', 'showAllowEmpty'],
        methods: {
            getDefinition() {
                var _this = this;
                _this.properties.splice(0, _this.properties.length);
                ApiDataParse.getDefinition(_this.serviceId, _this.modelId, (definition) => {

                    if (!definition) return;

                    // console.log(definition)
                    _this.definition = definition;

                    for (var proName in  definition.properties) {
                        var pro = definition.properties[proName];
                        //pro.name = proName;
                        //console.log(pro);
                        // if (pro.type == 'array') {
                        //     //console.log(pro.items.$ref);
                        //     if (pro.items.$ref) {
                        //         pro.items.type = ApiDataParse.getDefinitionType(pro.items.$ref);
                        //     }
                        // } else if (pro.$ref) {
                        //     //console.log(pro);
                        //     pro.type = ApiDataParse.getDefinitionType(pro.$ref);
                        // }
                        _this.properties.push(pro);
                    }
                })
            },
            toggle(name) {
                if (this.childIsShow[name]) {
                    this.$set(this.childIsShow, name, false);
                    //console.log(this.modelIsShow)
                } else {
                    this.$set(this.childIsShow, name, true);
                    //console.log(this.modelIsShow)
                }
            }
        },
        watch: {
            modelId() {
                this.getDefinition();
            }
        }
    }
</script>
