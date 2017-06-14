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
        let rsl = null;
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
                callback(datatable);
            }).catch(error => console.log(`查询失败：\nSQL:[${sqlString}]\n错误信息：${error}`));
        }).catch(error => console.log("数据库连接失败：", error));

        return rsl;
    }

    async ExecuteNonQuery([...sqlItem]) {
        const transaction = new sql.Transaction(this.myDB);

        transaction.begin(err => {
            console.log("begin err:",err);

            const request = new sql.Request(transaction)
            request.query('insert into mytable (mycolumn) values (12345)', (err, result) => {
                console.log("query err:",err);

                transaction.commit(err => {
                    console.log("commit err:",err);

                    console.log("Transaction committed.")
                })
            })
        })
    }
}

sql.on('error', err => {
    console.error(err)
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