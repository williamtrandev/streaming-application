import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, CircleAlert, MoveDown, MoveUp, Pencil, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchSavedStreams } from "../../api/search";
import { Checkbox, DatePicker, Modal, Tooltip } from "antd";
import moment from "moment";
import TagItem from "../../components/studio/TagItem";
import { useDeleteSavedStreams, useEditStream } from "../../api/studio";
import { toast } from "react-toastify";
import { blobToBase64 } from "../../utils";
import { appName } from "../../constants";

const SavedStreamsPage = () => {
    const [searchKey, setSearchKey] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [streams, setStreams] = useState([]);
    const [numPages, setNumPages] = useState(0);
    const [page, setPage] = useState(1);
    const [date, setDate] = useState(-1);
    const [numViews, setNumViews] = useState(-1);
    const [numViewsLive, setNumViewsLive] = useState(-1);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [chosenStreamId, setChosenStreamId] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { data: streamsData, refetch } = useSearchSavedStreams(searchKey, page, date, numViews, numViewsLive);
    useEffect(() => {
        if (streamsData) {
            setStreams(streamsData.streams);
            setNumPages(streamsData.numPages);
        }
    }, [streamsData])

    useEffect(() => {
        refetch();
    }, [page]);

    const onSelectAllChange = (e) => {
        if (e.target.checked) {
            setSelectedRowKeys(streams.map(stream => stream._id));
        } else {
            setSelectedRowKeys([]);
        }
    };

    const onSelectChange = (id) => {
        const newSelectedRowKeys = [...selectedRowKeys];
        if (newSelectedRowKeys.includes(id)) {
            setSelectedRowKeys(newSelectedRowKeys.filter(key => key !== id));
        } else {
            newSelectedRowKeys.push(id);
            setSelectedRowKeys(newSelectedRowKeys);
        }
    };

    const allChecked = selectedRowKeys.length === streams.length;
    const indeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < streams.length;

    const { mutate: deleteStreams, data: deleteData, isError: isDeleteError, error: deleteError, isPending: deletePending, isSuccess: isDeleteSuccess } = useDeleteSavedStreams();
    const handleDelete = () => {
        deleteStreams({ streamIds: selectedRowKeys });
    };

    useEffect(() => {
        if (deleteData) {
            toast.success(deleteData.message);
            refetch();
            setShowDeleteModal(false);
        }
    }, [isDeleteSuccess]);

    useEffect(() => {
        const errorMessage = deleteError?.response?.data?.message;
        toast.error(errorMessage);
    }, [isDeleteError]);

    const rainbowColors = [
        "#FF0000", "#FF6F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#8B00FF",
        "#FF000A", "#FF7600", "#FFFF0A", "#00FF0A", "#0000FA", "#450082", "#8100FF",
        "#FF0014", "#FF7D00", "#FFFF14", "#00FF14", "#0000F5", "#3E0082"
    ];

    const getRandomRainbowColor = () => {
        const randomIndex = Math.floor(Math.random() * rainbowColors.length);
        return rainbowColors[randomIndex];
    };

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tagValue, setTagValue] = useState("");
    const [tagArr, setTagArr] = useState([]);
    const [image, setImage] = useState("");
    const [selectedTime, setSelectedTime] = useState(moment());

    const submitTagHandler = () => {
        if (tagArr.length >= 20) {
            toast.error("You can only add 20 tags");
            return;
        }
        const tagExists = tagArr.some(tagObj => tagObj.tag === tagValue);

        if (!tagExists && tagValue) {
            setTagArr([...tagArr, { tag: tagValue, randomColor: getRandomRainbowColor() }]);
        }
        setTagValue("");
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            submitTagHandler();
            setTagValue("");
        }
    };

    const deleteTagHandler = (tagToDelete) => {
        setTagArr(tagArr.filter(tag => tag.tag !== tagToDelete));
    };

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
        }
    };

    const { mutate: saveStream, isSuccess: isSuccessEdit, data: editData, isError: isErrorEdit, error: errorEdit, isPending: editPending } = useEditStream();
    const handleOk = async () => {
        const tags = tagArr.map(item => item.tag);
        const previewImage = await blobToBase64(image);
        const data = {
            title: title,
            description: description,
            dateStream: selectedTime.toDate().toISOString(),
            tags: tags,
            previewImage: previewImage
        }
        saveStream({ streamId: chosenStreamId, data: data });
    };

    useEffect(() => {
        if (editData) {
            toast.success("Edit stream successfully");
            refetch();
            setShowEditModal(false);
        }
    }, [isSuccessEdit]);

    useEffect(() => {
        const errorMessage = errorEdit?.response?.data?.message;
        toast.error(errorMessage);
    }, [isErrorEdit]);

    const onRowClick = (stream) => {
        setChosenStreamId(stream._id);
        setTitle(stream.title);
        setDescription(stream.description);
        setImage(stream.previewImage);
        setSelectedTime(moment(stream.dateStream, "YYYY-MM-DD HH:mm"));
        const tags = stream.tags.map((tag, index) => ({ tag: tag, randomColor: getRandomRainbowColor() }));
        setTagArr(tags);
        setShowEditModal(true);
    }

    useEffect(() => {
        document.title = `Saved Streams - ${appName}`;
    }, []);

    return (
        <div className="space-y-2">
            <div className="text-lg font-bold">Saved Streams Manager</div>
            <div className="sticky top-18 z-99">
                <div className="relative">
                    <button className="absolute left-0 h-full px-2">
                        <Search />
                    </button>
                    <input type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full px-10 py-2 focus:outline-none border-y border-gray-300 dark:border-gray-600
							bg-[#edf2f9] dark:bg-boxdark-2 dark:text-white"
                        placeholder="Search stream by title or tag"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setSearchKey(searchInput);
                            }
                        }}
                    />
                    {(searchInput != "") && <button
                        className="absolute right-0 h-full px-2"
                        onClick={() => {
                            setSearchInput("");
                            setSearchKey("");
                        }}
                    >
                        <X className="rounded-full hover:bg-gray-300 dark:hover:bg-gray-600" />
                    </button>}
                </div>
                {selectedRowKeys.length > 0 && (
                    <div
                        className="bg-gray-300 dark:bg-slate-700 dark:text-white py-2 px-4
                            flex gap-4 justify-between items-center"
                    >
                        <span>{selectedRowKeys.length} selected</span>
                        <button
                            className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-500"
                            onClick={() => setShowDeleteModal(true)}
                        >
                            Delete selected {selectedRowKeys.length > 1 ? "streams" : "stream"}
                        </button>
                        <button
                            className="hover:bg-gray-400 dark:hover:bg-slate-600 p-1 rounded-md"
                            onClick={() => setSelectedRowKeys([])}
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}
            </div>

            <div className="w-full bg-white dark:bg-meta-4 overflow-hidden rounded-lg shadow-md">
                {streams.length > 0 && (
                    <div className="w-full overflow-x-auto">
                        <table className="w-full whitespace-no-wrap table-auto">
                            <thead>
                                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                    <th className="px-4 py-3">
                                        <Checkbox
                                            indeterminate={indeterminate}
                                            onChange={onSelectAllChange}
                                            checked={allChecked}
                                        />
                                    </th>
                                    <th className="px-4 py-3">Stream</th>
                                    <th className="px-4 py-3">
                                        <button
                                            className="flex gap-1 items-center hover:text-black dark:hover:text-white"
                                            onClick={() => {
                                                if (date == -1) {
                                                    setDate(1);
                                                } else {
                                                    setDate(-1);
                                                }
                                            }}
                                        >
                                            <span>Date</span>
                                            {date == -1 && <MoveDown size={16} />}
                                            {date == 1 && <MoveUp size={16} />}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3">
                                        <button
                                            className="flex gap-1 items-center hover:text-black dark:hover:text-white"
                                            onClick={() => {
                                                if (numViewsLive == -1) {
                                                    setNumViewsLive(1);
                                                } else {
                                                    setNumViewsLive(-1);
                                                }
                                            }}
                                        >
                                            <span>Live views</span>
                                            {numViewsLive == -1 && <MoveDown size={16} />}
                                            {numViewsLive == 1 && <MoveUp size={16} />}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3">
                                        <button
                                            className="flex gap-1 items-center hover:text-black dark:hover:text-white"
                                            onClick={() => {
                                                if (numViews == -1) {
                                                    setNumViews(1);
                                                } else {
                                                    setNumViews(-1);
                                                }
                                            }}
                                        >
                                            <span>Views</span>
                                            {numViews == -1 && <MoveDown size={16} />}
                                            {numViews == 1 && <MoveUp size={16} />}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3">Like/Dislike</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-700 dark:bg-gray-800">
                                {streams.map((stream, index) => {
                                    return (
                                        <tr
                                            key={index}
                                            className="text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        >
                                            <td className="px-4 py-3 text-sm">
                                                <Checkbox
                                                    checked={selectedRowKeys.includes(stream._id)}
                                                    onChange={() => onSelectChange(stream._id)}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-sm flex gap-2" onClick={() => onRowClick(stream)}>
                                                <span>
                                                    <img
                                                        src={stream.previewImage}
                                                        alt="preview"
                                                        className="aspect-video object-cover w-40"
                                                    />
                                                </span>
                                                <span>
                                                    {stream.title.length > 100 ? stream.title.substring(0, 100) + '...' : stream.title}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm" onClick={() => onRowClick(stream)}>
                                                {new Date(stream.dateStream).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-sm" onClick={() => onRowClick(stream)}>
                                                {stream.numViewsLive}
                                            </td>
                                            <td className="px-4 py-3 text-sm" onClick={() => onRowClick(stream)}>
                                                {stream.numViews}
                                            </td>
                                            <td className="px-4 py-3 text-sm" onClick={() => onRowClick(stream)}>
                                                {stream.numLikes}/{stream.numDislikes}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
                {streams.length == 0 && (
                    <div className="bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 px-4 py-2">
                        You haven't saved any streams yet
                    </div>
                )}
                {streams.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700
                        flex justify-end gap-8 px-4 py-2 items-center"
                    >
                        <span>Page: {page}/{numPages}</span>
                        <div className="flex gap-4 items-center">
                            <button
                                className={`hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md p-1
                                ${page == 1 ? "pointer-events-none text-gray-300 dark:text-gray-700" : ""}`}
                                onClick={() => setPage(1)}
                            >
                                <Tooltip title="First page">
                                    <ChevronFirst />
                                </Tooltip>
                            </button>
                            <button
                                className={`hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md p-1
                                ${page == 1 ? "pointer-events-none text-gray-300 dark:text-gray-700" : ""}`}
                                onClick={() => setPage(page - 1)}
                            >
                                <Tooltip title="Previous page">
                                    <ChevronLeft />
                                </Tooltip>
                            </button>
                            <button
                                className={`hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md p-1
                                ${page == numPages ? "pointer-events-none text-gray-300 dark:text-gray-700" : ""}`}
                                onClick={() => setPage(page + 1)}
                            >
                                <Tooltip title="Next page">
                                    <ChevronRight />
                                </Tooltip>
                            </button>
                            <button
                                className={`hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md p-1
                                ${page == numPages ? "pointer-events-none text-gray-300 dark:text-gray-700" : ""}`}
                                onClick={() => setPage(numPages)}
                            >
                                <Tooltip title="Last page">
                                    <ChevronLast />
                                </Tooltip>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <Modal
                className='bg-slate-100 dark:bg-slate-700 rounded-lg dark:text-slate-200'
                centered
                open={showEditModal}
                okButtonProps={{ className: 'bg-purple-600 hover:!bg-purple-700' }}
                cancelButtonProps={{ className: 'border-purple-600 hover:!border-purple-700 hover:!text-purple-700' }}
                onOk={handleOk}
                okText="Save"
                closable={false}
                confirmLoading={editPending}
                onCancel={() => setShowEditModal(false)}
            >
                <div className="h-[80vh] overflow-y-auto max-w-full p-2" >
                    <div className="space-y-10 h-full">
                        <div className="w-full space-y-5 mb-5 lg:mb-0">
                            <div className="space-y-3">
                                <h5 className="font-bold text-lg">Preview Image</h5>
                                <div className="aspect-video bg-black overflow-hidden rounded-lg relative">
                                    <img src={image} alt="" className="w-full object-cover aspect-video" />
                                    <label className="absolute flex space-x-2 bg-purple-600 text-white right-3 bottom-3 px-2 py-1 rounded-md cursor-pointer hover:bg-purple-700 duration-500 ease-in-out">
                                        <Pencil width={14} />
                                        <span>Change image</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={onImageChange} />
                                    </label>
                                </div>
                                <p>Preview Image has 16:9 aspect ratio</p>
                            </div>
                            <div className="space-y-3">
                                <h5 className="font-bold text-lg">Title</h5>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 rounded-lg shadow focus:outline-none 
										focus:border-indigo-500 focus:ring focus:ring-indigo-200 
										transition duration-150 ease-in-out bg-white dark:bg-meta-4"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-3">
                                <h5 className="font-bold text-lg">Description</h5>
                                <textarea
                                    className="w-full px-3 py-2 rounded-lg shadow focus:outline-none 
										focus:border-indigo-500 focus:ring focus:ring-indigo-200 
										transition duration-150 ease-in-out bg-white dark:bg-meta-4"
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="space-y-3">
                                <h5 className="font-bold text-lg">Tags</h5>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg shadow focus:outline-none 
											focus:border-indigo-500 focus:ring focus:ring-indigo-200 
											transition duration-150 ease-in-out bg-white dark:bg-meta-4"
                                        value={tagValue}
                                        onChange={e => setTagValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    {tagValue && <ChevronRight
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs 
											text-purple-600 cursor-pointer" onClick={submitTagHandler} />}
                                </div>
                                {
                                    tagArr.length > 0 &&
                                    <div className="w-full">
                                        <p className="text-end">{tagArr.length}/20</p>
                                        <div className="flex flex-wrap gap-3">
                                            {
                                                tagArr.map((tag, index) => {
                                                    return (
                                                        <TagItem key={index} content={tag.tag} randomColor={tag.randomColor} onDelete={() => deleteTagHandler(tag.tag)} />
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="space-y-3">
                                <h5 className="font-bold text-lg">Time Stream</h5>
                                <DatePicker
                                    className="dark:bg-meta-4 dark:border-none w-full px-4 py-2"
                                    showTime={{ format: 'HH:mm' }}
                                    format="YYYY-MM-DD HH:mm"
                                    value={selectedTime}
                                    disabled
                                />
                            </div>
                            <div className="space-y-3">
                                <h5 className="font-bold text-lg">Rerun</h5>
                                <div className="flex space-x-5">
                                    <input type="checkbox" />
                                    <span className="text-base">Let viewers know your stream was previously recorded. Failure to label Reruns leads to viewer confusion which damages trust.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal
                className='bg-slate-100 dark:bg-slate-700 rounded-lg dark:text-slate-200'
                centered
                open={showDeleteModal}
                okButtonProps={{ type: "primary", className: "bg-red-600 text-white hover:!bg-red-700" }}
                cancelButtonProps={{ className: 'border-purple-600 hover:!border-purple-700 hover:!text-purple-700' }}
                onOk={handleDelete}
                okText="Delete"
                closable={false}
                confirmLoading={deletePending}
                onCancel={() => setShowDeleteModal(false)}
            >
                <div className="flex gap-4">
                    <CircleAlert className="text-red-600" size={48} />
                    <div>
                        <div className="text-lg font-semibold">
                            Delete {selectedRowKeys.length} {selectedRowKeys.length > 1 ? "streams" : "stream"}?
                        </div>
                        <div>
                            Everything related to {selectedRowKeys.length > 1 ? "these streams" : "this stream"} will be deleted along with it. This action cannot be undone.
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default SavedStreamsPage;
