const socket = io('https://iodeepchat.herokuapp.com');

$('#div-chat').hide();
let customConfig;

socket.on('DANH_SACH_ONLINE', arrUserInfo => {
    $('#div-chat').show();
    $('#div-dang-ky').hide();

    arrUserInfo.forEach(user => {
        const { ten, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('CO_NGUOI_DUNG_MOI', user => {
        const { ten, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('AI_DO_NGAT_KET_NOI', peerId => {
        $(`#${peerId}`).remove();
    });
});

socket.on('DANG_KY_THAT_BAT', () => alert('Vui long chon username khac!'));

/*function playStream(idVideoTag, stream) {
    const audio = $('<audio autoplay />').appendTo('body');
    const video = document.getElementById(idVideoTag);
    audio[0].src = (URL || webkitURL || mozURL).createObjectURL(stream);
    video.srcObject = stream;
    video.play();
    const config = { audio: true, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}*/

// openStream()
// .then(stream => playStream('localStream', stream));

const peer = new Peer({
    host: 'chat24h.herokuapp.com',
    secure: true,
    port: 443
});

peer.on('open', id => {
    $('#my-peer').append(id);
    $('#btnSignUp').click(() => {
        const username = $('#txtUsername').val();
        socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerId: id });
    });
});

//Caller

/*$('#ulUser').on('click', 'li', function() {
    const id = $(this).attr('id');
    console.log(id);
    openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
});*/

$('.message a').click(function() {
    $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");
});








function openStream() {
    const config = { audio: false, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}
// Compatibility shim

// Receiving a call
peer.on('call', function(call) {
    // Answer the call automatically (instead of prompting user) for demo purposes
    call.answer(window.localStream);
    step3(call);
});

// Click handlers setup
$(function() {
    $('#btnCall').click(function() {
        // Initiate a call!
        var call = peer.call($('#remoteId').val(), window.localStream);

        step3(call);
    });

    $('#end-call').click(function() {
        window.existingCall.close();
        step2();
    });

    // Retry if getUserMedia fails
    $('#step1-retry').click(function() {
        $('#step1-error').hide();
        step1();
    });

    // Get things started
    step1();
});

function step1() {
    // Get audio/video stream
    navigator.getUserMedia({ audio: true, video: true }, function(stream) {
        // Set your video displays
        $('#localStream').prop('src', URL.createObjectURL(stream));
        window.localStream = stream;
        step2();
    }, function() { $('#step1-error').show(); });
}

function step2() {
    $('#step1, #step3').hide();
    $('#step2').show();
}

function step3(call) {
    // Hang up on an existing call if present
    if (window.existingCall) {
        window.existingCall.close();
    }

    // Wait for stream on the call, then set peer video display
    call.on('stream', function(stream) {
        $('#remoteStream').prop('src', URL.createObjectURL(stream));
    });

    // UI stuff
    window.existingCall = call;
    $('#their-id').val(call.peer);
    call.on('close', step2);
    $('#step1, #step2').hide();
    $('#step3').show();
}
// Check that the browser supports getUserMedia.
// If it doesn't show an alert, otherwise continue.
if (navigator.getUserMedia) {
    // Request the camera.
    navigator.getUserMedia(
        // Constraints
        {
            video: true
        },

        // Success Callback
        function(localMediaStream) {

        },

        // Error Callback
        function(err) {
            // Log the error to the console.
            console.log('The following error occurred when trying to use getUserMedia: ' + err);
        }
    );

} else {
    alert('Sorry, your browser does not support getUserMedia');
}