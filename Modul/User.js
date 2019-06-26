jQuery.sap.require("sap.ui.demo.basicTemplate.db.userService");
var userModul={
	openUserAddDialog:function(_this,functionName) {
		var base=this;
		var fixedSizeDialog = new sap.m.Dialog({
			title: 'Ürün Ekle',
			contentWidth: '550px',
			contentHeight: '300px',
			content:[
				new sap.m.Input('user_name',{
					width:'100%',
					placeholder:'Adı',
					type:'Text',
					autocomplete:false
				}),
				new sap.m.Input('user_surname',{
					width:'100%',
					placeholder:'Soyadı',
					type:'Text',
					autocomplete:false
				}),
				new sap.m.Input('user_idName',{
					width:'100%',
					placeholder:'Kullanıcı adı',
					type:'Text',
					autocomplete:false
				}),
				new sap.m.Input('user_pass',{
					width:'100%',
					placeholder:'Şifre',
					type:'Text',
					autocomplete:false
				}),
				new sap.m.CheckBox('admin',{
					text:'Admin kullanıcı',
					selected:false
				})
			],
			beginButton: new sap.m.Button({
				text: 'Ekle',
				press: function (oEvent) {
					userService.add([
						Math.floor(Math.random(10000)*10000),
						sap.ui.getCore().byId('user_name').getValue(),
						sap.ui.getCore().byId('user_surname').getValue(),
						sap.ui.getCore().byId('user_idName').getValue(),
						sap.ui.getCore().byId('user_pass').getValue(),
						sap.ui.getCore().byId('admin').getSelected() == true ? "1" : "0"
					]);
					base.getUsers(_this,functionName);
					fixedSizeDialog.close();
				}
			}),
			endButton: new sap.m.Button({
				text: 'Kapat',
				press: function () {
					fixedSizeDialog.close();
				}
			}),
			afterClose: function() {
				fixedSizeDialog.destroy();
			}
		});
		fixedSizeDialog.open();
	},
	getUsers:function (_thisU,functionNameU) {
		this[functionNameU](_thisU);
	},
	getAdminPageList:function(_thisAPL) {
		this.getWrite(_thisAPL,'adminPageUserList','/adminPageUserList');
	},
	getWrite:function (_thisWR, _idWR, _propertyWR) {
		var products;
		var oData={
		deneme:{
			'user_name':'',
			'user_surname':'',
			'user_idName':'',
			'id':''
			}
		}
		var oModel = new sap.ui.model.json.JSONModel(oData);
		_thisWR.getView().byId(_idWR).setModel(oModel);
		products = db.select('users');
		products.then(function (dbRespose) {
			oModel.setProperty(_propertyWR,JSON.parse(dbRespose));
		});
	}
}