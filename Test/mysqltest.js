const mysql = require("mysql");

(async() => {
    const conn = {
        //host: "10.182.4.18",
        host: "10.10.166.27",
        user: "slxt",
        password: "7701",
        database: "testdb"
    };

    let db = mysql.createConnection(conn);
    await db.connect();

    await db.query("select * from t1;", (err, result) => {
        console.log(err, result);
    });

    console.log("End");
    db.end();

    // let pool = mysql.createPool(conn);
    // pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    //     if (error) throw error;
    //     console.log('The solution is: ', results[0].solution);
    //     console.log(fields)
    // });
})();