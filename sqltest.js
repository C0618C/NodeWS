const SQLHelper = require("./DB/sqlhelper.js");
const odb = SQLHelper.OthersDB();

(async function () {
    try {
        await odb.GetDataTable("select top 1* from bpm_tl where id = @id;select top 1* from BPM_DISA", [SQLHelper.MakeInParam("id",["VarChar",36],"62F5433E-76C1-415F-9E5E-AB26812D3C84")], result => {
            console.log(result);
        });
        await odb.GetDataTable("select top 1* from BPM_DISA", [], result => {
            console.log(result);
            console.warn("TT2");
        });
    } catch (err) {
        console.log(err);
        // ... error checks 
    }
})();