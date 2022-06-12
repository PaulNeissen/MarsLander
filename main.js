class Pod {

    constructor(x, y, vx, vy, f, r, p) {
        this.x = x;
        this.y = y;
        this.vx = vx
        this.vy = vy
        this.f = f
        this.r = r
        this.p = p
        this.dead = false
        this.win = false
    }

    save() {
        this.xs = this.x
        this.ys = this.y
        this.vxs = this.vx
        this.vys = this.vy
        this.fs = this.f
        this.rs = this.r
        this.ps = this.p
        this.deads = this.dead
        this.wins = this.win
    }

    load() {
        this.x = this.xs
        this.y = this.ys
        this.vx = this.vxs
        this.vy = this.vys
        this.f = this.fs
        this.r = this.rs
        this.p = this.ps
        this.dead = this.deads
        this.win = this.wins
    }

    print() {
        console.log(this.x, this.y, this.vx, this.vy, this.f, this.r, this.p);
    }
    
    printRound() {
        console.log(Math.round(this.x), Math.round(this.y), Math.round(this.vx), Math.round(this.vy), this.f, this.r, this.p);
    }

    simulate(rotate, power) {
        // Update rotate
        rotate = Math.min(rotate, 15)
        rotate = Math.max(rotate, -15)
        this.r += rotate
        this.r = Math.min(this.r, 45)
        this.r = Math.max(this.r, -45)

        // Update power
        power = Math.min(power, 1)
        power = Math.max(power, -1)
        this.p += power
        this.p = Math.min(this.p, 4)
        this.p = Math.max(this.p, 0)
        
        // Update fuel
        this.f -= this.p

        // Update position and sped
        var radian = this.r * Math.PI / 180.0
        var ax = Math.sin(radian) * this.p
        var ay = Math.cos(radian) * this.p - G
        this.x += this.vx - ax * 0.5
        this.y += this.vy + ay * 0.5
        this.vx -= ax
        this.vy += ay

        // Check collision
        // TODO : Handle case with a ceiling
        for (var i = 0; i < land.length-1; i++) {
            if (land[i][0] < this.x  && this.x < land[i+1][0]) {
                var xp = this.crossProduct(land[i], land[i+1])
                if (xp >= 0) {
                    if (target[0] < this.x < target[1] && this.r == 0 && Math.abs(this.vy) <= 40 && Math.abs(this.vx) <= 20) {
                        this.win = true
                    } else {
                        this.dead = true
                    }
                }
            }
        }
        
        // Check out of zone
        if (this.x < 0 || this.x > 7000 || this.y < 0 || this.y > 3000) {
            this.dead = true
        }
    }

    crossProduct(e1, e2) {
        return this.crossProduct2(e1[0], e1[1], e2[0], e2[1])
    }

    crossProduct2(x1, y1, x2, y2) {
        var v1 = [x2 - x1, y2 - y1]
        var v2 = [x2 - this.x, y2 - this.y]
        var xp = v1[0] * v2[1] - v1[1] * v2[0]
        return xp
    }

    eval() {
        result = 0

        // Fuel left
        result += this.f * 10

        if (!this.win) {
            // Distance with landing area
            dist1 = this.dist(target[0], target[2])
            dist2 = this.dist(target[1], target[2])
            dist = dist1 < dist2 ? dist1 : dist2
            result -= dist
        } else {
            result += 1000
        }
        return result
    }
    
    dist(x1, y1) {
        return math.sqrt((this.x - x1) * (this.x - x1) + (this.y - y1) * (this.y - y1))
    }

    closestLand() {
        xa = ya = xb = yb = 0
        for (var i = 0; i < land/length - 1; i++) {
            if (land[i][0] < this.x && this.x < land[i+1][0]) {
                xa = land[i][0]
                ya = land[i][1]
                xb = land[i+1][0]
                yb = land[i+1][1]
                break
            }
        }

        ap = [this.x - xa, this.y - ya]
        ab = [xb - xa, yb - ya]

        atb2 = ab[0]*ab[0] + ab[1]*ab[1]

        dotProduct = ap[0]*ab[0] + ap[1]*ab[1]

        t = dotProduct / atb2

        closestX = xa + ab[0]*t
        closestY = ya + ab[1]*t
        //print("Closest : ", closestX, closestY, file=sys.stderr)

        return [closestX, closestY]
    }
}


        

    
// Variables
const G = 3.711;
var land = [];
var target = 0;
var landDist = [];
var ratio = 10;
var rotateInput = 0;
var powerInput = 0;
var fireSize = [0, 18, 28, 38, 48]

