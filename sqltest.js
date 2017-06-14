const sql = require('mssql');
const dbCfg = require("./DB/config.js");


(async function  ()  {
    try {
        const pool = await sql.connect(dbCfg.db68)
        const result = await sql.query `select * from BPM_TL`
        console.dir(result)
        process.exit()
    } catch (err) {
        console.log(err);
        // ... error checks 
    }
})();

sql.on('error', err => {
    // ... error handler 
    console.error(err)
});