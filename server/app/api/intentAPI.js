/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
'use strict';

const intentDAO = require('../DAO/intentDAO');
const error = require('../error/error');
var api = {};

api.listIntents = (req, res) => {
	var nlpId = req.params['nlpId'];
  intentDAO.listIntents(nlpId , (err, intents) => {
		if (err) {
			return err.responseReturnXHR(res, err);
		}
		return error.responseReturnXHR(res, err, intents)
  });
}

api.listEnableIntents = (req, res) => {
	var nlpId = req.params['nlpId'];
	let isEnable = req.params['enable'];

	intentDAO.listEnableIntents(nlpId, isEnable, (err, intents) => {
		if (err) {
			return err.responseReturnXHR(res, err);
		}
		return error.responseReturnXHR(res, err, intents)
	});
}

api.getIntentById = (req, res) => {
  var intentId = req.params['intentId'];
  if (!intentId || intentId=='') {
	  return error.responseReturnXHR(res, {'status': 400, 'returnObj':{'message':'ID da intenção deve ser fornecido.'}});
  }
  intentDAO.getIntentById(intentId, (err, intent) => {
	  if (err) {
			return err.responseReturnXHR(res, err);
		} else if (!intent || intent == [] || intent.length == 0) {
	    err = {'status': 204};
	  }
	  return error.responseReturnXHR(res, err, intent);
  });
}

api.getIntentByName = (req, res) => {
  var intentName = req.params['intentName'];
	var nlpId = req.params['nlpId'];
  if (!intentName || intentName=='') {
	  return error.responseReturnXHR(res, {'status': 400, 'returnObj':{'message':'Nome da intenção deve ser fornecido.'}});
  } else if (!nlpId || nlpId=='') {
	  return error.responseReturnXHR(res, {'status': 400, 'returnObj':{'message':'ID do nlp deve ser fornecido.'}});
  }
  intentDAO.getIntentByName(intentName, nlpId, (err, intent) => {
	  if (err) {
			return err.responseReturnXHR(res, err);
		} else if (!intent || intent == [] || intent.length == 0) {
	    err = {'status': 204};
	  }
	  return error.responseReturnXHR(res, err, intent);
  });
}

api.createIntent = (req, res) => {
  var intent = req.body;
	var nlpId = req.params['nlpId'];
	if (!nlpId) {
		return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'O ID do nlp é requerido.'}});
	} else if (!intent['name']) {
		return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'O nome da intenção é requerida.'}});
	}
	intentDAO.selectCountByName(intent['name'], nlpId, (err, count) => {
    if (err) {
			return error.responseReturnXHR(res, err);
		} else if (count > 0) {
	    return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'Já existe uma intenção com este nome.'}});
    }
    intentDAO.createIntent(intent, nlpId, (err) => {
		  if (err) {
		    return error.responseReturnXHR(res, err);
	 		}
			return error.responseReturnXHR(res, {'status':200, 'returnObj':{'message':'Intenção cadastrada com sucesso.'}});
    });
  });
}

api.deleteIntent = (req, res) => {
  var intentId = req.params['intentId'];
  if (!intentId) {
		return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'ID da intenção deve ser fornecido.'}});
  }
  intentDAO.getIntentById(intentId, (err, intent) => {
    if (err) {
      return err.responseReturnXHR(res, err);
    } else if (!intent || intent == [] || intent.length == 0) {
      return error.responseReturnXHR(res, {'status': 204}, intent);
    }
    intent['removed'] = '1';
    intentDAO.updateIntent(intentId, intent, (err) => {
			if (err) {
				return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'Ocorreu um erro ao remover a intenção.'}});
			}
			return error.responseReturnXHR(res, {'status':200, 'returnObj':{'message':'Intenção removida com sucesso.'}});
		});
  });
}

