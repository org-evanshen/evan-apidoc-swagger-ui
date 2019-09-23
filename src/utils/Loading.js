const  Loading = {
    /**
     * 按钮设置为loadding
     * @param _this 传递 this
     * @param [loadgingPropertyName]
     */
    append(_this,loadingPropertyName) {
        if(!loadingPropertyName){
            loadingPropertyName = 'isButtonLoading';
        }
        //console.log(loadingPropertyName);

        _this[loadingPropertyName] = true;
        top.currentThis = _this;
        top.currentLoadingPropertyName = loadingPropertyName;
    },
    remove(_this) {
        if(top.currentThis) {
            top.currentThis[top.currentLoadingPropertyName] = false;
        }
        if(_this){
            _this[top.currentLoadingPropertyName] = false;
        }
    }
}

module.exports = Loading;


