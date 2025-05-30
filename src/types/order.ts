import { BaseResponse, PaginatedResponse } from "./response";

export enum SortField {
  ORDEN = 'ORDEN',
  SHOP = 'TIENDA',
  REGISTERED_AT = 'FECHA_REGISTRO',
}

export interface GetOrdersParams {
  page: number;
  limit: number;
  search?: string;
  sortOrder?: string;
  sortBy?: SortField;
  store?: string;
}

export type OrdersResponse = PaginatedResponse<Order[]>;

export interface Order {
  ID: string;
  ORDEN: string;
  EMAIL: string;
  NOMBRE: string;
  OTRO_NOMBRE: string | null;
  OTRO_NOMBRE_DOC: string | null;
  ORDEN_REFERENCIA: string;
  WEB: string;
  CLUB: string;
  PTLOG: string;
  PRINT: number;
  APELLIDOS: string;
  COMENTARIO: string;
  RNC: string | null;
  RNC_NAME: string;
  TOTAL: number;
  DIRECCION: string;
  CIUDAD: string;
  TOTAL_DESCUENTO: number;
  ITBIS: number;
  NCF: string;
  TIPO_NCF: string;
  TELEFONO: string;
  PAIS: string | null;
  ESTATUS: number;
  ORDEN_DESDE: string;
  TIENDA: string;
  FECHA_REGISTRO: string;
  HORA_REGISTRO: string;
  FACTURAS: Invoice[];
  ARTICULOS: Article[];
  TRANSACCIONES: Transaction[];
}

export interface Invoice {
  ID: string;
  ORDEN: string;
  FACTURAS: string;
  DEPTO: string;
  WEB: string;
  ESTATUS: number | null;
  TIENDA: string;
  DELIVERY: string;
  ITBIS: number;
  NCF: string;
  TIPO_NCF: string;
  TOTAL: number;
}

export interface Article {
  ID: string;
  ORDEN: string;
  FACTURA: string;
  EAN: string;
  UNMANEJO: string;
  CANT: number;
  DESCRIPCION: string;
  WEB: string;
  PRECIO: number;
  TOTAL: number;
  TOTAL_DISCOUNT: number;
  ESTATUS: number;
  FECHA: string;
}

export interface Transaction {
  ORDEN: string;
  TOTAL: number;
  TARJETA: string;
  APROBACION: string;
  FECHA_APROBACION: string;
  HORA_APROBACION: string;
}

export interface spooler {
  spooler: string;
  model: string;
}

export type SpoolerResponse = BaseResponse<spooler[]>;

export interface PrintOrderBody {
  orderNumber: string;
  spooler: string;
  forcePrint?: boolean;
}

export type PrintOrderResponse = BaseResponse<string>;