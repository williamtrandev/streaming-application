import { Copy, Eye, EyeOff } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import { useGetServerUrlAndStreamKey } from '../../api/studio';
import { Button } from 'antd';

const SettingsPage = () => {
	// const serverUrlRef = useRef(null);
	// const streamKeyref = useRef(null);
	// const [showStreamKey, setShowStreamKey] = useState(false);

	// const [serverUrl, setServerUrl] = useState("");
	// const [streamKey, setStreamKey] = useState("");

	// const { data: streamKeyData } = useGetServerUrlAndStreamKey();
	// useEffect(() => {
	// 	if (streamKeyData) {
	// 		setServerUrl(streamKeyData?.serverUrl);
	// 		setStreamKey(streamKeyData?.streamKey);
	// 	}
	// }, [streamKeyData]);

	return (
		<div className="space-y-4">
			<div className="text-2xl font-bold">
				Settings
			</div>
			{/* <div className="space-y-2">
				<div className="text-xl">Stream</div>
				<div className="divide-y divide-gray-300 dark:divide-gray-600 bg-white dark:bg-boxdark px-4 rounded-lg">
					<div className="flex flex-col md:flex-row py-4 gap-2">
						<div className="md:w-[20%]">Server URL</div>
						<div className="flex gap-4">
							<div
								ref={serverUrlRef}
							>
								{serverUrl || "None"}
							</div>
							<button
								className="p-1 rounded-md bg-purple-600 text-white"
								onClick={() => {
									if (serverUrlRef.current) {
										navigator.clipboard.writeText(serverUrlRef.current.innerText)
											.then(() => {
												toast.success("Copied to clipboard!");
											})
											.catch((err) => {
												toast.error("Failed to copy: ", err);
											});
									}
								}}
							>
								<Copy size={20} />
							</button>
						</div>
					</div>
					<div className="flex flex-col md:flex-row py-4 gap-2">
						<div className="md:w-[20%]">Stream key</div>
						<div className="flex gap-4">
							<input
								className="bg-transparent pointer-events-none"
								type={showStreamKey ? "text" : "password"}
								ref={streamKeyref}
								value={streamKey || ""}
								readOnly
							/>
							<div className="flex gap-2">
								<button
									className="p-1 rounded-md bg-purple-600 text-white"
									onClick={() => {
										if (streamKeyref.current) {
											navigator.clipboard.writeText(streamKeyref.current.value)
												.then(() => {
													toast.success("Copied to clipboard!");
												})
												.catch((err) => {
													toast.error("Failed to copy: ", err);
												});
										}
									}}
								>
									<Copy size={20} />
								</button>
								<button
									className="p-1 rounded-md bg-neutral-300 dark:bg-neutral-600"
									onClick={() => setShowStreamKey(!showStreamKey)}
								>
									{!showStreamKey && <Eye size={20} />}
									{showStreamKey && <EyeOff size={20} />}
								</button>
							</div>
							<Button
								type="primary"
								loading={isPending}
								onClick={handleReset}
							>
								Reset
							</Button>
						</div>
					</div>
				</div>
			</div> */}
		</div>
	)
}

export default SettingsPage