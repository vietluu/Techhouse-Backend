const APIError = require('../utils/error');
const {
  dataInMemory: frozenData,
  getMultiObjectSubset,
  getObjectSubset,
  limitArray,
} = require('../utils/util');

const model = require('../models/product');

const controller = {};

// get all products
controller.getAllProducts = async ({ limit, skip, select }) => {
  let [...products] = await model.find();
  const total = products.length;

  if (skip > 0) {
    products = products.slice(skip);
  }

  products = limitArray(products, limit);

  if (select) {
    products = getMultiObjectSubset(products, select);
  }

  const result = { products, total, skip, limit: products.length };

  return result;
};

// search products
controller.searchProducts = async ({ limit, skip, select, q: searchQuery }) => {
  let [...products] = await model.find(
    { title: { $regex: `${searchQuery}`, $options: 'i' } },
    (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      return results;
    },
  );
  const total = products.length;

  if (skip > 0) {
    products = products.slice(skip);
  }

  products = limitArray(products, limit);

  if (select) {
    products = getMultiObjectSubset(products, select);
  }

  const result = { products, total, skip, limit: products.length };

  return result;
};

// get product categories
controller.getProductCategories = () => {
  const categories = frozenData.products.map(p => p.category);

  const uniqueCategories = [...new Set(categories)];

  return uniqueCategories;
};

// get product by id
controller.getProductById = ({ id, select }) => {
  const productFrozen = frozenData.products.find(p => p.id.toString() === id);

  if (!productFrozen) {
    throw new APIError(`Product with id '${id}' not found`, 404);
  }

  let { ...product } = productFrozen;

  if (select) {
    product = getObjectSubset(product, select);
  }

  return product;
};

// get products by categoryName
controller.getProductsByCategoryName = ({ categoryName = '', ..._options }) => {
  const { limit, skip, select } = _options;

  let [...products] = frozenData.products.filter(
    p => p.category.toLowerCase() === categoryName.toLowerCase(),
  );
  const total = products.length;

  if (skip > 0) {
    products = products.slice(skip);
  }

  products = limitArray(products, limit);

  if (select) {
    products = getMultiObjectSubset(products, select);
  }

  const result = { products, total, skip, limit: products.length };

  return result;
};

// add new product
controller.addNewProduct = async ({ ...data }) => {
  const {
    title,
    price,
    stock,
    rating,
    images,
    thumbnail,
    description,
    brand,
    category,
  } = data;

  const newProduct = {
    title,
    price,
    stock,
    rating,
    images,
    thumbnail,
    description,
    brand,
    category,
  };
  const result = await model.create(newProduct);
  console.log(result);
  return result;
};

// update product by id
controller.updateProductById = ({ id, ...data }) => {
  const {
    title,
    price,
    stock,
    rating,
    images,
    thumbnail,
    description,
    brand,
    category,
  } = data;

  const productFrozen = frozenData.products.find(p => p.id.toString() === id);

  if (!productFrozen) {
    throw new APIError(`Product with id '${id}' not found`, 404);
  }

  const updatedProduct = {
    id: +id, // converting id to number
    title: title || productFrozen.title,
    price: price || productFrozen.price,
    stock: stock || productFrozen.stock,
    rating: rating || productFrozen.rating,
    images: images || productFrozen.images,
    thumbnail: thumbnail || productFrozen.thumbnail,
    description: description || productFrozen.description,
    brand: brand || productFrozen.brand,
    category: category || productFrozen.category,
  };

  return updatedProduct;
};

// delete product by id
controller.deleteProductById = ({ id }) => {
  const productFrozen = frozenData.products.find(p => p.id.toString() === id);

  if (!productFrozen) {
    throw new APIError(`Product with id '${id}' not found`, 404);
  }

  const { ...product } = productFrozen;

  product.isDeleted = true;
  product.deletedOn = new Date().toISOString();

  return product;
};

module.exports = controller;
