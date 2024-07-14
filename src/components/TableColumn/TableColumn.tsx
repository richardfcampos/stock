import React from 'react'

const TableColumn: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <th className="px-4 py-2 border border-gray-700 text-green-400">{ children }</th>
    )
}

export default TableColumn
