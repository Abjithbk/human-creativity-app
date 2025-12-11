import React, { useState ,useRef} from 'react';
import { User, Lock, ShieldCheck, Bell, Eye, DollarSign,FileText, Shield, AlertTriangle, ChevronRight, LogOut,
ArrowLeft,Check,Camera,Upload,Loader2} from 'lucide-react';
const EditProfile = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  const handleSave = () => {
    if (status !== 'idle') return; 
    setStatus('saving');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    }, 1500);
  };
return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden" 
      />
      <div className="flex items-center gap-6">
        <div 
          onClick={handleAvatarClick}
          className="w-24 h-24 rounded-full bg-zinc-200 dark:bg-zinc-800 relative group cursor-pointer overflow-hidden border-2 border-transparent hover:border-purple-500 transition-all"
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover"/>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400">
               <User size={40} />
            </div>
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
            <Camera className="text-white mb-1" size={20} />
            <span className="text-[10px] text-white font-bold uppercase tracking-wide">Edit</span>
          </div>
        </div>

        <div>
          <button 
            onClick={handleAvatarClick}
            className="text-purple-600 dark:text-purple-400 font-bold text-sm hover:underline flex items-center gap-2"
          >
            <Upload size={16} />
            Change Photo
          </button>
          <p className="text-xs text-zinc-500 mt-1">JPG, PNG or GIF. Max 5MB.</p>
        </div>
      </div>
      <div className="grid gap-4">
        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Display Name</label>
          <input type="text" defaultValue="Artist Name" className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-zinc-900 dark:text-white" />
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Username</label>
          <input type="text" defaultValue="@artist_name" className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-zinc-900 dark:text-white" />
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Bio</label>
          <textarea defaultValue="Traditional Ink Artist based in Tokyo." className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-zinc-900 dark:text-white" />
        </div>
      </div>
      <button 
        onClick={handleSave}
        disabled={status !== 'idle'}
        className={`
          w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg
          ${status === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-zinc-900 dark:bg-white text-white dark:text-black hover:opacity-90'}
          ${status === 'saving' ? 'opacity-80 cursor-wait' : ''}
        `}
      >
        {status === 'idle' && (
          <span>Save Changes</span>
        )}

        {status === 'saving' && (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>Saving...</span>
          </>
        )}

        {status === 'success' && (
          <>
            <Check size={20} />
            <span>Changes Saved!</span>
          </>
        )}
      </button>
    </div>
  );
};
const ChangePassword = () => (
  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
    <input type="password" placeholder="Current Password" className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" />
    <input type="password" placeholder="New Password" className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" />
    <input type="password" placeholder="Confirm New Password" className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" />
    <button className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors mt-4">
      Update Password
    </button>
  </div>
);

const Verification = () => (
  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
    <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6 mb-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center text-white">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg">You are Verified</h3>
          <p className="text-sm text-zinc-500">Your identity has been confirmed.</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-purple-600 font-medium bg-white/50 dark:bg-black/20 p-3 rounded-lg w-fit">
        <Check size={16} />
        <span>Verified since Dec 2024</span>
      </div>
    </div>
  </div>
);

const NotificationSettings = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
    {['New Followers', 'Likes & Comments', 'Mentions', 'Product Updates', 'Email Newsletters'].map((label, i) => (
      <div key={i} className="flex items-center justify-between p-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded-lg transition-colors">
        <span className="font-medium text-zinc-700 dark:text-zinc-200">{label}</span>
        <div className="w-11 h-6 bg-purple-600 rounded-full relative cursor-pointer">
          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
        </div>
      </div>
    ))}
  </div>
);

const Monetization = () => (
  <div className="animate-in fade-in slide-in-from-right-4 duration-300 text-center py-10">
    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
      <DollarSign size={40} />
    </div>
    <h3 className="text-2xl font-bold mb-2">Monetization Active</h3>
    <p className="text-zinc-500 mb-8 max-w-sm mx-auto">
      You are currently earning revenue from your content views and premium subscribers.
    </p>
    <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-6 grid grid-cols-2 gap-4 max-w-md mx-auto">
      <div className="text-center">
        <div className="text-xs font-bold text-zinc-500 uppercase mb-1">This Month</div>
        <div className="text-2xl font-bold">$1,240.50</div>
      </div>
      <div className="text-center border-l border-zinc-200 dark:border-zinc-800">
        <div className="text-xs font-bold text-zinc-500 uppercase mb-1">Total</div>
        <div className="text-2xl font-bold">$14,302.00</div>
      </div>
    </div>
  </div>
);

