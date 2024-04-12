const express = require ('express');
const expressAsyncHandler = require ('express-async-handler');
const StateOrd = require ('../models/stateOrdModel.js');
const { isAuth, isAdmin } = require ('../utils.js');

const stateOrdRouter = express.Router();

stateOrdRouter.get('/', async (req, res) => {
  const stateOrds = await StateOrd.find().sort({ name: 1 });
  res.send(stateOrds);
});

stateOrdRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newStateOrd = new StateOrd({
      name: 'State Ord ' + Date.now(),
      note: 'Note ?????????????',
    });
    const stateOrd = await newStateOrd.save();
    res.send({ message: 'State Order Created', stateOrd });
  })
);

stateOrdRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const stateOrdId = req.params.id;
    const stateOrd = await StateOrd.findById(stateOrdId);
    if (stateOrd) {
      stateOrd.name = req.body.name;
      stateOrd.note = req.body.note;
      await stateOrd.save();
      res.send({ message: 'State Order Updated' });
    } else {
      res.status(404).send({ message: 'State Order Not Found' });
    }
  })
);

stateOrdRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const stateOrd = await StateOrd.findById(req.params.id);
    if (stateOrd) {
      await stateOrd.remove();
      res.send({ message: 'State Order Deleted' });
    } else {
      res.status(404).send({ message: 'State Order Not Found' });
    }
  })
);

const PAGE_SIZE = 10;

stateOrdRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const stateOrds = await StateOrd.find()
      .sort({ name: 1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countStateOrds = await StateOrd.countDocuments();
    res.send({
      stateOrds,
      countStateOrds,
      page,
      pages: Math.ceil(countStateOrds / pageSize),
    });
  })
);

stateOrdRouter.get('/:id', async (req, res) => {
  const stateOrd = await StateOrd.findById(req.params.id);
  if (stateOrd) {
    res.send(stateOrd);
  } else {
    res.status(404).send({ message: 'State Order Not Found' });
  }
});

module.exports = stateOrdRouter;
