"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Camera, Shield, Share2, User, Grid3X3, Info, Sparkles,
  MapPin, Link, Heart, Eye, Bookmark, MoreHorizontal, Edit3, ChevronRight,
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

/* ── Animated Counter ───────────────────────────────────────── */
const AnimatedCounter: React.FC<{ target: number; duration?: number }> = ({ target, duration = 1200 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    if (target === 0) return;
    const observer = new IntersectionObserver(([entry]) => {
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
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{count}</span>;
};

/* ── Stat Card ──────────────────────────────────────────────── */
const StatCard: React.FC<{ value: number; label: string; icon: React.ReactNode }> = ({ value, label, icon }) => (
  <div className="p-stat-card">
    <div className="p-stat-icon">{icon}</div>
    <span className="p-stat-value"><AnimatedCounter target={value} /></span>
    <span className="p-stat-label">{label}</span>
  </div>
);

/* ── Post Thumb ─────────────────────────────────────────────── */
const PostThumbnail: React.FC<{ post: Post; index: number }> = ({ post, index }) => (
  <div className="p-post-thumb" style={{ animationDelay: `${index * 60}ms` }}>
    <img
      src={post.image || "https://placehold.co/320x320/0f0f1a/6366f1?text=✦"}
      alt={post.title || "Creation"}
      className="p-post-img"
      onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/320x320/0f0f1a/6366f1?text=✦"; }}
    />
    <div className="p-post-overlay">
      <div className="p-post-meta">
        {post.likes !== undefined && <span className="p-post-stat"><Heart size={14} /> {post.likes}</span>}
        {post.views !== undefined && <span className="p-post-stat"><Eye size={14} /> {post.views}</span>}
      </div>
    </div>
  </div>
);

/* ── Profile Page ───────────────────────────────────────────── */
const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Creations");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/profile/", { headers: { Authorization: `Bearer ${token}` } });
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
        /* ════════════════════════════════════════════════════
           DESIGN TOKENS — Light (Now the Base Default)
        ════════════════════════════════════════════════════ */
        .p-root {
          --bg:            #ffffff; /* Adjusted to blend seamlessly with sidebar */
          --surface:       rgba(255,255,255,0.88);
          --surface2:      rgba(255,255,255,0.72);
          --border:        rgba(99,102,241,0.13);
          --border2:       rgba(99,102,241,0.09);
          --divider:       rgba(0,0,0,0.07);
          --text:          #12122a;
          --text-sub:      rgba(20,20,55,0.65);
          --text-muted:    rgba(20,20,55,0.5);
          --text-dim:      rgba(20,20,55,0.32);
          --avatar-bg:     linear-gradient(135deg,#dde0f8,#c8caee);
          --avatar-fg:     #6366f1;
          --avatar-ring:   #ffffff;
          --btn2-bg:       rgba(0,0,0,0.045);
          --btn2-fg:       rgba(20,20,55,0.82);
          --btn2-border:   rgba(0,0,0,0.12);
          --btn2-hover:    rgba(0,0,0,0.08);
          --icon-bg:       rgba(99,102,241,0.09);
          --tab-off:       rgba(20,20,55,0.45);
          --tab-hover-bg:  rgba(0,0,0,0.04);
          --tab-hover-fg:  rgba(20,20,55,0.72);
          --empty-bg:      rgba(255,255,255,0.65);
          --empty-border:  rgba(99,102,241,0.18);
          --skel-a:        rgba(0,0,0,0.05);
          --skel-b:        rgba(0,0,0,0.11);
          --aurora1:       rgba(99,102,241,0.06);
          --aurora2:       rgba(139,92,246,0.05);
          --hero-glow:     rgba(99,102,241,0.07);
          --stat-hover:    rgba(99,102,241,0.06);
          --badge-bg:      rgba(99,102,241,0.09),rgba(139,92,246,0.06);
          --badge-border:  rgba(99,102,241,0.25);
          --badge-fg:      #4f46e5;
          --overlay:       rgba(0,0,0,0.52);
        }

        /* ════════════════════════════════════════════════════
           DESIGN TOKENS — Dark (Triggered via App Class or OS)
        ════════════════════════════════════════════════════ */
        .dark .p-root,
        [data-theme="dark"] .p-root {
          --bg:            #050509;
          --surface:       rgba(255,255,255,0.045);
          --surface2:      rgba(255,255,255,0.03);
          --border:        rgba(255,255,255,0.08);
          --border2:       rgba(255,255,255,0.06);
          --divider:       rgba(255,255,255,0.055);
          --text:          #f0f0ff;
          --text-sub:      rgba(210,210,230,0.7);
          --text-muted:    rgba(200,200,220,0.5);
          --text-dim:      rgba(200,200,220,0.32);
          --avatar-bg:     linear-gradient(135deg,#1a1a3e,#0d0d1f);
          --avatar-fg:     #8b8fff;
          --avatar-ring:   #050509;
          --btn2-bg:       rgba(255,255,255,0.055);
          --btn2-fg:       rgba(225,225,245,0.85);
          --btn2-border:   rgba(255,255,255,0.1);
          --btn2-hover:    rgba(255,255,255,0.1);
          --icon-bg:       rgba(99,102,241,0.1);
          --tab-off:       rgba(200,200,220,0.45);
          --tab-hover-bg:  rgba(255,255,255,0.04);
          --tab-hover-fg:  rgba(200,200,220,0.75);
          --empty-bg:      rgba(255,255,255,0.02);
          --empty-border:  rgba(255,255,255,0.07);
          --skel-a:        rgba(255,255,255,0.04);
          --skel-b:        rgba(255,255,255,0.09);
          --aurora1:       rgba(99,102,241,0.13);
          --aurora2:       rgba(139,92,246,0.10);
          --hero-glow:     rgba(99,102,241,0.16);
          --stat-hover:    rgba(99,102,241,0.08);
          --badge-bg:      rgba(99,102,241,0.14),rgba(139,92,246,0.09);
          --badge-border:  rgba(99,102,241,0.3);
          --badge-fg:      #a5b4fc;
          --overlay:       rgba(5,5,9,0.75);
        }

        /* ════════════════════════════════════════════════════
           BASE
        ════════════════════════════════════════════════════ */
        .p-root {
          min-height: 100vh;
          height: 100%;
          background: var(--bg); 
          color: var(--text);
          font-family: var(--font-geist-sans,'Inter',sans-serif);
          position: relative; 
          overflow-x: hidden;
          transition: background .3s, color .3s;
        }

        /* ── Aurora bg ─────────────────────────────────── */
        .p-aurora{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;}
        .p-aurora::before{
          content:'';position:absolute;top:-30%;left:-20%;width:80%;height:80%;
          background:radial-gradient(ellipse at center,var(--aurora1) 0%,transparent 70%);
          animation:aur1 12s ease-in-out infinite alternate;
        }
        .p-aurora::after{
          content:'';position:absolute;bottom:-20%;right:-20%;width:70%;height:70%;
          background:radial-gradient(ellipse at center,var(--aurora2) 0%,transparent 70%);
          animation:aur2 15s ease-in-out infinite alternate;
        }
        @keyframes aur1{from{transform:translate(0,0) scale(1);}to{transform:translate(8%,6%) scale(1.15);}}
        @keyframes aur2{from{transform:translate(0,0) scale(1);}to{transform:translate(-6%,-8%) scale(1.2);}}

        /* ── Inner ─────────────────────────────────────── */
        .p-inner{position:relative;z-index:1;max-width:900px;margin:0 auto;padding:2rem 1rem 6rem;}

        /* ── Hero card ─────────────────────────────────── */
        .p-hero{
          background:var(--surface);border:1px solid var(--border);
          border-radius:28px;padding:2.5rem 2rem 2rem;
          backdrop-filter:blur(20px);position:relative;overflow:hidden;
          margin-bottom:1.5rem;box-shadow:0 4px 32px rgba(0,0,0,0.06);
        }
        .p-hero::before{
          content:'';position:absolute;top:0;left:0;right:0;height:1px;
          background:linear-gradient(90deg,transparent,rgba(99,102,241,.6),rgba(139,92,246,.6),transparent);
        }
        .p-hero-glow{
          position:absolute;top:-60px;right:-60px;width:220px;height:220px;
          background:radial-gradient(circle,var(--hero-glow) 0%,transparent 65%);pointer-events:none;
        }

        /* ── Avatar ────────────────────────────────────── */
        .p-av-wrap{display:flex;flex-direction:column;align-items:center;margin-bottom:1.5rem;}
        .p-av-ring{
          position:relative;padding:3px;border-radius:50%;
          background:linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4);
          box-shadow:0 0 32px rgba(99,102,241,.35),0 0 60px rgba(139,92,246,.15);
          margin-bottom:1rem;cursor:pointer;transition:transform .3s,box-shadow .3s;
        }
        .p-av-ring:hover{transform:scale(1.04);box-shadow:0 0 46px rgba(99,102,241,.6),0 0 80px rgba(139,92,246,.28);}
        .p-av-img{width:110px;height:110px;border-radius:50%;object-fit:cover;border:3px solid var(--avatar-ring);display:block;}
        .p-av-ph{
          width:110px;height:110px;border-radius:50%;
          background:var(--avatar-bg);border:3px solid var(--avatar-ring);
          display:flex;align-items:center;justify-content:center;
          font-size:2rem;font-weight:800;color:var(--avatar-fg);letter-spacing:-.02em;
        }
        .p-av-cam{
          position:absolute;bottom:4px;right:4px;background:rgba(99,102,241,.9);
          border-radius:50%;width:28px;height:28px;display:flex;align-items:center;
          justify-content:center;border:2px solid var(--avatar-ring);cursor:pointer;transition:background .2s;
        }
        .p-av-cam:hover{background:rgba(99,102,241,1);}

        /* ── Name / handle ─────────────────────────────── */
        .p-name-row{display:flex;align-items:center;gap:8px;margin-bottom:4px;}
        .p-name{font-size:1.75rem;font-weight:800;color:var(--text);letter-spacing:-.03em;margin:0;}
        .p-handle{
          font-size:.9rem;font-weight:500;margin-bottom:.75rem;
          background:linear-gradient(90deg,#818cf8,#a78bfa,#38bdf8);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .p-bio{font-size:.9rem;color:var(--text-sub);text-align:center;max-width:340px;line-height:1.65;margin-bottom:1rem;}
        .p-meta-row{display:flex;gap:1rem;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;justify-content:center;}
        .p-meta-item{display:flex;align-items:center;gap:5px;font-size:.8rem;color:var(--text-muted);}

        /* ── Stats ─────────────────────────────────────── */
        .p-stats{display:flex;justify-content:center;gap:1rem;width:100%;margin-bottom:1.75rem;flex-wrap:wrap;}
        .p-stat-card{
          display:flex;flex-direction:column;align-items:center;gap:4px;
          background:var(--surface);border:1px solid var(--border);
          border-radius:16px;padding:.9rem 1.4rem;min-width:90px;
          transition:background .2s,transform .2s,box-shadow .2s;
        }
        .p-stat-card:hover{background:var(--stat-hover);transform:translateY(-2px);box-shadow:0 4px 16px rgba(99,102,241,.1);}
        .p-stat-icon{color:#6366f1;margin-bottom:2px;}
        .p-stat-value{font-size:1.4rem;font-weight:800;color:var(--text);letter-spacing:-.03em;}
        .p-stat-label{font-size:.72rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.08em;font-weight:600;}

        /* ── Buttons ───────────────────────────────────── */
        .p-btn-row{display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap;}
        .p-btn-primary{
          display:flex;align-items:center;gap:8px;padding:.65rem 1.75rem;
          background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;
          font-weight:700;font-size:.875rem;border-radius:50px;border:none;cursor:pointer;
          transition:opacity .2s,transform .2s,box-shadow .2s;
          box-shadow:0 4px 20px rgba(99,102,241,.35);letter-spacing:.01em;
        }
        .p-btn-primary:hover{opacity:.91;transform:translateY(-1px);box-shadow:0 8px 28px rgba(99,102,241,.5);}
        .p-btn-sec{
          display:flex;align-items:center;gap:8px;padding:.65rem 1.5rem;
          background:var(--btn2-bg);color:var(--btn2-fg);font-weight:600;font-size:.875rem;
          border-radius:50px;border:1px solid var(--btn2-border);cursor:pointer;
          transition:background .2s,transform .2s;letter-spacing:.01em;
        }
        .p-btn-sec:hover{background:var(--btn2-hover);transform:translateY(-1px);}
        .p-btn-icon{
          display:flex;align-items:center;justify-content:center;
          width:38px;height:38px;background:var(--btn2-bg);
          border:1px solid var(--btn2-border);border-radius:50%;cursor:pointer;
          transition:background .2s;color:var(--text-muted);
        }
        .p-btn-icon:hover{background:var(--btn2-hover);}

        /* ── Tabs ──────────────────────────────────────── */
        .p-tabs{
          background:var(--surface2);border:1px solid var(--border2);
          border-radius:20px;padding:.35rem;display:flex;gap:.25rem;
          margin-bottom:1.5rem;width:fit-content;margin-left:auto;margin-right:auto;
        }
        .p-tab{
          display:flex;align-items:center;gap:7px;padding:.55rem 1.5rem;
          border-radius:14px;border:none;background:transparent;color:var(--tab-off);
          font-size:.85rem;font-weight:600;cursor:pointer;transition:all .25s;letter-spacing:.02em;
        }
        .p-tab.active{
          background:linear-gradient(135deg,rgba(99,102,241,.2),rgba(139,92,246,.14));
          color:#6366f1;border:1px solid rgba(99,102,241,.26);
        }
        .p-tab:not(.active):hover{background:var(--tab-hover-bg);color:var(--tab-hover-fg);}

        /* ── Grid ──────────────────────────────────────── */
        .p-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;border-radius:20px;overflow:hidden;}
        @media(max-width:500px){.p-grid{grid-template-columns:repeat(2,1fr);}}
        .p-post-thumb{position:relative;aspect-ratio:1;overflow:hidden;cursor:pointer;animation:fadeUp .5s ease both;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
        .p-post-img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s;}
        .p-post-thumb:hover .p-post-img{transform:scale(1.07);}
        .p-post-overlay{
          position:absolute;inset:0;
          background:linear-gradient(to top,var(--overlay) 0%,transparent 60%);
          opacity:0;transition:opacity .3s;display:flex;align-items:flex-end;padding:.6rem;
        }
        .p-post-thumb:hover .p-post-overlay{opacity:1;}
        .p-post-meta{display:flex;gap:.75rem;}
        .p-post-stat{display:flex;align-items:center;gap:4px;font-size:.78rem;color:#fff;font-weight:600;}

        /* ── Empty ─────────────────────────────────────── */
        .p-empty{
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          padding:4rem 1rem;gap:1rem;color:var(--text-dim);
          background:var(--empty-bg);border:1px dashed var(--empty-border);border-radius:20px;
        }
        .p-empty-icon{
          width:64px;height:64px;background:var(--icon-bg);border-radius:50%;
          display:flex;align-items:center;justify-content:center;color:rgba(99,102,241,.5);
        }
        .p-empty h3{margin:0;font-size:1rem;font-weight:700;color:var(--text-muted);}
        .p-empty p{margin:0;font-size:.82rem;text-align:center;max-width:220px;line-height:1.5;}

        /* ── About ─────────────────────────────────────── */
        .p-about{
          background:var(--surface2);border:1px solid var(--border2);
          border-radius:20px;padding:1.75rem;
          display:flex;flex-direction:column;gap:1.25rem;
          box-shadow:0 2px 16px rgba(0,0,0,0.04);
        }
        .p-about-row{display:flex;align-items:center;gap:1rem;font-size:.88rem;color:var(--text-sub);}
        .p-about-row strong{color:var(--text);font-weight:700;}
        .p-about-icon{
          width:36px;height:36px;background:var(--icon-bg);border-radius:10px;
          display:flex;align-items:center;justify-content:center;color:#818cf8;flex-shrink:0;
        }
        .p-divider{border:none;border-top:1px solid var(--divider);margin:0;}

        /* ── Skeleton ──────────────────────────────────── */
        .p-skel{
          background:linear-gradient(90deg,var(--skel-a) 25%,var(--skel-b) 50%,var(--skel-a) 75%);
          background-size:200% 100%;animation:shimmer 1.6s infinite;border-radius:12px;
        }
        @keyframes shimmer{from{background-position:200% 0;}to{background-position:-200% 0;}}

        /* ── Badge ─────────────────────────────────────── */
        .p-badge{
          display:inline-flex;align-items:center;gap:4px;
          background:linear-gradient(135deg,var(--badge-bg));
          border:1px solid var(--badge-border);border-radius:20px;
          padding:3px 10px;font-size:.72rem;font-weight:700;
          color:var(--badge-fg);letter-spacing:.06em;text-transform:uppercase;
        }
      `}</style>

      <div className="p-root">
        <div className="p-aurora" />
        <div className="p-inner">

          {/* ── Hero ── */}
          <div className="p-hero">
            <div className="p-hero-glow" />

            {/* Avatar */}
            <div className="p-av-wrap">
              <div className="p-av-ring">
                {isLoading
                  ? <div className="p-skel" style={{ width: 110, height: 110, borderRadius: "50%" }} />
                  : <div className="p-av-ph">{initials}</div>
                }
                <div className="p-av-cam"><Camera size={13} color="white" /></div>
              </div>

              {isLoading
                ? <div className="p-skel" style={{ width: 160, height: 28, marginBottom: 8 }} />
                : <div className="p-name-row">
                    <h1 className="p-name">{username}</h1>
                    <Shield size={18} style={{ color: "#818cf8" }} />
                  </div>
              }

              <p className="p-handle">@{username?.toLowerCase()}</p>
              <div style={{ marginBottom: ".75rem" }}>
                <span className="p-badge"><Sparkles size={11} /> Creator</span>
              </div>
              <p className="p-bio">
                Bringing authentic human expression to life — one creation at a time.
              </p>
              <div className="p-meta-row">
                <span className="p-meta-item"><MapPin size={13} /> Earth</span>
                <span className="p-meta-item"><Link size={13} /> humancreativity.app</span>
              </div>
            </div>

            {/* Stats */}
            <div className="p-stats">
              <StatCard value={posts.length} label="Creations" icon={<Grid3X3 size={16} />} />
              <StatCard value={90} label="Followers" icon={<Heart size={16} />} />
              <StatCard value={70} label="Following" icon={<Eye size={16} />} />
              <StatCard value={posts.reduce((a, p) => a + (p.likes ?? 0), 0) || 248} label="Total Likes" icon={<Bookmark size={16} />} />
            </div>

            {/* Buttons */}
            <div className="p-btn-row">
              <button className="p-btn-primary"><Edit3 size={15} /> Edit Profile</button>
              <button className="p-btn-sec"><Share2 size={15} /> Share</button>
              <button className="p-btn-icon" title="More"><MoreHorizontal size={16} /></button>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="p-tabs">
            {(["Creations", "About"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`p-tab${activeTab === tab ? " active" : ""}`}
              >
                {tab === "Creations" ? <Grid3X3 size={14} /> : <Info size={14} />}
                {tab}
              </button>
            ))}
          </div>

          {/* ── Tab content ── */}
          {activeTab === "Creations" ? (
            posts.length > 0 ? (
              <div className="p-grid">
                {posts.map((post, i) => <PostThumbnail key={post.id ?? i} post={post} index={i} />)}
              </div>
            ) : (
              <div className="p-empty">
                <div className="p-empty-icon"><Sparkles size={28} /></div>
                <h3>No creations yet</h3>
                <p>Your artwork, photos, and creative works will appear here.</p>
                <button className="p-btn-primary" style={{ marginTop: ".5rem" }}>
                  <ChevronRight size={15} /> Start Creating
                </button>
              </div>
            )
          ) : (
            <div className="p-about">
              <div className="p-about-row">
                <div className="p-about-icon"><User size={16} /></div>
                <div>
                  <strong>{username}</strong>
                  <div>Human Creativity Platform Member</div>
                </div>
              </div>
              <hr className="p-divider" />
              <div className="p-about-row">
                <div className="p-about-icon"><MapPin size={16} /></div>
                <div>Earth · Online</div>
              </div>
              <hr className="p-divider" />
              <div className="p-about-row">
                <div className="p-about-icon"><Sparkles size={16} /></div>
                <div>Member since 2024 · Creator tier</div>
              </div>
              <hr className="p-divider" />
              <div className="p-about-row">
                <div className="p-about-icon"><Grid3X3 size={16} /></div>
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