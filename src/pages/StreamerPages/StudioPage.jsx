import { useEffect, useState, useRef } from 'react';
import { Bolt, ChevronRight, CircleX, Pencil, Podcast, X } from 'lucide-react';
import TagItem from '../../components/studio/TagItem';
import { toast } from 'react-toastify';
import { useGetAllComingStreams, useSaveNotification, useSaveStream } from '../../api/studio';
import { useAuth } from '../../contexts/AuthContext';
import { useSelector } from 'react-redux';
import { selectSocket } from '../../redux/slices/socketSlice';
import { Button, DatePicker, Modal, Tooltip } from 'antd';
import moment from 'moment';
import { Skeleton, Checkbox } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { blobToBase64 } from '../../utils';
import ModalDetailStream from '../../components/studio/ModalDetailStream';
import ModalDeleteStream from '../../components/studio/ModalDeleteStream';
import { appName } from '../../constants';


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
	const [rerun, setRerun] = useState(false); 
	const [modalOpen, setModalOpen] = useState(false);
	const [streamId, setStreamId] = useState(null);
	const { mutate: saveStream, isSuccess: isSuccessStream, data: streamData, isError: isErrorStream, error: errorStream } = useSaveStream();
	const { mutate: saveNotification, isError: isErrorNotification, isSuccess: isSuccessNotification, data: notificationData } = useSaveNotification();
	const { auth } = useAuth();
	const userId = auth?.user?._id;
	const socket = useSelector(selectSocket);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [selectedTime, setSelectedTime] = useState(moment());
	const [modalDeleteOpen, setModalDeleteOpen] = useState(false); 
	const { data: comingStreamsData, refetch: comingStreamsRefetch } = useGetAllComingStreams(userId);
	const [modalEditOpen, setModalEditOpen] = useState(false);
	const [streamIdClicked, setStreamIdClicked] = useState(null);
	const [streamTitleClicked, setStreamTitleClicked] = useState('');
	const [modalChooseStreamSourceOpen, setModalChooseStreamSourceOpen] = useState(false);
	const navigate = useNavigate();
	console.log(userId)
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

	const handleOk = async () => {
		setConfirmLoading(true);
		const tags = tagArr.map(item => item.tag);
		const previewImage = await blobToBase64(image);
		const data = {
			userId: userId,
			title: title,
			description: description,
			dateStream: selectedTime.toDate().toISOString(),
			tags: tags,
			previewImage: previewImage,
			rerun: rerun
		}
		saveStream(data);
	};
	const handleClickDetail = (streamId) => {
		console.log("CLICKED", streamId)
		setModalEditOpen(true);
		setStreamIdClicked(streamId);
	}
	const handleClickDelete = (streamId, title) => {
		console.log("CLICKED", streamId)
		setModalDeleteOpen(true);
		setStreamIdClicked(streamId);
		setStreamTitleClicked(title);
	}
	const handleClickGoToStreamPage = (streamId, title) => {
		setModalChooseStreamSourceOpen(true);
		setStreamIdClicked(streamId);
		setStreamTitleClicked(title);
	}
	useEffect(() => {
		if (socket && isSuccessStream) {
			setStreamId(streamData?.stream?._id);
			setConfirmLoading(false);
			setModalOpen(false);
			const data = {
				stream: streamData?.stream,
				userId: userId
			}
			saveNotification({
				userId: userId,
				content: `${auth?.user?.fullname} is streaming: ${title}`
			});
			socket.emit('sendNotification', data);

			streamData?.stream?._id && navigate(`/studio/stream/${streamData?.stream?._id}`);
		}
	}, [socket, isSuccessStream]);

	useEffect(() => {
		if (isErrorStream) {
			let errorMessage = 'Ops! Something went wrong';
			const statusCode = errorStream?.response?.status;
			if(statusCode === 400) {
				errorMessage = 'Please provide all information'
			} 
			toast.error(errorMessage);
			setConfirmLoading(false);
		}
	}, [isErrorStream]);

	useEffect(() => {
        document.title = `Studio - ${appName}`;
    }, []);

	return (
		<div className="space-y-5">
			<div className="flex gap-3 flex-wrap">
				<button className="rounded-lg bg-white dark:bg-meta-4 p-3 shadow-md hover:!bg-purple-700 hover:!text-white"
					onClick={() => {
						sessionStorage.setItem("streamWithObs", false);
						setModalOpen(true);
					}}>
					Start With Camera
				</button>
				<button className="rounded-lg bg-white dark:bg-meta-4 p-3 shadow-md hover:!bg-purple-700 hover:!text-white"
					onClick={() => {
						sessionStorage.setItem("streamWithObs", true);
						setModalOpen(true);
					}}>
					Start With OBS
				</button>
			</div>
			<div className="w-full bg-white dark:bg-meta-4 overflow-hidden rounded-lg shadow-md">
				<div className="w-full overflow-x-auto">
					<table className="w-full whitespace-no-wrap">
						<thead>
							<tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
								<th className="px-4 py-3">title</th>
								<th className="px-4 py-3">Date stream</th>
								<th className="px-4 py-3">Action</th>
							</tr>
						</thead>
						{!comingStreamsData ?
							<tbody className="divide-y dark:divide-gray-700 dark:bg-gray-800">
								{[...Array(5)].map((_, index) => (
									<tr key={index} className="text-gray-700 dark:text-gray-400">
										<td className="px-4 py-3">
											<div className="flex items-center text-sm">
												<Skeleton.Input active size="small" style={{ width: 100 }} />
											</div>
										</td>
										<td className="px-4 py-3 text-xs">
											<Skeleton.Input active size="small" style={{ width: 80 }} />
										</td>
										<td className="px-4 py-3 text-sm">
											<Skeleton.Input active size="small" style={{ width: 100 }} />
										</td>
										<td className="px-4 py-3 text-sm">
											<div className="flex space-x-2">
												<Skeleton.Button active size="small" shape="circle" style={{ width: 32, height: 32 }} />
											</div>
										</td>
									</tr>
								))}
							</tbody>
							:
							<tbody className="divide-y dark:divide-gray-700 dark:bg-gray-800">
								{comingStreamsData?.data.map((stream, index) => {
									return (
										<tr key={index} className="text-gray-700 dark:text-gray-400">
											<td className="px-4 py-3 text-xs">
												<span className="px-2 py-1 font-semibold leading-tight text-blue-700 bg-blue-100 rounded-full dark:text-blue-200 dark:bg-blue-600">
													{stream?.title.length > 100 ? stream.title.substring(0, 100) + '...' : stream.title}
												</span>
											</td>
											<td className="px-4 py-3 text-sm">
												{stream?.dateStream && new Date(stream?.dateStream).toLocaleString()}
											</td>
											<td className="px-4 py-3 text-sm">
												<div className="flex space-x-2">
													<div className="p-2 w-8 h-8 flex items-center justify-center rounded-full font-semibold text-orange-700 bg-orange-100 dark:text-white dark:bg-orange-600 cursor-pointer" onClick={() => handleClickDetail(stream._id)}>
														<Tooltip title="Edit" color={'orange'}>
															<Bolt />
														</Tooltip>
													</div>
													<div className="p-2 w-8 h-8 flex items-center justify-center text-center rounded-full font-semibold text-purple-700 bg-purple-100 dark:text-white dark:bg-purple-600 cursor-pointer" onClick={() => handleClickDelete(stream._id, stream.title)}>
														<Tooltip title="Delete" color={'purple'}>
															<CircleX />
														</Tooltip>
													</div>
													<div className="p-2 w-8 h-8 flex items-center justify-center text-center rounded-full font-semibold text-green-700 bg-green-100 dark:text-white dark:bg-green-600 cursor-pointer" onClick={() => handleClickGoToStreamPage(stream._id, stream.title)}>
														<Tooltip title="Go to stream page" color={'green'}>
															<Podcast />
														</Tooltip>
													</div>
												</div>
											</td>
										</tr>
									)
								})}
							</tbody>
						}

					</table>
				</div>
				
			</div>
			<ModalDeleteStream open={modalDeleteOpen} setOpen={setModalDeleteOpen} title={streamTitleClicked} streamId={streamIdClicked} refetch={comingStreamsRefetch}/>
			<ModalDetailStream modalOpen={modalEditOpen} setModalOpen={setModalEditOpen} streamId={streamIdClicked} refetch={comingStreamsRefetch}/>
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
				<div className="h-[80vh] overflow-y-auto max-w-full p-2" >
					<div className="space-y-10 h-full">
						<div className="w-full space-y-5 mb-5 lg:mb-0">
							<div className="space-y-3">
								<h5 className="font-bold text-lg">Preview Image</h5>
								<div className="aspect-video bg-black overflow-hidden rounded-lg relative">
									<img src={image} alt="" className="w-full object-cover aspect-video" />
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
						</div>
					</div>
				</div>
			</Modal>
			<Modal 
				className='bg-slate-100 dark:bg-slate-700 rounded-lg dark:text-slate-200'
				centered
				open={modalChooseStreamSourceOpen}
				closeIcon={<X className="text-gray-600 dark:text-gray-300" />}
				onCancel={() => setModalChooseStreamSourceOpen(false)}
				footer={null}
				width={400}
			>
				<div className="space-y-3">
					<div className="text-lg">
						Stream: <span className="italic">{streamTitleClicked}</span>
					</div>
					<div>Choose your stream's source</div>
					<div className="flex gap-4">
						<Button
							type="primary"
							className="uppercase bg-purple-600 hover:!bg-purple-800 text-white w-1/2"
							onClick={() => {
								sessionStorage.setItem("streamWithObs", false);
								navigate(`/studio/stream/${streamIdClicked}`);
							}}
						>
							Camera
						</Button>
						<Button
							type="primary"
							className="uppercase bg-purple-600 hover:!bg-purple-800 text-white w-1/2"
							onClick={() => {
								sessionStorage.setItem("streamWithObs", true);
								navigate(`/studio/stream/${streamIdClicked}`);
							}}
						>
							Obs
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default StudioPage;
