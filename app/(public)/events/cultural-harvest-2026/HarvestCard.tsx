'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './harvest.module.css';

// ----------------------------------------------------------------------
// Palette pulled from the Cultural Festival flyer: cream paper, deep navy,
// rust red, amber orange, forest teal, charcoal, and cream accent dots.
// ----------------------------------------------------------------------
const PAPER = '#f8f3e6';
const PAPER_SHADOW = '#e6dfc9';
const NAVY = '#0b0e4a';
const TEAL = '#0c4a3e';
const RUST = '#c62a18';
const AMBER = '#e08a1e';
const CHARCOAL = '#1a120d';
const CREAM = '#fbf1d8';

export function HarvestCard() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const selection = useRef(0);
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [logo, setLogo] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [horizontal, setHorizontal] = useState(50);
  const [vertical, setVertical] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  // ------------------------------------------------------------------
  // Load the church logo. The African-print pattern is now drawn
  // procedurally, so no external artwork asset is required.
  // ------------------------------------------------------------------
  useEffect(() => {
    const churchLogo = new Image();
    churchLogo.onload = () => setLogo(churchLogo);
    churchLogo.onerror = () => setError('The church logo could not load. Please refresh and try again.');
    churchLogo.src = '/pcc-logo.png';

    return () => {
      churchLogo.onload = null;
      churchLogo.onerror = null;
    };
  }, []);

  // ------------------------------------------------------------------
  // Main canvas drawing
  // ------------------------------------------------------------------
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    if (!ctx) return;

    // ===== Paper background with a soft crumpled-paper feel =====
    const paper = ctx.createLinearGradient(0, 0, 1080, 1080);
    paper.addColorStop(0, '#ffffff');
    paper.addColorStop(0.4, PAPER);
    paper.addColorStop(0.72, '#ffffff');
    paper.addColorStop(1, PAPER_SHADOW);
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, 1080, 1080);

    // Faint fold creases, seeded so they render the same every time.
    let seed = 42;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.strokeStyle = '#7a7461';
    for (let i = 0; i < 14; i++) {
      ctx.lineWidth = rand() * 2 + 0.4;
      ctx.beginPath();
      const x1 = rand() * 1080;
      ctx.moveTo(x1, 0);
      ctx.lineTo(x1 + (rand() - 0.5) * 220, 1080);
      ctx.stroke();
    }
    ctx.restore();

    // ===== African-print tile, reused for lettering, the corner
    // triangles, and the photo ring — bands of teal, rust, cream dots,
    // and amber chevrons on a charcoal ground, like the flyer's type. =====
    const buildTile = () => {
      const tile = document.createElement('canvas');
      tile.width = 200;
      tile.height = 200;
      const t = tile.getContext('2d');
      if (!t) return null;

      t.fillStyle = CHARCOAL;
      t.fillRect(0, 0, 200, 200);

      t.save();
      t.translate(100, 100);
      t.rotate(-Math.PI / 6);

      for (let x = -300; x < 300; x += 200) {
        t.fillStyle = TEAL;
        t.fillRect(x, -300, 42, 600);
        t.fillStyle = RUST;
        t.fillRect(x + 42, -300, 34, 600);
        t.fillStyle = AMBER;
        t.fillRect(x + 76, -300, 26, 600);
        t.fillStyle = CHARCOAL;
        t.fillRect(x + 102, -300, 46, 600);

        for (let y = -300; y < 300; y += 34) {
          // cream dots on the charcoal band
          t.beginPath();
          t.arc(x + 125, y, 6, 0, Math.PI * 2);
          t.fillStyle = CREAM;
          t.fill();

          // amber chevrons on the teal/rust seam
          t.strokeStyle = CREAM;
          t.lineWidth = 3.5;
          t.beginPath();
          t.moveTo(x + 8, y - 8);
          t.lineTo(x + 21, y + 6);
          t.lineTo(x + 34, y - 8);
          t.stroke();

          // small hollow ring on the amber band
          t.beginPath();
          t.arc(x + 90, y, 5, 0, Math.PI * 2);
          t.strokeStyle = CHARCOAL;
          t.lineWidth = 2;
          t.stroke();
        }
      }
      t.restore();
      return ctx.createPattern(tile, 'repeat');
    };

    const textile = buildTile();
    if (!textile) return;

    // ===== Helper: centered text, auto-shrink to fit =====
    const text = (
      value: string,
      y: number,
      size: number,
      color: string | CanvasPattern = NAVY,
      family = 'Arial',
      weight = 'bold',
      max = 900,
    ) => {
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.font = `${weight} ${size}px ${family}`;
      while (ctx.measureText(value).width > max && size > 12) {
        size--;
        ctx.font = `${weight} ${size}px ${family}`;
      }
      ctx.fillText(value, 540, y);
    };

    // ===== Diamond-fold corners, filled with the print pattern, echoing
    // the flyer's cut-corner triangles =====
    const drawCorner = (flip: boolean) => {
      ctx.save();
      if (flip) {
        ctx.translate(1080, 1080);
        ctx.rotate(Math.PI);
      }
      ctx.beginPath();
      ctx.moveTo(1080, 0);
      ctx.lineTo(1080, 268);
      ctx.lineTo(812, 0);
      ctx.closePath();
      ctx.clip();
      ctx.fillStyle = textile;
      ctx.fillRect(780, -30, 330, 330);
      ctx.restore();

      // cream seam along the fold
      ctx.save();
      if (flip) {
        ctx.translate(1080, 1080);
        ctx.rotate(Math.PI);
      }
      ctx.strokeStyle = CREAM;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(812, 0);
      ctx.lineTo(1080, 268);
      ctx.stroke();
      ctx.restore();
    };
    drawCorner(false);
    drawCorner(true);

    // ===== Circular church logo =====
    if (logo) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(540, 60, 46, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(logo, 494, 14, 92, 92);
      ctx.restore();
    }

    // ===== Header =====
    text('PRESBYTERIAN CHURCH · KUMBA-MBENG', 137, 22, NAVY);
    text('Faith, heritage & thanksgiving', 171, 25, AMBER, 'Georgia', 'italic');

    // ===== Title, filled with the print pattern like the flyer's lettering,
    // with a thin charcoal keyline so the letterforms stay crisp =====
    const titleLine = (value: string, y: number) => {
      ctx.textAlign = 'center';
      let size = 142;
      ctx.font = `900 ${size}px "Impact", "Arial Black", Arial`;
      while (ctx.measureText(value).width > 900 && size > 12) {
        size--;
        ctx.font = `900 ${size}px "Impact", "Arial Black", Arial`;
      }
      ctx.lineWidth = 5;
      ctx.strokeStyle = CHARCOAL;
      ctx.strokeText(value, 540, y);
      ctx.fillStyle = textile;
      ctx.fillText(value, 540, y);
    };
    titleLine('CULTURAL', 303);
    titleLine('JAMBOREE', 430);

    // Amber pill, echoing the flyer's date badge
    ctx.save();
    ctx.fillStyle = AMBER;
    const pillW = 220;
    const pillX = 540 - pillW / 2;
    ctx.beginPath();
    ctx.roundRect(pillX, 452, pillW, 46, 23);
    ctx.fill();
    ctx.restore();
    text('— 2 0 2 6 —', 483, 24, '#ffffff');

    // Traditional instruments flank the portrait, within the card's safe margins.
    const drawDrum = (x: number, y: number, scale: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.scale(scale, scale);
      const wood = ctx.createLinearGradient(-65, 0, 65, 0);
      wood.addColorStop(0, '#482416');
      wood.addColorStop(0.4, '#b76c32');
      wood.addColorStop(0.7, '#824020');
      wood.addColorStop(1, '#361b12');
      ctx.fillStyle = wood;
      ctx.strokeStyle = CHARCOAL;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-72, -92);
      ctx.bezierCurveTo(-66, -25, -30, 4, -29, 35);
      ctx.lineTo(-43, 103);
      ctx.quadraticCurveTo(0, 121, 43, 103);
      ctx.lineTo(29, 35);
      ctx.bezierCurveTo(30, 4, 66, -25, 72, -92);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // Tension cords and a woven band around the carved wooden shell.
      ctx.strokeStyle = '#edcb83'; ctx.lineWidth = 3;
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath(); ctx.moveTo(i * 21, -89);
        ctx.lineTo(i * 8, 31); ctx.lineTo(i * 12, 101); ctx.stroke();
      }
      ctx.fillStyle = TEAL; ctx.fillRect(-30, 22, 60, 20);
      ctx.strokeStyle = AMBER; ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = -28; x < 30; x += 14) {
        ctx.moveTo(x, 25); ctx.lineTo(x + 7, 38); ctx.lineTo(x + 14, 25);
      }
      ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, -92, 76, 29, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#dec69b'; ctx.fill();
      ctx.strokeStyle = RUST; ctx.lineWidth = 9; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, -94, 65, 21, 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#8a5a30'; ctx.lineWidth = 2; ctx.stroke();
      ctx.restore();
    };
    drawDrum(159, 693, 0.8, -0.16);
    drawDrum(249, 695, 1.05, 0.12);

    // Suspended bronze gong with a raised boss and a wooden padded beater.
    ctx.save();
    ctx.translate(890, 672);
    ctx.strokeStyle = '#6b4324'; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(-30, -79);
    ctx.quadraticCurveTo(0, -175, 30, -79); ctx.stroke();
    const bronze = ctx.createRadialGradient(-30, -35, 6, 0, 0, 104);
    bronze.addColorStop(0, '#fff0b0');
    bronze.addColorStop(0.38, '#dca546');
    bronze.addColorStop(0.75, '#9e5e21');
    bronze.addColorStop(0.93, '#efc56c');
    bronze.addColorStop(1, '#69401d');
    ctx.beginPath(); ctx.arc(0, 0, 103, 0, Math.PI * 2);
    ctx.fillStyle = bronze; ctx.fill();
    ctx.strokeStyle = '#663b1d'; ctx.lineWidth = 4; ctx.stroke();
    for (const radius of [88, 78, 65, 49]) {
      ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#71451e55'; ctx.lineWidth = 2; ctx.stroke();
    }
    const boss = ctx.createRadialGradient(-9, -10, 1, 0, 0, 32);
    boss.addColorStop(0, '#ffe5a0'); boss.addColorStop(1, '#88501c');
    ctx.beginPath(); ctx.arc(0, 0, 32, 0, Math.PI * 2);
    ctx.fillStyle = boss; ctx.fill();
    ctx.lineCap = 'round'; ctx.lineWidth = 12; ctx.strokeStyle = '#6b3820';
    ctx.beginPath(); ctx.moveTo(-55, 143); ctx.lineTo(58, 46); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(58, 46, 20, 28, 0.85, 0, Math.PI * 2);
    ctx.fillStyle = TEAL; ctx.fill();
    ctx.strokeStyle = AMBER; ctx.lineWidth = 3; ctx.stroke();
    ctx.restore();

    // ===== Photo circle with the pattern ring =====
    ctx.save();
    ctx.shadowColor = '#17110d33';
    ctx.shadowBlur = 25;
    ctx.shadowOffsetY = 9;
    ctx.beginPath();
    ctx.arc(540, 660, 175, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(540, 660, 175, 0, Math.PI * 2);
    ctx.strokeStyle = textile;
    ctx.lineWidth = 14;
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.arc(540, 660, 160, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = '#e7e8df';
    ctx.fill();

    if (photo) {
      const scale =
        Math.max(322 / photo.naturalWidth, 322 / photo.naturalHeight) * zoom;
      const width = photo.naturalWidth * scale;
      const height = photo.naturalHeight * scale;
      const dx = 379 - (width - 322) * (horizontal / 100);
      const dy = 499 - (height - 322) * (vertical / 100);
      ctx.drawImage(photo, dx, dy, width, height);
    } else {
      ctx.fillStyle = '#becbbf';
      ctx.beginPath();
      ctx.arc(540, 619, 48, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(540, 749, 100, 78, 0, 0, Math.PI * 2);
      ctx.fill();
      text('YOUR PHOTO', 790, 18, TEAL);
    }
    ctx.restore();

    // ===== Ribbon corners =====
    ctx.fillStyle = AMBER;
    ctx.beginPath();
    ctx.moveTo(311, 799);
    ctx.lineTo(365, 799);
    ctx.lineTo(365, 867);
    ctx.lineTo(311, 867);
    ctx.lineTo(327, 833);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(769, 799);
    ctx.lineTo(715, 799);
    ctx.lineTo(715, 867);
    ctx.lineTo(769, 867);
    ctx.lineTo(753, 833);
    ctx.closePath();
    ctx.fill();

    // ===== Navy banner + name =====
    ctx.fillStyle = NAVY;
    ctx.fillRect(348, 795, 384, 62);
    text("I’LL BE THERE!", 838, 37, '#ffffff');
    text(name.trim() || 'Your name here', 914, 46, NAVY, 'Georgia', 'bold', 720);

    // ===== Footer, with a small pin mark before the reference like the
    // flyer's location line =====
    text('Filled with the bread of Life...', 959, 30, TEAL, 'Georgia', 'italic');
    text('We give with joyful hearts.', 997, 30, TEAL, 'Georgia', 'italic');

    ctx.save();
    ctx.fillStyle = AMBER;
    ctx.beginPath();
    ctx.arc(453, 1033, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(453, 1039);
    ctx.lineTo(447, 1029);
    ctx.lineTo(459, 1029);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    text('JOHN 6:30–35', 1040, 21, AMBER, 'Arial', 'bold', 700);
  }, [name, photo, logo, zoom, horizontal, vertical]);

  // ------------------------------------------------------------------
  // Photo selection
  // ------------------------------------------------------------------
  async function choosePhoto(file?: File) {
    const current = ++selection.current;
    setError('');
    setStatus('');

    if (!file) {
      setLoading(false);
      return;
    }

    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
      file.size > 10 * 1024 * 1024
    ) {
      setLoading(false);
      setError('Choose a JPG, PNG or WebP photo smaller than 10 MB.');
      return;
    }

    setLoading(true);
    const url = URL.createObjectURL(file);

    try {
      const image = new Image();
      image.src = url;
      await image.decode();

      if (current !== selection.current) return;

      setPhoto(image);
      setZoom(1);
      setHorizontal(50);
      setVertical(50);
    } catch {
      if (current === selection.current) {
        setError('This photo could not be opened. Please choose another image.');
      }
    } finally {
      URL.revokeObjectURL(url);
      if (current === selection.current) setLoading(false);
    }
  }

  // ------------------------------------------------------------------
  // Download
  // ------------------------------------------------------------------
  function download() {
    if (!canvas.current || !photo || !name.trim() || !logo || loading) return;
    setError('');

    canvas.current.toBlob(
      (blob) => {
        if (!blob) {
          setError('Could not create your card. Please try again.');
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'cultural-harvest-2026-ill-be-there.png';
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        setStatus('Your card is ready. Check your downloads to share it!');
      },
      'image/png',
    );
  }

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <section
      id="ill-be-there"
      className="scroll-mt-36 bg-[#efe4ce] px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c62a18]">
            An invitation to celebrate
          </p>
          <h2 className={`${styles.serif} mt-4 text-4xl sm:text-5xl`}>
            I’ll be there.
          </h2>
          <p className="mb-7 mt-4 leading-relaxed">
            Celebrate your part in Cultural Harvest 2026. Add your name and
            photo, then download your own card to share.
          </p>

          <label htmlFor="card-name" className="block font-semibold">
            Your name
          </label>
          <input
            id="card-name"
            autoComplete="name"
            maxLength={60}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setStatus('');
            }}
            placeholder="Enter your name"
            className="mb-5 mt-2 w-full rounded border border-[#0b0e4a]/30 bg-white px-4 py-3"
          />

          <label htmlFor="card-photo" className="block font-semibold">
            Your photo
          </label>
          <input
            id="card-photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-describedby="card-photo-help"
            onChange={(e) => {
              void choosePhoto(e.target.files?.[0]);
              e.target.value = '';
            }}
            className="mt-2 block w-full text-sm file:mr-3 file:rounded file:border-0 file:bg-[#0b0e4a] file:px-4 file:py-3 file:text-white"
          />
          <p id="card-photo-help" className="mt-2 text-sm text-[#535361]">
            JPG, PNG or WebP · Up to 10 MB. Your name and photo stay on this
            device.
          </p>

          {photo && (
            <fieldset className="mt-5 space-y-3">
              <legend className="mb-2 font-semibold">Adjust your photo</legend>
              {[
                { id: 'zoom', label: 'Zoom', value: zoom, min: 1, max: 3, step: 0.05, set: setZoom },
                { id: 'horizontal', label: 'Left / right', value: horizontal, min: 0, max: 100, step: 1, set: setHorizontal },
                { id: 'vertical', label: 'Up / down', value: vertical, min: 0, max: 100, step: 1, set: setVertical },
              ].map((control) => (
                <label key={control.id} className="block text-sm">
                  {control.label}
                  <input
                    type="range"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={control.value}
                    onChange={(e) => control.set(Number(e.target.value))}
                    className="mt-1 block w-full accent-[#c62a18]"
                  />
                </label>
              ))}
            </fieldset>
          )}

          <p role="status" className="mt-4 text-sm">
            {loading ? 'Opening your photo…' : status}
          </p>
          {error && (
            <p role="alert" className="mt-3 text-sm text-red-800">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={download}
            disabled={!name.trim() || !photo || !logo || loading}
            className="mt-5 min-h-[48px] rounded bg-[#0b0e4a] px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Download my card
          </button>
          <p className="mt-3 text-sm text-[#535361]">
            Add a name and photo to download a 1080 × 1080 PNG.
          </p>
        </div>

        <div>
          <canvas
            ref={canvas}
            width={1080}
            height={1080}
            role="img"
            aria-label={`Cultural Harvest 2026 I’ll be there card for ${
              name.trim() || 'your name'
            }, decorated with traditional drums and a bronze gong. Filled with the bread of Life... We give with joyful hearts. John 6:30–35.`}
            className="h-auto w-full rounded-sm shadow-xl"
          />
          <p className="mt-4 text-center text-sm text-[#535361]">
            Your card preview
          </p>
        </div>
      </div>
    </section>
  );
}
