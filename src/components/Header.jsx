import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "./context/ThemeContext";
import Button from "./Button";
import { FaMoon, FaSun } from "react-icons/fa6";


const Header = ({ onSwitchThemeClick, }) => {
	const theme = useContext(ThemeContext);
	const [time, setTime] = useState(null);

	const updateDate = () => {
		const date = new Date().toString();

		const [weekDay, month, day, year, ...rest] = date.split(" ");

		setTime(`${weekDay} ${day} ${month} ${year}`)
	}

	useEffect(() => {
		updateDate();
	}, [])

	return (
		<div className="w-full h-[70px] shrink-0 flex justify-center items-center px-10">
			<div className="flex justify-start items-center w-[50%] h-full">
				<Button
					text={theme === "dark" ? <FaSun /> : <FaMoon />}
					lightMode="bg-rose-500 hover:bg-rose-600"
					darkMode="bg-violet-500 hover:bg-violet-600"
					onClick={onSwitchThemeClick}
				/>
			</div>
			<div className="flex justify-end items-center w-full h-full">
				<p
					className={`text-2xl font-mono select-none transition-all ${theme === "dark" ? "text-white" : "text-slate-800"}`}
				>
					{
						time
					}
				</p>
			</div>
		</div>
	);
};

export default Header;
