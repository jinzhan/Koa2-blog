function fade(txt){
  $('.message').text(txt)
  $('.message').animate({
    top:0
  })
  setTimeout(function(){
    $('.message').animate({
      top: '-100%'
    })
  },1500)
};
$(function(){
  $('.signout').click(()=>{
    $.ajax({
      url: "/signout",
      type: "GET",
      cache: false,
      dataType: 'json',
      success: function (msg) {
        if (msg) {
          fade('登出成功')
          setTimeout(()=>{
            window.location.href = "/posts"
          },1500)
        }
      },
      error: function () {
        alert('异常');
      }
    })
  })
});
