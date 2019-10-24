import {Base64} from "js-base64";

const LoginUser = {
    /**
     *
     * @param loginUser
     */
    save: function (loginUser) {
        let loginUserEncoding = Base64.encode(JSON.stringify(loginUser));

        top.loginUser = loginUser;
        localStorage.setItem('loginUser', loginUserEncoding)      
    },
    remove: function () {
        top.loginUser = null; //必须清除缓存
        window.localStorage.removeItem('loginUser');
    },
    update: function (loginUser) {
       
    },
    /**
     * 当前登录用户
     * @returns {*}
     */
    get: function () {
        var loginUser = top.loginUser; //缓存
        if (!loginUser) {
            // var loginUserStoreOnCookie = Core.CookieUtil.get('agent');
            var loginUserEncoding = window.localStorage.getItem('loginUser');
            if (loginUserEncoding) {
                var loginUserJson = Base64.decode(loginUserEncoding);
                // console.log(loginUserJson);
                try {
                    loginUser = JSON.parse(loginUserJson);
                    top.loginUser = loginUser; //缓存
                } catch (ex) {
                    console.error("Json parse error: " + loginUserJson);
                }
            }
        }
        return loginUser;
    }
};
module.exports = LoginUser;
