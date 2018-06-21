
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    document.getElementById('btn').addEventListener('click', takephoto);
    document.getElementById('choosephoto').addEventListener('click', openFilePicker);
    document.getElementById('newtask').addEventListener('click', sendtext);
}

function takephoto(){
        let opts = {
            quality: 80,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            mediaType: Camera.MediaType.PICTURE,
            encodingType: Camera.EncodingType.JPEG,
            cameraDirection: Camera.Direction.BACK,
            targetWidth: 300,
            targetHeight: 400
        };
        
        navigator.camera.getPicture(ftw, wtf, opts);
    }
function ftw (imgURI){
        document.getElementById('msg').textContent = imgURI;
        document.getElementById('photo').src = imgURI;
        document.getElementById('photo').style = "width:100%"
        
    }
function wtf (msg){
        document.getElementById('msg').textContent = msg;
    }
function openFilePicker(selection) {
    let options = {
        sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM
    }
        navigator.camera.getPicture(ftw, wtf, options);
}
function sendtext() {
    let text = document.getElementById("textarea-4").value;
    document.getElementById("textarea-5").value=text;
}
