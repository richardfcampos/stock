import React from 'react'

const TableDataCell: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <td className="px-4 py-2 border border-gray-700 text-white">{ children }</td>
    )
}

export default TableDataCell
