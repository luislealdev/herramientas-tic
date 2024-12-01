'use client';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TableToolbar, TableToolbarContent, Dropdown, Pagination } from '@carbon/react';
import '../../globals.scss';
import { useState } from 'react';

export const LogsTable = ({ logs }: { logs: Array<{ action: string; madeBy: string; realizedAt: string; details: string }> }) => {
    const headers = ['Accion', 'Hecha por', 'Fecha de realizado', 'Detalles'];
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('todos');
    const pageSize = 10;
    const totalItems = logs.length;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (selectedItem: string) => {
        setFilter(selectedItem);
    };

    const filteredLogs = logs.filter(log => {
        if (filter === 'todos') return true;
        if (filter === 'editados') return log.action === 'update';
        if (filter === 'eliminados') return log.action === 'delete';
        return true;
    });

    const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <TableContainer title="Logs" description="Visualización de logs del sistema">
            <TableToolbar>
                <TableToolbarContent>
                    <div style={{ flexGrow: 1 }}></div>
                    <Dropdown
                        size="lg"
                        id="dropdown-mostrar"
                        label="Mostrar"
                        items={['todos', 'editados', 'eliminados']}
                        itemToString={(item) => (item ? item.charAt(0).toUpperCase() + item.slice(1) : '')}
                        onChange={({ selectedItem }) => handleFilterChange(selectedItem as string)}
                    />
                </TableToolbarContent>
            </TableToolbar>
            <Table experimentalAutoAlign size="xl" useZebraStyles={false} aria-label="logs table">
                <TableHead>
                    <TableRow>
                        {headers.map((header, index) => (
                            <TableHeader id={'' + index} key={header}>
                                {header}
                            </TableHeader>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedLogs.map((log, index) => (
                        <TableRow key={index}>
                            <TableCell>{log.action}</TableCell>
                            <TableCell>{log.madeBy}</TableCell>
                            <TableCell>{log.realizedAt}</TableCell>
                            <TableCell>{log.details}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination
                size="lg"
                totalItems={totalItems}
                pageSize={pageSize}
                pageSizes={[10, 20, 30]}
                onChange={({ page }) => handlePageChange(page)}
                page={currentPage}
            />
        </TableContainer>
    );
};