import React, { useState, useEffect } from 'react';
//import Material Components
import { Card, Box, Container, Typography } from '@material-ui/core';
//import Material-Table library
import MaterialTable from 'material-table';
// import API library
import axios from 'axios';
//import Custom Material Styles
import useStyles from '../styles/AppStyles';

import Alert from '@material-ui/lab/Alert';

interface Data {
  tableData: any;
  product_id: number;
  product_name: string;
  product_type: string;
  product_quantity: string;
  created_at: Date;
  updated_at: Date;
}

interface DataVar {
  newData: Data[];
  oldData: string;
  resolve: void;
}

type CType =
  | 'string'
  | 'boolean'
  | 'numeric'
  | 'date'
  | 'datetime'
  | 'time'
  | 'currency';
const STRING: CType = 'string';
const NUMERIC: CType = 'numeric';
const DATETIME: CType = 'datetime';

type CEdit = 'always' | 'never' | 'onUpdate' | 'onAdd';
const NEVER: CEdit = 'never';

type CAlign = 'center' | 'inherit' | 'justify' | 'left' | 'right';
const LEFT: CAlign = 'left';

const API = axios.create({
  baseURL: `http://localhost/my-app-rest-api/public/api`,
});

const TableM = () => {
  const classes = useStyles();

  const [tableColumns] = useState([
    {
      title: 'id',
      field: 'product_id',
      type: NUMERIC,
      align: LEFT,
      editable: NEVER,
    },
    { title: 'Name', field: 'product_name', type: STRING },
    { title: 'Type', field: 'product_type', type: STRING },
    {
      title: 'Quantity',
      field: 'product_quantity',
      type: NUMERIC,
      align: LEFT,
    },
    { title: 'Date 1', field: 'created_at', type: DATETIME },
    { title: 'Date 2', field: 'updated_at', type: DATETIME },
  ]);
  const [tableData, setTableData] = useState([]); //table data

  //for error handling
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    getTableData();
  }, []);

  const getTableData = () => {
    API.get('/product')
      .then((res) => {
        // setTableData(res.data.data);
        setTableData(res.data);
        console.log(res);
      })
      .catch((error) => {
        console.log('Error');
      });
  };

  //Update
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
          resolve();
          setIserror(false);
          setErrorMessages([]);
        })
        .catch((error) => {
          setErrorMessages(['Update failed! Server error'] as any);
          setIserror(true);
          resolve();
        });
    } else {
      setErrorMessages(errorList as any);
      setIserror(true);
      resolve();
    }
  };

  //Create
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
          getTableData();
          resolve();
          setErrorMessages([]);
          setIserror(false);
        })
        .catch((error) => {
          setErrorMessages(['Cannot add data. Server error!'] as any);
          setIserror(true);
          resolve();
        });
    } else {
      setErrorMessages(errorList as any);
      setIserror(true);
      resolve();
    }
  };

  //Delete
  const handleRowDelete = (oldData: Data, resolve: () => void) => {
    API.delete('/product/' + oldData.product_id)
      .then((res) => {
        const dataDelete = [...tableData];
        const index = oldData.tableData.product_id;
        dataDelete.splice(index, 1);
        setTableData([...dataDelete]);
        getTableData();
        resolve();
      })
      .catch((error) => {
        setErrorMessages(['Delete failed! Server error'] as any);
        setIserror(true);
        resolve();
      });
  };

  return (
    <div>
      <Container>
        <Box mt="10px" pt="20px">
          <Card className={classes.tableCard}>
            <Box m="0.5em" p="0.5em">
              <Typography variant="h4" component="h2">
                TableList Component
              </Typography>
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
                title="User data from remote source"
                columns={tableColumns}
                data={tableData}
                // icons={tableIcons}
                editable={{
                  onRowUpdate: (newData, oldData) =>
                    new Promise((resolve) => {
                      handleRowUpdate(newData, oldData as any, resolve);
                    }),
                  onRowAdd: (newData) =>
                    new Promise((resolve) => {
                      handleRowAdd(newData, resolve);
                    }),
                  onRowDelete: (oldData) =>
                    new Promise((resolve) => {
                      handleRowDelete(oldData, resolve);
                    }),
                }}
                options={{
                  actionsColumnIndex: -1,
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
