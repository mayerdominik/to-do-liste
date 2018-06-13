document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    document.getElementById('speechbtn').addEventListener('click', isRecognitionAvailable);
}
function isRecognitionAvailable() {
    window.plugins.speechRecognition.isRecognitionAvailable(successCallback, errorCallback)
}
function startRecognition() {
    let options = {
        language: "de-De"
      }
      window.plugins.speechRecognition.startListening(success, error, options)
}
function success() {
    document.getElementById("textarea").textContent = text;
}
function successCallback() {
    startRecognition()
}
function errorCallback() {
    document.getElementById("textarea").textContent = "This didn't work";
}
