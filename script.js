let numLines = 360; // 원 주변에 그릴 선의 개수
let angleOffset = 0; // 회전 각도의 초기값
let lineWidth = 6; // 주변 파동의 선 굵기
let baseColor; // 전체 색상
let colorChangeSpeed = 0.0001; // 색상 변화 속도 조절

function setup() {
    let canvasContainer = document.getElementById('canvasContainer');
    let canvasSize = Math.min(windowWidth, windowHeight) * 0.9; // 정사각형으로 만들기 위해 최소값 활용
    let canvas = createCanvas(canvasSize, canvasSize);
    canvas.parent('canvasContainer');
    
    let audioInput = document.getElementById('audioFile');
    audioInput.addEventListener('change', handleFile);
    fft = new p5.FFT();

    // 전체 색상 설정 (모든 선이 동일한 색상)
    baseColor = color(random(255), random(255), random(255));
}

function draw() {
    background(255);

    if (soundFile && soundFile.isLoaded()) {
        let spectrum = fft.analyze();
        let step = TWO_PI / numLines; // 선 사이의 각도 간격

        // 원 중심 좌표 계산
        let centerX = width / 2;
        let centerY = height / 2;

        // 현재 색상 선택
        let hue = map(sin(millis() * colorChangeSpeed), -1, 1, 0, 255);
        let saturation = 100;
        let brightness = 200;
        let currentColor = color(hue, saturation, brightness);
        stroke(currentColor);
        strokeWeight(lineWidth);

        // 파동 표현하기
        for (let i = 0; i < numLines; i++) {
            let angle = i * step + angleOffset; // 회전된 각도 계산
            let x1 = centerX + cos(angle) * radius;
            let y1 = centerY + sin(angle) * radius;
            let x2 = centerX + cos(angle) * (radius + spectrum[i % spectrum.length]); // 파동 크기에 따라 선 길이 조절
            let y2 = centerY + sin(angle) * (radius + spectrum[i % spectrum.length]);

            line(x1, y1, x2, y2);
        }

        // 회전 각도 업데이트
        angleOffset += 0.01;
    }
}

function handleFile(event) {
    const file = event.target.files[0];
    if (file) {
        soundFile = loadSound(URL.createObjectURL(file), () => {
            soundFile.play();
        });
    }
}

