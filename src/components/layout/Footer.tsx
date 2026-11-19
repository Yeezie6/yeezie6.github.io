export default function Footer({ lastUpdated }: { lastUpdated?: string }) {
  return <footer className="site-footer"><div className="site-shell footer-inner"><p>Yiqing Wang <span>· Robotics & Learning</span></p><div>{lastUpdated && <span>Updated {lastUpdated}</span>}<a href="https://github.com/xyjoey/PRISM" target="_blank" rel="noopener noreferrer">Built on PRISM ↗</a></div></div></footer>;
}