// On load
window.onload = async function() {

    var pod = new Pod(2500, 2700, 0, 0, 550, 0, 0);
    pod.print();
    land = [[0, 100], [1000, 500], [1500, 1500], [3000, 1000], [4000, 150], [5500, 150], [6999, 800]];
    
    // Zone de landing
    for(var i = 0; i < land.length - 1; i++) {
        if (land[i][1] == land[i+1][1]) {
            target = [land[i][0], land[i+1][0], land[i][1]]
        }
    }

    var canva = document.getElementById("canvas");
    var ctx = canva.getContext("2d");
    ctx.beginPath();
    for(var i = 0; i < land.length - 1; i++) {
        ctx.moveTo(land[i][0] / ratio, (3000 - land[i][1]) / ratio);
        ctx.lineTo(land[i+1][0] / ratio, (3000 - land[i+1][1]) / ratio);
    }
    ctx.strokeStyle = '#ffffff';

    upArrow = new Image();
    upArrow.src = 'up-arrow.png';
    upArrow.onload = function(){ ctx.drawImage(upArrow, 0, 260, 24, 24); }
    rightArrow = new Image();
    rightArrow.src = 'right-arrow.png';
    rightArrow.onload = function(){ ctx.drawImage(rightArrow, 20, 277, 24, 24); }

    ctx.font = "20px Verdana";
    ctx.fillText("x", 48, 294);
    ctx.fillText("y", 7, 250);


    ctx.stroke();

    
    image = document.getElementsByClassName('pod-img')[0];
    image.style.left = (pod.x / ratio + 30 - 24) + "px";
    image.style.top = ((3000 - pod.y) / ratio + 114.5 - 48) + "px";
    image.style.transform = "rotate(" + (-pod.r) +"deg)";
    image.style.visibility = "visible";

    fire = document.getElementsByClassName('fire-img')[0];
    fire.style.left = (pod.x / ratio + 30 - 24) + "px";
    fire.style.top = ((3000 - pod.y) / ratio + 114.5 - 48 + 35) + "px";
    fire.style.transform = "rotate(" + (180-pod.r) +"deg)";
    fire.style.width = (12 * pod.p) + "px";
    fire.style.heigh = (12 * pod.p) + "px";
    fire.style.visibility = "visible";
    
    data = document.getElementsByClassName('data')[0];
    data.style.left = (7000 / ratio + 60) + "px";
    data.style.top = "114px";
    updateData(pod);

    document.addEventListener('keydown', function(event) {
        if (event.code == "ArrowUp") {
            powerInput = Math.min(powerInput + 1, 1);
        } else if (event.code == "ArrowDown") {
            powerInput = Math.max(powerInput - 1, -1);
        } else if (event.code == "ArrowRight") {
            rotateInput = Math.max(rotateInput - 5, -45);
        } else if (event.code == "ArrowLeft") {
            rotateInput = Math.min(rotateInput + 5, 45);
        } 
    });


    play(pod, image, fire);

}

async function play(pod, image, fire) {
    while (!pod.win && !pod.dead) {

        await new Promise(r => setTimeout(r, 500));

        pod.simulate(rotateInput, powerInput);
        pod.printRound();

        updateData(pod);

        image.style.left = (pod.x / ratio + 30 - 24) + "px";
        image.style.top = ((3000 - pod.y) / ratio + 114.5 - 48) + "px";
        image.style.transform = "rotate(" + (-pod.r) +"deg)";

        fire.style.left = (pod.x / ratio + 30 - 24 + 24 - fireSize[pod.p]/2 + pod.r / 2) + "px";
        fire.style.top = ((3000 - pod.y) / ratio + 114.5 - 48 + 35 - Math.abs(pod.r) / 5) + "px";
        fire.style.transform = "rotate(" + (180-pod.r) +"deg)";
        fire.style.width = fireSize[pod.p] + "px";
        fire.style.heigh = fireSize[pod.p] + "px";
    }

    if (pod.dead) {
        image.src = "explosion.png";
        fire.style.visibility = "hidden";
        console.log("Dead");
    }
    if (pod.win) {
        fire.style.visibility = "hidden";
        console.log("Win");
    }
}

function updateData(pod) {
    document.getElementsByClassName('x')[0].innerHTML = "x: " + Math.round(pod.x);
    document.getElementsByClassName('y')[0].innerHTML = "y: " + Math.round(pod.y);
    document.getElementsByClassName('vx')[0].innerHTML = "vx: " + Math.round(pod.vx);
    document.getElementsByClassName('vy')[0].innerHTML = "vy: " + Math.round(pod.vy);
    document.getElementsByClassName('fuel')[0].innerHTML = "fuel: " + pod.f;
    document.getElementsByClassName('angle')[0].innerHTML = "angle: " + pod.r;
    document.getElementsByClassName('power')[0].innerHTML = "power: " + pod.p;
    document.getElementsByClassName('input-angle')[0].innerHTML = "input angle: " + rotateInput;
    document.getElementsByClassName('input-power')[0].innerHTML = "input power: " + powerInput;
}
