import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Banknote {
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  spinSpeed: number;
  tiltAngle: number;
  tiltSpeed: number;
  driftX: number;
  driftY: number;
  scale: number;
  opacity: number;
}

interface GoldParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  pulseSpeed: number;
  symbol?: string;
}

export const WealthBackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Setup 3D Floating USD Banknotes
    const isMobile = width < 768;
    const banknoteCount = isMobile ? 6 : 14;
    const banknotes: Banknote[] = [];

    for (let i = 0; i < banknoteCount; i++) {
      banknotes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        width: 84,
        height: 40,
        angle: (Math.random() - 0.5) * 0.8,
        spinSpeed: (Math.random() - 0.5) * 0.008,
        tiltAngle: Math.random() * Math.PI * 2,
        tiltSpeed: Math.random() * 0.015 + 0.008,
        driftX: (Math.random() - 0.5) * 0.5,
        driftY: -Math.random() * 0.45 - 0.25, // float upward gracefully
        scale: Math.random() * 0.45 + 0.65,
        opacity: Math.random() * 0.4 + 0.35,
      });
    }

    // Setup Rising Golden Bullion Stardust & USD Currency Glyphs
    const goldCount = isMobile ? 30 : 65;
    const particles: GoldParticle[] = [];
    const symbols = ['$', 'USD', '100', '★', '$', 'USD'];

    for (let i = 0; i < goldCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 1.2,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: -Math.random() * 0.6 - 0.15,
        opacity: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        symbol: Math.random() > 0.65 ? symbols[Math.floor(Math.random() * symbols.length)] : undefined,
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Helper to draw a single 3D floating 100 USD banknote
    const draw100UsdBill = (
      c: CanvasRenderingContext2D,
      bn: Banknote,
      isLight: boolean
    ) => {
      c.save();
      c.translate(bn.x, bn.y);
      c.rotate(bn.angle);

      // Simulate 3D tumbling in the wind using vertical perspective scaling
      const perspectiveScaleY = Math.cos(bn.tiltAngle);
      c.scale(bn.scale, bn.scale * perspectiveScaleY);

      const w = bn.width;
      const h = bn.height;
      const halfW = w / 2;
      const halfH = h / 2;

      // Base banknote shading
      c.globalAlpha = bn.opacity * (isLight ? 0.45 : 0.6);

      // Banknote Body: subtle intaglio green & metallic champagne gold
      const billGradient = c.createLinearGradient(-halfW, -halfH, halfW, halfH);
      if (isLight) {
        billGradient.addColorStop(0, '#F0FDF4');
        billGradient.addColorStop(0.5, '#FEF9C3');
        billGradient.addColorStop(1, '#DCFCE7');
      } else {
        billGradient.addColorStop(0, 'rgba(6, 40, 20, 0.95)');
        billGradient.addColorStop(0.5, 'rgba(28, 25, 12, 0.92)');
        billGradient.addColorStop(1, 'rgba(10, 46, 24, 0.95)');
      }

      c.fillStyle = billGradient;
      c.strokeStyle = isLight ? 'rgba(5, 150, 105, 0.6)' : 'rgba(217, 119, 6, 0.7)';
      c.lineWidth = 1.2;

      // Rounded banknote rect
      c.beginPath();
      c.roundRect(-halfW, -halfH, w, h, 3);
      c.fill();
      c.stroke();

      // Intaglio fine inner security border
      c.strokeStyle = isLight ? 'rgba(217, 119, 6, 0.4)' : 'rgba(250, 204, 21, 0.4)';
      c.lineWidth = 0.8;
      c.strokeRect(-halfW + 3, -halfH + 3, w - 6, h - 6);

      // Corner "$100" Markings
      c.fillStyle = isLight ? '#065F46' : '#34D399';
      c.font = 'bold 7px sans-serif';
      c.textAlign = 'left';
      c.fillText('$100', -halfW + 5, -halfH + 10);
      c.textAlign = 'right';
      c.fillText('$100', halfW - 5, halfH - 5);

      // Central Oval Medallion / Presidential Watermark
      c.beginPath();
      c.ellipse(0, 0, 12, 14, 0, 0, Math.PI * 2);
      c.fillStyle = isLight ? 'rgba(217, 119, 6, 0.15)' : 'rgba(217, 119, 6, 0.25)';
      c.fill();
      c.strokeStyle = isLight ? 'rgba(217, 119, 6, 0.5)' : 'rgba(250, 204, 21, 0.6)';
      c.stroke();

      // Center text "USD"
      c.fillStyle = isLight ? '#92400E' : '#FDE047';
      c.font = 'bold 6.5px monospace';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText('USD', 0, 0);

      // Micro security line "UNITED STATES OF AMERICA"
      c.fillStyle = isLight ? 'rgba(6, 95, 70, 0.65)' : 'rgba(52, 211, 153, 0.65)';
      c.font = '4.5px sans-serif';
      c.fillText('THE UNITED STATES', 0, -halfH + 8);
      c.fillText('ONE HUNDRED DOLLARS', 0, halfH - 7);

      // Subtle light sheen reflection across the bill
      const sheenGrad = c.createLinearGradient(-halfW, 0, halfW, 0);
      sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      sheenGrad.addColorStop(0.5, isLight ? 'rgba(255, 255, 255, 0.5)' : 'rgba(253, 224, 71, 0.25)');
      sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      c.fillStyle = sheenGrad;
      c.fillRect(-halfW, -halfH, w, h);

      c.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isLight = theme === 'light';
      const goldR = isLight ? 217 : 245;
      const goldG = isLight ? 119 : 197;
      const goldB = isLight ? 6 : 60;

      // 1. Render Rising Golden Bullion Stardust & Currency Glyphs
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Mouse repelling physics
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x += (dx / dist) * 1.5;
          p.y += (dy / dist) * 1.5;
        }

        // Loop boundaries
        if (p.y < -30) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 20;
        if (p.x > width + 30) p.x = -20;

        p.opacity += Math.sin(Date.now() * p.pulseSpeed) * 0.01;
        const currentOpacity = Math.max(0.1, Math.min(0.75, p.opacity));

        // Draw golden particle
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, `rgba(${goldR}, ${goldG}, ${goldB}, ${currentOpacity})`);
        gradient.addColorStop(1, `rgba(${goldR}, ${goldG}, ${goldB}, 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw floating wealth symbol ($ or USD)
        if (p.symbol) {
          ctx.font = `${p.symbol === 'USD' ? '11px' : '14px'} monospace`;
          ctx.fillStyle = `rgba(${goldR}, ${goldG}, ${goldB}, ${currentOpacity * (isLight ? 0.45 : 0.55)})`;
          ctx.fillText(p.symbol, p.x + 4, p.y + 4);
        }
      });

      // 2. Render 3D Floating USD Banknotes
      banknotes.forEach((bn) => {
        bn.x += bn.driftX;
        bn.y += bn.driftY;
        bn.angle += bn.spinSpeed;
        bn.tiltAngle += bn.tiltSpeed;

        // Subtle mouse drift
        const dx = bn.x - mouseX;
        const dy = bn.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          bn.x += (dx / dist) * 0.8;
          bn.y += (dy / dist) * 0.8;
        }

        // Loop boundaries
        if (bn.y < -80) {
          bn.y = height + 60;
          bn.x = Math.random() * width;
        }
        if (bn.x < -100) bn.x = width + 60;
        if (bn.x > width + 100) bn.x = -60;

        draw100UsdBill(ctx, bn, isLight);
      });

      // 3. Ambient Glowing Wealth Aura at Cursor
      const cursorGlow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 450);
      cursorGlow.addColorStop(0, isLight ? 'rgba(217, 119, 6, 0.05)' : 'rgba(245, 158, 11, 0.08)');
      cursorGlow.addColorStop(0.6, isLight ? 'rgba(5, 150, 105, 0.02)' : 'rgba(16, 185, 129, 0.03)');
      cursorGlow.addColorStop(1, 'rgba(217, 119, 6, 0)');
      ctx.fillStyle = cursorGlow;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic ambient gold & emerald wealth lighting wave */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(217,119,6,0.12),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.14),rgba(0,0,0,0))] pointer-events-none" />
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-90 transition-opacity duration-700"
      />
    </div>
  );
};
