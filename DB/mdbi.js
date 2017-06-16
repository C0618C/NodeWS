/**
 * 多数据库通用接口
 * 旨在为多种数据库，多个数据库提供一致的访问接口。
 * 日期： 2017-06-16
 */

const version = [0,0,1];
exports.version = version;

/**
 * 用于参数化查询的参数对象
 */
class SqlParameter {
    constructor(paramName, dbType, value) {
            this.param_name = paramName;
            this.db_type = dbType;
            this.value = value;
        }
        *[Symbol.iterator]() {
            yield this.param_name;
            yield this.db_type;
            yield this.value;
        }
}
exports.Param = SqlParameter;

/**
 * SQL查询对象
 */
class SqlItem {
    constructor(sql, [...params]) {
        this.sql = sql;
        this.param = [...params];
    }
}
exports.SqlItem = SqlItem;

