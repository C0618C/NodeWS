/**
 * 多数据库通用接口 Multi-DB Interface
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
    /**
     * 独立的一次查询
     * @param {*sql语句} sql 
     * @param {*SqlParameter的数组} param1 
     */
    constructor(sql, [...params]) {
        this.sql = sql;
        this.param = [...params];
    }
}
exports.SqlItem = SqlItem;

/**
 * 创建SQL参数
 * @param {*参数化名称（免@符号）} paramName 
 * @param {*数据类型} dbType 
 * @param {*值} value 
 */
exports.MakeInParam = (paramName, dbType, value) => {
        return new SqlParameter(paramName, dbType, value);
}


/**
 * 数据库统一访问接口定义
 */
class SQLHelper {
    constructor(cfg) {
        this.__db = null;
        this.cfg = cfg;
        this.__pool = null;
    }

    /**
     * 查找表
     * @param {*查询字符串} sqlString 
     * @param {*参数数组} parameters 
     */
    async GetDataTable(sqlString, parameters) {
        return {};
    }

    /**
     * 用事务方式依次执行sql语句序列
     * @param {*sql查询对象队列} param0 
     */
    async ExecuteNonQueryTran([...sqlItem]) {
        return [];
    }
}
exports.SqlHelper = SQLHelper;