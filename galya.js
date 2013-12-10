(function($, undefined){
    $.fn.galya = function(args){
        // Default settings
        var settings = {
            //animation: 'fade', not implemented
            autoplay: false,

            // fadeIn, fadeOut speed
            fadeSpeed: 500,

            // thumbnails container left-right scroll
            scrollSpeed: 250,

            slideWidth: 725,
            slideHeight: 'auto', //not implemented

            // whether to crop when a slide is larger
            // than its container
            slideCrop: false, //not implemented

            // sides to crop from
            slideCropBy: ['bottom', 'right'], //not implemented

            // caption heading level: 1-6
            headingLevel: 4,

            // caption content wrapping tag: div, p, whatever
            captionContentTag: 'p',

            thumbnailWidth: 110,
            thumbnailHeight: 'auto' //not implemented
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
            $objects.container = $container;
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

            $objects.container.width(settings.slideWidth);
            $objects.thumbs.width(settings.thumbnailWidth);

            var containerWidth = $objects.container.width();
            var thumbWidth = $objects.thumbs.width();
            props.visibleThumbs = Math.floor(containerWidth / thumbWidth);
            var thumbsMarginLeft = parseInt($objects.thumbs.last().css('margin-left')) * (props.visibleThumbs-1);
            props.initialOffset = (thumbWidth * (props.visibleThumbs-1) + thumbsMarginLeft);

            activateStage(0);

            // Sets the appropriate heights based on the slide height
            $objects.images.first().load(function(){
                var imageHeight = $(this).height();

                $objects.slidesContainer.height(imageHeight);
                $objects.thumbsContainer.height($objects.thumbs.parent().height());
                $container.height(imageHeight+$objects.thumbsContainer.height());
                $objects.prev.height(imageHeight);
            });

            // Slide clicked
            $objects.images.on('click', function(ev){
                if ($objects.thumbsScrollable.is(':animated'))
                    return false;

                activateStage('next');
            });

            // Thumbnail clicked
            $objects.thumbs.on('click', function(){
                var $this = $(this);

                if ($this.hasClass(classes.active))
                    return false;

                activateStage($this.index());
            });

            // Prev button clicked
            $objects.prev.on('click', function(){
                if ($objects.thumbsScrollable.is(':animated'))
                    return false;

                activateStage('prev');
            });
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

        // Render slides
        function renderSlidesList(){
            var html = '';

            $objects.sourceImages.each(function(idx, image){
                var $image = $(image);
                var attrs = getImageAttrs($image);

                var figureHTML = '<figure class="'+classes.slide+'">'+
                    '<img class="'+classes.slideImage+'" src="'+attrs.src+'" alt="'+attrs.alt+'">';

                if (attrs.alt || attrs.content){
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

            $objects.container.html('<div class="'+classes.slidesContainer+'">'+html+'</div>');
        }

        // Renders thumbnails for the slides
        function renderThumbnailsList(){
            var html = '';

            $objects.sourceImages.each(function(index, image){
                var $image = $(image);
                var attrs = getImageAttrs($image);

                html += '<img class="'+classes.thumbImage+'" src="'+attrs.src+'" alt="'+attrs.alt+'">';
            });

            $objects.container.append('<div class="'+classes.thumbsContainer+'">'+
                '<div class="'+classes.thumbsScrollable+'">'+html+'</div></div>');
        }

        // Renders navigation controls
        function renderNavControls(){
            $objects.container.append('<div class="'+classes.prev+'"><span>&#x276e;</span></div>');
        }

        // Stage is a simply slide and thumb together
        // Here, it gets a stage by index
        function getStageByIndex(index){
            return {
                slide: getElementByIndex($objects.slides, index),
                thumb: getElementByIndex($objects.thumbs, index)
            }
        }

        // Activates a stage (slide and its thumbnail)
        function activateStage(direction){
            var $stage = getStageByIndex(getStageIndexByDirection(direction));
            props.stageIndex = $stage.slide.index();
            props.oldStageIndex = deactivateStage();

            activateSlide($stage.slide);
            activateThumb($stage.thumb);
            scrollThumbs(direction);
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
            deactivateSlide();
            return deactivateThumb();
        }

        // Sets inactive currently active slide
        function deactivateSlide(){
            var $element = getActiveElement($objects.slides);
            var index = $element.index();

            $element.fadeOut(settings.fadeSpeed, function(){
                $(this).removeClass(classes.active);
            });

            return index;
        }

        // Sets inactive currently active thumbnail
        function deactivateThumb(){
            var $element = getActiveElement($objects.thumbs);
            var index = $element.index();

            $element.removeClass(classes.active);

            return index;
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

        // Performs thumbnails container srolling
        function scrollThumbs(direction){

            // When we get to the last slide of the gallery
            var endReached = (props.stageIndex == 0 && props.oldStageIndex == $objects.slides.length-1);

            // When we get to the first slide of the gallery
            var startReached = (props.oldStageIndex == 0 && props.stageIndex == $objects.slides.length-1);

            // Determines direction of the thumbnails container animation
            var sign = '';

            // Index of the current gallery slide.
            // It is used to determine, if the slide is the last or the first visible
            // in a row of the thumbnails, so we need to scroll its container left or right.
            var currentIndex = null;

            switch(direction){
                case 'prev':
                    sign = '+=';
                    currentIndex = props.oldStageIndex;
                    break;

                case 'next':
                    sign = '-=';
                    currentIndex = props.stageIndex;
                    break;

                default:
                    sign = (props.stageIndex > props.oldStageIndex ? '-=' : '+=');
                    currentIndex = props.stageIndex;
                    break;
            }

            var isLastOrFirstVisible = (currentIndex != 0 && (currentIndex % (props.visibleThumbs-1) == 0));

            // When the last slide of the gallery is reached,
            // we scroll the thumbnails container back to the first slide
            if (endReached){
                $objects.thumbsScrollable.animate({ marginLeft: 0 }, settings.scrollSpeed);
            }
            // Whe the first slide of the gallery is reached,
            // in opposite, we scroll the thumbnails container to the last slide
            else if (startReached){
                $objects.thumbsScrollable.animate({
                    marginLeft: -(props.initialOffset * ($objects.slides.length/props.visibleThumbs))
                }, settings.scrollSpeed);
            }
            // When we get a thumbnail that is the first or the last visible
            // in the current stack of thumbnails, we scrool the thumbnails container
            // by direction, determined by the sign
            else if (isLastOrFirstVisible){
                $objects.thumbsScrollable.animate({ marginLeft: sign+props.initialOffset }, settings.scrollSpeed);
            }
        }
    }
})(jQuery);