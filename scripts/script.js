$(function() {
    function Humble(selector) {
        var self = this
        // Add spans placeholders for the lazy-load
        self.$el = $(selector)
        self.$input = $('input')
        self.$filters = $('.filters a')
        // URL prefix
        self.url = 'http://www.humblebundle.com/store/product/'

        // Shuffle the games
        games = _.shuffle(games)

        // Initialized methods
        self.renderFilters()
        self.addPlaceholders()
        self.showContributors()

        // Events
        self.dispatchEvents()
    }

    /**
     * Default filters
     * FILTER=whatevs if filter is input, then the value is used in the input filter
     */
    Humble.prototype.renderFilters = function() {
        var self = this
        location.search.slice(1).split('&').forEach(function(search) {
            var params = search.split('=')
            if (params[0] === 'input') {
                self.$input
                .val(params[1])
                .trigger('input')
            } else {
                self.$filters.filter('[href="#' + params[0] + '"]').click()
            }
        })
    }

    Humble.prototype.addPlaceholders = function() {
        self = this
        games.forEach(function(game) {
            self.$el.append($('<span>').data(game))
        })

        // The spans which will be replaced by the iframes
        self.$gamesPlaceholders = $('span',         self.$el)
        self.$gamesElements     = $('span, iframe', self.$el)
    }


    /**
     * Show the contributors, thanks by the way
     */
    Humble.prototype.showContributors = function() {
        $.ajax('https://api.github.com/repos/calvein/humble-games/contributors')
        .done(function(contributors) {
            $('footer')
                .find('b').html(function() {
                    return _(contributors)
                    .map(function(contributor) {
                        if (contributor.login !== 'Calvein')
                            return $('<a>')
                                .attr('href', contributor.html_url)
                                .text(contributor.login)
                                .appendTo('<div>')
                                .parent()
                                .html()
                    })
                    .compact()
                    .value()
                    .join(', ')
                }).end()
            .toggleClass('hidden shown')
        })
    }

    /**
     * Replace a placeholder by an iframe
     * @param  {jQel}  $placeholder  The placeholder which will be replaced
     */
    Humble.prototype.loadIframe = function($placeholder) {
        var self = this
          , $iframe = $('<iframe>')
            .addClass('hidden')
            .attr('src', self.url + $placeholder.data('url'))
            .data($placeholder.data())

        $placeholder.data('isLoading', true)

        $iframe.on('load', function() {
            $iframe
                .addClass('shown')
                .toggleClass('hidden', $placeholder.hasClass('hidden'))

            // Remove the placeholder
            $placeholder.remove()
            // Rebuild the placeholders and verify if they are all transformed to iframes
            self.$gamesPlaceholders = $('span',         self.$el)
            self.$gamesElements     = $('span, iframe', self.$el)

            if (!self.$gamesPlaceholders.length) {
                $(window).off('scroll')
                self.processScroll = function() {}
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
    Humble.prototype.elementInViewport = function(el) {
        var self = this
          , rect = el.getBoundingClientRect()

        return (
            rect.top  >= 0 &&
            rect.left >= 0 &&
            rect.top  <= (window.innerHeight || document.documentElement.clientHeight)
        )
    }

    /**********/
    /* Events */
    /**********/

    /**
     * Function called each time the user scroll, it detect if the elements are in the viewport
     * and if so replace them with the corresponding iframe
     */
    Humble.prototype.processScroll = function() {
        var self = this
        self.$gamesPlaceholders.each(function(i, placeholder) {
            var $placeholder = $(placeholder)
            if (
                self.elementInViewport(placeholder) &&
                !$placeholder.hasClass('hidden') &&
                !$placeholder.data('isLoading')
            ) {
                self.loadIframe($placeholder)
            }
        })
    }

    /**
     * On filter with the input or the platforms buttons
     *
     * @param  {Event}  e  The event
     */
    Humble.prototype.filter = function(e) {
        var self = this
        e.preventDefault()

        var value = self.$input.val()

        $(e.currentTarget).toggleClass('active')
        var platforms = self.$filters.filter('.active').map(function() {
            return this.hash.slice(1)
        }).get()

        self.$gamesElements.each(function(i, placeholder) {
            // By input
            var $placeholder = $(placeholder)
              , nameMatched = false
            if (new RegExp(value, 'i')     .test($placeholder.data('url')))
                nameMatched = true
            else if (new RegExp(value, 'i').test($placeholder.data('description')))
                nameMatched = true
            else if (new RegExp(value, 'i').test($placeholder.data('name')))
                nameMatched = true
            else if (new RegExp(value, 'i').test($placeholder.data('developer')))
                nameMatched = true

            // By platform/DRM
            var supportedPlatforms = $placeholder.data('platform')
            var supportedDRM       = $placeholder.data('drm')
            var supportFilters     = platforms.every(function(platformordrm) {
                return supportedPlatforms[platformordrm] || supportedDRM[platformordrm]
            })

            $placeholder.toggleClass('hidden', !(nameMatched && supportFilters))
        })

        self.processScroll()
    }

    Humble.prototype.dispatchEvents = function() {
        self = this

        self.$input.on('input',   self.filter.bind(self))
        self.$filters.on('click', self.filter.bind(self))

        $(window).on('scroll', self.processScroll.bind(self))
        self.processScroll()
    }

    // Initialize the Humble object
    var humble = new Humble('main')
})
