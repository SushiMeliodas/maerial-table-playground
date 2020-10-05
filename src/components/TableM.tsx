import React, { useState, useEffect } from 'react';
//import Material Components
import { Card, Box, Container, Button } from '@material-ui/core';
//import Material-Table library
import MaterialTable from 'material-table';
// import API library
import axios from 'axios';
//import Custom Material Styles
import useStyles from '../styles/AppStyles';
//import Alert for Validation Message
import Alert from '@material-ui/lab/Alert';
//import for DatetimePicker related
import {
  MuiPickersUtilsProvider,
  DateTimePicker,
  TimePicker,
} from '@material-ui/pickers';
import { format } from 'date-fns'; //Formater for date
import DateFnsUtils from '@date-io/date-fns'; //Formater for DatetimePicker
import {
  CAlign,
  CEdit,
  CType,
  Data,
  CButtonColor,
  CButtonVariant,
} from '../types/Tstypes';

// interface DataVar {
//   newData: Data[];
//   oldData: string;
//   resolve: void;
// }

//Collumns string type
const STRING: CType = 'string';
const NUMERIC: CType = 'numeric';
const DATETIME: CType = 'datetime';
const TIME: CType = 'time';
// const DATE: CType = 'date';

//Collumns Edit string type
const NEVER: CEdit = 'never';
//Collumns align string type
const LEFT: CAlign = 'left';
//Button string type
const PRIMARY: CButtonColor = 'primary';
const OUTLINED: CButtonVariant = 'outlined';

//Declare API url here
const API = axios.create({
  baseURL: `http://localhost/my-app-rest-api/public/api`,
});

//Format Date here before send to API server
Date.prototype.toJSON = function () {
  // you can use moment or anything else you prefer to format
  // the date here
  return format(this, 'yyyy/MM/dd HH:mm:ss');
};

