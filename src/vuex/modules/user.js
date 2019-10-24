const state = {
    loginUser: {},
};

const getters = {
    loginUser(state){
        if (!state.loginUser || Object.keys(state.loginUser).length == 0) {
            state.loginUser = LoginUser.get();
        }
        return state.loginUser;
    },
    userTypeCache(state) {
        if (!state.userType) {
            state.userType = window.localStorage.getItem('userType');
        }
        return state.userType
    }
};

const mutations = {
    saveLoginUser(state, loginUser) {
    },
    removeLoginUser(state) {
        state.loginUser = {}
    },
};

const actions = {
    /**
     * 登录
     * @param commit
     * @param state
     * @param account 账户
     * @param pwd 密码
     */
    login({commit, state}, {account, pwd, validateCodeSMS, csrfToken}) {

    },
    /**
     * 退出
     */
    logout({commit}){

    }
};

export default {
    state,
    getters,
    mutations,
    actions,
}
