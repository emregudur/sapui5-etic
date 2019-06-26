jQuery.sap.require("sap.ui.demo.basicTemplate.Modul.Product")
sap.ui.define([
		'jquery.sap.global',
		'sap/m/MessageToast',
		'sap/ui/core/Fragment',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/Filter',
		'sap/ui/model/json/JSONModel',
		'sap/base/Log',
		'sap/m/Button',
		'sap/m/Dialog',
		'sap/m/List',
		'sap/m/StandardListItem'
	], function(jQuery, MessageToast, Fragment, Controller, Filter, JSONModel, Log, Button, Dialog, List, StandardListItem) {
	"use strict";
	var base;
	var CController = Controller.extend("sap.ui.demo.basicTemplate.controller.App", {

		
		onInit: function(){
			db.d("select * from products").then(function(res) {
				if (res) {
					
				}
			})
			base=this;
			if (sessionStorage.getItem("user_id")!==null) {
				this.getView().byId('headerButtons').mAggregations["items"][0].setVisible(false);
				this.getView().byId('headerButtons').mAggregations["items"][1].setVisible(true);
			}else{
				this.getView().byId('headerButtons').mAggregations["items"][0].setVisible(true);
				this.getView().byId('headerButtons').mAggregations["items"][1].setVisible(false);
			}
			this.getSplitAppObj().setHomeIcon({
				'phone':'phone-icon.png',
				'tablet':'tablet-icon.png',
				'icon':'desktop.ico'
			});

			pr.getUrun('',this,'getHomePageList');
			// var products = db.select('products',"","");
			// products.then(function (dbRespose) {
			// 	oModel.setProperty("/deneme",JSON.parse(dbRespose));
			// });
		},
		imgPressEvents:function (oEvent) {
			var id=oEvent.getSource().data("key");
			var oData={
				deneme:{
					'p_id':'',
					'srcImg':'',
					'p_name':'',
					'p_title':'',
					'p_text':'',
					'p_price':''
				}
			}
			var oModel = new JSONModel(oData);
			this.getView().byId('listDetailPage').setModel(oModel);
			var product = db.select('products',"p_id",id);
			var item=this.getView().byId('detailDetail');
			product.then(function (dbRespose) {
				oModel.setProperty("/p_detail",JSON.parse(dbRespose));
				item.setTitle(JSON.parse(dbRespose)[0].p_title);
			});
			this.getSplitAppObj().to(this.createId("detailDetail"));
		},
		onOrientationChange: function(oEvent) {
			var bLandscapeOrientation = oEvent.getParameter("landscape"),
				sMsg = "Orientation now is: " + (bLandscapeOrientation ? "Landscape" : "Portrait");
			MessageToast.show(sMsg, {duration: 5000});
		},

		onPressNavToDetail : function(oEvent) {
			this.getSplitAppObj().to(this.createId("detailDetail"));
		},

		loginStart: function (oEvent) {
				var fixedSizeDialog = new sap.m.Dialog({
					title: 'Giriş',
					contentWidth: '550px',
					contentHeight: '300px',
					content:[
						new sap.m.Input('kullaniciadi',{
							width:'100%',
							placeholder:'Kullanıcı Adı',
							type:'Text',
							autocomplete:false
						}),
						new sap.m.Input('sifre',{
							width:'100%',
							placeholder:'Şifre',
							type:'Password',
							autocomplete:false
						})
					],
					beginButton: new sap.m.Button({
						text: 'Giriş yap',
						press: function () {
							var id = sap.ui.getCore().byId('kullaniciadi').getValue();
							var pwd = sap.ui.getCore().byId('sifre').getValue();
							var returnDB=db.select('users','user_idName',''+id+'');
							returnDB.then(function (dbRespose) {
								var dbR=JSON.parse(dbRespose);
								if (Object.keys(dbR).length!==0 && id==dbR[0].user_idName) {
									if (pwd==dbR[0].user_pass) {
										sap.m.MessageToast.show("Giriş başarılı.");
										sessionStorage.setItem('user_id',dbR[0].id);
										base.getView().byId('headerButtons').mAggregations["items"][0].setVisible(false);
										base.getView().byId('headerButtons').mAggregations["items"][1].setVisible(true);
										if (dbR[0].admin=="1") {
											base.getOwnerComponent().getRouter().navTo("admin");
										}
										fixedSizeDialog.close();
									}else{
										sap.m.MessageToast.show("Şifre yanlış!");	
									}
								}else{
									sap.m.MessageToast.show("Böyle bir kullanıcı bulunamadı!");
								}
							});
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
		addCart:function(oEvent){
			var buttonID = sap.ui.getCore().byId(oEvent.mParameters.id).getCustomData()[0].getValue();
			if (sessionStorage.getItem('user_id')!=null) {
				sepet.add(buttonID,sessionStorage.getItem('user_id'));
				sap.m.MessageToast.show('Ürün sepete eklendi');
			}else{
				sap.m.MessageToast.show('Önce giriş yapın!');
			}
		},
		logOut:function () {
			sessionStorage.removeItem('user_id');
			location.reload();
		},
		openCart:function(){
			var box = new sap.m.VBox('_sepet',{
		        items: {
		          path: '/sepetData',
		          template: new sap.m.VBox({
		          	items: [
		          		new sap.m.Text({text:'{p_title}'}),
		          		new sap.m.Text({text:'{p_name}'}),
		          		new sap.m.Image({src:'data:image/png;base64,{srcImg}',width:'100px'}),
		          		new sap.m.Button({
		          			text:'Sil',
		          			customData:new sap.ui.core.CustomData({
		          				key:'id',
		          				value:'{id}'
		          			}),		
		          		
			          		press:function(oEvent) {
								var buttonID = sap.ui.getCore().byId(this.sId).getCustomData()[0].getValue();
								sepet.remove(buttonID);
								pr.getSepetList();
			          		}
			          	}),
		          	]
		          }),
		          
		        }
		    });

			pr.getSepetList();

			var fixedSizeDialog = new sap.m.Dialog({
				title: 'Sepet',
				contentWidth: '550px',
				contentHeight: '300px',
				content: new sap.m.List({
					items: new sap.m.CustomListItem({
						content: box
					})
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

		onPressDetailBack : function() {
			this.getSplitAppObj().backDetail();
		},

		onPressMasterBack : function() {
			this.getSplitAppObj().backMaster();
		},

		onPressGoToMaster : function() {
			this.getSplitAppObj().toMaster(this.createId("master2"));
		},

		onPressMasterBack2 : function() {
			this.getSplitAppObj().backMaster();
		},

		onPressGoToMaster2 : function() {
			this.getSplitAppObj().toMaster(this.createId("master3"));
		},
		loadProducts : function (data,base) {
		    pr.getUrun(data,base,'getHomePageList');
		},
		startProductAdd:function() {
			pr.createDialog('',base,'getHomePageList');
		},
		onListItemPress : function(oEvent) {
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();
			var kategoriKey = oEvent.mParameters.listItem.mAggregations.customData[1].mProperties.value;

			this.getView().byId('detail').setTitle(oEvent.getParameter("listItem").mProperties.title);
			
			this.loadProducts(kategoriKey,base);
			

			this.getSplitAppObj().toDetail(this.createId(sToPageId));
		},

		onPressModeBtn : function(oEvent) {
			var sSplitAppMode = oEvent.getSource().getSelectedButton().getCustomData()[0].getValue();

			this.getSplitAppObj().setMode(sSplitAppMode);
			MessageToast.show("Split Container mode is changed to: " + sSplitAppMode, {duration: 5000});
		},
		getSplitAppObj : function() {
			var result = this.byId("SplitAppDemo");
			if (!result) {
				Log.info("SplitApp object can't be found");
			}
			return result;
		},
		navAdmin:function(){
			this.getOwnerComponent().getRouter().navTo("admin");
		}

	});
	return CController;
});
