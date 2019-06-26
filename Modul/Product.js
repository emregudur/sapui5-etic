jQuery.sap.require("sap.ui.demo.basicTemplate.db.urunService");
	var kategori,imgSrc,base;
	var pr ={
		createDialog:function(_kategori,_this,functionName) {
				base=this;
				var up = new sap.m.upload.UploadSet('imgSrc',{
							uploadUrl:'./image',
							uploadEnabled:true
						});
				
				var fixedSizeDialog = new sap.m.Dialog({
					title: 'Ürün Ekle',
					contentWidth: '550px',
					contentHeight: '300px',
					content:[
						new sap.m.Input('p_name',{
							width:'100%',
							placeholder:'Ürün Adı',
							type:'Text',
							autocomplete:false
						}),
						new sap.m.Input('p_price',{
							width:'100%',
							placeholder:'Ürün Fiyatı',
							type:'Text',
							autocomplete:false
						}),
						new sap.m.Select('p_kategori',{
							width:'100%',
							items:[
								new sap.ui.core.Item({text:'',customData: {
																	  Type:"sap.ui.core.CustomData",
																	    key:"kat",
																	    value:"" 
																	  }}),
								new sap.ui.core.Item({text:'Telefon',customData: {
																	  Type:"sap.ui.core.CustomData",
																	    key:"kat",
																	    value:"el1" 
																	  }}),
								new sap.ui.core.Item({text:'Bilgisayar',customData: {
																	  Type:"sap.ui.core.CustomData",
																	    key:"kat",
																	    value:"el2" 
																	  }}),
								new sap.ui.core.Item({text:'Süs Eşyaları',customData: {
																	  Type:"sap.ui.core.CustomData",
																	    key:"kat",
																	    value:"ev1" 
																	  }}),
								new sap.ui.core.Item({text:'Bitki',customData: {
																	  Type:"sap.ui.core.CustomData",
																	    key:"kat",
																	    value:"ev2" 
																	  }})
							],
							change:function(oEvent) {
								kategori = oEvent.getParameters().selectedItem.getCustomData()[0].getValue();
							}
						}),
						new sap.m.Input('adet',{
							width:'100%',
							placeholder:'Ürün Adeti',
							type:'Text',
							autocomplete:false
						}),
						new sap.m.Input('p_title',{
							width:'100%',
							placeholder:'Ürün Başlığı',
							type:'Text',
							autocomplete:false
						}),
						new sap.m.Input('p_text',{
							width:'100%',
							placeholder:'Ürün Açıklaması',
							type:'Text',
							autocomplete:false
						}),
						up
					],
					beginButton: new sap.m.Button({
						text: 'Ekle',
						press: function (oEvent) {
							urunService.urunAdd([
								Math.floor(Math.random(10000)*10000),
								'e'+Math.floor(Math.random(10000)*10000),
								sap.ui.getCore().byId('p_name').getValue(),
								sap.ui.getCore().byId('p_price').getValue(),
								kategori,
								sap.ui.getCore().byId('adet').getValue(),
								imgSrc,
								sap.ui.getCore().byId('p_title').getValue(),
								sap.ui.getCore().byId('p_text').getValue()
							]);
							base.getUrun(_kategori,_this,functionName);
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
			var handleFileSelect = function(evt) {
			    var files = evt.target.files;
			    var file = files[0];

			    if (files && file) {
			        var reader = new FileReader();

			        reader.onload = function(readerEvt) {
			            var binaryString = readerEvt.target.result;
			            imgSrc = btoa(binaryString);
			        };

			        reader.readAsBinaryString(file);
			    }
			};

			if (window.File && window.FileReader && window.FileList && window.Blob) {
			    document.getElementById('imgSrc').addEventListener('change', handleFileSelect, false);
			} else {
			    alert('The File APIs are not fully supported in this browser.');
			}
		},
		getUrun:function (kategoriU,_thisU,functionNameU) {
			this[functionNameU](kategoriU,_thisU);
		},
		getHomePageList:function(kategoriHPL,_thisHPL) {
			this.getWrite(kategoriHPL,_thisHPL,'listHomePage','/deneme');
		},
		getAdminPageList:function(kategoriAPL,_thisAPL) {
			this.getWrite(kategoriAPL,_thisAPL,'listAdminPage','/adminPList');
		},
		getWrite:function (kategoriWR, _thisWR, _idWR, _propertyWR) {
			var products;
			var oData={
			deneme:{
				'p_id':'',
				'srcImg':'',
				'p_name':'',
				'p_title':'',
				'p_price':''
				}
			}
			var oModel = new sap.ui.model.json.JSONModel(oData);
			_thisWR.getView().byId(_idWR).setModel(oModel);
			if (kategoriWR=="") {
				products = db.select('products');
				products.then(function (dbRespose) {
					oModel.setProperty(_propertyWR,JSON.parse(dbRespose));
				});
			}else{
				products = db.select('products','p_kategori',kategoriWR);
				products.then(function (dbRespose) {
					oModel.setProperty(_propertyWR,JSON.parse(dbRespose));
				});
			}
		},
		getSepetList:function() {
			var products=db.free("SELECT sepet.id,sepet.user_id, products.p_name, products.p_title, products.srcImg FROM sepet, products WHERE sepet.user_id="+sessionStorage.getItem('user_id')+" AND products.p_id = sepet.p_id");
			var j;
			products.then(function(x){
				j=JSON.parse(x);

				var oData={
					deneme:{
						'p_name':'i1',
						'p_title':'',
						'srcImg':'',
						'id':''
					}
				}
				var oModel = new sap.ui.model.json.JSONModel(oData);
				console.log(j)
				for (var i = 0; i < Object.keys(j).length; i++) {
						console.log(j[i].user_id,sessionStorage.getItem('user_id'),j[i].user_id!=sessionStorage.getItem('user_id'))
					if (j[i].user_id!=sessionStorage.getItem('user_id')) {
						delete j[i];
					}
				}
				console.log(j);
				sap.ui.getCore().byId('_sepet').setModel(oModel);
				oModel.setProperty("/sepetData", j);
			});
		}
	};
