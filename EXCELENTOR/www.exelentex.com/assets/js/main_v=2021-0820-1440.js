(function ($) {

    "use strict";

    var $html = $('html'), isTouch = $html.hasClass('touchevents');
    var $body = $('body');
    var $window = $(window);
    var windowWidth = Math.max($window.width(), window.innerWidth);


    if($html.hasClass('preload-page')){
        window.scrollTo(0, 0);
    }

    /*Detect IE*/
    function detectIE() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE');
        var trident = ua.indexOf('Trident/');
        var edge = ua.indexOf('Edge/');
        if (msie > 0) {
            $html.addClass('ie');
        } else if (trident > 0) {
            $html.addClass('ie');
        } else if (edge > 0) {
            $html.addClass('edge');
        } else {
            $html.addClass('not-ie');
        }
        return false;
    }

    detectIE();

    /*Detect ios*/
    var mac = !!navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i);
    if(mac){
        $html.addClass('ios');
        if($html.hasClass('touchevents')){
            $html.addClass('touch-ios');
        }
    }

    function iOSversion() {
        if (/iP(hone|od|ad)/.test(navigator.platform)) {
            var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
        }
    }

    var ver = iOSversion();

    if(ver && ver[0] < 11) {
        $html.addClass('no-autoplay-video');
    }


    /*Ios fix zoom on form elems focus*/
    if($html.hasClass('ios')){
        var metaViewport = document.querySelector('meta[name=viewport]');
        if (metaViewport !== null) {
            var content = metaViewport.getAttribute('content');
            var re = /maximum\-scale=[0-9\.]+/g;

            if (re.test(content)) {
                content = content.replace(re, 'maximum-scale=1.0');
            } else {
                content = [content, 'maximum-scale=1.0'].join(', ')
            }
            metaViewport.setAttribute('content', content);
        }
    }

    /*Detect Android*/
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
    if (isAndroid) {
        $html.addClass('android');
    } else {
        $html.addClass('not-android');
    }

    /*Detect Chrome*/
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    if (isChrome) {
        $html.addClass('chrome');
    } else {
        $html.addClass('not-chrome');
    }

    /*Detect Firefox*/
    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
        $html.addClass('firefox');
    }



    /*Page cursor*/
    if($html.hasClass('no-touchevents')){
        $body.append('<div id="page-cursor"><svg width="26" height="11" id="hover-cursor" viewBox="0 0 26 11" fill="none"><path d="M0 10H23L14 3V7.5" stroke="#DC0C1C" stroke-width="2"/></svg></div><div id="page-cursor-circle"></div>');
        $html.addClass('custom-cursor');
    }
    /*<div id="cursor-dot"></div>*/

    var $pageCursor = $('#page-cursor');
    var $cursorCircle = $('#page-cursor-circle');


    $body.on('mouseenter', '.js-hover-cursor', function(){
        if($html.hasClass('no-touchevents')){
            $html.addClass('hover-cursor-activated');
        }
    });

    $body.on('mouseleave', '.js-hover-cursor', function(){
        if($html.hasClass('no-touchevents')){
            $html.removeClass('hover-cursor-activated');
        }
    });

    $body.on('mouseenter', '.js-light-cursor', function(){
        if($html.hasClass('no-touchevents')){
            $html.addClass('light-cursor');
        }
    });

    $body.on('mouseleave', '.js-light-cursor', function(){
        if($html.hasClass('no-touchevents')){
            $html.removeClass('light-cursor');
        }
    });



    /*RequestAnimationFrame Animate*/
    var clientX, clientY;

    if($html.hasClass('no-touchevents')){
        document.addEventListener("mousemove", function(e){
            clientX = e.clientX;
            clientY = e.clientY;
        });
    }


    var runningAnimationFrame = true;
    var scrolledY;

    window.requestAnimationFrame = (function(){
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback, element) {
                return window.setTimeout(callback, 1000 / 60);
            };
    })();

    var mainTextSliderFlag = true;

    function loop() {
        if(runningAnimationFrame){

            scrolledY = $window.scrollTop();

            /*Cursor*/
            if($html.hasClass('no-touchevents') && $pageCursor.length) {
                TweenLite.to($pageCursor, 0, {
                    x: clientX,
                    y: clientY
                });
                TweenLite.to($cursorCircle,.5, {
                    x: clientX,
                    y: clientY
                });
            }


            /*Main text slider*/
            if(mainTextSliderFlag == true && $('.main-text-slider-box').length){
                $('.main-text-slider-box').each(function(){
                    if($(this).parents('.js-view-checker').hasClass('visible') || $(this).hasClass('visible')){
                        var $this = $(this);
                        var $thisTextSlider = $this.find('.main-text-slider .swiper-container')[0].swiper;
                        $thisTextSlider.params.autoplay = {
                            delay: $mainTextBulletsSliderDelay,
                            disableOnInteraction: false
                        };
                        $thisTextSlider.autoplay.start();

                        var progress = $this.find('.progress');
                        progress.css({'stroke-dashoffset': 114});
                        progress.animate({
                            'stroke-dashoffset': 0
                        }, $mainTextBulletsSliderDelay - 150, function(){
                            progress.css({'stroke-dashoffset': 114});
                        });

                        mainTextSliderFlag = false;
                    }
                });
            }

            if($html.hasClass('opened-nav') && navAnimationFlag){
                navAnimate();
            }

            requestAnimationFrame(loop);
        }
    }

    requestAnimationFrame(loop);


    /*Viewport checker*/
    function inViewChecker() {
        $('.js-view-checker').viewportChecker({
            classToAdd: 'visible',
            classToAddForFullView: 'full-visible',
            invertBottomOffset: true,
            repeat: false
        });
    }

    if($('.js-view-checker').length){
        inViewChecker();
    }


    /*Typography*/
    function lastWord(){
        $('h6, .h6').each(function(){
            var text = $(this).html().split(' ');
            var lastword = text.pop();
            $(this).html([text.join(' '), ' <span class="last-word">', lastword, '</span>'].join(''));
        });
    }
    if($('h6, .h6').length){
        lastWord();
    }


    /*Responsive img*/
    if($('.responsimg').length){
        $('.responsimg').responsImg();
    }


    /*Table wrap*/
    function tableWrap(){
        $('table').each(function(){
            if(!$(this).parent('.scroll-tbl').length) {
                $(this).wrap('<div class="scroll-tbl"></div>');
            }
        });
    }
    if($('table').length){
        tableWrap();
    }


    /*Form*/
    $('.form .field').each(function(){
        if($(this).find('.upload-box').length){
            $(this).addClass('upload-field');
        }
    });

    function checkFormControl(){
        $('.form-control').each(function(){
            var thisa = $(this);
            if(thisa.val().length){
                thisa.parents('.field').addClass('filled');
            }
        });
    }
    checkFormControl();

    $body.on('focus', '.form-control', function(){
        $(this).parents('.field').addClass('filled');
    });

    $body.on('focusout', '.form-control', function(){
        if(!$(this).val().length){
            $(this).parents('.field').removeClass('filled');
        }
    });

    if($('textarea').length){
        $('textarea').textareaAutoSize();
    }

    $(".form-control[type='tel']").keypress(function(e){
        var keycode = (e.keyCode ? e.keyCode : e.which);
        if(/[^\d\b+ ()-]/.test(String.fromCharCode(keycode))) {
            e.preventDefault();
        }
    });

    // fix after form reset
    $(document).on('iqforms:formSentSuccess', function (e) {
        $('#' + e.formId).find('.form-control').each(function () {
            if (!$(this).val().length) {
                $(this).parents('.field').removeClass('filled');
            }
        });
        $('#' + e.formId).find('textarea').trigger('input');
    });

    /*Files upload*/
    if($('.upload-box input[type="file"]').length){
        $('.upload-box input[type="file"]').fileinput({
            buttonClass: 'upload-btn'
        });
    }

    $body.on('.fileinput.upload-btn > span', 'click', function(){
        $(this).next('input').trigger('click');
    });

    $body.on('change', '.fileinput input[type=file]', function(){
        var parentBox = $(this).parents('.upload-box');
        var fileName = $(this).val();
        if(!!$(this).prop('files') && $(this).prop('files').length > 1) {
            //console.log('1')
        }
        else{
            parentBox.addClass('selected');
        }
        if(!fileName){
            parentBox.removeClass('selected');
        }
    });


    /*Header*/
    function stickyHeader(){
        var wST = $window.scrollTop();
        if(wST >= 1){
            $html.addClass('sticky-header');
        }
        else{
            $html.removeClass('sticky-header');
        }
    }
    stickyHeader();


    /*Nav*/
    var navBoxWave = $('#nav-box-wave')[0], navBoxWavePath = $('#nav-box-wave').attr('data-animation-path'), navBoxWaveAnimateDirection;


    var navBoxWaveAnimate = bodymovin.loadAnimation({
        container: navBoxWave,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: navBoxWavePath,
        rendererSettings: {
            preserveAspectRatio:'none'
        }
    });


    $('html:not(.opened-nav) .js-open-nav').on('click', function(){
        if(!$html.hasClass('opened-nav')){
            $html.addClass('opened-nav light-cursor');
            navBoxWaveAnimateDirection = 1;
            navBoxWaveAnimate.setDirection(navBoxWaveAnimateDirection);
            navBoxWaveAnimate.play();

            setTimeout(function(){
                $('#nav-box').addClass('nav-animate');
                $('.nav-dots-bg').addClass('visible');
            }, 100);

            setTimeout(function(){
                navAnimationFlag = true
            }, 1000)
        }
    });


    $('.js-close-nav').on('click', function(){
        $('#nav-box').removeClass('nav-animate');
        navBoxWaveAnimateDirection = -1;
        navBoxWaveAnimate.setDirection(navBoxWaveAnimateDirection);
        navBoxWaveAnimate.play();
        navAnimationFlag = false;
        setTimeout(function(){
            $html.removeClass('opened-nav light-cursor');
        }, 1000);
    });



    /*Nav dots animate*/
    var navAnimationFlag = false;

    var SEPARATION = 100,
        AMOUNTX = 100,
        AMOUNTY = 70;

    var navDotsBox, navBox = $('#nav-box');
    var camera, scene, renderer;

    var particles, particle, count = 0;

    var mouseX = 85,
        mouseY = -342;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;


    if($('#nav-box').length){
        navDotsSceneInit();
        navAnimate();
    }

    function navDotsSceneInit(){
        navDotsBox = document.createElement('div');
        navDotsBox.className = "nav-dots-bg";
        navBox.append(navDotsBox);

        camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;

        scene = new THREE.Scene();

        particles = new Array();

        var PI2 = Math.PI * 2;
        var material = new THREE.ParticleCanvasMaterial({
            color: 0xa8a9af,
            program: function(context) {
                context.beginPath();
                context.arc(0, 0, .6, 0, PI2, true);
                context.fill();
            }
        });

        var i = 0;

        for (var ix = 0; ix < AMOUNTX; ix++) {
            for (var iy = 0; iy < AMOUNTY; iy++) {
                particle = particles[i++] = new THREE.Particle(material);
                particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
                particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
                scene.add(particle);
            }
        }

        renderer = new THREE.CanvasRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        navDotsBox.appendChild(renderer.domElement);

        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('touchstart', onDocumentTouchStart, false);
        document.addEventListener('touchmove', onDocumentTouchMove, false);
        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }


    function onDocumentMouseMove(event) {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    }

    function onDocumentTouchStart(event) {
        if (event.touches.length === 1) {
            event.preventDefault();
            mouseX = event.touches[0].pageX - windowHalfX;
            mouseY = event.touches[0].pageY - windowHalfY;
        }
    }

    function onDocumentTouchMove(event) {
        if (event.touches.length === 1) {
            event.preventDefault();
            mouseX = event.touches[0].pageX - windowHalfX;
            mouseY = event.touches[0].pageY - windowHalfY;
        }
    }

    function navAnimate(){
        navDotsRender();
    }

    function navDotsRender() {
        camera.position.x += (mouseX - camera.position.x) * .05;
        camera.position.y += (-mouseY - camera.position.y) * .05;
        camera.lookAt(scene.position);
        var i = 0;
        for (var ix = 0; ix < AMOUNTX; ix++) {

            for (var iy = 0; iy < AMOUNTY; iy++) {

                particle = particles[i++];
                particle.position.y = (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count) * 0.5) * 50);
                particle.scale.x = particle.scale.y = (Math.sin((ix + count) * 0.3) + 1) * 2 + (Math.sin((iy + count) * 0.5) + 1) * 2;
            }
        }
        renderer.render(scene, camera);
        count += 0.1;
    }



    /*Main screen*/
    $body.on('click', '#main-screen .js-scroll-screen', function(){
        var parentHeight = $(this).parents('#main-screen').height();
        var scrollTop = parentHeight + $window.innerHeight()/3;
        if(windowWidth <= 1000){
            scrollTop = parentHeight + 80;
        }
        if(windowWidth <= 780){
            scrollTop = parentHeight + 40;
        }
        if(windowWidth <= 480){
            scrollTop = parentHeight + 20;
        }
        $('html, body').animate({
            scrollTop: scrollTop
        }, 400);
    });


    /*Interlinked*/
    $('.no-touchevents body').on('mouseenter', '.js-interlinked a', function(){
        $(this).parents('.js-interlinked').addClass('on-hover');
    });
    $('.no-touchevents body').on('mouseleave', '.js-interlinked a', function(){
        $(this).parents('.js-interlinked').removeClass('on-hover');
    });


    /*Text grid*/
    function textGridHasIcons(){
        if($(this).find('.icon').length){
            $(this).addClass('has-icons');
        }
    }
    $('.text-grid').each(function(){
        textGridHasIcons();
    });


    /*Masonry grid*/
    function masonryGridInit(){
        var $container = $('.masonry-grid');
        $container.imagesLoaded(function(){
            $container.masonry({
                itemSelector: '.item'
            });
        });
    }
    if($('.masonry-grid').length){
        masonryGridInit()
    }

    /*Gallery*/
    function galleryInit(){
        $('.photo-gallery').lightGallery({
            selector: '.item a',
            hash: false
        });
    }
    if($('.photo-gallery').length){
        galleryInit();
    }

    var windowScrollCountGallery = '';
    $('.photo-gallery').on('onBeforeOpen.lg',function(){
        windowScrollCountGallery = $window.scrollTop();
    });

    $('.photo-gallery').on('onBeforeClose.lg',function(){
        if($('.ie')){
            $('html, body').animate({
                scrollTop: windowScrollCountGallery
            }, 50);
        }
    });



    /*Products in brief Video*/
    if($('.products-list-in-brief .product-in-brief video').length && $html.hasClass('no-touchevents')){
        $('.products-list-in-brief .product-in-brief').each(function(){
            $(this).find('.video').css('display', 'block')[0].pause();
        });
    }

    var productVideoFlag = true;
    var productVideoTimer;
    var productVideoTimerLeave;
    $('.no-touchevents body').on('mouseenter', '.product-in-brief a', function(){
        var $thisProduct = $(this).parents('.product-in-brief');

        clearTimeout(productVideoTimer);
        clearTimeout(productVideoTimerLeave);

        $('.product-in-brief').removeClass('visible-video');

        $thisProduct.find('.video')[0].play();

        if(productVideoFlag == true){
            $thisProduct.addClass('visible-video');
            productVideoFlag = false;
        }
        else{
            productVideoTimer = setTimeout(function(){
                $thisProduct.addClass('visible-video');
            }, 300);
        }
    });

    $('.no-touchevents body').on('mouseleave', '.product-in-brief a', function(){
        var $thisProduct = $(this).parents('.product-in-brief');
        $thisProduct.removeClass('visible-video').find('.video')[0].pause();
        productVideoTimerLeave = setTimeout(function(){
            productVideoFlag = true;
        }, 300);
    });

    var playProductVideoFlag = true
    function playProductInBriefVideoMobile(){
        if(windowWidth <= 780 && playProductVideoFlag == true){
            $('.product-in-brief').each(function(){
                $(this).find('.video')[0].play();
            });
            playProductVideoFlag == false;
        }
        else{
            $('.product-in-brief').each(function(){
                $(this).find('.video')[0].pause();
            });
            playProductVideoFlag == true;
        }
    }

    if($('.product-in-brief').length && $html.hasClass('no-touchevents')){
        playProductInBriefVideoMobile();
    }


    /*Bg links items box*/
    if($('.bg-links-items-box').length && $html.hasClass('no-touchevents')){
        $('.bg-links-items-box').each(function(){
            $(this).append('<a href="" class="bg-link js-hover-cursor"><video class="video" loop muted><source src="/video/main-screen-video.mp4" type="video/mp4"></video></a>');
        });
    }

    $('.no-touchevents body').on('mouseenter', '.bg-link-item', function(){
        var href = $(this).find('a').attr('href');
        $html.addClass('hover-cursor-activated');
        var $bgLink = $(this).parents('.bg-links-items-box').find('.bg-link');
        $bgLink.attr('href', href);
        $bgLink.detach();
        $(this).append($bgLink);
        $(this).addClass('on-hover').find('.video')[0].play();
    });

    $('.no-touchevents body').on('mouseleave', '.bg-link-item', function(){
        $html.removeClass('hover-cursor-activated');
        var bgLink = $(this).parents('.bg-links-items-box').find('.bg-link').detach();
        $(this).parents('.bg-links-items-box').append(bgLink).find('.video')[0].pause();
        $(this).removeClass('on-hover');
    });


    /*Main text slider*/

    var $mainTextBulletsSlider = undefined, $mainTextBulletsSliderDelay = 6500
    function mainTextSliderInit(){

        $('.main-text-slider .swiper-container').each(function(index){

            var $thisParent = $(this).parents('.main-text-slider-box');

            var bulletsText = [];
            $(this).find('.swiper-slide').each(function(i){
                bulletsText.push($(this).attr("data-bullet"));
            });

            var loop = true;
            if($(this).find('.swiper-slide').length <= 1){
                loop = false;
            }

            var speed = 400,
                progressSpeed = $mainTextBulletsSliderDelay,
                progress,
                strokeDashOffset = 114;

            if(progress !== undefined){
                progress.css({'stroke-dashoffset': strokeDashOffset});
                progress.animate({
                    'stroke-dashoffset': 0
                }, progressSpeed, function(){
                    progress.css({'stroke-dashoffset': strokeDashOffset});
                });
            }

            var $mainTextSlider = new Swiper($(this)[0],{
                spaceBetween: 90,
                slidesPerView: '1',
                speed: speed,
                loop: loop,
                watchOverflow: true,
                /*autoHeight: true,
                autoplay: {
                    delay: $mainTextBulletsSliderDelay,
                    disableOnInteraction: false
                },*/
                pagination: {
                    el: $(this).parents('.main-text-slider-box').find('.swiper-pagination'),
                    clickable: true,
                    renderBullet: function (index, className){

                        /*setTimeout(function(){
                            var progress = $thisParent.find('.progress');
                            progress.css({'stroke-dashoffset': strokeDashOffset});
                            progress.animate({
                                'stroke-dashoffset': 0
                            }, progressSpeed - 150, function(){
                                progress.css({'stroke-dashoffset': strokeDashOffset});
                            });
                        }, 150);*/

                        return '<span class="' + className + ' swiper-slide"><span class="bullet-text">' + bulletsText[index] + '</span><span class="slide-progress"><svg width="36" height="36" viewBox="0 0 37 37"><circle cx="18.5" cy="18.5" r="18" fill="none" stroke="#8691a8" stroke-miterlimit="10" stroke-opacity=".7" class="progress" /></svg></span>' +'</span>';
                    }
                },
                on: {
                    slideChange: function(index){

                        var progress = $thisParent.find('.progress');

                        progress.stop(true, true).attr('style', '');

                        progress.css({'stroke-dashoffset': strokeDashOffset});
                        progress.animate({
                            'stroke-dashoffset': 0
                        }, progressSpeed, function(){
                            progress.css({'stroke-dashoffset': strokeDashOffset});
                        });

                        progressSpeed = $mainTextBulletsSliderDelay + speed;

                        if(windowWidth <= 780 && $mainTextBulletsSlider !== undefined){
                            var realIndex = this.realIndex;
                            $thisParent.find('.main-text-bullets-slider .swiper-container').each(function(){
                                $(this)[0].swiper.slideTo(realIndex);
                            });
                        }
                    }
                },
                breakpoints:{
                    480: {
                        spaceBetween: 30
                    }
                }
            });
        });
    }

    function maintTextBulletsSlider(){
        var $thisParent = $(this).parents('.main-text-slider-box');
        if (windowWidth <= 780 && $mainTextBulletsSlider == undefined){
            $('.main-text-bullets-slider .swiper-container').each(function(){
                $mainTextBulletsSlider = new Swiper($(this)[0], {
                    spaceBetween: 40,
                    slidesPerView: 'auto',
                    speed: 400,
                    watchOverflow: true,
                    slideToClickedSlide: true,
                    on: {
                        init: function(index){
                            setTimeout(function(){
                                var activeIndex = $('.swiper-pagination-bullet-active').index();
                                $mainTextBulletsSlider.slideTo(activeIndex);
                            }, 100);
                        }
                    },
                    breakpoints:{
                        780: {
                            spaceBetween: 32
                        }
                    }
                });
            })
        }
        else if (windowWidth > 781 && $mainTextBulletsSlider !== undefined) {
            $('.main-text-bullets-slider .swiper-container').each(function(){
                $(this)[0].swiper.destroy();
            });
            $mainTextBulletsSlider = undefined;
            $('.main-text-bullets-slider .swiper-wrapper').attr('style', '');
            $('.main-text-bullets-slider .swiper-slide').attr('style', '');

            $thisParent.find('.main-text-slider .swiper-container').each(function(){
                $(this)[0].swiper.update();
            });
        }
    }

    if($('.main-text-slider').length){
        mainTextSliderInit();
        maintTextBulletsSlider();
    }


    /*Cols text slider*/
    var $colsTextSlider;
    function colsTextSliderInit(){
        $('.cols-text-slider .swiper-container').each(function(){
            $colsTextSlider = new Swiper($(this)[0], {
                spaceBetween: 40,
                slidesPerView: 'auto',
                speed: 400,
                loop: false,
                touchStartPreventDefault: false,
                watchOverflow: true,
                navigation: {
                    nextEl: $(this).parents('.cols-text-slider').find('.next-btn'),
                    prevEl: $(this).parents('.cols-text-slider').find('.prev-btn')
                },
                breakpoints:{
                    480: {
                        spaceBetween: 30
                    }
                }
            });
        })
    }

    if($('.cols-text-slider').length){
        colsTextSliderInit();
    }


    /*Articles slider*/
    var $articlesSlider;
    function articlesSliderInit(){
        $('.usual-slider .swiper-container').each(function(){
            $articlesSlider = new Swiper($(this)[0], {
                spaceBetween: 0,
                slidesPerView: 'auto',
                speed: 400,
                loop: false,
                touchStartPreventDefault: false,
                watchOverflow: true,
                navigation: {
                    nextEl: $(this).parents('.usual-slider').find('.next-btn'),
                    prevEl: $(this).parents('.usual-slider').find('.prev-btn')
                },
                breakpoints:{
                    780: {
                        spaceBetween: 54
                    },
                    480: {
                        spaceBetween: 30
                    }
                }
            });
        })
    }

    if($('.usual-slider').length){
        articlesSliderInit();
    }

    $body.on('mousedown', '.usual-slider a, .cols-text-slider a', function(e) {
        e.preventDefault();
    });


    /*Infinity loading*/
    var lazyLoadFlag = true;
    function detectLazyLoading(){
        var lazyDetectOffset = $('.lazy-load-detect').offset().top;
        var windowHeight = $(window).height();
        lazyDetectOffset = lazyDetectOffset - windowHeight;
        if($(window).scrollTop() >= lazyDetectOffset && !$('.lazy-load-detect').hasClass("finished")){
            lazyLoadFlag = false;
            $('.lazy-load-detect').addClass('loading');
            setTimeout(function(){
                $('.lazy-load-detect .js-load-more').trigger('click');
            }, 100);
        }
    }

    if($('.lazy-load-detect').length && lazyLoadFlag){
        detectLazyLoading();
    }


    var currentLazyDetect, lazyLoadingFlag = false;
    $body.on('click', ".js-load-more", function(e){
        e.preventDefault();
        if(!lazyLoadingFlag){
            var url = $(this).attr('href');
            currentLazyDetect = $(this).parents('.lazy-load-detect');

            setTimeout(function(){
                infiniteLoad(url);
            }, 500);
        }
    });


    function infiniteLoad(url) {
        $.ajax({
            url: url,
            dataType: 'html',
            beforeSend: function(){
                lazyLoadingFlag = true;
            },
            success: function(data){

                $('.lazy-load-detect').removeClass('loading');

                lazyLoadFlag = true;

                var $data = $('<div/>').html(data);
                $data.find('.lazy-load-box .item').addClass('hidden');

                var lazyBox = $('.lazy-load-box'),
                    content = $data.find('.lazy-load-box').html();

                if(lazyBox.length){
                    lazyBox.append(content);

                    setTimeout(function(){
                        var delay = .05;
                        var animation;

                        $(lazyBox).find('.hidden').each(function(){
                            animation = "all .5s ease " + delay + 's';
                            $(this).css({"transition": animation});
                            delay = delay + .1;
                            $(this).removeClass('hidden');
                        });
                        $(lazyBox).find('.hidden').removeClass('hidden');
                    }, 250);

                    setTimeout(function(){
                        $(lazyBox).find('.item').attr('style', '');
                    }, 1000);
                }

                if($data.find('.js-load-more').length){
                    var newHref = $data.find('.js-load-more').attr('href');
                    currentLazyDetect.find('.js-load-more').attr('href', newHref);
                }
                else{
                    currentLazyDetect.remove();
                }

                lazyLoadingFlag = false;
            },
            error: function () {
                lazyLoadingFlag = false;
                alert('Page not found!');
            }
        });
    }



    /*Single page nav*/
    var scrollSnapSelector, $productsNavSlides, productsNavCurrentSlide, $productsNavcurrentSlide;
    function productsNavInit(){
        $('.products-nav').singlePageNav({
            offset: 0,
            speed: 500,
            updateHash: false,
            threshold: $window.height()/2,
            currentClass: 'active'
        });

        $('.products-nav li:first-child a').removeClass('active');
    }

    if($('.products-nav').length){
        productsNavInit();
        checkProductsNav();
    }

    /*Scroll on wheel*/
    if($html.hasClass('no-touchevents')){

        scrollSnapSelector = ".scroll-snap";

        $productsNavSlides = $(scrollSnapSelector);

        productsNavCurrentSlide = $('.products-nav a.active').parents('li').index() + 1;
        var isAnimating = false;
        $productsNavcurrentSlide;

        var stopAnimation = function () {
            setTimeout(function () {
                isAnimating = false;
            }, 50)
        };

        var bottomIsReached = function ($elem) {
            var rect = $elem[0].getBoundingClientRect();
            return rect.bottom <= $(window).height();
        };

        var topIsReached = function ($elem) {
            var rect = $elem[0].getBoundingClientRect();
            return rect.top >= 0;
        };

        document.addEventListener("wheel", function(event) {

                $('.product-item .product-link').addClass('prevent-hover');

                if(windowWidth > 1000 && $('.products-nav').length){
                    $productsNavcurrentSlide = $($productsNavSlides[productsNavCurrentSlide]);

                    if (isAnimating) {
                        event.preventDefault();
                        return;
                    }

                    var direction = -event.deltaY;

                    if (direction < 0) {
                        // next
                        if (productsNavCurrentSlide + 1 >= $productsNavSlides.length) return;
                        if (!bottomIsReached($productsNavcurrentSlide)) return;
                        event.preventDefault();
                        productsNavCurrentSlide++;
                        var $slide = $($productsNavSlides[productsNavCurrentSlide]);
                        var offsetTop = $slide.offset().top;
                        isAnimating = true;
                        $("html, body").animate({scrollTop: offsetTop}, 500, stopAnimation);
                    } else {
                        // back
                        if (productsNavCurrentSlide - 1 < 0) return;
                        if (!topIsReached($productsNavcurrentSlide)) return;
                        event.preventDefault();
                        productsNavCurrentSlide--;
                        var $slide = $($productsNavSlides[productsNavCurrentSlide]);
                        var offsetTop = $slide.offset().top;
                        isAnimating = true;
                        $("html, body").animate(
                            {
                                scrollTop: offsetTop
                            },
                            500,
                            stopAnimation
                        );
                    }
                }
            },
            { passive: false }
        );
    }


    $body.on('click', '.products-nav a', function(){
        if($html.hasClass('no-touchevents')) {
            productsNavCurrentSlide = $(this).parents('li').index() + 1;
            $productsNavcurrentSlide = $($productsNavSlides[productsNavCurrentSlide])
        }
    });

    function checkProductsNav(){
        var productsListOffset = $('.products-list').offset().top;
        if(scrolledY + $window.height()/3 < productsListOffset){
            $('.products-nav').addClass('reset');
            $('.products-nav a').removeClass('active');
        }
        else{
            $('.products-nav').removeClass('reset');
        }
    }


    $(document).keydown(function(e){
        if($('.products-nav').length){
            var productsListOffset = $('.products-list').offset().top;
        }

        if(e.keyCode == 40 && $('.products-nav').length && windowWidth > 1000){
            if($('.products-nav a').hasClass('active') && !$('.products-nav').hasClass('reset')){
                $('.products-nav a.active').parents('li').next('li').find('a').trigger('click');
            }
            if($('.products-nav').hasClass('reset') || scrolledY + $window.height()/3 < productsListOffset){
                $('.products-nav li:first-child a').trigger('click');
            }
        }

        if(e.keyCode == 38 && $('.products-nav').length && windowWidth > 1000){
            if($('.products-nav a').hasClass('active') && !$('.products-nav').hasClass('reset')){
                $('.products-nav a.active').parents('li').prev('li').find('a').trigger('click');
            }
        }
    });


    /*Intro text position*/
    function introTextPosition(){
        if(windowWidth > 1300 && !$('.page-title-box .intro-text-box').length){
            $('#main .intro-text-box').insertAfter('.page-title-box h1');
        }
        else if(windowWidth <= 1300 && $('.page-title-box .intro-text-box').length){
            var introTextBox = $('.page-title-box .intro-text-box').detach();
            $('#main > .container:first').prepend(introTextBox);
        }
    }

    if($html.hasClass('product-page') && $('.intro-text-box').length){
        introTextPosition();
    }


    /*Dealer locator*/
    var $contactsMap, markers = [];
    function initContactsMap(locatorMapId){

        var $contactsMapBox = $('#' + locatorMapId), lat = $contactsMapBox.attr('data-lat'), lng = $contactsMapBox.attr('data-lng');

        var mapOptions = {
            zoom: 4,
            center: new google.maps.LatLng(lat,lng),
            disableDefaultUI: true,
            styles: [
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#fbfbfb"
                    }
                ]
            },
            {
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#eeeeee"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#e5e5e5"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#dadada"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#e5e5e5"
                    }
                ]
            },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#eeeeee"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#e7e7e7"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
                    }
                ]
            }
            ]
        };

        $contactsMap = new google.maps.Map(document.getElementById(locatorMapId), mapOptions);
        var $mapBounds = new google.maps.LatLngBounds();

        var infoWindow = new google.maps.InfoWindow({
            content: '',
            maxWidth: 300,
            disableAutoPan: true
        });

        var jsonUrl = '/assets/js/map-points.json';

        $.getJSON(jsonUrl, {}, function(data){
            $.each(data, function(i, item) {

                latLng = new google.maps.LatLng(item.lat, item.lng);

                var pindId ='', latLng, infoWindowContent, pinsList, pinItem, pinTitle = '', pinAddress = '';

                var marker = new google.maps.Marker({
                    id: pindId,
                    position: latLng,
                    map: $contactsMap,
                    icon: '/assets/i/map-marker.svg',
                    title: item.title
                });

                $mapBounds.extend(data[i]);

                infoWindowContent = '<div class="map-infowindow"><p class="title">'+item.title+'</p>'+'<address>'+item.address+'</address>'+'</div>';

                google.maps.event.addListener(marker, 'click', (function(marker, i){
                    return function(){
                        $contactsMap.panTo(marker.getPosition());
                        infoWindow.setContent(infoWindowContent);
                        infoWindow.open($contactsMap, marker);
                        if(windowWidth <= 480){
                            $contactsMap.setZoom(2);
                        }
                       // $contactsMap.setCenter(marker.getPosition());
                    }
                })(marker, i));

                markers.push(marker);

                pinsList = $('.map-pins-list .swiper-wrapper');

                if(item.title){
                    pinTitle = '<p class="h3"><span>'+ item.title +'</span></p>'
                }
                if(item.address){
                    pinAddress = '<address>'+ item.address +'</address>'
                }

                pinItem = '<div class="pin-item swiper-slide" data-marker-index="'+i+'">'+pinTitle + pinAddress +'</div>';
                pinsList.append(pinItem);


                $body.on('click', '.pin-item .h3', function(){
                    var $thisParentItem = $(this).parents('.pin-item');

                    google.maps.event.trigger(markers[$thisParentItem.attr('data-marker-index')], 'click');

                    toMapScrolling();
                });

            });
        });

        setTimeout(function(){
            $contactsMap.fitBounds($mapBounds);
        }, 500);

        setTimeout(function(){
            mapPinsSliderInit();
        }, 1500);
    }

    if($('.contacts-map').length){
        var locatorMapId = $('.contacts-map').attr('id');
        initContactsMap(locatorMapId);
    }

    function toMapScrolling(){
        var mapOffsetTop = $('.contacts-map').offset().top;
        var mapPinsListHeight = $('.map-pins-list').innerHeight();
        if(windowWidth > 780){
            $('html, body').animate({
                scrollTop: mapOffsetTop - 16
            }, 250);
        }
        else{
            $('html, body').animate({
                scrollTop: mapOffsetTop - mapPinsListHeight - 64
            }, 250);
        }
    }

    var mapPinsSlider = undefined;
    function mapPinsSliderInit(){
        if(windowWidth <= 780 && mapPinsSlider == undefined) {
            mapPinsSlider = new Swiper('.map-pins-list .swiper-container',{
                slidesPerView: 'auto',
                loop: false,
                spaceBetween: 54,
                watchOverflow: true,
                navigation: {
                    nextEl: $('.map-pins-list .next-btn'),
                    prevEl: $('.map-pins-list .prev-btn')
                }
            });
            setTimeout(function(){
                window.dispatchEvent(new Event('resize'));
            }, 500);
        }
        else if (windowWidth > 780 && mapPinsSlider !== undefined) {
            mapPinsSlider.destroy(true, true);
            mapPinsSlider = undefined;
            $('.map-pins-list .swiper-wrapper').attr('style', '');
            $('.map-pins-list .swiper-slide').attr('style', '');
        }

        $('.map-pins-list .h3').on('click', function(){
            if(windowWidth <= 780){
                var activeSlide = $(this).parents('.swiper-slide').index();
                mapPinsSlider.slideTo(activeSlide);
            }
        });
    }

    if($('.map-pins-list').length){
        mapPinsSliderInit();
    }


    $body.on('click', '.anchors-nav a', function(e){
        e.preventDefault();
        var targetId = $(this).attr('href');
        var targetIdOffsetTop = $(targetId).offset().top;
        var offsetIndent = 100;
        $('html, body').animate({
            scrollTop: targetIdOffsetTop - offsetIndent
        }, 250);
    });





    /*Ajax*/

    // browser history
    $(window).bind('popstate', function(){
        $('#all, #header, #footer').css('opacity', 0);
        if(location.href.indexOf("#") > -1){
            hashId = location.href.split("#")[1]
        }
        loadPage(location.href, false);
        $('#secondary-nav li, #nav-box li').removeClass('active');
    });


    var loading = false;

    /*Prevent logo click index-page*/
    $body.on('click', '#logo', function(e){
        if($body.hasClass('index-page')){
            e.stopPropagation();
            e.preventDefault();
            $.ajax.abort();
        }
    });

    // external links
    $body.on('click', ".js-ajax-link[href*='://']", function (e) {
        $(this).attr('target', '_blank');
        /*if (!confirm('Go to site?')) {
            e.preventDefault();
        }*/
    });

    var hashId = '';
    var anchorSlide = '';
    // site links
    $body.on('click', ".js-ajax-link:not([href*='://'])", function(e){
        e.preventDefault();
        if (loading) {
            alert('Please wait');
        }

        else if(!$(this).parent('li').hasClass('active') || $(this).parents('#nav').length && $(this).next('ul').find('.active').length){

            var url = $(this).attr('href');

            if(url.indexOf("#") > -1) {
                hashId = url.split("#")[1];
                if($(this).attr('data-anchor-slide')){
                    anchorSlide = $(this).attr('data-anchor-slide') - 1;
                }
            }

            loadPage(url, true);

            $('#secondary-nav li, #nav-box li').removeClass('active');

            $('#secondary-nav .js-ajax-link, #nav-box .js-ajax-link').each(function(){
                var ajaxUrl = $(this).attr('href');
                if(url == ajaxUrl){
                    $(this).parents('li').addClass('active');
                }
            });
        }
    });


    // load page with ajax
    function loadPage(url, push_state) {
        $.ajax({
            url: url,
            dataType: 'html',
            beforeSend: function () {
                loading = true;

                var minContentHeight = $('.ajax-upload-box').innerHeight();
                $('.ajax-upload-box').css('min-height', minContentHeight);

                $html.addClass('page-transition-start hidden-scroll');
                if($html.hasClass('no-touchevents') && $html.hasClass('hover-cursor-activated')){
                    $html.removeClass('hover-cursor-activated');
                }
                $('.page-transitions-box').find('.video')[0].play();
            },
            success: function(data){
                var $data = $('<div/>').html(data);

                setTimeout(function(){

                    $('html, body').animate({
                        scrollTop: 0
                    }, 10);

                    $('#all, #header, #footer').css('opacity', 1);

                    if($html.hasClass('opened-nav')) {
                        $('#nav-box').removeClass('nav-animate');
                        navBoxWaveAnimateDirection = -1;
                        navBoxWaveAnimate.setDirection(navBoxWaveAnimateDirection);
                        navBoxWaveAnimate.play();
                        navAnimationFlag = false;
                        setTimeout(function(){
                            $html.removeClass('opened-nav light-cursor');
                        }, 1000);
                    }

                    var bodyClass = '';

                    var m = data.match(/<body class="([^"]+)">/);
                    if (m) {
                        bodyClass = m[1];
                    }

                    var docTitle = $data.find('title').text();
                    var pageContent = $data.find('.ajax-upload-box').html();

                    document.title = "" + docTitle;

                    /*Body class*/
                    $body.attr('class', bodyClass);


                    /*Ajax content*/
                    $('.ajax-upload-box').html("" + pageContent).attr('style', '');


                    if (push_state) {
                        if ('pushState' in window.history) window.history.pushState(null, null, url);
                    }
                    loading = false;

                }, 800);


                setTimeout(function(){

                    /*Functions reinit*/

                    /*ResponsImg*/
                    if($('.responsimg').length){
                        $('.responsimg').responsImg();
                    }

                    /*Viewport checker*/
                    if($('.js-view-checker').length){
                        inViewChecker();
                    }

                    /*Typography*/
                    if($('h6, .h6').length){
                        lastWord();
                    }

                    /*Table wrap*/
                    if($('table').length){
                        tableWrap();
                    }

                    /*Form*/
                    $('.form .field').each(function(){
                        if($(this).find('.upload-box').length){
                            $(this).addClass('upload-field');
                        }
                    });

                    checkFormControl();

                    if($('textarea').length){
                        $('textarea').textareaAutoSize();
                    }

                    /*Files upload*/
                    if($('.upload-box input[type="file"]').length){
                        $('.upload-box input[type="file"]').fileinput({
                            buttonClass: 'upload-btn'
                        });
                    }

                    /*Text grid*/
                    $('.text-grid').each(function(){
                        textGridHasIcons();
                    });

                    /*Masonry grid*/
                    if($('.masonry-grid').length){
                        masonryGridInit()
                    }

                    /*Gallery*/
                    if($('.photo-gallery').length){
                        galleryInit();
                    }

                    /*Products in brief Video*/
                    if($('.products-list-in-brief .product-in-brief video').length && $html.hasClass('no-touchevents')){
                        $('.products-list-in-brief .product-in-brief').each(function(){
                            $(this).find('.video').css('display', 'block')[0].pause();
                        });
                    }

                    if($('.product-in-brief').length && $html.hasClass('no-touchevents')){
                        playProductInBriefVideoMobile();
                    }

                    /*Bg links items box*/
                    if($('.bg-links-items-box').length && $html.hasClass('no-touchevents')){
                        $('.bg-links-items-box').each(function(){
                            $(this).append('<a href="" class="bg-link js-hover-cursor"><video class="video" loop muted><source src="video/main-screen-video.mp4" type="video/mp4"></video></a>');
                        });
                    }

                    /*Main text slider*/
                    if($('.main-text-slider').length){
                        mainTextSliderFlag = true;
                        mainTextSliderInit();
                        maintTextBulletsSlider();
                    }

                    /*Cols text slider*/
                    if($('.cols-text-slider').length){
                        colsTextSliderInit();
                    }

                    /*Articles slider*/
                    if($('.usual-slider').length){
                        articlesSliderInit();
                    }

                    /*Single page nav*/
                    if($('.products-nav').length){
                        productsNavInit();
                        if($html.hasClass('no-touchevents')){
                            scrollSnapSelector = ".scroll-snap";
                            $productsNavSlides = $(scrollSnapSelector);
                            productsNavCurrentSlide = $('.products-nav a.active').parents('li').index() + 1;
                            $productsNavcurrentSlide;
                        }
                        checkProductsNav();
                    }

                    /*Intro text position*/
                    if($html.hasClass('product-page') && $('.intro-text-box').length){
                        introTextPosition();
                    }


                    /*Dealer locator*/
                    if($('.contacts-map').length){
                        if(!$('#ggl-map-js').length){
                            $body.append('<script src="https://maps.googleapis.com/maps/api/js?v=3&amp;AIzaSyCJVwYFKnrA2msh-YNYBh36quwWvEbgeoY;libraries=places" id="ggl-map-js"></script>');
                        }

                        var checkGglApiLoaded = setInterval(function(){
                            if (typeof google === 'object'){
                                var locatorMapId = $('.contacts-map').attr('id');
                                initContactsMap(locatorMapId);
                                clearInterval(checkGglApiLoaded)
                            }
                        }, 300);
                    }

                    if($('.map-pins-list').length){
                        mapPinsSliderInit();
                    }

                    /*Share*/
                    if($('.simple-share').length){
                        $('.simple-share').simpleShare();
                    }


                    /*Popup*/
                    /*if(!$('#popup-box').length && $(data).filter('#popup-box').length){
                        var popupBox = $(data).filter('#popup-box').html();
                        $body.append('<div id="popup-box">'+popupBox+'</div>')
                    }*/
                    $('#popup-box').html($data.find('#popup-box').html());

                    if($('.js-open-popup').length){
                        actionIcon();
                    }

                }, 1000);


                setTimeout(function(){
                    $html.removeClass('page-transition-start hidden-scroll');
                    if($body.hasClass('preload-page')){
                        $body.addClass('page-load');
                        $('#page-preloader').fadeOut(550);
                    }
                }, 2000);

                setTimeout(function(){
                    if(hashId !== ''){
                        var hashOffsetTop = $('#' + hashId).offset().top;

                        $('html, body').animate({
                            scrollTop: hashOffsetTop - 60
                        }, 500);

                        if(anchorSlide !==''){
                            $('#' + hashId).find('.swiper-container')[0].swiper.slideTo(anchorSlide);
                        }

                        hashId = '';
                    }

                    $('.page-transitions-box').find('.video')[0].pause();
                }, 2300);

            },
            error: function () {
                loading = false;
                alert('Page not found!');
            }
        });
    }




    /*Page transitions*/
    /*if($body.hasClass('page-load-animate')){
        setTimeout(function(){
            $('.page-load-animate').addClass('page-visible');
            if(!$html.hasClass('preload-page')){
                $html.addClass('page-load');
            }
        }, 500);
    }*/

    window.onpageshow = function(event){
        if(event.persisted){
            if($html.hasClass('opened-nav')){
                $('.js-close-nav').trigger('click');
            }
            /*if($body.hasClass('page-load-animate')){
                setTimeout(function(){
                    $('.page-load-animate').addClass('page-visible');
                    if(!$html.hasClass('preload-page')){
                        $html.addClass('page-load');
                    }
                }, 500);
            }*/
        }
    };


    /*var pageTransitions = true;
    $body.on('click', 'a[href^="#"], a[href^="mailto"], a[href^="tel"], a[href^="viber"], .js-open-gallery', function(){
        pageTransitions = false;
        clearTimeout(resizeEnd);
        resizeEnd = setTimeout(function(){
            pageTransitions = true;
        }, 50);
    });
    $body.on('click', 'a', function(e){
        if(pageTransitions && $(this).attr("target") != "_blank" && !$(this).hasClass('prevent-transitions')){
            e.preventDefault();
            var newLocation = $(this).attr('href');
            $('.page-load-animate').removeClass('page-visible');

            setTimeout(function(){
                window.location = newLocation
            }, 200);
        }
    });*/


    /*Cookies message*/
    $body.on('click', '.cookies-message .js-agree', function(){
        $(this).parents('.cookies-message').fadeOut(250);
        setCookieVal('hide-cookies-message', 'yes', 30);
    });

    if (getCookieVal('hide-cookies-message') !== 'yes') {
        $('.cookies-message').show();
    }


    /*Popup*/
    function actionIcon(){
        $('.js-open-popup').each(function(){
            if($(this).find('.action-icon').length){
                $(this).addClass('has-icon');
            }
        });
    }
    if($('.js-open-popup').length){
        actionIcon();
    }

    $body.on('click', '.js-open-popup', function(e){
        e.preventDefault();
        e.stopPropagation();
        $body.trigger('click');
        var dataPopup = $(this).attr('data-popup');
        if(!$html.hasClass('opened-popup')){
            $html.addClass('opened-popup').removeClass('opened-nav');
            $("#" + dataPopup).addClass('visible');
        }
    });

    $body.on('click', '.js-close-popup', function(){
        if($html.hasClass('opened-popup')) {
            $html.removeClass('opened-popup');
            $('#popup-box .popup').removeClass('visible');
        }
        if($html.hasClass('opened-img-popup')) {
            $html.removeClass('opened-img-popup');
            setTimeout(function(){
                $('.img-popup .align-box').html('');
            }, 300);
        }
    });


    $body.on('click', '#popup-box', function(e){
        if($(e.target).is('#popup-box') || $(e.target).is('#popup-box .container')){
            $('.js-close-popup').trigger('click');
        }
    });


    /*Img popup*/
    $body.on('click', '.about-screen .ratio-img, .about-screen .zoom-in', function(){
        var parent = $(this).parents('.ratio-img-box');
        var popupImgSrc = parent.attr('data-popup-img-src');
        if(!$html.hasClass('opened-img-popup')){
            $('.img-popup .align-box').html('');
            $html.addClass('opened-img-popup');
            $('.img-popup .align-box').append('<img src="'+popupImgSrc+'" style="display: none;" alt="" />');
            setTimeout(function(){
                $('.img-popup .align-box img').fadeIn(350);
            }, 500)
        }
    });

    $body.on('click', '.img-popup', function(e){
        if($(e.target).is('.img-popup') || $(e.target).is('.img-popup .align-box')){
            $('.js-close-popup').trigger('click');
        }
    });


    /*Footer*/
    function stickyFooter(){
        var fHeight = $('#footer').innerHeight();
        $('#footer').css('marginTop', -fHeight);
        $('#indent').css('paddingBottom', fHeight);
    }
    if($('#footer').length){
        stickyFooter();
    }


    /*Keyboard controls*/
    $(document).keyup(function (e) {
        if(e.keyCode == 27){
            $('.opened-nav .js-close-nav, .opened-popup .js-close-popup, .opened-img-popup .js-close-popup').trigger('click');
        }
    });


    /*Window load*/
    $window.on('load', function () {
        $.ready.then(function(){


            if($body.hasClass('preload-page')){
                setTimeout(function () {
                    $body.addClass('page-load');
                    $('#page-preloader').fadeOut(550);
                }, 3000);
            }

            setTimeout(function(){
                if ($('#footer').length){
                    stickyFooter();
                }
            }, 300)
        });
    });

    var resizeEnd;
    $window.on('resize', function () {
        windowWidth = Math.max($window.width(), window.innerWidth);

        clearTimeout(resizeEnd);
        resizeEnd = setTimeout(function(){

            if($('.product-in-brief').length && $html.hasClass('no-touchevents')){
                playProductInBriefVideoMobile();
            }

            if($('.main-text-slider').length){
                maintTextBulletsSlider();
            }

            if(windowWidth > 1000 && $('.products-nav').length){
                $window.trigger('scroll');
                if($html.hasClass('no-touchevents')){
                    $('.products-nav .active').trigger('click');
                }
                checkProductsNav();
            }

            if($html.hasClass('product-page') && $('.intro-text-box').length){
                introTextPosition();
            }

            if($('.map-pins-list').length){
                mapPinsSliderInit();
            }

            if($('.contacts-map').length){
                var bounds = new google.maps.LatLngBounds();
                for (var i = 0; i < markers.length; i++) {
                    bounds.extend(markers[i].getPosition());
                }
                $contactsMap.fitBounds(bounds);
            }

            if($('#footer').length){
                stickyFooter();
            }
        }, 250);
    });


    $window.on('orientationchange', function () {
        windowWidth = Math.max($window.width(), window.innerWidth);


        clearTimeout(resizeEnd);
        resizeEnd = setTimeout(function(){

            if($('.product-in-brief').length && $html.hasClass('no-touchevents')){
                playProductInBriefVideoMobile();
            }

            if($('.main-text-slider').length){
                maintTextBulletsSlider();
            }

            if(windowWidth > 1000 && $('.products-nav').length){
                $window.trigger('scroll');
                if($html.hasClass('no-touchevents')){
                    $('.products-nav .active').trigger('click');
                }
                checkProductsNav();
            }

            if($html.hasClass('product-page') && $('.intro-text-box').length){
                introTextPosition();
            }

            if($('.map-pins-list').length){
                mapPinsSliderInit();
            }

            if($('.contacts-map').length){
                var bounds = new google.maps.LatLngBounds();
                for (var i = 0; i < markers.length; i++) {
                    bounds.extend(markers[i].getPosition());
                }
                $contactsMap.fitBounds(bounds);
            }

            if($('#footer').length){
                stickyFooter();
            }
        }, 350);
    });

    $window.scroll(function(){
        stickyHeader();

        if($('.lazy-load-detect').length && lazyLoadFlag){
            detectLazyLoading();
        }


        if($('.products-nav').length && windowWidth > 1000){
            checkProductsNav();
        }


        clearTimeout(resizeEnd);
        resizeEnd = setTimeout(function(){
            if($('.product-item .product-link').hasClass('prevent-hover')){
                $('.product-item .product-link').removeClass('prevent-hover');
            }
        }, 350);
    });

    function getCookieVal(name) {
        var re = new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"),
            matches = document.cookie.match(re);
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    function setCookieVal(name, value, days_expires) {
        var date = new Date(new Date().getTime() + days_expires * 86400000);
        document.cookie = name + "=" + value + "; path=/; expires=" + date.toUTCString();
    }

})(jQuery);


