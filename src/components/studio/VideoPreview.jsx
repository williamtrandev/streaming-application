const VideoPreview = () => {
	return (
		<div className="aspect-video w-full rounded-lg overflow-hidden flex justify-center">
			<video autoPlay controls id="video" className="h-full rounded-lg">
				{/* <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" /> */}
			</video>
		</div>
	)
}

export default VideoPreview;