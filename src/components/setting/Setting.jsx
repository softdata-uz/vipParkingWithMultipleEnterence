import React from 'react';
import {useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";

import {CameraIcon, GridIcon, ShieldIcon} from "../../design-system/icons";
import AdminsTab from "./AdminsTab";
import CamerasTab from "./CamerasTab";
import CameraGroupsTab from "./CameraGroupsTab";

import '../../design-system/ui.css';
import '../../styles/table-cells.css';
import '../../styles/role-badge.css';
import '../../styles/page.css';
import './setting.css';

/* Sozlamalar — Adminlar, Kameralar, Kamera guruhlari.
   Tanlangan bo'lim manzilda (?tab=...) — sahifa yangilanganda ham shu bo'limda qoladi. */

export const SETTING_TABS = [
    {value: 'admins', label: "Adminlar", Icon: ShieldIcon},
    {value: 'cameras', label: "Kameralar", Icon: CameraIcon},
    {value: 'groups', label: "Kamera guruhlari", Icon: GridIcon},
];

/** Bo'limlar almashtirgichi — har bir bo'lim uni jadval ustidagi toolbar'da chizadi (Hisobotdagi davrlar kabi) */
export const SettingTabs = ({value, onChange}) => {
    const {t} = useTranslation();
    return (
        <div className="page_seg set_tabs" role="tablist" aria-label={t("Sozlamalar")}>
            {SETTING_TABS.map(({value: v, label, Icon}) => (
                <button key={v} type="button" role="tab" aria-selected={value === v}
                        className={`page_seg_item${value === v ? ' is-active' : ''}`}
                        onClick={() => onChange(v)}>
                    <Icon size={16}/>
                    {t(label)}
                </button>
            ))}
        </div>
    );
};

const Setting = () => {
    const [params, setParams] = useSearchParams();
    const tab = SETTING_TABS.some(x => x.value === params.get('tab')) ? params.get('tab') : 'admins';
    const onTab = (next) => setParams(next === 'admins' ? {} : {tab: next});

    const tabs = <SettingTabs value={tab} onChange={onTab}/>;

    if (tab === 'cameras') return <CamerasTab tabs={tabs}/>;
    if (tab === 'groups') return <CameraGroupsTab tabs={tabs}/>;
    return <AdminsTab tabs={tabs}/>;
};

export default Setting;
