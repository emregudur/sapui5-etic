jQuery.sap.require("sap.ui.demo.basicTemplate.Modul.Product");
jQuery.sap.require("sap.ui.demo.basicTemplate.Modul.User");
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
		'sap/m/StandardListItem',
	], function(jQuery, MessageToast, Fragment, Controller, Filter, JSONModel, Log, Button, Dialog, List, StandardListItem) {
	"use strict";
	var base;
	var CController = Controller.extend("sap.ui.demo.basicTemplate.controller.App", {
		onInit: function(){
			base=this;
			this.getSplitAppObj().setHomeIcon({
				'phone':'phone-icon.png',
				'tablet':'tablet-icon.png',
				'icon':'desktop.ico'
			});
			pr.getUrun('',base,'getAdminPageList');
			userModul.getUsers(base,'getAdminPageList');
		},
		startProductAdd:function() {
			pr.createDialog('',base,'getAdminPageList');
		},
		startUserAdd:function() {
			userModul.openUserAddDialog(base,'getAdminPageList');
		},
		removeUser:function(oEvent) {
			//var buttonID = sap.ui.getCore().byId(oEvent.mParameters.id).getCustomData()[0].getValue();
			userService.remove(sap.ui.getCore().byId(oEvent.mParameters.id).getCustomData()[0].getValue());
			userModul.getUsers(base,'getAdminPageList');
		},
		removeProduct:function(oEvent) {
			var buttonID = sap.ui.getCore().byId(oEvent.mParameters.id).getCustomData()[0].getValue();
			console.log(buttonID)
			urunService.urunRemove(sap.ui.getCore().byId(oEvent.mParameters.id).getCustomData()[0].getValue());
			pr.getUrun('',base,'getAdminPageList');
		},
		logOut:function () {
			sessionStorage.removeItem('user_id');
			location.href="/webapp";
		},
		onOrientationChange: function(oEvent) {
			var bLandscapeOrientation = oEvent.getParameter("landscape"),
				sMsg = "Orientation now is: " + (bLandscapeOrientation ? "Landscape" : "Portrait");
			MessageToast.show(sMsg, {duration: 5000});
		},

		onPressNavToDetail : function(oEvent) {
			this.getSplitAppObj().to(this.createId("detailDetail"));
		},
		actionSelected:function() {
			alert("");
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

		onListItemPress : function(oEvent) {
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();
			var listKey = oEvent.mParameters.listItem.mAggregations.customData[1].mProperties.value;

			this.getView().byId(listKey).setTitle(oEvent.getParameter("listItem").mProperties.title);
			this.getSplitAppObj().toDetail(this.createId(listKey));
		},
		getSplitAppObj : function() {
			var result = this.byId("SplitAppDemo");
			if (!result) {
				Log.info("SplitApp object can't be found");
			}
			return result;
		}

	});


	return CController;

});
