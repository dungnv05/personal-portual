import React, { useEffect, useState } from 'react'
import {
  WalletCards,
  Terminal,
  Mail,
  AppWindow,
  ChevronRight,
  Cpu,
  Kanban,
  ShieldAlert,
  ExternalLink,
  UserCheck,
  LogOut,
  LogIn,
  X,
  Lock,
  UserPlus,
  Gamepad2
} from 'lucide-react'
import {
  supabase,
  signInWithEmail,
  signUpWithEmail,
  signOutUser
} from './utils/sharedAuth'
import './App.css'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  // Auth Form State
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authMessage, setAuthMessage] = useState(null)

  useEffect(() => {
    // Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthMessage(null)

    try {
      if (isSignUp) {
        const { data, error } = await signUpWithEmail(authEmail, authPassword)
        if (error) throw error
        setAuthMessage({ type: 'success', text: 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận (nếu có).' })
      } else {
        const { data, error } = await signInWithEmail(authEmail, authPassword)
        if (error) throw error
        setCurrentUser(data.user)
        setShowAuthModal(false)
      }
    } catch (err) {
      setAuthMessage({ type: 'error', text: err.message || 'Thao tác thất bại. Vui lòng thử lại.' })
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOutUser()
    setCurrentUser(null)
  }

  const apps = [
    {
      name: "SalaryFlow",
      desc: "Công cụ tính lương Gross sang Net và ngược lại, cập nhật đầy đủ và chuẩn xác các chính sách bảo hiểm & thuế thu nhập cá nhân mới nhất năm 2026.",
      icon: <WalletCards />,
      url: "https://tinh-luong.yundev.space",
      status: "Active",
      color: "#06b6d4",
      tags: ["HTML5", "Vanilla CSS", "JavaScript", "Chart.js"]
    },
    {
      name: "Vang Vọng Sử Việt",
      desc: "Web Game 3D Idle Gacha thẻ bài đề tài lịch sử Việt Nam. Chiêu mộ danh nhân lịch sử, dàn trận 6v6, kích hoạt Hợp Kích, Thần Khí và Linh Vật thần thoại.",
      icon: <Gamepad2 />,
      url: "https://vang-vong-su-viet.yundev.space",
      status: "Active",
      color: "#f59e0b",
      tags: ["React", "Three.js", "R3F", "Zustand", "TypeScript"]
    },
    {
      name: "SecretVault",
      desc: "Hệ thống ghi chú bảo mật, mã hóa dữ liệu end-to-end (E2EE) trực tiếp tại trình duyệt sử dụng Web Crypto API.",
      icon: <ShieldAlert />,
      url: "https://vault.yundev.space",
      status: "In Dev",
      color: "#ec4899",
      tags: ["React", "Tailwind", "Web Crypto API"]
    }
  ]

  const techStack = [
    { name: "React 19", icon: "⚛️" },
    { name: "Vite", icon: "⚡" },
    { name: "JavaScript (ES6+)", icon: "💛" },
    { name: "Vanilla CSS & Grid", icon: "🎨" },
    { name: "Supabase Auth & DB", icon: "⚡" },
    { name: "Git & GitHub", icon: "🐙" }
  ]

  return (
    <>
      {/* Background Gradients & Grid */}
      <div className="cyber-grid"></div>
      <div className="ambient-glows">
        <div className="glow-purple"></div>
        <div className="glow-cyan"></div>
      </div>

      <div className="portal-wrapper">
        {/* Navigation / Header */}
        <header className="portal-header">
          <div className="brand">
            <div className="brand-icon">
              <Terminal />
            </div>
            <span className="brand-name">YunDev.space</span>
          </div>

          <div className="social-links" style={{ alignItems: 'center', gap: '0.75rem' }}>
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="tag-badge" style={{ borderColor: 'var(--neon-green)', color: 'var(--neon-green)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <UserCheck size={14} /> {currentUser.email}
                </span>
                <button type="button" className="social-btn" onClick={handleLogout} title="Đăng xuất">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn-launch"
                style={{ marginTop: 0, padding: '0.45rem 0.9rem' }}
                onClick={() => { setIsSignUp(false); setShowAuthModal(true); }}
              >
                <LogIn size={15} /> Đăng nhập
              </button>
            )}

            <a href="https://github.com/dungnv05" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="GitHub">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero-section">
          <span className="cyber-tag">Supabase Auth Integrated // yundev.space</span>
          <h1 className="hero-title">
            Chào mừng đến với <br />
            <span className="gradient-text-purple">YunDev Ecosystem</span>
          </h1>
          <p className="hero-subtitle">
            Cổng thông tin và thư viện ứng dụng cá nhân độc lập. Tự động đồng bộ tài khoản và phiên đăng nhập trên toàn bộ tên miền phụ <code>*.yundev.space</code>.
          </p>
        </section>

        {/* Apps Grid */}
        <section className="apps-section">
          <div className="section-header">
            <h2 className="section-title">
              <AppWindow style={{ color: "var(--neon-purple)" }} /> Kho Ứng Dụng Subdomain
            </h2>
            <p className="section-subtitle">Mỗi ứng dụng chạy độc lập tại từng Subdomain tương ứng</p>
          </div>

          <div className="apps-grid">
            {apps.map((app, index) => (
              <div
                key={index}
                className="cyber-card app-card"
                style={{ '--accent-color': app.color }}
              >
                <div>
                  <div className="card-overlay"></div>

                  {/* Status Tag */}
                  <span className={`app-status ${app.status === 'Active' ? 'status-active' : 'status-dev'}`}>
                    {app.status}
                  </span>

                  {/* App Icon */}
                  <div className="app-icon">
                    {app.icon}
                  </div>

                  {/* App Details */}
                  <div className="app-meta">
                    <h3 className="app-name">{app.name}</h3>
                    <p className="app-desc">{app.desc}</p>
                  </div>
                </div>

                {/* Footer of card */}
                <div>
                  <div className="app-tags">
                    {app.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="tag-badge">{tag}</span>
                    ))}
                  </div>
                  <a
                    href={app.url}
                    target={app.status === 'Active' ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className="btn-launch"
                    style={{ marginTop: '1.25rem' }}
                  >
                    {app.status === 'Active' ? `Truy cập ${app.url.replace('https://', '')}` : 'Đang phát triển'}
                    {app.status === 'Active' ? <ExternalLink size={14} /> : <ChevronRight size={14} />}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack Pills */}
        <section className="tech-section">
          <div className="section-header" style={{ marginBottom: '1.5rem' }}>
            <h2 className="section-title">
              <Cpu style={{ color: "var(--neon-cyan)" }} /> Kiến Trúc & Công Nghệ
            </h2>
          </div>
          <div className="tech-grid">
            {techStack.map((tech, index) => (
              <div key={index} className="tech-pill">
                <span>{tech.icon}</span>
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="portal-footer">
          <p>© 2026 YunDev.space. Tích hợp Supabase Authentication & Multi-Subdomain SSO.</p>
        </footer>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="cyber-card auth-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="auth-modal-header">
              <h3>{isSignUp ? <UserPlus size={20} /> : <Lock size={20} />} {isSignUp ? 'Tạo Tài Khoản YunDev' : 'Đăng Nhập YunDev'}</h3>
              <button type="button" className="btn-close" onClick={() => setShowAuthModal(false)}>
                <X size={18} />
              </button>
            </div>

            {authMessage && (
              <div className={`auth-alert ${authMessage.type === 'error' ? 'auth-alert-error' : 'auth-alert-success'}`}>
                {authMessage.text}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="auth-form">
              <div className="auth-input-group">
                <label>Địa chỉ Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@yundev.space"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                />
              </div>

              <div className="auth-input-group">
                <label>Mật khẩu</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-launch btn-auth-submit" disabled={authLoading}>
                {authLoading ? 'Đang xử lý...' : (isSignUp ? 'Đăng ký ngay' : 'Đăng nhập')}
              </button>
            </form>

            <div className="auth-modal-footer">
              {isSignUp ? (
                <span>Đã có tài khoản? <button type="button" className="auth-switch-link" onClick={() => setIsSignUp(false)}>Đăng nhập ngay</button></span>
              ) : (
                <span>Chưa có tài khoản? <button type="button" className="auth-switch-link" onClick={() => setIsSignUp(true)}>Đăng ký tài khoản</button></span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
