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

                this._dialogBaixaEstoque = sap.ui.xmlfragment("view.Cadastro", this)
    			if (this.getView().$().closest(".sapUiSizeCompact").length > 0){
    				this._dialogBaixaEstoque.addStyleClass("sapUiSizeCompact") 
    			} else { 
    				this._dialogBaixaEstoque.addStyleClass("sapUiSizeCozy")
    			}
            	
            	this.getView().addDependent(this._dialogBaixaEstoque)
            	
            	this._dialogBaixaEstoque.open()
            },

            onConfirmar : function(oEvent){

            },

            onCancelar : function(oEvent){

            },

            onAfterClose : function(oEvent){
                
            }

        });
    });
