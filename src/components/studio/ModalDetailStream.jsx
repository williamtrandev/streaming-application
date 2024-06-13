import { useState, useEffect } from 'react'
import { Modal, DatePicker, Skeleton, Checkbox } from 'antd';
import { useEditStream, useGetDetailStream } from '../../api/studio';
import { ChevronRight, Pencil } from 'lucide-react';
import moment from 'moment';
import TagItem from "./TagItem";
import { toast } from 'react-toastify';
import { blobToBase64 } from '../../utils';

const ModalDetailStream = ({ modalOpen, setModalOpen, streamId, refetch }) => {
	const rainbowColors = [
		"#FF0000", "#FF6F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#8B00FF",
		"#FF000A", "#FF7600", "#FFFF0A", "#00FF0A", "#0000FA", "#450082", "#8100FF",
		"#FF0014", "#FF7D00", "#FFFF14", "#00FF14", "#0000F5", "#3E0082"
	];

	const getRandomRainbowColor = () => {
		const randomIndex = Math.floor(Math.random() * rainbowColors.length);
		return rainbowColors[randomIndex];
	};

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [tagValue, setTagValue] = useState('');
	const [image, setImage] = useState('');
	const [tagArr, setTagArr] = useState([]);
	const [selectedTime, setSelectedTime] = useState(null);
	const [newImage, setNewImage] = useState(null);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [rerun, setRerun] = useState(false); 
	const { data: detailStreamData, isLoading: isDetailLoading } = useGetDetailStream(streamId);
	const { mutate: editStream, isSuccess: isEditSuccess, isError: isEditError, error: editError } = useEditStream();
	useEffect(() => {
		if (detailStreamData) {
			const streamInfo = detailStreamData?.stream;
			console.log(streamInfo);
			setTitle(streamInfo?.title);
			setDescription(streamInfo?.description);
			const tags = streamInfo?.tags;
			const formattedTags = tags.map((tag, index) => ({
				tag: tag,
				randomColor: rainbowColors[index % rainbowColors.length] 
			}));
			setTagArr(formattedTags);
			setImage(streamInfo?.previewImage?.url);
			setSelectedTime(moment(streamInfo?.dateStream));
			setRerun(streamInfo?.rerun);
		}
	}, [detailStreamData]);
	const onImageChange = (event) => {
		if (event.target.files && event.target.files[0]) {
			setImage(URL.createObjectURL(event.target.files[0]));
			setNewImage(URL.createObjectURL(event.target.files[0]));
		}
	};
	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			submitTagHandler();
			setTagValue("");
		}
	};
	const submitTagHandler = () => {
		if (tagArr.length >= 20) {
			toast.error("You can only add 20 tags");
			return;
		}
		const tagExists = tagArr.some(tagObj => tagObj.tag === tagValue);

		if (!tagExists && tagValue) {
			setTagArr([...tagArr, { tag: tagValue, randomColor: getRandomRainbowColor() }]);
		}
		setTagValue("");
	};
	const deleteTagHandler = (tagToDelete) => {
		setTagArr(tagArr.filter(tag => tag.tag !== tagToDelete));
	};
	const handleOk = async () => {
		setConfirmLoading(true);
		const tags = tagArr.map(item => item.tag);
		const previewImage = newImage ? await blobToBase64(newImage) : '';
		const newData = {
			title: title,
			description: description,
			dateStream: selectedTime,
			tags: tags,
			previewImage: previewImage,
			rerun: rerun 
		}
		editStream({ streamId, data: newData });
	}
	useEffect(() => {
		if (isEditError) {
			toast.error("Oops! Something went wrong");
		}
		if (isEditSuccess) {
			toast.success("Update successfully!");
			setConfirmLoading(false);
			setModalOpen(false);
			refetch();
		}
	}, [isEditError, isEditSuccess])
	
	return (
		<Modal
			className='bg-slate-100 dark:bg-slate-600 rounded-lg dark:text-slate-200'
			centered
			open={modalOpen}
			okButtonProps={{ className: 'bg-purple-600 hover:!bg-purple-700' }}
			cancelButtonProps={{ className: 'border-purple-600 hover:!border-purple-700 hover:!text-purple-700' }}
			onOk={handleOk}
			closable={false}
			confirmLoading={confirmLoading}
			onCancel={() => setModalOpen(false)}
		>
			<div className="h-[80vh] overflow-y-auto max-w-full p-2">
				<div className="space-y-10 h-full">
					<div className="w-full space-y-5 mb-5 lg:mb-0">
						<Skeleton loading={isDetailLoading} active>
							<div className="space-y-3">
								<h5 className="font-bold text-lg">Preview Image</h5>
								<div className="aspect-video bg-black overflow-hidden rounded-lg relative flex items-center justify-center">
									<img src={image} alt="" className="w-full object-cover" />
									<label className="absolute flex space-x-2 bg-purple-600 text-white right-3 bottom-3 px-2 py-1 rounded-md cursor-pointer hover:bg-purple-700 duration-500 ease-in-out">
										<Pencil width={14} />
										<span>Change image</span>
										<input type="file" className="hidden" accept="image/*" onChange={onImageChange} />
									</label>
								</div>
								<p>Preview Image has 16:9 aspect ratio</p>
							</div>
							<div className="space-y-3">
								<h5 className="font-bold text-lg">Title</h5>
								<input
									className="w-full px-3 py-2 rounded-lg shadow focus:outline-none 
                                            focus:border-indigo-500 focus:ring focus:ring-indigo-200 
                                            transition duration-150 ease-in-out bg-white dark:bg-meta-4"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
								/>
							</div>
							<div className="space-y-3">
								<h5 className="font-bold text-lg">Description</h5>
								<textarea
									className="w-full px-3 py-2 rounded-lg shadow focus:outline-none 
                                            focus:border-indigo-500 focus:ring focus:ring-indigo-200 
                                            transition duration-150 ease-in-out bg-white dark:bg-meta-4"
									rows={4}
									value={description}
									onChange={(e) => setDescription(e.target.value)}
								/>
							</div>
							<div className="space-y-3">
								<h5 className="font-bold text-lg">Tags</h5>
								<input
									className="w-full px-4 py-2 rounded-lg shadow focus:outline-none 
                                            focus:border-indigo-500 focus:ring focus:ring-indigo-200 
                                            transition duration-150 ease-in-out bg-white dark:bg-meta-4"
									value={tagValue}
									onChange={(e) => setTagValue(e.target.value)}
									onKeyDown={handleKeyDown}
								/>
								{tagArr?.length > 0 && (
									<div className="w-full">
										<p className="text-end">{tagArr.length}/20</p>
										<div className="flex flex-wrap gap-3">
											{tagArr.map((tag, index) => (
												<TagItem key={index} content={tag.tag} randomColor={tag.randomColor} onDelete={() => deleteTagHandler(tag.tag)} />
											))}
										</div>
									</div>
								)}
							</div>
							<div className="space-y-3">
								<h5 className="font-bold text-lg">Time Stream</h5>
								<DatePicker
									className="dark:bg-meta-4 dark:border-none w-full px-4 py-2"
									showTime={{ format: 'HH:mm' }}
									format="YYYY-MM-DD HH:mm"
									value={selectedTime}
									onChange={(value) => setSelectedTime(value)}
									onOk={(value) => setSelectedTime(value)}
								/>
							</div>
							<div className="space-y-3">
								<h5 className="font-bold text-lg">Rerun</h5>
								<div className="flex space-x-5">
									<Checkbox checked={rerun} onChange={(e) => { setRerun(e.target.checked) }} />
									<span className="text-base">Let viewers know your stream was previously recorded. Failure to label Reruns leads to viewer confusion which damages trust.</span>
								</div>
							</div>
						</Skeleton>
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default ModalDetailStream