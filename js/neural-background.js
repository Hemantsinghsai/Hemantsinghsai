/******************************************************************
 *
 * Neural Background Engine V2
 * Author : Hemant Singh + ChatGPT
 * Version: 2.0
 *
 ******************************************************************/

(() => {

"use strict";

/*==============================================================
=                         CONFIGURATION                         =
==============================================================*/

const CONFIG = {

    particleCount: 170,

    connectionDistance: 130,

    mouseRadius: 170,

    spring: 0.03,

    friction: 0.90,

    maxPackets: 60,

    maxTrail: 80,

    maxRipples: 6,
    rippleSpeed: 6,

    glowColor: "#60a5fa",

    font: "JetBrains Mono"

};


/*==============================================================
=                           CANVAS                             =
==============================================================*/

const canvas = document.getElementById("neural-bg");

const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;

function resize(){

    width = canvas.width = window.innerWidth;

    height = canvas.height = window.innerHeight;

}

resize();

window.addEventListener("resize",resize);


/*==============================================================
=                         MOUSE STATE                          =
==============================================================*/

const mouse={

    x:-1000,

    y:-1000,

    active:false

};

window.addEventListener("mousemove",(e)=>{

    mouse.x = e.clientX;
    mouse.y = e.clientY;

    mouse.active = true;

    if (trail.length < CONFIG.maxTrail) {

        trail.push(
            new TrailParticle(mouse.x, mouse.y)
        );

    }
if (
    ripples.length < CONFIG.maxRipples &&
    Math.random() < 0.04
) {

    ripples.push(
        new Ripple(mouse.x, mouse.y)
    );

}

});

window.addEventListener("mouseleave",()=>{

    mouse.active=false;

});


/*==============================================================
=                          SYMBOLS                             =
==============================================================*/

const SYMBOLS=[

    "C++",

    "Java",

    "Python",

    "AI",

    "ML",

    "DSA",

    "Git",

    "API",

    "Node",

    "HTML",

    "CSS",

    "JS",

    "SQL",

    "<>",

    "</>",

    "{}",

    "()",

    "[]"

];


/*==============================================================
=                      PARTICLE CLASS                          =
==============================================================*/

class Particle{

    constructor(){

        this.homeX=Math.random()*width;

        this.homeY=Math.random()*height;

        this.x=this.homeX;

        this.y=this.homeY;

        this.vx=0;

        this.vy=0;

        this.size=10+Math.random()*8;

        this.opacity=0.04+Math.random()*0.06;

        this.char=SYMBOLS[
            Math.floor(Math.random()*SYMBOLS.length)
        ];

    }

}

/*==============================================================
=                    ENERGY PACKET CLASS                       =
==============================================================*/

class EnergyPacket {

    constructor(from, to) {

        this.from = from;
        this.to = to;

        this.progress = 0;

        this.speed =
            0.006 + Math.random() * 0.010;

        this.size =
            2 + Math.random() * 2;

        this.alpha = 1;

        this.dead = false;

    }

    update() {

        this.progress += this.speed;

        if (this.progress >= 1)
            this.dead = true;

    }

    draw() {

        const x =
            this.from.x +
            (this.to.x - this.from.x) * this.progress;

        const y =
            this.from.y +
            (this.to.y - this.from.y) * this.progress;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(96,165,250,${this.alpha})`;

        ctx.shadowBlur = 18;
        ctx.shadowColor = CONFIG.glowColor;

        ctx.fill();

        ctx.shadowBlur = 0;

    }

}

/*==============================================================
=                        CURSOR TRAIL                          =
==============================================================*/

class TrailParticle {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2;

        this.radius = 2 + Math.random() * 2;

        this.life = 1;

    }

    update() {

        this.x += this.vx;
        this.y += this.vy;

        this.life -= 0.025;

    }

    draw() {

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(96,165,250,${this.life})`;

        ctx.shadowBlur = 15;
        ctx.shadowColor = CONFIG.glowColor;

        ctx.fill();

        ctx.shadowBlur = 0;

    }

}

/*==============================================================
=                        RIPPLE CLASS                          =
==============================================================*/

class Ripple {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.radius = 0;

        this.alpha = 0.35;

        this.dead = false;

    }

    update() {

        this.radius += CONFIG.rippleSpeed;

        this.alpha -= 0.005;

        if (this.alpha <= 0)
            this.dead = true;

    }

    draw() {

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle =
            `rgba(96,165,250,${this.alpha})`;

        ctx.lineWidth = 2;

        ctx.shadowBlur = 18;

        ctx.shadowColor = CONFIG.glowColor;

        ctx.stroke();

        ctx.shadowBlur = 0;

    }

}

/*==============================================================
=                    PARTICLE MANAGER                          =
==============================================================*/

const particles = [];

function createParticles() {

    particles.length = 0;

    const count = Math.min(
        CONFIG.particleCount,
        Math.floor(window.innerWidth / 8)
    );

    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

createParticles();

window.addEventListener("resize", createParticles);

/*==============================================================
=                    ENERGY MANAGER                            =
==============================================================*/

const packets = [];
const trail = [];
const ripples = [];

/*==============================================================
=                     PHYSICS ENGINE                           =
==============================================================*/

function updateParticles() {

    for (const p of particles) {

        // Spring force back to home position
        const springX = (p.homeX - p.x) * CONFIG.spring;
        const springY = (p.homeY - p.y) * CONFIG.spring;

        p.vx += springX;
        p.vy += springY;

        // Cursor interaction
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;

        const dist = Math.sqrt(dx * dx + dy * dy);

        if (mouse.active && dist < CONFIG.mouseRadius) {

            const force =
                (CONFIG.mouseRadius - dist) /
                CONFIG.mouseRadius;

            p.vx +=
                (dx / (dist || 1)) *
                force *
                2.5;

            p.vy +=
                (dy / (dist || 1)) *
                force *
                2.5;

        }

        // Friction
        p.vx *= CONFIG.friction;
        p.vy *= CONFIG.friction;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

    }

}

/*==============================================================
=                         RENDERER                             =
==============================================================*/

function drawParticles() {

    ctx.clearRect(0, 0, width, height);

    /*==============================================================
=                    NEURAL CONNECTIONS                        =
==============================================================*/

for (let i = 0; i < particles.length; i++) {

    const a = particles[i];

    for (let j = i + 1; j < particles.length; j++) {

        const b = particles[j];

        const dx = a.x - b.x;
        const dy = a.y - b.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > CONFIG.connectionDistance)
            continue;

        // Line opacity based on distance
        let alpha =
            (1 - distance / CONFIG.connectionDistance) * 0.10;

        // Cursor energy
        const midX = (a.x + b.x) * 0.5;
        const midY = (a.y + b.y) * 0.5;

        const mdx = midX - mouse.x;
        const mdy = midY - mouse.y;

        const mouseDistance = Math.sqrt(mdx * mdx + mdy * mdy);

        const energy = mouse.active
            ? Math.max(0, 1 - mouseDistance / 220)
            : 0;

        alpha += energy * 0.35;

        ctx.beginPath();

        ctx.moveTo(a.x, a.y);

        ctx.lineTo(b.x, b.y);

        ctx.lineWidth = 1 + energy * 1.5;

        ctx.strokeStyle =
            `rgba(96,165,250,${alpha})`;

        ctx.shadowBlur = energy * 18;
        ctx.shadowColor = CONFIG.glowColor;

        ctx.stroke();

        ctx.shadowBlur = 0;

        if (
    mouse.active &&
    energy > 0.7 &&
    packets.length < CONFIG.maxPackets &&
    Math.random() < 0.006
) {

    packets.push(
        new EnergyPacket(a, b)
    );

}

    }

}  

// Draw Energy Packets
for (const packet of packets) {
    packet.draw();
}

// Draw Cursor Trail
for (const particle of trail) {

    particle.draw();

}

// Draw Ripples
for (const ripple of ripples) {

    ripple.draw();

}

    for (const p of particles) {

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;

        const dist = Math.sqrt(dx * dx + dy * dy);

        const influence = mouse.active
            ? Math.max(0, 1 - dist / CONFIG.mouseRadius)
            : 0;

        const glow = p.opacity + influence * 0.45;

        const scale = 1 + influence * 0.35;

        ctx.save();

        ctx.translate(p.x, p.y);

        ctx.scale(scale, scale);

        ctx.font = `${p.size}px ${CONFIG.font}`;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.shadowBlur = 20 * influence;
        ctx.shadowColor = CONFIG.glowColor;

        ctx.fillStyle =
            `rgba(96,165,250,${glow})`;

        ctx.fillText(p.char, 0, 0);

        ctx.restore();

    }

}


/*==============================================================
=                    ANIMATION LOOP                            =
==============================================================*/

function animate() {

    updateParticles();

    for (let i = packets.length - 1; i >= 0; i--) {

    packets[i].update();

    if (packets[i].dead) {

        packets.splice(i, 1);

    }

}
for (let i = trail.length - 1; i >= 0; i--) {

    trail[i].update();

    if (trail[i].life <= 0) {

        trail.splice(i, 1);

    }

}
for (let i = ripples.length - 1; i >= 0; i--) {

    ripples[i].update();

    if (ripples[i].dead) {

        ripples.splice(i, 1);

    }

}

    drawParticles();

    requestAnimationFrame(animate);

}

animate();


})();     // ← closes the engine