import React, { Component } from 'react';
import { getInitialFlightData } from './DataProvider';
import { useTable } from "react-table";

const defaultPropGetter = () => ({});

function Table({
  columns,
  data,
  getHeaderProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
  getRowProps = defaultPropGetter,
  getCellProps = defaultPropGetter
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
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
  constructor(props) {
    super(props);
    this.state = {
      data: getInitialFlightData()
    };

    this.columns = [{
      accessor: 'line'
    }, {
      accessor: 'c1'
    }, {
      accessor: 'c2'
    }, {
      accessor: 'c3'
    }, {
      accessor: 'c4'
    }, {
      accessor: 'c5'
    }, {
      accessor: 'c6'
    }, {
      accessor: 'c7'
    }, {
      accessor: 'c8'
    }, {
      accessor: 'c9'
    }, {
      accessor: 'c10'
    }];

    this.eventSource = new EventSource('http://localhost:3000/simulator');
  }

  componentDidMount() {
    this.eventSource.addEventListener('matrixUpdate', (e) => this.updateMatrix(JSON.parse(e.data)));
    this.eventSource.addEventListener('closedConnection', () => this.stopUpdates());
  }

  listToMatrix(list, elementsPerSubArray) {
    var matrix = [], i, k;

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
    let values = matrixValues.split(",")
    let matrix = this.listToMatrix(values, 10);

    let newData = this.state.data.map((item) => {
      let line = matrix[item.line];
      item.c1 = line[0];
      item.c2 = line[1];
      item.c3 = line[2];
      item.c4 = line[3];
      item.c5 = line[4];
      item.c6 = line[5];
      item.c7 = line[6];
      item.c8 = line[7];
      item.c9 = line[8];
      item.c10 = line[9];
      return item;
    });

    this.setState(Object.assign({}, { data: newData }));
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
