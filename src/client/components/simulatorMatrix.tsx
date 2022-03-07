import React, { Component } from "react";
import { useTable } from "react-table";

const matrixSize = 32;

const defaultPropGetter = (any: any) => ({});

function Table({ columns, data, getCellProps = defaultPropGetter }) {
    const {
        getTableProps,
        getTableBodyProps,
        getColumnProps = defaultPropGetter,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    });

    return (
        <table {...getTableProps()} width={"100%"}>
            <tbody {...getTableBodyProps()}>
            {rows.map(row => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                            return (
                                <td
                                    {...cell.getCellProps([
                                        {
                                            className: cell.column.className,
                                            style: cell.column.style,
                                        },
                                        getColumnProps(cell.column),
                                        getCellProps(cell),
                                    ])}
                                >&nbsp;</td>);
                        })}
                    </tr>);
            })}
            </tbody>
        </table>
    );
}

export default function MatrixSimulator() {
    let eventSource;
    const [rows, setRows] = React.useState(() => {
        // initializeMatrix();
        eventSource = new EventSource("http://localhost:3000/api/simulator");
        eventSource.addEventListener("matrixUpdate", (e) => handleUpdateMatrix(JSON.parse(e.data)));
    });

    const initializeMatrix = () => {
        const data = new Array<any>();
        for (let i = 0; i < matrixSize; i++) {
            const line = {
                line: i
            };
            for (let j = 0; j < matrixSize; j++) {
                line["c" + j] = "#000000";
            }
            data.push(line);
        }
        return data;
    };

    const matrixData = initializeMatrix();
    const data = React.useMemo(() => matrixData, [matrixData]);

    const handleUpdateMatrix = (matrixValues: string) => {
        if (matrixValues) {
            const values = matrixValues.split(",");
            if (values.length === matrixSize * matrixSize) {
                const matrix = listToMatrix(values, matrixSize);
                const newData = matrixData.map((item) => {
                    const line = matrix[item.line];
                    if (line && line.length === matrixSize) {
                        for (let i = 0; i < line.length; i++) {
                            item["c" + i] = line[i];
                        }
                        return item;
                    }
                });
                Object.assign({}, { matrixData: newData });
            }
        }
        console.log("Updating matrix");
        // setRows((prevRows) => {
        //     console.log("Previous rows", prevRows);
        //     return prevRows;
        // });
        // setRows((prevRows) => {
        //     const rowToUpdateIndex = 0;
        //
        //     return prevRows.map((row, index) =>
        //         index === rowToUpdateIndex ? { ...row, username: "NEW randomUserName()" } : row,
        //     );
        // });
    };

    const listToMatrix = (list, elementsPerSubArray) => {
        const matrix = new Array<any>();
        let i, k;
        for (i = 0, k = -1; i < list.length; i++) {
            if (i % elementsPerSubArray === 0) {
                k++;
                matrix[k] = [];
            }
            matrix[k].push(list[i]);
        }
        return matrix;
    };

    const getColumns = () => {
        const columns = new Array<any>();
        for (let i = 0; i < matrixSize; i++) {
            columns.push({
                accessor: "c" + i
            });
        }
        return React.useMemo(() => columns, []);
    };

    return (
        <div
        //     style={{
        //     display: "flex",
        //     justifyContent: "center",
        //     alignItems: "center"
        // }}
        >
            <Table
                columns={getColumns()}
                data={data}
                getCellProps={(cellInfo) => ({
                    style: {
                        lineHeight: "1px",
                        backgroundColor: cellInfo.value
                    }
                })}/>
        </div>
    );
}
