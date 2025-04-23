import { useState, useEffect, useRef } from "react";
import { ThemeContext } from "./components/context/ThemeContext";
import Button from "./components/Button";
import Item from "./components/Item";
import Header from "./components/Header";
import { icons } from "./components/data/data";


const App = () => {

	// Variables / States
	const [theme, setTheme] = useState("dark");
	const [itemList, setItemList] = useState([]); // The list of tasks
	const [isAddMenuOpen, setIsAddMenuOpen] = useState(false); // true: the add menu is open / false: the add menu is closed
	// const newItemIconRef = useRef(null);
	// const newItemInputRef = useRef(null);
	const [newItemInputRef, setNewItemInputRef] = useState(null);
	const [newItemIconRef, setNewItemIconRef] = useState(icons[0].icon);
	const [isAddActive, setIsAddActive] = useState(true); // true: less than 24 items, user is allowed to add more / false: 24 items already added


	// Functions
	const saveInLocalStorage = (key, value) => {
		localStorage.setItem(key, JSON.stringify(value));
	}

	const loadFromLocalStorage = (key) => {
		return JSON.parse(localStorage.getItem(key));
	}

	const handleSwitchTheme = () => {
		if (theme === "dark") {
			setTheme("light");
			saveInLocalStorage("theme", "light");
		}
		else {
			setTheme("dark");
			saveInLocalStorage("theme", "dark");
		}
	}

	const loadData = () => {
		if (localStorage.getItem("theme")) {
			setTheme(localStorage.getItem("theme"));
		}

		if (localStorage.getItem("itemList")) {
			const storedItems = loadFromLocalStorage("itemList") || [];
			setItemList(storedItems);

			handleIsActive(storedItems);
		}
	}

	const addNewItem = () => {
		const copyItemList = [...itemList];

		if (copyItemList.length === 23) {
			setIsAddActive(false);
		}

		setIsAddMenuOpen(false);

		copyItemList.push({
			title: newItemInputRef,
			icon: newItemIconRef,
			time: null, // will be added later
			date: null, // will be added later
			isDone: false,
		});

		setItemList(copyItemList);
		saveInLocalStorage("itemList", copyItemList);
		setNewItemIconRef(icons[0].icon); // Resetting the Icon selection to the first option after adding the new task (aka closing the menu)
	};

	const closeAddNewMenu = () => {
		if (isAddMenuOpen) {
			setIsAddMenuOpen(false);
			setNewItemIconRef(icons[0].icon);  // Resetting the Icon selection to the first option after closing the add new menu
		}
	}

	const deleteItem = (id) => {
		const copyItemList = [...itemList];

		copyItemList.splice(id, 1);

		setItemList(copyItemList);
		saveInLocalStorage("itemList", copyItemList);

		if (copyItemList.length < 24) {
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
	}

	const handleDeleteAll = () => {
		setItemList([]);
		saveInLocalStorage("itemList", []);
	}

	const generateBackgroundColor = (itemId) => {
		if (itemList.length > 0) {
			const colorHue = Math.floor((360 / itemList.length)) * (itemId + 1);

			if (theme === "dark") { // Color for the items (dark mode)
				const color = `hsl(${colorHue} 70% 66%)`;
				return color;
			}
			else { // Theme for the items (light mode)
				const color = `hsl(${colorHue} 70% 75%)`;
			return color;
			}
		}
	}
 
	const handleClick = (id) => { // click: finishing the task
		const copyItemList = [...itemList];

		copyItemList[id].isDone = !copyItemList[id].isDone;
		setItemList(copyItemList);
		saveInLocalStorage("itemList", copyItemList);
	}


	useEffect(() => {
		loadData();
	}, [])


	return (
		<ThemeContext.Provider value={theme}>
			<div
				className={`flex flex-col justify-start items-center h-full min-lg:h-screen transition-all ${theme === "dark" ? "bg-slate-900" : "bg-orange-50"}`}
				onClick={closeAddNewMenu}
			>
				<Header onSwitchThemeClick={handleSwitchTheme}/>
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
								onChange={(e) => setNewItemInputRef(e.target.value)}
							/>
								<select
									name="new-item-icon"
									className="border-[1px] border-rose-600 rounded-md outline-none h-9 cursor-pointer appearance-none bg-rose-400 px-2"
									onChange={(e) => setNewItemIconRef(e.target.value)}
								>
									{
										icons.map((icon) => {
											return (
												<option
													key={icon.icon}
													className="text-center"
													value={icon.label}
													
												>
													{icon.icon}
												</option>
											)
										})
									}
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