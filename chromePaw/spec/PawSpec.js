describe('Paw', function() {
        var paw;
        var dims;
        var dispatchedEvents = [];
        var listenForEvents = [
            'touchstart',
            'touchend',
            'touchmove',
            'mousedown',
            'mouseup',
            'click',
            'wheel', 'mousewheel', 'DOMMouseScroll'
        ];

        function pushEvent(ev) {
            dispatchedEvents.push(ev);
        }

        function getDispatchedEventTypes() {
            return dispatchedEvents.map(function(evt) {
                return evt.type;
            });
        }

        // distance between two points
        // point: { x, y }

        function distance(point1, point2) {
            var xLength = point2.x - point1.x;
            var yLength = point2.y - point1.y;
            return Math.sqrt(Math.pow(xLength, 2) + Math.pow(yLength, 2));
        }

        function distanceBetweenTouches(event) {
            if (event.touches.length < 2) {
                throw 'at least two touches are needed to measure distance';
            }

            return distance({
                x: event.touches[0].pageX,
                y: event.touches[0].pageY
            }, {
                x: event.touches[1].pageX,
                y: event.touches[1].pageY
            });
        }

        beforeEach(function() {
            paw = new Paw(mockgestures);
            dims = paw.getViewportDimensions();
            dispatchedEvents.length = 0;

            for (var i = 0; i < listenForEvents.length; i++) {
                window.addEventListener(listenForEvents[i], pushEvent);
            }
            touchShield.style.display = 'block';
        });

        afterEach(function() {
            paw.release();
            paw.__mix.reset();
            paw.clearTouchIndicators();
            for (var i = 0; i < listenForEvents.length; i++) {
                window.removeEventListener(listenForEvents[i], pushEvent);
            }
            touchShield.style.display = 'none';
        });

        it('should not set defaults to invalid values', function() {
            paw.setDefaultDuration(100);
            paw.setDefaultDuration(-100);
            expect(paw.getDefaultDuration()).toBe(100);

            paw.setDefaultTouchLocation('center center');
            paw.setDefaultTouchLocation(57);
            expect(paw.getDefaultTouchLocation()).toBe('center center');

            paw.setDefaultDoubleTapDuration(100);
            paw.setDefaultDoubleTapDuration(-100);
            expect(paw.getDefaultDoubleTapDuration()).toBe(100);
        });

        it('should throw exceptions for missing input', function() {
            expect(paw._buildTouches).toThrow();
            expect(function() {
                paw._getElements('.nomatch');
            }).toThrow();
        });

        it('should report viewport size', function() {
            var vd = paw.getViewportDimensions();
            expect(vd).toBeDefined();
            expect(vd.width).toEqual(jasmine.any(Number));
            expect(vd.height).toEqual(jasmine.any(Number));

            // force the other code branch
            window.innerWidth = 0;
            window.innerHeight = 0;
            vd = paw.getViewportDimensions();
            expect(vd).toBeDefined();
            expect(vd.width).toEqual(jasmine.any(Number));
            expect(vd.height).toEqual(jasmine.any(Number));
        });

        it('should mixin an objects methods passed in the constructor', function() {
            expect(paw.mockSync).toBeDefined();
            expect(paw.mockSyncDone).toBeDefined();
            expect(paw.mockAsync).toBeDefined();
            expect(paw.noMixProperty).not.toBeDefined();
            expect(function() {
                var p = new Paw(null);
                p = new Paw(['nope', 5, true, {}]);
                p = new Paw(5);
            }).not.toThrow();
        });
});
