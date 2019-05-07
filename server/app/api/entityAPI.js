/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
'use strict';

const entityDAO = require('../DAO/entityDAO');
const error = require('../error/error');
var api = {};

api.listEntities = (req, res) => {
    var nlpId = req.params['nlpId'];
    let page = req.query['page']
    entityDAO.listEntities(nlpId , page, (err, entities) => {
		if (err) {
			return err.responseReturnXHR(res, err);
		}
		return error.responseReturnXHR(res, err, entities)
  });
}

api.countEntities = (req ,res) =>{
    let nlpId = req.params['nlpId'];
    entityDAO.countEntities(nlpId, (err, count)=>{
        if (err) {
			return err.responseReturnXHR(res, err);
		}
		return error.responseReturnXHR(res, null, count)
    })
}

api.listSystemEntities = (req, res) => {
    entityDAO.listSystemEntities((err, entities) => {
        if (err) {
            return err.responseReturnXHR(res, err);
		}
		return error.responseReturnXHR(res, err, entities);
    });
}

api.createEntity = (req, res) => {
    var entity = req.body;
    var nlpId = req.params['nlpId'];
    if (!nlpId) {
		return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'O ID do nlp é requerido.'}});
	} else if (!entity['name']) {
		return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'O nome da entidade é requerida.'}});
    }
    entityDAO.selectCountByName(entity['name'], nlpId, (err, count)=> {
    if (err) {
        return error.responseReturnXHR(res, err);
    } else if (count>0) {
        return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'Já existe uma entidade com este nome.'}})
    }
    entityDAO.createEntity(entity, nlpId, (err)=> {
        if(err) {
            return error.responseReturnXHR(res, err);
        }
        return error.responseReturnXHR(res, {'status':200, 'returnObj': {'message':"{{'ENTITY.CREATING' | translate}}"}});
    })
    });
}

api.deleteEntity = (req, res)=> {
    var entityId = req.params['entityId'];
    if (!entityId) {
        return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'ID da entidade deve ser fornecido.'}});
    }
    entityDAO.getEntityById(entityId, (err, entity)=> {
        if(err) {
            return err.responseReturnXHR(res, err);
        } else if (!entity || entity==[] || entity.length==0) {
            return error.responseReturnXHR(res, {'status': 204}, entity);
        }
        entity['removed'] = '1';
        entityDAO.updateEntity(entityId, entity, (err)=> {
            if (err) {
				return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'Ocorreu um erro ao remover a entidade.'}});
			}
			return error.responseReturnXHR(res, {'status':200, 'returnObj':{'message':"{{'ENTITY.DELETING' | translate}}"}});
        });
    });
}

api.deleteSynonym = (req, res) => {
    
    var simpleId = req.params['simpleId'];
    var name = req.params['synonymName'];
    if (!simpleId) {
        return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'ID da entidade deve ser fornecido.'}});
    }
    entityDAO.getSynonym(simpleId, name, (err, entity)=> {
        if(err) {
            return err.responseReturnXHR(res, err);
        } else if (!entity || entity==[] || entity.length==0) {
            return error.responseReturnXHR(res, {'status': 204}, entity);
        }
        entity['removed'] = '1';
        entityDAO.updateSynonym(name, entity, (err)=> {
            if (err) {
				return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'Ocorreu um erro ao remover a entidade.'}});
			}
			return error.responseReturnXHR(res, {'status':200, 'returnObj':{'message':'Entidade removida com sucesso.'}});
        })
    })
}

api.deleteSimple = (req, res) => {
    var simpleId = req.params['simpleId'];
    if (!simpleId) {
        return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'ID da entidade deve ser fornecido.'}});
    }
    entityDAO.getSimpleById(simpleId, (err, entity)=> {
        if(err) {
            return err.responseReturnXHR(res, err);
        } else if (!entity || entity==[] || entity.length==0) {
            return error.responseReturnXHR(res, {'status': 204}, entity);
        }
        entity['removed'] = '1';
        entityDAO.updateSimple(simpleId, entity, (err)=> {
            if (err) {
				return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'Ocorreu um erro ao remover a entidade.'}});
			}
			return error.responseReturnXHR(res, {'status':200, 'returnObj':{'message':'Entidade removida com sucesso.'}});
        })
    })
}

