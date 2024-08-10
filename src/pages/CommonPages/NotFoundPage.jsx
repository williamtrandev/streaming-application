import { useEffect } from "react";
import { appName } from "../../constants";
import { img404 } from "../../assets";

const NotFoundPage = () => {
    useEffect(() => {
        document.title = `Not Found - ${appName}`;
    }, []);
    return (
        <div className="flex flex-col justify-center items-center h-[calc(100vh-5rem)] gap-5">
            <img src={img404} className="!h-[70%]" />
            <h1 className="text-lg font-bold">404 - Page Not Found</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
        </div>
    );
}

export default NotFoundPage;
