const products = require("../models/product");
const users = require("../models/users");
const categories = require("../models/category");
const productImages = require("../models/productImage");
const convertData = require("../utils/convertData");
const { checkSizeUpload, checkExtensionFile } = require("../utils/uploadFile");
const { uploadCloudinary, deleteCloudinary } = require("../utils/cloudinary");

const { decodeJwtToken } = require("../utils/jwtToken");

const getAll = async (req, res) => {
  try {
    const data = await products.getAll();
    if (data?.length < 1) {
      res.status(200).json({
        status: true,
        message: "Data doesnt exist!",
        total: 0,
        data: [],
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Success",
        total: data?.length,
        data: data,
      });
    }
  } catch (error) {
    res.status(error?.statusCode ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
};

const getProductsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await products.getProductsByUserId(userId);

    if (data.length < 1) {
      res.status(200).json({
        status: true,
        message: "Data doesnt exist!",
        total: 0,
        data: [],
      });
    }

    res.status(200).json({
      status: true,
      message: "Success",
      data: data,
    });
  } catch (error) {
    res.status(error?.statusCode ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
};

const getProductsByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await categories.getCategoryById(categoryId);
    const data = await products.getProductByCategoryId(categoryId);

    if (data.length < 1) {
      res.status(200).json({
        status: true,
        message: "Data doesnt exist!",
        total: 0,
        data: [],
        category_name: category?.[0]?.category_name ?? "Unknown",
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Success",
        data: data,
        category_name: category?.[0]?.category_name ?? "Unknown",
      });
    }
  } catch (error) {
    res.status(error?.statusCode ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
};

const getProductsById = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { id } = req.params;
    const data = await products.getProductsById(id);

    if (data.length < 1)
      res.status(200).json({
        status: true,
        message: "Data doesnt exist!",
        total: 0,
        data: [],
      });

    //get data user/store
    const dataStore = await users.getUserById(data?.[0]?.user_id);

    // get data category
    const dataCategory = await categories.getCategoryById(
      data?.[0]?.category_id
    );

    // get data category
    const dataProductImages = await productImages.getProductImagesByProductId(
      data?.[0]?.id
    );

    res.status(200).json({
      status: true,
      message: "Success",
      data: {
        product: data,
        store: dataStore,
        category: dataCategory,
        productImages: dataProductImages,
      },
    });
  } catch (error) {
    res.status(error?.statusCode ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
};

const search = async (req, res) => {
  try {
    const { keyword, page, limit, sort } = req.query; // ?keyword=&page=&limit= query params pagination

    const getData = await products.search({
      keyword,
      page,
      limit,
      sort: sort ?? "DESC",
    });

    totalData = getData.length;
    if (totalData < 1) {
      throw { statusCode: 400, message: "Data not found!" };
    }

    res.status(200).json({
      status: true,
      message: "Data retrieved successfully!",
      keyword,
      limit,
      page,
      total: totalData,
      // total_all_data: getData?.[0]?.total_recipes ?? 0,
      data: getData,
    });
  } catch (error) {
    console.log(error);
    res.status(error?.statusCode ?? 500).json({
      status: false,
      message: error?.message ?? error,
    });
  }
};

const uploadImage = async (file) => {
  try {
    let filename = null;
    const checkSize = checkSizeUpload(file);
    if (!checkSize) {
      throw {
        statusCode: 400,
        message: "File upload is too large! only support < 1 MB",
      };
    }

    // check type extension file upload
    const allowedFile = checkExtensionFile(file);
    if (!allowedFile) {
      throw {
        statusCode: 400,
        message: `File is not support! format file must be image`,
      };
    }

    // upload file
    const uploadFile = await uploadCloudinary(file);
    if (!uploadFile.success) {
      throw { statusCode: 400, message: "Upload file error!" };
    } else {
      filename = uploadFile.urlUpload;
    }

    return {
      status: true,
      url: filename,
    };
  } catch (error) {
    return {
      status: false,
      data: {
        message: error,
      },
    };
  }
};

const create = async (req, res) => {
  try {
    const {
      category_id,
      category_gender,
      product_name,
      price,
      condition,
      description,
      stock,
      size = "S,M,L,XL,XXL",
      product_images,
    } = req.body;

    const { authorization } = req.headers;

    const decodedToken = await decodeJwtToken(authorization);

    if (!decodedToken) throw { statusCode: 400, message: "Token Error!" };

    const user_id = decodedToken?.data?.id;

    const checkUser = await users.getUserById(user_id);
    if (checkUser.length < 1)
      throw { statusCode: 400, message: "User not found!" };

    if (checkUser[0].role !== false) {
      throw { statusCode: 401, message: "Only seller can create product!" };
    }

    const checkCategory = await categories.getCategoryById(category_id);
    if (checkCategory.length < 1)
      throw { statusCode: 400, message: "Category not found!" };

    // convert if condition string to bool
    let newCondition = true;
    if (typeof condition === "string") {
      newCondition = convertData.strToBool(condition);
    } else {
      newCondition = condition;
    }

    // create product
    const createData = await products.create({
      user_id,
      category_id,
      category_gender,
      product_name,
      price,
      condition: newCondition,
      description,
      stock,
      size,
    });

    let file = req.files?.product_images;
    let images = [];

    if (file) {
      const fileLength = file.length;
      if (fileLength) {
        // images more than 1
        file.map(async (item, key) => {
          const urlFile = await uploadImage(item);

          // add new images
          await productImages.create({
            product_images: {
              product_id: createData?.[0]?.id,
              image: urlFile.url,
            },
          });
        });
      } else {
        // image only 1
        const urlFile = await uploadImage(file);
        // add new images
        await productImages.create({
          product_images: {
            product_id: createData?.[0]?.id,
            image: urlFile.url,
          },
        });
      }
    } else {
      throw {
        statusCode: 400,
        message: "Product image must be required",
      };
    }

    res.status(201).json({
      status: true,
      message: "Data is successfully created!",
      data: createData,
    });
  } catch (error) {
    console.log(error);
    res.status(error?.statusCode ?? 500).json({
      status: false,
      message: error?.message ?? error,
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      category_id,
      category_gender,
      product_name,
      price,
      condition,
      description,
      stock,
      size = "S,M,L,XL,XXL",
      product_images,
    } = req.body;

    const { authorization } = req.headers;
    const decodedToken = await decodeJwtToken(authorization);
    if (!decodedToken) throw { statusCode: 400, message: "Token Error!" };
    const user_id = decodedToken?.data?.id;

    const checkUser = await users.getUserById(user_id);
    if (checkUser.length < 1)
      throw { statusCode: 400, message: "User not found!" };

    const checkProduct = await products.getProductsById(id);
    if (checkProduct.length < 1)
      throw { statusCode: 400, message: "Product not found!" };

    // convert if condition string to bool
    let newCondition = true;
    if (typeof condition === "string") {
      newCondition = convertData.strToBool(condition);
    } else {
      newCondition = condition;
    }

    // create product images
    if (product_images) {
      const newProductImages = await product_images.map(async (item) => {
        // deklarasi file image
        let file = req.files?.photo;
        let filename = null;

        // if file upload exist
        if (file) {
          // check size file upload
          const checkSize = checkSizeUpload(file);
          if (!checkSize) {
            throw {
              statusCode: 400,
              message: "File upload is too large! only support < 1 MB",
            };
          }

          // check type extension file upload
          const allowedFile = checkExtensionFile(file);
          if (!allowedFile) {
            throw {
              statusCode: 400,
              message: `File is not support! format file must be image`,
            };
          }

          // upload file
          const uploadFile = await uploadCloudinary(file);
          if (!uploadFile.success) {
            throw { statusCode: 400, message: "Upload file error!" };
          } else {
            filename = uploadFile.urlUpload;
          }

          // delete old file
          if (getUser[0].photo) {
            const deleteFile = await deleteCloudinary(getUser[0].photo);
            if (!deleteFile.success) {
              throw { statusCode: 400, message: "Delete old file error!" };
            }
          }
        }

        return {
          product_id: id,
          image: item,
        };
      });

      //delete old images
      await productImages.destroyByProductId(id);

      // add new images
      await productImages.create({ product_images: newProductImages });
    }
  } catch (error) {}
};

module.exports = {
  getAll,
  getProductsByUserId,
  getProductsById,
  search,
  create,
  getProductsByCategoryId,
  update,
};
