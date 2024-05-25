import { UserPlus } from "lucide-react";

const FollowButton = ({ onClick }) => {
    return (
        <button
            onClick={() => onClick()} 
            className="flex space-x-2 items-center text-white bg-blue-700 
                hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm 
                px-3 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            <span><UserPlus size={16} /></span>
            <span className="text-sm md:text-lg">Follow</span>
        </button>
    );
}

export default FollowButton;
