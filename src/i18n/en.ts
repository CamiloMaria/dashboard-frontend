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
        }
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
  }
}; 