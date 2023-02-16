const ProductsModel = require('../models/products.model')

class ProductManagerMongo {
  addProduct = async (product) => {
    const productAdded = await ProductsModel.create(product)
    return productAdded
  }

  getProducts = async (page = 1, limit = 10, sort = '', query = {}) => {
    return await ProductsModel.paginate(query, { page, limit, sort: { price: `${sort}` } })
  }

  getById = async (id) => {
    return await ProductsModel.findById(id)
  }

  updateProduct = async (id, newProduct) => {
    const modified = await ProductsModel.updateOne({ _id: id }, newProduct)
    if (modified.modifiedCount == 1) {
      return true
    } else {
      return false
    }
  }

  deleteProduct = async (id) => {
    const deleted = await ProductsModel.deleteOne({ _id: id })
    if (deleted == 1) {
      return true
    } else {
      return false
    }
  }
}

module.exports = new ProductManagerMongo()
