import BaseEnum from "./BaseEnum";

export default class UserTypeEnum extends BaseEnum {
    constructor() {
        super();
    }
}

UserTypeEnum.PLATFORM = {code: 1, text: '平台端'};
UserTypeEnum.CUSTOM = {code: 2, text: '需求方'};
UserTypeEnum.SUPPLIER = {code: 3, text: '供应方'};
UserTypeEnum.LOGISTICS = {code: 4, text: '物流公司'};
UserTypeEnum.LOGISTICS_DRIVER = {code: 41, text: '物流公司司机'};
UserTypeEnum.STORAGE = {code: 5, text: '仓储公司'};
UserTypeEnum.CLIENTS = {code: 6, text: '客戶'};
UserTypeEnum.INSTITUTION = {code: 7, text: '银行端'};

UserTypeEnum.merge();
