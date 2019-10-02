/*!
 * Dissertation_Explorer v1.0.0
 * Author - Robbie Fraleigh, PhD - The Pennsylvania State University
 * Licensed under Apache v2 (https://www.apache.org/licenses/LICENSE-2.0)
 */
// Smooth scrolling using jQuery easing
     $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
         if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
             var target = $(this.hash);
             target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
             if (target.length) {
                 $('html, body').animate({
                     scrollTop: target.offset().top
                 }, 1500, "easeInOutExpo");
                 return false;
             }
         }
     });