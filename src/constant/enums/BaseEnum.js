export default class BaseEnum {

    //合并数据
    static merge() {
        var pool = new Map();
        for (var o in this) {
            if (!this[o].code) {
                continue;
            }
            pool.set(this[o].code, this[o]);
        }
        this.pool = pool;
    };

    static get(code) {
        if(!code) return '';
        return this.pool.get(code);
    }
}
