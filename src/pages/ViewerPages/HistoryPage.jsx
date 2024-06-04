import { streams } from "../../constants";
import StreamCard from "../../components/home/StreamCard";
import HorizontalStreamCard from "../../components/detailStreamer/HorizontalStreamCard"
import { Search, X } from "lucide-react";
import { useState } from "react";
const HistoryPage = () => {
	const [historySearch, setHistorySearch] = useState("");
	return (
		<div className="space-y-4">
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
					/>
					{(historySearch != "") && <button className="absolute right-0 h-full px-2">
						<X className="rounded-full hover:bg-gray-300 dark:hover:bg-gray-600" />
					</button>}
				</div>
			</div>

			<div className="w-full mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
				{streams.map((stream, index) => (
					<StreamCard
						key={index}
						index={index}
						stream={stream}
					/>
				))}
			</div>
		</div>
	)
}

export default HistoryPage;