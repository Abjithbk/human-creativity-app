"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Camera,
  Shield,
  Share2,
  User,
  Grid3X3,
  Info,
  Sparkles,
  MapPin,
  Link,
  Heart,
  Eye,
  Bookmark,
  MoreHorizontal,
  Edit3,
  ChevronRight,
} from "lucide-react";
import api from "@/app/lib/axios";

interface UserProfile {
  username: string;
  creations: number;
  post: Post[];
}

interface Post {
  id?: string | number;
  image?: string;
  title?: string;
  likes?: number;
  views?: number;
}

type Tab = "Creations" | "About";

/* ── Animated Number Counter ────────────────────────────────── */
const AnimatedCounter: React.FC<{ target: number; duration?: number }> = ({
  target,
  duration = 1200,
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (target === 0) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
};

/* ── Stat Card ───────────────────────────────────────────────── */
const StatCard: React.FC<{ value: number; label: string; icon: React.ReactNode }> = ({
  value,
  label,
  icon,
}) => (
  <div className="profile-stat-card">
    <div className="profile-stat-icon">{icon}</div>
    <span className="profile-stat-value">
      <AnimatedCounter target={value} />
    </span>
    <span className="profile-stat-label">{label}</span>
  </div>
);

/* ── Post Thumbnail ──────────────────────────────────────────── */
const PostThumbnail: React.FC<{ post: Post; index: number }> = ({ post, index }) => (
  <div
    className="profile-post-thumb"
    style={{ animationDelay: `${index * 60}ms` }}
  >
    <img
      src={post.image || `https://placehold.co/320x320/0f0f1a/6366f1?text=✦`}
      alt={post.title || "Creation"}
      className="profile-post-img"
      onError={(e) => {
        (e.target as HTMLImageElement).src =
          "https://placehold.co/320x320/0f0f1a/6366f1?text=✦";
      }}
    />
    <div className="profile-post-overlay">
      <div className="profile-post-meta">
        {post.likes !== undefined && (
          <span className="profile-post-stat">
            <Heart size={14} /> {post.likes}
          </span>
        )}
        {post.views !== undefined && (
          <span className="profile-post-stat">
            <Eye size={14} /> {post.views}
          </span>
        )}
      </div>
    </div>
  </div>
);

/* ── Main Profile Component ─────────────────────────────────── */
const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Creations");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data);
        setUserProfile(res.data);
      } catch (error: any) {
        console.log(error.response?.data);
      } finally {
        setIsLoading(false);
      }
    };
    getProfile();
  }, []);

  const posts: Post[] = userProfile?.post ?? [];
  const username = userProfile?.username ?? "Creator";
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <>
      <style>{`
        /* ── Base ─────────────────────────────────────────── */
        .profile-root {
          min-height: 100vh;
          background: #050509;
          color: #e8e8f0;
          font-family: var(--font-geist-sans, 'Inter', sans-serif);
          position: relative;
          overflow-x: hidden;
        }

        /* ── Background aurora ──────────────────────────── */
        .profile-aurora {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        .profile-aurora::before {
          content: '';
          position: absolute;
          top: -30%;
          left: -20%;
          width: 80%;
          height: 80%;
          background: radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, transparent 70%);
          animation: aurora1 12s ease-in-out infinite alternate;
        }
        .profile-aurora::after {
          content: '';
          position: absolute;
          bottom: -20%;
          right: -20%;
          width: 70%;
          height: 70%;
          background: radial-gradient(ellipse at center, rgba(139,92,246,0.10) 0%, transparent 70%);
          animation: aurora2 15s ease-in-out infinite alternate;
        }
        @keyframes aurora1 {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(8%, 6%) scale(1.15); }
        }
        @keyframes aurora2 {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(-6%, -8%) scale(1.2); }
        }

        /* ── Inner wrapper ──────────────────────────────── */
        .profile-inner {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1rem 6rem;
        }

        /* ── Hero card ──────────────────────────────────── */
        .profile-hero {
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 28px;
          padding: 2.5rem 2rem 2rem;
          backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }
        .profile-hero::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.6), rgba(139,92,246,0.6), transparent);
        }
        .profile-hero-accent {
          position: absolute;
          top: -60px; right: -60px;
          width: 220px; height: 220px;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 65%);
          pointer-events: none;
        }

        /* ── Avatar ─────────────────────────────────────── */
        .profile-avatar-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .profile-avatar-ring {
          position: relative;
          padding: 3px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
          box-shadow: 0 0 32px rgba(99,102,241,0.45), 0 0 60px rgba(139,92,246,0.2);
          margin-bottom: 1rem;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .profile-avatar-ring:hover {
          transform: scale(1.04);
          box-shadow: 0 0 45px rgba(99,102,241,0.6), 0 0 80px rgba(139,92,246,0.3);
        }
        .profile-avatar-img {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          object-fit: cover;
          background: #1a1a2e;
          border: 3px solid #050509;
          display: block;
        }
        .profile-avatar-placeholder {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1a1a3e 0%, #0d0d1f 100%);
          border: 3px solid #050509;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 800;
          color: #8b8fff;
          letter-spacing: -0.02em;
        }
        .profile-avatar-camera {
          position: absolute;
          bottom: 4px; right: 4px;
          background: rgba(99,102,241,0.9);
          border-radius: 50%;
          width: 28px; height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #050509;
          cursor: pointer;
          transition: background 0.2s;
        }
        .profile-avatar-camera:hover { background: rgba(99,102,241,1); }

        /* ── Name & handle ──────────────────────────────── */
        .profile-name-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .profile-name {
          font-size: 1.75rem;
          font-weight: 800;
          color: #f0f0ff;
          letter-spacing: -0.03em;
          margin: 0;
        }
        .profile-handle {
          font-size: 0.9rem;
          font-weight: 500;
          background: linear-gradient(90deg, #818cf8, #a78bfa, #38bdf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.75rem;
        }
        .profile-bio {
          font-size: 0.9rem;
          color: rgba(200,200,220,0.7);
          text-align: center;
          max-width: 340px;
          line-height: 1.65;
          margin-bottom: 1rem;
        }
        .profile-meta-row {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .profile-meta-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
          color: rgba(200,200,220,0.55);
        }

        /* ── Stats row ───────────────────────────────────── */
        .profile-stats-row {
          display: flex;
          justify-content: center;
          gap: 1rem;
          width: 100%;
          margin-bottom: 1.75rem;
          flex-wrap: wrap;
        }
        .profile-stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 0.9rem 1.4rem;
          min-width: 90px;
          transition: background 0.2s, transform 0.2s;
        }
        .profile-stat-card:hover {
          background: rgba(99,102,241,0.08);
          transform: translateY(-2px);
        }
        .profile-stat-icon {
          color: #6366f1;
          margin-bottom: 2px;
        }
        .profile-stat-value {
          font-size: 1.4rem;
          font-weight: 800;
          color: #f0f0ff;
          letter-spacing: -0.03em;
        }
        .profile-stat-label {
          font-size: 0.72rem;
          color: rgba(200,200,220,0.5);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 600;
        }

        /* ── Buttons ─────────────────────────────────────── */
        .profile-btn-row {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .profile-btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0.65rem 1.75rem;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          font-weight: 700;
          font-size: 0.875rem;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(99,102,241,0.35);
          letter-spacing: 0.01em;
        }
        .profile-btn-primary:hover {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(99,102,241,0.5);
        }
        .profile-btn-secondary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0.65rem 1.5rem;
          background: rgba(255,255,255,0.05);
          color: rgba(220,220,240,0.85);
          font-weight: 600;
          font-size: 0.875rem;
          border-radius: 50px;
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          letter-spacing: 0.01em;
        }
        .profile-btn-secondary:hover {
          background: rgba(255,255,255,0.09);
          transform: translateY(-1px);
        }
        .profile-btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px; height: 38px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.2s;
          color: rgba(200,200,220,0.7);
        }
        .profile-btn-icon:hover { background: rgba(255,255,255,0.1); }

        /* ── Tabs ────────────────────────────────────────── */
        .profile-tabs-wrap {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 0.35rem;
          display: flex;
          justify-content: center;
          gap: 0.25rem;
          margin-bottom: 1.5rem;
          width: fit-content;
          margin-left: auto;
          margin-right: auto;
        }
        .profile-tab {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 0.55rem 1.5rem;
          border-radius: 14px;
          border: none;
          background: transparent;
          color: rgba(200,200,220,0.5);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          letter-spacing: 0.02em;
        }
        .profile-tab.active {
          background: linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.2) 100%);
          color: #a5b4fc;
          border: 1px solid rgba(99,102,241,0.3);
        }
        .profile-tab:not(.active):hover {
          background: rgba(255,255,255,0.04);
          color: rgba(200,200,220,0.75);
        }

        /* ── Creations grid ──────────────────────────────── */
        .profile-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
          border-radius: 20px;
          overflow: hidden;
        }
        @media (max-width: 500px) {
          .profile-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .profile-post-thumb {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
          cursor: pointer;
          animation: fadeInUp 0.5s ease both;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .profile-post-img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        .profile-post-thumb:hover .profile-post-img {
          transform: scale(1.07);
        }
        .profile-post-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(5,5,9,0.75) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: flex-end;
          padding: 0.6rem;
        }
        .profile-post-thumb:hover .profile-post-overlay { opacity: 1; }
        .profile-post-meta {
          display: flex;
          gap: 0.75rem;
        }
        .profile-post-stat {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.78rem;
          color: white;
          font-weight: 600;
        }

        /* ── Empty state ─────────────────────────────────── */
        .profile-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 1rem;
          gap: 1rem;
          color: rgba(200,200,220,0.35);
          background: rgba(255,255,255,0.02);
          border: 1px dashed rgba(255,255,255,0.07);
          border-radius: 20px;
        }
        .profile-empty-icon {
          width: 64px; height: 64px;
          background: rgba(99,102,241,0.08);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(99,102,241,0.5);
        }
        .profile-empty h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
          color: rgba(200,200,220,0.5);
        }
        .profile-empty p {
          margin: 0;
          font-size: 0.82rem;
          text-align: center;
          max-width: 220px;
          line-height: 1.5;
        }

        /* ── About card ──────────────────────────────────── */
        .profile-about-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .profile-about-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.88rem;
          color: rgba(200,200,220,0.65);
        }
        .profile-about-row-icon {
          width: 36px; height: 36px;
          background: rgba(99,102,241,0.1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #818cf8;
          flex-shrink: 0;
        }
        .profile-about-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.05);
          margin: 0;
        }

        /* ── Skeleton loadng ─────────────────────────────── */
        .profile-skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.6s infinite;
          border-radius: 12px;
        }
        @keyframes shimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }

        /* ── Sparkles badge ──────────────────────────────── */
        .profile-verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1));
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 20px;
          padding: 3px 10px;
          font-size: 0.72rem;
          font-weight: 700;
          color: #a5b4fc;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
      `}</style>

      <div className="profile-root">
        <div className="profile-aurora" />

        <div className="profile-inner">
          {/* ── Hero Card ── */}
          <div className="profile-hero">
            <div className="profile-hero-accent" />

            {/* Avatar */}
            <div className="profile-avatar-wrap">
              <div className="profile-avatar-ring">
                {isLoading ? (
                  <div
                    className="profile-skeleton"
                    style={{ width: 110, height: 110, borderRadius: "50%" }}
                  />
                ) : (
                  <div className="profile-avatar-placeholder">{initials}</div>
                )}
                <div className="profile-avatar-camera">
                  <Camera size={13} color="white" />
                </div>
              </div>

              {/* Name */}
              {isLoading ? (
                <div className="profile-skeleton" style={{ width: 160, height: 28, marginBottom: 8 }} />
              ) : (
                <div className="profile-name-row">
                  <h1 className="profile-name">{username}</h1>
                  <Shield size={18} style={{ color: "#818cf8" }} />
                </div>
              )}

              {/* Handle & badge */}
              <p className="profile-handle">@{username?.toLowerCase()}</p>
              <div style={{ marginBottom: "0.75rem" }}>
                <span className="profile-verified-badge">
                  <Sparkles size={11} /> Creator
                </span>
              </div>

              {/* Bio */}
              <p className="profile-bio">
                Bringing authentic human expression to life — one creation at a time.
              </p>

              {/* Meta */}
              <div className="profile-meta-row">
                <span className="profile-meta-item">
                  <MapPin size={13} />
                  Earth
                </span>
                <span className="profile-meta-item">
                  <Link size={13} />
                  humancreativity.app
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="profile-stats-row">
              <StatCard
                value={posts.length}
                label="Creations"
                icon={<Grid3X3 size={16} />}
              />
              <StatCard
                value={90}
                label="Followers"
                icon={<Heart size={16} />}
              />
              <StatCard
                value={70}
                label="Following"
                icon={<Eye size={16} />}
              />
              <StatCard
                value={posts.reduce((acc, p) => acc + (p.likes ?? 0), 0) || 248}
                label="Total Likes"
                icon={<Bookmark size={16} />}
              />
            </div>

            {/* Action Buttons */}
            <div className="profile-btn-row">
              <button className="profile-btn-primary">
                <Edit3 size={15} />
                Edit Profile
              </button>
              <button className="profile-btn-secondary">
                <Share2 size={15} />
                Share
              </button>
              <button className="profile-btn-icon" title="More options">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="profile-tabs-wrap">
            {(["Creations", "About"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`profile-tab ${activeTab === tab ? "active" : ""}`}
              >
                {tab === "Creations" ? <Grid3X3 size={14} /> : <Info size={14} />}
                {tab}
              </button>
            ))}
          </div>

          {/* ── Tab Content ── */}
          {activeTab === "Creations" ? (
            posts.length > 0 ? (
              <div className="profile-grid">
                {posts.map((post, i) => (
                  <PostThumbnail key={post.id ?? i} post={post} index={i} />
                ))}
              </div>
            ) : (
              <div className="profile-empty">
                <div className="profile-empty-icon">
                  <Sparkles size={28} />
                </div>
                <h3>No creations yet</h3>
                <p>Your artwork, photos, and creative works will appear here.</p>
                <button
                  className="profile-btn-primary"
                  style={{ marginTop: "0.5rem" }}
                >
                  <ChevronRight size={15} />
                  Start Creating
                </button>
              </div>
            )
          ) : (
            <div className="profile-about-card">
              <div className="profile-about-row">
                <div className="profile-about-row-icon">
                  <User size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "rgba(220,220,240,0.85)", marginBottom: 2 }}>
                    {username}
                  </div>
                  <div>Human Creativity Platform Member</div>
                </div>
              </div>
              <hr className="profile-about-divider" />
              <div className="profile-about-row">
                <div className="profile-about-row-icon">
                  <MapPin size={16} />
                </div>
                <div>Earth · Online</div>
              </div>
              <hr className="profile-about-divider" />
              <div className="profile-about-row">
                <div className="profile-about-row-icon">
                  <Sparkles size={16} />
                </div>
                <div>Member since 2024 · Creator tier</div>
              </div>
              <hr className="profile-about-divider" />
              <div className="profile-about-row">
                <div className="profile-about-row-icon">
                  <Grid3X3 size={16} />
                </div>
                <div>{posts.length} creations shared with the community</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
