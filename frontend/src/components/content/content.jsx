import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./content.css"
import { faAngleDown } from "@fortawesome/free-solid-svg-icons"
import Imagelogo from "../../../public/image/—Pngtree—balance scales or of justice_8539698.png"
function Content(props){
    console.log(props);
    return (
        <section className="flex flex-col bg-background-image bg-cover min-h-svh snap-start ">
            <div>
            <div className="flex  max-w-screen-xl mx-auto justify-between flex-wrap ">
            <div className="mt-24">
            <span className="text-[80px] text-black font-bold font-sans protest-riot-regular ">Our Future <br />Home  </span><br />
            <p className="text-orange-600  text-lg">In order to have a home,a fmaily, <br/>
            Financial security, and to ac achieve <br/>
            one's dreams</p>
            </div>
            <div className="mt-10 rice-dumpling rounded-lg  ">
                <img src={Imagelogo} alt="" className="w-[400px] ml-24 mt-10"/>
            </div>
            </div>
            </div>
            <div className="flex justify-center mt-52"><a href="#calculator"><button type="button" class="text-white animate-bounce w-48 font-sans text-[20px] bg-gray-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none  "><FontAwesomeIcon icon={faAngleDown} size="2xl"/></button></a></div>
            
           
        </section>
    )
}
export default Content