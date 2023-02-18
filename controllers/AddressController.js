const addresses = require("../models/address");
const { decodeJwtToken } = require("../utils/jwtToken");

const getAll = async (req, res) => {
  try {
    const data = await addresses.getAll();
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

const create = async (req, res) => {
  try {
    const {
      address_alias,
      recipient_name,
      recipient_phone_number,
      street,
      city,
      postal_code,
      is_primary,
      user_id,
    } = req.body;

    await addresses.create({
      address_alias,
      recipient_name,
      recipient_phone_number,
      street,
      city,
      postal_code,
      is_primary,
      user_id,
    });

    // return response
    res.status(201).json({
      status: true,
      message: "Address is successfully added!",
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

const getAddressByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await addresses.getAddressByUserId(userId);

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

const getAddressById = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { id } = req.params;
    const data = await addresses.getAddressById(id);

    const decodedToken = await decodeJwtToken(authorization);

    if (!decodedToken) throw { statusCode: 400, message: "Token Error!" };

    const user_id = decodedToken?.data?.id;

    if (user_id !== data?.[0]?.user_id)
      throw { statusCode: 400, message: "You dont have access for this data!" };

    if (data.length < 1)
      throw { statusCode: 400, message: "Data doesnt exist!" };

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

const update = async (req, res) => {
  try {
    const {
      address_alias,
      recipient_name,
      recipient_phone_number,
      street,
      city,
      postal_code,
      is_primary,
    } = req.body;

    const { id } = req.params;
    const { authorization } = req.headers;

    const data = await addresses.getAddressById(id);
    if (data.length < 1) {
      throw { statusCode: 400, message: "Data doesnt exist!" };
    }

    const decodedToken = await decodeJwtToken(authorization);

    if (!decodedToken) throw { statusCode: 400, message: "Token Error!" };

    const user_id = decodedToken?.data?.id;

    if (user_id !== data?.[0]?.user_id)
      throw { statusCode: 400, message: "You dont have access for this data!" };

    const dataUpdate = await addresses.update({
      id,
      address_alias: address_alias ?? data?.[0]?.address_alias,
      recipient_name: recipient_name ?? data?.[0]?.recipient_name,
      recipient_phone_number:
        recipient_phone_number ?? data?.[0]?.recipient_phone_number,
      street: street ?? data?.[0]?.street,
      city: city ?? data?.[0]?.city,
      postal_code: postal_code ?? data?.[0]?.postal_code,
      is_primary: is_primary ?? data?.[0]?.is_primary,
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

const destroyById = async (req, res) => {
  try {
    const { id } = req.params;
    const { authorization } = req.headers;

    const data = await addresses.getAddressById(id);
    if (data.length < 1) {
      throw { statusCode: 400, message: "Data doesnt exist!" };
    }

    const decodedToken = await decodeJwtToken(authorization);

    if (!decodedToken) throw { statusCode: 400, message: "Token Error!" };

    const user_id = decodedToken?.data?.id;

    if (user_id !== data?.[0]?.user_id)
      throw { statusCode: 400, message: "You dont have access for this data!" };

    // delete data from database
    await addresses.destroyById(id);

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

const destroyByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const data = await addresses.getAddressByUserId(userId);
    if (data.length < 1) {
      throw { statusCode: 400, message: "Data doesnt exist!" };
    }

    // delete data from database
    await addresses.destroyByUserId(userId);

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

module.exports = {
  getAll,
  create,
  getAddressByUserId,
  getAddressById,
  destroyById,
  destroyByUserId,
  update,
};
