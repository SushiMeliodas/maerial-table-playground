//Type declaration for Collumns Data & Database Data types
export interface Data {
  tableData: any;
  product_id: number;
  product_name: string;
  product_type: string;
  product_quantity: string;
  product_datetime: Date;
  created_at: Date;
  updated_at: Date;
}

//Type declaration for Collumns Type field
export type CType =
  | 'string'
  | 'boolean'
  | 'numeric'
  | 'date'
  | 'datetime'
  | 'time'
  | 'currency';

//Type declaration for Collumns Edit field
export type CEdit = 'always' | 'never' | 'onUpdate' | 'onAdd';

//Type declaration for Collumns Align field
export type CAlign = 'center' | 'inherit' | 'justify' | 'left' | 'right';

//Type declaration for Button Customized
export type CButtonColor = 'inherit' | 'primary' | 'secondary';
export type CButtonVariant = 'outlined' | 'contained';
