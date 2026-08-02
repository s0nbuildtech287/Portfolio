import React, { useEffect, useRef } from "react";

const StarfieldCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;

    const stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * (canvas.width || 800),
      y: Math.random() * (canvas.height || 600),
      r: Math.random() * 2 + 1,
      s: Math.random() * 0.5 + 0.2,
    }));

    const resizeCanvas = () => {
      const mainContent = document.querySelector(".main-content");
      if (mainContent && canvas) {
        canvas.width = mainContent.offsetWidth;
        canvas.height = mainContent.offsetHeight;
        stars.forEach((star) => {
          star.x = Math.random() * canvas.width;
          star.y = Math.random() * canvas.height;
        });
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        star.y += star.s;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas id="starfield" ref={canvasRef}></canvas>;
};

export default StarfieldCanvas;
