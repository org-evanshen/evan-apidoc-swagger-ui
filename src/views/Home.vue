<template src="./Home.html"></template>

<script>
    import Constant from '@/constant/Constant';
    import qs from 'qs';
    import md5 from 'blueimp-md5'
    import {sha256} from 'js-sha256'
    import {MessageBox} from 'element-ui';
    import VueCookies from 'vue-cookies'

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
                islogin: false,
                loginUser: {},
                loginUserForm: {},
                showGuide:true
            };
        },
        created: async function () {
            var _this = this;
            var _menus = [];

            for (var serviceId in Constant.REMOTE_URI) {
                await ApiDataParse.parseApiDocData(serviceId).then((res) => {
                    _menus.push({'id': res.service.id, 'name': res.service.name, 'modules': res.data.tags});
                }).catch((service) => {
                    _menus.push({'id': service.id, 'name': service.name});
                });
            }

            _this.menus = _menus;
            // console.log(_menus)
            var serviceId = _this.$route.params.serviceId;
            var moduleName = this.$route.params.moduleName;

            _this.activeIndex = serviceId + '-' + moduleName

            _this.loginUser = LoginUser.get();
            _this.islogin = _this.loginUser != undefined;

            let cookieAccount = VueCookies.get('account')
            // console.log('cookieAccount',cookieAccount)
            if (cookieAccount) {
                this.loginUserForm.account = cookieAccount;
            }
        },
        computed: {
            userInfoText() {
                let loginUser = this.loginUser;
                let loginUserText = null;
                if (loginUser) {
                    loginUserText = loginUser.orgName + '  [' + loginUser.account + ']';
                }
                return loginUserText;
            }
        },
        methods: {
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
                this.showGuide = false;
                this.$router.push({path: "/" + serviceId + '/' + moduleName});
            },
            setModuleTitle(title) {
                this.moduleTitle = title;
            },
            login() {
                if (!this.loginUserForm.account) {
                    this.$alert({message: '请输入用户名', type: 'warning'})
                    return;
                }
                if (!this.loginUserForm.pwd) {
                    this.$alert({message: '请输入密码', type: 'warning'})
                    return;
                }

                let loginApiUrl = '/api/merchant/account/login';

                let pwdMd5 = md5(this.loginUserForm.pwd)
                let random = new Date().getTime()
                let sign = sha256(this.loginUserForm.account + random + pwdMd5)

                let loginUserDTO = {
                    account: this.loginUserForm.account,
                    random: random,
                    sign: sign
                }

                loginUserDTO = qs.stringify(loginUserDTO);

                VueHttp.post(loginApiUrl, loginUserDTO, null, true).then((responseBody) => {
                    let _this = this;
                    // console.log(responseBody);
                    LoginUser.save(responseBody.data);
                    VueCookies.set('account', responseBody.data.account);
                    this.$message({
                        message: '登录成功！', type: 'success', duration: 1000,
                        onClose: function () {
                            _this.showLoginWin = false;
                            _this.loginUser = responseBody.data;
                            _this.islogin = true
                        }
                    })
                });
            },
            logout() {
                let _this = this;
                this.$confirm('是否要退出?', "退出", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    LoginUser.remove();
                    this.islogin = false;
                    this.$message({message: '退出成功！', type: 'success', duration: 1000})
                });
            }
        },
        watch: {
            "$route": function (to, from, next) {

            }
        }
    }
</script>
<style scoped lang="scss">
    .guide{
        h2{
            margin: 20px 0 15px;
        }

        line-height: 30px;
        padding: 20px;
    }

</style>
