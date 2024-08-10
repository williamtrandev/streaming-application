import { X } from "lucide-react";

const TagItem = ({ content, randomColor, onDelete }) => {
	const isDarkMode = document.body.classList.contains('dark');
	const backgroundColor = isDarkMode
		? `${randomColor}33` 
		: `${randomColor}55`; 

	const textColor = isDarkMode
		? randomColor
		: `${randomColor}CC`; 

	return (
		<div className="flex space-x-1 items-center px-2 rounded-md text-white font-semibold" 
			style={{
				backgroundColor: backgroundColor, 
				color: textColor, 
				borderColor: randomColor,
				borderWidth: '1px',
				borderStyle: 'solid',
			}}>
			<span className="text-base">{content}</span>
			<X className="cursor-pointer" width={12} height={12} onClick={onDelete} />
		</div>
	)
}

export default TagItem;