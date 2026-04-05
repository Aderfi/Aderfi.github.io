(() => {
    const canvas = document.getElementById('dnaCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    /* ── Parámetros ajustables ── */
    const layerCount = 55;     // pares de bases
    const layerGap   = 35;     // separación vertical entre capas (px)
    const radius     = 120;    // anchura de la hélice (px)
    const speed      = 0.015;  // velocidad de rotación
    const rotation   = Math.PI;   // ángulo del eje de la hélice (rad)
    const offsetX    = 200;    // desplazamiento horizontal desde el centro (px)
    const offsetY    = 500;    // desplazamiento vertical desde el centro (px)

    const colorStrand1 = 'rgb(209, 0, 45)';
    const colorStrand2 = 'rgb(50, 115, 219)';
    const colorBridge  = '132,81,148';

    let width, height, phase = 50;

    function resize() {
        width  = window.innerWidth;
        height = window.innerHeight;
        canvas.width  = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    function render() {
        ctx.clearRect(0, 0, width, height);

        const cx = (width / 100) + offsetX;
        const cy = (height / 100) + offsetY;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        ctx.translate(-cx, -cy);

        const startY = cy - (layerCount * layerGap) / 2;

        for (let i = 0; i < layerCount; i++) {
            const y     = startY + i * layerGap;
            const angle = i * 0.25 + phase;

            const x1 = Math.cos(angle) * radius;
            const z1 = Math.sin(angle) * radius;
            const x2 = Math.cos(angle + Math.PI) * radius;
            const z2 = Math.sin(angle + Math.PI) * radius;

            const scale1 = (z1 + 250) / 250;
            const scale2 = (z2 + 250) / 250;
            const a1 = Math.max(0.1, (z1 + radius) / (2 * radius));
            const a2 = Math.max(0.1, (z2 + radius) / (2 * radius));

            // puente de hidrógeno
            ctx.beginPath();
            ctx.moveTo(cx + x1, y);
            ctx.lineTo(cx + x2, y);
            ctx.strokeStyle = `rgba(${colorBridge},${(a1 + a2) / 2})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // hebra 1
            ctx.beginPath();
            ctx.arc(cx + x1, y, 7 * scale1, 0, Math.PI * 2);
            ctx.fillStyle = colorStrand1;
            ctx.globalAlpha = a1;
            ctx.fill();

            // hebra 2
            ctx.beginPath();
            ctx.arc(cx + x2, y, 7 * scale2, 0, Math.PI * 2);
            ctx.fillStyle = colorStrand2;
            ctx.globalAlpha = a2;
            ctx.fill();

            ctx.globalAlpha = 1.0;
        }

        ctx.restore();
        phase -= speed;
        requestAnimationFrame(render);
    }
    render();
})();
