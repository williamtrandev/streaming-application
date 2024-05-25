import { useEffect, useState } from 'react';
import { ChevronRight, Pencil } from 'lucide-react';
import TagItem from '../../components/studio/TagItem';
import { toast } from 'react-toastify';
const rainbowColors = [
	"#FF0000", "#FF6F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#8B00FF",
	"#FF000A", "#FF7600", "#FFFF0A", "#00FF0A", "#0000FA", "#450082", "#8100FF",
	"#FF0014", "#FF7D00", "#FFFF14", "#00FF14", "#0000F5", "#3E0082"
]


const getRandomRainbowColor = () => {
	const randomIndex = Math.floor(Math.random() * rainbowColors.length);
	return rainbowColors[randomIndex];
}

const StudioPage = () => {
	const [tagValue, setTagValue] = useState("");
	const [tagArr, setTagArr] = useState([]);
	const submitTagHandler = () => {
		if(tagArr.length >= 20) {
			toast.error("You can only add 20 tags");
			return;
		}
		const tagExists = tagArr.some(tagObj => tagObj.tag === tagValue);

		if(!tagExists && tagValue) {
			setTagArr([...tagArr, { tag: tagValue, randomColor: getRandomRainbowColor() }]);
		}
		setTagValue("");
	};
	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			submitTagHandler();
			setTagValue("");
		}
	};
	const deleteTagHandler = (tagToDelete) => {
		console.log("deleteTagHandler");
		console.log(tagToDelete)
		setTagArr(tagArr.filter(tag => tag.tag !== tagToDelete));
	};
	const [image, setImage] = useState('https://wp.technologyreview.com/wp-content/uploads/2023/11/MIT_Universe_fibnal.jpg');
	const onImageChange = (event, setImageFunc) => {
		if (event.target.files && event.target.files[0]) {
			setImageFunc(URL.createObjectURL(event.target.files[0]));
		}
	};
	return (
		<div className="space-y-10">
			<div className="lg:flex gap-4">
				<div className="w-full lg:w-1/2 space-y-5 mb-5 lg:mb-0">
					<div className="space-y-3">
						<h5 className="font-bold text-lg">Preview Image</h5>
						<div className="aspect-video bg-black overflow-hidden rounded-lg relative">
							<img src={image} alt="" className="w-full object-cover" />
							<label className="absolute flex space-x-2 bg-purple-600 text-white right-3 bottom-3 px-2 py-1 rounded-md cursor-pointer hover:bg-purple-700 duration-500 ease-in-out">
								<Pencil width={14} />
								<span>Change image</span>
								<input type="file" className="hidden" accept="image/*"
									onChange={(e) => onImageChange(e, setImage)} />
							</label>
						</div>
						<p>Preview Image has 16:9 aspect ratio</p>
					</div>
					<div className="space-y-3">
						<h5 className="font-bold text-lg">Title</h5>
						<input
							type="text"
							className="w-full px-3 py-2 rounded-lg shadow focus:outline-none 
							focus:border-indigo-500 focus:ring focus:ring-indigo-200 
							transition duration-150 ease-in-out bg-white dark:bg-meta-4"
						/>
					</div>
				</div>
				<div className="w-full lg:w-1/2 space-y-5">
					<div className="space-y-3">
						<h5 className="font-bold text-lg">Description</h5>
						<textarea
							className="w-full px-3 py-2 rounded-lg shadow focus:outline-none 
							focus:border-indigo-500 focus:ring focus:ring-indigo-200 
							transition duration-150 ease-in-out bg-white dark:bg-meta-4"
							rows={4}
						/>
					</div>
					<div className="space-y-3">
						<h5 className="font-bold text-lg">Tags</h5>
						<div className="relative">
							<input
								type="text"
								className="w-full px-4 py-2 rounded-lg shadow focus:outline-none 
								focus:border-indigo-500 focus:ring focus:ring-indigo-200 
								transition duration-150 ease-in-out bg-white dark:bg-meta-4"
								value={tagValue}
								onChange={e => setTagValue(e.target.value)}
								onKeyDown={handleKeyDown}
							/>
							{ tagValue && <ChevronRight 
								className="absolute right-3 top-1/2 -translate-y-1/2 text-xs 
										text-purple-600 cursor-pointer" onClick={submitTagHandler}/>}
						</div>
						{
							tagArr.length > 0 && 
								<div className="w-full">
									<p className="text-end">{tagArr.length}/20</p>
									<div className="flex flex-wrap gap-3">
									{
										tagArr.map((tag, index) => {
											return (
												<TagItem key={index} content={tag.tag} randomColor={tag.randomColor} onDelete={() => deleteTagHandler(tag.tag)} />
											)
										})
									}		
									</div>
								</div>
						}
					</div>
					<div className="space-y-3">
						<h5 className="font-bold text-lg">Rerun</h5>
						<div className="flex space-x-5">
							<input type="checkbox" />
							<span className="text-base">Let viewers know your stream was previously recorded. Failure to label Reruns leads to viewer confusion which damages trust.</span>
						</div>
					</div>
				</div>
			</div>
			<div className="w-full flex justify-end	space-x-2 items-center">
				<button 
					className="text-white bg-purple-700 
						hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-lg 
						px-4 py-1 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none
						dark:focus:ring-purple-800">Save
				</button>
			</div>
		</div>
	);
}

export default StudioPage;