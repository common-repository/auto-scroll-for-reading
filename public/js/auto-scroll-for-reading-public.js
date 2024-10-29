(function ($) {
    'use strict';

    function WPGAutoScrollPlugin(options){
    	this.options = options | {};
        this.wN2scRl;
        this.setTimeout;
        this.timer;
        this.timerX = 145;
        this.prevScrollHeight = document.documentElement.scrollTop + Math.floor( window.innerHeight * 0.7, 1 );
        this.addScrollHeight = Math.floor( window.innerHeight * 0.7, 1 );
        this.userHasScrolled = false;
        this.speed = 1;

        this.timerSVG = '<svg class="wpg-progress-circle" width="50px" height="50px" xmlns="https://www.w3.org/2000/svg"><circle class="wpg-progress-circle-back" cx="25" cy="25" r="23"></circle><circle class="wpg-progress-circle-prog" cx="25" cy="25" r="23"></circle></svg>';

        this.init();

        return this;
    }

    WPGAutoScrollPlugin.prototype.init = function() {
        var _this = this;

      	_this.createButtons();

        window.onmousewheel = function (e) {
            _this.userHasScrolled = true;
            _this.resetScroll();
            _this.prevScrollHeight = document.documentElement.scrollTop + Math.floor( window.innerHeight * 0.7, 1 );
        }
        window.ontouchmove = function (e) {
            _this.userHasScrolled = true;
            _this.resetScroll();
            _this.prevScrollHeight = document.documentElement.scrollTop + Math.floor( window.innerHeight * 0.7, 1 );
        }
        var clickedOnScrollbar = function(mouseX){
            if( $(window).width() <= mouseX ){
                return true;
            }else{
                return false;
            }
        }

        document.addEventListener('mousedown', function(e) {
            if( clickedOnScrollbar(e.clientX) ){
                _this.userHasScrolled = true;
                _this.resetScroll();
            }
        }, false);

        document.addEventListener('mouseup', function(e) {
            if( clickedOnScrollbar(e.clientX) ){
                _this.prevScrollHeight = document.documentElement.scrollTop + Math.floor( window.innerHeight * 0.7, 1 );
            }
        }, false);
    };

    WPGAutoScrollPlugin.prototype.createButtons = function() {
    	var _this = this;
        document.addEventListener('DOMContentLoaded', function(){
            var body = document.body,
                html = document.documentElement;

            var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );

            _this.prevScrollHeight = html.scrollTop + Math.floor( window.innerHeight * 0.7, 1 );

        	var buttonWrap = document.createElement('div');
            buttonWrap.setAttribute('data-active', 'false');
        	buttonWrap.classList.add('wpg-autoscroll-buttons-wrap');
            buttonWrap.setAttribute('id', 'wpg-autoscroll-buttons-wrap');

            var button = document.createElement('div');
            button.classList.add('wpg-autoscroll-button');
            button.classList.add('wpg_animate__zoomIn');
            button.setAttribute('id', 'wpg-autoscroll-play-button');
            button.innerHTML = WPGAutoscrollObj.playIcon + _this.timerSVG;


            /*
             * Show scroll with progress bar inth bottom
             */
            // var scrollWidth = document.createElement('div');
            // scrollWidth.classList.add('wpg-autoscroll-scrollwidth-wrap');
            // scrollWidth.setAttribute('id', 'wpg-autoscroll-scrollwidth-wrap');

            // var scrollWidthContent = document.createElement('div');
            // scrollWidthContent.classList.add('wpg-autoscroll-scrollwidth-content');
            // scrollWidthContent.setAttribute('id', 'wpg-autoscroll-scrollwidth-content');

            // scrollWidth.appendChild(scrollWidthContent);

            /*
             * Show scroll with progress bar inth bottom
             */
             
            buttonWrap.appendChild(button);

            if(document.body != null){
                /*
                 * Show scroll with progress bar inth bottom
                 */
               // document.body.appendChild(scrollWidth);
                /*
                 * Show scroll with progress bar inth bottom
                 */
               document.body.appendChild(buttonWrap);
            }


            /*
             * Show scroll with progress bar inth bottom
             */
            // window.addEventListener("scroll", function(e) {
            //     var triangle = document.getElementById('wpg-autoscroll-scrollwidth-content');
            //     var scrollpercent = (document.body.scrollTop + document.documentElement.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
            //     var length = window.innerWidth;
            //     var draw = length * scrollpercent;
              
            //     // Reverse the drawing (when scrolling upwards)
            //     triangle.style.width = ( scrollpercent * 100 ) + '%';
            // }, false);

            /*
             * Show scroll with progress bar inth bottom end
             */

            document.addEventListener('click', function(e){
                if(e.target && e.target.id == 'wpg-autoscroll-play-button'){
                    var pauseButton = document.createElement('div');
                    pauseButton.classList.add('wpg-autoscroll-button');
                    pauseButton.classList.add('wpg_animate__zoomIn');
                    pauseButton.setAttribute('id', 'wpg-autoscroll-stop-button');

                    pauseButton.innerHTML = WPGAutoscrollObj.stopIcon;

                    buttonWrap.appendChild(pauseButton);

                    var speedButton = document.createElement('div');
                    speedButton.classList.add('wpg-autoscroll-button');
                    speedButton.classList.add('wpg_animate__zoomIn');
                    speedButton.setAttribute('id', 'wpg-autoscroll-speed-button');
                    speedButton.setAttribute('data-speed', _this.speed);
                    var speedText = 'x1';
                    if( _this.speed == 1 ){
                        speedText = 'x1';
                    }else if( _this.speed == 2 ){
                        speedText = 'x2';
                    }else if ( _this.speed == 4 ) {
                        speedText = 'x4';
                    }
                    speedButton.innerHTML = WPGAutoscrollObj.fastForwardIcon + '<span>' + speedText + '</span>';

                    buttonWrap.appendChild(speedButton);
                    buttonWrap.setAttribute('data-active', 'true');

                    _this.scrolling( _this.speed );
                    e.target.remove();
                }else if(e.target && e.target.id == 'wpg-autoscroll-stop-button'){
                    _this.resetScroll();
                }else if(e.target && e.target.id == 'wpg-autoscroll-speed-button'){
                    var speed = e.target.getAttribute('data-speed');
                    if( speed == 1 ){
                        _this.scrolling( 2 );
                        _this.speed = 2;
                        e.target.setAttribute('data-speed', '2');
                        // e.target.innerHTML = WPGAutoscrollObj.boltIcon;
                        e.target.innerHTML = WPGAutoscrollObj.fastForwardIcon + '<span>x2</span>';
                    }else if( speed == 2 ){
                        _this.scrolling( 4 );
                        _this.speed = 4;
                        e.target.setAttribute('data-speed', '4');
                        // e.target.innerHTML = WPGAutoscrollObj.flashOnIcon;
                        e.target.innerHTML = WPGAutoscrollObj.fastForwardIcon + '<span>x4</span>';
                    }else if( speed == 4 ){
                        _this.scrolling( 1 );
                        _this.speed = 1;
                        e.target.setAttribute('data-speed', '1');
                        e.target.innerHTML = WPGAutoscrollObj.fastForwardIcon + '<span>x1</span>';
                    }
                }else{
                    _this.resetScroll();
                }

            }, false);

        }, false);
    }

    WPGAutoScrollPlugin.prototype.scrolling = function(speed) {
        var _this = this;
        _this.doScroll( speed );
        if( _this.userHasScrolled ){
            _this.userHasScrolled = false;
        }
    };

    WPGAutoScrollPlugin.prototype.resetScroll = function() {
        var wN2scRl;
        var _this = this;
        var wN2scRl;

        var Sa5gNA9k = function(){
            clearTimeout( _this.wN2scRl );
            clearTimeout( _this.setTimeout );
            clearTimeout( _this.timer );
            var buttonWrap = document.getElementById('wpg-autoscroll-buttons-wrap');
            var active = buttonWrap ? buttonWrap.getAttribute('data-active') : 'false';

            if(active == 'true'){
                var button = document.createElement('div');
                button.classList.add('wpg-autoscroll-button');
                button.classList.add('wpg_animate__zoomIn');
                button.setAttribute('id', 'wpg-autoscroll-play-button');

                button.innerHTML = WPGAutoscrollObj.playIcon + _this.timerSVG;


                buttonWrap.appendChild(button);
                document.getElementById('wpg-autoscroll-stop-button').remove();
                document.getElementById('wpg-autoscroll-speed-button').remove();
                buttonWrap.setAttribute('data-active', 'false');
            }

            var y = document.querySelector('.wpg-progress-circle');
            if( y ){
                y.style.display = 'none';
            }
        }

        document.onkeydown = Sa5gNA9k;
        Sa5gNA9k();

        if( pageYOffset < document.height - innerHeight ){
            window.scrollBy(0,0);
        }else{
            Sa5gNA9k();
        }
    }

    WPGAutoScrollPlugin.prototype.doScroll = function(speed) {
        var _this = this;
        clearTimeout( _this.wN2scRl );
        clearTimeout( _this.setTimeout );
        clearTimeout( _this.timer );

        // speed = 1;
        _this.wN2scRl = setInterval(function () {
            document.documentElement.scrollTop += speed;
            if( window.scrollY + 10 >= _this.prevScrollHeight ){
                _this.prevScrollHeight += _this.addScrollHeight;
                _this.resetScroll();
                var time = (_this.addScrollHeight / 100).toFixed(1);
                time = parseFloat(time);

                _this.timerX = 145;
                var y = document.querySelector('.wpg-progress-circle');
                var x = document.querySelector('.wpg-progress-circle-prog');
                            y.style.display = 'none';

                var timeN = (time * 1000)/29;

                _this.setTimeout = setTimeout(function(){
                    document.getElementById('wpg-autoscroll-play-button').click();
                }, time * 1000 + timeN + 700 );

                _this.timer = setInterval(function(){
                    y.style.display = 'block';
                    x.style.strokeDasharray = _this.timerX + ' 999';
                    if( _this.timerX <= 0 ){
                        setTimeout(function(){
                            y.style.display = 'none';
                        }, 700);
                        clearInterval( _this.timer );
                    }
                    _this.timerX -= 5;
                }, timeN );

            }
            if ( ( window.innerHeight + window.scrollY ) >= document.body.offsetHeight ) {
                _this.resetScroll();
                _this.prevScrollHeight = document.documentElement.scrollTop + Math.floor( window.innerHeight * 0.7, 1 );
            }
        }, 1 );
    }

    new WPGAutoScrollPlugin();

})(jQuery);