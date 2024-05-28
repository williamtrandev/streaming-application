import { useRef, useState, useEffect } from "react";

const VerifyEmailModal = ({ show, close }) => {
    if (!show) return null;

    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [isComplete, setIsComplete] = useState(false);

    const inputRefs = useRef([]);

    useEffect(() => {
        // Kiểm tra nếu tất cả các ô input đều được điền đầy đủ
        const allFilled = otp.every(val => val !== '');
        setIsComplete(allFilled);
    }, [otp]);

    const handleInputChange = (e, index) => {
        const value = e.target.value;
        if (/^[0-9]$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && index >= 0) {
            const newOtp = [...otp];
            newOtp[index] = '';
            setOtp(newOtp);
            if (index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text');
        const pasteArray = paste.slice(0, 6).split('');

        const newOtp = [...otp];
        pasteArray.forEach((char, index) => {
            if (inputRefs.current[index] && /^[0-9]$/.test(char)) {
                newOtp[index] = char;
                inputRefs.current[index].value = char;
            }
        });
        setOtp(newOtp);

        if (pasteArray.length >= 6) {
            inputRefs.current[5].focus();
        } else {
            inputRefs.current[pasteArray.length].focus();
        }
    };

    return (
        <div className="fixed z-9999 inset-0 flex justify-center items-center
            bg-black bg-opacity-75 backdrop-blur-sm"
        >
            <div className="w-[400px] relative bg-white dark:bg-boxdark p-5 rounded-lg space-y-6">
                <div className="flex justify-center">
                    <div className="text-xl font-bold">Verify Your Email Address</div>
                </div>

                <div className="space-y-4">
                    <div className="text-lg">
                        Enter your verification code
                    </div>
                    <div>
                        <div>We sent a 6-digit OTP to nguyenphucsyluan91@gmail.com.</div>
                        <div>Confirm it belongs to you to keep your account secure.</div>
                    </div>
                    <div className="flex gap-3 justify-between">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={otp[index]}
                                ref={el => inputRefs.current[index] = el}
                                onChange={(e) => handleInputChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onPaste={handlePaste}
                                className="w-12 h-12 text-center text-lg border 
                                border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600
                                bg-[#edf2f9] shadow-md dark:bg-meta-4 "
                            />
                        ))}
                    </div>
                    <button className="text-purple-700 dark:text-purple-500 hover:underline">
                        Resend OTP
                    </button>
                </div>
                <div className="flex justify-end">
                    <button
                        className={`bg-purple-700 text-white 
                                font-bold px-2 py-1 rounded-lg hover:bg-purple-800
                                ${!isComplete ? "pointer-events-none opacity-50" : ""}`}
                        onClick={() => {
                            close();
                        }}
                    >Verify</button>
                </div>
            </div>
        </div>
    );
}

export default VerifyEmailModal;