const TableM = () => {
  //Declaration for Material Styles
  const classes = useStyles();

  //Table Collumn here
  const [tableColumns] = useState([
    {
      title: 'ID',
      field: 'product_id',
      type: NUMERIC,
      align: LEFT,
      editable: NEVER,
    },
    { title: 'キャスト名', field: 'product_name', type: STRING },
    { title: '区分', field: 'product_type', type: STRING },
    {
      title: 'Quantity',
      field: 'product_quantity',
      type: NUMERIC,
      align: LEFT,
    },
    {
      title: '予定時間',
      field: 'product_datetime',
      type: TIME,
      // render: ({ product_datetime }: Data) => product_datetime,
      editComponent: (props: any) => (
        <MuiPickersUtilsProvider
          utils={DateFnsUtils}
          locale={props.dateTimePickerLocalization}
        >
          <DateTimePicker
            autoOk
            ampm={false}
            variant="inline"
            margin="normal"
            format="HH:mm:ss"
            // format='yyyy/MM/dd HH:mm:ss'
            value={props.value || null}
            onChange={props.onChange}
            clearable
            InputProps={{
              style: {
                fontSize: 13,
              },
            }}
          />
        </MuiPickersUtilsProvider>
      ),
    },
    { title: 'Date 1', field: 'created_at', type: DATETIME, editable: NEVER },
    { title: 'Date 2', field: 'updated_at', type: DATETIME, editable: NEVER },
  ]);
  const [tableData, setTableData] = useState([]); //table data

  //for error handling
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  //Refresh everytime when getTableData is called
  useEffect(() => {
    getTableData();
  }, []);

  //Get data list here
  const getTableData = () => {
    API.get('/product')
      .then((res) => {
        setTableData(res.data);
        console.log(res);
      })
      .catch((error) => {
        console.log('Error');
      });
  };

  //Update Function PUT
  const handleRowUpdate = (
    newData: Data,
    oldData: Data,
    resolve: { (value?: any): void; (): void }
  ) => {
    //validation
    let errorList = [];
    if (newData.product_name === '') {
      errorList.push('Please enter Product Name!');
    }
    if (newData.product_type === '') {
      errorList.push('Please enter Product Type!');
    }
    if (newData.product_quantity === '') {
      errorList.push('Please enter a Quantity!');
    }
    // if (newData.email === '' || validateEmail(newData.email) === false) {
    //   errorList.push('Please enter a valid email');
    // }

    if (errorList.length < 1) {
      API.patch('/product/' + newData.product_id, newData)
        .then((res) => {
          const dataUpdate: any[] = [...tableData];
          const index = oldData.tableData.product_id;
          dataUpdate[index] = newData;
          setTableData([...dataUpdate] as any);
          getTableData();
          console.log(res);
          resolve();
          setIserror(false);
          setErrorMessages([]);
        })
        .catch((error) => {
          setErrorMessages(['Update failed! Server error'] as any);
          console.log(newData);
          setIserror(true);
          resolve();
        });
    } else {
      setErrorMessages(errorList as any);
      setIserror(true);
      resolve();
    }
  };

  //Create Function POST
  const handleRowAdd = (newData: Data, resolve: () => void) => {
    //validation
    let errorList = [];
    if (newData.product_name === undefined) {
      errorList.push('Please enter Product Name!');
    }
    if (newData.product_type === undefined) {
      errorList.push('Please enter Product Type!');
    }
    if (newData.product_quantity === undefined) {
      errorList.push('Please enter a Product Quantity!');
    }
    // if (newData.email === undefined || validateEmail(newData.email) === false) {
    //   errorList.push('Please enter a valid email');
    // }

    if (errorList.length < 1) {
      //no error
      API.post('/product', newData)
        .then((res) => {
          let dataToAdd: Data[] = [...tableData];
          dataToAdd.push(newData);
          setTableData(dataToAdd as any);
          // setTableData(dataToAdd.concat(res.data) as any);
          getTableData();
          console.log(res);
          resolve();
          setErrorMessages([]);
          setIserror(false);
        })
        .catch((err) => {
          setErrorMessages(['Cannot add data. Server error!'] as any);
          console.log(newData);
          console.log(err);
          setIserror(true);
          resolve();
        });
    } else {
      setErrorMessages(errorList as any);
      setIserror(true);
      resolve();
    }
  };

  //Delete function DELETE
  const handleRowDelete = (oldData: any, resolve: () => void) => {
    for (const [index, value] of oldData.entries()) {
      API.delete('/product/' + value.product_id)
        .then((res) => {
          const dataDelete = [...tableData];
          const index = oldData.product_id;
          dataDelete.splice(index, 1);
          setTableData([...dataDelete]);
          getTableData();
          console.log(res);
          resolve();
        })
        .catch((error) => {
          setErrorMessages(['Delete failed! Server error'] as any);
          setIserror(true);
          resolve();
        });
    }
  };

  const tableActions: any = [
    {
      icon: () => (
        <Button
          // onClick={(event) => props.action.onClick(event, props.data)}
          variant={OUTLINED}
          style={{ textTransform: 'none' }}
          size="small"
          className={classes.btnAction}
        >
          指名
        </Button>
      ),
      tooltip: '指名',
    },
    {
      icon: () => (
        <Button
          // onClick={(event) => props.action.onClick(event, props.data)}
          variant={OUTLINED}
          style={{ textTransform: 'none' }}
          size="small"
          className={classes.btnAction}
        >
          退勤
        </Button>
      ),
      tooltip: '退勤',
    },
    {
      icon: () => (
        <Button
          // onClick={(event) => props.action.onClick(event, props.data)}
          variant={OUTLINED}
          style={{ textTransform: 'none' }}
          size="small"
          className={classes.btnAction}
        >
          消除
        </Button>
      ),
      tooltip: '消除',
      onClick: (event: any, rowData: any) => {
        new Promise((resolve) => {
          handleRowDelete(rowData, resolve);
        });
      },
    },
  ];

  return (
    <div>
      <Container>
        <Box mt="10px" pt="20px">
          <Card className={classes.tableCard}>
            <Box m="0.5em" p="0.5em">
              <div>
                {iserror && (
                  <Alert severity="error">
                    {errorMessages.map((msg, i) => {
                      return <div key={i}>{msg}</div>;
                    })}
                  </Alert>
                )}
              </div>
              <MaterialTable
                title="Material-Table data"
                columns={tableColumns}
                data={tableData}
                actions={tableActions}
                editable={{
                  onRowUpdate: (newData, oldData) =>
                    new Promise((resolve) => {
                      handleRowUpdate(newData, oldData as any, resolve);
                    }),
                  // onRowAdd: (newData) =>
                  //   new Promise((resolve) => {
                  //     handleRowAdd(newData, resolve);
                  //   }),
                  // onRowDelete: (oldData) =>
                  //   new Promise((resolve) => {
                  //     handleRowDelete(oldData, resolve);
                  //   }),
                }}
                options={{
                  actionsColumnIndex: -1,
                  selection: true,
                  showSelectAllCheckbox: false,
                }}
              />
            </Box>
          </Card>
        </Box>
      </Container>
    </div>
  );
};

export default TableM;
