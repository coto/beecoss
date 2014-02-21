/* = Config options for different scripts used at theme
-----------------------------------------------------------------------------*/
(function ($) {
    "use strict";
    /*global window: false */
	/* = PrettyPrint
------------------------------------------------------*/
    if (typeof prettyPrint != 'undefined') prettyPrint();

    if (window.devicePixelRatio >= 1.5) {
        var images = $("img.hires");
        for (var i = 0; i < images.length; i++) {
            var imageType = images[i].src.substr(-4);
            var imageName = images[i].src.substr(0, images[i].src.length - 4);
            imageName += "@2x" + imageType;
            images[i].src = imageName;
        }
    }
    $('.link-show-code').click(function (e) {
        e.preventDefault();

        var parent = $(this).parent();
        var el = parent.next('.prettyprint');
        if ($(el).css('display') == 'none') {
            $(el).show();
            $(parent).addClass('pause');
            $(this).html('Hide code').addClass('link-show-code-active');
        } else {
            $(el).hide();
            $(parent).removeClass('pause');
            $(this).html('Show code').removeClass('link-show-code-active');
        }
        return false;
    });
	
    /* = Responsive menu
------------------------------------------------------*/
    $("<select />").appendTo("#menuwrap");

    // Create default option "Select a page..."
    $("<option />", {
        "selected": "selected",
        "value": "",
        "text": "Select A Page..."
    }).appendTo("#menuwrap select");

    // Populate dropdown with menu items
    $('#menuwrap a').each(function () {
        var el = $(this);
        if (el.parents('.menu-sub').length) {
            $('<option />', {
                'value': el.attr('href'),
                'text': '— ' + el.text()
            }).appendTo('#menuwrap select');
        } else {
            $('<option />', {
                'value': el.attr('href'),
                'text': el.text()
            }).appendTo('#menuwrap select');
        }
    });

    $("#menuwrap select").change(function () {
        window.location = $(this).find("option:selected").val();
    });


    /* = jQuery Cycle 2 plugin for carousel and slider
------------------------------------------------------*/
    $('.carousel .items').cycle({
        'fx': 'carousel',
        'timeout': 4000,
        'carouselVisible': 3,
        'carouselFluid': true,
        'carouselStep': 3,
        'slides': "> div",
        'auto-height': 'calc',
        'next': '> .next',
        'prev': '> .prev',
        'log': false
    });

    $('.slider .slides').cycle({
        'fx': 'scrollHorz',
        'timeout': 4000,
        'swipe': 'true',
        'auto-height': 'calc',
        'next': '.next',
        'prev': '.prev',
        'caption': '.caption',
        'captionTemplate': '{{alt}}',
        'log': false
    });

    var progress = $('#progress'),
        slideshow = $('.cycle-slideshow');

    slideshow.on('cycle-initialized cycle-before', function (e, opts) {
        progress.stop(true).css('width', 0);
    });

    slideshow.on('cycle-initialized cycle-after', function (e, opts) {
        if (!slideshow.is('.cycle-paused'))
            progress.animate({
                width: '100%'
            }, opts.timeout, 'linear');
    });

    slideshow.on('cycle-paused', function (e, opts) {
        progress.stop();
    });

    slideshow.on('cycle-resumed', function (e, opts, timeoutRemaining) {
        progress.animate({
            width: '100%'
        }, timeoutRemaining, 'linear');
    });

    /* = PrettyPhoto options
------------------------------------------------------*/
    $("a[rel^='prettyPhoto']").prettyPhoto({
        social_tools: false
    });


    /* = Isotope (portfolio)
------------------------------------------------------*/

var $container = $('.portfolioContainer');
$container.imagesLoaded( function(){
  $container.isotope({
        filter: '*',
        animationOptions: {
            duration: 750,
            easing: 'linear',
            queue: false
        }
 });

    $('.portfolioFilter ul a').click(function () {
        var selector = $(this).attr('data-filter');
        $container.isotope({
            filter: selector,
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            }
        });
        return false;
    });

    var $optionSets = $('.portfolioFilter ul'),
        $optionLinks = $optionSets.find('a');

    $optionLinks.click(function () {
        var $this = $(this);
        // don't proceed if already selected
        if ($this.hasClass('current')) {
            return false;
        }
        var $optionSet = $this.parents('.portfolioFilter ul');
        $optionSet.find('.current').removeClass('current');
        $this.addClass('current');
    });
});
	
    /* = End config options for different scripts used at theme
-----------------------------------------------------------------------------*/
})(jQuery);