import { useState } from "react";
import { FaTrash } from "react-icons/fa";



const Item = ({ text, bgColor, icon, deleteOnClick, onClick, isDone}) => {
	const [isHover, setIsHover] = useState(false);


	return (
		<div
			className={`relative w-full h-12 text-slate-800 text-2xl font-mono cursor-pointer rounded-xl flex justify-center items-center select-none transition-all hover:opacity-95 hover:scale-[98.5%] active:scale-x-[97%] active:opacity-80 ${isDone ? "bg-gray-400" : ""}`}
			style={!isDone ? {backgroundColor: bgColor} : {}}
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			onClick={onClick}
		>
			{
				isDone &&
					<span className="absolute left-5">✅</span>
			}
			<p>{text}<span className="px-5">{icon}</span></p>
			{
				isHover &&
					<div
						className="absolute top-[50%] right-5 text-3	xl translate-x-[-50%] translate-y-[-50%] hover:text-rose-500 hover:scale-110 transition-all"
						onClick={(e) => {
							e.stopPropagation();
							deleteOnClick();
						}}
					>
						<FaTrash />
					</div>
			}
		</div>
	)
}

export default Item