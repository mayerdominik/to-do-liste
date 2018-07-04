
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    document.getElementById('btn').addEventListener('click', takephoto);
    
    document.getElementById('photo').addEventListener('click', openFilePicker);
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
        document.getElementById('photo').style = "margin-left: 2%; width: 96%; margin-top: 2%; margin-bottom: 2%;";
        $('#delpic').html('<button id="btndel" data-inline="true" class="ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-btn-b ui-icon-delete" >Bild löschen</button>');
        document.getElementById('btndel').addEventListener('click', delphoto);
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
function delphoto(){
    document.getElementById('msg').textContent = "";
    document.getElementById('photo').src = "img/gallery.png";
    document.getElementById('photo').style = "margin-left: 45%; width: 10%; margin-top: 2%; margin-bottom: 2%;";
    $('#delpic').html("");
}
