import { formatRelative, parseISO } from 'date-fns';

function formatDate(date) {
	let formattedDate = '';

	if (date) {
		formattedDate = formatRelative(parseISO(date), new Date());

		formattedDate =
			formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
	}

	return formattedDate;
}
const Message = ({msg}) => {
	const { content, user, createdAt } = msg;
	console.log(content, user, createdAt)
	return (
		<div className="space-y-2">
			<div className="flex items-center space-x-3">
				<img src={user.profilePicture} alt="" className="w-6 h-6 rounded-full" />
				<div className="flex space-x-2 items-center">
					<p className='font-bold'>{user?.fullname}</p>
					<p className='text-xs'>
						{formatDate(createdAt)}
					</p>
				</div>
			</div>
			<p className='text-md'>{content}</p>
		</div>
	);
}
export default Message;
