import React, { useState } from 'react';
import { Check } from 'lucide-react';

const fakeMode = [
	{ id: 1, username: "William Tran", role: "King", lastModified: "2020-01-01" },
	{ id: 2, username: "William Tran 2", role: "King", lastModified: "2020-01-01" },
	{ id: 3, username: "William Tran 3", role: "King", lastModified: "2020-01-01" },
	{ id: 4, username: "William Tran 4", role: "King", lastModified: "2020-01-01" },
	{ id: 5, username: "William Tran 5", role: "King", lastModified: "2020-01-01" },
]

const CommunityPage = () => {
	const [mods, setMods] = useState(fakeMode);
	const [deleteId, setDeleteId] = useState(null); 
	const [isModalOpen, setIsModalOpen] = useState(false); 
	const deleteMod = (id) => {
		setDeleteId(id);
		setIsModalOpen(true);
	};
	const [isAdd, setIsAdd] = useState(false);
	const confirmDelete = () => {
		const newMods = mods.filter(mod => mod.id !== deleteId); 
		setMods(newMods);
		setIsModalOpen(false); 
	}

	const closeModal = () => {
		setIsModalOpen(false); 
	}
	return (
		<div className="space-y-5">
			<div className="hidden sm:block">
				<div className="w-full flex justify-center items-center">
					<div className="relative bg-white shadow-md dark:bg-meta-4 rounded-lg p-3">
						<input
							type="search"
							placeholder="Type to search..."
							className="bg-transparent pr-9 pl-4 text-black focus:outline-none dark:text-white xl:w-125"
						/>
						<button className="absolute right-5 top-1/2 -translate-y-1/2 bg-purple-300 text-white 
							rounded-full p-1">
							<Check width={14} height={14} />
						</button>
					</div>
				</div>
			</div>
			<div className="w-full bg-white dark:bg-meta-4 overflow-hidden rounded-lg shadow-md">
				<div className="w-full overflow-x-auto">
					<table className="w-full whitespace-no-wrap">
						<thead>
							<tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
								<th className="px-4 py-3">Account</th>
								<th className="px-4 py-3">Role</th>
								<th className="px-4 py-3">Last Modified</th>
								<th className="px-4 py-3">Edit</th>
							</tr>
						</thead>
						<tbody className="divide-y dark:divide-gray-700 dark:bg-gray-800">
							{mods.map((mod, index) => {
								return (
									<tr key={index} className="text-gray-700 dark:text-gray-400">
										<td className="px-4 py-3">
											<div className="flex items-center text-sm">
												<div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
													<img className="object-cover w-full h-full rounded-full" src="https://avatars.githubusercontent.com/u/102520170?v=4" alt="" loading="lazy" />
													<div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
												</div>
												<div>
													<p className="font-semibold">William Tran</p>
													<p className="text-xs text-gray-600 dark:text-gray-400">
														Mod
													</p>
												</div>
											</div>
										</td>
										<td className="px-4 py-3 text-xs">
											<span className="px-2 py-1 font-semibold leading-tight text-orange-700 bg-orange-100 rounded-full dark:text-white dark:bg-orange-600">
												King
											</span>
										</td>
										<td className="px-4 py-3 text-sm">
											6/10/2020
										</td>
										<td className="px-4 py-3 text-sm">
											<div className="flex space-x-2">
												<p className="p-2 w-8 h-8 text-center rounded-full font-semibold text-orange-700 bg-orange-100 dark:text-white dark:bg-orange-600 cursor-pointer">
													!
												</p>
												<p className="p-2 w-8 h-8 text-center rounded-full font-semibold text-purple-700 bg-purple-100 dark:text-white dark:bg-purple-600 cursor-pointer" onClick={() => deleteMod(mod.id)}>
													-
												</p>
											</div>
										</td>
									</tr>
								)
							})}
							
		
						</tbody>
					</table>
				</div>
				{isModalOpen && (
	                <div className="fixed inset-0 flex items-center justify-center z-50">
						<div className="absolute inset-0 bg-black opacity-50"></div>
	                    <div className="bg-white dark:bg-meta-4 rounded-lg shadow-lg p-4 z-10">
	                        <p className="text-lg font-semibold mb-2">Confirm Delete</p>
	                        <p className="text-sm mb-4">Are you sure you want to delete this user?</p>
	                        <div className="flex justify-end">
	                            <button
	                                className="px-4 py-2 mr-2 text-sm text-white bg-purple-500 rounded hover:bg-purple-600 focus:outline-none"
	                                onClick={confirmDelete}
	                            >
	                                Delete
	                            </button>
	                            <button
	                                className="px-4 py-2 text-sm text-gray-700 bg-gray-300 rounded hover:bg-gray-400 focus:outline-none"
	                                onClick={closeModal}
	                            >
	                                Cancel
	                            </button>
	                        </div>
	                    </div>
	                </div>
	            )}
			</div>
		</div>
	)
}

export default CommunityPage;