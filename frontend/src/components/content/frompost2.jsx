import { faPlug, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Bank from "./bank";
import { useContext , useState} from "react";
import DataContext from "../../data/DataContext";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import Showdata from "./showdata";
import Addcomponent from "./addcomponent";
import Frompsot from "./frompots";
import Showlist2 from "./showlistdata2";
function Frompots2({ sendDataToParent , value,checkcount,count,payment}){
    const dataname =  useContext(DataContext)
    console.log("ter2",value)
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
        chang_interest: [parseFloat(datachang_interest)||0, parseFloat(datachang_interest2)||0],
        bank: databank
    }
    
    const [modalOpen, setModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    

    



    console.log("respone",datarespone);

    const handleSelectChange = (event) => {
    console.log("art",event)
    const selectedValue = event.target.value;
    console.log("aet2",dataname[2].bank_name)
    setbank(selectedValue) 
      
    let date
    let dataMrr
    if (selectedValue  == "Kbank" ){
        date = dataname[0].update_MRR
        dataMrr = dataname[0].MRR
        setDate(date)
        setSelectedOption(dataMrr)
        console.log("11",date);

    }
    else if(selectedValue == "KTB"){
        date = dataname[1].update_MRR
        dataMrr = dataname[1].MRR
        setDate(date)
        setSelectedOption(dataMrr)
        console.log("12",date);


    }
    else if (selectedValue ==  "SCB" ){
        date = dataname[2].update_MRR
        dataMrr = dataname[2].MRR
        setDate(date)
        setSelectedOption(dataMrr)
        console.log("13",date);


    } else if (selectedValue == "UOB" ){
        date = dataname[3].update_MRR
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
  const [dataCount , setdataCount] = useState(0);
  const check2 = (e) =>{
    setdataCount(count)
    console.log("9999",count);
    console.log("10000",dataCount);
    e.preventDefault();
    
    setdataCount(count - 1)

    checkcount(count - 1)


  }
  
  const checkY = (dataY)  => {
    console.log("earn",dataY);
   let conta 
   if(dataY == "1"){
    conta = (
      <div className="grid grid-cols-2 mx-4">
      <div className="mr-3">
      <input placeholder="MRR -" name="chang_interest" onChange={(e) => setchang_interest(e.target.value)} value={datachang_interest} className="text-center mr-2 mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 " type="text" />
      </div>
    <div>
    <input value="ปีที่ 2" disabled  className="bg-white text-center mb-2 text-black  text-bold border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 "  type="text" />
    </div>
    <div className="mr-3">
    <input className="text-center mr-2 mb-2 bg-white    border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1" name="chang_interest2" onChange={(e) => setchang_interest2(e.target.value)} value={datachang_interest2} placeholder="MRR -"  type="text" />
    
    </div>
    <div>
    <input className="bg-white text-center mb-2   border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 " disabled value="ปีที่ 3" type="text" />
    
    </div>
    </div>
    ) 
  }
  else if (dataY == "2"){
    conta = (
      <div className="grid grid-cols-2 mx-4">
      <div className="mr-3">
    <input placeholder="MRR -" onChange={(e) => setchang_interest2(e.target.value)}  name="chang_interest" value={datachang_interest2} className="text-center mr-2 mb-2 bg-white    border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 " type="text" />
    </div>
    <div>
    <input value="ปีที่ 3" disabled  className="bg-white text-center mb-2 text-black    border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 "  type="text" />
    </div>
    </div>
    )
  }
  else if (dataY == "3"){
};
    return (
        conta 
    );
  };
  const handletii = (data) => {
    // ส่งข้อมูล input ไปที่ ParentComponent เพื่อให้ ParentComponent ทำการ append ใน state array
    sendDataToParent(data)};
    const [popupOpen, setPopupOpen] = useState(false);

    const openPopup = (e) => {
      e.preventDefault();
      document.getElementById('my_modal_3').showModal() 
      setPopupOpen(true)};
    const closePopup = () => setPopupOpen(false);
    const handReset =(e) =>{
      e.preventDefault();
      setstart_month('')
      setSelectedOption('')
      setstart_year('')
      setinitial_loan('')
      setfixed_interest('')
      setfixed_year('1')
      setmonthly_payment('')
      setchang_interest('')
      setchang_interest2('')
      setbank('Kbank')
    }
    return (
        <div>
        <form method="post">
        <div className=" flex justify-start max-w-screen-xl mx-auto  ">
        </div>
        <div className="flex justify-center">
        <div className="bg-blue-300 grid grid-flow rounded-xl mx-3">
        <div className="flex justify-end mr-2"><button onClick={check2}><FontAwesomeIcon icon={faXmark} size="2xl"/></button></div>
        <div className="grid grid-rows-1">
        <div className="grid grid-cols-2 mx-4 mt-3 ">
              <div className="mr-3">
           
            
            <select name="bank" id="" onChange={handleSelectChange}  className="text-center mr-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1  " >
              
                {dataname.map((item)=>{
                    return <Bank data={item} />
                })}
            </select>
            </div>
            <div>
            <input type="text"  name="MRR" onChange={(e) => setSelectedOption(e.target.value)}  className="text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1  " placeholder="MRR" value={selectedOption} />
            </div>
            </div>
            <h1 className="text-center">ข้อมูลอัพเดทวันที่</h1>
            <h1 className="text-center text-white ">{dataDate}</h1>
            <div className="grid grid-cols-2 mx-4 mb-1 ">
              <div className="mr-3">
                <input className="mr-2 mb-2 text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 " name="fixed_interest" value={datafixed_interest} onChange={(e) => setfixed_interest(e.target.value)} placeholder="อัตราดอกเบี้ย" type="text"  id="" />
                
                </div>
    
                <div>
                <select onChange={handleSelectChangeY}  className="mb-2 text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1  " name="fixed_year" id="">
                    <option value="1">คงที่ปีที่ 1</option>
                    <option value="2">ปีที่ 2</option>
                    <option value="3">ปีที่ 3</option>
                </select>
                </div>
                </div>
                   
                    {checkY(dataY)}
                    <div className="grid grid-cols-2 mx-4 mt-1">
                      <div className="mr-4">
                    <input className="text-center mr-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1" onChange={(e) => setstart_month(e.target.value)} name="start_month" value={datastart_month}  placeholder="เดือนที่เริ่ม" type="text" />
                    </div>
                    <div>
                    <input className="text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1" onChange={(e) => setstart_year(e.target.value)} name="start_year" value={datasstart_year} placeholder="ปีเริ่ม" type="text" />
                    </div>
                    </div>
                    
                    
           <div className="grid grid-cols-1 ml-4 mt-4">
           <button onClick={handReset} type="reset" class="mr-4 text-white mr  bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">reset</button>
           </div>
            
        </div>
        
        <div className="grid grid-cols-1 mx-5  mb-3   ">
                <Showdata data={value} value={databank} />
                <button className="btn" onClick={openPopup}>รายละเอียด</button>
            </div>
        
        </div>
        
        </div>
        
        </form>
        <div>{handletii(data)}</div>
        <dialog id="my_modal_3" className="modal">
  <div className="modal-box min-w-fit">
    <form method="dialog">
      {/* if there is a button in form, it will close the modal */}
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <div className="overflow-x-auto">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th className="text-center">ปีที่</th>
        <th className="text-center">เดือน</th>
        <th className="text-center">ยอดเงินทั้งหมด</th>
        <th className="text-center">จ่ายดอกเบี้ย</th>
        <th className="text-center">จ่ายเงินกู้</th>
        <th className="text-center">ยอดคงเหลือ</th>
        
      </tr>
    </thead>
    
    <Showlist2 data={value} payment={payment} value={databank} />
    
  </table>
</div>
  </div>
</dialog>
        </div>
        
    );
};
export default Frompots2