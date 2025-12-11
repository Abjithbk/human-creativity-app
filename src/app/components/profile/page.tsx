"use client";
import React, { useState } from "react";
import { Camera, Shield, Share2, User } from "lucide-react";

interface UserProfile {
  name: string;
  handle: string;
  bio: string;
  creations: number;
  followers: string;
  following: number;
  profileImageUrl: string;
}

const mockUser: UserProfile = {
  name: "Elena R.",
  handle: "@creative_soul",
  bio: "Preserving the human touch.\nWatercolors & Ink.",
  creations: 42,
  followers: "4.2k",
  following: 150,
  profileImageUrl: "https://placehold.co/100x100/1e293b/ffffff?text=ER",
};

type Tab = "Creations" | "About";

const StatItem: React.FC<{ value: string | number; label: string }> = ({
  value,
  label,
}) => (
  <div className="flex flex-col items-center">
    <span className="text-xl font-bold text-gray-800 dark:text-white">
      {value}
    </span>
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
  </div>
);

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Creations");

  const profileRingStyle: React.CSSProperties = {
    padding: "4px",
    borderRadius: "50%",
    background: "linear-gradient(45deg, #4F46E5 0%, #06B6D4 100%)",
    boxShadow:
      "0 0 16px rgba(79, 70, 229, 0.4), 0 0 26px rgba(6, 182, 212, 0.4)",
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black transition-colors duration-300 overflow-x-hidden ">
      <div
        className="
        w-full px-4
      "
      >
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-10">
          <div style={profileRingStyle} className="mb-4 relative">
            <img
              src={mockUser.profileImageUrl}
              alt={`${mockUser.name}'s profile`}
              className="w-28 h-28 object-cover rounded-full bg-gray-800 border-2 border-black"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://placehold.co/112x112/1e293b/ffffff?text=ER";
              }}
            />

            <div className="absolute bottom-1 right-1 bg-gray-800 p-1.5 rounded-full border border-gray-600 cursor-pointer transition hover:bg-gray-700">
              <Camera size={14} className="text-white" />
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-1">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {mockUser.name}
            </h1>
            <Shield size={20} className="text-indigo-400" />
          </div>

          <p className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 mb-4">
            {mockUser.handle}
          </p>

          <p className="text-center text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed mb-6 max-w-xs">
            {mockUser.bio}
          </p>

          {/* Stats Section */}
          <div className="flex items-center justify-center gap-12 w-full mb-8 py-4 border-y border-gray-200 dark:border-gray-800 bg-gray-50/40 dark:bg-transparent">
            <StatItem value={mockUser.creations} label="Creations" />
            <StatItem value={mockUser.followers} label="Followers" />
            <StatItem value={mockUser.following} label="Following" />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-6 w-full mb-10">
            <button
              className="
      px-8 py-3
      bg-gradient-to-r from-indigo-500 to-purple-500
      text-white font-semibold rounded-full
      shadow-lg hover:opacity-90 transition
    "
            >
              Edit Profile
            </button>

            <button
              className="
      px-8 py-3
      bg-white dark:bg-gray-800
      text-gray-700 dark:text-white
      font-semibold rounded-full
      border border-gray-300 dark:border-gray-700
      shadow-md hover:bg-gray-100 dark:hover:bg-gray-700
      transition
      flex items-center gap-2
    "
            >
              <Share2 size={18} />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 w-full justify-center">
          {(["Creations", "About"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-8 py-3 text-lg font-medium relative transition
                ${
                  activeTab === tab
                    ? "text-indigo-500"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                }
              `}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-sm shadow-sm" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-8 text-center text-gray-500 dark:text-gray-400 p-4">
          {activeTab === "Creations" ? (
            <p className="flex flex-col items-center justify-center h-32">
              <User size={24} className="mb-2" />
              This is where Elena's art creations would appear.
            </p>
          ) : (
            <p className="h-32 flex items-center justify-center">
              Personal & professional details of Elena R.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
