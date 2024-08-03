import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, CircleAlert, CircleX, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchStreamers, useActionStreamer } from "../../api/admin";
import { Modal, Tooltip, Skeleton, Switch } from "antd";
import { useDeleteSavedStreams, useEditStream } from "../../api/studio";
import { toast } from "react-toastify";

const AccountPage = () => {
	const [searchKey, setSearchKey] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const [streamers, setStreamers] = useState([]);
	const [numPages, setNumPages] = useState(0);
	const [page, setPage] = useState(1);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [userId, setUserIdClicked] = useState("");
	const [isBanned, setIsBannedClicked] = useState(false);
	const [open, setOpen] = useState(false);
	const [username, setUsernameClicked] = useState("");

	const { data: streamersData, refetch } = useSearchStreamers(searchKey, page);
	useEffect(() => {
		if (streamersData) {
			setStreamers(streamersData.streamers);
			setNumPages(streamersData.numPages);
		}
	}, [streamersData])

	useEffect(() => {
		refetch();
	}, [page]);

	const { mutate: actionStreamer, isSuccess: isActionSuccess } = useActionStreamer();

	useEffect(() => {
		if (isActionSuccess) {
			toast.success("Action successfully");
			refetch();
			setOpen(false);
		}
	}, [isActionSuccess]);

	const handleOk = async () => {
		const type = isBanned ? "unban" : "ban";
		const data = {
			streamerId: userId,
			type
		}
		actionStreamer(data);
	};

	useEffect(() => {
		document.title = `Admin - Account`;
	}, []);

	const handleToggle = (id, username, isBanned) => {
		setOpen(true);
		setUserIdClicked(id);
		setUsernameClicked(username);
		setIsBannedClicked(isBanned);
	}

	return (
		<div className="space-y-5">
			<div className="sticky top-0 z-99">
				<div className="w-full relative bg-white shadow-md dark:bg-meta-4 rounded-lg p-3 flex items-center">
					<button className="absolute left-2 h-full px-2">
						<Search />
					</button>
					<input type="text"
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						className="w-full pl-10 focus:outline-none dark:text-white bg-transparent"
						placeholder="Search streamer by username, email or fullname"
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								setSearchKey(searchInput);
							}
						}}
					/>
					{(searchInput != "") && <button
						className="absolute right-2 h-full px-2"
						onClick={() => {
							setSearchInput("");
							setSearchKey("");
						}}
					>
						<X className="rounded-full hover:bg-gray-300 dark:hover:bg-gray-600" />
					</button>}
				</div>
			</div>

			<div className="w-full bg-white dark:bg-meta-4 overflow-hidden rounded-lg shadow-md">
				<div className="w-full overflow-x-auto">
					<table className="w-full whitespace-no-wrap table-auto">
						<thead>
							<tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
								<th className="px-4 py-3">User</th>
								<th className="px-4 py-3">Email</th>
								<th className="px-4 py-3">Number of times banned</th>
								<th className="px-4 py-3">Permanently banned</th>
							</tr>
						</thead>
						{!streamersData ?
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
								{streamersData?.streamers.map((streamer, index) => {
									return (
										<tr key={index} className="text-gray-700 dark:text-gray-400">
											<td className="px-4 py-3">
												<div className="flex items-center text-sm">
													<div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
														<img className="object-cover w-full h-full rounded-full" src={streamer?.profilePictureS3} alt="" loading="lazy" />
														<div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
													</div>
													<div>
														<p className="font-semibold">{streamer?.username}</p>
														<p className="text-xs text-gray-600 dark:text-gray-400">
															{streamer?.fullname}
														</p>
													</div>
												</div>
											</td>
											<td className="px-4 py-3 text-xs">
												{streamer?.email}
											</td>
											<td className="px-4 py-3 text-sm">
												<span
													className={`px-2 py-1 leading-tight rounded-full ${streamer.numBans < 2
															? "text-green-700 bg-green-100 dark:text-white dark:bg-green-600"
															: streamer.numBans === 2
																? "text-yellow-700 bg-yellow-100 dark:text-white dark:bg-yellow-600"
																: "text-red-700 bg-red-100 dark:text-white dark:bg-red-600"
														}`}
												>
													{streamer.numBans}
												</span>
											</td>
											<td className="px-4 py-3 text-sm">
												<div className="flex space-x-2">
													<Switch checked={streamer.numBans >= 3}
														onClick={() => handleToggle(streamer?._id, streamer?.username, streamer.numBans >= 3)}
													/>
												</div>
											</td>
										</tr>
									)
								})}


							</tbody>
						}
					</table>
				</div>

				{streamers.length > 0 && (
					<div className="bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700
                        flex justify-end gap-8 px-4 py-2 items-center"
					>
						<span>Page: {page}/{numPages}</span>
						<div className="flex gap-4 items-center">
							<button
								className={`hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md p-1
                                ${page == 1 ? "pointer-events-none text-gray-300 dark:text-gray-700" : ""}`}
								onClick={() => setPage(1)}
							>
								<Tooltip title="First page">
									<ChevronFirst />
								</Tooltip>
							</button>
							<button
								className={`hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md p-1
                                ${page == 1 ? "pointer-events-none text-gray-300 dark:text-gray-700" : ""}`}
								onClick={() => setPage(page - 1)}
							>
								<Tooltip title="Previous page">
									<ChevronLeft />
								</Tooltip>
							</button>
							<button
								className={`hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md p-1
                                ${page == numPages ? "pointer-events-none text-gray-300 dark:text-gray-700" : ""}`}
								onClick={() => setPage(page + 1)}
							>
								<Tooltip title="Next page">
									<ChevronRight />
								</Tooltip>
							</button>
							<button
								className={`hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md p-1
                                ${page == numPages ? "pointer-events-none text-gray-300 dark:text-gray-700" : ""}`}
								onClick={() => setPage(numPages)}
							>
								<Tooltip title="Last page">
									<ChevronLast />
								</Tooltip>
							</button>
						</div>
					</div>
				)}
			</div>
			
			<Modal
				className='bg-slate-100 dark:bg-slate-600 rounded-lg dark:text-slate-200'
				centered
				open={open}
				okButtonProps={{ className: 'bg-purple-600 hover:!bg-purple-700' }}
				cancelButtonProps={{ className: 'border-purple-600 hover:!border-purple-700 hover:!text-purple-700' }}
				onOk={handleOk}
				closable={false}
				onCancel={() => setOpen(false)}
			>
				<div className='h-full'>
					<p className="text-lg font-semibold mb-2">{isBanned ? "Confirm unban" : "Confirm ban"}</p>
					<p className="text-sm">Are you sure you want to {isBanned ? "unban" : "ban"} this user: {username}?</p>
				</div>
			</Modal>
		</div>
	);
}

export default AccountPage;
