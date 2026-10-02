import {useEffect} from 'react';
import './globalTooltip.css';

/* Butun ilova uchun bitta tooltip — brauzerning oddiy `title` oynachasi o'rniga.
   Komponentlarda hech narsa o'zgarmaydi: `title="..."` yozilsa bo'ldi.
   - hover (yoki klaviatura fokusi) — 450ms dan keyin chiqadi; bir tooltipdan boshqasiga o'tganda darhol;
   - joy bo'lmasa pastga o'tadi, ekran chetidan chiqib ketmaydi, strelka elementga qarab turadi;
   - matn elementning o'zida to'liq ko'rinib tursa (masalan, kesilmagan ism) — ko'rsatilmaydi;
   - hover paytida `title` vaqtincha olib qo'yiladi (brauzer oynachasi chiqmasin), ketganda qaytariladi. */

const SHOW_DELAY = 450;
const SKIP_WINDOW = 400;       // shu vaqt ichida keyingi elementga o'tilsa — kechikishsiz
const GAP = 8;                 // element bilan tooltip orasi
const EDGE = 8;                // ekran chetidan minimal masofa
const ID = 'app-tooltip';

const squash = (s) => (s || '').replace(/\s+/g, '').toLowerCase();

// matn elementda allaqachon to'liq ko'rinib turibdi — tooltip ortiqcha
const isRedundant = (el, value) => {
    if (!squash(el.textContent).includes(squash(value))) return false;
    const overflow = el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1;
    return !overflow;
};

const GlobalTooltip = () => {
    useEffect(() => {
        const tip = document.createElement('div');
        tip.id = ID;
        tip.className = 'gtip';
        tip.setAttribute('role', 'tooltip');
        const text = document.createElement('span');
        text.className = 'gtip__text';
        const arrow = document.createElement('span');
        arrow.className = 'gtip__arrow';
        tip.append(text, arrow);
        document.body.appendChild(tip);

        let target = null;
        let stash = '';
        let timer = 0;
        let lastHide = 0;
        let describedBy = false;

        const release = () => {
            if (!target) return;
            // React shu orada yangi title qo'ygan bo'lsa — o'shani qoldiramiz
            if (!target.hasAttribute('title') && stash) target.setAttribute('title', stash);
            if (describedBy) target.removeAttribute('aria-describedby');
            target = null;
            stash = '';
            describedBy = false;
        };

        const hide = () => {
            clearTimeout(timer);
            if (tip.classList.contains('is-open')) lastHide = Date.now();
            tip.classList.remove('is-open');
            release();
        };

        const place = () => {
            const r = target.getBoundingClientRect();
            const tw = tip.offsetWidth;
            const th = tip.offsetHeight;
            let side = 'top';
            let top = r.top - th - GAP;
            if (top < EDGE) {
                side = 'bottom';
                top = r.bottom + GAP;
            }
            const center = r.left + r.width / 2;
            const left = Math.max(EDGE, Math.min(center - tw / 2, window.innerWidth - tw - EDGE));
            tip.dataset.side = side;
            tip.style.left = `${Math.round(left)}px`;
            tip.style.top = `${Math.round(top)}px`;
            arrow.style.left = `${Math.round(Math.max(12, Math.min(center - left, tw - 12)))}px`;
        };

        const show = () => {
            if (!target || !target.isConnected) return hide();
            text.textContent = stash;
            place();
            tip.classList.add('is-open');
            if (!target.hasAttribute('aria-describedby')) {
                target.setAttribute('aria-describedby', ID);
                describedBy = true;
            }
        };

        const grab = (el, delay) => {
            const value = (el.getAttribute('title') || '').trim();
            if (!value) return;
            target = el;
            stash = el.getAttribute('title');
            el.removeAttribute('title');                     // brauzer oynachasi chiqmasin
            if (isRedundant(el, value)) return;              // ortiqcha — umuman ko'rsatilmaydi
            timer = setTimeout(show, Date.now() - lastHide < SKIP_WINDOW ? 0 : delay);
        };

        const onOver = (e) => {
            const node = e.target;
            if (!(node instanceof Element)) return;
            if (target && target.contains(node)) {
                // joriy element ichida — faqat ichki elementning o'z title'i bo'lsa almashadi
                const inner = node.closest('[title]');
                if (!inner || !target.contains(inner)) return;
            }
            const el = node.closest('[title]');
            if (el === target) return;
            hide();
            if (el) grab(el, SHOW_DELAY);
        };

        const onOut = (e) => {
            if (!target) return;
            const to = e.relatedTarget;
            if (to instanceof Node && target.contains(to)) return;
            hide();
        };

        const onFocusIn = (e) => {
            const el = e.target instanceof Element ? e.target.closest('[title]') : null;
            if (!el || el === target) return;
            let visible = false;
            try {
                visible = e.target.matches(':focus-visible');
            } catch {
                visible = false;
            }
            if (!visible) return;                            // sichqoncha bosilgandagi fokus — hover yetarli
            hide();
            grab(el, SHOW_DELAY / 2);
        };

        const onKey = (e) => {
            if (e.key === 'Escape') hide();
        };

        document.addEventListener('mouseover', onOver, true);
        document.addEventListener('mouseout', onOut, true);
        document.addEventListener('focusin', onFocusIn, true);
        document.addEventListener('focusout', hide, true);
        document.addEventListener('pointerdown', hide, true);
        document.addEventListener('keydown', onKey, true);
        window.addEventListener('scroll', hide, true);
        window.addEventListener('resize', hide);
        window.addEventListener('blur', hide);

        return () => {
            hide();
            document.removeEventListener('mouseover', onOver, true);
            document.removeEventListener('mouseout', onOut, true);
            document.removeEventListener('focusin', onFocusIn, true);
            document.removeEventListener('focusout', hide, true);
            document.removeEventListener('pointerdown', hide, true);
            document.removeEventListener('keydown', onKey, true);
            window.removeEventListener('scroll', hide, true);
            window.removeEventListener('resize', hide);
            window.removeEventListener('blur', hide);
            tip.remove();
        };
    }, []);

    return null;
};

export default GlobalTooltip;
