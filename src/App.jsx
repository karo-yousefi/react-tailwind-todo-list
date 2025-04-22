import { useState, useEffect, useRef } from "react";
import Button from "./components/Button";
import Item from "./components/Item";
import { ThemeContext } from "./components/context/ThemeContext";
import Header from "./components/Header";



const App = () => {
	const [theme, setTheme] = useState("dark");
	const [itemList, setItemList] = useState([]);
	const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
	const newItemIconRef = useRef(null);
	const newItemInputRef = useRef(null);
	const [isAddActive, setIsAddActive] = useState(true);



	const handleSwitchTheme = () => {
		if (theme === "dark") {
			setTheme("light");
			localStorage.setItem("theme", "light");
		}
		else {
			setTheme("dark");
			localStorage.setItem("theme", "dark");
		}
	}

	const loadData = () => {
		if (localStorage.getItem("theme")) {
			setTheme(localStorage.getItem("theme"));
		}

		if (localStorage.getItem("itemList")) {
			const storedItems = JSON.parse(localStorage.getItem("itemList") || []);
			setItemList(storedItems);

			handleIsActive(storedItems);
		}
	}

	const addNewItem = () => {
		const copyItemlist = [...itemList];

		if (copyItemlist.length === 23) {
			setIsAddActive(false);
		}

		setIsAddMenuOpen(false);

		copyItemlist.push({
			title: newItemInputRef.current.value,
			icon: newItemIconRef.current.value,
			time: null,
			date: null,
			isDone: false,
		});

		setItemList(copyItemlist);
		localStorage.setItem("itemList", JSON.stringify(copyItemlist));

	};

	const closeAddNewMenu = () => {
		if (isAddMenuOpen) {
			setIsAddMenuOpen(false);
		}
	}

	const deleteItem = (id) => {
		const copyItemlist = [...itemList];

		copyItemlist.splice(id, 1);

		setItemList(copyItemlist);
		localStorage.setItem("itemList", JSON.stringify(copyItemlist));

		if (copyItemlist.length < 24) {
			setIsAddActive(true);
		}
	}

	const handleIsActive = (list) => {
		if (list) {
			if (list.length < 24) { // Activating the add button after starting the app
				setIsAddActive(true);
			}
	
			if (list.length > 23) { // Deactivating the add button after starting the app
				setIsAddActive(false);
			}
		}
		else {
			setIsAddActive(true);
		}
	}

	const handleDeleteAll = () => {
		setItemList([]);
		localStorage.setItem("itemList", JSON.stringify([]));
	}


	const generateBackgroundColor = (itemId) => {
		if (itemList.length > 0) {
			const colorHue = Math.floor((360 / itemList.length)) * (itemId + 1);

			if (theme === "dark") {
				const color = `hsl(${colorHue} 70% 66%)`;
				return color;
			}
			else {
				const color = `hsl(${colorHue} 70% 75%)`;
			return color;
			}
		}
	}

	const handleClick = (id) => {
		const copyItemlist = [...itemList];

		copyItemlist[id].isDone = !copyItemlist[id].isDone;
		setItemList(copyItemlist);
		localStorage.setItem("itemList", JSON.stringify(copyItemlist));
	}


	useEffect(() => {
		loadData();
	}, [])


	return (
		<ThemeContext.Provider value={theme}>
			<div
				className={`flex flex-col justify-start items-center min-lg:h-screen transition-all ${theme === "dark" ? "bg-slate-900" : "bg-orange-50"}`}
				onClick={closeAddNewMenu}
			>
				<Header onSwtichThemeClick={handleSwitchTheme}/>
				<div className="flex flex-row max-lg:flex-col-reverse max-lg:justify-end justify-center items-center w-full h-full">
					<div className="h-full max-lg:w-full w-[60%] flex justify-center items-start">
						<div className={`min-h-[85%] max-lg:h-full ${itemList.length > 12 ? "flex flex-col justify-start items-center gap-3 w-[80%] min-lg:grid min-lg:grid-cols-2 min-lg:grid-rows-12 min-lg:grid-flow-col" : "flex flex-col justify-start items-center gap-3 w-[70%] max-lg:min-w-[360px]"}`}>
							{
								itemList.map((item, index) => {
									return (
										<Item
											key={index}
											text={item.title} 
											icon={item.icon}
											bgColor={generateBackgroundColor(index)}
											deleteOnClick={() => deleteItem(index)}
											onClick={() => handleClick(index)}
											isDone={itemList[index].isDone}
										/>
									)
								})
							}
						</div>
					</div>
					<div className="h-full max-lg:h-[30vh] w-[50%] flex flex-col justify-center items-center gap-3 shrink-0">
						<Button
							text="Add Task"
							lightMode={isAddActive ? "bg-sky-500 hover:bg-sky-600" : "bg-gray-400 hover-bg-gray-400"}
							darkMode={isAddActive ? "bg-violet-500 hover:bg-violet-600" : "bg-gray-400 hover-bg-gray-400"}
							onClick={isAddActive ? () => setIsAddMenuOpen(!isAddMenuOpen) : null}
						/>
						<Button
							text="Delete All"
							lightMode="bg-rose-500 hover:bg-rose-600"
							darkMode="bg-pink-800 hover:bg-pink-900"
							onClick={handleDeleteAll}
						/>
					</div>
				</div>
			</div>
			{
				isAddMenuOpen && (
					<div className={`absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl z-10 flex flex-col justify-between items-center gap-6 py-7 w-[450px] h-[250px] ${theme === "dark" ? "bg-slate-600" : "bg-orange-100"}`}>
						<p className={`text-xl font-mono select-none ${theme === "dark" ? "text-white" : "text-slate-800"}`}>Add New Item</p>
						<div className="flex justify-center items-center gap-2 w-[70%]">
							<input
								className={`border-[1px] font-mono rounded-xl w-[90%] h-9 p-1 outline-none text-center ${theme === "dark" ? "border-orange-200 text-orange-100 active:border-orange-400 focus:border-orange-400" : "border-rose-600 text-rose-600 active:border-rose-400 focus:border-rose-400"}`}
								ref={newItemInputRef}
							/>
								<select
									name="new-item-icon"
									className="border-[1px] border-rose-600 rounded-md outline-none h-9 cursor-pointer appearance-none bg-rose-400 px-2"
									ref={newItemIconRef}
								>
									<option className="text-center" value="💪">💪</option>
									<option className="text-center" value="💻">💻</option>
									<option className="text-center" value="🛌">🛌</option>
									<option className="text-center" value="📚">📚</option>
								</select>
						</div>
						<Button
							text="Add"
							lightMode="bg-rose-500 hover:bg-rose-600"
							darkMode="bg-violet-500 hover:bg-violet-600"
							onClick={addNewItem}
						/>
					</div>
				)
			}
		</ThemeContext.Provider>
	)
}

export default App