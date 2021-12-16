sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator", 
    "sap/m/BusyDialog"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,MessageBox,Filter,FilterOperator,BusyDialog) {
        "use strict";

        return Controller.extend("AppFioriAlunoXX.appfiorialunoxx.controller.Main", {

            onInit: function () {
                this.oGlobalArray   = []
                this.oExcludedArray = []
                this.oFieldScreen   = new JSONModel({ btnsVisible : false, btnEditVisible : true });
                this.oConsModel     = new JSONModel({ CadastroSet : [], aExcluded : []});
                this.BusyDialog     = new BusyDialog( )              
                 
                this.getView().setModel(this.oCadastroModel,"oCadastrosModel"); 
                this.getView().setModel(this.oFieldScreen,"oFieldScreen");
                this.oConsModel.updateBindings(true);
                this.oFieldScreen.updateBindings(true);    
            },

            onSearch:function(oEvent){
	
                let Cpf       = oEvent.getParameter('selectionSet')[0].getValue().length ? oEvent.getParameter('selectionSet')[0].getValue()     : undefined
                let Nome      = oEvent.getParameter('selectionSet')[1].getValue().length ? oEvent.getParameter('selectionSet')[1].getValue()     : undefined
                let Sobrenome = oEvent.getParameter('selectionSet')[2].getValue().length ? oEvent.getParameter('selectionSet')[2].getValue()     : undefined
                let DataNasc  = oEvent.getParameter('selectionSet')[3].getDateValue()    ? oEvent.getParameter('selectionSet')[3].getDateValue() : undefined

                let aFilter   = []
                if(Cpf)       aFilter.push( new Filter('Cpf', FilterOperator.Contains, Cpf))
                if(Nome)      aFilter.push( new Filter('Nome', FilterOperator.Contains, Nome))
                if(Sobrenome) aFilter.push( new Filter('Sobrenome', FilterOperator.Contains, Sobrenome))
                if(DataNasc)  aFilter.push( new Filter('DataNascimento', FilterOperator.EQ, DataNasc))

                this.getView().byId('idCadastroTable').getBinding('items').filter(aFilter)
                this.getView().byId('idCadastroTable').updateBindings(true)
                //this.getOwnerComponent().getModel('oCadastroModel').getBindings('/CadastroSet')[0].filter(aFilter)
                //this.getOwnerComponent().getModel('oCadastroModel').updateBindings(true)
            },

            onAdd : function(oEvent){

                this.oCadastroModelLine = new sap.ui.model.json.JSONModel({ Cpf: '', Nome: '', Sobrenome: '', Email:'', Telefone:'', DataNascimento : new Date()})
                this.getView().setModel(this.oCadastroModelLine, 'oCadastroModelLine')
                this.oCadastroModelLine.updateBindings(true)

                this.onOpenDialog()
            },

            onEdit : function(oEvent){
                
                let aSelectedContexts = this.getView().byId('idCadastroTable').getSelectedContextPaths();
                
                if(aSelectedContexts.length){
                    let oModel = this.getView().getModel('oCadastroModel').getObject(aSelectedContexts[0])
                    this.oCadastroModelLine = new sap.ui.model.json.JSONModel(oModel)
                    this.getView().setModel(this.oCadastroModelLine, 'oCadastroModelLine')
                    this.oCadastroModelLine.updateBindings(true)
                    this.onOpenDialog()
                } 
            },

            onOpenDialog : function(){
                this._dialogCadastro = sap.ui.xmlfragment("AppFioriAlunoXX.appfiorialunoxx.view.Cadastro", this)
    			if (this.getView().$().closest(".sapUiSizeCompact").length > 0){
    				this._dialogCadastro.addStyleClass("sapUiSizeCompact") 
    			} else { 
    				this._dialogCadastro.addStyleClass("sapUiSizeCozy")
    			}
            	
            	this.getView().addDependent(this._dialogCadastro)
            	
            	this._dialogCadastro.open()
            },

            onConfirmar : function(oEvent){

                let oModelSend = this.oCadastroModelLine.getData()
        	
                this.getOwnerComponent().getModel('oCadastroModel').create('/CadastroSet',oModelSend,{
                    success:function(oData,oResponse){
                        //dialog.close()
                        //this.onClearMessage()
                        oData.ReturnMessageSet.results.forEach(item=>{
                            //this.onMessage(this,item.Type === 'S' ? sap.ui.core.MessageType.Success : sap.ui.core.MessageType.Error, item.Message)
                            //this.getView().getModel("oMessage").updateBindings()
                            
                        })
                    }.bind(this),
                    error:function(oData,oResponse){
                       // dialog.close()
                    }.bind(this)
                })	

                this._dialogCadastro.close()
            },

            onCancelar : function(oEvent){
                this._dialogCadastro.close()
            },

            onAfterClose : function(oEvent){
                this._dialogCadastro.destroy()
            }

        });
    });
