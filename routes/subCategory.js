const router = require("express").Router();


const {
	getOne,
	getAll,
	update,
	deleteOne,
	create
} = require("../controllers/subCategory-controller");
//  * Create New
router.post('/new',create);
// * GET ONE
router.get("/:id", getOne);

// * GET ALL
router.get("/",getAll);

// * UPDATE
router.post("/:id", update);

// * DELETE
router.delete("/:id",deleteOne);
module.exports = router;
