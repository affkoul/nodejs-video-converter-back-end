const router = require("express").Router();
const converter = require("../controller/convert");

router.route("/convert")
.post(converter.convertVideo);

module.exports = router;
