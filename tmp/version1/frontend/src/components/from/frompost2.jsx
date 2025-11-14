import { faPlug, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Bank from "./bank";
import { useContext , useState} from "react";
import DataContext from "../../data/DataContext";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import Showdata from "./showdata";
import Addcomponent from "./addcomponent";
import Frompsot from "./frompots";
function Frompots2(){
    const dataname =  useContext(DataContext)
    console.log("ter2",dataname)
    const [datastart_month, setstart_month] = useState('');
    const [datasstart_year, setstart_year] = useState('');
    const [datainitial_loan, setinitial_loan] = useState('');
    const [datafixed_interest, setfixed_interest] = useState('');
    const [datafixed_year, setfixed_year] = useState('');
    const [datamonthly_payment, setmonthly_payment] = useState('');
    const [datachang_interest, setchang_interest] = useState('');
    const [datachang_interest2, setchang_interest2] = useState('');
    const [databank, setbank] = useState('Kbank');


    const [databalance, setbalance] = useState("");
    const [datainterest, setinterest] = useState("");
    const [datamonth, setmonth] = useState("");
    const [dataoverpayment, setoverpayment] = useState("");
    const [dataremaining, setremaining] = useState("");



    const [datarespone, setrespone] = useState([]);

    const Calcultor = ( datarespone ) => {
    //const firstData = datarespone;
    console.log("2546",databank)
    console.log("2546",datarespone[databank])
    
    
   
    
    }
    

    const [selectedOption, setSelectedOption] = useState('');
    const [dataDate, setDate] = useState('**/**/**');
    const [dataY, setY] = useState('1');
    let data = {
        start_month: parseInt(datastart_month),
        start_year: parseInt(datasstart_year),
        initial_loan: parseInt(datainitial_loan),
        fixed_interest: parseFloat(datafixed_interest),
        fixed_year: parseInt(datafixed_year),
        MRR: parseFloat(selectedOption),
        monthly_payment: parseInt(datamonthly_payment),
        chang_interest: [parseFloat(datachang_interest), parseFloat(datachang_interest2)],
        bank: databank
    }
    
    const handleSubmit =(e) => {
        e.preventDefault(); 
        console.log(data);
        axios.post("http://192.168.31.129:5000/calculate",data)
        .then((respons)=>{
            console.log("ten",respons)
            setrespone(respons.data)
        })

    }
    

    



    console.log("respone",datarespone);

    const handleSelectChange = (event) => {
    console.log("art",event)
    const selectedValue = event.target.value;
    console.log("aet2",dataname[2].bank_name)
    setbank(selectedValue) 
      
    let date
    let dataMrr
    if (selectedValue  == "Kbank" ){
        date = dataname[0].update_MMR
        dataMrr = dataname[0].MRR
        setDate(date)
        setSelectedOption(dataMrr)
        console.log("11",date);

    }
    else if(selectedValue == "KTB"){
        date = dataname[1].update_MMR
        dataMrr = dataname[1].MRR
        setDate(date)
        setSelectedOption(dataMrr)
        console.log("12",date);


    }
    else if (selectedValue ==  "SCB" ){
        date = dataname[2].update_MMR
        dataMrr = dataname[2].MRR
        setDate(date)
        setSelectedOption(dataMrr)
        console.log("13",date);


    } else if (selectedValue == "UOB" ){
        date = dataname[3].update_MMR
        dataMrr = dataname[3].MRR
        setDate(date)
        setSelectedOption(dataMrr)
        console.log("14",date);

    }

    
    
    // ตรวจสอบการเปลี่ยนแปลงที่เกิดขึ้น
    // ตัวอย่างเช่น, คุณสามารถเรียกใช้ API, อัปเดต state, เป็นต้น
    //console.log('Selected value:', selectedValue);
    //console.log('Selected date:', dataDate);
    
  };

  const handleSelectChangeY = (event) => {
    const selectedValue = event.target.value;
    setY(selectedValue)
    setfixed_year(selectedValue)
    
  };
  
  const checkY = (dataY)  => {
    console.log("earn",dataY);
   let conta 
   if(dataY == "1"){
    conta = (
                    <div className="grid grid-cols-2 mx-4">
                    
                    <input placeholder="MRR -" name="chang_interest" onChange={(e) => setchang_interest(e.target.value)} value={datachang_interest} className="text-center mr-2 mb-2" type="text" />
                    <input placeholder="ปีที่ 2" disabled  className="bg-white text-center mb-2 text-black"  type="text" />
                    
                    
                    <input className="text-center mr-2 mb-2" name="chang_interest2" onChange={(e) => setchang_interest2(e.target.value)} value={datachang_interest2} placeholder="MRR -"  type="text" />
                    <input className="bg-white text-center mb-2" disabled placeholder="ปีที่ 3" type="text" />
                    
                    </div>
    ) 
  }
  else if (dataY == "2"){
    conta = (
        <div className="grid grid-cols-2 mx-4">
        <input placeholder="MRR -" onChange={(e) => setchang_interest(e.target.value)}  name="chang_interest" value={datachang_interest} className="text-center mr-2 mb-2" type="text" />
        <input placeholder="ปีที่ 2" disabled  className="bg-white text-center mb-2 text-black"  type="text" />
        </div>
    )
  }
  else if (dataY == "3"){
};
    return (
        conta 
    );
  };
    return (
        <form method="post">
        <div className=" flex justify-start max-w-screen-xl mx-auto  ">
        </div>
        <div className="flex justify-center">
        <div className="bg-blue-500 grid grid-flow rounded-xl mx-3">
        <div className="grid grid-rows-1">
            <div className="grid grid-cols-2 mx-4 mt-3">
            <input type="text" onChange={(e) => setinitial_loan(e.target.value)} value={datainitial_loan} name="initial_loan" placeholder="ยอดเงินกู้" className=" text-center mr-2 mb-2"/>
            <input type="text" onChange={(e) => setmonthly_payment(e.target.value)} value={datamonthly_payment} name="monthly_payment" placeholder="ยอดผ่อนต่อเดือน" className="  text-center mb-2"/>
            <select name="bank" id="" onChange={handleSelectChange}  className="text-center mr-2" >
                {dataname.map((item)=>{
                    return <Bank data={item} />
                })}
            </select>
            <input type="text"  name="MRR" onChange={(e) => setSelectedOption(e.target.value)}  className="text-center" placeholder="MRR" value={selectedOption} />
            </div>
            <h1 className="text-center">วันที่</h1>
            <h1 className="text-center text-white ">{dataDate}</h1>
            <div className="grid grid-cols-2 mx-4 mb-1 ">
                <input className="mr-2 mb-2 text-center" name="fixed_interest" value={datafixed_interest} onChange={(e) => setfixed_interest(e.target.value)} placeholder="อัตราดอกเบี้ย" type="text"  id="" />
                <select onChange={handleSelectChangeY}  className="mb-2 text-center" name="fixed_year" id="">
                    <option value="1">คงที่ปีที่1</option>
                    <option value="2">ปีที่2</option>
                    <option value="3">ปีที่3</option>
                </select>
               
                
            </div>  
                   
                    {checkY(dataY)}
                    <div className="grid grid-cols-2 mx-4 mt-1">
                    <input className="text-center mr-2" onChange={(e) => setstart_month(e.target.value)} name="start_month" value={datastart_month}  placeholder="เดือนที่เริ่ม" type="text" />
                    <input className="text-center" onChange={(e) => setstart_year(e.target.value)} name="start_year" value={datasstart_year} placeholder="ปีเริ่ม" type="text" />
                    </div>
                    
                    
            
            
        </div>
        
        <div className="grid grid-cols-1 mx-5  mb-3   ">
                <Showdata data={datarespone} value={databank} />
                <button type="text" class=" mt-3 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">รายละเอีด</button>
            </div>
        
        </div>
        
        </div>
        
        </form>
    );
};
export default Frompots2