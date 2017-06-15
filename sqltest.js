const SQLHelper = require("./DB/sqlhelper.js");
const odb = SQLHelper.OthersDB();

(async function () {
    try {
        // await odb.GetDataTable("select top 1* from bpm_tl where id = @id;select top 1* from BPM_DISA", [SQLHelper.MakeInParam("id",["VarChar",36],"62F5433E-76C1-415F-9E5E-AB26812D3C84")], (err,result )=> {
        //     console.log(result);
        // });
        await odb.GetDataTable("select * from bpm_taa", [], (err,result) => {
            console.log(result);
        });

        var c =new SQLHelper.SqlItem("insert into bpm_taa(msg) values(@msg_a)",[
            SQLHelper.MakeInParam("msg_a",["NVarChar",4000],"这是第一句话")
        ]);
        var c2 =new SQLHelper.SqlItem("insert into bpm_taa(msg) values(@msg_b)",[
            SQLHelper.MakeInParam("msg_b",["NVarChar",4000],"这是第二句话！！！！！！")
        ]);
        await odb.ExecuteNonQueryTran([c,c2],(err,result)=>{
            console.log("Job Done!!!!!!!!!!!!!!",err,result);
        });
    } catch (err) {
        console.log(err);
        // ... error checks 
    }
})();