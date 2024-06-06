const SettingStream = ({ openSettings, startWithCam, startWithOBS }) => {
    return (
        <div className="flex gap-3 flex-wrap">
            <button className="rounded-lg bg-white hover:bg-purple-700 hover:text-white p-3 shadow-md" onClick={openSettings}>Settings</button>
            <button className="rounded-lg bg-white hover:bg-purple-700 hover:text-white p-3 shadow-md" onClick={startWithCam}>Start With Camera</button>
            <button className="rounded-lg bg-white hover:bg-purple-700 hover:text-white p-3 shadow-md" onClick={startWithOBS}>Start With OBS</button>
        </div>
    )
};

export default SettingStream;