api.updateIntent = (req, res) => {
	var intent = req.body;
  var intentId = req.params['intentId'];
  if (!intentId) {
		return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'ID da intenção deve ser fornecido.'}});
  }
	intentDAO.selectCountById(intentId, (err, count) => {
    if (err) {
      return error.responseReturnXHR(res, err);
    } else if (count == 0) {
	    return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'Intenção não encontrada.'}});
		}
		intent['removed'] = '0';
		intentDAO.updateIntent(intentId, intent, (err) => {
			if (err) {
				return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'Ocorreu um erro ao modificar a intenção.'}});
			}
			return error.responseReturnXHR(res, {'status':200, 'returnObj':{'message':'Intenção alterada com sucesso.'}});
		});
  });
}

api.listIntentExample = (req, res) => {
	var intentId = req.params['intentId'];
	intentDAO.listIntentExample(intentId , (err, intentsExample) => {
		if (err) {
			return error.responseReturnXHR(res, err);
		}
		return error.responseReturnXHR(res, err, intentsExample)
  });
}

api.createIntentExample = (req, res) => {
  var intentExample = req.body;
	var nlpId = req.params['nlpId'];
  if (!intentExample['text']) {
		return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'O texto do exemplo de intenção é requerido.'}});
	}
	intentDAO.selectCountExampleByText(intentExample['text'], nlpId, (err, count) => {
    if (err) {
			return error.responseReturnXHR(res, err);
		} else if (count > 0) {
	    return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'Já existe um exemplo de intenção com este nome.'}});
    }
    intentDAO.createIntentExample(intentExample, nlpId, (err) => {
		  if (err) {
		    return error.responseReturnXHR(res, err);
	 		}
			return error.responseReturnXHR(res, {'status':200, 'returnObj':{'message':'Exemplo de intenção cadastrada com sucesso.'}});
    });
  });
}

api.deleteIntentExample = (req, res) => {
	var intentExampleId = req.params['exampleId'];
  if (!intentExampleId || intentExampleId.trim() == '') {
		return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'ID do exemplo de intenção deve ser fornecido.'}});
	}
  intentDAO.getExampleById(intentExampleId, (err, example) => {
    if (err) {
      return error.responseReturnXHR(res, err);
    } else if (!example) {
      return error.responseReturnXHR(res, {'status': 204}, example);
    }
		intentDAO.deleteIntentExample(intentExampleId, (err) => {
			if (err) {
				return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'Ocorreu um erro ao deletar o exemplo de intenção.'}});
			}
			return error.responseReturnXHR(res, {'status':200, 'returnObj':{'message':'Intenção removida com sucesso.'}});
		});
  });
}

api.updateIntentExample = (req, res) => {
	var intentExample = req.body;
  var intentExampleId = req.params['intentExampleId'];
  if (!intentExampleId) {
		return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'{{"INTENT.NECESSARY-ID" | translate}}'}});
  }
	intentDAO.selectCountById(intentExampleId, (err, count) => {
    if (err) {
      return error.responseReturnXHR(res, err);
    } else if (count == 0) {
	    return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'{{"INTENTE.NOT-FOUND" | translate}}'}});
    }
		intentDAO.updateIntent(intentExampleId, intentExample, (err) => {
			if (err) {
				return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'{{"INTENT.ERROR-MODIFY" | translate}}'}});
			}
			return error.responseReturnXHR(res, {'status':200, 'returnObj':{'message':'{{"INTENT.CHANGED-SUCCESSFULLY" | translate}}'}});
		});
  });
}

api.checkIntentExample = (req, res) => {
	var intentExample = req.body;
	var nlpId = req.params['nlpId'];
  if (!intentExample['text']) {
		return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'{{"INTENT.TEXT-REQUIRED" | translate}}'}});
	}
	intentDAO.selectCountExampleByText(intentExample['text'], nlpId, function (err, count) {
    if (err) {
			return error.responseReturnXHR(res, err);
		} else if (count > 0) {
	    return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'{{"INTENT.ALREADY-EXISTS" | translate}}'}});
		}
		return error.responseReturnXHR(res, err, count);
  });
}

module.exports = api;
