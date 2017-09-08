import g from './g';

interface Ilog {
    data: any;
    target: HTMLElement;
    title?: string;
    showTool: boolean;
}

interface Ioptions {
    data: any;
    title?: string;
    showTool?: boolean;
}

class TimeLine implements Ilog {
    public data;
    public target;
    public title;
    public showTool;

    static themeColors = [
        { color: "#3a3c48" },
        { color: "#f3eacb" },
        { color: "#f4f7fb" }
    ];

    constructor(target: HTMLElement, options: Ioptions) {
        this.target = target;
        this.data = options.data.changes;
        this.title = options.title || '更新日志';
        this.showTool = options.showTool !== undefined ? options.showTool : true;
        this.init();
    }

    public init(): void {
        const html = TimeLine.html(this);
        const backTop = TimeLine.create('backTop', 'span');
        TimeLine.add(this.target, [html, backTop]);
        this.gotoTop(backTop);
    }

    public setTheme(theme: string): void {
        document.body.style.background = theme;
    }

    public gotoTop(top: HTMLElement): void {
        const h = window.innerHeight * .7;
        window.addEventListener('scroll', e => {
            e.preventDefault();
            if (window.pageYOffset > h) {
                top.style.display = 'block';
                top.addEventListener('click', toTop);
            } else {
                top.style.display = 'none';
            }
        });

        function toTop(): void {
            let timer = setInterval(() => {
                let y = document.body.scrollTop || document.documentElement.scrollTop;
                if (y > 0) {
                    const speed = y / 12;
                    document.documentElement.scrollTop -= speed;
                    document.body.scrollTop -= speed;
                } else {
                    clearInterval(timer);
                    top.removeEventListener('click', toTop);
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                }
            }, 10);
        }
    }

    static classNames = {
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
    };

    static toolbar(): HTMLElement {
        const _ = TimeLine.create;
        const themeColors: Array<any> = TimeLine.themeColors;
        const tool: HTMLElement = _('tl_toolbar', 'span');

        themeColors.map(theme => {

            const span: HTMLElement = _('tl_color', 'span');

            span.style.background = theme.color;

            span.title = '主题';

            span.addEventListener('click', this.setTheme.bind(this, theme));

            tool.appendChild(span);

        });

        return tool;
    }

    static setTheme(theme: { color: string }): void {
        const tl_class = TimeLine.classNames;
        const lastChild: any = document.head.lastChild;
        //优化。添加style标签
        let _style: HTMLElement = TimeLine.create('tl_style', 'style');
        let _color = theme.color === '#3a3c48' ? '#fff' : '#666';
        let str = `body{background: ${theme.color};} 
            .tl_header {background:${theme.color};}            
            .tl_text{color:${_color};}`;
        _style.textContent = str;
        if (lastChild.className && lastChild.className === 'tl_style') {
            lastChild.textContent = str;
        } else {
            document.head.appendChild(_style);
        }
    }

    static html(_this): HTMLElement {
        const tl_class = TimeLine.classNames;
        const _ = TimeLine.create;
        const add = TimeLine.add;
        const addUrl = TimeLine.addUrl;
        const _html = _(tl_class.TL_WRAPPER);
        const header: HTMLElement = _(tl_class.TL_HEADER);
        header.textContent = _this.title;
        if (_this.showTool) {
            const tool = TimeLine.toolbar();
            header.appendChild(tool);
        }
        const body = _(tl_class.TL_BODY, 'ul');
        const urlReg = /https?\:\/\/[\w\-]+(\.[\w\-\@\%\/\&\?]+)(\.[\w\/]+)/;
        for (let i = 0, l = _this.data.length; i < l; i++) {
            const data = _this.data[i];
            const item = _(tl_class.TL_ITEM, 'li');
            const time = _(tl_class.TL_TIME);
            time.textContent = data.date;
            const icon = _(tl_class.TL_ICON);
            //TODO: 点击icon收缩展开item;
            // icon.onclick = function () {
            //     console.log(this.parentNode.offsetHeight);
            //     var h = this.parentNode.offsetHeight;
            // }
            const content = _(tl_class.TL_TEXT);
            if (data.items.length < 2) {
                const txt = data.items[0];
                const strong = _(tl_class.TL_FRONT_BOLD, 'strong');
                const p = _(tl_class.TL_P, 'p');
                if (txt.indexOf('：') !== -1) {
                    const span = _(tl_class.TL_SPAN, 'span');
                    const front = txt.substr(0, txt.indexOf('：') + 1);
                    const end = txt.substr(txt.indexOf('：') + 1);
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
                for (let j = 0, k = data.items.length; j < k; j++) {
                    const p = _(tl_class.TL_P, 'p');
                    const txt = data.items[j];
                    const strong = _(tl_class.TL_FRONT_BOLD2, 'strong');
                    if (txt.indexOf('：') !== -1) {
                        const front = txt.substr(0, txt.indexOf('：') + 1);
                        const end = txt.substr(txt.indexOf('：') + 1);
                        const span = _(tl_class.TL_SPAN, 'span');
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

    static add(parent: HTMLElement, childs: [HTMLElement]): HTMLElement {
        for (let i = 0, l = childs.length; i < l; i++) {
            if (childs[i]) {
                parent.appendChild(childs[i]);
            }
        }

        return parent;
    }

    static create(className: string, type: string = 'div'): HTMLElement {
        const dom = document.createElement(type);
        className && (dom.className = className);
        return dom;
    }

    static addUrl(reg: RegExp, txt: string, parent: HTMLElement): void {
        if (reg.exec(txt)) {
            const link = reg.exec(txt)[0];
            const url: HTMLElement = TimeLine.create('tl_url', 'a');
            url.textContent = link;
            url.setAttribute('href', link);
            url.setAttribute('target', '_blank');
            let before = txt.substr(0, txt.indexOf(link));
            let beforeSpan = TimeLine.create('', 'span');
            beforeSpan.textContent = before;
            let after = txt.substr(txt.indexOf(link) + link.length);
            let afterSpan = TimeLine.create('', 'span');
            afterSpan.textContent = after;
            TimeLine.add(parent, [beforeSpan, url, afterSpan]);
        } else {
            parent.textContent = txt;
        }
    }
};

//兼容多终端
g.TimeLine = TimeLine;