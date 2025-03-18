const express = require ('express');
const expressAsyncHandler = require ('express-async-handler');
const Configuration = require ('../models/configurationModel.js');
const { isAuth, isAdmin } = require ('../utils.js');

const configurationRouter = express.Router();

configurationRouter.get('/', async (req, res) => {
  const configurations = await Configuration.find();
  res.send(configurations);
});

configurationRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newConfiguration = new Configuration({
      codCon: 0,
      name: ' ',
      domcomer: ' ',
      cuit: ' ',
      coniva: ' ',
      poriva: 0.00,
      ib: ' ',
      feciniact: ' ',
    });
    const configuration = await newConfiguration.save();
    res.send({ message: 'Configuration Created', configuration });
  })
);

configurationRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const configurationId = req.params.id;
    const configuration = await Configuration.findById(configurationId);
    if (configuration) {
      configuration.codCon = req.body.codCon;
      configuration.name = req.body.name;
      configuration.domcomer = req.body.domcomer;
      configuration.cuit = req.body.cuit;
      configuration.coniva = req.body.coniva;
      configuration.poriva = req.body.poriva;
      configuration.ib = req.body.ib;
      configuration.feciniact = req.body.feciniact;
      await configuration.save();
      res.send({ message: 'Configuration Updated' });
    } else {
      res.status(404).send({ message: 'Configuration Not Found' });
    }
  })
);

configurationRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const configuration = await Configuration.findById(req.params.id);
    if (configuration) {
      await configuration.remove();
      res.send({ message: 'Configuration Deleted' });
    } else {
      res.status(404).send({ message: 'Configuration Not Found' });
    }
  })
);

const PAGE_SIZE = 10;

configurationRouter.get(
  '/admin',
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const configurations = await Configuration.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countConfigurations = await Configuration.countDocuments();
    res.send({
      configurations,
      countConfigurations,
      page,
      pages: Math.ceil(countConfigurations / pageSize),
    });
  })
);

configurationRouter.get('/:id', async (req, res) => {
  const configuration = await Configuration.findById(req.params.id);
  if (configuration) {
    res.send(configuration);
  } else {
    res.status(404).send({ message: 'Configuration Not Found' });
  }
});
module.exports = configurationRouter;
