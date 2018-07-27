const socket = io('https://stream3005.herokuapp.com/');

$('#div-chat').hide();

let customConfig;

$.ajax({
  url: "https://service.xirsys.com/ice",
  data: {
    ident: "vanpho",
    secret: "2b1c2dfe-4374-11e7-bd72-5a790223a9ce",
    domain: "vanpho93.github.io",
    application: "default",
    room: "default",
    secure: 1
  },
  success: function (data, status) {
    // data.d is where the iceServers object lives
    customConfig = data.d;
    console.log(customConfig);
  },
  async: false
});

socket.on('DANH_SACH_ONLINE', arrUserInfo => {
    $('#div-chat').show();
    $('#div-dang-ky').hide();

    arrUserInfo.forEach(user => {
        const { ten, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}" usr="${ten}">${ten}</li>`);
    });

    socket.on('CO_NGUOI_DUNG_MOI', user => {
        const { ten, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}" usr="${ten}">${ten}</li>`);
    });

    socket.on('AI_DO_NGAT_KET_NOI', peerId => {
        $(`#${peerId}`).remove();
    });
});

socket.on('DANG_KY_THAT_BAT', () => alert('Vui long chon username khac!'));


function openStream() {
    const config = { audio: false, video: {
                                            width: { min: 1024, ideal: 1280, max: 1920 },
                                            height: { min: 776, ideal: 720, max: 1080 }
                                          }
                    };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

function alertCall(){
    if (confirm("Có người gọi bạn") == true) {
        audio.pause();
        
    } else {
        audio.pause();
        alert("Bạn đã hủy cuộc gọi !");
    }
}

function boxCall(usr){
    var audio = new Audio('call.mp3');
    audio.loop = true;
    audio.play();
    var box = $("#call-ring");
    box.show();
    box.css({"background":"#34495e", "border-radius":"5px", "color":"#fff", "margin-top":"10px", "height":"50px", "line-height":"50px"});
    box.html("<div class='text-left'><span>"+usr+" đang gọi bạn</span><div style='float:right'><button class='btn btn-success' id='nghe'>Nghe</button> <button class='btn btn-danger' id='tuchoi'>Từ chối</button></div></div>");
    $("#nghe").on("click", function(){
        audio.pause();
        openStream()
            .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
        box.html("<span>Đang trò chuyện ...</span>");
        setTimeout(function(){ box.fadeOut(); }, 1000);
    });
    $("#tuchoi").on("click", function(){
        audio.pause();
        box.html("<span>Đã hủy cuộc gọi</span>");
        setTimeout(function(){ box.fadeOut(); }, 1000);
    });

}

// openStream()
// .then(stream => playStream('localStream', stream));

const peer = new Peer({ 
    key: 'peerjs', 
    host: 'chat24h.herokuapp.com', 
    secure: true, 
    port: 443, 
    config: customConfig 
});

peer.on('open', id => {
    $('#my-peer').append(id);
    $('#btnSignUp').click(() => {
        const username = $('#txtUsername').val();
        socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerId: id });
    });
});

//Caller
$('#btnCall').click(() => {
    const id = $('#remoteId').val();
    openStream()
            .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
});

//Callee
peer.on('call', call => {
    openStream()
    .then(stream => {
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

$('#ulUser').on('click', 'li', function() {
    const usr = $(this).attr('usr');
    openStream()
            .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
    
});

$('.message a').click(function(){
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});