import uzUZ from 'antd/locale/uz_UZ';
import ruRU from 'antd/locale/ru_RU';
import enUS from 'antd/locale/en_US';
import dayjs from 'dayjs';
import 'dayjs/locale/uz';          // o'zbekcha (kirill) oy/hafta nomlari
import 'dayjs/locale/uz-latn';     // o'zbekcha (lotin)
import 'dayjs/locale/ru';

/* Ilova tili -> antd komponentlari (DatePicker, Pagination, Image preview...) va dayjs tili.
   antd'da o'zbekcha faqat lotinda bor (uz_UZ); kirill uchun shu asosda taqvim matnlari almashtiriladi.
   DatePicker oy/hafta nomlarini dayjs'dan oladi — `lang.locale` qaysi dayjs tilini ishlatishni bildiradi. */

const withPicker = (base, dayjsLocale, lang = {}) => ({
    ...base,
    DatePicker: {
        ...base.DatePicker,
        lang: {...base.DatePicker.lang, locale: dayjsLocale, ...lang},
    },
    Calendar: {
        ...base.Calendar,
        lang: {...base.Calendar.lang, locale: dayjsLocale, ...lang},
    },
});

const CYRILLIC_PICKER = {
    today: 'Бугун',
    now: 'Ҳозир',
    backToToday: 'Бугунга қайтиш',
    ok: 'OK',
    clear: 'Тозалаш',
    month: 'Ой',
    year: 'Йил',
    timeSelect: 'Вақтни танлаш',
    dateSelect: 'Санани танлаш',
    monthSelect: 'Ойни танлаш',
    yearSelect: 'Йилни танлаш',
    placeholder: 'Санани танланг',
    rangePlaceholder: ['Бошланиш санаси', 'Тугаш санаси'],
};

const LOCALES = {
    'uz': {antd: withPicker(uzUZ, 'uz-latn'), dayjs: 'uz-latn', html: 'uz'},
    'uz-Cyrl': {antd: withPicker(uzUZ, 'uz', CYRILLIC_PICKER), dayjs: 'uz', html: 'uz-Cyrl'},
    'ru': {antd: ruRU, dayjs: 'ru', html: 'ru'},
    'en': {antd: enUS, dayjs: 'en', html: 'en'},
};

/** Tilni qo'llaydi (dayjs + <html lang>) va antd uchun locale obyektini qaytaradi */
export const applyLocale = (lang) => {
    const entry = LOCALES[lang] || LOCALES.uz;
    dayjs.locale(entry.dayjs);
    // <html lang> to'g'ri bo'lmasa brauzer sahifani boshqa tilda deb o'ylab, tarjima qilishni taklif qiladi
    document.documentElement.lang = entry.html;
    return entry.antd;
};
