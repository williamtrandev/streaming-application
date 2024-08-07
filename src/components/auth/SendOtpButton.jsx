import { toast } from "react-toastify";
import { useSendOtp } from "../../api/auth";
import { useEffect, useState } from "react";
import { otpExpireTime } from "../../constants";

const SendOtpButton = ({ email, isValidEmail }) => {
    const { mutate, isLoading, isError, error, isSuccess, data } = useSendOtp();
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
        mutate({ email });
    }

    useEffect(() => {
        if (data) {
            toast.success(data.message);
            setSeconds(otpExpireTime);
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
                ${!email || !isValidEmail || isCounting ? "pointer-events-none bg-slate-600" : ""}`}
            onClick={handleClick}
        >
            {isCounting ? `${seconds}s` : "Send OTP"}
        </button>
    );
}

export default SendOtpButton;
