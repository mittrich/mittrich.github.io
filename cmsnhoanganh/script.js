window.addEventListener('DOMContentLoaded', function() {
  const audio = document.getElementById('birthday-audio');
  const playAudio = () => {
    audio.play();
    // Bỏ sự kiện này sau khi phát để không gọi lại nhiều lần
    document.body.removeEventListener('click', playAudio);
  };

  // Tự động cố gắng phát (nếu được phép)
  audio.play().catch(() => { 
    // Nếu bị chặn, đợi click người dùng
    document.body.addEventListener('click', playAudio);
  });
});

// Phát nhạc tự động (kích hoạt khi user tương tác đầu tiên - do trình duyệt bảo mật)
window.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('birthday-audio');
    const playAudio = () => {
        audio.play();
        // chỉ phát lần đầu
        document.body.removeEventListener('click', playAudio);
    };
    setTimeout(() => { // tự động play sau nhỏ giây nếu cho phép
        audio.play().catch(() => { /* Bị block */ });
    }, 500);

    document.body.addEventListener('click', playAudio); // kích hoạt nếu bị block tự động

    // Fireworks
    initFireworks();
});

// ---- Fireworks Effect ----
function randomColor(){
    const colors = [
        '#ff7675','#74b9ff','#fd79a8','#ffeaa7','#00b894','#00cec9','#fdcb6e',
        '#fd4e63','#a29bfe','#fdab53','#00bfff','#ffbe76','#e056fd','#686de0'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Firework particle class
class Particle {
    constructor(x, y, angle, speed, color){
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.color = color;
        this.alpha = 1;
        this.size = Math.random() * 2 + 1;
    }
    update(){
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.speed *= 0.98;
        this.alpha -= 0.008 + Math.random() * 0.008;
        if(this.alpha < 0) this.alpha = 0;
    }
    draw(ctx){
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
    }
}

// Firework effect
function initFireworks() {
    const canvas = document.getElementById('fireworks');
    const ctx = canvas.getContext('2d');
    let particles = [];

    // resize canvas
    function resizeCanvas(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // tạo pháo hoa mới tại (x, y)
    function explode(x, y){
        let count = 32 + Math.floor(Math.random()*24);
        const color = randomColor();
        for(let i=0; i<count; i++){
            let angle = (Math.PI*2*i)/count;
            let speed = Math.random()*3 + 2;
            particles.push(new Particle(x, y, angle, speed, color));
        }
    }

    // bắn ngẫu nhiên mỗi 900-1300ms
    setInterval(()=>{
        const x = Math.random() * canvas.width * 0.8 + canvas.width*0.1;
        const y = Math.random() * canvas.height * 0.4 + canvas.height*0.1;
        explode(x, y);
    }, 200);

    // click để bắn pháo hoa tại điểm đó
    canvas.addEventListener('click', e=>{
        const rect = canvas.getBoundingClientRect();
        explode(e.clientX - rect.left, e.clientY - rect.top);
    });

    // render 
    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(let i=particles.length-1; i>=0; i--){
            particles[i].update();
            particles[i].draw(ctx);
            if(particles[i].alpha <= 0.05)
                particles.splice(i,1);
        }
        requestAnimationFrame(animate);
    }
    animate();
}
