import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetStreamerAbout } from "../../api/user";

const StreamerAboutPage = () => {
    let { username } = useParams();
    username = username.replace("@", "");
    const [about, setAbout] = useState(null);
    const [links, setLinks] = useState(null);

    const { data: streamerData } = useGetStreamerAbout(username);
    useEffect(() => {
		if (streamerData) {
            setAbout(streamerData.about);
            setLinks(streamerData.links);
		}
	}, [streamerData]);
    
    return (
        <div>
            {(!about && !links) && <div>
                This channel has no bio.
            </div>}
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
                                    target="_blank" rel="noopener noreferrer"
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
