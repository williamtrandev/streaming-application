import { User } from "lucide-react";
import { useCheckUsernameAvailable } from "../../api/auth";
import { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";

const UsernameInput = ({ value, setUsername, setIsValid, handleKeyDown, nextRef }) => {

    const [debouncedUsername, setDebouncedUsername] = useState("");
    const debounceTimeoutRef = useRef(null);

    const { mutate, isError, error, isSuccess, data } = useCheckUsernameAvailable();

    const isValid = (value.length >= 4 && value.length <= 25) && !(/\s/.test(value)) && !(/[^a-zA-Z0-9]/.test(value));
    
    const handleUsernameChange = (e) => {
        const inputValue = e.target.value;
        setUsername(inputValue);
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
            setDebouncedUsername(inputValue);
        }, 1000);
    };

    useEffect(() => {
        // Cleanup timeout on component unmount
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (debouncedUsername && isValid) {
            mutate({ username: value });
        }
    }, [debouncedUsername]);

    useEffect(() => {
        setIsValid(data?.available && isValid);
    }, [isSuccess]);

    useEffect(() => {
        const errorMessage = error?.response?.data?.message;
        toast.error(errorMessage);
    }, [isError]);

    return (
        <div>
            <div className="mb-1">Username</div>
            <div id="usernameInput" className="text-black w-full">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-black dark:text-bodydark">
                        <User />
                    </span>
                    <input
                        type="text"
                        className="w-full pl-10 pr-3 bg-[#edf2f9] shadow-md dark:bg-meta-4 py-2 rounded-lg 
                                        text-black dark:text-white outline-purple-600"
                        value={value}
                        onChange={handleUsernameChange}
                        onKeyDown={e => handleKeyDown(e, nextRef)}
                    />
                </div>
            </div>
            <div className="text-red-500 mt-1 text-sm">
                {!(data?.available) && isValid ? "*This username is unavailable." : ""}
                {!isValid && value != "" ? "*Username must be from 4 to 25 characters long, not contain spaces or special characters." : ""}
            </div>
            <div className="mt-1 text-sm">
                {value == "" ? "Username must be unique. Username can be changed every 14 days." : ""}
            </div>
        </div>
    );
}

export default UsernameInput;
