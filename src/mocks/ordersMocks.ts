import {
  Order,
  OrdersResponse,
  GetOrdersParams,
  SortField,
  SpoolerResponse,
  PrintOrderBody,
  PrintOrderResponse,
  Invoice,
  Article,
  Transaction
} from '@/types/order';

// Mock invoices
const mockInvoices: Invoice[] = [
  {
    ID: '101',
    ORDEN: 'ORD-001',
    FACTURAS: 'FAC-001',
    DEPTO: 'Electronics',
    WEB: 'www.example.com',
    ESTATUS: 1,
    TIENDA: 'Main Store',
    DELIVERY: 'Standard',
    ITBIS: 180.00,
    NCF: 'B0100000001',
    TIPO_NCF: 'B01',
    TOTAL: 1180.00
  },
  {
    ID: '102',
    ORDEN: 'ORD-002',
    FACTURAS: 'FAC-002',
    DEPTO: 'Furniture',
    WEB: 'www.example.com',
    ESTATUS: 1,
    TIENDA: 'Main Store',
    DELIVERY: 'Express',
    ITBIS: 270.00,
    NCF: 'B0100000002',
    TIPO_NCF: 'B01',
    TOTAL: 1770.00
  },
  {
    ID: '103',
    ORDEN: 'ORD-003',
    FACTURAS: 'FAC-003',
    DEPTO: 'Home',
    WEB: 'www.example.com',
    ESTATUS: 2,
    TIENDA: 'Online Store',
    DELIVERY: 'Standard',
    ITBIS: 90.00,
    NCF: 'B0100000003',
    TIPO_NCF: 'B01',
    TOTAL: 590.00
  }
];

// Mock articles
const mockArticles: Article[] = [
  {
    ID: '201',
    ORDEN: 'ORD-001',
    FACTURA: 'FAC-001',
    EAN: '1234567890123',
    UNMANEJO: 'PC',
    CANT: 1,
    DESCRIPCION: 'Smart TV 55"',
    WEB: 'www.example.com',
    PRECIO: 1000.00,
    TOTAL: 1000.00,
    TOTAL_DISCOUNT: 0,
    ESTATUS: 1,
    FECHA: '2023-03-15'
  },
  {
    ID: '202',
    ORDEN: 'ORD-002',
    FACTURA: 'FAC-002',
    EAN: '2345678901234',
    UNMANEJO: 'PC',
    CANT: 1,
    DESCRIPCION: 'Wooden Coffee Table',
    WEB: 'www.example.com',
    PRECIO: 500.00,
    TOTAL: 500.00,
    TOTAL_DISCOUNT: 0,
    ESTATUS: 1,
    FECHA: '2023-03-16'
  },
  {
    ID: '203',
    ORDEN: 'ORD-002',
    FACTURA: 'FAC-002',
    EAN: '3456789012345',
    UNMANEJO: 'PC',
    CANT: 4,
    DESCRIPCION: 'Dining Chairs',
    WEB: 'www.example.com',
    PRECIO: 250.00,
    TOTAL: 1000.00,
    TOTAL_DISCOUNT: 0,
    ESTATUS: 1,
    FECHA: '2023-03-16'
  },
  {
    ID: '204',
    ORDEN: 'ORD-003',
    FACTURA: 'FAC-003',
    EAN: '4567890123456',
    UNMANEJO: 'PC',
    CANT: 2,
    DESCRIPCION: 'Throw Pillows',
    WEB: 'www.example.com',
    PRECIO: 25.00,
    TOTAL: 50.00,
    TOTAL_DISCOUNT: 0,
    ESTATUS: 1,
    FECHA: '2023-03-17'
  },
  {
    ID: '205',
    ORDEN: 'ORD-003',
    FACTURA: 'FAC-003',
    EAN: '5678901234567',
    UNMANEJO: 'PC',
    CANT: 1,
    DESCRIPCION: 'Floor Lamp',
    WEB: 'www.example.com',
    PRECIO: 450.00,
    TOTAL: 450.00,
    TOTAL_DISCOUNT: 0,
    ESTATUS: 1,
    FECHA: '2023-03-17'
  }
];

