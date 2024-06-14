import { useGetProfile } from "../../api/user";
import { useAuth } from "../../contexts/AuthContext";
import ProfileBanner from "../../components/settings/ProfileBanner";
import ProfileSettings from "../../components/settings/ProfileSettings";
import SocialLinks from "../../components/settings/SocialLinks";
import ProfilePicture from "../../components/settings/ProfilePicture";

const SettingProfilePage = () => {
    const { auth } = useAuth();
	const userId = auth?.user?._id;
    const { data: userData } = useGetProfile(userId);

    return (
        <div className="space-y-6">
            <ProfilePicture profilePicture={userData?.profilePicture} />

            <ProfileBanner profileBanner={userData?.profileBanner} />

            <ProfileSettings 
                userFullname={userData?.fullname} 
                userAbout={userData?.about} 
                canChangeUsername={userData?.canChangeUsername}
            />

            <SocialLinks userLinks={userData?.links} />
        </div>
    );
}

export default SettingProfilePage;
