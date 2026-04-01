import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, 'social-media-png');

// Emprega+ Design Tokens (Light theme — navy + gold)
const t = {
  bg: '#FFFFFF',
  s1: '#F5F7F9',
  navy: '#1B2A4A',
  navyDark: '#111C33',
  gold: '#C49A3C',
  goldLight: '#D4AD55',
  green: '#34A853',
  gray: '#5A6B7D',
  textSec: '#5A6B7D',
  border: '#D6E0E8',
  gradientBrand: 'linear-gradient(135deg, #C49A3C 0%, #D4AD55 100%)',
  fh: "'Sora', system-ui, sans-serif",
  fb: "'Inter', system-ui, sans-serif",
  fm: "'JetBrains Mono', monospace",
};

const fontImport = `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">`;

const baseStyle = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: ${t.fb}; color: ${t.navy}; -webkit-font-smoothing: antialiased; overflow: hidden; }
  .h { font-family: ${t.fh}; }
  .gold { color: ${t.gold}; }
  .navy { color: ${t.navy}; }
  .sec { color: ${t.textSec}; }
  .gradient-text { background: ${t.gradientBrand}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .logo { position: absolute; bottom: 24px; right: 24px; font-family: ${t.fh}; font-size: 16px; font-weight: 800; color: ${t.navy}; }
  .logo span { color: ${t.gold}; }
`;

function wrap(w, h, body, extra = '') {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${fontImport}<style>${baseStyle}
  html, body { width: ${w}px; height: ${h}px; } ${extra}</style></head><body>${body}<div class="logo">emprega<span>+</span></div></body></html>`;
}