// Mock transactions
const mockTransactions: Transaction[] = [
  {
    ORDEN: 'ORD-001',
    TOTAL: 1180.00,
    TARJETA: 'VISA ****1234',
    APROBACION: 'AP123456',
    FECHA_APROBACION: '2023-03-15',
    HORA_APROBACION: '14:30:00'
  },
  {
    ORDEN: 'ORD-002',
    TOTAL: 1770.00,
    TARJETA: 'MASTERCARD ****5678',
    APROBACION: 'AP234567',
    FECHA_APROBACION: '2023-03-16',
    HORA_APROBACION: '10:15:00'
  },
  {
    ORDEN: 'ORD-003',
    TOTAL: 590.00,
    TARJETA: 'AMEX ****9012',
    APROBACION: 'AP345678',
    FECHA_APROBACION: '2023-03-17',
    HORA_APROBACION: '16:45:00'
  }
];

// Mock orders
const mockOrders: Order[] = [
  {
    ID: '1',
    ORDEN: 'ORD-001',
    EMAIL: 'customer1@example.com',
    NOMBRE: 'John',
    OTRO_NOMBRE: null,
    OTRO_NOMBRE_DOC: null,
    ORDEN_REFERENCIA: 'REF-001',
    WEB: 'www.example.com',
    CLUB: 'Gold',
    PTLOG: 'POS',
    PRINT: 1,
    APELLIDOS: 'Doe',
    COMENTARIO: 'Please deliver after 5 PM',
    RNC: null,
    RNC_NAME: '',
    TOTAL: 1180.00,
    DIRECCION: '123 Main St, Apt 4B',
    CIUDAD: 'New York',
    TOTAL_DESCUENTO: 0,
    ITBIS: 180.00,
    NCF: 'B0100000001',
    TIPO_NCF: 'B01',
    TELEFONO: '555-123-4567',
    PAIS: 'USA',
    ESTATUS: 1,
    ORDEN_DESDE: 'Web',
    TIENDA: 'Main Store',
    FECHA_REGISTRO: '2023-03-15',
    HORA_REGISTRO: '14:25:00',
    FACTURAS: [mockInvoices[0]],
    ARTICULOS: [mockArticles[0]],
    TRANSACCIONES: [mockTransactions[0]]
  },
  {
    ID: '2',
    ORDEN: 'ORD-002',
    EMAIL: 'customer2@example.com',
    NOMBRE: 'Jane',
    OTRO_NOMBRE: null,
    OTRO_NOMBRE_DOC: null,
    ORDEN_REFERENCIA: 'REF-002',
    WEB: 'www.example.com',
    CLUB: 'Silver',
    PTLOG: 'POS',
    PRINT: 1,
    APELLIDOS: 'Smith',
    COMENTARIO: 'Call before delivery',
    RNC: '123456789',
    RNC_NAME: 'Smith Enterprises',
    TOTAL: 1770.00,
    DIRECCION: '456 Oak Ave',
    CIUDAD: 'Boston',
    TOTAL_DESCUENTO: 0,
    ITBIS: 270.00,
    NCF: 'B0100000002',
    TIPO_NCF: 'B01',
    TELEFONO: '555-987-6543',
    PAIS: 'USA',
    ESTATUS: 1,
    ORDEN_DESDE: 'Mobile',
    TIENDA: 'Main Store',
    FECHA_REGISTRO: '2023-03-16',
    HORA_REGISTRO: '10:10:00',
    FACTURAS: [mockInvoices[1]],
    ARTICULOS: [mockArticles[1], mockArticles[2]],
    TRANSACCIONES: [mockTransactions[1]]
  },
  {
    ID: '3',
    ORDEN: 'ORD-003',
    EMAIL: 'customer3@example.com',
    NOMBRE: 'Robert',
    OTRO_NOMBRE: null,
    OTRO_NOMBRE_DOC: null,
    ORDEN_REFERENCIA: 'REF-003',
    WEB: 'www.example.com',
    CLUB: 'Bronze',
    PTLOG: 'POS',
    PRINT: 0,
    APELLIDOS: 'Johnson',
    COMENTARIO: '',
    RNC: null,
    RNC_NAME: '',
    TOTAL: 590.00,
    DIRECCION: '789 Pine St',
    CIUDAD: 'Chicago',
    TOTAL_DESCUENTO: 0,
    ITBIS: 90.00,
    NCF: 'B0100000003',
    TIPO_NCF: 'B01',
    TELEFONO: '555-456-7890',
    PAIS: 'USA',
    ESTATUS: 2,
    ORDEN_DESDE: 'Web',
    TIENDA: 'Online Store',
    FECHA_REGISTRO: '2023-03-17',
    HORA_REGISTRO: '16:40:00',
    FACTURAS: [mockInvoices[2]],
    ARTICULOS: [mockArticles[3], mockArticles[4]],
    TRANSACCIONES: [mockTransactions[2]]
  }
];

