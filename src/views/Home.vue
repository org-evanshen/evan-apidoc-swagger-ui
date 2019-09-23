<template src="./Home.html"></template>

<script>
    import {mapActions, mapState, mapGetters, mapMutations} from "vuex";
    import Constant from '@/constant/Constant';
    import UserTypeEnum from "@/constant/enums/UserTypeEnum"

    export default {
        data() {
            return {
                menus: [],
                currentModule: '',
                currentApi: '',
                apisToRender: [],
                activeIndex: '',
                isCollapse: false,
                showLoginWin: false,
                notLogin: true,
                moduleTitle: '',
                loginUser: {},
                csrfToken:''
            };
        },
        created: function () {
            var _this = this;
            var _menus = [];

            for (var serviceId in Constant.REMOTE_URI) {
                ApiDataParse.parseApiDocData(serviceId).then((res) => {
                    _menus.push({'id': res.service.id, 'name': res.service.name, 'modules': res.data.tags});
                }).catch((service)=>{
                    _menus.push({'id': service.id, 'name': service.name});
                });
            }

            _this.menus = _menus;
            var serviceId = _this.$route.params.serviceId;
            var moduleName = this.$route.params.moduleName;

            _this.activeIndex = serviceId + '-' + moduleName;

            this.loadCsrfToken();
            this.userInfo();
        },
        computed:{
            ...mapGetters({
                userAgent: 'userAgent',
            }),
            userInfoText(){
                let userAgent = this.userAgent;
                let username = userAgent.userName ? userAgent.userName : userAgent.account;
                return username + '-' + userAgent.orgNamePath + ' [' + UserTypeEnum.get(userAgent.userType).text + ']';
            }
        },
        methods: {
            ...mapActions({
                getCsrfToken: 'csrfToken',
                login: "login",
                userInfo: 'userInfo',
                switchUserType: 'switchUserType',
                logout: 'logout'
            }),
            loadCsrfToken() {
                let _this = this;
                this.getCsrfToken().then((res) => {
                    _this.csrfToken = res;
                });
            },
            /**
             * 折叠和展开
             */
            leftFold() {
                var marginLeft;
                if (this.isCollapse) {
                    this.isCollapse = false;

                } else {
                    this.isCollapse = true;
                }
            },
            selectModule(serviceId, moduleName) {
                this.$router.push({path: "/" + serviceId + '/' + moduleName});
            },
            setModuleTitle(title) {
                this.moduleTitle = title;
            },
            switchUserTypeText(){
                let userAgent = this.userAgent;
                return userAgent.userType == UserTypeEnum.CUSTOM.code || userAgent.userType == UserTypeEnum.CLIENTS.code ? '供方' : '需方';
            },
            async accountLogin() {
                if (!this.loginUser.account) {
                    this.$alert({message: '请输入用户名', type: 'warning'})
                    return;
                }
                if (!this.loginUser.pwd) {
                    this.$alert({message: '请输入密码', type: 'warning'})
                    return;
                }
                let user = await this.login({
                    account: this.loginUser.account,
                    pwd: this.loginUser.pwd,
                    csrfToken: this.csrfToken
                });
                if(user){
                    let _this = this;
                    this.$message({
                        message: '登录成功！', type: 'success',
                        onClose: function () {
                            _this.showLoginWin = false;
                            _this.loginUser = {};
                        }
                    })
                    let userAgent = await this.userInfo();
                    if (userAgent.userType == UserTypeEnum.CLIENTS.code) {
                        this.switchUserType();
                    }
                }
            },
            userSwitchUserType() {
                let userType = UserTypeEnum.SUPPLIER.code;
                if(this.userAgent.userType == UserTypeEnum.SUPPLIER.code){
                    userType = UserTypeEnum.CUSTOM.code;
                }
                let userAgent = this.switchUserType(userType);
                if(userAgent){
                    this.$message({message: '切换成功！', type: 'success'})
                }
            },
            async userLogout() {
                let _this = this;
                this.$confirm('是否要退出?', "退出", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                     _this.logout();
                    this.$message({message: '退出成功！', type: 'success'})
                });
            }
        },
        watch: {
            "$route": function (to, from, next) {

            }
        }
    }
</script>
