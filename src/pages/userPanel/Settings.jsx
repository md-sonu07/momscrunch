import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Lock, User, ShieldCheck, ChevronRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../redux/thunk/userThunk';
import { toast } from 'react-hot-toast';
import UpdateProfileModal from '../../components/common/UpdateProfileModal';

const Settings = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.user);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const displayUser = profile || user;

    const handleUpdateProfile = async (newData) => {
        try {
            await dispatch(updateProfile(newData)).unwrap();
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error || "Update failed");
        }
    };

    return (
        <div className="py-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-30">
            <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-3xl p-8 lg:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none min-h-[60vh]">
                <div className="flex items-center gap-4 mb-12">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-inner">
                        <SettingsIcon size={24} className="text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Account Settings</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Manage your profile and preferences</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Setting Cards */}
                    {[
                        {
                            icon: User,
                            title: "Personal Info",
                            desc: "Update your name and contact details",
                            onClick: () => setIsUpdateModalOpen(true),
                            action: "Update Profile"
                        },
                        { icon: Lock, title: "Security", desc: "Change password and manage sessions" },
                        { icon: Bell, title: "Notifications", desc: "Configure how you receive updates" },
                        { icon: ShieldCheck, title: "Privacy", desc: "Control your data and visibility" }
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            onClick={item.onClick}
                            className="p-6 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-primary/30 transition-all group cursor-pointer bg-slate-50/50 dark:bg-slate-800/20"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm group-hover:bg-primary/10 transition-colors">
                                    <item.icon size={20} className="text-slate-400 group-hover:text-primary transition-colors" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight group-hover:text-primary transition-colors">{item.title}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-bold leading-relaxed">{item.desc}</p>

                                    {item.action && (
                                        <div className="mt-4 flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                            {item.action} <ChevronRight size={10} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Coming Soon Message */}
                <div className="mt-12 p-8 bg-primary/5 border border-primary/10 rounded-[2rem] text-center">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2 animate-pulse">Deep Configuration</p>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Advanced settings are currently under development.</h2>
                    <p className="text-xs text-slate-500 font-bold mt-2 uppercase tracking-widest">Expected in version 2.1</p>
                </div>
            </div>

            <UpdateProfileModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onSave={handleUpdateProfile}
                userData={displayUser}
            />
        </div>
    );
};

export default Settings;
