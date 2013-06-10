$(function() {
    // Add spans placeholders for the lazy-load
    var $container = $('main')
    games.forEach(function(game) {
        $container.append($('<span>').data(game))
    })

    // The spans which will be replaced by the iframes
    var $gamesPlaceholders   = $('span', $container)
      , $gamesElements       = $('span, iframe', $container)
      , url                  = 'http://www.humblebundle.com/store/product/'
    /**
     * Replace a placeholder by an iframe
     * @param  {jQel}  $placeholder  The placeholder which will be replaced
     */
      , loadIframe = function($placeholder) {
        var $iframe = $('<iframe>')
            .addClass('hidden')
            .attr('src', url + $placeholder.data('url'))
            .data($placeholder.data())

        $placeholder.data('isLoading', true)

        $iframe.on('load', function() {
            $iframe
                .addClass('shown')
                .toggleClass('hidden', $placeholder.hasClass('hidden'))

            // Remove the placeholder
            $placeholder.remove()
            // Rebuild the placeholders and verify if they are all transformed to iframes
            $gamesPlaceholders = $('span', $container)
            $gamesElements     = $('span, iframe', $container)

            if (!$gamesPlaceholders.length) {
                $(window).off('scroll')
                processScroll = function() {}
            }
        })

        // Insert the iframe
        $placeholder.before($iframe)
    }
    /**
     * Detect if an element is in the viewport
     * @param  {Node}     el  The element which is detected
     * @return {boolean}      True if the element is in the viewport
     */
      , elementInViewport = function(el) {
        var rect = el.getBoundingClientRect()

        return (
            rect.top  >= 0 &&
            rect.left >= 0 &&
            rect.top  <= (window.innerHeight || document.documentElement.clientHeight)
        )
    }
    /**
     * Function called each time the user scroll, it detect if the elements are in the viewport
     * and if so replace them with the corresponding iframe
     */
      ,  processScroll = function() {
        $gamesPlaceholders.each(function(i, placeholder) {
            var $placeholder = $(placeholder)
            if (elementInViewport(placeholder) && !$placeholder.hasClass('hidden') && !$placeholder.data('isLoading')) {
                loadIframe($placeholder)
            }
        })
    }

    processScroll()
    $(window).on('scroll', processScroll)

    /**
     * On filter with the input or the platforms buttons
     *
     * @param  {Event}  e  The event
     */
    var filter = function(e) {
        e.preventDefault()

        var value = $input.val()

        $(this).toggleClass('active')
        var platforms = $filters.filter('.active').map(function() {
            return this.hash.slice(1)
        }).get()

        $gamesElements.each(function(i, placeholder) {
            // By input
            var $placeholder = $(placeholder)
              , nameMatched = false
            if (new RegExp(value, 'i').test($placeholder.data('url')))
                nameMatched = true
            else if (new RegExp(value, 'i').test($placeholder.data('description')))
                nameMatched = true
            else if (new RegExp(value, 'i').test($placeholder.data('name')))
                nameMatched = true
            else if (new RegExp(value, 'i').test($placeholder.data('developer')))
                nameMatched = true

            // By platform/DRM
            var supportedPlatforms = $placeholder.data('platform');
            var supportedDRM       = $placeholder.data('DRM');
            var supportFilters     = platforms.every(function(platformordrm) {
                return supportedPlatforms[platformordrm]||supportedDRM[platformordrm]
            });

            $placeholder.toggleClass('hidden', !(nameMatched && supportFilters))
        })

        processScroll()
    }

    var $input   = $('input')
      , $filters = $('.filters a')
    $input.on('input', filter)
    $filters.on('click', filter)


    // Show the contributors, thanks by the way
    $.ajax('https://api.github.com/repos/calvein/humble-games/contributors')
    .done(function(response) {
        $('footer')
            .find('b').html(function() {
                return response.map(function(contributor) {
                    if (contributor.login !== 'Calvein')
                        return $('<a>')
                            .attr('href', contributor.html_url)
                            .text(contributor.login)
                            .appendTo('<div>')
                            .parent()
                            .html()
                    }).join(', ')
            }).end()
        .toggleClass('hidden shown')
    })

    location.search.slice(1).split('&').forEach(function(search) {
        var params = search.split('=')
        if (params[0] === 'input') {
            $input
            .val(params[1])
            .trigger('input')
        } else {
            $('.filters a[href="#' + params[0] + '"]').click()
        }
    })
})
