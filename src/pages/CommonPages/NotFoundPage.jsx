import { useEffect } from "react";
import { appName } from "../../constants";

const NotFoundPage = () => {
    useEffect(() => {
        document.title = `Not Found - ${appName}`;
    }, []);
    return (
        <div className="h-full w-full text-center">
            <h1 className="text-lg font-bold">404 - Page Not Found</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
        </div>
    );
}

export default NotFoundPage;
