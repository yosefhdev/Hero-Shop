import '../loader.css'

const Loader = () => {
    return (
        <>
            <div className="bg-white overflow-hidden absolute h-screen w-full">

                <h1 className="text-slate-900 absolute font-sans font-semibold text-xs uppercase left-1/2 top-[58%] ml-[-20px]">
                    Redirigiendo
                </h1>

                <div className="absolute top-1/2 ml-[-50px] left-1/2 animation-speeder">
                    <span className="absolute h-[5px] w-[35px] bg-slate-900 top-[-19px] left-[60px] rounded-r-md rounded-bl-md"></span>
                    <div className="relative">
                        <span className="absolute border-t-[6px] border-t-transparent border-r-[100px] border-r-slate-900 border-b-[6px] border-b-transparent">
                            <span className="absolute h-[22px] w-[22px] rounded-full bg-slate-900 right-[-110px] top-[-16px]"></span>
                            <span className="absolute border-t-[0] border-t-transparent border-r-[55px] border-r-slate-900 border-b-[16px] border-b-transparent top-[-16px] right-[-98px]"></span>
                        </span>
                        <div className="absolute h-[12px] w-[20px] bg-slate-900 rounded-t-full transform rotate-[-40deg] right-[-125px] top-[-15px]">
                            <span className="absolute h-[12px] w-[12px] bg-slate-900 right-[4px] top-[7px] transform rotate-[40deg] origin-center rounded-br-sm"></span>
                        </div>
                    </div>
                    <div className="absolute w-[30px] h-[1px] bg-slate-900 top-0 animation-fazer1"></div>
                    <div className="absolute w-[30px] h-[1px] bg-slate-900 top-[3px] animation-fazer2"></div>
                    <div className="absolute w-[30px] h-[1px] bg-slate-900 top-[1px] animation-fazer3"></div>
                    <div className="absolute w-[30px] h-[1px] bg-slate-900 top-[4px] animation-fazer4"></div>
                </div>

                <div className="absolute w-full h-full">
                    <span className="absolute h-[2px] w-1/5 bg-slate-900 top-[20%] animation-lf"></span>
                    <span className="absolute h-[2px] w-1/5 bg-slate-900 top-[40%] animation-lf2"></span>
                    <span className="absolute h-[2px] w-1/5 bg-slate-900 top-[60%] animation-lf3"></span>
                    <span className="absolute h-[2px] w-1/5 bg-slate-900 top-[80%] animation-lf4"></span>
                </div>
            </div>
        </>
    )
}
export default Loader 