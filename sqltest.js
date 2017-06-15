const SQLHelper = require("./DB/sqlhelper.js");
const odb = SQLHelper.OthersDB();

(async function () {
    try {
        console.log(1);
        let result = await odb.GetDataTable("waitfor delay \'00:00:05\';select msg from bpm_taa", []);
        console.log(result);

        result = await odb.GetDataTable("select * from bpm_taa", []);
        console.log(2);
        console.log(result);
        

        // var c = new SQLHelper.SqlItem("waitfor delay \'00:00:05\';insert into bpm_taa(msg) values(@msg_a)", [
        //     SQLHelper.MakeInParam("msg_a", ["NVarChar", 4000], "这是第1句话")
        // ]);
        // var c2 = new SQLHelper.SqlItem("insert into bpm_taa(msg) values(@msg_b)", [
        //     SQLHelper.MakeInParam("msg_b", ["NVarChar", 4000], "这是第2句话！！！！！！")
        // ]);
        // await odb.ExecuteNonQueryTran([c, c2], (err, result) => {
        //     console.log("Job Done!!!!!!!!!!!!!!",err,result);
        //     //console.log(4);
        // });
        // //console.log(5);

    } catch (err) {
        console.log(err);
        // ... error checks 
    }
})();