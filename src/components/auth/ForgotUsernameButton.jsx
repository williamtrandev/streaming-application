import { toast } from "react-toastify";
import { useForgotUsername } from "../../api/auth";
import { emailRegex } from "../../constants";
import { useEffect, useState } from "react";

const ForgotUsernameButton = ({ email }) => {

    const isVaidEmail = emailRegex.test(email);
    const [wasClick, setWasClick] = useState(false);

    const { mutate, isError, error, isSuccess, data } = useForgotUsername();

    const handleSubmit = () => {
        mutate({ email });
    };
    useEffect(() => {
        if(data) {
            toast.success(data?.message);
            setWasClick(true);
        }
    }, [isSuccess]);

    useEffect(() => {
        const errorMessage = error?.response?.data?.message;
        toast.error(errorMessage);
    }, [isError]);

    return (
        <button
            className={`text-purple-700 dark:text-purple-500 hover:underline
                ${!isVaidEmail || wasClick ? "pointer-events-none" : ""}`}
            onClick={handleSubmit}
        >
            Forgot your username?
        </button>
    );
}

export default ForgotUsernameButton;
