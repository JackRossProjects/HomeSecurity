const classifier = knnClassifier.create();
const webcamElement = document.getElementById('webcam');
let net;

// Toggle hide mood inout buttons
function hideButtons(){
  var x = document.getElementById("buttons");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

async function app() {
  console.log('Loading MoodNet..');

  // Load the model.
  net = await mobilenet.load();
  console.log('Sucessfully loaded model');

  await setupWebcam();

  // Reads an image from the webcam and associates it with a specific class
  // index.
  const addExample = classId => {
    // Get the intermediate activation of MobileNet 'conv_preds' and pass that
    // to the KNN classifier.
    const activation = net.infer(webcamElement, 'conv_preds');

    // Pass the intermediate activation to the classifier.
    classifier.addExample(activation, classId);
  };

  // When clicking a button, add an example for that class.
  // Found that taking 10 examples per click makes the model more accurate
  document.getElementById('SECURE').addEventListener('click', () => addExample(0));
  document.getElementById('SECURE').addEventListener('click', () => addExample(0));
  document.getElementById('SECURE').addEventListener('click', () => addExample(0));
  document.getElementById('SECURE').addEventListener('click', () => addExample(0));
  document.getElementById('SECURE').addEventListener('click', () => addExample(0));
  document.getElementById('SECURE').addEventListener('click', () => addExample(0));
  document.getElementById('SECURE').addEventListener('click', () => addExample(0));
  document.getElementById('SECURE').addEventListener('click', () => addExample(0));
  document.getElementById('SECURE').addEventListener('click', () => addExample(0));
  document.getElementById('SECURE').addEventListener('click', () => addExample(0));

  document.getElementById('ARM').addEventListener('click', () => addExample(1));
  document.getElementById('ARM').addEventListener('click', () => addExample(1));
  document.getElementById('ARM').addEventListener('click', () => addExample(1));
  document.getElementById('ARM').addEventListener('click', () => addExample(1));
  document.getElementById('ARM').addEventListener('click', () => addExample(1));
  document.getElementById('ARM').addEventListener('click', () => addExample(1));
  document.getElementById('ARM').addEventListener('click', () => addExample(1));
  document.getElementById('ARM').addEventListener('click', () => addExample(1));
  document.getElementById('ARM').addEventListener('click', () => addExample(1));
  document.getElementById('ARM').addEventListener('click', () => addExample(1));



  while (true) {
    if (classifier.getNumClasses() > 0) {
      // Get the activation from mobilenet from the webcam.
      const activation = net.infer(webcamElement, 'conv_preds');
      // Get the most likely class and confidences from the classifier module.
      const result = await classifier.predictClass(activation);

      const classes = ['SECURED', 'INTRUDER ALERT'];

      document.getElementById('console').innerText = `
        Status: ${classes[result.classIndex]}\n
        Accuracy: ${result.confidences[result.classIndex]}
      `;

      if (result.classIndex === 1) {
        let alarm = new Audio();
        alarm.src = 'alarm2.wav';
        alarm.play();
      }
    }

    await tf.nextFrame();
  }
}


async function setupWebcam() {
  return new Promise((resolve, reject) => {
    const navigatorAny = navigator;
    navigator.getUserMedia = navigator.getUserMedia ||
        navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
        navigatorAny.msGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia({video: true},
        stream => {
          webcamElement.srcObject = stream;
          webcamElement.addEventListener('loadeddata',  () => resolve(), false);
        },
        error => reject());
    } else {
      reject();
    }
  });
}


app();
