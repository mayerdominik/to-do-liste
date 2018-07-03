document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    document.getElementById('newtaskbtn').addEventListener('click', pushDatShit);
}

function pushDatShit(){
    cordova.plugins.notification.local.schedule({
        title: 'Hallo Alex',
        text: '18 Uhr, 03. Juli 2018',
        trigger: { at: new Date(2018, 03, 07, 18) }
    });
}