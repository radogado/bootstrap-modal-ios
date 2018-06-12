var BootstrapModaliOS = (function(){

	var disableBodyScroll = (function () { // 🔗 Thijs Huijssoon https://gist.github.com/thuijssoon
	
	    /**
	     * Private variables
	     */
	    var _selector = false,
	        _element = false,
	        _clientY;
	
	    /**
	     * Polyfills for Element.matches and Element.closest
	     */
	    if (!Element.prototype.matches)
	        Element.prototype.matches = Element.prototype.msMatchesSelector ||
	        Element.prototype.webkitMatchesSelector;
	
	    if (!Element.prototype.closest)
	        Element.prototype.closest = function (s) {
	            var ancestor = this;
	            if (!document.documentElement.contains(el)) return null;
	            do {
	                if (ancestor.matches(s)) return ancestor;
	                ancestor = ancestor.parentElement;
	            } while (ancestor !== null);
	            return el;
	        };
	
	    /**
	     * Prevent default unless within _selector
	     * 
	     * @param  event object event
	     * @return void
	     */
	    var preventBodyScroll = function (event) {
	        if (false === _element || !event.target.closest(_selector)) {
	            event.preventDefault();
	        }
	    };
	
	    /**
	     * Cache the clientY co-ordinates for
	     * comparison
	     * 
	     * @param  event object event
	     * @return void
	     */
	    var captureClientY = function (event) {
	        // only respond to a single touch
	        if (event.targetTouches.length === 1) { 
	            _clientY = event.targetTouches[0].clientY;
	        }
	    };
	
	    /**
	     * Detect whether the element is at the top
	     * or the bottom of their scroll and prevent
	     * the user from scrolling beyond
	     * 
	     * @param  event object event
	     * @return void
	     */
	    var preventOverscroll = function (event) {
	
	        // only respond to a single touch
		    if (event.targetTouches.length !== 1) {
		    	return;
		    }
	
		    var clientY = event.targetTouches[0].clientY - _clientY;
	
		    // The element at the top of its scroll,
		    // and the user scrolls down
		    if (_element.scrollTop === 0 && clientY > 0) {
		        event.preventDefault();
		    }
	
		    // The element at the bottom of its scroll,
		    // and the user scrolls up
			// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
			if ((_element.scrollHeight - _element.scrollTop <= _element.clientHeight) && clientY < 0) {
		        event.preventDefault();
		    }
	
	    };
	
	    /**
	     * Disable body scroll. Scrolling with the selector is
	     * allowed if a selector is porvided.
	     * 
	     * @param  boolean allow
	     * @param  string selector Selector to element to change scroll permission
	     * @return void
	     */
	    return function (allow, selector) {
	    	if (typeof selector !== "undefined") {
		        _selector = selector;
		        _element = document.querySelector(selector);
	    	}
	
	        if (true === allow) {
	        	if (false !== _element) {
		            _element.addEventListener('touchstart', captureClientY, { passive: false });
		            _element.addEventListener('touchmove', preventOverscroll, { passive: false });
	        	}
	            document.body.addEventListener("touchmove", preventBodyScroll, { passive: false });
	        } else {
	        	if (false !== _element) {
		            _element.removeEventListener('touchstart', captureClientY, { passive: false });
		            _element.removeEventListener('touchmove', preventOverscroll, { passive: false });
		        }
	          document.body.removeEventListener("touchmove", preventBodyScroll, { passive: false });
	        }
	    };
	}());
	
	function adjustModal(e) {
			
		var modal = $('.modal.show')[0];
		var actual_viewport = window.innerHeight;
		var offset_y = modal.getBoundingClientRect().y;
	
		modal.style.top = 0;
		modal.style.bottom = 0;
		var screen_height = modal.scrollHeight;
	
		if (!navigator.userAgent.match(/(iPod|iPhone|iPad)/i) || Math.abs(window.orientation) !== 90 || actual_viewport === screen_height) { // Only for mobile Safari in landscape mode, when the modal height doesn't match the actual viewport
			
			return;
	
		}
		
		if (typeof e !== 'undefined') { // On resize event (toolbars have appeared by tapping at the top or bottom area
	
			modal.style.top = (0 - offset_y) + 'px';
			modal.style.bottom = (screen_height - actual_viewport + offset_y) + 'px';
			
		} else {
		
			if (actual_viewport <= screen_height) { // modal is cropped, adjust its top/bottom
				
				if ((document.body.scrollHeight + document.body.getBoundingClientRect().y) === actual_viewport) { // page scrolled at the bottom
	
					modal.style.bottom = 0;
					modal.style.top = (screen_height - actual_viewport) + 'px';
	
				} else {
	
					modal.style.top = 0;
					modal.style.bottom = (screen_height - actual_viewport) + 'px';
				}
			
			}
		
			if (modal.getBoundingClientRect().y !== 0) { // A little off
	
				modal.style.top = (parseInt(modal.style.top) - modal.getBoundingClientRect().y) + 'px';
				modal.style.bottom = (parseInt(modal.style.bottom) + modal.getBoundingClientRect().y) + 'px';
				
			}
			
			if ((actual_viewport + parseInt(modal.style.top) + parseInt(modal.style.bottom)) > screen_height) { // Extra bug when scrolled near the bottom
				
				modal.style.bottom = (screen_height - actual_viewport - parseInt(modal.style.top)) + 'px';
				
			}
		
		}
		
	}
	
	$('.modal').each(function () {
		
		var previousScrollY = window.scrollY;
	
		$(this).on('shown.bs.modal', function (e) {
			
			var active_modal = '.modal.show .modal-dialog';
			$(active_modal)[0].scrollTop = 0;
			document.documentElement.classList.add('no-scroll');
			disableBodyScroll(true, active_modal);
			previousScrollY = window.scrollY;
			adjustModal();
			window.addEventListener('resize', adjustModal, { passive: false });
			$(active_modal).on('click', function (e) {
	
				if ($(e.target).hasClass('modal-dialog')) {
					
					$(e.target.parentNode).modal('hide');
					
				}
				
			});
		
		});
		
		$(this).on('hidden.bs.modal', function (e) {
		
			document.documentElement.classList.remove('no-scroll');
			$('body').animate({scrollTop: previousScrollY}, 200);
			disableBodyScroll(false, '.modal-dialog');
			window.removeEventListener('resize', adjustModal, { passive: false });
		
		});
		
	});

})();
