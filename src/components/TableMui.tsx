import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { type } from 'os';

const useStyles = makeStyles({
  btnAction: {
    fontSize: '15px',
  },
});

const url = 'http://localhost/my-app-rest-api/public/api/product';

//Declare type in Table Columns
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
//Declare editable in Table Columns
type CEditable = 'always' | 'never' | 'onUpdate' | 'onAdd';
const NEVER: CEditable = 'never';
//Declare align in Table Columns
type CAlign = 'center' | 'inherit' | 'justify' | 'left' | 'right';
const LEFT: CAlign = 'left';
//Declare custom Button Color
type CButtonColor = 'inherit' | 'primary' | 'secondary';
const PRIMARY: CButtonColor = 'primary';
//Declare custom Button Variant
type CButtonVariant = 'outlined' | 'contained';
const OUTLINED: CButtonVariant = 'outlined';

function TableMui() {
  const classes = useStyles();
  const [tableData, setTableData] = useState([]);

  //Data according to database Columns Name
  const [tableColumns] = useState([
    {
      title: 'ID',
      field: 'product_id',
      type: NUMERIC,
      editable: NEVER,
      align: LEFT,
    },
    {
      title: 'Name',
      field: 'product_name',
      type: STRING,
    },
    { title: 'Type', field: 'product_type', type: STRING },
    {
      title: 'Quantity',
      field: 'product_quantity',
      type: NUMERIC,
      align: LEFT,
    },
    {
      title: 'Created',
      field: 'created_at',
      type: DATETIME,
    },
    {
      title: 'Update',
      field: 'updated_at',
      type: DATETIME,
    },
  ]);

  const tableActions: any = [
    {
      icon: 'target',
      tooltip: 'Save User',
    },
    {
      icon: 'reject',
      tooltip: 'Save User',
    },
    {
      icon: 'delete',
      tooltip: 'Delete User',
    },
  ];

  // Get the table list from API
  const getProductData = async () => {
    await axios.get(url).then((response) => {
      setTableData(response.data);
    });
  };

  useEffect(() => {
    getProductData();
  }, []);

  return (
    <div>
      <MaterialTable
        title='Cell Editable Preview'
        columns={tableColumns}
        data={tableData}
        actions={tableActions}
        options={{
          selection: true,
          actionsColumnIndex: -1,
        }}
        // components={{
        //   Action: (props) => {
        //     if (props.action.icon === 'target') {
        //       return (
        //         <Button
        //           onClick={(event) => props.action.onClick(event, props.data)}
        //           color={PRIMARY}
        //           variant={OUTLINED}
        //           style={{ textTransform: 'none' }}
        //           size="small"
        //           className={classes.btnAction}
        //         >
        //           指名
        //         </Button>
        //       );
        //     }
        //     if (props.action.icon === 'reject') {
        //       return (
        //         <Button
        //           onClick={(event) => props.action.onClick(event, props.data)}
        //           color={PRIMARY}
        //           variant={OUTLINED}
        //           style={{ textTransform: 'none' }}
        //           size="small"
        //           className={classes.btnAction}
        //         >
        //           退勤
        //         </Button>
        //       );
        //     }
        //     if (props.action.icon === 'delete') {
        //       return (
        //         <Button
        //           onClick={(event) => props.action.onClick(event, props.data)}
        //           color={PRIMARY}
        //           variant={OUTLINED}
        //           style={{ textTransform: 'none' }}
        //           size="small"
        //           className={classes.btnAction}
        //         >
        //           消除
        //         </Button>
        //       );
        //     }
        //   },
        // }}
        cellEditable={{
          onCellEditApproved: (newValue) => {
            return new Promise((resolve) => {
              console.log('newValue: ' + newValue);
              setTimeout(resolve, 1000);
            });
          },
        }}
      />
    </div>
  );
}

export default TableMui;
