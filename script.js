const video = document.getElementById("video")

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('models'),
    faceapi.nets.faceExpressionNet.loadFromUri('models'),

]).then(beginVideo);

async function beginVideo() {
    let stream = null;
    try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true })
        video.srcObject = stream;
    }
    catch (err) {
        alert("This video source is not availabel")
        console.log(err)
    }
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas); //add into body.
    const dim = { width: video.width, height: video.height } //set dimensions.
    faceapi.matchDimensions(canvas, dim);

    setInterval(async () => {
        const detection = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detection, dim) //set api dimensions.

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    }, 100);
})

beginVideo();
