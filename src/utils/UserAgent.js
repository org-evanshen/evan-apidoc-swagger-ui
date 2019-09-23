import {Base64} from "js-base64";

const UserAgent = {
    /**
     *
     * @param userAgent
     * @param [store]
     */
    save: function (userAgent, commit) {
        console.log('>>>>> user agent save')
        top.userAgent = null; //必须清除缓存

        var userAgent1 = {
            token: userAgent.token,
            tokenSecret: userAgent.tokenSecret,
            id: userAgent.id,
            account: userAgent.account,
            orgStatus: userAgent.orgStatus,
            orgAdmin: userAgent.orgAdmin,
            systemAdmin: userAgent.systemAdmin,
            orgId: userAgent.orgId,
            orgTopId: userAgent.orgTopId,
            companyOrgId: userAgent.companyOrgId,
            permissions: userAgent.permissions,
            legalPerson: userAgent.legalPerson,

            userType: userAgent.userType,
            customType: userAgent.customType,
            userName: userAgent.userName,
            orgNamePath: userAgent.orgNamePath,
            gatherCenter: userAgent.gatherCenter,
            switchUserType: userAgent.switchUserType,
            authorizationLetterUploaded: userAgent.authorizationLetterUploaded,
            childOrgIds: userAgent.childOrgIds,
        };
        top.userAgent = userAgent1;

        if (commit) {
            commit('saveUserAgent', userAgent1);
        }else {
            console.log("store不能为空");
        }
    },
    remove: function () {
        top.userAgent = null; //必须清除缓存
        Core.CookieUtil.remove('agent');
        window.localStorage.removeItem('userAgent');
    },
    update: function (userAgentUpdate, store) {
        var userAgent = this.get();
        for(var properties in  userAgentUpdate){
            userAgent[properties] = userAgentUpdate[properties];
        }
        this.save(userAgent, store);
    },
    /**
     * 当前登录用户
     * @returns {*}
     */
    get: function () {
        var userAgent = top.userAgent; //缓存
        if (!userAgent) {
            // var userAgentStoreOnCookie = Core.CookieUtil.get('agent');
            var userAgentStoreOnCookie = window.localStorage.getItem('userAgent');
            if (userAgentStoreOnCookie) {
                var userAgentJson = Base64.decode(userAgentStoreOnCookie).substr(64);
                // console.log(userAgentJson);
                try {
                    userAgent = JSON.parse(userAgentJson);
                    top.userAgent = userAgent; //缓存
                } catch (ex) {
                    console.error("Json parse error: " + userAgentJson);
                }
            }
        }
        return userAgent;
    },
    /**
     * 权限判断
     * @param allowFunctionIds 允许的权限数组
     * @returns {boolean}
     */
    haveOneOfPermissions: function (allowFunctionIds) {
        var userAgent = this.get();
        if (!userAgent) {
            return false;
        }

        if (userAgent.systemAdmin || userAgent.orgAdmin) //供方、物流公司、仓管主账号自动拥有所有权限
        {
            return true;
        }
        if (!(allowFunctionIds instanceof Array)) {
            allowFunctionIds = [allowFunctionIds];
        }

        // //避免刷新权限丢失
        if(userAgent.permissions.length < 1){
            userAgent.permissions = JSON.parse(localStorage.getItem('userAgent')).permissions;
        };

        this.checkFunction(userAgent.userType,allowFunctionIds);

        var userFunctionIds = userAgent.permissions;
        // console.log(userFunctionIds);

        for (var i in allowFunctionIds) {
            for (var j in userFunctionIds) {
                if (userFunctionIds[j] === allowFunctionIds[i]) {
                    return true;
                }
            }
        }
        return false;
    },
    checkFunction:function (userType, userFunctions) {
        var userTypeStr = "";
        switch (userType){
            case 1:
                userTypeStr = "p-";
                break;
            case 2:
                userTypeStr = "c-";
                break;
            case 3:
                userTypeStr = "s-";
                break;
            case 4:
                userTypeStr = "l-";
                break;
            case 5:
                userTypeStr = "st-";
                break;
            case 7:
                userTypeStr = "in-";
                break;
        }

        if (userTypeStr) {
            for (var i in userFunctions) {
                if (!userFunctions[i].indexOf(userTypeStr) == 0) {
                    userFunctions[i] = userTypeStr + userFunctions[i];
                }
            }
        }
    }
};
module.exports = UserAgent;
