import React, { useState } from 'react';
import { DatePicker, Button } from 'antd';
import dayjs from 'dayjs';

const Testp = () => {
    const [editMode, setEditMode] = useState(false);
    const [date, setDate] = useState(null);

    const handleSave = () => {
        setEditMode(false);
        console.log('Saved date:', date ? date.format('YYYY-MM-DD') : 'No date selected');
    };

    return (
        <div style={{ padding: 24 }}>
            {editMode ? (
                <>
                    <DatePicker
                        value={date}
                        onChange={(value) => setDate(value)}
                        format="YYYY-MM-DD"
                    />
                    <Button type="primary" onClick={handleSave} style={{ marginLeft: 8 }}>
                        Save
                    </Button>
                </>
            ) : (
                <>
          <span>
            <b>Date:</b> {date ? date.format('YYYY-MM-DD') : 'No date selected'}
          </span>
                    <Button type="link" onClick={() => setEditMode(true)} style={{ marginLeft: 8 }}>
                        Edit
                    </Button>
                </>
            )}
        </div>
    );
};

export default Testp;
