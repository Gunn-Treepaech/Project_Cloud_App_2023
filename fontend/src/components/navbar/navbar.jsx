function Navbar(){
 return (
    <div>
<nav class="">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <h1 className="text-[30px] font-bold text-black">HOME</h1>
    <div >
      <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border  rounded-lg  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 ">
        <li>
          <a href="#" class="block py-2 px-3 text-lg text-w ">Home</a>
        </li>
        <li>
          <a href="#" class="block py-2 px-3 text-lg ">About</a>
        </li>
        
      </ul>
    </div>
  </div>
</nav>

    </div>
 );

}
export default Navbar