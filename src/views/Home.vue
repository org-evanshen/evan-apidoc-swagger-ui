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
                showGuide:false
            };
        },
        created: async function () {
            let path = this.$route.path
            this.showGuide = path === '/'

            let _this = this;
            let _menus = [];

            for (var serviceId in Constant.REMOTE_URI) {
                await ApiDataParse.parseApiDocData(serviceId).then((res) => {
                    if(res.service.id === 'merchant') {

                        let tags = res.data.tags
                        let menus = {}

                        for (let i = 0; i < tags.length; i++) {
                            let tag = tags[i]

                            let description = tag.description
                            let index = description.indexOf('::')
                            let menu, name
                            if (index < 0) {
                                menu = '其他'
                            } else {
                                menu = description.substring(0, index)
                                description = description.substring(index + 2)
                            }

                            let children = menus[menu]
                            if (!children) {
                                children = []
                            }
                            children.push({name: tag.name, description: description})
                            menus[menu] = children
                        }

                        for (let menu in menus) {
                            let children = menus[menu]
                            _menus.push({'id': res.service.id + '::' + menu, 'name': menu, 'modules': children});
                        }
                    }else{
                        _menus.push({'id': res.service.id, 'name': res.service.name, 'modules': res.data.tags});
                    }
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
                let index = serviceId.indexOf('::')
                let _serviceId
                if (index < 0) {
                    _serviceId = serviceId
                } else {
                    _serviceId = serviceId.substring(0, index)
                }

                this.showGuide = false;
                this.$router.push({path: "/" + _serviceId + '/' + moduleName});
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
<style lang="scss">
    /*顶部 banner*/
    #container-banner {
        position: fixed;
        height: 45px;
        background: #324157;
        color: #bfcbd9;
        position: fixed;
        width: 100%;
        z-index: 50;

        .banner-left {
            display: inline-block;
            height: 45px;
            color: #f6f6f6;
            line-height: 45px;
            text-align: center;
            width: 180px;

            a {
                font-size: 18px;
                color: #fff;
            }
        }

        .banner-right {
            float: right;
            padding-right: 20px;

            span {
                color: #fff;
            }
        }
    }

    #container-sidebar {
        position: fixed;
        background: #324157;
        position: fixed;
        height: 100vh;
        overflow-y: hidden;
        padding-top: 45px;

        /*左侧导航折叠*/
        #menu_toggle {
            display: inline-block;
            width: 100%;
            cursor: pointer;
            text-align: center;
            padding: 6px;

            i {
                font-size: 18px;
            }
        }

        #menu_toggle:hover {
            background: #535769;
        }

        /*菜单*/
        #container_menu {
            height: calc(100% - 30px);
            overflow: auto;
            border-right: 0px;
            background: #324157;

            .el-submenu {
                .el-submenu__title {
                    height: 52px;
                    line-height: 52px;

                    span {
                        color: #fff;
                    }
                }

                .el-submenu__title:hover {
                    background-color: #535769;
                }

                .el-menu-item {
                    min-width: 220px;
                    height: 36px;
                    line-height: 36px;
                    color: #fff;
                    overflow: hidden;
                    background: #2d303c;

                    span {
                        //font-size: 12px;
                    }
                }

                .el-menu-item:hover {
                    background: #585b67;
                }

                .el-menu-item.is-active {
                    background: #469efd;
                }
            }
        }

        .el-menu:not(.el-menu--collapse) {
            width: 220px;
        }
    }

    #container-content.collapse {
        margin-left: 65px;
    }

    #container-content {
        margin-left: 220px;
        padding-top: 45px;

        .guide{
            h2{
                margin: 20px 0 15px;
            }

            line-height: 30px;
            padding: 20px;
        }
    }
</style>
