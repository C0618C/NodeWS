const sql = require('mssql')


async function test ()  {
    try {
        console.log("A")
        const pool = await sql.connect('mssql://sa:7701@10.10.166.68/Others')
        const result = await sql.query `select * from BPM_TL`
        console.dir(result)
    } catch (err) {
        console.log(err);
        // ... error checks 
    }
}

test();