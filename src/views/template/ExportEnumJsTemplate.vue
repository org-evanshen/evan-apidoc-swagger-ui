<template>
    <div ref="content">
import BaseColorEnum from "@enums/common/BaseColorEnum"

export default class {{enumName}} extends BaseColorEnum {
    constructor() {
        super();
    }
}
<template v-for="o in exportData">
{{ enumName + "." + o.name + " = {code: " + (typeof o.code == 'number' ? o.code : "'" + o.code + "'")+ ",text: '" + o.text  + "};"}}</template>

{{enumName}}.merge();
    </div>
</template>
<script>

    export default {
        data() {
            return {}
        },
        props: {
            enumName: '',
            exportData: {
                type: Array,
                default: []
            }
        },
        methods: {
            exportToFile() {
                if (!this.exportData || !this.enumName) {
                    return;
                }

                let content = this.$refs.content.innerHTML;
                if (!content) {
                    return;
                }
                let blob = new Blob([content], {type: "text/plain;charset=utf-8"});

                let url = window.URL.createObjectURL(new Blob([blob]));
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.setAttribute('download', this.enumName + '.js');

                document.body.appendChild(link);
                link.click();
            }
        },
        watch: {
            enumName() {
                let _this = this;
                setTimeout(function () {
                    _this.exportToFile();
                }, 1000)
            }
        }
    }
</script>
