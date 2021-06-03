const router = require("express").Router();
const Category = require("../models/Category");
// const {categories} = require("../controllers/category-controller");
// Import controllers
const {
	getOne,
	getAll,
	update,
// 	deleteOne,
	create
} = require("../controllers/category-controller");
//  * Create New
router.post('/new',create);
// * GET ONE
router.get("/:id", getOne);

// * GET ALL
router.get("/",getAll);

// * UPDATE
router.post("/:id", update);

// // * DELETE
// router.delete("/:id", Category.deleteOne);

module.exports = router;
