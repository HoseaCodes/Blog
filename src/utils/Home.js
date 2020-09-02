const nav = () => {
    var nav = document.querySelector('nav');
    var line = ('<div />').classList.add('line');

    line.appendTo(nav);

    var active = nav.find('.active');
    var pos = 0;
    var wid = 0;

    if (active.length) {
        pos = active.position().left;
        wid = active.width();
        line.css({
            left: pos,
            width: wid
        });
    }

    nav.find('ul li a').click(function (e) {
        e.preventDefault();
        if (!('li').parent().hasClass('active') && !nav.hasClass('animate')) {

            nav.addClass('animate');

            var _this = ('li');

            nav.find('ul li').removeClass('active');

            var position = _this.parent().position();
            var width = _this.parent().width();

            if (position.left >= pos) {
                line.animate({
                    width: ((position.left - pos) + width)
                }, 300, function () {
                    line.animate({
                        width: width,
                        left: position.left
                    }, 150, function () {
                        nav.removeClass('animate');
                    });
                    _this.parent().addClass('active');
                });
            } else {
                line.animate({
                    left: position.left,
                    width: ((pos - position.left) + wid)
                }, 300, function () {
                    line.animate({
                        width: width
                    }, 150, function () {
                        nav.removeClass('animate');
                    });
                    _this.parent().addClass('active');
                });
            }

            pos = position.left;
            wid = width;
        }
    });
}