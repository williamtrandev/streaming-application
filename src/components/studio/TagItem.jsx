import { X } from "lucide-react";

const TagItem = ({ content, randomColor, onDelete }) => {
	return (
		<div className="flex space-x-1 items-center px-2 rounded-md text-white" 
			style={{ backgroundColor: randomColor }}>
			<span className="text-base">{content}</span>
			<X className="cursor-pointer" width={12} height={12} onClick={onDelete} />
		</div>
	)
}

export default TagItem;