import StreamCard from "../../components/home/StreamCard";
import { History, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchHistory } from "../../api/search";
import { useAuth } from "../../contexts/AuthContext";
const HistoryPage = () => {
	const { auth } = useAuth();
	const userId = auth?.user?._id;
	const [historySearch, setHistorySearch] = useState("");
	const [histories, setHistories] = useState([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [q, setQ] = useState("");

	const { data: historyData, refetch } = useSearchHistory({ userId, key: q, page });
	useEffect(() => {
		if (historyData) {
			if (page == 1) {
				setHistories(historyData.histories);
			} else {
				setHistories((prevHistories) => [...prevHistories, ...historyData.histories]);
			}
			setHasMore(historyData.histories.length > 0);
		}
	}, [historyData])

	useEffect(() => {
		if (hasMore && page > 1) {
			refetch();
		}
	}, [page]);

	useEffect(() => {
        if (auth) {
            refetch();
        }
    }, [auth]);

	useEffect(() => {
		const handleScroll = () => {
			if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
			setPage((prevPage) => prevPage + 1);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<div>
			{(histories.length == 0 && auth) && <div className="h-full flex flex-col items-center justify-center gap-4">
				<History size={64} />
				<span className="text-lg">You haven't watched any streams yet.</span>
			</div>}

			{!auth && <div className="h-full flex flex-col items-center justify-center gap-4">
				<History size={64} />
				<span className="text-lg">You can only view your history when you are logged in.</span>
			</div>}

			{(auth && histories.length > 0 ) && <div className="space-y-4">
				<div className="grid grid-cols-3 py-3 sticky z-99 top-18 bg-[#edf2f9] dark:bg-boxdark-2">
					<div className="text-2xl font-bold col-span-2">Watch history</div>
					<div className="relative h-fit w-full">
						<button className="absolute left-0 h-full px-2">
							<Search />
						</button>
						<input type="text"
							value={historySearch}
							onChange={(e) => setHistorySearch(e.target.value)}
							className="shadow-md text-lg w-full px-10 py-1 rounded-lg
							bg-white dark:bg-meta-4 dark:text-white"
							placeholder="Search watch history"
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									setQ(historySearch);
								}
							}}
						/>
						{(historySearch != "") && <button
							className="absolute right-0 h-full px-2"
							onClick={() => {
								setHistorySearch("");
								setQ("");
							}}
						>
							<X className="rounded-full hover:bg-gray-300 dark:hover:bg-gray-600" />
						</button>}
					</div>
				</div>

				<div className="w-full mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
					{histories.map((history, index) => (
						<StreamCard
							key={index}
							index={index}
							stream={history.streamInfo}
						/>
					))}
				</div>
			</div>}
		</div>
	)
}

export default HistoryPage;