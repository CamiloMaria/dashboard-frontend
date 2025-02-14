export const es = {
  common: {
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    add: 'Agregar',
    search: 'Buscar',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    theme: {
      light: 'Claro',
      dark: 'Oscuro',
      system: 'Sistema'
    },
    languages: {
      en: 'Inglés',
      es: 'Español'
    },
    profile: {
      profile: 'Perfil',
      settings: 'Configuración',
      logout: 'Cerrar Sesión'
    },
    sidebar: {
      dashboard: 'Dashboard',
      inventory: {
        root: 'Inventario',
        products: 'Productos',
        promotions: 'Promociones',
        productSets: 'Set de Productos',
        createProducts: 'Crear Productos',
        editProducts: 'Editar Productos',
        createProductSets: 'Crear Sets'
      },
      orders: 'Ordenes',
      permissions: 'Permisos',
      example: 'Ejemplo'
    }
  },
  products: {
    title: 'Productos',
    basicInfo: 'Información Básica',
    specifications: 'Especificaciones',
    description: 'Descripción',
    keywords: 'Palabras Clave',
    catalog: 'Catálogo',
    active: 'Activo',
    inactive: 'Inactivo',
    disableReason: 'Razón de Desactivación',
    disabledShops: 'Tiendas Desactivadas',
    updating: 'Actualizando producto...',
    editor: {
      new: {
        title: 'Nuevo Producto',
        subtitle: 'Crear un nuevo producto'
      },
      edit: {
        title: 'Editar Producto',
        subtitle: 'Actualizar información y configuración del producto'
      },
      backToProducts: 'Volver a Productos',
      form: {
        productName: 'Nombre del Producto',
        securityStock: {
          label: 'Stock de Seguridad',
          description: 'Establece el nivel mínimo de stock para las alertas de inventario. Cuando el stock cae por debajo de este umbral, el sistema mostrará advertencias de stock bajo.'
        },
        activeStatus: {
          label: 'Estado Activo',
          description: 'Activar o desactivar este producto',
          disableReason: 'Razón de Desactivación:',
          disabledShops: 'Desactivado en Tiendas:'
        },
        tabs: {
          catalog: 'Catálogo',
          specifications: 'Especificaciones',
          description: 'Descripción',
          keywords: 'Palabras Clave'
        }
      }
    },
    list: {
      title: 'Productos',
      subtitle: 'Gestiona tu inventario y configuración de productos',
      addProduct: 'Agregar Producto',
      settings: 'Configuración',
      searchPlaceholder: 'Buscar por SKU, título o material...',
      columns: {
        thumbnail: 'Miniatura',
        sku: 'SKU',
        title: 'Título',
        material: 'Material',
        bigItem: 'Big Item',
        status: 'Estado',
        date: 'Fecha',
        actions: 'Acciones'
      },
      pagination: {
        itemsPerPage: 'Items por página',
        page: 'Página',
        of: 'de'
      },
      row: {
        yes: 'Sí',
        no: 'No',
        active: 'Activo',
        inactive: 'Inactivo',
        edit: 'Editar',
        delete: 'Eliminar'
      },
      loadingError: 'Error al cargar productos',
      tryAgain: 'Intentar de Nuevo',
      deleteConfirmation: {
        title: '¿Estás seguro de que quieres eliminar este producto?',
        description: 'Esta acción no se puede deshacer. Esto eliminará permanentemente el producto "{product}" y eliminará sus datos del servidor.',
        loading: 'Cargando...'
      }
    }
  },
  validation: {
    required: 'Este campo es requerido',
    invalidFile: 'Tipo de archivo inválido',
    fileTooLarge: 'Archivo demasiado grande',
  },
  messages: {
    productUpdated: 'Producto actualizado exitosamente',
    productDeleted: 'Producto eliminado exitosamente',
    updateError: 'Error al actualizar el producto',
    deleteError: 'Error al eliminar el producto',
  }
}; 