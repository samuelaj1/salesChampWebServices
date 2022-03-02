const {QueryTypes} = require("sequelize");
const db = require("../models");
const {
    Address
} = require("../models");

const {
    addressValidation
} = require("../validation");

const getAllAddress = async (req, res) => {
    try {
        // check if content was provided and the type is application/json
        let content_type = req.headers['content-type'];
        if (content_type && content_type !== 'application/json') {
            // Send error here
            return res.status(415).json({
                status: false
            });
        } else {
            const addresses = await db.sequelize.query(
                `select * from addresses order by created_at DESC`,
                {
                    type: QueryTypes.SELECT,
                }
            );
            if (addresses) {
                return res.status(200).json({
                    message: "successfully retrieved all addresses",
                    status: true,
                    data: addresses,
                });
            } else {
                return res.status(400).json({
                    status: false,
                });
            }

        }
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

const getAddressById = async (req, res) => {
    try {
        // check if content was provided and the type is application/json
        let content_type = req.headers['content-type'];
        if (content_type && content_type !== 'application/json') {
            // Send error here
            return res.status(415).json({
                status: false
            });
        } else {
            const {id} = req.params;
            // sequelize orm query
            const address = await Address.findOne({
                where: {id}
            });
            //  raw query

            // const address =  await db.sequelize.query(
            //     "select * from addresses WHERE id=:id",
            //     {
            //         type: QueryTypes.SELECT,
            //         replacements: {
            //             id: id,
            //         },
            //         plain: true
            //     }
            // );

            if (address) {
                return res.status(200).json({
                    message: "Successfully retrieved address",
                    status: true,
                    data: address
                });
            } else {
                return res.status(400).json({
                    status: false,
                    message: "Address not found",

                });
            }

        }
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

const postAddress = async (req, res) => {
    try {
        // check if content was provided and the type is application/json
        let content_type = req.headers['content-type'];
        if (content_type && content_type !== 'application/json') {
            // Send error here
            return res.status(415).json({
                status: false
            });
        } else {
            const {name} = req.body;

            //validating data
            const {error} = addressValidation({
                name: name
            });

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message,
                    type: "error",
                });
            }

            const addressExist = await Address.findOne({
                where: {name: name.toLowerCase()},
            });

            if (addressExist) {
                return res
                    .status(400)
                    .json({success: false, message: "Address already exists"});
            }
            const address = await Address.create({name: name});


            if (address) {
                return res.status(200).json({
                    message: "Successfully created address",
                    status: true,
                    data: address
                });
            } else {
                return res.status(400).json({
                    status: false,
                });
            }

        }
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

const deleteAddressById = async (req, res) => {
    try {
        // check if content was provided and the type is application/json
        let content_type = req.headers['content-type'];
        if (content_type && content_type !== 'application/json') {
            // Send error here
            return res.status(415).json({
                status: false
            });
        } else {
            const {id} = req.params;

            //validating id
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Address id is required",
                    type: "error",
                });
            }

            const deletedAddress = await Address.destroy({
                where: {
                    id: id
                }
            })
            if (deletedAddress === 1) {
                return res.status(200).json({
                    message: "Address has been deleted successfully",
                    status: true,
                });
            } else {
                return res.status(400).json({
                    status: false,
                    message: "Address cannot be found"
                });
            }

        }
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

const updateAddress = async (req, res) => {
    try {
        const {id} = req.params;
        const {name} = req.body;

        if(!name){
            return res.status(400).json({
                status: false,
                message: "Name field is required"
            });
        }

        const address = await Address.findOne({
            where: { id },
        });
        if(address){
            const updatedAddress = await address.update({
                name: name
            });
            if (updatedAddress) {
                return res.status(200).json({ status: true, message: "Address has been updated successfully", data: updatedAddress });
            } else {
                return res.status(400).json({ status: false, message: "Could not update address" });
            }

        }else{
            return res.status(400).json({
                status: false,
                message: "Address cannot be found"
            });
        }

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};



module.exports = {
    getAllAddress,
    getAddressById,
    postAddress,
    deleteAddressById,
    updateAddress
};
