import { faPlug, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react"; 
import Frompots from "./frompots";
function Addcomponent({ onSubmit, formData }){
    console.log("666",formData);
    console.log("777",onSubmit);
    const [dataCount , setdataCount] = useState(0);
    
    const Addcomponnent2 = () =>{
        let add 
        if (dataCount == 1){
            add = (<div className="flex"><Frompots />
            <div className="bg-blue-500 h-96 w-80  ml-11 rounded-xl grid grid-cols-1 place-content-center  ">
            <div className="flex justify-center ">
            <button onClick={() => setdataCount(dataCount + 1)}><FontAwesomeIcon icon={faPlus} size="2xl"/></button>
            </div>
        </div></div>

            )
        }
        else if (dataCount == 2){
            add = (<div className="flex"><Frompots/> <Frompots/>
            <div className="bg-blue-500 h-96 w-80  ml-11 rounded-xl grid grid-cols-1 place-content-center  ">
            <div className="flex justify-center ">
            <button onClick={() => setdataCount(dataCount + 1)}><FontAwesomeIcon icon={faPlus} size="2xl"/></button>
            </div>
        </div></div>
            )
        }
        else if (dataCount == 3){
            add = (<div className="flex"><Frompots/> <Frompots/> <Frompots/>
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
    return (
        <Addcomponnent2/>
    )
}

export default Addcomponent