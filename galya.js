(function($, window, document){

    // Idea is from
    // https://github.com/louisremi/jquery.transform.js/blob/master/jquery.transform3d.js
    function css3(properties){
        var div = document.createElement('div'),
            style = div.style,
            prefixes = ['O', 'ms', 'Webkit', 'Moz'],
            i = prefixes.length,
            result = {};

        while (i--){
            !$.isArray(properties) && (properties = [properties]);

            $.each(properties, function(key, val){
                var property = val.slice(0,1).toUpperCase() + val.slice(1);
                var prefixed = prefixes[i] + property;
                var tmp = {};

                if (prefixed in style){
                    tmp[val] = prefixed;
                    $.extend(result, tmp);
                }
            });
        }

        div = null;
        return result;
    }

    $.fn.galya = function(args){
        // Default settings
        var settings = {
            // Whether slides will be animated automatically
            autoplay: false,

            // Autoplay duration
            duration: 3000,

            // Whether to pause autoplay on slide hovering
            pauseOnHover: false,

            // slides fadeIn, fadeOut animation speed
            fadeSpeed: 500,

            // thumbnails container left-right scroll
            scrollSpeed: 250,

            // large slide width
            slideWidth: 725,

            // show/bypass description of the slides
            showCaptions: false,

            // caption heading level: 1-6
            headingLevel: 4,

            // caption content wrapping tag: div, p, whatever
            captionContentTag: 'p',

            // preview images width
            thumbnailWidth: 110
        };

        args && $.extend(settings, args);

        this.each(function(){
            new Galya($(this), settings).initialize();
        });

        return this;
    }

    /**
     * Galya gallery class.
     *
     * @constructor
     * @param $container {jQuery} gallery container
     * @param settings {Object} user-provided settings
     */
    function Galya($container, settings){
        //
        var classes = {
            // DIV that wraps all slides
            slidesContainer: 'galya-slides',

            // the slide itself
            slide: 'galya-slide',

            // image inside the slide
            slideImage: 'galya-image',

            // wrapper for the slide description
            slideCaption: 'galya-caption',

            // heading of the slide description
            slideHeading: 'galya-caption-heading',

            // content of the slide description
            slideText: 'galya-caption-content',

            // DIV that wraps all thumbnails
            thumbsContainer: 'galya-thumbnails',

            // scrolling DIV
            thumbsScrollable: 'galya-thumbnails-scrollable',

            // the thumbnail image
            thumbImage: 'galya-thumbnail',

            // 'previous slide' control
            prev: 'galya-prev',

            // active state class
            active: 'active'
        };

        // Cache of the jQuery objects created from the gallery
        // HTML structure and then used by the gallery
        var $objects = {};

        // Some useful internally used properties
        var props = {};

        // Renders the gallery, caches its HTML structure as jQuery objects,
        // assigns events callbacks
        this.initialize = function(){
            $objects.sourceImages = $('> img', $container);

            renderSlidesList();
            renderThumbnailsList();
            renderNavControls();

            $objects.slidesContainer = $('.'+classes.slidesContainer, $container);
            $objects.slides = $('.'+classes.slide, $container);
            $objects.images = $('.'+classes.slideImage, $container);
            $objects.thumbsContainer = $('.'+classes.thumbsContainer, $container);
            $objects.thumbsScrollable = $('.'+classes.thumbsScrollable, $container);
            $objects.thumbs = $('.'+classes.thumbImage, $container);
            $objects.prev = $('.'+classes.prev, $container);

            props.autoplayId = -1;

            activateStage(0);

            // Sets the appropriate heights based on the slide height
            $objects.images.first().load(function(){
                var $this = $(this);

                if ($this.width() > settings.slideWidth)
                    $this.width(settings.slideWidth);

                var imageWidth = $(this).width();
                var imageHeight = $(this).height();

                if (imageWidth < settings.slideWidth)
                    $container.width(imageWidth);
                else
                    $container.width(settings.slideWidth);

                $objects.thumbs.width(settings.thumbnailWidth);

                var containerWidth = $container.width();
                var thumbWidth = getThumbWidth();

                props.visibleThumbs = Math.floor(containerWidth / thumbWidth);
                props.scrollingThumbs = props.visibleThumbs-1;
                props.initialThumbsOffset = thumbWidth * props.scrollingThumbs;
                props.currentThumbsOffset = 0;

                $objects.slidesContainer.height(imageHeight);
                $objects.thumbsContainer.height($objects.thumbs.parent().height());
                $container.height(imageHeight+$objects.thumbsContainer.height());
                $objects.prev.height(imageHeight);

                $container.triggerHandler('galya.loaded');
            });

            // Slide clicked
            $objects.images.on('click', function(ev){
                if ($objects.thumbsScrollable.is(':animated'))
                    return false;

                if (settings.autoplay === true)
                    resetAutoplay();

                activateStage('next');
            });

            // Thumbnail clicked
            $objects.thumbs.on('click', function(ev){
                var $this = $(this);

                if ($this.hasClass(classes.active) || $objects.slides.is(':animated'))
                    return false;

                if (settings.autoplay === true)
                    resetAutoplay();

                var mouseOffset = ev.pageX - $objects.thumbsContainer.offset().left;

                activateStage($this.index(), (mouseOffset > props.initialThumbsOffset));
            });

            // Prev button clicked
            $objects.prev.on('click', function(){
                if ($objects.thumbsScrollable.is(':animated'))
                    return false;

                if (settings.autoplay === true)
                    resetAutoplay();

                activateStage('prev');
            });

            // Autoplay running and pausing
            if (settings.autoplay === true){
                autoplay();

                if (settings.pauseOnHover === true){
                    $objects.slidesContainer.on('mouseenter', function(){
                        clearInterval(props.autoplayId);
                    });

                    $objects.slidesContainer.on('mouseleave', function(){
                        autoplay();
                    });
                }
            }
        };

        // Gets 'valid' attributes from the source image
        function getImageAttrs($image){
            return {
                src:     $image.attr('src'),
                alt:     $image.attr('alt') || '',
                title:   $image.data('title') || '',
                content: $image.data('content') || ''
            }
        }

        function getThumbWidth(){
            return $objects.thumbs.width() + parseInt($objects.thumbs.last().css('margin-left'));
        }

        // Render slides
        function renderSlidesList(){
            var html = '';

            $objects.sourceImages.each(function(idx, image){
                var $image = $(image);
                var attrs = getImageAttrs($image);

                var figureHTML = '<figure class="'+classes.slide+'">'+
                    '<img class="'+classes.slideImage+'" src="'+attrs.src+'" alt="'+attrs.alt+'">';

                if (settings.showCaptions && (attrs.alt || attrs.content)){
                    figureHTML += '<figcaption class="'+classes.slideCaption+'">';

                    if (attrs.title){
                        figureHTML += '<h'+settings.headingLevel+' class="'+classes.slideHeading+'">'+
                            attrs.title+'</h'+settings.headingLevel+'>';
                    }

                    var content = (attrs.content ? attrs.content : attrs.alt);

                    content = '<'+settings.captionContentTag+' class="'+classes.slideText+'">'+
                        content+'</'+settings.captionContentTag+'>';

                    figureHTML += content+'</figcaption>';
                }

                html += figureHTML+'</figure>';
            });

            $container.html('<div class="'+classes.slidesContainer+'">'+html+'</div>');
        }

        // Renders thumbnails for the slides
        function renderThumbnailsList(){
            var html = '';

            $objects.sourceImages.each(function(index, image){
                var $image = $(image);
                var attrs = getImageAttrs($image);

                html += '<img class="'+classes.thumbImage+'" src="'+attrs.src+'" alt="'+attrs.alt+'">';
            });

            $container.append('<div class="'+classes.thumbsContainer+'">'+
                '<div class="'+classes.thumbsScrollable+'">'+html+'</div></div>');
        }

        // Renders navigation controls
        function renderNavControls(){
            $container.append('<div class="'+classes.prev+'"><span>&#x276e;</span></div>');
        }

        // Stage is a simply slide and thumb together
        // Here, it gets a stage by index
        function getStageByIndex(index){
            return {
                slide: getElementByIndex($objects.slides, index),
                thumb: getElementByIndex($objects.thumbs, index)
            }
        }

        // Registers interval based on given duration
        // and triggers slides animation
        function autoplay(){
            props.autoplayId = setInterval(function(){
                $container.stop(true, true);
                activateStage('next');
            }, settings.duration);
        }

        function resetAutoplay(){
            clearInterval(props.autoplayId);
            autoplay();
        }

        // Activates a stage (slide and its thumbnail)
        function activateStage(direction, senderIsPartiallyVisibleThumbnail){
            props.stageIndex = getStageIndexByDirection(direction);
            props.stage = getStageByIndex(props.stageIndex);
            props.oldStageIndex = deactivateStage();

            activateSlide(props.stage.slide);
            activateThumb(props.stage.thumb);
            scrollThumbs(direction, senderIsPartiallyVisibleThumbnail);
        }

        // Sets the slide active
        function activateSlide($slide){
            $slide.fadeIn(settings.fadeSpeed, function(){
                $(this).addClass(classes.active);
            });
        }

        // Sets the thumbnail active
        function activateThumb($thumb){
            $thumb.addClass(classes.active);
        }

        // Sets inactive currently active slide and thumbnail
        function deactivateStage(){
            var index = deactivateSlide();
            deactivateThumb();

            return index;
        }

        // Sets inactive currently active slide
        function deactivateSlide(){
            var $element = getActiveElement($objects.slides);
            var index = 0;

            if ($element.length){
                index = $element.index();

                $element.fadeOut(settings.fadeSpeed, function(){
                    $(this).removeClass(classes.active);
                });
            }

            return index;
        }

        // Sets inactive currently active thumbnail
        function deactivateThumb(){
            var $element = getActiveElement($objects.thumbs);
            var index = 0;

            if ($element.length){
                index = $element.index();
                $element.removeClass(classes.active);
            }

            return index;
        }

        // Performs thumbnails container srolling
        function scrollThumbs(direction, senderIsPartiallyVisibleThumbnail){

            // When we get to the last slide of the gallery
            var endReached = (props.stageIndex == 0 && props.oldStageIndex == $objects.slides.length-1);

            // When we get to the first slide of the gallery
            var startReached = (props.oldStageIndex == 0 && props.stageIndex == $objects.slides.length-1);

            // Index of the current gallery slide.
            // It is used to determine, if the slide is the last or the first visible
            // in a row of the thumbnails, so we need to scroll its container left or right
            var currentIndex = (direction == 'prev' ? props.oldStageIndex : props.stageIndex);

            // Whether the current thumbnail is first
            // or last visible one in a row of the thumbnails
            var isEdge = (currentIndex != 0 && (currentIndex % props.scrollingThumbs == 0));

            // When the last slide of the gallery is reached,
            // we scroll the thumbnails container back to the first slide
            if (endReached){
                props.currentThumbsOffset = 0;
            }
            // Whe the first slide of the gallery is reached,
            // in opposite, we scroll the thumbnails container to the last slide
            else if (startReached){
                props.currentThumbsOffset = -(props.initialThumbsOffset * Math.floor($objects.slides.length/props.visibleThumbs));
            }
            // When we get a thumbnail that is the first or the last visible thumbnail
            // in the current row of thumbnails, we scroll the thumbnails container
            // by direction, determined by the given argument
            else if (isEdge){
                switch(direction){
                    case 'prev':
                        props.currentThumbsOffset += props.initialThumbsOffset;
                        break;

                    case 'next':
                        props.currentThumbsOffset -= props.initialThumbsOffset;
                        break;

                    default:
                        if (props.stageIndex > props.oldStageIndex){
                            props.currentThumbsOffset -= props.initialThumbsOffset;
                        }
                        else {
                            if (settings.autoplay === false){
                                props.currentThumbsOffset += props.initialThumbsOffset;
                            }
                        }
                        break;
                }
            }
            // When we get a thumbnail that is only partially visible
            // (next to the last visibleThumbs stack)
            else if (senderIsPartiallyVisibleThumbnail){
                props.currentThumbsOffset -= props.initialThumbsOffset;
            }

            (props.currentThumbsOffset != props.initialThumbsOffset) && performScrollThumbs();
        }

        // function scrollThumbs(dim)
        function performScrollThumbs(coord, offset){
            var cool = css3(['transition', 'transform']);
            !coord && (coord = 'x');
            !offset && (offset = props.currentThumbsOffset);

            if (cool){
                var style = $objects.thumbsScrollable.get(0).style;
                style[cool.transition] = 'all '+settings.scrollSpeed+'ms linear';

                switch(coord){
                    case 'x':
                        style[cool.transform] = 'translate3d('+offset+'px, 0, 0)';
                        break;

                    case 'y':
                        style[cool.transform] = 'translate3d(0, '+offset+'px, 0)';
                        break;

                    case 'z':
                        style[cool.transform] = 'translate3d(0, 0, '+offset+'px)';
                        break;
                }
            }
            else {
                coord = (coord == 'x' ? 'left' : 'top');
                var animation = {};
                animation[coord] = props.currentThumbsOffset;
                $objects.thumbsScrollable.animate(animation, settings.scrollSpeed);
            }
        }

        // Gets a slide that is currently being shown
        function getActiveElement($collection){
            return $collection.filter(function(idx, el){
                return $(el).hasClass(classes.active);
            }).first();
        }

        // Filters a collection by given index
        function getElementByIndex($collection, index){
            return $collection.filter(function(idx, el){
                return $(el).index() == index;
            }).first();
        }

        // Guesses the following stage index by the given direction.
        // Stops from overflowing the number of the gallery slides
        // by 'flushing' the index to zero or the number of the slides.
        function getStageIndexByDirection(direction){
            var activeIndex = getActiveElement($objects.slides).index();

            switch(direction){
                case 'prev':
                    --activeIndex;
                    break;

                case 'next':
                    ++activeIndex;
                    break;

                default:
                    activeIndex = direction; // if the value is integer
                    break;
            }

            var min = 0;
            var max = $objects.slides.length-1;

            if (activeIndex > max){
                activeIndex = min;
            }
            else if (activeIndex < min){
                activeIndex = max;
            }

            return activeIndex;
        }
    }
})(jQuery, window, document);