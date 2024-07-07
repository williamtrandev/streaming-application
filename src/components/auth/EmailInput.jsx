import { useEffect, useRef, useState } from "react";
import { useCheckEmailAvailable } from "../../api/auth";
import { Mail } from "lucide-react";
import { toast } from "react-toastify";
import { emailRegex } from "../../constants";

const EmailInput = ({ value, setEmail, setIsValid }) => {

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [debouncedEmail, setDebouncedEmail] = useState("");
    const debounceTimeoutRef = useRef(null);

    const { mutate, isError, error, isSuccess, data } = useCheckEmailAvailable();

    const isValidFormat = emailRegex.test(value);
    
    const handleEmailChange = (e) => {
        const inputValue = e.target.value;
        setEmail(inputValue);
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
            setDebouncedEmail(inputValue);
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
        if (debouncedEmail && isValidFormat) {
            mutate({ email: value });
        }
    }, [debouncedEmail]);

    useEffect(() => {
        setIsValid(data?.available && isValidFormat);
    }, [isSuccess]);

    useEffect(() => {
        const errorMessage = error?.response?.data?.message;
        toast.error(errorMessage);
    }, [isError]);

    return (
        <div>
            <div className="mb-1">Email</div>
            <div className="text-black w-full">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-black dark:text-bodydark">
                        <Mail />
                    </span>
                    <input
                        type="text"
                        className="w-full pl-10 pr-3 bg-[#edf2f9] shadow-md dark:bg-meta-4 py-2 rounded-lg 
                                        text-black dark:text-white outline-purple-600"
                        value={value}
                        onChange={handleEmailChange}
                    />
                </div>
            </div>
            <div className="text-red-500 mt-1 text-sm h-auto w-auto">
                {!(data?.available) && isValidFormat ? "*This email is unavailable." : ""}
                {(!isValidFormat && value != "") ? "*Please enter a valid email." : ""}
            </div>
        </div>
    );
}

export default EmailInput;
