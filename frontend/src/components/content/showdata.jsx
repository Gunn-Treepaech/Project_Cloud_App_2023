import { useState } from "react";

function Showdata(props){
    const datanew = props.data.data
    const datakey = props.value
    //let datanew = Object.values(data)
    //let datakey = Object.keys(data)
    console.log("earn",datanew );
    console.log("earn2",datakey );
    const [databla1, setdatabla1] = useState('')
    const [dataint1, setdataint1] = useState('')
    const [dataremai1, setdataremai1] = useState('')
    let databla = 0
    let dataint = 0
    let dataremai = 0
    let cunt = 0
    for (let entry in datanew) {
        let date = datanew[entry]
        console.log("88",entry);
        if(entry == datakey){
            console.log("777",date);
            let dateremai = date[date.length - 1].remaining
            console.log("count1",dateremai);
            dataremai += dateremai
        for (let item of date){
            dataint += item.interest
            databla += item.balance
            console.log("2544",item.balance);

        }
        databla
    }
        
        //let balance += entry;
        //databla += balance
        console.log("2555",date);
    }
    console.log("count",cunt);
    
    console.log("aaa",databla);
   // let datablfull = Math.ceil(databla)
        
    
    
    //console.log("2546",databank);
    return (
                 <div className="grid grid-cols-1 mx-5  mb-3   ">
                    <label className="" htmlFor="">จ่ายยอดเงินกู้</label>
                <input type="text" className="text-center my-2 bg-white   border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1  " disabled value={Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
}).format(databla)}  />
                <label className="" htmlFor="">จ่ายดอกเบี้ย</label>
                <input type="text" className="text-center my-2 bg-white   border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1" disabled placeholder="asda" value={Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
}).format(dataint)}  />
               <label className="" htmlFor="">ยอดเงินกู้คงเหลือ</label>
                 <input type="text" className="text-center my-2 bg-white   border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1" disabled placeholder="asda" value={Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
}).format(dataremai)} />
                
                
            </div>
        
    )
}
export default Showdata