var aNavItems = $('nav.global .navItem');
var aPages = $('div.containerPages div.page');

/* INIT SCREEN */
var iMaxEventPriceRange = 5000;
$("div.filter div.filterSlider.priceRange").slider({
    range: true,
    min: 0,
    max: iMaxEventPriceRange,
    values: [0, iMaxEventPriceRange],
    step: 100,
    slide: function (event, ui) {
        var sMinValue = formatPriceString(ui.values[0]);
        var sMaxValue = formatPriceString(ui.values[1]);
        $(this).closest('div.sliderGroup').find('span.sliderValueMin').html(sMinValue);
        $(this).closest('div.sliderGroup').find('span.sliderValueMax').html(sMaxValue);
        showDataLoadMessage();
    }
}).data("ui-slider")._slide();


$("div.filter div.filterSlider.dateRange").slider({
    range: true,
    min: 0,
    max: 10,
    values: [0, 10],
    step: 1,
    slide: function (event, ui) {
        var sMinValue = convertSliderDateValue(ui.values[0]);
        var sMaxValue = convertSliderDateValue(ui.values[1]);
        $(this).closest('div.sliderGroup').find('span.sliderValueMin').html(sMinValue);
        $(this).closest('div.sliderGroup').find('span.sliderValueMax').html(sMaxValue);
        showDataLoadMessage();
    }
}).data("ui-slider")._slide();

var sCurrentPageId = null;
try {
    sCurrentPageId = sessionStorage.currentPageId;
} catch (e) {
    // ignore thrown errors (from some browsers in privacy mode)
}

initMap();

$("input.editDate").datepicker({
    dateFormat: 'DD, d MM, yy'
});

showPage(sCurrentPageId || 'eventBrowser');

/* EVENTS */

// GENERAL CLICK HANDLER
document.addEventListener('click', function (event) {
    //console.log('BUTTON CLICK:', event.target.classList);

    var jClickedElement = $(event.target).closest('.button, .clickLink');

    if (jClickedElement.length == 1) {
        // SYSTEM BUTTONS OR LINK TEXT
        if (jClickedElement.hasClass("toggleGlobalNav")) {
            toggleObjectSlide($('header nav.global'));
        } else if (jClickedElement.hasClass("showSignIn")) {
            toggleObjectSlide($('div.containerPopup.signIn'));
        } else if (jClickedElement.hasClass("signOut")) {
            location.reload();
        } else if (jClickedElement.hasClass("navItem")) {
            var sPageId = jClickedElement.attr('data-page-id');
            showPage(sPageId);
        } else if (jClickedElement.hasClass("showEventBrowser")) {
            showPage('eventBrowser');
        } else if (jClickedElement.hasClass("deleteEvent")) {
            if (confirm("Are you certain you want to delete this event?")) {
                showPage('eventBrowser');
                showUserMessage("The event has been deleted.");
            }
        } else if (jClickedElement.hasClass("showEventDetail")) {
            showPage('eventDetail');
            scrollAll($('div.page div.eventDetail'));
        } else if (jClickedElement.hasClass("editEvent")) {
            showPage('eventEdit');
            scrollTop($('div.page div.eventEdit div.section.statistics'));
        } else if (jClickedElement.hasClass("addEvent")) {
            showPage('eventEdit');
            scrollTop($('div.page div.eventEdit div.section.statistics'));
        } else if (jClickedElement.hasClass("showEventStatistics")) {
            showPage('eventReport');
        } else if (jClickedElement.hasClass("eventRemindMe")) {
            showUserMessage("Your reminder has been added!");
        } else if (jClickedElement.hasClass("showRegisterForm")) {
            toggleObjectSlide($('div.containerPopup.register'));
        } else if (jClickedElement.hasClass("submitRegister")) {
            toggleObjectSlide($(jClickedElement).closest('div.containerPopup'));
            showUserMessage("You&rsquo;re all set. Thanks for registering.");
        } else if (jClickedElement.hasClass("shareEvent")) {
            showUserMessage("Oh no! Sorry, the social share feature isn't working right now.", true);
        } else if (jClickedElement.hasClass("closePopup")) {
            toggleObjectSlide($(jClickedElement).closest('div.containerPopup'));
        } else if (jClickedElement.hasClass("submitSignIn")) {
            doSignIn();
        } else if (jClickedElement.hasClass("filterChoice")) {
            if (jClickedElement.hasClass("selected")) {
                jClickedElement.removeClass("selected");
            } else {
                jClickedElement.addClass("selected");
            }
            showDataLoadMessage();
        } else if (jClickedElement.hasClass("filterToggleExpand")) {
            var sGroupId = jClickedElement.attr('data-item-id');
            var objectContent = jClickedElement.closest('div.expandGroup').find('div[data-item-id=' + sGroupId + '].filterContent');
            var sIndicatorRotateDegrees = objectContent.css('display') == 'none' ? '180deg' : '0deg';
            objectContent.slideToggle(444);
            objectContent.parent().find('.actionIndicator').eq(0).css({
                transform: 'rotate(' + sIndicatorRotateDegrees + ')'
            });

        } else if (jClickedElement.hasClass("showCalendarForm")) {
            toggleObjectSlide($('div.containerPopup.calendar'));
        } else if (jClickedElement.hasClass("submitCalendar")) {
            toggleObjectSlide($(jClickedElement).closest('div.containerPopup'));
            showUserMessage("Glad you&rsquo;re planning ahead ;)");
        } else {
            console.log('BUTTON CLICK WITH NO MATCH FOR:', jClickedElement.attr('class'));
        }
    }

});



