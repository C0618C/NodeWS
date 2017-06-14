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


class SQLHelper {
    constructor(cfg) {
        this.__db = null;
        this.cfg = cfg;
    }

    get myDB() {
        if (this.__db == null) {
            this.__db = sql.connect(this.cfg);
        }
        return this.__db;
    }

    /**
     * 查找表
     * @param {*查询字符串} sqlString 
     * @param {*参数数组} parameters 
     */
    async GetDataTable(sqlString, parameters, callback) {
        this.myDB.then(db => {
            let rq = db.request();
            if (parameters.length > 0) {
                for (var param of parameters) {
                    rq.input(...param);
                }
            }
            rq.query(sqlString).then(result => {
                callback(result);
            });
        });
    }
}

sql.on('error', err => {
    // ... error handler 
    console.error(err)
});

exports.OthersDB = () => {
    return new SQLHelper(dbcfg.othersdb);
}

/**
 * SQL参数
 * @param {*参数化名称（免@符号）} paramName 
 * @param {*数据类型，详情：https://www.npmjs.com/package/mssql#data-types} dbType 
 * @param {*值} value 
 */
exports.MakeInParam = (paramName, dbType, value) => {
    return new SqlParameter(paramName, sql.VarChar(36), value);
}