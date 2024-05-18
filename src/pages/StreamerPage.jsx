import { useParams } from "react-router-dom";

const StreamerPage = () => {
    const { id } = useParams();
    return (
        <div>{id}</div>
    );
}

export default StreamerPage
