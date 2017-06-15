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
     * @param {*回调函数} callback(err,result) 
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
                if (result.recordsets.length == 0) throw new Error("找不到记录：" + sqlString);
                let datatable = result.recordsets[0];
                callback(undefined, datatable);
            }).catch(error => {
                console.log(`查询失败：\nSQL:[${sqlString}]\n错误信息：${error}`);
                callback(error, datatable);
            });
        }).catch(error => {
            console.log("数据库连接失败：", error);
            callback(error, datatable);
        });
    }

    /**
     * 
     * @param {*sql查询对象队列} param0 
     * @param {*回调函数} callback_rsl(err,result) 
     */
    async ExecuteNonQueryTran([...sqlItem], callback_rsl) {
        this.myPool.connect(err => {
            if (err != null) throw new Error(`数据库打开连接池失败：${err}`);

            const transaction = new sql.Transaction(this.myPool)
            transaction.begin(err => {
                if (err) throw new Error(`打开事务失败:${err}`);
                let isRuning = true;
                let request = transaction.request();
                let exec_sql = (sql_item, callback) => {
                    if (!isRuning) return;
                    for (let p of sql_item.param) {
                        request.input(...p);
                    }
                    request.query(sql_item.sql, (err, result) => {
                        if (err) {
                            isRuning = false;
                            transaction.rollback(err_roll => {
                                callback(err, result);
                            });
                            return;
                        }
                        callback(result);
                    });
                }

                let rsl = [];
                let asyncEach = (fn, arr) => {
                    let l = sqlItem.length,
                        i = -1;
                    let runner = function () {
                        i += 1;
                        if (i >= l) return;
                        fn(sqlItem[i], runner);
                    };
                    runner();
                }
                asyncEach((key, callback) => {
                    exec_sql(key, (result) => {
                        //console.log(result);
                        rsl.push(result);
                        if (rsl.length == sqlItem.length) {
                            transaction.commit(err => {
                                callback_rsl(err, rsl);
                            });
                        }
                        callback();
                    })
                }, sqlItem);
            });
        });
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