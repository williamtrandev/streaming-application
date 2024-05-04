import { useParams } from 'react-router-dom';
const DetailStreamPage = () => {
	const { id } = useParams();
	return (
		<div>DetailStreamPage with {id}</div>
	)
}

export default DetailStreamPage;