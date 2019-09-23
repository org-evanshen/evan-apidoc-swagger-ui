const filters = {
    /**
     * 删除类型
     * @param parameter
     * @returns {string}
     */
    parameterType(parameter){
        /*console.log(parameter)*/
        if(parameter.in == 'body'){
            parameter.type = '<a href="#'+parameter.type+'">'+parameter.type+'</a>'
        }

        return parameter.type;
    },
}

export default (Vue) => {
    Object.keys(filters).forEach(key => {
        Vue.filter(key, filters[key])
    })
}
