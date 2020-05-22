const router = require("express").Router();
const db = require("../data/dbConfig");
const { Validator } = require("jsonschema");
const { catchAsync, AppError } = require("./errors");

const validateID = catchAsync(validateCarID);
/*----------------------------------------------------------------------------*/
/* GET
/*----------------------------------------------------------------------------*/
router.get(
  "/",
  catchAsync(async (req, res) => {
    res.status(200).json(await db("cars"));
  })
);

router.get("/:id", validateID, (req, res) => {
  res.status(200).json(req.car);
});

/*----------------------------------------------------------------------------*/
/* POST
/*----------------------------------------------------------------------------*/
router.post(
  "/",
  validateCar,
  catchAsync(async (req, res) => {
    const [result] = await db("cars").insert(req.body, ["id"]);
    //Extract id from PSQL's returned object
    //Or use id returned plainly from SQLite
    const id = result.id || result;
    id
      ? res.status(201).json(await db("cars").where({ id }))
      : next(new AppError("Database error while inserting the entry", 500));
  })
);

/*----------------------------------------------------------------------------*/
/* Middleware
/*----------------------------------------------------------------------------*/

//Don't call directly! Wrap in catchAsync before using
async function validateCarID(req, res, next) {
  const { id } = req.params;
  //cars are returned as an array - we just want the first entry
  const [car] = await db("cars").where({ id });
  req.car = car;
  car ? next() : next(new AppError(`${id} is not a valid car ID`, 404));
}

const carSchema = {
  type: "object",
  properties: {
    vin: {
      type: "string",
      maxLength: 32,
    },
    make: {
      type: "string",
    },
    model: {
      type: "string",
    },
    mileage: {
      type: "number",
    },
    transmission_type: {
      type: "string",
      enum: ["manual", "automatic", null],
    },
    title_status: {
      type: "string",
    },
  },
  additionalProperties: false,
  required: ["vin", "make", "model", "mileage"],
};

function validateCar(req, res, next) {
  const v = new Validator();
  const { errors } = v.validate(req.body, carSchema);
  errors.length !== 0 ? next(errors) : next();
}

module.exports = router;
