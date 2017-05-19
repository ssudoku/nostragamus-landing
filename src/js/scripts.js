/*!
 * fastshell
 * Fiercely quick and opinionated front-ends
 * https://HosseinKarami.github.io/fastshell
 * @author Hossein Karami
 * @version 1.0.5
 * Copyright 2017. MIT licensed.
 */
(function ($, window, document, undefined) {

  'use strict';

  $(function () {

  	//click on the slide controls
  	$(".controls .control").click(function(){
  		var targetSlide = parseInt($(this).attr("data-target"));
  		var currentSlide = parseInt($(".controls .control.active").attr("data-target"));
  		if(currentSlide === targetSlide){
  			return false;
  		}
  		else {
  			changeSlide({targetSlide : targetSlide});
  		}
  	});

  	//click on arrow
  	$(".slides .arrow").click(function(){
  		detectChange(null,"arrow");
  	});
  	//toggle menu in mobile mode
  	$(".nav-container .toggle").click(function(){
  		$(this).toggleClass("active");
  		$(".nav-container .topnav").toggleClass("active");
  	});

  	//click on the dropdowns in mobile navigation
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

  	//Scroll using keyboard arrow or page keys
  	$(window).keyup(function(e){
  		if(scrollKeyCodes.indexOf(e.keyCode) > -1){
  			detectChange(e,"key");
  		}
  	});

  	//Scroll using mousewheel
  	$(window).on("wheel", $(document), function(e){
  		detectChange(e,"wheel");
  	});

  	//Scroll using touch
  	var hammertime = new Hammer($('body')[0]);
  	hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
  	hammertime.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });
	hammertime.on('swipe', function(e) {
		detectChange(e,"touch");
	});
	hammertime.on('pan', function(e) {
		detectChange(e,"touch");
	});

	//helper functions
	var scrollKeyCodes = [
		33, //Pg up
		34, //Pg dn
		35, //End
		36, //Home
		37, //Left arrow
		38, //Up arrow
		39, //Right arrow
		40 //Down arrow
	];

	var upKeyCodes = [33,37,38];
	var downKeyCodes = [34,39,40];

	function detectChange(e,type){
	  switch(type){
	  	case "key":
	  		if(upKeyCodes.indexOf(e.keyCode) > -1){
	  			//console.log("scroll up");
	  			changeSlide("previous");
	  		}
	  		else if(downKeyCodes.indexOf(e.keyCode) > -1){
	  			//console.log("scroll down");
	  			changeSlide("next");
	  		}
	  		else if(e.keyCode == 35) {
	  			//console.log("last slide");
	  			changeSlide("last");
	  		}
	  		else {
	  			//console.log("first slide");
	  			changeSlide("first");
	  		}
	  	break;
	  	case "touch":
	  		if(e.offsetDirection == 8){
	  			//console.log("swipe down");
	  			changeSlide("next");
	  		}
	  		else if(e.offsetDirection == 16){
	  			//console.log("swipe up");
	  			changeSlide("previous");
	  		}
	  	break;
	  	case "wheel":
	  		if(e.originalEvent.deltaY > 0){
	  			//console.log("wheel down");
	  			changeSlide("next");
	  		}
	  		else {
	  			//console.log("wheel up");
	  			changeSlide("previous");
	  		}
	  	break;
	  	case "arrow":
	  		changeSlide("next");
	  	break;
	  }
	}

	var slides = {
		isSliding: false,
		currentSlide: 1,
		previousSlide: null,
		totalSlides: $('.content-slides').length
	};

	function changeSlide(target){
		if(!slides.isSliding & typeof target === "string"){
			slides.previousSlide = slides.currentSlide;
			switch(target){
				case "previous":
					if(slides.currentSlide > 1){
						slides.currentSlide--;
						slides.isSliding = true;
						applyTransition();
					}
				break;
				case "next":
					if(slides.currentSlide < slides.totalSlides){
						slides.currentSlide++;
						slides.isSliding = true;
						applyTransition();
					}
				break;
				case "first":
					slides.currentSlide = 1;
					slides.isSliding = true;
					applyTransition();
				break;
				case "last":
					slides.currentSlide = slides.totalSlides;
					slides.isSliding = true;
					applyTransition();
				break;
			}
			return true;
		}
		else if(!slides.isSliding){
			slides.previousSlide = slides.currentSlide;
			slides.currentSlide = target.targetSlide;
			slides.isSliding = true;
			applyTransition();
		}
		//invalid
		return false;
	}

	function applyTransition(){
		/* OLD WAY */
		/*
		$('main.slides')[0].className = "slides slide-" + slides.currentSlide;
		$('.controls .control').removeClass('active');
		$('.controls #control-' + slides.currentSlide + '').addClass('active');
		window.setTimeout(function(){
			slides.isSliding = false;
		},400);
		*/
		/* NEW WAY */
		// First set the classname to the current slide in the main element
		$('main.slides')[0].className = "slides slide-" + slides.currentSlide;

		// Adjust the thumbnails on the right side
		$('.controls .control').removeClass('active');
		$('.controls #control-' + slides.currentSlide + '').addClass('active');

		// Create the up down classes for various elements
		var updownStates = [];
		for (var i = 1; i <= slides.totalSlides; i++){
			if(i == slides.currentSlide){
				updownStates.push('');
			}
			else if(i < slides.currentSlide){
				updownStates.push('up');
			}
			else {
				updownStates.push('down');
			}
		}

		//start applying the classes
		var phone = $('aside.phone');
		var content = $('article.content');
		var bgimages = $('.bg-image-container');
		var bgs = $('.bg-container');

		updownStates.map(function(item, index){
			index++;
			if(item === ''){
				phone.find('.overlays .overlay-'+index+'').removeClass('up').removeClass('down');
				phone.find('.screens .phone-'+index+'').removeClass('up').removeClass('down');
				phone.find('.underlays .underlay-'+index+'').removeClass('up').removeClass('down');
				content.find('.content-slide-'+index+'').removeClass('up').removeClass('down');
				bgimages.find('.bg-image-'+index+'').removeClass('up').removeClass('down');
				bgs.find('.bg-slide-'+index+'').removeClass('up').removeClass('down');
			}
			else {
				phone.find('.overlays .overlay-'+index+'').each(function(){
					if(!($(this).hasClass(item))){
						$(this).removeClass('up').removeClass('down').addClass(item);
					}
				});
				phone.find('.screens .phone-'+index+'').each(function(){
					if(!($(this).hasClass(item))){
						$(this).removeClass('up').removeClass('down').addClass(item);
					}
				});
				phone.find('.underlays .underlay-'+index+'').each(function(){
					if(!($(this).hasClass(item))){
						$(this).removeClass('up').removeClass('down').addClass(item);
					}
				});
				content.find('.content-slide-'+index+'').each(function(){
					if(!($(this).hasClass(item))){
						$(this).removeClass('up').removeClass('down').addClass(item);
					}
				});
				bgimages.find('.bg-image-'+index+'').each(function(){
					if(!($(this).hasClass(item))){
						$(this).removeClass('up').removeClass('down').addClass(item);
					}
				});
				bgs.find('.bg-slide-'+index+'').each(function(){
					if(!($(this).hasClass(item))){
						$(this).removeClass('up').removeClass('down').addClass(item);
					}
				});
			}
		});

		window.setTimeout(function(){
			slides.isSliding = false;
		},1000);
	}
  });

})(jQuery, window, document);
