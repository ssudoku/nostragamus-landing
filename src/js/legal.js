(function ($, window, document, undefined) {
  'use strict';
  $(function () {
  	//toggle menu in mobile mode
  	$(".nav-container .toggle").click(function(){
  	  $(this).toggleClass("active");
  	  $(".nav-container .topnav").toggleClass("active");
  	});
  	$(".nav-link.dropdown").click(function (e) {
  	  if(window && window.innerWidth < 768){
        e.preventDefault();
        if($(this).hasClass("open")){
          $(".nav-link.dropdown").removeClass("open");
        }
        else {
          $(".nav-link.dropdown").removeClass("open");
          $(this).addClass("open");
        }
      }
    });
  });
})(jQuery, window, document);
