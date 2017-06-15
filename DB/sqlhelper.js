/**
 * 封装常用的数据库操作
 */
const sql = require('mssql');
const dbcfg = require("./config.js");


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

class SqlItem {
    constructor(sql, [...params]) {
        this.sql = sql;
        this.param = [...params];
    }
}
exports.SqlItem = SqlItem;

class SQLHelper {
    constructor(cfg) {
        this.__db = null;
        this.cfg = cfg;
        this.__pool = null;
    }

    get myDB() {
        if (this.__db == null) {
            this.__db = sql.connect(this.cfg);
        }
        return this.__db;
    }
    get myPool() {
        if (this.__pool == null) {
            this.__pool = new sql.ConnectionPool(this.cfg);
        }
        return this.__pool;
    }

    /**
     * 查找表
     * @param {*查询字符串} sqlString 
     * @param {*参数数组} parameters 
     */
    async GetDataTable(sqlString, parameters) {
        let db = await this.myPool.connect();
        let rq = await db.request();
        for (var param of parameters) {
            rq = rq.input(...param);
        }
        let result = await rq.query(sqlString);
        this.myPool.close();
        if (result.recordsets.length == 0) throw new Error("找不到记录：" + sqlString);
        let datatable = result.recordsets[0];
        return datatable;
    }

    /**
     * 用事务方式依次执行sql语句序列
     * @param {*sql查询对象队列} param0 
     */
    async ExecuteNonQueryTran([...sqlItem]) {
        let result_array = [];
        let db = await this.myPool.connect();
        let transaction = await db.transaction();
        try {
            await transaction.begin();
            let rq = await transaction.request();
            for (let sql_item of sqlItem) {
                for (var param of sql_item.param) {
                    rq = rq.input(...param);
                }
                result_array.push(await rq.query(sql_item.sql));
            }
            await transaction.commit(err => {
                if (err) throw new Error(`提交失败：${err}`);
            });
        } catch (err) {
            //this.myPool.close();
            await transaction.rollback(err=>{
                this.myPool.close();
            });
            throw err;
        }
        this.myPool.close();
        return result_array;
    }
}

sql.on('error', err => {
    console.error(`SQL ON ERROR：${err}`);
});

/**
 *  预定义数据库链接
 */
//Others数据库
exports.OthersDB = () => {
    return new SQLHelper(dbcfg.othersdb);
}
//Crm数据库
exports.CrmDB = () => {
    console.error("CrmDB is unset !!!!");
    return new SQLHelper(dbcfg.othersdb);
}

////////////////////////////////////////////////////////////////////////////////////////

function GetDbType(type, ...x) {
    if (x.length == 0)
        return sql[type];
    return sql[type](...x);
}

/**
 * SQL参数
 * @param {*参数化名称（免@符号）} paramName 
 * @param {*数据类型，详情：https://www.npmjs.com/package/mssql#data-types} dbType 
 * @param {*值} value 
 */
exports.MakeInParam = (paramName, x, value) => {
    let type = Array.isArray(x) ? GetDbType(...x) : GetDbType(x);
    return new SqlParameter(paramName, type, value);
}