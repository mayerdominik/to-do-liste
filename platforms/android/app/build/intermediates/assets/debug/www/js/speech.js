document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    
    document.getElementById('speechbtn').addEventListener('click', checkPermission);

}

function startRecognition(){
    window.plugins.speechRecognition.startListening(function(result){
        // Show results in the console
        console.log(result);
        document.getElementById("textarea-4").value = result;
    }, function(err){
        console.error(err);
    }, {
        language: "de-DE",
        matches: 1,
        showPopup: true
    });
}

function checkPermission(){
window.plugins.speechRecognition.isRecognitionAvailable(function(available){
    if(!available){
        console.log("Sorry, not available");
    }
    // Check if has permission to use the microphone
    window.plugins.speechRecognition.hasPermission(function (isGranted){
        if(isGranted){
            startRecognition();
        }else{
            // Request the permission
            window.plugins.speechRecognition.requestPermission(function (){
                // Request accepted, start recognition
                startRecognition();
            }, function (err){
                console.log(err);
            });
        }
    }, function(err){
        console.log(err);
    });
}, function(err){
    console.log(err);
});
}



