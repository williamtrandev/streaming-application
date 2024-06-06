import { Link } from "react-router-dom";
import { fakeStreamer } from "../../constants";

const StreamerAboutPage = () => {

    const about = fakeStreamer.about;
    const links = fakeStreamer.links;
    
    return (
        <div className="">
            <div className="whitespace-pre-wrap">
                {about}
            </div>
            {links && <div className="mt-6">
                <div className="font-bold text-2xl">Links</div>
                <div className="flex flex-col gap-1 mt-2 text-lg">
                    {links.map((link, index) => (
                        <div key={index}>
                            <div>{link.title}</div>
                            <div>
                                <Link
                                    to={link.link}
                                    className="text-blue-600 dark:text-blue-500 hover:underline"
                                >
                                    {link.link}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>}
        </div>
    );
}

export default StreamerAboutPage;
