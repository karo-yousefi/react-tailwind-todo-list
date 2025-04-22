import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";

const Button = ({ text, lightMode, darkMode, onClick }) => {
	
	const theme = useContext(ThemeContext);

	return (
		<button
			className={`text-white px-6 py-2 transition-all rounded-2xl cursor-pointer text-xl font-mono ${theme === "dark" ? darkMode : lightMode}`}
			onClick={onClick}
		>
			{
				text
			}
		</button>
	)
}

export default Button