import { formatRelative } from 'date-fns';

function formatDate(seconds) {
	let formattedDate = '';

	if (seconds) {
		formattedDate = formatRelative(new Date(seconds * 1000), new Date());

		formattedDate =
			formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
	}

	return formattedDate;
}
const Message = ({msg}) => {
	const { message, displayName, createdAt, photoURL } = msg;
	return (
		<div className="space-y-2">
			<div className="flex items-center space-x-3">
				<img src={photoURL} alt="" className="w-6 h-6 rounded-full" />
				<div className="flex space-x-2 items-center">
					<p className='font-bold'>{displayName}</p>
					{/* <p className='text-xs'>
						{formatDate(createdAt)}
					</p> */}
				</div>
			</div>
			<p className='text-md'>{message}</p>
		</div>
	);
}
export default Message;