api.getEntityByName = (req, res) => {
    var entityName = req.params['entityName'];
      var nlpId = req.params['nlpId'];
    if (!entityName || entityName=='') {
        //return error.responseReturnXHR(res, {'status': 400, 'returnObj':{'message':'Nome da entidade deve ser fornecido.'}});
        return error.responseReturnXHR(res, {'status': 400, 'returnObj':{'message':'Nome da entidade deve ser fornecido.'}});
    } else if (!nlpId || nlpId=='') {
        //return error.responseReturnXHR(res, {'status': 400, 'returnObj':{'message':'ID do nlp deve ser fornecido.'}});
        return error.responseReturnXHR(res, {'status': 400, 'returnObj':{'message':"{{'ENTITY.NLP-ID-NULL-ERROR' | translate}}"}});
    }
    entityDAO.getEntityByName(entityName, nlpId, (err, entity) => {
        if (err) {
              return err.responseReturnXHR(res, err);
          } else if (!entity || entity == [] || entity.length == 0) {
          err = {'status': 204};
        }
        return error.responseReturnXHR(res, err, entity);
    });
  }

api.createEntitySimple = (req, res) => {
    var entitySimple = req.body;
    var nlpId = req.params['nlpId'];
    if (!entitySimple['value']) {
        return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':"{{'ENTITY.CREATE-SIMPLE-NO-TEXT-ERROR' | translate}}"}});
    }
    entityDAO.selectCountSimpleByText(entitySimple['value'], (err, count)=> {
        if(err) {
            return error.responseReturnXHR(res, err);
        } else if (count > 0) {
            //return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'Já existe um valor da entidade com este nome.'}});
            return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':"{{'ENTITY.CREATE-SIMPLE-DUPLICATE-ERROR' | translate}}"}});
        }
    entityDAO.createEntitySimple(entitySimple, nlpId, (err) => {
        if(err) {
            return error.responseReturnXHR(res, err);
        }
        //return error.responseReturnXHR(res, {'status':200, 'returnObj':{'message':'Valor da entidade cadastrada com sucesso.'}});
        return error.responseReturnXHR(res, {'status':200, 'returnObj':{'message':"{{'ENTITY.CREATE-SIMPLE-SUCCESS' | translate}}"}});
    });
    });
}

api.getSimpleByName = (req, res) => {
    console.log('here');
    var simpleName = req.params['simpleName'];
    console.log('SIMPLE NAME: '+simpleName);
    if (!simpleName || simpleName=='') {
        //return error.responseReturnXHR(res, {'status': 400, 'returnObj':{'message':'Nome da simple deve ser fornecido.'}});
        return error.responseReturnXHR(res, {'status': 400, 'returnObj':{'message':"{{'ENTITY.SIMPLE-NAME-NULL-ERROR' | translate}}"}});
    } 
    entityDAO.getSimpleByName(simpleName, (err, entitySimple) => {
        if (err) {
              return err.responseReturnXHR(res, err);
          } else if (!entitySimple || entitySimple == [] || entitySimple.length == 0) {
          err = {'status': 204};
        }
        return error.responseReturnXHR(res, err, entitySimple);
    });
}

api.createEntitySynonym = (req, res) => {
    var entitySynonym = req.body;
    if (!entitySynonym['text']) {
        //return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'O texto da entidade de intenção é requerido.'}});
        return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':"{{'ENTITY.CREATE-SYNONYM-NO-TEXT-ERROR' | translate}}"}});
    }
    entityDAO.selectCountSynonymByText(entitySynonym['text'], (err, count)=> {
        if(err) {
            return error.responseReturnXHR(res, err);
        } else if (count > 0) {
            //return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'Já existe um valor da entidade com este nome.'}});
            return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':"{{'ENTITY.CREATE-SYNONYM-DUPLICATE-ERROR' | translate}}"}});
        }
    entityDAO.createEntitySynonym(entitySynonym, (err) => {
        if(err) {
            return error.responseReturnXHR(res, err);
        }
        //return error.responseReturnXHR(res, {'status':200, 'returnObj':{'message':'Valor da entidade cadastrada com sucesso.'}});
        return error.responseReturnXHR(res, {'status':200, 'returnObj':{'message':"{{'ENTITY.CREATE-SYNONYM-SUCCESS' | translate}}"}});
    });
    });
}

