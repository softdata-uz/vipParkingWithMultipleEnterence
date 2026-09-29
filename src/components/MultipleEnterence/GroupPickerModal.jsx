import React, {useState} from "react";
import {useTranslation} from "react-i18next";

import {CameraIcon, CheckIcon, GridIcon, InboxIcon, TrashIcon} from "../../design-system/icons";
import {ModalShell} from "../common/ModalShell";

/* Oynaga kamera guruhini biriktirish.
   Tanlash mumkin: hech bir oynada bo'lmagan guruhlar (viewer = 0) va ko'rinmay qolgan
   oynalardagi guruhlar (oynalar soni kamaytirilganda o'sha oynalar yashirinadi, guruh esa
   serverda shu oynaga bog'liqligicha qoladi) — ularni tanlash guruhni shu oynaga ko'chiradi. */
export const GroupPickerModal = ({open, slot, current, groups, visibleCount, onClose, onPick}) => {
    const {t} = useTranslation();
    const [busyId, setBusyId] = useState(null);

    const options = (groups || []).filter(g =>
        g.id !== current?.id && (!g.viewer || g.viewer > visibleCount));

    const pick = async (group) => {
        if (busyId) return;
        setBusyId(group.id);
        try {
            await onPick(group);
        } finally {
            setBusyId(null);
        }
    };

    return (
        <ModalShell
            open={open}
            onClose={onClose}
            size="sm"
            icon={<GridIcon size={22}/>}
            title={current ? t("Guruhni almashtirish") : t("Guruh biriktirish")}
            subtitle={t("{{n}}-oynada qaysi kamera guruhining hodisalari ko'rinsin?", {n: slot})}
            footer={
                <button type="button" className="dsm-btn dsm-btn--secondary" onClick={onClose}>
                    {t("Bekor qilish")}
                </button>
            }
        >
            {options.length ? (
                <div className="lv_pick_list" role="listbox" aria-label={t("Kamera guruhlari")}>
                    {options.map(group => (
                        <button key={group.id} type="button" role="option" aria-selected="false"
                                className={`lv_pick${busyId === group.id ? ' is-busy' : ''}`}
                                disabled={Boolean(busyId)} onClick={() => pick(group)}>
                            <span className="lv_pick_icon"><CameraIcon size={18}/></span>
                            <span className="lv_pick_text">
                                <span className="lv_pick_name">{group.name}</span>
                                <span className="lv_pick_hint">
                                    {group.viewer
                                        ? t("{{n}}-oynada, hozir ko'rinmaydi", {n: group.viewer})
                                        : t("Bo'sh")}
                                </span>
                            </span>
                            {busyId === group.id
                                ? <span className="lv_spinner" aria-hidden="true"/>
                                : <span className="lv_pick_check"><CheckIcon size={16}/></span>}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="lv_pick_empty">
                    <span className="lv_empty_icon"><InboxIcon size={22}/></span>
                    <p>{t("Bo'sh kamera guruhi qolmadi")}</p>
                    <span>{t("Barcha guruhlar oynalarga biriktirilgan. Yangi guruhni tizimga kirib, Sozlamalar bo'limida qo'shing.")}</span>
                </div>
            )}
        </ModalShell>
    );
};

/* Guruhni oynadan olib tashlashni tasdiqlash — guruh o'chmaydi, faqat oynadan ajraladi */
export const RemoveGroupModal = ({open, slot, group, busy, onClose, onConfirm}) => {
    const {t} = useTranslation();
    return (
        <ModalShell
            open={open}
            onClose={onClose}
            size="sm"
            tone="danger"
            icon={<TrashIcon size={22}/>}
            title={t("Oynadan olib tashlash")}
            subtitle={
                <>
                    {group?.name ? <b className="dsm__name">{group.name}</b> : null}
                    {t("guruhi {{n}}-oynadan olib tashlanadi. Guruh o'chmaydi — uni istalgan oynaga qayta biriktirish mumkin.", {n: slot})}
                </>
            }
            footer={
                <>
                    <button type="button" className="dsm-btn dsm-btn--secondary" onClick={onClose}>
                        {t("Bekor qilish")}
                    </button>
                    <button type="button" className="dsm-btn dsm-btn--destructive" onClick={onConfirm} disabled={busy}>
                        {t("Olib tashlash")}
                    </button>
                </>
            }
        />
    );
};
