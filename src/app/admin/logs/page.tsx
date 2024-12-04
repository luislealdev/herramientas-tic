'use client';

import React from 'react';
import { LogsTable } from '@/components/admin/LogsTable';

const LogsPage = () => {
    return (
        <div style={{ paddingLeft: '6.2rem', paddingRight: '6.2rem' }}>
            <LogsTable/>
        </div>
    );
};

export default LogsPage;