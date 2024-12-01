'use client';

import React, { useEffect, useState } from 'react';
import { LogsTable } from '@/components/admin/LogsTable';
import { getLogs } from '@/actions/tools/get-logs';

const LogsPage = () => {
    const [logs, setLogs] = useState<Array<{ action: string; madeBy: string; realizedAt: string; details: string }>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await getLogs();
                const formattedData = data.map(log => ({
                    ...log,
                    realizedAt: log.realizedAt.toISOString(),
                    details: JSON.stringify(log.details)
                }));
                setLogs(formattedData);
            } catch (error) {
                console.error('Failed to fetch logs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ paddingLeft: '6.2rem', paddingRight: '6.2rem' }}>
            <LogsTable logs={logs} />
        </div>
    );
};

export default LogsPage;