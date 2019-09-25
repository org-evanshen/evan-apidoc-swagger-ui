import Constant from '@/constant/Constant'

const url = Constant.REMOTE_URI.zuul.path;
const ZUUL_URL = Constant.REMOTE_URI.zuul.path;

const state = {
    userAgent: {},
};

const getters = {
    userAgent(state){
        if (!state.userAgent || Object.keys(state.userAgent).length == 0) {
            state.userAgent = UserAgent.get();
        }
        return state.userAgent;
    },
    userTypeCache(state) {
        if (!state.userType) {
            state.userType = window.localStorage.getItem('userType');
        }
        return state.userType
    }
};

const mutations = {
    cacheUserType(state, userType) {
        state.userType = userType;
        window.localStorage.setItem('userType', userType);
    },
    saveUserAgent(state, userAgent) {
        //加密
        let userAgentStoreOnCahe = Base64.encode(DigestUtils.sha256(userAgent.token + new Date().getTime()) + JSON.stringify(userAgent));
        //存储
        window.localStorage.setItem('userAgent', userAgentStoreOnCahe);
        state.userAgent = userAgent;
    },
    removeUserAgent(state) {
        state.userAgent = {}
        UserAgent.remove();
    },
};

const actions = {
    /**
     * 获取csrf token
     * @param commit
     */
    csrfToken({commit}) {
        return VueHttp.get(ZUUL_URL + 'csrf/token')
            .then((res) => {
                return res.data;
            })
    },
    /**
     * 登录
     * @param commit
     * @param state
     * @param account 账户
     * @param pwd 密码
     */
    login({commit, state}, {account, pwd, validateCodeSMS, csrfToken}) {
        if(!account || (!pwd && !validateCodeSMS)){
            console.warn('>>>>>>>>> login is has null');
            return;
        }

        let random = new Date().getTime();
        let login = {
            random: random,
            account: account,
            validateCodeSMS: validateCodeSMS,
            csrfToken: csrfToken
        };
        login.sign = DigestUtils.sha256(account + random + DigestUtils.sha256(pwd));
        return VueHttp.post(url + 'login', {data: login})
            .then((res) => {
                UserAgent.save(res.data, commit);
                commit('cacheUserType', res.data.userType);
                return res.data;
            })
    },
    /**
     * 加载用户信息
     * @param commit
     */
    userInfo: function ({commit,getters}) {
        let userAgent = getters.userAgent;
        if (!userAgent || Object.keys(userAgent).length == 0) {
            return;
        }

        return new Promise((resolve, reject)=> {
            VueHttp.get(url + 'users/myinfo-and-menus', {}, true)
                .then((res) => {
                    UserAgent.save(res.data.userAgent, commit);
                    commit('cacheUserType', res.data.userType);
                    resolve(res);
                    return res.data;
                }).catch((error)=>{
                    return null;
                })
        })
    },
    /**
     * 退出
     */
    logout({commit}){
        commit('removeUserAgent')
        VueHttp.post(url + 'logout').then((res) => {

        });
    }
};

export default {
    state,
    getters,
    mutations,
    actions,
}
