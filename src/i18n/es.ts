export const es = {
    common: {
        save: 'Guardar',
        confirm: 'Confirmar',
        cancel: 'Cancelar',
        delete: 'Eliminar',
        edit: 'Editar',
        add: 'Agregar',
        search: 'Buscar',
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        active: 'Activo',
        inactive: 'Inactivo',
        theme: {
            title: 'Tema',
            light: 'Claro',
            dark: 'Oscuro',
            system: 'Sistema'
        },
        languages: {
            title: 'Idiomas',
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
            logs: 'Logs de Usuarios',
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
                productNamePlaceholder: 'Ingresa el nombre del producto...',
                securityStock: {
                    label: 'Stock de Seguridad',
                    description: 'Establece el nivel mínimo de stock para las alertas de inventario. Cuando el stock cae por debajo de este, el sistema mostrará advertencias de stock bajo y se desactivará el producto en las tiendas.'
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
                },
                specifications: {
                    title: 'Especificaciones del Producto',
                    subtitle: 'Agregar o modificar especificaciones del producto como dimensiones, materiales, etc.',
                    titlePlaceholder: 'ej. Material, Peso, Dimensiones',
                    descriptionPlaceholder: 'ej. 100% Algodón, 1.5kg, 10x20x30cm',
                    titleTooLong: 'Título demasiado largo (máx. 50 caracteres)',
                    count: 'especificaciones',
                    noSpecifications: 'No hay especificaciones agregadas',
                    addSpecificationsHint: 'Agrega especificaciones usando el formulario de abajo',
                    addNew: 'Agregar Nueva Especificación',
                    addSpecification: 'Agregar Especificación',
                    updateSpecification: 'Actualizar Especificación',
                    editSpecification: 'Editar especificación',
                    deleteSpecification: 'Eliminar especificación',
                    deleteDialog: {
                        title: 'Eliminar Especificación',
                        description: '¿Estás seguro de que quieres eliminar esta especificación? Esta acción no se puede deshacer.'
                    }
                },
                info: {
                    notSet: 'No establecido',
                    sku: 'SKU',
                    brand: 'Marca',
                    unit: 'Unidad',
                    category: 'Categoría',
                    bigItem: 'Big Item',
                    withoutStock: 'Vender sin Stock',
                    department: 'Departamento',
                    group: 'Grupo'
                },
                inventory: {
                    title: 'Inventario',
                    searchPlaceholder: 'Buscar centros...',
                    columns: {
                        center: 'Centro',
                        stock: 'Stock',
                        price: 'Precio',
                        previousPrice: 'Precio Anterior',
                        status: 'Estado'
                    },
                    noInventory: 'No se encontró inventario',
                    adjustSearch: 'Intenta ajustar tu búsqueda',
                    stats: {
                        totalStock: {
                            title: 'Stock Total',
                            description: 'En todos los centros'
                        },
                        lowStock: {
                            title: 'Alertas de Stock Bajo',
                            description: 'Por debajo de {{stock}} unidades'
                        },
                        activeListings: {
                            title: 'Listados Activos',
                            description: 'De {{total}} en total'
                        },
                        priceTrend: {
                            title: 'Tendencia de Precio',
                            description: 'Cambio promedio de precio'
                        }
                    },
                    disable: {
                        title: 'Desactivar Inventario',
                        description: 'Desactivar inventario para este producto en la tienda seleccionada.',
                        reasonLabel: 'Razón',
                        selectReason: 'Selecciona una razón',
                        disableReason: 'Razón de Desactivación',
                    }
                },
                images: {
                    imageCount: 'Imagen {{current}} de {{total}}',
                    noImages: 'Sin Imágenes',
                    uploadHint: 'Haz clic para subir una imagen',
                    uploadRequirements: 'JPG, PNG (máx 5MB)',
                    replaceImage: 'Reemplazar Imagen',
                    addImage: 'Agregar Imagen',
                    deleteImage: 'Eliminar Actual',
                    moveUp: 'Mover Arriba',
                    moveDown: 'Mover Abajo',
                    deleteDialog: {
                        title: 'Eliminar Imagen',
                        description: '¿Estás seguro de que quieres eliminar esta imagen? Esta acción no se puede deshacer.'
                    },
                    validation: {
                        invalidType: 'Tipo de archivo inválido',
                        invalidTypeDescription: 'Por favor selecciona un archivo de imagen (JPG, PNG, etc.)',
                        tooLarge: 'Archivo demasiado grande',
                        tooLargeDescription: 'Por favor selecciona una imagen menor a 5MB'
                    },
                    success: {
                        added: 'Imagen agregada',
                        addedDescription: 'La imagen ha sido agregada exitosamente.',
                        replaced: 'Imagen reemplazada',
                        replacedDescription: 'La imagen ha sido reemplazada exitosamente.'
                    }
                },
                description: {
                    title: 'Descripción del Producto',
                    subtitle: 'Edita la descripción del producto usando el editor de texto enriquecido',
                    generateButton: 'Generar Descripción',
                    generating: 'Generando...',
                    saveChanges: 'Guardar Cambios',
                    toolbar: {
                        bold: 'Negrita',
                        italic: 'Cursiva',
                        underline: 'Subrayado',
                        alignLeft: 'Alinear a la izquierda',
                        alignCenter: 'Centrar',
                        alignRight: 'Alinear a la derecha',
                        bulletList: 'Lista con viñetas',
                        numberedList: 'Lista numerada'
                    },
                    generateDialog: {
                        title: 'Generar Descripción',
                        description: 'Esto generará una nueva descripción del producto basada en la información del producto. La descripción actual será reemplazada. ¿Deseas continuar?',
                        confirmText: 'Generar'
                    },
                    messages: {
                        saved: 'Descripción guardada',
                        savedDescription: 'La descripción del producto ha sido actualizada exitosamente.',
                        generated: 'Descripción generada',
                        generatedDescription: 'Una nueva descripción del producto ha sido generada exitosamente.',
                        error: 'Error',
                        errorDescription: 'Error al generar la descripción. Por favor intenta de nuevo.',
                        error400: 'El título es requerido para generar una descripción.',
                    }
                },
                keywords: {
                    title: 'Palabras Clave',
                    subtitle: 'Gestiona las palabras clave de búsqueda para este producto',
                    generateButton: 'Generar Palabras Clave',
                    generating: 'Generando...',
                    addPlaceholder: 'Agregar nueva palabra clave...',
                    addButton: 'Agregar',
                    removeTooltip: 'Eliminar palabra clave',
                    empty: 'No hay palabras clave agregadas',
                    messages: {
                        duplicate: 'Palabra clave duplicada',
                        duplicateDescription: 'Esta palabra clave ya existe.',
                        added: 'Palabra clave agregada',
                        addedDescription: 'La palabra clave ha sido agregada exitosamente.',
                        removed: 'Palabra clave eliminada',
                        removedDescription: 'La palabra clave ha sido eliminada exitosamente.',
                        generated: 'Palabras clave generadas',
                        generatedDescription: 'Las nuevas palabras clave han sido generadas exitosamente.',
                        error: 'Error',
                        errorDescription: 'Error al generar palabras clave. Por favor intenta de nuevo.',
                        error400: 'El título es requerido para generar palabras clave.',
                    },
                    generateDialog: {
                        title: 'Generar Palabras Clave',
                        description: 'Esto generará nuevas palabras clave basadas en el título y categoría del producto. Las palabras clave actuales serán reemplazadas. ¿Deseas continuar?',
                        confirmText: 'Generar',
                    },
                },
            }
        },
        list: {
            title: 'Productos',
            subtitle: 'Gestiona tu inventario y configuración de productos',
            addProduct: 'Agregar Producto',
            settings: 'Configuración',
            searchPlaceholder: 'Buscar por SKU, título o material...',
            loading: 'Cargando productos...',
            filters: {
                title: 'Filtros',
                status: 'Estado',
                active: 'Activo',
                inactive: 'Inactivo',
                type: 'Tipo',
                bigItems: 'Big Items',
                clear: 'Limpiar',
            },
            sort: {
                title: 'Ordenar',
                date: 'Fecha',
                productTitle: 'Título',
            },
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
                of: 'de',
                showing: 'Mostrando'
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
                description: 'Esta acción no se puede deshacer. Esto eliminará permanentemente el producto "{{product}}" y eliminará sus datos del servidor.',
                loading: 'Cargando...'
            },
            errorDescription: 'Error al cargar productos. Por favor intenta de nuevo o contacta a soporte si el problema persiste.'
        }
    },
    promotions: {
        title: 'Promociones',
        searchPlaceholder: 'Buscar por número de promoción, SKU o material...',
        exportCSV: 'Exportar CSV',
        error: {
            title: 'Error al cargar promociones',
            description: 'Hubo un error al cargar las promociones. Por favor intenta de nuevo o contacta a soporte si el problema persiste.',
            tryAgain: 'Intentar de Nuevo'
        },
        columns: {
            productTitle: 'Título del Producto',
            promoNumber: 'Número de Promoción',
            sku: 'SKU',
            material: 'Material',
            shop: 'Tienda',
            price: 'Precio',
            comparePrice: 'Precio Anterior',
            status: 'Estado',
            createdAt: 'Fecha de Creación'
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
    },
    productSets: {
        title: 'Sets de Productos',
        addSet: 'Agregar Set',
        searchPlaceholder: 'Buscar por SKU o título...',
        error: {
            title: 'Error al cargar sets de productos',
            description: 'Hubo un error al cargar los sets de productos. Por favor intenta de nuevo o contacta a soporte si el problema persiste.',
            tryAgain: 'Intentar de Nuevo'
        },
        noSets: {
            title: 'No se encontraron sets de productos',
            withSearch: 'No hay sets de productos que coincidan con tu búsqueda. Intenta ajustar los términos de búsqueda.',
            withoutSearch: 'No hay sets de productos disponibles en este momento.'
        },
        columns: {
            setSku: 'SKU del Set',
            title: 'Título',
            price: 'Precio',
            area: 'Área',
            createdAt: 'Fecha de Creación',
            updatedAt: 'Fecha de Actualización'
        },
        expandedView: {
            productsInSet: 'Productos en el Set',
            productInfo: {
                sku: 'SKU',
                grupo: 'Grupo',
                depto: 'Depto'
            }
        },
        create: {
            title: 'Crear Set de Productos',
            setTitle: {
                label: 'Título del Set',
                placeholder: 'Ingresa el título del set...'
            },
            selectedProducts: {
                title: 'Productos Seleccionados',
                empty: {
                    title: 'No hay productos seleccionados',
                    description: 'Selecciona productos de la tabla de abajo para crear un set'
                },
                freeProduct: 'Producto Gratis',
                remove: 'Eliminar',
                isFree: 'Es Gratis'
            },
            searchProducts: {
                placeholder: 'Buscar productos por SKU o título...'
            },
            validation: {
                selectionLimit: {
                    title: 'Límite de selección alcanzado',
                    description: 'Un set de productos solo puede contener 2 productos.'
                },
                invalidSelection: {
                    title: 'Selección inválida',
                    description: 'Todos los productos en un set deben ser del mismo grupo.'
                },
                invalidCount: {
                    title: 'Selección inválida',
                    description: 'Por favor selecciona exactamente 2 productos para el set.'
                },
                missingTitle: {
                    title: 'Falta el título',
                    description: 'Por favor ingresa un título para el set de productos.'
                }
            },
            success: {
                title: 'Set de productos creado',
                description: 'El set de productos ha sido creado exitosamente.'
            },
            buttons: {
                cancel: 'Cancelar',
                create: 'Crear Set'
            }
        }
    },
    orders: {
        title: 'Órdenes',
        subtitle: 'Ver y gestionar órdenes de clientes',
        searchPlaceholder: 'Buscar órdenes...',
        filterByStore: 'Filtrar por tienda',
        allStores: 'Todas las Tiendas',
        export: 'Exportar',
        error: 'Error al cargar órdenes',
        columns: {
            orderNumber: 'Orden #',
            customer: 'Cliente',
            rnc: 'RNC',
            total: 'Total',
            source: 'Origen',
            ptlog: 'SAP',
            store: 'Tienda',
            date: 'Fecha'
        },
        details: {
            title: 'Detalles de la Orden',
            billingInformation: 'Información de Facturación',
            shippingInformation: 'Información de Envío',
            items: 'Artículos',
            invoices: 'Facturas',
            transactions: 'Transacciones',
            columns: {
                sku: 'SKU',
                description: 'Descripción',
                quantity: 'Cantidad',
                price: 'Precio',
                discount: 'Descuento',
                total: 'Total',
                invoiceNumber: 'Factura #',
                department: 'Departamento',
                ncf: 'NCF',
                itbis: 'ITBIS',
                card: 'Tarjeta',
                approval: 'Aprobación',
                date: 'Fecha',
                time: 'Hora',
                amount: 'Monto'
            }
        }
    }
}; 