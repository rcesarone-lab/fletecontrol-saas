type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="header">
      <button className="mobile-menu-button" onClick={onMenuClick}>
        ☰
      </button>

      <div>
        <div className="header-title">Panel Operativo</div>
      </div>

      <div className="header-pill">MVP localStorage</div>
    </header>
  );
}