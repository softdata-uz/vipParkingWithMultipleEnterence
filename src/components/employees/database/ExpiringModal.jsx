import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {TbAlarm} from "react-icons/tb";

import {ChevronRightIcon} from "../../../design-system/icons";
import {ModalShell} from "../../common/ModalShell";
import PlateNumber from "../../common/PlateNumber";
import {EXPIRING_DAYS, formatDate, periodBadge} from "../../../utils/staffPeriod";

/* Ruxsat muddati tugayotgan (EXPIRING_DAYS kun ichida) va o'tgan xodimlar.
   Qator bosilsa — xodim turgan guruh ochiladi (muddatni o'sha yerda uzaytirish mumkin). */

const ExpiringModal = ({open, data, onClose, onOpenGroup}) => {
    const {t} = useTranslation();
    const [tab, setTab] = useState('expiring');
    const rows = data?.[tab] || [];

    // ochilganda — ma'lumoti bor yorliq: tugayotganlar bo'lmasa, muddati o'tganlar
    useEffect(() => {
        if (open) setTab(data?.expiring.length || !data?.expired.length ? 'expiring' : 'expired');
    }, [open, data]);

    const tabs = [
        {value: 'expiring', label: t("Tugayotgan"), count: data?.expiring.length ?? 0},
        {value: 'expired', label: t("Muddati o'tgan"), count: data?.expired.length ?? 0},
    ];

    return (
        <ModalShell
            open={open}
            onClose={onClose}
            size="lg"
            tone="warning"
            icon={<TbAlarm size={22} strokeWidth={1.6}/>}
            title={t("Ruxsat muddati")}
            subtitle={t("{{count}} kun ichida tugaydigan va muddati o'tgan xodimlar", {count: EXPIRING_DAYS})}
            footer={
                <button type="button" className="dsm-btn dsm-btn--secondary" onClick={onClose}>
                    {t("Yopish")}
                </button>
            }
        >
            <div className="page_seg exp_tabs" role="tablist">
                {tabs.map(item => (
                    <button key={item.value} type="button" role="tab" aria-selected={tab === item.value}
                            className={`page_seg_item${tab === item.value ? ' is-active' : ''}`}
                            onClick={() => setTab(item.value)}>
                        {item.label}
                        <span className="page_seg_count">{item.count}</span>
                    </button>
                ))}
            </div>

            {rows.length === 0 ? (
                <p className="exp_empty">{t("Ma'lumot topilmadi")}</p>
            ) : (
                <ul className="exp_list">
                    {rows.map(item => {
                        const badge = periodBadge(item.period, t);
                        return (
                            <li key={item.id}>
                                <button type="button" className="exp_row" onClick={() => onOpenGroup(item.group)}>
                                    <span className="exp_row_main">
                                        <span className="exp_row_name">{item.fullname || '—'}</span>
                                        <span className="exp_row_group">
                                            {item.group?.name} · {t("Tugash sanasi")}: {formatDate(item.to_date)}
                                        </span>
                                    </span>
                                    <span className="exp_row_plate">
                                        <PlateNumber value={item.vehicle_number}/>
                                    </span>
                                    <span className={`ds-badge ${badge[0]}`}>
                                        <span className="ds-badge__dot"/>{badge[1]}
                                    </span>
                                    <ChevronRightIcon size={18} className="exp_row_arrow"/>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </ModalShell>
    );
};

export default ExpiringModal;
