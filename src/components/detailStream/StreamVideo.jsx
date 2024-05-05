import { Users } from "lucide-react";

const HeaderStreamVideo = ({stream}) => {
	return (
		<div className="w-full flex space-x-3 items-center">
			<img src={stream.user.avatar} alt="" className="rounded-full w-[3rem] h-[3rem] object-cover" />

			<div className="w-full">
				<div className="w-full flex justify-between">
					<h3 className="font-bold text-2xl">{stream.title}</h3>
					<button type="button" class="flex space-x-2 items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
						<span className="font-bold text-lg">+</span>
						<span>Follow</span>
					</button>
				</div>
				<div className="flex space-x-4 text-sm">
					<span>{stream.user.name}</span>
					<p className="flex space-x-2">
						<Users className="w-[1rem]" />
						<span>{stream.num_viewers}</span>
					</p>
					<span>Followers: {stream.user.num_followers}</span>
				</div>
			</div>
		</div>
	)
}

const Video = () => {
	return (
		<></>
	)
}

const StreamVideo = ({stream}) => {
	return (
		<div className="w-full flex justify-between bg-black p-3 rounded-md">
			<HeaderStreamVideo stream={stream} />
			<Video />
		</div>			
	)
}

export default StreamVideo;