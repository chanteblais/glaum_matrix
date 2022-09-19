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

    matrixWidth = 16;
    matrixHeight = 8;

    constructor(props) {
        super(props);
        this.state = {
            data: this.getInitialFlightData(this.matrixWidth, this.matrixHeight)
        };

        this.columns = [{
            accessor: "column"
        }];

        for (let i = 0; i < this.matrixWidth; i++) {
            this.columns.push({accessor: "c" + i});
        }
        this.eventSource = new EventSource("http://localhost:4000/events");
    }

    getInitialFlightData(matrixWidth, matrixHeight) {
        let data = [];
        for (let i = 0; i < matrixHeight; i++) {
            let line = {
                lineNumber: i
            };
            for (let column = 0; column < matrixWidth; column++) {
                line["c" + column] = "#000000";
            }
            data.push(line);
        }
        return data;
    }

    componentDidMount() {
        this.eventSource.addEventListener("matrixUpdate", event => this.updateMatrix(JSON.parse(event.data)));
    }

    updateMatrix(matrixValues) {
        if (matrixValues) {
            if (matrixValues.length === this.matrixWidth) {
                let newData = this.state.data.map((line) => {
                    for (let column = 0; column < matrixValues.length; column++) {
                        if (this.matrixHeight === matrixValues[column].length) {
                            let colour = matrixValues[column][line.lineNumber];
                            line["c" + column] = App.rgbToHex(colour[0], colour[1], colour[2]);
                        } else {
                            console.log(`Matrix height ${matrixValues[column].length} doesn't match simulator height of ${this.matrixHeight}`);
                        }
                    }
                    return line;
                });
                this.setState(Object.assign({}, {data: newData}));
            } else {
                console.log(`Matrix width ${matrixValues.length} doesn't match simulator width of ${this.matrixWidth}`);
            }
        }
    }

    static rgbToHex(r, g, b) {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";

        return "#" + ("000000" + ((r << 16) | (g << 8) | b).toString(16)).slice(-6);
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
