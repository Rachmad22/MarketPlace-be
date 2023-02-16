const categories = require("../models/category");
const { uploadCloudinary, deleteCloudinary } = require("../utils/cloudinary");
const { checkSizeUpload, checkExtensionFile } = require("../utils/uploadFile");

const getAll = async (req, res) => {
  try {
    const data = await categories.getAll();
    if (data?.length < 1) {
      throw { statusCode: 400, message: "Data doesnt exist!" };
    }

    res.status(200).json({
      status: true,
      message: "Success",
      total: data?.length,
      data: data,
    });
  } catch (error) {
    res.status(error?.statusCode ?? 500).json({
      status: false,
      message: error?.message ?? error,
      total: 0,
      data: [],
    });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await categories.getCategoryById(id);

    if (data.length < 1) {
      throw { statusCode: 400, message: "Data doesnt exist!" };
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

const create = async (req, res) => {
  try {
    const { category_name, category_color } = req.body;
    // check category name is exist?
    const checkCategoryName = await categories.getCategoryByName(category_name);
    if (checkCategoryName.length > 0) {
      throw { statusCode: 409, message: "Category name is already exist!" };
    }

    // deklarasi file image
    let file = req.files?.category_image;
    let filename = null;

    if (!file) {
      throw { statusCode: 409, message: "Category image must be required!" };
    } else {
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
    }

    await categories.create({
      category_name,
      category_image: filename,
      category_color,
    });

    // return response
    res.status(201).json({
      status: true,
      message: "Category is successfully created!",
      data: [],
    });
  } catch (error) {
    res.status(error?.statusCode ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
};

const update = async (req, res) => {
  try {
    const { category_name, category_color } = req.body;
    const { id } = req.params;

    // check category name is exist?
    const checkCategoryName = await categories.getCategoryByName(category_name);
    if (checkCategoryName.length > 0) {
      throw { statusCode: 409, message: "Category name is already exist!" };
    }

    // get data users
    const data = await categories.getCategoryById(id);
    if (data.length < 1) {
      throw { statusCode: 400, message: "Data doesnt exist!" };
    }

    // deklarasi file image
    let file = req.files?.category_image;
    let filename = null;

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
      if (data[0].photo) {
        const deleteFile = await deleteCloudinary(data[0].photo);
        if (!deleteFile.success) {
          throw { statusCode: 400, message: "Delete old file error!" };
        }
      }
    } else {
      filename = data?.[0]?.category_image;
    }

    const dataUpdate = await categories.update({
      id,
      category_name: category_name ?? data?.[0].category_name,
      category_image: filename,
      category_color: category_color ?? data?.[0].category_color,
    });

    // return response
    res.status(200).json({
      status: true,
      message: "Category is successfully updated!",
      data: dataUpdate,
    });
  } catch (error) {
    res.status(error?.statusCode ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await categories.getCategoryById(id);
    if (data.length < 1) {
      throw { statusCode: 400, message: "Data doesnt exist!" };
    }

    if (data.length < 1) {
      throw { statusCode: 400, message: "Data doesnt exist!" };
    } else {
      // delete old photo
      if (data[0]?.category_image) {
        const deleteFile = await deleteCloudinary(data[0].category_image);
        if (!deleteFile.success) {
          throw { statusCode: 400, message: "Delete old photo error!" };
        }
      }
      // delete data from database
      await categories.destroy(id);
    }

    // return response
    res.status(200).json({
      status: true,
      message: "Data successfully deleted!",
    });
  } catch (error) {
    res.status(error?.statusCode ?? 500).json({
      status: false,
      message: error?.message ?? error,
    });
  }
};

module.exports = { getAll, getById, create, update, destroy };
