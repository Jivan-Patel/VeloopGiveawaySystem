import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public/assets/prizes');
const srcDir = path.resolve('src/assets/prizes');

fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(srcDir, { recursive: true });

const assets = {
  'giveaway-ticket.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" fill="none">
    <defs>
      <linearGradient id="ticketBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1A241E" />
        <stop offset="50%" stop-color="#121814" />
        <stop offset="100%" stop-color="#0B0E0D" />
      </linearGradient>
      <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FDE68A" />
        <stop offset="50%" stop-color="#F59E0B" />
        <stop offset="100%" stop-color="#B45309" />
      </linearGradient>
      <radialGradient id="hologram" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#10B981" stop-opacity="0.35" />
        <stop offset="100%" stop-color="#059669" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect x="10" y="10" width="380" height="220" rx="20" fill="url(#ticketBg)" stroke="url(#goldGlow)" stroke-width="2.5" />
    <circle cx="10" cy="120" r="16" fill="#0B0E0D" />
    <circle cx="390" cy="120" r="16" fill="#0B0E0D" />
    <line x1="280" y1="20" x2="280" y2="220" stroke="#F59E0B" stroke-dasharray="8 8" stroke-opacity="0.35" stroke-width="2" />
    <circle cx="140" cy="120" r="80" fill="url(#hologram)" />
    <text x="50" y="80" fill="#F8FAF9" font-family="Inter, sans-serif" font-weight="800" font-size="24" letter-spacing="1">VELOP REWARDS</text>
    <text x="50" y="115" fill="#F59E0B" font-family="Inter, sans-serif" font-weight="700" font-size="16">★ OFFICIAL GIVEAWAY PASS ★</text>
    <text x="50" y="165" fill="#94A3B8" font-family="Inter, sans-serif" font-size="13">100% Fair On-Chain Selection · ID Verified</text>
    <text x="305" y="80" fill="#10B981" font-family="monospace" font-size="12">NO. 8849</text>
    <text x="310" y="140" fill="#F59E0B" font-family="Inter, sans-serif" font-weight="900" font-size="28">VIP</text>
  </svg>`,

  'gift-box-gold.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" fill="none">
    <defs>
      <linearGradient id="boxGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FDE68A" />
        <stop offset="50%" stop-color="#F59E0B" />
        <stop offset="100%" stop-color="#B45309" />
      </linearGradient>
      <linearGradient id="ribbonEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#34D399" />
        <stop offset="50%" stop-color="#059669" />
        <stop offset="100%" stop-color="#064E3B" />
      </linearGradient>
      <filter id="boxGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="16" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <circle cx="150" cy="160" r="100" fill="#059669" fill-opacity="0.2" filter="url(#boxGlow)" />
    <!-- Box Body -->
    <rect x="60" y="130" width="180" height="120" rx="12" fill="url(#boxGold)" />
    <!-- Box Lid -->
    <rect x="50" y="105" width="200" height="35" rx="8" fill="#FEF3C7" stroke="#B45309" stroke-width="1.5" />
    <!-- Ribbon Vertical -->
    <rect x="135" y="105" width="30" height="145" fill="url(#ribbonEmerald)" />
    <!-- Ribbon Horizontal Lid -->
    <rect x="50" y="115" width="200" height="15" fill="url(#ribbonEmerald)" />
    <!-- Bow -->
    <path d="M120 75 C100 50, 140 40, 150 90 C160 40, 200 50, 180 75 C160 95, 140 95, 120 75 Z" fill="url(#ribbonEmerald)" />
    <circle cx="150" cy="95" r="10" fill="#A7F3D0" />
  </svg>`,

  'gift-box-dark.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" fill="none">
    <defs>
      <linearGradient id="boxTitanium" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#232D26" />
        <stop offset="50%" stop-color="#141B16" />
        <stop offset="100%" stop-color="#0B0E0D" />
      </linearGradient>
      <linearGradient id="ribbonGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FDE68A" />
        <stop offset="60%" stop-color="#F59E0B" />
        <stop offset="100%" stop-color="#B45309" />
      </linearGradient>
    </defs>
    <rect x="60" y="130" width="180" height="120" rx="12" fill="url(#boxTitanium)" stroke="#10B981" stroke-width="2" />
    <rect x="50" y="105" width="200" height="35" rx="8" fill="#1F2A22" stroke="#059669" stroke-width="2" />
    <rect x="135" y="105" width="30" height="145" fill="url(#ribbonGold)" />
    <path d="M120 75 C100 50, 140 40, 150 90 C160 40, 200 50, 180 75 Z" fill="url(#ribbonGold)" />
    <circle cx="150" cy="95" r="10" fill="#FDE68A" />
  </svg>`,

  'iphone-15-pro.webp': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 400" fill="none">
    <defs>
      <linearGradient id="iphoneBezel" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#94A3B8" />
        <stop offset="50%" stop-color="#475569" />
        <stop offset="100%" stop-color="#1E293B" />
      </linearGradient>
      <linearGradient id="iphoneScreen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#121714" />
        <stop offset="100%" stop-color="#0B0E0D" />
      </linearGradient>
      <linearGradient id="screenWallpaper" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#10B981" stop-opacity="0.4" />
        <stop offset="50%" stop-color="#F59E0B" stop-opacity="0.2" />
        <stop offset="100%" stop-color="#047857" stop-opacity="0.6" />
      </linearGradient>
    </defs>
    <!-- Phone Body in Natural Titanium -->
    <rect x="30" y="20" width="220" height="360" rx="42" fill="url(#iphoneBezel)" stroke="#CBD5E1" stroke-width="2.5" />
    <rect x="36" y="26" width="208" height="348" rx="36" fill="url(#iphoneScreen)" />
    <rect x="42" y="32" width="196" height="336" rx="32" fill="url(#screenWallpaper)" />
    <!-- Dynamic Island -->
    <rect x="105" y="44" width="70" height="18" rx="9" fill="#000000" />
    <circle cx="160" cy="53" r="4" fill="#334155" />
    <!-- Screen Typography -->
    <text x="140" y="160" text-anchor="middle" fill="#FFFFFF" font-family="Inter, sans-serif" font-weight="800" font-size="28">iPhone 15 Pro</text>
    <text x="140" y="190" text-anchor="middle" fill="#E2E8F0" font-family="Inter, sans-serif" font-weight="500" font-size="14">Natural Titanium · A17 Pro</text>
    <circle cx="140" cy="270" r="45" fill="#10B981" fill-opacity="0.2" stroke="#10B981" stroke-width="1.5" />
    <text x="140" y="278" text-anchor="middle" fill="#FFFFFF" font-family="Inter, sans-serif" font-weight="700" font-size="22">128GB</text>
  </svg>`,

  'apple-watch.webp': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 400" fill="none">
    <defs>
      <linearGradient id="watchStrap" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#059669" />
        <stop offset="50%" stop-color="#047857" />
        <stop offset="100%" stop-color="#064E3B" />
      </linearGradient>
      <linearGradient id="watchCase" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2D3748" />
        <stop offset="100%" stop-color="#1A202C" />
      </linearGradient>
    </defs>
    <!-- Straps in Racing Emerald -->
    <rect x="90" y="15" width="100" height="100" rx="12" fill="url(#watchStrap)" />
    <rect x="90" y="285" width="100" height="100" rx="12" fill="url(#watchStrap)" />
    <!-- Case -->
    <rect x="55" y="80" width="170" height="230" rx="46" fill="url(#watchCase)" stroke="#10B981" stroke-width="3" />
    <!-- Screen -->
    <rect x="65" y="90" width="150" height="210" rx="38" fill="#0C100E" />
    <!-- Crown -->
    <rect x="225" y="125" width="10" height="40" rx="4" fill="#F59E0B" />
    <rect x="225" y="180" width="7" height="35" rx="3" fill="#64748B" />
    <!-- UI Elements -->
    <text x="140" y="165" text-anchor="middle" fill="#10B981" font-family="Inter, sans-serif" font-weight="800" font-size="44">09:41</text>
    <text x="140" y="200" text-anchor="middle" fill="#A7F3D0" font-family="Inter, sans-serif" font-weight="600" font-size="14">SERIES 9 · 45mm</text>
    <circle cx="140" cy="245" r="22" stroke="#10B981" stroke-width="4" fill="none" />
    <circle cx="140" cy="245" r="15" stroke="#F59E0B" stroke-width="4" fill="none" />
  </svg>`,

  'airpods-pro.webp': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 400" fill="none">
    <defs>
      <linearGradient id="caseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F8FAF9" />
        <stop offset="60%" stop-color="#E2E8F0" />
        <stop offset="100%" stop-color="#CBD5E1" />
      </linearGradient>
    </defs>
    <!-- Charging Case in Pearl White -->
    <rect x="40" y="120" width="200" height="160" rx="55" fill="url(#caseGrad)" stroke="#10B981" stroke-width="2.5" />
    <line x1="40" y1="180" x2="240" y2="180" stroke="#94A3B8" stroke-width="1.5" />
    <circle cx="140" cy="205" r="4" fill="#10B981" />
    <!-- Earbuds Preview -->
    <path d="M90 60 C90 40, 120 40, 120 60 L120 120 L105 120 L105 75 Z" fill="#F8FAF9" stroke="#94A3B8" />
    <path d="M190 60 C190 40, 160 40, 160 60 L160 120 L175 120 L175 75 Z" fill="#F8FAF9" stroke="#94A3B8" />
    <text x="140" y="325" text-anchor="middle" fill="#10B981" font-family="Inter, sans-serif" font-weight="700" font-size="18">AirPods Pro 2</text>
    <text x="140" y="350" text-anchor="middle" fill="#94A3B8" font-family="Inter, sans-serif" font-size="13">Active Noise Cancellation</text>
  </svg>`,

  'amazon-2000.webp': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" fill="none">
    <defs>
      <linearGradient id="amzGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#232F3E" />
        <stop offset="100%" stop-color="#131921" />
      </linearGradient>
    </defs>
    <rect x="5" y="5" width="310" height="190" rx="16" fill="url(#amzGrad)" stroke="#F97316" stroke-width="2.5" />
    <text x="35" y="60" fill="#FFFFFF" font-family="Inter, sans-serif" font-weight="800" font-size="24">amazon.in</text>
    <text x="35" y="85" fill="#F97316" font-family="Inter, sans-serif" font-weight="600" font-size="14">GIFT CARD</text>
    <text x="35" y="145" fill="#FFFFFF" font-family="Inter, sans-serif" font-weight="900" font-size="36">₹2,000</text>
    <path d="M35 160 Q100 180, 160 160" stroke="#F97316" stroke-width="4" stroke-linecap="round" fill="none" />
  </svg>`,

  'amazon-500.webp': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" fill="none">
    <defs>
      <linearGradient id="amzGrad500" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#283344" />
        <stop offset="100%" stop-color="#121820" />
      </linearGradient>
    </defs>
    <rect x="5" y="5" width="310" height="190" rx="16" fill="url(#amzGrad500)" stroke="#F59E0B" stroke-width="2.5" />
    <text x="35" y="60" fill="#FFFFFF" font-family="Inter, sans-serif" font-weight="800" font-size="24">amazon.in</text>
    <text x="35" y="85" fill="#F59E0B" font-family="Inter, sans-serif" font-weight="600" font-size="14">SHOPPING VOUCHER</text>
    <text x="35" y="145" fill="#FFFFFF" font-family="Inter, sans-serif" font-weight="900" font-size="36">₹500</text>
    <path d="M35 160 Q100 180, 160 160" stroke="#F59E0B" stroke-width="4" stroke-linecap="round" fill="none" />
  </svg>`,

  'amazon-20.webp': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" fill="none">
    <defs>
      <linearGradient id="amzGrad20" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2D2419" />
        <stop offset="100%" stop-color="#18130B" />
      </linearGradient>
    </defs>
    <rect x="5" y="5" width="310" height="190" rx="16" fill="url(#amzGrad20)" stroke="#D97706" stroke-width="2" />
    <text x="35" y="60" fill="#FFFFFF" font-family="Inter, sans-serif" font-weight="800" font-size="22">amazon.in</text>
    <text x="35" y="85" fill="#F59E0B" font-family="Inter, sans-serif" font-weight="600" font-size="13">MINI TOKEN DROP</text>
    <text x="35" y="145" fill="#FFFFFF" font-family="Inter, sans-serif" font-weight="900" font-size="36">₹20</text>
    <path d="M35 160 Q100 180, 160 160" stroke="#F59E0B" stroke-width="3" stroke-linecap="round" fill="none" />
  </svg>`
};

for (const [filename, content] of Object.entries(assets)) {
  fs.writeFileSync(path.join(publicDir, filename), content.trim());
  fs.writeFileSync(path.join(srcDir, filename), content.trim());
}

console.log('Regenerated all 9 assets with Emerald, Gold, Titanium, and Amber palette (no purple/blue).');
