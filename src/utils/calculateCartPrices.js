const ProductManager = require('../dao/Mongo Manager/productManagerMongo')

const calculateCartTotal = (products) => {
    return products.reduce(
        (acc, curr) => acc + curr.unitValue * curr.quantity,
        0
    )
}

const mapProductCart = async({products}) => {
    let productsToAdd = []

    for (const idProduct of products) {
        const indexProduct = productsToAdd.findIndex(({product} ) => product === idProduct)

        if (indexProduct === -1) {
            const productDb = await ProductManager.getProductById(idProduct)

            if (productDb) {
                productsToAdd.push({
                    product: idProduct,
                    quantity: 1,
                    unitValue: productDb.price,
                })
            }
        } else {
            productsToAdd[indexProduct].quantity++
        }
    }

    return productsToAdd;
}

module.exports = {
    calculateCartTotal,
    mapProductCart
}