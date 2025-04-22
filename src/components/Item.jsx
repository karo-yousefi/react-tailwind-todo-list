import { useState } from "react";
import { FaTrash } from "react-icons/fa";



const Item = ({ text, bgColor, icon, deleteOnClick, onClick, isDone}) => {
	const [isHover, setIsHover] = useState(false);


	return (
		<div
			className={`relative w-full h-12 text-slate-800 text-2xl font-mono cursor-pointer rounded-xl flex justify-center items-center select-none transition-all hover:opacity-95 hover:scale-[98.5%] active:scale-x-[97%] active:opacity-80 ${isDone ? "bg-gray-400" : ""} ${isHover ? "bg-rose-500" : null}`}
			style={!isDone && !isHover ? {backgroundColor: bgColor} : {}}
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			onClick={onClick}
		>
			{
				isDone &&
					<span className="absolute left-5">✅</span>
			}
			{
				isHover ?
				 <>						
					<FaTrash 
							className="absolute text-3xl hover:text-slate-900 hover:scale-120 transition-all duration-300"
							onClick={(e) => {
								e.stopPropagation();
								deleteOnClick();
							}}	
						/>
				 </>	:
				 <>
					<p>{text}</p>
					<p className="absolute right-5">{icon}</p>
				</>
			}
		</div>
	)
}

export default Item