const ContentFiltering = () => <div className="p-4 text-zinc-500">Content filtering options...</div>;
const CommunityGuidelines = () => <div className="p-4 text-zinc-500">Read our guidelines here...</div>;
const PrivacyPolicy = () => <div className="p-4 text-zinc-500">Privacy Policy details...</div>;
const ReportProblem = () => <div className="p-4 text-zinc-500">Report a bug or issue...</div>;

export default function Settings() {

  const [activeView, setActiveView] = useState<string | null>(null);
  const SettingItem = ({ 
    icon: Icon, 
    label, 
    viewId, 
    badge, 
    isDestructive 
  }: { 
    icon: any, 
    label: string, 
    viewId?: string, 
    badge?: string, 
    isDestructive?: boolean 
  }) => (
    <div 
      onClick={() => viewId && setActiveView(viewId)}
      className="flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <Icon 
          size={20} 
          className={`
            ${isDestructive ? 'text-red-500' : 'text-zinc-500 dark:text-zinc-400'} 
            group-hover:scale-105 transition-transform
          `} 
        />
        <span className={`text-sm font-medium ${isDestructive ? 'text-red-500' : 'text-zinc-700 dark:text-zinc-200'}`}>
          {label}
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        {badge && (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 uppercase tracking-wide">
            {badge}
          </span>
        )}
        {!isDestructive && (
          <ChevronRight size={16} className="text-zinc-300 dark:text-zinc-600 group-hover:translate-x-1 transition-transform" />
        )}
      </div>
    </div>
  );

  const SectionHeader = ({ label }: { label: string }) => (
    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 mt-8 ml-2">
      {label}
    </h3>
  );
  return (
    <div className="w-full max-w-4xl mx-auto pb-10 text-zinc-900 dark:text-white">
      <div className="mb-8 flex items-center gap-4">
        {activeView && (
          <button 
            onClick={() => setActiveView(null)}
            className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <h2 className="text-3xl font-bold">
          {activeView ? activeView : 'Settings'}
        </h2>
      </div>

      {!activeView && (
        <div className="animate-in fade-in duration-300">
          <SectionHeader label="Account & Security" />
          <div className="space-y-1">
            <SettingItem icon={User} label="Edit Profile" viewId="Edit Profile" />
            <SettingItem icon={Lock} label="Change Password" viewId="Change Password" />
            <SettingItem icon={ShieldCheck} label="Verification Status" viewId="Verification" badge="Verified" />
          </div>

          <SectionHeader label="Preferences" />
          <div className="space-y-1">
            <SettingItem icon={Bell} label="Notifications" viewId="Notifications" />
            <SettingItem icon={Eye} label="Content Filtering" viewId="Content Filtering" />
            <SettingItem icon={DollarSign} label="Monetization" viewId="Monetization" badge="Active" />
          </div>

          <SectionHeader label="Community" />
          <div className="space-y-1">
            <SettingItem icon={FileText} label="Community Guidelines" viewId="Guidelines" />
            <SettingItem icon={Shield} label="Privacy Policy" viewId="Privacy" />
            <SettingItem icon={AlertTriangle} label="Report a Problem" viewId="Report" />
          </div>

          <div className="mt-12">
            <button  className="w-full py-3 flex items-center justify-center gap-2 border border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl font-semibold transition-all duration-200 group">
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              Log Out
            </button>
          </div>
        </div>
      )}
      {activeView === 'Edit Profile' && <EditProfile />}
      {activeView === 'Change Password' && <ChangePassword />}
      {activeView === 'Verification' && <Verification />}
      {activeView === 'Notifications' && <NotificationSettings />}
      {activeView === 'Content Filtering' && <ContentFiltering />}
      {activeView === 'Monetization' && <Monetization />}
      {activeView === 'Guidelines' && <CommunityGuidelines />}
      {activeView === 'Privacy' && <PrivacyPolicy />}
      {activeView === 'Report' && <ReportProblem />}
      
    </div>
  );
}