import React, { useState, useEffect } from 'react';
//import Material Components
import { Card, Box, Container, Typography } from '@material-ui/core';
//import Material-Table library
import MaterialTable from 'material-table';
// import API library
import axios from 'axios';
//import Custom Material Styles
import useStyles from '../styles/AppStyles';

interface Data {
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

const API = axios.create({
  baseURL: `http://localhost/my-app-rest-api/public/api`,
});

const TableM = () => {
  const classes = useStyles();

  let columns = [
    { title: 'id', field: 'product_id' },
    { title: 'Name', field: 'product_name' },
    { title: 'Type', field: 'product_type' },
    { title: 'email', field: 'product_quantity' },
    { title: 'Date 1', field: 'created_at', type: 'datetime' },
    { title: 'Date 2', field: 'updated_at', type: 'datetime' },
  ];
  const [data, setData] = useState([]); //table data

  //for error handling
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    API.get('/product')
      .then((res) => {
        setData(res.data.data);
      })
      .catch((error) => {
        console.log('Error');
      });
  }, []);

  //Update
  const handleRowUpdate = (newData: Data, { oldData, resolve }: DataVar) => {
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
          const dataUpdate = [...data];
          const index = oldData.tableData.product_id;
          dataUpdate[index] = newData;
          setData([...dataUpdate]);
          resolve();
          setIserror(false);
          setErrorMessages([]);
        })
        .catch((error) => {
          setErrorMessages(['Update failed! Server error']);
          setIserror(true);
          resolve();
        });
    } else {
      setErrorMessages(errorList);
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
          let dataToAdd = [...data];
          dataToAdd.push(newData);
          setData(dataToAdd);
          resolve();
          setErrorMessages([]);
          setIserror(false);
        })
        .catch((error) => {
          setErrorMessages(['Cannot add data. Server error!']);
          setIserror(true);
          resolve();
        });
    } else {
      setErrorMessages(errorList);
      setIserror(true);
      resolve();
    }
  };

  //Delete
  const handleRowDelete = (oldData: Data, resolve: () => void) => {
    API.delete('/product/' + oldData.product_id)
      .then((res) => {
        const dataDelete = [...data];
        const index = oldData.tableData.product_id;
        dataDelete.splice(index, 1);
        setData([...dataDelete]);
        resolve();
      })
      .catch((error) => {
        setErrorMessages(['Delete failed! Server error']);
        setIserror(true);
        resolve();
      });
  };

  return (
    <div>
      <Container>
        <Box mt='10px' pt='20px'>
          <Card className={classes.tableCard}>
            <Box m='0.5em' p='0.5em'>
              <Typography variant='h4' component='h2'>
                TableList Component
              </Typography>
              <div>
                {iserror && (
                  <Alert severity='error'>
                    {errorMessages.map((msg, i) => {
                      return <div key={i}>{msg}</div>;
                    })}
                  </Alert>
                )}
              </div>
              <MaterialTable
                title='User data from remote source'
                columns={columns}
                data={data}
                icons={tableIcons}
                editable={{
                  onRowUpdate: (newData, oldData) =>
                    new Promise((resolve) => {
                      handleRowUpdate(newData, oldData, resolve);
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
              />
            </Box>
          </Card>
        </Box>
      </Container>
    </div>
  );
};

export default TableM;
