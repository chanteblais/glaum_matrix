import React, {Component} from "react";
import {useTable} from "react-table";

const defaultPropGetter = () => ({});

function Table({
                   columns,
                   data,
                   getColumnProps = defaultPropGetter,
                   getRowProps = defaultPropGetter,
                   getCellProps = defaultPropGetter
               }) {
    const {
        getTableProps,
        getTableBodyProps,
        rows,
        prepareRow
    } = useTable({
        columns,
        data
    });

    return (
        <table {...getTableProps()}>
            <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps(getRowProps(row))}>
                        {row.cells.map((cell) => {
                            return (
                                <td
                                    {...cell.getCellProps([
                                        {
                                            className: cell.column.className,
                                            style: cell.column.style
                                        },
                                        getColumnProps(cell.column),
                                        getCellProps(cell)
                                    ])}
                                >&nbsp;</td>
                            );
                        })}
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
}

class App extends Component {

    matrixSize = 16;

    constructor(props) {
        super(props);
        this.state = {
            data: this.getInitialFlightData(this.matrixSize)
        };

        this.columns = [{
            accessor: "line"
        }];

        for (let i = 0; i < this.matrixSize; i++) {
            this.columns.push({accessor: "c" + i});
        }
        this.eventSource = new EventSource("http://localhost/simulator");
    }

    getInitialFlightData(matrixSize) {
        let data = [];
        for (let i = 0; i < matrixSize; i++) {
            let line = {
                line: i
            };
            for (let j = 0; j < matrixSize; j++) {
                line["c" + j] = "#000000";
            }
            data.push(line);
        }
        return data;
    }

    componentDidMount() {
        this.eventSource.addEventListener("matrixUpdate", (e) => this.updateMatrix(JSON.parse(e.data)));
    }

    listToMatrix(list, elementsPerSubArray) {
        let matrix = [], i, k;
        for (i = 0, k = -1; i < list.length; i++) {
            if (i % elementsPerSubArray === 0) {
                k++;
                matrix[k] = [];
            }
            matrix[k].push(list[i]);
        }
        return matrix;
    }

    updateMatrix(matrixValues) {
        if (matrixValues) {
            let values = matrixValues.split(",");
            if (values.length === this.matrixSize * this.matrixSize) {
                let matrix = this.listToMatrix(values, this.matrixSize);
                let newData = this.state.data.map((item) => {
                    let line = matrix[item.line];
                    if (line && line.length === this.matrixSize) {
                        for (let i = 0; i < line.length; i++) {
                            item["c" + i] = line[i];
                        }
                        return item;
                    }
                });
                this.setState(Object.assign({}, {data: newData}));
            }
        }
    }

    render() {
        return (
            <div className="App"
                 style={{
                     display: "flex",
                     justifyContent: "center",
                     alignItems: "center"
                 }}>
                <Table
                    columns={this.columns}
                    data={this.state.data}
                    getCellProps={(cellInfo) => ({
                        style: {
                            backgroundColor: cellInfo.value,
                            minWidth: "20px",
                            width: "20px",
                            minHeight: "20px",
                            height: "20px"
                        }
                    })}
                />
            </div>
        );
    }
}

export default App;
