import { UploadSection } from "./upload";
import { PresetsSection } from "./presets";
import { QueueSection } from "./queue";
import { ConversionSection } from "./conversion";
import { TemplatesSection } from "./templates";
import { PreviewSection } from "./preview";
import { ExportSection } from "./export";

const NAV_ITEMS = [
  { href: "#upload", label: "Upload" },
  { href: "#presets", label: "Presets" },
  { href: "#queue", label: "Queue" },
  { href: "#conversion", label: "Convert" },
  { href: "#templates", label: "Templates" },
  { href: "#preview", label: "Preview" },
  { href: "#export", label: "Export" },
] as const;

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <p className="app-header__eyebrow">Batch converter</p>
        <h1 className="app-header__title">MotionDot</h1>
        <p className="app-header__tagline">모바일 우선 배치 GIF·영상 변환기</p>
      </header>

      <nav className="app-nav" aria-label="섹션 이동">
        {NAV_ITEMS.map((item) => (
          <a key={item.href} href={item.href} className="app-nav__link">
            {item.label}
          </a>
        ))}
      </nav>

      <main className="app-main">
        <UploadSection />
        <PresetsSection />
        <QueueSection />
        <ConversionSection />
        <TemplatesSection />
        <PreviewSection />
        <ExportSection />
      </main>

      <footer className="app-footer">
        <p>MotionDot MVP · 클라이언트 전용 · gigigi 루트 앱과 분리</p>
      </footer>
    </div>
  );
}

export default App;
