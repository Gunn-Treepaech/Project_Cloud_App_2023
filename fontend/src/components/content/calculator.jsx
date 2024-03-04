import { faPlug, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Bank from "./bank";
import { useContext , useState} from "react";
import DataContext from "../../data/DataContext";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import Showdata from "./showdata";
import Addcomponent from "./addcomponent";
import Frompots from "./frompots";
import Frompots2 from "./frompost2";
import Frompots3 from "./frompost3";
import Popup from "./popup";
import Showlist from "./showlistdata";
function Calcultor(){
    const dataname =  useContext(DataContext)
    console.log("ter2",dataname)
    const [datastart_month, setstart_month] = useState('');
    const [datasstart_year, setstart_year] = useState('');
    const [datainitial_loan, setinitial_loan] = useState('');
    const [datafixed_interest, setfixed_interest] = useState('');
    const [datafixed_year, setfixed_year] = useState('1');
    const [datamonthly_payment, setmonthly_payment] = useState('');
    const [datachang_interest, setchang_interest] = useState('');
    const [datachang_interest2, setchang_interest2] = useState('');
    const [databank, setbank] = useState('Kbank');
    
    
    


    const [datarespone1, setrespone1] = useState([]);
    const [datarespone2, setrespone2] = useState([]);
    const [datarespone3, setrespone3] = useState([]);

    const [datarespone, setrespone] = useState([]);
   

    const Calcultor = ( datarespone ) => {
    //const firstData = datarespone;
    console.log("2546",databank)
    console.log("2546",datarespone[databank])
    
    
   
    
    }
    let frome1 ={}
    let frome2 ={}
    let frome3 ={}

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
        chang_interest: [parseFloat(datachang_interest)|| 0, parseFloat(datachang_interest2)|| 0],
        bank: databank
    }
    const from1send = (frome1)=>{
        if (
            !isNaN(data.start_month) &&
            !isNaN(data.start_year) &&
            !isNaN(data.initial_loan) &&
            !isNaN(data.fixed_interest) &&
            !isNaN(data.fixed_year) &&
            !isNaN(data.MRR) &&
            !isNaN(data.monthly_payment) &&
            data.bank
          ) {
            try {
                axios.post("http://192.168.31.129:5000/calculate", frome1)
                  .then((respons) => {
                    console.log("tenfrom1", respons);
                    setrespone1(respons);
                  })
                  .catch((error) => {
                    console.error('Error details:', error);
                    // ทำการ handle ข้อผิดพลาดที่เกิดขึ้น
                  });
              } catch (error) {
                console.error('Error details:', error);
              }
          } else {
            // กรอกข้อมูลไม่ครบ, ไม่ทำการ POST และแจ้งเตือนผู้ใช้
           
          }
          console.log("from",datarespone);
       
    }
    const from2send = (frome2)=>{
        if (
            !isNaN(data.start_month) &&
            !isNaN(data.start_year) &&
            !isNaN(data.initial_loan) &&
            !isNaN(data.fixed_interest) &&
            !isNaN(data.fixed_year) &&
            !isNaN(data.MRR) &&
            !isNaN(data.monthly_payment) &&
            data.bank
          ) {
            try {
                axios.post("http://192.168.31.129:5000/calculate", frome2)
                  .then((respons) => {
                    console.log("tenfrom1", respons);
                    setrespone2(respons);
                  })
                  .catch((error) => {
                    console.error('Error details:', error);
                    // ทำการ handle ข้อผิดพลาดที่เกิดขึ้น
                  });
              } catch (error) {
                console.error('Error details:', error);
              }
          } else {
            // กรอกข้อมูลไม่ครบ, ไม่ทำการ POST และแจ้งเตือนผู้ใช้
            
          }
          console.log("from",datarespone);
       
    }
    const from3send = (frome3)=>{
        if (
            !isNaN(data.start_month) &&
            !isNaN(data.start_year) &&
            !isNaN(data.initial_loan) &&
            !isNaN(data.fixed_interest) &&
            !isNaN(data.fixed_year) &&
            !isNaN(data.MRR) &&
            !isNaN(data.monthly_payment) &&
            data.bank
          ) {
            try {
                axios.post("http://192.168.31.129:5000/calculate", frome3)
                  .then((respons) => {
                    console.log("tenfrom1", respons);
                    setrespone3(respons);
                  })
                  .catch((error) => {
                    console.error('Error details:', error);
                    // ทำการ handle ข้อผิดพลาดที่เกิดขึ้น
                  });
              } catch (error) {
                console.error('Error details:', error);
              }
          } else {
            // กรอกข้อมูลไม่ครบ, ไม่ทำการ POST และแจ้งเตือนผู้ใช้
           
          }
          console.log("from",datarespone);
       
    }
    const fromsend = (data)=>{
      console.log("456789",data);
        if (
            !isNaN(data.start_month) &&
            !isNaN(data.start_year) &&
            !isNaN(data.initial_loan) &&
            !isNaN(data.fixed_interest) &&
            !isNaN(data.fixed_year) &&
            !isNaN(data.MRR) &&
            !isNaN(data.monthly_payment) &&
            data.bank
          ) {
            
            try {
                axios.post("http://192.168.31.129:5000/calculate", data)
                  .then((respons) => {
                    console.log("tenfrom1", respons);
                    setrespone(respons);
                  })
                  .catch((error) => {
                    console.error('Error details:', error);
                    // ทำการ handle ข้อผิดพลาดที่เกิดขึ้น
                  });
              } catch (error) {
                console.error('Error details:', error);
              }
              
                
            // กรอกข้อมูลครบถ้วน, ทำการ POST ข้อมูล
            // ส่งคำขอ POST ไปยังเซิร์ฟเวอร์
          } else {
            // กรอกข้อมูลไม่ครบ, ไม่ทำการ POST และแจ้งเตือนผู้ใช้
            
          }
       
    }
    
    const handleSubmit =(e) => {
        
       // let uobData = []
        //let datafull = [data,frome1,frome2,frome3]
        //console.log("xxx",datafull);
        //const people = datafull.filter(data => data.bank);
        //console.log(people);
        e.preventDefault(); 
        console.log(data);
        {fromsend(data)}
        {from1send(frome1)}
        {from2send(frome2)}
        {from3send(frome3)}
        
        //for (let item of people){
        //    console.log("456",item);
        
    
   // console.log("asdasdwd",uobData);
    //setrespone(uobData);
    
    
    

    }
    console.log("4444",datarespone);
    

    



    //console.log("respone",datarespone);

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
    setfixed_year(dataY)
    
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
  let conponentcunt = 0
  const tii = (data1)=>{
    //setrespone(data1)
    conponentcunt = 1
    frome1 = data1
    frome1.initial_loan = parseInt(datainitial_loan);
    frome1.monthly_payment = parseInt(datamonthly_payment);
    console.log("123",data1);
    console.log("what",data1);
    console.log("earn2",frome1);
    
  }
  const tii2 = (data1)=>{
    //setrespone(data1)
    frome2 = data1
    frome2.initial_loan = parseInt(datainitial_loan);
    frome2.monthly_payment = parseInt(datamonthly_payment);
    console.log("124",data1);
    console.log("earn2",frome2);
  }
  const tii3 = (data1)=>{
    //setrespone(data1)
    frome3 = data1
    frome3.initial_loan = parseInt(datainitial_loan);
    frome3.monthly_payment = parseInt(datamonthly_payment);
    console.log("125",data1);
    console.log("earn2",frome3);
  }
  const art =(check1)=>{
      console.log("chexk1",check1);
      setdataCount(check1)
      dataCount 
     
  }
  const art2 =(check2)=>{
    console.log("chexk2",check2);
    setdataCount(check2)
    dataCount 
   
}
const art3 =(check3)=>{
  console.log("chexk3",check3);
  setdataCount(check3)
  dataCount 
 
}
  const [dataCount , setdataCount] = useState(0);
    
    const Addcomponnent2 = (dataCount) =>{
        let add 
        if (dataCount == 1){
            add = (<div className="flex"><Frompots sendDataToParent={tii} checkcount={art} count={dataCount} payment={datamonthly_payment} value={datarespone1} />
            <div className="bg-blue-500 h-96 w-80  ml-11 rounded-xl grid grid-cols-1 place-content-center  ">
            <div className="flex justify-center ">
            <button onClick={() => setdataCount(dataCount + 1)}><FontAwesomeIcon icon={faPlus} size="2xl"/></button>
            </div>
        </div></div>

            )
        }
        else if (dataCount == 2){
            add = (<div className="flex"><Frompots sendDataToParent={tii} value={datarespone1} payment={datamonthly_payment} checkcount={art2} count={dataCount}/> <Frompots2 sendDataToParent={tii2} value={datarespone2} payment={datamonthly_payment} checkcount={art2} count={dataCount}/>
            <div className="bg-blue-500 h-96 w-80  ml-11 rounded-xl grid grid-cols-1 place-content-center  ">
            <div className="flex justify-center ">
            <button onClick={() => setdataCount(dataCount + 1)}><FontAwesomeIcon icon={faPlus} size="2xl"/></button>
            </div>
        </div></div>
            )
        }
        else if (dataCount == 3){
            add = (<div className="flex"><Frompots sendDataToParent={tii} value={datarespone1} checkcount={art3} payment={datamonthly_payment} count={dataCount}/> <Frompots2 sendDataToParent={tii3} value={datarespone2} checkcount={art3} payment={datamonthly_payment} count={dataCount}/> <Frompots3 sendDataToParent={tii3} value={datarespone3} payment={datamonthly_payment} checkcount={art3} count={dataCount}/>
            </div>
            )
        }
        else {
            add = (
                <div className="bg-blue-500 h-96 w-80  ml-11 rounded-xl grid grid-cols-1 place-content-center  ">
                <div className="flex justify-center ">
                <button onClick={() => setdataCount(dataCount + 1)}><FontAwesomeIcon icon={faPlus} size="2xl"/></button>
                </div>
            </div>
            )
        }
        console.log("444",dataCount);
        return(
             add
        )
    }
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
  const [popupOpen, setPopupOpen] = useState(false);

  const openPopup = (e) => {
    e.preventDefault();
    console.log("rrr",e);
    
    
    document.getElementById('my_modal_1').showModal() 
    
    
    setPopupOpen(true)};
  const closePopup = () => setPopupOpen(false);

    return (
       
        <section id="calculator" data-theme="cupcake" className="flex justify-center min-h-svh  pt-16 snap-end "> 
        <form method="post">
        
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
                    
                    
            <div className="grid grid-cols-2 mt-3 ">
                <button type="submit" onClick={handleSubmit} class="ml-4   text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">คำนวน</button>
                <button type="reset" onClick={handReset} class="mr-4 text-white mr  bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">reset</button>
            </div>
            
        </div>
        
        <div className="grid grid-cols-1 mx-5  mb-3   ">
                <Showdata data={datarespone} value={databank} />
                <button className="btn" onClick={openPopup}>รายละเอียด</button>
            </div>
        
        </div>
        </div>
        
        
        </form>
        {Addcomponnent2(dataCount)}
        <dialog id="my_modal_1" className="modal">
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
        <th>ปีที่</th>
        <th>เดือน</th>
        <th>ยอดเงินจ่ายต่อเดือน</th>
        <th>จ่ายดอกเบี้ย</th>
        <th>จ่ายเงินกู้</th>
        <th>ยอดที่จ่ายเกิน</th>
        <th>ยอดคงเหลือ</th>
        
      </tr>
    </thead>
    
    <Showlist data={datarespone} payment={datamonthly_payment} value={databank}/>
    
  </table>
</div>
  </div>
</dialog>
        </section>
        
       

        




        

    );
}
export default Calcultor