const templates = [
  // ═══ FEED 1080x1080 ═══
  {
    name: 'feed/01-institucional-navy',
    w: 1080, h: 1080,
    html: wrap(1080, 1080, `
      <div style="width:100%;height:100%;background:linear-gradient(135deg,${t.navy} 0%,${t.navyDark} 100%);display:flex;align-items:center;justify-content:center;position:relative;">
        <div style="position:absolute;top:-80px;right:-80px;width:300px;height:300px;background:rgba(196,154,60,0.12);border-radius:50%;"></div>
        <div style="position:absolute;bottom:-60px;left:-60px;width:240px;height:240px;background:rgba(212,173,85,0.08);border-radius:50%;"></div>
        <div style="position:relative;text-align:center;padding:80px;">
          <div class="h" style="font-size:48px;font-weight:800;color:#fff;margin-bottom:16px;">O mercado recompensa<br>quem resolve problemas.</div>
          <div style="width:60px;height:4px;background:${t.gradientBrand};margin:24px auto;border-radius:2px;"></div>
          <div style="font-family:${t.fm};font-size:16px;color:rgba(255,255,255,0.6);">empregamais.me</div>
        </div>
      </div>`, `.logo{color:#fff!important} .logo span{color:${t.goldLight}!important}`)
  },
  {
    name: 'feed/02-frase-gold',
    w: 1080, h: 1080,
    html: wrap(1080, 1080, `
      <div style="width:100%;height:100%;background:${t.gradientBrand};display:flex;align-items:center;justify-content:center;position:relative;">
        <div style="position:absolute;inset:0;background:radial-gradient(circle at 30% 70%,rgba(0,0,0,0.15),transparent);"></div>
        <div style="position:relative;text-align:center;padding:80px;">
          <div style="font-size:16px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.85);margin-bottom:24px;">EMPREGABILIDADE</div>
          <div class="h" style="font-size:54px;font-weight:800;color:#fff;line-height:1.2;">Carreira forte.<br>Vida em ordem.</div>
        </div>
      </div>`, `.logo{color:rgba(255,255,255,0.7)!important} .logo span{opacity:0.9}`)
  },
  {
    name: 'feed/03-dados-light',
    w: 1080, h: 1080,
    html: wrap(1080, 1080, `
      <div style="width:100%;height:100%;background:#fff;display:flex;flex-direction:column;position:relative;">
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:60px;">
          <div class="h gradient-text" style="font-size:120px;font-weight:800;">2.847</div>
          <div class="sec" style="font-size:26px;margin-top:8px;">vagas abertas esta semana</div>
          <div style="width:60px;height:4px;background:${t.gradientBrand};margin:24px 0;border-radius:2px;"></div>
          <div class="sec" style="font-size:20px;">em 12 municipios parceiros</div>
        </div>
        <div style="padding:24px 40px;background:${t.s1};border-top:1px solid ${t.border};display:flex;justify-content:space-between;align-items:center;">
          <div class="h" style="font-size:16px;font-weight:700;">emprega<span class="gold">+</span></div>
          <div style="font-family:${t.fm};font-size:13px;color:${t.textSec};">empregamais.me</div>
        </div>
      </div>`, 'body .logo{display:none}')
  },
  {
    name: 'feed/04-frase-sobre-foto',
    w: 1080, h: 1080,
    html: wrap(1080, 1080, `
      <div style="width:100%;height:100%;position:relative;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=85') center/cover;"></div>
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(27,42,74,0.75) 0%,rgba(17,28,51,0.9) 100%);"></div>
        <div style="position:relative;text-align:center;padding:80px;">
          <div style="font-size:16px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${t.goldLight};margin-bottom:24px;">EMPREGABILIDADE</div>
          <div class="h" style="font-size:46px;font-weight:800;color:#fff;line-height:1.2;margin-bottom:16px;">Ninguem constroi uma<br>carreira sozinho.</div>
          <div style="width:60px;height:4px;background:${t.gradientBrand};margin:24px auto;border-radius:2px;"></div>
          <div style="font-family:${t.fm};font-size:16px;color:rgba(255,255,255,0.6);">empregamais.me</div>
        </div>
      </div>`, `.logo{color:rgba(255,255,255,0.5)!important} .logo span{color:${t.goldLight}!important}`)
  },
  {
    name: 'feed/05-depoimento',
    w: 1080, h: 1080,
    html: wrap(1080, 1080, `
      <div style="width:100%;height:100%;background:linear-gradient(135deg,${t.navy} 0%,${t.navyDark} 100%);display:flex;flex-direction:column;justify-content:center;padding:80px;position:relative;">
        <div class="h" style="font-size:80px;color:${t.goldLight};line-height:1;margin-bottom:16px;">"</div>
        <div style="font-size:28px;color:rgba(255,255,255,0.85);line-height:1.7;font-style:italic;margin-bottom:48px;">Depois que eu entendi o que e posicionamento, tudo mudou. Passei de 3 anos sem evolucao pra coordenador em 8 meses.</div>
        <div style="display:flex;align-items:center;gap:20px;">
          <div style="width:72px;height:72px;border-radius:50%;background:url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80') center/cover;border:3px solid ${t.gold};flex-shrink:0;"></div>
          <div>
            <div class="h" style="font-size:20px;font-weight:700;color:${t.goldLight};">Carlos Mendes</div>
            <div style="font-size:16px;color:rgba(255,255,255,0.5);">Coordenador de Projetos</div>
          </div>
        </div>
      </div>`, `.logo{color:rgba(255,255,255,0.5)!important} .logo span{color:${t.goldLight}!important}`)
  },
  {
    name: 'feed/06-convite-workshop',
    w: 1080, h: 1080,
    html: wrap(1080, 1080, `
      <div style="width:100%;height:100%;position:relative;display:flex;flex-direction:column;">
        <div style="position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=85') center/cover;"></div>
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(17,28,51,0.6) 0%,rgba(17,28,51,0.95) 50%);"></div>
        <div style="position:relative;flex:1;display:flex;flex-direction:column;justify-content:flex-end;padding:72px;">
          <div style="display:inline-block;background:${t.gold};color:#fff;font-size:14px;font-weight:700;padding:6px 18px;border-radius:999px;letter-spacing:0.05em;margin-bottom:24px;align-self:flex-start;">GRATUITO</div>
          <div class="h" style="font-size:44px;font-weight:800;color:#fff;line-height:1.2;margin-bottom:24px;">Workshop:<br>Curriculo que Vende</div>
          <div style="display:flex;gap:32px;margin-bottom:32px;">
            <div style="font-size:18px;color:rgba(255,255,255,0.8);">📅 25 Mar, 19h</div>
            <div style="font-size:18px;color:rgba(255,255,255,0.8);">🎥 Online / Zoom</div>
          </div>
          <div style="background:${t.gradientBrand};color:#fff;font-size:16px;font-weight:700;padding:18px 0;border-radius:999px;text-align:center;">INSCREVA-SE AGORA</div>
        </div>
      </div>`, `.logo{color:rgba(255,255,255,0.4)!important} .logo span{color:rgba(255,255,255,0.5)!important}`)
  },
  {
    name: 'feed/07-autoridade-fundador',
    w: 1080, h: 1080,
    html: wrap(1080, 1080, `
      <div style="width:100%;height:100%;background:linear-gradient(135deg,${t.navy} 0%,${t.navyDark} 100%);display:flex;position:relative;">
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:72px;">
          <div style="font-size:13px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${t.goldLight};margin-bottom:20px;">MARCOS CARNEIRO</div>
          <div class="h" style="font-size:42px;font-weight:800;color:#fff;line-height:1.25;margin-bottom:24px;">A diferenca entre<br>emprego e <span style="color:${t.goldLight}">carreira</span></div>
          <div style="font-size:18px;color:rgba(255,255,255,0.5);line-height:1.5;">3 perguntas que voce<br>precisa responder hoje.</div>
        </div>
        <div style="width:42%;position:relative;">
          <div style="position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=85') center/cover;"></div>
          <div style="position:absolute;inset:0;background:linear-gradient(to right,${t.navyDark} 0%,transparent 40%);"></div>
          <div style="position:absolute;inset:0;background:linear-gradient(to top,${t.navyDark} 0%,transparent 20%);"></div>
        </div>
      </div>`, `.logo{color:rgba(255,255,255,0.5)!important} .logo span{color:${t.goldLight}!important}`)
  },

  // ═══ STORIES 1080x1920 ═══
  {
    name: 'stories/01-frase-navy',
    w: 1080, h: 1920,
    html: wrap(1080, 1920, `
      <div style="width:100%;height:100%;background:linear-gradient(180deg,${t.navy} 0%,${t.navyDark} 100%);display:flex;align-items:center;justify-content:center;position:relative;">
        <div style="position:absolute;top:50%;left:50%;width:400px;height:400px;background:radial-gradient(circle,rgba(196,154,60,0.12),transparent);transform:translate(-50%,-50%)"></div>
        <div style="position:relative;text-align:center;padding:72px;">
          <div style="font-size:14px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${t.goldLight};margin-bottom:28px;">EMPREGABILIDADE</div>
          <div class="h" style="font-size:52px;font-weight:800;color:#fff;line-height:1.3;">Disciplina e<br>liberdade<br>disfarcada.</div>
        </div>
        <div style="position:absolute;bottom:40px;font-size:14px;color:rgba(255,255,255,0.4);font-family:${t.fm};">@empregamais</div>
      </div>`, 'body .logo{display:none}')
  },
  {
    name: 'stories/02-cta-gold',
    w: 1080, h: 1920,
    html: wrap(1080, 1920, `
      <div style="width:100%;height:100%;background:${t.gradientBrand};display:flex;align-items:center;justify-content:center;position:relative;">
        <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 100%,rgba(0,0,0,0.2),transparent);"></div>
        <div style="position:relative;text-align:center;padding:72px;">
          <div class="h" style="font-size:56px;font-weight:800;color:#fff;line-height:1.3;">Sua carreira<br>comeca aqui.</div>
          <div style="margin-top:32px;background:rgba(255,255,255,0.2);color:#fff;font-size:16px;font-weight:600;padding:12px 28px;border-radius:999px;display:inline-block;">VER VAGAS ↑</div>
        </div>
        <div style="position:absolute;bottom:40px;font-size:14px;color:rgba(255,255,255,0.5);font-family:${t.fm};">@empregamais</div>
      </div>`, 'body .logo{display:none}')
  },
  {
    name: 'stories/03-bastidores-foto',
    w: 1080, h: 1920,
    html: wrap(1080, 1920, `
      <div style="width:100%;height:100%;position:relative;display:flex;flex-direction:column;justify-content:flex-end;">
        <div style="position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=85') center/cover;"></div>
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 30%,rgba(17,28,51,0.9) 70%);"></div>
        <div style="position:relative;padding:72px;">
          <div style="font-size:13px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${t.goldLight};margin-bottom:16px;">BASTIDORES</div>
          <div class="h" style="font-size:40px;font-weight:800;color:#fff;line-height:1.3;">Preparando o workshop<br>de amanha.</div>
          <div style="margin-top:16px;font-size:16px;color:rgba(255,255,255,0.5);font-style:italic;">Conectando pessoas ao trabalho certo.</div>
        </div>
      </div>`, 'body .logo{display:none}')
  },
  {
    name: 'stories/04-dica-light',
    w: 1080, h: 1920,
    html: wrap(1080, 1920, `
      <div style="width:100%;height:100%;background:#fff;display:flex;flex-direction:column;position:relative;">
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:72px;text-align:center;">
          <div style="width:80px;height:80px;border-radius:50%;background:${t.gradientBrand};display:flex;align-items:center;justify-content:center;margin-bottom:28px;">
            <span style="color:#fff;font-size:36px;">✓</span>
          </div>
          <div class="h" style="font-size:36px;font-weight:700;margin-bottom:12px;">Dica rapida</div>
          <div class="sec" style="font-size:22px;line-height:1.5;max-width:85%;">Atualize seu curriculo a cada 3 meses, mesmo empregado.</div>
        </div>
        <div style="padding:20px;background:${t.s1};border-top:1px solid ${t.border};text-align:center;">
          <div class="h" style="font-size:16px;font-weight:700;">emprega<span class="gold">+</span></div>
        </div>
      </div>`, 'body .logo{display:none}')
  },

  // ═══ THUMBNAILS 1280x720 ═══
  {
    name: 'thumbnails/01-navy-gold-glow',
    w: 1280, h: 720,
    html: wrap(1280, 720, `
      <div style="width:100%;height:100%;background:linear-gradient(135deg,${t.navyDark} 0%,${t.navy} 60%,rgba(196,154,60,0.3) 100%);display:flex;align-items:center;position:relative;">
        <div style="position:absolute;top:16px;left:16px;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#fff;background:${t.gold};padding:4px 12px;border-radius:4px;">EMPREGABILIDADE</div>
        <div style="padding:48px;max-width:60%;position:relative;">
          <div class="h" style="font-size:48px;font-weight:800;color:#fff;line-height:1.15;text-shadow:0 2px 8px rgba(0,0,0,0.5);">COMO CONSEGUIR EMPREGO EM 30 DIAS</div>
        </div>
        <div style="position:absolute;right:0;bottom:0;width:45%;height:100%;background:linear-gradient(to left,rgba(196,154,60,0.15),transparent);"></div>
      </div>`, `.logo{color:rgba(255,255,255,0.6)!important} .logo span{color:${t.goldLight}!important}`)
  },
  {
    name: 'thumbnails/02-light-gold-strip',
    w: 1280, h: 720,
    html: wrap(1280, 720, `
      <div style="width:100%;height:100%;background:#fff;display:flex;align-items:center;position:relative;">
        <div style="position:absolute;top:0;left:0;right:0;height:6px;background:${t.gradientBrand};"></div>
        <div style="padding:48px;max-width:65%;position:relative;">
          <div class="h navy" style="font-size:44px;font-weight:800;line-height:1.2;">Curriculo que<br>abre portas</div>
          <div class="sec" style="margin-top:16px;font-size:18px;">5 tecnicas comprovadas</div>
        </div>
      </div>`)
  },
  {
    name: 'thumbnails/03-presenter-foto',
    w: 1280, h: 720,
    html: wrap(1280, 720, `
      <div style="width:100%;height:100%;background:linear-gradient(135deg,${t.navyDark} 0%,${t.navy} 60%);display:flex;align-items:center;position:relative;">
        <div style="position:absolute;right:0;top:0;bottom:0;width:45%;">
          <div style="position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=85') center top/cover;"></div>
          <div style="position:absolute;inset:0;background:linear-gradient(to right,${t.navyDark} 0%,transparent 30%);"></div>
        </div>
        <div style="position:absolute;top:16px;left:16px;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#fff;background:${t.gold};padding:4px 12px;border-radius:4px;">WORKSHOP</div>
        <div style="padding:48px;max-width:55%;position:relative;">
          <div class="h" style="font-size:44px;font-weight:800;color:#fff;line-height:1.15;">5 ERROS QUE TE IMPEDEM DE <span style="color:${t.goldLight}">CRESCER</span></div>
        </div>
      </div>`, `.logo{color:rgba(255,255,255,0.6)!important} .logo span{color:${t.goldLight}!important}`)
  },

  // ═══ BANNERS ═══
  {
    name: 'banners/youtube-banner',
    w: 2560, h: 1440,
    html: wrap(2560, 1440, `
      <div style="width:100%;height:100%;background:linear-gradient(135deg,${t.navyDark} 0%,${t.navy} 50%,${t.navyDark} 100%);display:flex;align-items:center;justify-content:center;position:relative;">
        <div style="position:absolute;left:-120px;top:-120px;width:400px;height:400px;background:rgba(196,154,60,0.08);border-radius:50%;"></div>
        <div style="position:absolute;right:-80px;bottom:-80px;width:320px;height:320px;background:rgba(212,173,85,0.06);border-radius:50%;"></div>
        <div style="position:relative;text-align:center;">
          <div class="h" style="font-size:64px;font-weight:800;color:#fff;">emprega<span style="color:${t.goldLight};">+</span></div>
          <div style="font-size:22px;color:rgba(255,255,255,0.6);margin-top:8px;letter-spacing:0.05em;">Conectando pessoas ao trabalho certo</div>
          <div style="width:80px;height:3px;background:${t.gradientBrand};margin:16px auto 0;border-radius:2px;"></div>
        </div>
      </div>`, 'body .logo{display:none}')
  },
  {
    name: 'banners/linkedin-banner',
    w: 1584, h: 396,
    html: wrap(1584, 396, `
      <div style="width:100%;height:100%;background:linear-gradient(90deg,${t.navyDark} 0%,${t.navy} 100%);display:flex;align-items:center;padding:0 64px;position:relative;">
        <div style="position:absolute;right:0;top:0;bottom:0;width:30%;background:linear-gradient(to left,rgba(196,154,60,0.1),transparent);"></div>
        <div style="position:relative;">
          <div class="h" style="font-size:32px;font-weight:800;color:#fff;">emprega<span style="color:${t.goldLight};">+</span></div>
          <div style="font-size:14px;color:rgba(255,255,255,0.6);margin-top:4px;">Conectando pessoas ao trabalho certo</div>
        </div>
        <div style="position:absolute;right:64px;display:flex;gap:24px;align-items:center;">
          <div style="text-align:center;"><div class="h" style="font-size:20px;font-weight:700;color:${t.goldLight};">B2G</div><div style="font-size:10px;color:rgba(255,255,255,0.4);">Gov</div></div>
          <div style="width:1px;height:32px;background:rgba(255,255,255,0.1);"></div>
          <div style="text-align:center;"><div class="h" style="font-size:20px;font-weight:700;color:${t.goldLight};">C&S</div><div style="font-size:10px;color:rgba(255,255,255,0.4);">Editais</div></div>
          <div style="width:1px;height:32px;background:rgba(255,255,255,0.1);"></div>
          <div style="text-align:center;"><div class="h" style="font-size:20px;font-weight:700;color:${t.goldLight};">B2C</div><div style="font-size:10px;color:rgba(255,255,255,0.4);">PdV</div></div>
          <div style="width:1px;height:32px;background:rgba(255,255,255,0.1);"></div>
          <div style="text-align:center;"><div class="h" style="font-size:20px;font-weight:700;color:${t.goldLight};">B2B</div><div style="font-size:10px;color:rgba(255,255,255,0.4);">Electia</div></div>
        </div>
      </div>`, 'body .logo{display:none}')
  },

  // ═══ WHATSAPP 1080x1080 ═══
  {
    name: 'whatsapp/01-card-frase',
    w: 1080, h: 1080,
    html: wrap(1080, 1080, `
      <div style="width:100%;height:100%;background:#fff;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:80px;text-align:center;position:relative;">
        <div style="position:absolute;top:0;left:0;right:0;height:6px;background:${t.gradientBrand};"></div>
        <div class="h navy" style="font-size:40px;font-weight:700;line-height:1.3;margin-bottom:20px;">Ferramentas amplificam<br>quem voce ja e.</div>
        <div style="width:50px;height:3px;background:${t.gradientBrand};border-radius:2px;margin-bottom:20px;"></div>
        <div class="h" style="font-size:16px;font-weight:700;">emprega<span class="gold">+</span></div>
        <div style="font-family:${t.fm};font-size:12px;color:${t.textSec};margin-top:4px;">empregamais.me</div>
      </div>`, 'body .logo{display:none}')
  },
];

async function render() {
  console.log(`Rendering ${templates.length} Emprega+ templates...`);
  const browser = await chromium.launch();

  for (const tpl of templates) {
    const page = await browser.newPage({ viewport: { width: tpl.w, height: tpl.h } });
    await page.setContent(tpl.html, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const outPath = join(outDir, `${tpl.name}.png`);
    mkdirSync(dirname(outPath), { recursive: true });
    await page.screenshot({ path: outPath, type: 'png' });
    await page.close();
    console.log(`  ✓ ${tpl.name} (${tpl.w}x${tpl.h})`);
  }

  await browser.close();
  console.log(`\nDone! ${templates.length} PNGs saved to ${outDir}`);
}

render().catch(console.error);
