import { useLocation } from "react-router-dom";

const SearchPage = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const keyword = params.get('keyword');
    return (
        <div className="space-y-4">
            <div
                className="text-lg"
            >
                Search result for "<span className="font-semibold">{keyword}</span>"
            </div>
            <div className="">
                <div>Channels</div>
                <div>

                </div>
            </div>
        </div>
    );
}

export default SearchPage;