// Mock spoolers
const mockSpoolers = [
  {
    spooler: 'MAIN_PRINTER',
    model: 'HP LaserJet Pro'
  },
  {
    spooler: 'BACKUP_PRINTER',
    model: 'Epson WorkForce'
  },
  {
    spooler: 'RECEIPT_PRINTER',
    model: 'Thermal Printer TP-100'
  }
];

// Function to get paginated orders with filtering
export const getMockOrders = (params: GetOrdersParams): OrdersResponse => {
  let filteredOrders = [...mockOrders];
  
  // Apply search if provided
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredOrders = filteredOrders.filter(order => 
      order.ORDEN.toLowerCase().includes(searchLower) || 
      order.EMAIL.toLowerCase().includes(searchLower) || 
      `${order.NOMBRE} ${order.APELLIDOS}`.toLowerCase().includes(searchLower) ||
      (order.TELEFONO && order.TELEFONO.includes(params.search || ''))
    );
  }
  
  // Apply store filter if provided
  if (params.store && params.store.length > 0) {
    filteredOrders = filteredOrders.filter(order => 
      order.TIENDA.toLowerCase() === params.store!.toLowerCase()
    );
  }
  
  // Apply sorting if provided
  if (params.sortBy) {
    filteredOrders.sort((a, b) => {
      let aValue: string | number | Date = '';
      let bValue: string | number | Date = '';
      
      switch (params.sortBy) {
        case SortField.ORDEN:
          aValue = a.ORDEN;
          bValue = b.ORDEN;
          break;
        case SortField.SHOP:
          aValue = a.TIENDA;
          bValue = b.TIENDA;
          break;
        case SortField.REGISTERED_AT:
          aValue = new Date(`${a.FECHA_REGISTRO} ${a.HORA_REGISTRO}`);
          bValue = new Date(`${b.FECHA_REGISTRO} ${b.HORA_REGISTRO}`);
          break;
      }
      
      if (aValue === bValue) return 0;
      
      // Handle string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return params.sortOrder === 'desc' 
          ? bValue.localeCompare(aValue) 
          : aValue.localeCompare(bValue);
      }
      
      // Handle date comparison
      if (aValue instanceof Date && bValue instanceof Date) {
        return params.sortOrder === 'desc' 
          ? bValue.getTime() - aValue.getTime() 
          : aValue.getTime() - bValue.getTime();
      }
      
      // Handle number comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return params.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
      }
      
      return 0;
    });
  }
  
  // Calculate pagination
  const startIndex = (params.page - 1) * params.limit;
  const endIndex = startIndex + params.limit;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
  
  return {
    success: true,
    data: paginatedOrders,
    message: 'Orders retrieved successfully',
    meta: {
      statusCode: 200,
      timestamp: new Date().toISOString(),
      pagination: {
        currentPage: params.page,
        itemsPerPage: params.limit,
        totalItems: filteredOrders.length,
        totalPages: Math.ceil(filteredOrders.length / params.limit)
      }
    }
  };
};

// Function to get spoolers
export const getMockSpooler = (): SpoolerResponse => {
  return {
    success: true,
    data: mockSpoolers,
    message: 'Spoolers retrieved successfully',
    meta: {
      statusCode: 200,
      timestamp: new Date().toISOString()
    }
  };
};

// Function to print an order
export const mockPrintOrder = (body: PrintOrderBody): PrintOrderResponse => {
  const order = mockOrders.find(order => order.ORDEN === body.orderNumber);
  
  if (!order) {
    return {
      success: false,
      data: 'Order not found',
      message: `Order ${body.orderNumber} not found`,
      meta: {
        statusCode: 404,
        timestamp: new Date().toISOString()
      }
    };
  }
  
  // Check if order has already been printed and force print is not enabled
  if (order.PRINT === 1 && !body.forcePrint) {
    return {
      success: false,
      data: 'Order already printed',
      message: `Order ${body.orderNumber} has already been printed. Use forcePrint to print again.`,
      meta: {
        statusCode: 400,
        timestamp: new Date().toISOString()
      }
    };
  }
  
  // Simulate successful printing
  order.PRINT = 1;
  
  return {
    success: true,
    data: `Order ${body.orderNumber} sent to printer ${body.spooler}`,
    message: 'Order printed successfully',
    meta: {
      statusCode: 200,
      timestamp: new Date().toISOString()
    }
  };
}; 