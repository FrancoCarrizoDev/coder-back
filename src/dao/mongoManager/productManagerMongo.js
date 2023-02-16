const ProductsModel = require('../models/products.model')

class ProductManagerMongo {
  addProduct = async (product) => {
    return await ProductsModel.create(product)
    
  }

  getProducts = async (page = 1, limit = 10, sort = '', query = {}) => {
    return await ProductsModel.paginate(query, { page, limit, sort: { price: `${sort}` } })
  }

  getById = async (id) => {
    return await ProductsModel.findById(id)
  }

  updateProduct = async (id, newProduct) => {
    return await ProductsModel.updateOne({ _id: id }, newProduct)
    
  }

  deleteProduct = async (id) => {
    return await ProductsModel.deleteOne({ _id: id })
    
  }
}

module.exports = new ProductManagerMongo()
