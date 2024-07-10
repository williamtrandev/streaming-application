import { useState, useEffect } from 'react';
import { Bolt, Check, CircleX } from 'lucide-react';
import { AutoComplete, Flex, Skeleton } from 'antd';
import useDebounce from '../../hooks/useDebouce';
import { useSearchUsersForMod } from '../../api/search';
import ModalDeleteMod from '../../components/community/ModalDeleteMod';
import { useAddMod, useGetAllMod } from '../../api/studio';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { appName } from '../../constants';
import { formatRole } from '../../utils';
import { communitySteps } from '../../guides/steps';
import { TourProvider, useTour } from '@reactour/tour';
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import useLocalStorage from "../../hooks/useLocalStorage";

const fakeMode = [
	{ id: 1, username: "William Tran", role: "King", lastModified: "2020-01-01" },
	{ id: 2, username: "William Tran 2", role: "King", lastModified: "2020-01-01" },
	{ id: 3, username: "William Tran 3", role: "King", lastModified: "2020-01-01" },
	{ id: 4, username: "William Tran 4", role: "King", lastModified: "2020-01-01" },
	{ id: 5, username: "William Tran 5", role: "King", lastModified: "2020-01-01" },
]
const CommunityPage = () => {
	const { setIsOpen } = useTour();
	const [isFirstCommunity, setIsFirstCommunity] = useLocalStorage('isFirstCommunity', true);
	const { auth } = useAuth();
	const userId = auth?.user?._id;
	const [options, setOptions] = useState([]);
	const [value, setValue] = useState('');
	const searchText = useDebounce(value, 500);
	const { data: dataSearch, isLoading, error } = useSearchUsersForMod({ q: searchText, limit: 10, exclude: userId });
	const [modAddId, setModAddId] = useState(null);
	const [mods, setMods] = useState(fakeMode);
	const [deleteId, setDeleteId] = useState(null); 
	const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
	const { data: modsData, refetch: modsRefetch } = useGetAllMod(userId);
	const { mutate: addMod, isSuccess: isAddSuccess, isError: isAddError, error: addError } = useAddMod();
	const [modalEditOpen, setModalEditOpen] = useState(false);
	const [userIdClicked, setUserIdClicked] = useState(null);
	const [usernameClicked, setUsernameClicked] = useState('');
	const [isAdd, setIsAdd] = useState(false);
	console.log(modsData)
	const handleSelect = (value, option) => {
		setIsAdd(true);
        setValue(value);
		setModAddId(option.id);
    };
	const handleAddMod = () => {
        setIsAdd(false);
		setValue('');
		addMod({ modId: modAddId });
    };
	const handleClickDetail = (userId) => {
		console.log("CLICKED", userId)
		setModalEditOpen(true);
		setUserIdClicked(userId);
	}
	const handleClickDelete = (userId, title) => {
		console.log("CLICKED", userId)
		setModalDeleteOpen(true);
		setUserIdClicked(userId);
		setUsernameClicked(title);
	}
	useEffect(() => {
		if (searchText.length === 0) {
			setOptions([]);
		} else if (dataSearch && dataSearch.channels) {
			setOptions(
				dataSearch.channels.map(user => ({
					id: user._id,
					value: user.username,
					label: (
						<div className="flex items-center gap-4">
							<div className="w-8 h-8 rounded-full overflow-hidden">
								<img src={user?.profilePictureS3} alt="" className="w-full h-full object-cover" />
							</div>
							<div>
								<strong>{user.fullname}</strong> <br />
								<span style={{ color: 'gray' }}>{user.username}</span>
							</div>
						</div>
					),
				}))
			);
		}
	}, [dataSearch, searchText]);
	useEffect(() => {
		if(isAddSuccess) {
			toast.success('Add mod successfully');
			modsRefetch();
		}
		if(isAddError) {
			toast.error('Oops! Something went wrong');
		}
	}, [isAddSuccess, isAddError]);

	useEffect(() => {
		setIsOpen(isFirstCommunity);
	}, [isFirstCommunity]);

	useEffect(() => {
        document.title = `Community - ${appName}`;
    }, []);

	return (
		<div className="space-y-5">
			<div className="block">
				<div className="w-full flex justify-center items-center">
					<div className="w-full max-w-[30rem] relative bg-white shadow-md dark:bg-meta-4 rounded-lg p-3">
						<AutoComplete
						    className="text-black focus:outline-none xl:w-125 px-3 community-step-1"
							popupClassName="dark:bg-gray-800"
							options={options}
							value={value}
							placeholder="Search users..."
							onSearch={(text) => {
								setValue(text);
							}}
							onSelect={handleSelect}
							variant="borderless"
						/>
						<button className={`absolute right-5 top-1/2 -translate-y-1/2 ${isAdd ? 'bg-purple-700' : 'bg-purple-300'} text-white 
                            rounded-full p-1 community-step-2`} 
							onClick={handleAddMod}
						>
                            <Check width={14} height={14} />
                        </button>

					</div>
				</div>
			</div>
			<div className="w-full bg-white dark:bg-meta-4 overflow-hidden rounded-lg shadow-md">
				<div className="w-full overflow-x-auto">
					<table className="w-full whitespace-no-wrap community-step-3">
						<thead>
							<tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
								<th className="px-4 py-3">Account</th>
								<th className="px-4 py-3">Role</th>
								<th className="px-4 py-3">Start Date</th>
								<th className="px-4 py-3">Remove</th>
							</tr>
						</thead>
						{!modsData ?
							<tbody className="divide-y dark:divide-gray-700 dark:bg-gray-800">
								{[...Array(5)].map((_, index) => (
									<tr key={index} className="text-gray-700 dark:text-gray-400">
										<td className="px-4 py-3">
											<div className="flex items-center text-sm">
												<Skeleton.Input active size="small" style={{ width: 100 }} />
											</div>
										</td>
										<td className="px-4 py-3 text-xs">
											<Skeleton.Input active size="small" style={{ width: 80 }} />
										</td>
										<td className="px-4 py-3 text-sm">
											<Skeleton.Input active size="small" style={{ width: 100 }} />
										</td>
										<td className="px-4 py-3 text-sm">
											<div className="flex space-x-2">
												<Skeleton.Button active size="small" shape="circle" style={{ width: 32, height: 32 }} />
											</div>
										</td>
									</tr>
								))}
							</tbody>
							:
							<tbody className="divide-y dark:divide-gray-700 dark:bg-gray-800">
								{modsData?.data.map((mod, index) => {
									return (
										<tr key={index} className="text-gray-700 dark:text-gray-400">
											<td className="px-4 py-3">
												<div className="flex items-center text-sm">
													<div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
														<img className="object-cover w-full h-full rounded-full" src={mod?.profilePictureS3} alt="" loading="lazy" />
														<div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
													</div>
													<div>
														<p className="font-semibold">{mod?.username}</p>		
														<p className="text-xs text-gray-600 dark:text-gray-400">
															Mod
														</p>
													</div>
												</div>
											</td>
											<td className="px-4 py-3 text-xs">
												<span className="px-2 py-1 font-semibold leading-tight text-orange-700 bg-orange-100 rounded-full dark:text-white dark:bg-orange-600">
													{formatRole(mod.role)}
												</span>
											</td>
											<td className="px-4 py-3 text-sm">
												{mod?.updatedAt && new Date(mod.updatedAt).toLocaleString()}
											</td>
											<td className="px-4 py-3 text-sm">
												<div className="flex space-x-2">
													<div className="p-2 w-8 h-8 flex items-center justify-center text-center rounded-full font-semibold text-purple-700 bg-purple-100 dark:text-white dark:bg-purple-600 cursor-pointer" onClick={() => handleClickDelete(mod?.user?._id, mod?.user?.username)}>
														<CircleX />
													</div>
												</div>
											</td>
										</tr>
									)
								})}
								
			
							</tbody>
						}
					</table>
				</div>
			</div>
			<ModalDeleteMod open={modalDeleteOpen} setOpen={setModalDeleteOpen} username={usernameClicked} userId={userIdClicked} refetch={modsRefetch} />
		</div>
	)
}

const CommunityPageWithTour = () => {
	const disableBody = (target) => disableBodyScroll(target);
	const enableBody = (target) => enableBodyScroll(target);
	return (
		<TourProvider
			steps={communitySteps}
			afterOpen={disableBody}
			beforeClose={enableBody}
		>
			<CommunityPage />
		</TourProvider>
	)
}

export default CommunityPageWithTour;