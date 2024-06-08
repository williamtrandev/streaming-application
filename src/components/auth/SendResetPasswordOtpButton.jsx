import { toast } from "react-toastify";
import { useForgotPassword } from "../../api/auth";
import { useEffect, useState } from "react";

const SendResetPasswordOtpButton = ({ email, username, isValidEmail }) => {
    const { mutate, isLoading, isError, error, isSuccess, data } = useForgotPassword();
    const [seconds, setSeconds] = useState(0);
    const [isCounting, setIsCounting] = useState(false);

    useEffect(() => {
        let timer;
        if (isCounting && seconds > 0) {
            timer = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds - 1);
            }, 1000);
        } else if (seconds === 0) {
            setIsCounting(false);
        }
        return () => clearInterval(timer);
    }, [isCounting, seconds]);

    const handleClick = () => {
        mutate({ email, username });
    }

    useEffect(() => {
        if (data) {
            toast.success(data.message);
            setSeconds(180);
            setIsCounting(true);
        }
    }, [isSuccess]);

    useEffect(() => {
        const errorMessage = error?.response?.data?.message;
        toast.error(errorMessage);
    }, [isError]);

    return (
        <button
            className={`px-2 py-1 text-white rounded-md text-xm md:text-md
                bg-purple-600 hover:bg-purple-700 text-nowrap
                ${!email || !isValidEmail || !username ? "pointer-events-none bg-opacity-50" : ""}
                ${isCounting ? "pointer-events-none bg-purple-800" : ""}`}
            onClick={handleClick}
        >
            {isCounting ? `${seconds}s` : "Send OTP"}
        </button>
    );
}

export default SendResetPasswordOtpButton;