api.listSimples = (req, res) => {
    var entityId = req.params['entityId'];
    entityDAO.listSimples(entityId , (err, entities) => {
		if (err) {
			return err.responseReturnXHR(res, err);
		}
		return error.responseReturnXHR(res, err, entities);
  });
}

api.listSynonyms = (req, res) => {
    var simpleId = req.params['simpleId'];
    entityDAO.listSynonyms(simpleId, (err, entities) => {
        if(err) {
            return err.responseReturnXHR(res, err);
		}
		return error.responseReturnXHR(res, err, entities);
    });
}

api.updateSimple = (req, res) => {
    var simpleId = req.params['simpleId'];
    var data = req.body;
    if (!simpleId) {
        //return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'ID da intenção deve ser fornecido.'}});
        return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':"{{'ENTITY.ENTITY-SIMPLE-ID-NULL-ERROR' | translate}}"}});
    }
    entityDAO.getSimpleById(simpleId, (err, entity)=> {
        if(err) {
            return err.responseReturnXHR(res, err);
        } else if (!entity || entity==[] || entity.length==0) {
            return error.responseReturnXHR(res, {'status': 204}, entity);
        }
        entity['name'] = data['value'];
        entityDAO.updateSimple(simpleId, entity, (err)=> {
            if (err) {
                //return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'Ocorreu um erro ao remover a entidade.'}});
                return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':"{{'ENTITY.UPDATING-SIMPLE-ERROR' | translate}}"}});
			}
            //return error.responseReturnXHR(res, {'status':200, 'returnObj':{'message':'Entidade removida com sucesso.'}});
            return error.responseReturnXHR(res, {'status':200, 'returnObj':{'message':"{{'ENTITY.UPDATE-SIMPLE-SUCCESS' | translate}}"}});
        })
    })
}

api.updateEntity = (req, res) => {
    var entityId = req.params['entityId'];
    var data = req.body;
    if (!entityId) {
        return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':"{{'ENTITY.ENTITY-ID-NULL-ERROR' | translate}}"}});
    }
    entityDAO.getEntityById(entityId, (err, entity)=> {
        if(err) {
            return err.responseReturnXHR(res, err);
        } else if (!entity || entity==[] || entity.length==0) {
            return error.responseReturnXHR(res, {'status': 204}, entity);
        }
        entity['name'] = data['name'];
        entity['type'] = data['type'];
        entity['pattern'] = data['pattern'];
        entityDAO.updateEntity(entityId, entity, (err)=> {
            if (err) {
                //return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'Ocorreu um erro ao remover a entidade.'}});
                return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':"{{'ENTITY.UPDATE-ERROR' | translate}}"}});
            }
			return error.responseReturnXHR(res, {'status':200, 'returnObj':{'message':"{{'ENTITY.UPDATE-SUCCESS' | translate}}"}});
        })
    })
}

api.updateSystemEntity = (req, res) => {
    var data = req.body;
    var entityId = data['id'];
    if (!entityId) {
        //return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'ID da intenção deve ser fornecido.'}});
        return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':"{{'ENTITY.SYSTEM-ENTITY-ID-NULL-ERROR' | translate}}"}});
    }
    entityDAO.getSystemEntityById(entityId, (err, entity)=> {
        if(err) {
            return err.responseReturnXHR(res, err);
        } else if (!entity || entity==[] || entity.length==0) {
            return error.responseReturnXHR(res, {'status': 204}, entity);
        }
        entity['enabled'] = data['enabled'];
        entityDAO.updateSystemEntity(entityId, entity, (err)=> {
            if (err) {
                //return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':'Ocorreu um erro ao remover a entidade.'}});
                return error.responseReturnXHR(res, {'status':400, 'returnObj':{'message':"{{'ENTITY.UPDATE-SYSTEM-ENTITY-ERROR' | translate}}"}});
            }
        })
    })
}

module.exports = api;