export const en = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    active: 'Active',
    inactive: 'Inactive',
    theme: {
      light: 'Light',
      dark: 'Dark',
      system: 'System'
    },
    languages: {
      en: 'English',
      es: 'Spanish'
    },
    profile: {
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout'
    },
    sidebar: {
      dashboard: 'Dashboard',
      inventory: {
        root: 'Inventory',
        products: 'Products',
        promotions: 'Promotions',
        productSets: 'Product Sets',
        createProducts: 'Create Products',
        editProducts: 'Edit Products',
        createProductSets: 'Create Product Sets'
      },
      orders: 'Orders',
      permissions: 'Permissions',
      example: 'Example'
    }
  },
  products: {
    title: 'Products',
    basicInfo: 'Basic Information',
    specifications: 'Specifications',
    description: 'Description',
    keywords: 'Keywords',
    catalog: 'Catalog',
    active: 'Active',
    inactive: 'Inactive',
    disableReason: 'Disable Reason',
    disabledShops: 'Disabled Shops',
    updating: 'Updating product...',
    editor: {
      new: {
        title: 'New Product',
        subtitle: 'Create a new product'
      },
      edit: {
        title: 'Edit Product',
        subtitle: 'Update product information and settings'
      },
      backToProducts: 'Back to Products',
      form: {
        productName: 'Product Name',
        securityStock: {
          label: 'Security Stock',
          description: 'Set the minimum stock level for inventory alerts. When stock falls below this threshold, the system will display low stock warnings.'
        },
        activeStatus: {
          label: 'Active Status',
          description: 'Enable or disable this product',
          disableReason: 'Disable Reason:',
          disabledShops: 'Disabled in Shops:'
        },
        tabs: {
          catalog: 'Catalog',
          specifications: 'Specifications',
          description: 'Description',
          keywords: 'Keywords'
        },
        specifications: {
          title: 'Product Specifications',
          subtitle: 'Add or modify product specifications like dimensions, materials, etc.',
          titlePlaceholder: 'e.g. Material, Weight, Dimensions',
          descriptionPlaceholder: 'e.g. 100% Cotton, 1.5kg, 10x20x30cm',
          titleTooLong: 'Title too long (max 50 chars)',
          count: 'specifications',
          noSpecifications: 'No specifications added yet',
          addSpecificationsHint: 'Add specifications using the form below',
          addNew: 'Add New Specification',
          addSpecification: 'Add Specification',
          updateSpecification: 'Update Specification',
          editSpecification: 'Edit specification',
          deleteSpecification: 'Delete specification',
          deleteDialog: {
            title: 'Delete Specification',
            description: 'Are you sure you want to delete this specification? This action cannot be undone.'
          }
        },
        info: {
          notSet: 'Not set',
          sku: 'SKU',
          brand: 'Brand',
          unit: 'Unit',
          category: 'Category',
          bigItem: 'Big Item',
          withoutStock: 'Without Stock',
          department: 'Department',
          group: 'Group'
        },
        inventory: {
          searchPlaceholder: 'Search centers...',
          columns: {
            center: 'Center',
            stock: 'Stock',
            price: 'Price',
            previousPrice: 'Previous Price',
            status: 'Status'
          },
          noInventory: 'No inventory found',
          adjustSearch: 'Try adjusting your search',
          stats: {
            totalStock: {
              title: 'Total Stock',
              description: 'Across all centers'
            },
            lowStock: {
              title: 'Low Stock Alerts',
              description: 'Below {{stock}} units'
            },
            activeListings: {
              title: 'Active Listings',
              description: 'Out of {{total}} total'
            },
            priceTrend: {
              title: 'Price Trend',
              description: 'Average price change'
            }
          },
          title: 'Inventory'
        },
        images: {
          imageCount: 'Image {{current}} of {{total}}',
          noImages: 'No Images',
          uploadHint: 'Click to upload an image',
          uploadRequirements: 'JPG, PNG (max 5MB)',
          replaceImage: 'Replace Image',
          addImage: 'Add Image',
          deleteImage: 'Delete Current',
          moveUp: 'Move Up',
          moveDown: 'Move Down',
          deleteDialog: {
            title: 'Delete Image',
            description: 'Are you sure you want to delete this image? This action cannot be undone.'
          },
          validation: {
            invalidType: 'Invalid file type',
            invalidTypeDescription: 'Please select an image file (JPG, PNG, etc.)',
            tooLarge: 'File too large',
            tooLargeDescription: 'Please select an image under 5MB'
          },
          success: {
            added: 'Image added',
            addedDescription: 'The image has been added successfully.',
            replaced: 'Image replaced',
            replacedDescription: 'The image has been replaced successfully.'
          }
        },
        description: {
          title: 'Product Description',
          subtitle: 'Edit the product description using the rich text editor',
          generateButton: 'Generate Description',
          generating: 'Generating...',
          saveChanges: 'Save Changes',
          toolbar: {
            bold: 'Bold',
            italic: 'Italic',
            underline: 'Underline',
            alignLeft: 'Align left',
            alignCenter: 'Align center',
            alignRight: 'Align right',
            bulletList: 'Bullet list',
            numberedList: 'Numbered list'
          },
          generateDialog: {
            title: 'Generate Description',
            description: 'This will generate a new product description based on the product information. The current description will be replaced. Do you want to continue?',
            confirmText: 'Generate'
          },
          messages: {
            saved: 'Description saved',
            savedDescription: 'The product description has been updated successfully.',
            generated: 'Description generated',
            generatedDescription: 'A new product description has been generated successfully.',
            error: 'Error',
            errorDescription: 'Failed to generate description. Please try again.',
            error400: 'The title is required to generate a description.'
          }
        },
        keywords: {
          title: 'Product Keywords',
          subtitle: 'Manage search keywords for this product',
          generateButton: 'Generate Keywords',
          generating: 'Generating...',
          addPlaceholder: 'Add new keyword...',
          addButton: 'Add',
          removeTooltip: 'Remove keyword',
          messages: {
            duplicate: 'Duplicate keyword',
            duplicateDescription: 'This keyword already exists.',
            added: 'Keyword added',
            addedDescription: 'The keyword has been added successfully.',
            removed: 'Keyword removed',
            removedDescription: 'The keyword has been removed successfully.',
            generated: 'Keywords generated',
            generatedDescription: 'New keywords have been generated successfully.',
            error: 'Error',
            errorDescription: 'Failed to generate keywords. Please try again.',
            error400: 'The title is required to generate keywords.'
          },
          generateDialog: {
            title: 'Generate Keywords',
            description: 'This will generate new keywords based on the product information. The current keywords will be replaced. Do you want to continue?',
            confirmText: 'Generate',
          },
        },
      }
    },
    list: {
      title: 'Products',
      subtitle: 'Manage your product inventory and settings',
      addProduct: 'Add Product',
      settings: 'Settings',
      searchPlaceholder: 'Search by SKU, title, or material...',
      columns: {
        thumbnail: 'Thumbnail',
        sku: 'SKU',
        title: 'Title',
        material: 'Material',
        bigItem: 'Big Item',
        status: 'Status',
        date: 'Date',
        actions: 'Actions'
      },
      pagination: {
        itemsPerPage: 'Items per page',
        page: 'Page',
        of: 'of'
      },
      row: {
        yes: 'Yes',
        no: 'No',
        active: 'Active',
        inactive: 'Inactive',
        edit: 'Edit',
        delete: 'Delete'
      },
      loadingError: 'Failed to load products',
      tryAgain: 'Try Again',
      deleteConfirmation: {
        title: 'Are you sure you want to delete this product?',
        description: 'This action cannot be undone. This will permanently delete the product "{{product}}" and remove its data from the server.',
        loading: 'Loading...'
      }
    }
  },
  promotions: {
    title: 'Promotions',
    searchPlaceholder: 'Search by promo number, SKU, or material...',
    exportCSV: 'Export CSV',
    error: {
      title: 'Failed to load promotions',
      description: 'There was an error loading the promotions. Please try again or contact support if the problem persists.',
      tryAgain: 'Try Again'
    },
    columns: {
      promoNumber: 'Promo Number',
      sku: 'SKU',
      material: 'Material',
      shop: 'Shop',
      price: 'Price',
      comparePrice: 'Compare Price',
      status: 'Status',
      createdAt: 'Created At'
    }
  },
  validation: {
    required: 'This field is required',
    invalidFile: 'Invalid file type',
    fileTooLarge: 'File is too large',
  },
  messages: {
    productUpdated: 'Product updated successfully',
    productDeleted: 'Product deleted successfully',
    updateError: 'Failed to update product',
    deleteError: 'Failed to delete product',
  },
  productSets: {
    title: 'Product Sets',
    addSet: 'Add Set',
    searchPlaceholder: 'Search by SKU or title...',
    error: {
      title: 'Failed to load product sets',
      description: 'There was an error loading the product sets. Please try again or contact support if the problem persists.',
      tryAgain: 'Try Again'
    },
    noSets: {
      title: 'No product sets found',
      withSearch: 'No product sets match your search criteria. Try adjusting your search terms.',
      withoutSearch: 'There are no product sets available at the moment.'
    },
    columns: {
      setSku: 'Set SKU',
      title: 'Title',
      price: 'Price',
      area: 'Area',
      createdAt: 'Created At',
      updatedAt: 'Updated At'
    },
    expandedView: {
      productsInSet: 'Products in Set',
      productInfo: {
        sku: 'SKU',
        grupo: 'Group',
        depto: 'Dept'
      }
    },
    create: {
      title: 'Create Product Set',
      setTitle: {
        label: 'Set Title',
        placeholder: 'Enter set title...'
      },
      selectedProducts: {
        title: 'Selected Products',
        empty: {
          title: 'No products selected',
          description: 'Select products from the table below to create a set'
        },
        freeProduct: 'Free Product',
        remove: 'Remove',
        isFree: 'Is Free'
      },
      searchProducts: {
        placeholder: 'Search products by SKU or title...'
      },
      validation: {
        selectionLimit: {
          title: 'Selection limit reached',
          description: 'A product set can only contain 2 products.'
        },
        invalidSelection: {
          title: 'Invalid selection',
          description: 'All products in a set must be from the same grupo.'
        },
        invalidCount: {
          title: 'Invalid selection',
          description: 'Please select exactly 2 products for the set.'
        },
        missingTitle: {
          title: 'Missing title',
          description: 'Please enter a title for the product set.'
        }
      },
      success: {
        title: 'Product set created',
        description: 'The product set has been created successfully.'
      },
      buttons: {
        cancel: 'Cancel',
        create: 'Create Set'
      }
    }
  }
}; 