/* FUNCTIONS */

function doSignIn() {
    var divFeedback = $('div#signIn div.containerFeedback');
    divFeedback.html('');
    var sUserEmail = $('input[name="signInEmail"]').val();
    if (sUserEmail.match(/@/i)) {
        divFeedback.html("YOU&rsquo;RE IN!");
        if (sUserEmail.match(/admin/i)) {
            $('.adminOnly').addClass('show').slideDown(666);
        } else {
            $('.adminOnly').removeClass('show').hide();
        }
        $('nav.global .showSignIn').hide();
        $('nav.global .signOut').show();
        toggleObjectSlide($('div.containerPopup.signIn'));
    } else {
        divFeedback.html("That&rsquo;s not quite right. Try again?");
    }
}

function toggleObjectSlide(object) {
    if (object.css('display') == 'none') {
        object.stop().slideDown(666, 'easeOutBounce');
    } else {
        object.stop().slideUp(333, 'easeInSine');
    }
}


function showPage(sPageId, useScroll) {
    aNavItems.each(function () {
        if ($(this).attr('data-page-id') == sPageId) {
            $(this).addClass('selected');
        } else {
            $(this).removeClass('selected');
        }
    });

    aPages.each(function () {
        if ($(this).attr('data-page-id') == sPageId) {
            $(this).addClass('selected');
            sessionStorage.currentPageId = sPageId;
        } else {
            $(this).removeClass('selected');
        }
    });

    google.maps.event.trigger(mapEvent, 'resize');
}

function showDataLoadMessage() {
    var iFakeLoadTime = randomIntRange(111, 1111);
    $('div#systemLockMessageContainer').fadeIn(333);
    setTimeout(function () {
        $('div#systemLockMessageContainer').fadeOut(111);
    }, iFakeLoadTime);
}

function showUserMessage(sMessage, isError) {
    if (typeof isError == 'undefined') {
        var isError = false;
    }
    var objectNewMessage = $('<div/>').html(sMessage).hide();
    if (isError) {
        objectNewMessage.addClass('error');
    }
    $('div#userMessageContainer').append(objectNewMessage);
    objectNewMessage.slideDown(666);
    setTimeout(function () {
        objectNewMessage.slideUp(999);
    }, 5000);
}

function convertSliderDateValue(value) {
    switch (value) {
        case 0:
            return 'Today';
        case 1:
            return 'Tomorow';
        case 2:
            return '1 week from now';
        case 3:
            return '2 weeks from now';
        case 4:
            return '1 month from now';
        case 5:
            return '2 months from now';
        case 6:
            return '3 months from now';
        case 7:
            return '6 months from now';
        case 8:
            return '9 months from now';
        case 9:
            return '1 year from now';

    }
    return 'No Limit';
}