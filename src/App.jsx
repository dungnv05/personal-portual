import React from 'react'
import { 
  WalletCards, 
  Terminal, 
  Mail, 
  AppWindow, 
  ChevronRight, 
  Cpu, 
  Kanban, 
  ShieldAlert, 
  ExternalLink 
} from 'lucide-react'
import './App.css'

function App() {
  const apps = [
    {
      name: "SalaryFlow",
      desc: "Công cụ tính lương Gross sang Net và ngược lại, cập nhật đầy đủ và chuẩn xác các chính sách bảo hiểm & thuế thu nhập cá nhân mới nhất năm 2026.",
      icon: <WalletCards />,
      url: "http://tinhluong.yourdomain.com", // Subdomain URL format requested
      status: "Active",
      color: "#06b6d4", // Neon Cyan
      tags: ["HTML5", "Vanilla CSS", "JavaScript", "Chart.js"]
    },
    {
      name: "CyberTask",
      desc: "Ứng dụng Kanban board phong cách Cyberpunk với các widget theo dõi thời gian và năng suất làm việc của cá nhân.",
      icon: <Kanban />,
      url: "#",
      status: "In Dev",
      color: "#a855f7", // Neon Purple
      tags: ["React", "Vite", "Dnd-kit", "LocalForage"]
    },
    {
      name: "SecretVault",
      desc: "Hệ thống ghi chú bảo mật, mã hóa dữ liệu end-to-end (E2EE) trực tiếp tại trình duyệt sử dụng Web Crypto API.",
      icon: <ShieldAlert />,
      url: "#",
      status: "In Dev",
      color: "#ec4899", // Neon Pink
      tags: ["React", "Tailwind", "Web Crypto API"]
    }
  ]

  const techStack = [
    { name: "React 19", icon: "⚛️" },
    { name: "Vite", icon: "⚡" },
    { name: "JavaScript (ES6+)", icon: "💛" },
    { name: "Vanilla CSS & Grid", icon: "🎨" },
    { name: "Node.js", icon: "🟢" },
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
            <span className="brand-name">Nguyen.Dev</span>
          </div>
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="GitHub">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a href="mailto:contact@yourdomain.com" className="social-btn" aria-label="Mail">
              <Mail size={18} />
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero-section">
          <span className="cyber-tag">System initialized // 2026</span>
          <h1 className="hero-title">
            Chào mừng đến với <br />
            <span className="gradient-text-purple">Cybernetic Portal</span>
          </h1>
          <p className="hero-subtitle">
            Cổng thông tin và thư viện ứng dụng cá nhân của tôi. Nơi phát triển các dự án web chuyên nghiệp, tối ưu hóa hiệu suất và mang tính trải nghiệm cao.
          </p>
        </section>

        {/* Apps Grid */}
        <section className="apps-section">
          <div className="section-header">
            <h2 className="section-title">
              <AppWindow style={{ color: "var(--neon-purple)" }} /> Kho Ứng Dụng Subdomain
            </h2>
            <p className="section-subtitle">Mỗi ứng dụng được chạy độc lập trên từng tên miền phụ riêng biệt</p>
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
                    {app.status === 'Active' ? 'Khởi chạy ứng dụng' : 'Đang phát triển'}
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
              <Cpu style={{ color: "var(--neon-cyan)" }} /> Công Nghệ Cốt Lõi
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
          <p>© 2026 Nguyen.Dev. Thiết kế với phong cách Futuristic & Đóng gói bằng React + Vite.</p>
        </footer>
      </div>
    </>
  )
}

export default App
