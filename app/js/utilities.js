var mapEvent = null;

function formatPriceString(input) {
    var nAmount = parseFloat(input);
    if (isNaN(nAmount)) {
        return 'Amount Invalid';
    }
    if (nAmount <= 0) {
        return 'Free';
    }
    if (nAmount >= 5000) {
        return 'No Limit';
    }
    return '' + Math.round(nAmount).toString() + ' kr.';
}

function initMap() {
    var markerMain = {};
    var jMapTarget = {
        lat: 55.7,
        lng: 12.475
    };

    mapEvent = new google.maps.Map(document.getElementById('sampleEventMap'), {
        zoom: 14,
        center: jMapTarget
    });

    markerMain = new google.maps.Marker({
        map: mapEvent
    });
}

function randomIntRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function scrollAll(theElement) {

    var originalScrollTop = $(window).scrollTop();

    var viewHeight = $(window).height();
    var viewTop = originalScrollTop;
    var viewBottom = viewTop + viewHeight;
    var padding = (theElement.outerHeight() - theElement.innerHeight()) / 2;
    var elementTop = theElement.offset().top + padding;
    var elementBottom = elementTop + theElement.innerHeight();

    //when the element is taller the screen, scroll to element top (less padding)
    if (theElement.innerHeight() > viewHeight) {
        $('html,body').animate({
            scrollTop: elementTop,
            easing: 'ease'
        }, 999);
        return;
    }

    //the element top is off screen so scroll to element top (less padding)
    if (viewTop > elementTop) {
        $('html,body').animate({
            scrollTop: elementTop,
            easing: 'ease'
        }, 999);
        return;
    }

    //the element bottom is off screen so scroll up enough to not push the top offscreen
    if (viewBottom < elementBottom) {
        $('html,body').animate({
            scrollTop: elementBottom - viewHeight + padding,
            easing: 'ease'
        }, 999);
    }

}

function scrollTop(theElement, options) {
    if (typeof options === 'undefined') {
        var options = {};
    }

    /* handle for percent from top */
    var percentFromTop = parseFloat(options.percentFromTop);

    /* handle for custom scroll speed */
    var scrollSpeed = parseFloat(options.scrollSpeed);
    if (!scrollSpeed) {
        scrollSpeed = 999;
    }

    var originalScrollTop = $(window).scrollTop();
    var elementTop = theElement.offset().top;

    if (percentFromTop) {
        percentFromTop = Math.abs(percentFromTop);
        if (percentFromTop > 1) {
            percentFromTop = percentFromTop / 100;
        }
        elementTop -= window.innerHeight * percentFromTop;
    }

    //the element top is off screen so scroll to element top (less padding)
    $('html,body').animate({
        scrollTop: elementTop,
        easing: 'ease-out'
    }, scrollSpeed);
}