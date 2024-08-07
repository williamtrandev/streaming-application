import React, { useEffect, useState } from 'react'
import { useBanStream, useSearchStreamsAdmin } from '../../api/admin';
import { Button, Modal, Spin, Tooltip } from 'antd';
import { Ban, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, CircleAlert, Search, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectSocket } from '../../redux/slices/socketSlice';

const StreamAdminPage = () => {
	const socket = useSelector(selectSocket);

	const [searchKey, setSearchKey] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const [streams, setStreams] = useState([]);
	const [numPages, setNumPages] = useState(0);
	const [page, setPage] = useState(1);
	const [showBanModal, setShowBanModal] = useState(false);
	const [selectedStream, setSelectedStream] = useState(null);

	const { data: streamsData, isFetching, refetch } = useSearchStreamsAdmin(searchKey, page);
	useEffect(() => {
		if (streamsData) {
			console.log(streamsData);
			setStreams(streamsData.streams);
			setNumPages(streamsData.numPages);
		}
	}, [streamsData]);

	const { mutate: banStream, data: banData, isError: isBanError, error: banError, isPending: isBanPending, isSuccess: isBanSuccess } = useBanStream();
	const handleBan = () => {
		banStream({ streamId: selectedStream?._id });
	}

	useEffect(() => {
        if (banData) {
            toast.success(banData.message);
            refetch();
            setShowBanModal(false);
			if (socket) {
				socket.emit("bannedStream", banData.streamerId, banData.streamId);
			}
        }
    }, [isBanSuccess]);

    useEffect(() => {
        const errorMessage = banError?.response?.data?.message;
        toast.error(errorMessage);
    }, [isBanError]);

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
						placeholder="Search stream by stream's id, title or tag"
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
					{isFetching && (
						<div className="w-full flex justify-center p-5">
							<Spin size="large" />
						</div>
					)}
					{!isFetching && (
						<table className="w-full whitespace-no-wrap table-auto">
							<thead>
								<tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
									<th className="px-4 py-3">Stream</th>
									<th className="px-4 py-3">Streamer</th>
									<th className="px-4 py-3">Date</th>
									<th className="px-4 py-3">Action</th>
								</tr>
							</thead>
							<tbody className="divide-y dark:divide-gray-700 dark:bg-gray-800">
								{streams && streams.map((stream, index) => {
									return (
										<tr
											key={index}
											className="text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 items-center"
										>
											<td className="px-4 py-3 text-sm">
												<div className="flex gap-3 items-center">
													<span>
														<img
															src={stream.previewImage}
															alt="preview"
															className="aspect-video object-cover w-40 rounded-lg hidden md:block"
														/>
													</span>
													<span>
														{stream.title.length > 100 ? stream.title.substring(0, 100) + '...' : stream.title}
													</span>
												</div>
											</td>

											<td className="px-4 py-3 text-sm">
												<div className="flex gap-3 items-center">
													<span className="rounded-full w-10">
														<img
															src={stream.user.profilePicture}
															alt="pp"
															className="object-cover rounded-full w-10"
														/>
													</span>
													<span>
														{stream.user.username}
													</span>
												</div>
											</td>
											<td className="px-4 py-3 text-sm">
												{new Date(stream.dateStream).toLocaleString()}
											</td>
											<td className="px-4 py-3 text-sm">
												{stream.isBanned ? (
													<Button
														type="primary"
														disabled
													>
														<Ban size={16} />
													</Button>
												) : (
													<Button
														type="primary"
														danger
														onClick={() => {
															setShowBanModal(true);
															setSelectedStream(stream);
														}}
													>
														<Ban size={16} />
													</Button>
												)}
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					)}
				</div>
				{!isFetching && streams.length > 0 && (
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
                className='bg-slate-100 dark:bg-slate-700 rounded-lg dark:text-slate-200'
                centered
                open={showBanModal}
                okButtonProps={{ type: "primary", danger: true }}
                cancelButtonProps={{ className: 'border-purple-600 hover:!border-purple-700 hover:!text-purple-700' }}
                onOk={handleBan}
                okText="Ban"
                // closable={false}
                // confirmLoading={deletePending}
                onCancel={() => setShowBanModal(false)}
            >
                <div className="flex gap-4">
                    <CircleAlert className="text-red-600" size={48} />
                    <div>
                        <div className="text-lg font-semibold">
                            Ban stream {selectedStream?._id}?
                        </div>
                        <div>
                            Title: {selectedStream?.title}
                        </div>
                    </div>
                </div>
            </Modal>
		</div>
	)
}

export default StreamAdminPage