import { Link } from "react-router-dom";

const AboutTab = ({ about }) => {
    return (
        <div className="">
            <div className="whitespace-pre-wrap">
                {about.text}
            </div>
            {about.links && <div className="mt-6">
                <div className="font-bold text-2xl">Links</div>
                <div className="flex flex-col gap-1 mt-2 text-lg">
                    {about.links.map((link, index) => (
                        <Link 
                            key={index}
                            to={link.link}
                            className="text-blue-600 dark:text-blue-500 hover:underline"
                        >
                            {link.title}
                        </Link>
                    ))}
                </div>
            </div>}
        </div>
    );
}

export default AboutTab
