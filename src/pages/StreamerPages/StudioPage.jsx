import { useEffect, useState } from 'react';
import { ChevronRight, Pencil } from 'lucide-react';
import TagItem from '../../components/studio/TagItem';
import { toast } from 'react-toastify';
import { useGetStreamToken, useSaveNotification, useSaveStream } from '../../api/studio';
import { useAuth } from '../../contexts/AuthContext';
import { useSelector } from 'react-redux';
import { selectSocket } from '../../redux/slices/socketSlice';
import ChatBox from '../../components/detailStream/ChatBox';
import VideoPreview from '../../components/studio/VideoPreview';

const rainbowColors = [
	"#FF0000", "#FF6F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#8B00FF",
	"#FF000A", "#FF7600", "#FFFF0A", "#00FF0A", "#0000FA", "#450082", "#8100FF",
	"#FF0014", "#FF7D00", "#FFFF14", "#00FF14", "#0000F5", "#3E0082"
];

const getRandomRainbowColor = () => {
	const randomIndex = Math.floor(Math.random() * rainbowColors.length);
	return rainbowColors[randomIndex];
};


const StudioPage = () => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [tagValue, setTagValue] = useState("");
	const [tagArr, setTagArr] = useState([]);
	const [image, setImage] = useState('https://wp.technologyreview.com/wp-content/uploads/2023/11/MIT_Universe_fibnal.jpg');
	const [modalOpen, setModalOpen] = useState(false);
	const [streamId, setStreamId] = useState(null);
	const [startWithCam, setStartWithCam] = useState(false);
	const [streamToken, setStreamToken] = useState(null);
	const { mutate: saveStream, isSuccess: isSuccessStream, data: streamData } = useSaveStream();
	const { mutate: saveNotification, isError: isErrorNotification, isSuccess: isSuccessNotification, data: notificationData } = useSaveNotification();
	const { mutate: getStreamToken, isError: isErrorGetToken, isSuccess: isSuccessGetToken, data: tokenData } = useGetStreamToken();
	const { auth } = useAuth();
	const userId = auth?.user?._id;
	const socket = useSelector(selectSocket);
	const [disableStreamCam, setDisableStreamCam] = useState(true);
	const [disableStreamOBS, setDisableStreamOBS] = useState(true);
	const openModal = () => {
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
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

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			submitTagHandler();
			setTagValue("");
		}
	};

	const deleteTagHandler = (tagToDelete) => {
		setTagArr(tagArr.filter(tag => tag.tag !== tagToDelete));
	};

	const onImageChange = (event) => {
		if (event.target.files && event.target.files[0]) {
			setImage(URL.createObjectURL(event.target.files[0]));
		}
	};

	const handleSaveStream = () => {
		setModalOpen(false);
		const tags = tagArr.map(item => item.tag);

		const data = {
			userId: userId,
			title: title,
			description: description,
			dateStream: new Date().toISOString(),
			tags: tags
		}
		saveStream(data);
		saveNotification({
			userId: userId,
			content: `${auth?.user?.fullname} is streaming: ${title}`
		});
	}

	useEffect(() => {
		if (socket && isSuccessStream) {
			setDisableStreamCam(false);
			setDisableStreamOBS(false);
			setStreamId(streamData?.stream?._id);
			const data = {
				stream: streamData?.stream, 
				userId: userId
			}
			socket.emit('sendNotification', data);
		}
	}, [socket, isSuccessStream]);

	const handleStartWithCam = () => {
		if(streamId && userId) {
			setStartWithCam(true); 
			getStreamToken({ streamId: streamId, userId: userId });
		}
	}
	useEffect(() => {
		if(tokenData) {
			setStreamToken(tokenData.token);
		}
	}, [isSuccessGetToken])
	return (
		<>
			<div className="h-[calc(100vh-7rem)] md:h-[calc(100vh-8rem)] 2xl:h-[calc(100vh-10rem)]">
				<div className="md:grid md:grid-cols-3 md:gap-5 h-full w-full space-y-3 md:space-y-0">
					<div className="md:col-span-2 w-full h-full md:overflow-auto flex flex-col items-center justify-center gap-5">
						<VideoPreview startWithCam={startWithCam} token={streamToken} />
						<div className="flex gap-3 flex-wrap">
							<button className="rounded-lg bg-white dark:bg-meta-4 hover:!bg-purple-700 hover:!text-white p-3 shadow-md" 
								onClick={() => setModalOpen(true)}>
									Settings
							</button>
							<button className={`rounded-lg bg-white dark:bg-meta-4 p-3 shadow-md 
									${disableStreamCam ? 'cursor-not-allowed opacity-60 pointer-events-none' : 'hover:!bg-purple-700 hover:!text-white'}
								`}
								disabled={disableStreamCam}
								onClick={handleStartWithCam}>
									Start With Camera
							</button>
							<button className={`rounded-lg bg-white dark:bg-meta-4 p-3 shadow-md 
									${disableStreamOBS ? 'cursor-not-allowed opacity-60 pointer-events-none' : 'hover:!bg-purple-700 hover:!text-white'}
								`}
								disabled={disableStreamOBS}
								onClick={() => {}}>
									Start With OBS
							</button>
						</div>
					</div>
					<div className="h-full w-full overflow-auto">
						<ChatBox />
					</div>
				</div>
			</div>
			{
				modalOpen &&
				<div className="fixed inset-0 flex items-center justify-center z-9999">
					<div className="absolute inset-0 bg-black opacity-50"></div>
					<div className="bg-gray-100 dark:bg-gray-600 rounded-lg shadow-lg p-5 z-10 max-w-4xl w-full h-80vh overflow-y-auto relative">
						<button
							className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
							onClick={closeModal}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
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
												<input type="file" className="hidden" accept="image/*" onChange={onImageChange} />
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
											value={title}
											onChange={(e) => setTitle(e.target.value)}
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
											value={description}
											onChange={(e) => setDescription(e.target.value)}
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
											{tagValue && <ChevronRight
												className="absolute right-3 top-1/2 -translate-y-1/2 text-xs 
                                                text-purple-600 cursor-pointer" onClick={submitTagHandler} />}
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
						</div>
						<div className="w-full flex justify-end space-x-2 items-center">
							<button
								className="text-white bg-purple-700 
                                hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-lg 
                                px-4 py-1 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none
                                dark:focus:ring-purple-800"
								onClick={handleSaveStream}
							>
								Save
							</button>
						</div>
					</div>
				</div>
			}
		</>
	);
};

export default StudioPage;
