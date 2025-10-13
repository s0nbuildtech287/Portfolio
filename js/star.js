const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

// Khởi tạo stars trước
const stars = Array.from({ length: 100 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 2 + 1,
  s: Math.random() * 0.5 + 0.2,
}));

function resizeCanvas() {
  const mainContent = document.querySelector(".main-content");
  canvas.width = mainContent.offsetWidth;
  canvas.height = mainContent.offsetHeight;
  // Cập nhật vị trí các vì sao
  stars.forEach((star) => {
    star.x = Math.random() * canvas.width;
    star.y = Math.random() * canvas.height;
  });
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Gọi sau khi stars được khởi tạo

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach((star) => {
    star.y += star.s;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`; // Hiệu ứng nhấp nháy
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(animate);
}

animate();
