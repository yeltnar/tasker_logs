const fs = require("fs");

const start_dir = "./drew_tasker_logs";
const log_i_want = "battery";
const file = "log.csv";

(()=>{
    const ls_result = fs.readdirSync(start_dir);

    const result_obj = ls_result.reduce(( acc, cur, i, arr )=>{
        try{
            const file_contents = fs.readFileSync(`${start_dir}/${cur}/${log_i_want}/${file}`).toString();
            const file_lines_arr = file_contents.split("\n");
            const file_obj_arr = file_lines_arr.reduce((acc,line)=>{
                if( line!=="" ){
                    const res_arr = line.split(",");
                    acc.push({
                        percent:res_arr[1],
                        charging:res_arr[2],
                        time_ms:res_arr[3],
                    })
                }
                return acc;
            },[]);

            file_obj_arr.forEach((cur,i,arr)=>{
                if(cur===undefined  || cur.time_ms===undefined){
                    console.log(`issue ${i} ${JSON.stringify(cur)} ${arr.length}`);
                    process.exit();
                }
            });

            const new_file_obj = mergeFileObjs(acc, file_obj_arr);
            return new_file_obj;
        }catch(e){
            throw e;
        }
    },[]);
    // console.log({result_obj});
    fs.writeFileSync("./out.json",JSON.stringify(result_obj,null,2));
})();

function mergeFileObjs(old_arr, add_arr) {

    const new_arr = old_arr.concat(add_arr).sort((a, b) => {
        if( a.time_ms < b.time_ms ){return -1;}
        if( a.time_ms > b.time_ms ){return 1;}
        else{return 0};
    }).reduce((acc,cur,i,arr)=>{
        if( acc.length-1 >= 0 ){
            const last_element_added = acc[acc.length-1];
            if( last_element_added.time_ms!==cur.time_ms ){
                acc.push(cur);
            }
        }else{
            acc.push(cur);
        }
        return acc;
    },[]);
    return new_arr;
}
