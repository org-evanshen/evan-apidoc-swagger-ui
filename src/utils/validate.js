var Validate = {
    checkEmail: function (rule, value, callback) {
        // var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        var reg = /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
        if (value && !reg.test(value)) {
            return callback(new Error('邮箱格式不正确'));
        } else {
            callback();
        }
    },
    checkMobile: function (rule, value, callback) {
        var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (value && !reg.test(value)) {
            // if(callbackB){
            //     callbackB('error');
            // }
            return callback(new Error('手机号码格式不正确'));
        } else {
            // if(callbackB){
            //     callbackB();
            // }else{
                callback();
            // }
        }
    },
    //统一社会校验
    checkUnifyCode: function (rule, value, callback) {
        // 长度校验
        if (!value || value.length != 18) {
            callback(new Error('请输入18位统一社会信用代码'));
        }
        var reg = /^([0-9ABCDEFGHJKLMNPQRTUWXY]{2})([0-9]{6})([0-9ABCDEFGHJKLMNPQRTUWXY]{10})$/;
        if (value && !reg.test(value)) {
            return callback(new Error('统一社会信用代码格式不正确'));
        } else {
            callback();
        }
    },
    checkNumber: function (rule, value, callback) {
        var reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
        if (value && !reg.test(value)) {
            return callback(new Error('请输入正确的数字'));
        } else {
            callback();
        }
    },
    checkIdCard: function (rule, value, callback) {
        if (value.length != 18) {
            return callback(new Error('请输入18位证件号码'));
        }
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!reg.test(value)) {
            return callback(new Error('身份证格式不正确'));
        } else {
            callback();
        }
    },
    IdentityCodeValid: function (id) {
        var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
        //号码规则校验
        if(!format.test(id)){
            return false;
        }
        var year = id.substr(6,4),//身份证年
            month = id.substr(10,2),//身份证月
            date = id.substr(12,2),//身份证日
            time = Date.parse(month+'-'+date+'-'+year),//身份证日期时间戳date
            now_time = Date.parse(new Date()),//当前时间戳
            dates = (new Date(year,month,0)).getDate();//身份证当月天数
        if(time>now_time||date>dates){
            return false;
        }
        //校验码判断
        var c = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2);   //系数
        var b = new Array('1','0','X','9','8','7','6','5','4','3','2');  //校验码对照表
        var id_array = id.split("");
        var sum = 0;
        for(var k=0;k<17;k++){
            sum+=parseInt(id_array[k])*parseInt(c[k]);
        }
        if(id_array[17].toUpperCase() != b[sum%11].toUpperCase()){
            return false;
        }
        return true;
    },
    checkEndDay: function(rule, value, callback){
        if (!value) {
            return callback(new Error('请输入开始日'));
        }
        if (value < 1 || value > 31) {
            return callback(new Error('1-31之内的数字'));
        }
        callback();
    },
    checkNotMinus: function (rule, value, callback) {
        var reg = /^[-]/ig;
        if (value && reg.test(value)) {
            return callback(new Error('数字不能小于0'));
        }
    },
    checkNotChina: function (rule, value, callback) {
        var reg = /^[a-z|A-z|0-9-]+$/ig;
        if (value && !reg.test(value)) {
            return callback(new Error('编号格式不正确！'));
        }
    },
    checkVehicle: function (rule, value, callback) {
        console.log(3123123);
        var reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
        if (value && !reg.test(value)) {
            return callback(new Error('请输入正确的车牌号码'));
        }else {
            callback();
        }
    }
};
module.exports = Validate;
