var TimeLine = (function () {
    
    var TimeLine = function (target, options) {
        this.data = options.data.changes;
        this.target = target;
        this.title = options.title || '更新日志';
        this.init();
        //配置主题
        if (options.theme) {
            this.setTheme(options.theme);
        }
    };

    //用于配置主题色彩.
    TimeLine.classNames = {
        "TL_WRAPPER": "tl_wrapper",
        "TL_HEADER": "tl_header",
        "TL_BODY": "tl_body",
        "TL_ITEM": "tl_item",
        "TL_TIME": "tl_time",
        "TL_ICON": "tl_icon",
        "TL_TEXT": "tl_text",
        "TL_FRONT_BOLD": "tl_b",
        "TL_FRONT_BOLD2": "tl_bo",
        "TL_P": "tl_p",
        "TL_SPAN": "tl_span"
    }

    TimeLine.html = function () {
        //创建html
        var tl_class = TimeLine.classNames;
        var _html = create(tl_class.TL_WRAPPER);
        var header = create(tl_class.TL_HEADER);
        header.textContent = this.title;
        var body = create(tl_class.TL_BODY, 'ul');
        var urlReg = /https?\:\/\/[\w\-]+(\.[\w\-\@\%\/\&\?]+)(\.[\w\/]+)/;
        for (var i = 0, l = this.data.length; i < l; i++) {
            var data = this.data[i];
            var item = create(tl_class.TL_ITEM, 'li');
            var time = create(tl_class.TL_TIME);
            time.textContent = data.date;
            var icon = create(tl_class.TL_ICON);
            //TODO: 点击icon收缩展开item;
            // icon.onclick = function () {
            //     console.log(this.parentNode.offsetHeight);
            //     var h = this.parentNode.offsetHeight;
            // }
            var content = create(tl_class.TL_TEXT);
            if (data.items.length < 2) {
                var txt = data.items[0];
                var strong = create(tl_class.TL_FRONT_BOLD, 'strong');
                var p = create(tl_class.TL_P, 'p');
                if (txt.indexOf('：') !== -1) {
                    var span = create(tl_class.TL_SPAN, 'span');
                    var front = txt.substr(0, txt.indexOf('：') + 1);
                    var end = txt.substr(txt.indexOf('：') + 1);
                    strong.textContent = front;
                    //提取超链接
                    addUrl(urlReg, end, span);
                    add(p, [strong, span]);
                } else {
                    //提取超链接                    
                    addUrl(urlReg, txt, strong);
                    p.appendChild(strong);
                }
                content.appendChild(p);
            } else {
                for (var j = 0, k = data.items.length; j < k; j++) {
                    var p = create(tl_class.TL_P, 'p');
                    let txt = data.items[j];
                    let strong = create(tl_class.TL_FRONT_BOLD2, 'strong');
                    if (txt.indexOf('：') !== -1) {
                        let front = txt.substr(0, txt.indexOf('：') + 1);
                        let end = txt.substr(txt.indexOf('：') + 1);
                        let span = create(tl_class.TL_SPAN, 'span');
                        //提取超链接                        
                        addUrl(urlReg, end, span);
                        strong.textContent = front;
                        add(p, [strong, span]);
                    } else {
                        //提取超链接                        
                        addUrl(urlReg, txt, strong);
                        p.appendChild(strong);
                    }
                    content.appendChild(p);
                }
            }
            add(item, [time, icon, content]);
            body.appendChild(item);
        }
        add(_html, [header, body]);
        return _html;
    }

    function addUrl(reg, txt, parent) {
        if (reg.exec(txt)) {
            const link = reg.exec(txt)[0];
            let url = create('tl_url', 'a');
            url.href = link;
            url.textContent = link;
            url.setAttribute('target', '_blank');
            let before = txt.substr(0, txt.indexOf(link));
            let beforeSpan = create('', 'span');
            beforeSpan.textContent = before;
            let after = txt.substr(txt.indexOf(link) + link.length);
            let afterSpan = create('', 'span');
            afterSpan.textContent = after;
            add(parent, [beforeSpan, url, afterSpan]);
        } else {
            parent.textContent = txt;
        }
    }

    TimeLine.prototype.setTheme = function (theme) {
        document.body.style.background = theme;

    }

    TimeLine.prototype.init = function () {
        var html = TimeLine.html.call(this);
        var backTop = create('backTop', 'span');
        add(this.target, [html, backTop]);
        this.gotoTop(backTop);

    };

    TimeLine.prototype.gotoTop = function (top) {
        var h = window.innerHeight * .7;
        window.addEventListener('scroll', function (e) {
            e.preventDefault();
            if (window.pageYOffset > h) {
                top.style.display = 'block';
                top.addEventListener('click', toTop);
            } else {
                top.style.display = 'none';
            }
        });

        function toTop() {
            var timer = setInterval(() => {
                var y = document.body.scrollTop || document.documentElement.scrollTop;
                if (y > 0) {
                    var speed = y / 12;
                    document.documentElement.scrollTop -= speed;
                    document.body.scrollTop -= speed;
                } else {
                    clearInterval(timer);
                    top.removeEventListener('click', toTop);
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                }
            }, 10)
        }
    }

    function create(className, type) {
        type = type || 'div';
        var dom = document.createElement(type);
        className && (dom.className = className);
        return dom;
    }

    function add(parent, doms) {
        for (var i = 0, l = doms.length; i < l; i++) {
            if (doms[i]) {
                parent.appendChild(doms[i]);
            }
        }
        return parent;
    }

    return TimeLine;
}());
