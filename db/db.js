

var db = {
	select:function (tablo,where,whereValue) {
		var add="",sql;
		if (where!==undefined) {
			if (typeof whereValue === 'number') {
				add=whereValue;
			}else{
				add="'"+whereValue+"'";
			}
			sql="select * from " + tablo +" where " + where +"="+add+""
		}else{
			sql="select * from " + tablo +" order by rowid desc";
		}
		return new Promise(function (resolve, reject) {
	        dbObj.transaction(function (tx) {
	            tx.executeSql(sql,[],function (tx,results) {
	                resolve(JSON.stringify(results.rows)); // here the returned Promise is resolved
	            });
	        });
	    });
	},
	insert:function (tablo,colums,values) {
		var cols="",vals="";
		var addChar=",";
		for (var i =0; i < colums.length ; i++) {
			cols+=colums[i];
			if (typeof values[i]==='number') {
				vals+=values[i];
			}else{
				vals+="'"+values[i]+"'";
			}
			if (colums.length-1!=i) {
				cols+=addChar;
				vals+=addChar;
			}
		}
		dbObj.transaction(function (tx) {  
			tx.executeSql("insert into " + tablo + "("+cols+")values"+"("+vals+")");	
		});
	},
	delete:function (tablo,where,whereValue) {
		var sql;
		if (where!="") {
			if (whereValue>-1) {
				sql="delete from "+ tablo+" where "+ where +"="+whereValue+"";	
			}else{
				sql="delete from "+ tablo+" where "+ where +"='"+whereValue+"'";	
			}
		}
		console.log(sql);
		dbObj.transaction(function (tx) {  
			tx.executeSql(sql);	
		});
	},
	update:function (tablo,colums,values,where,whereValue) {
		var returnText="update "+tablo+" set ";
		for (var i = 0; i < colums.length; i++) {
			if (typeof values[i] === 'number') {
				returnText+=colums[i]+"="+values[i]+"";
			}else{
				returnText+=colums[i]+"='"+values[i]+"'";
			}
			if (colums.length-1!=i) {
				returnText+=", ";
			}
		}
		if (typeof whereValue === 'number') {
			returnText+=" where "+where+"="+whereValue+"";
		}else{
			returnText+=" where "+where+"='"+whereValue+"'";
		}
		console.log(returnText);
		dbObj.transaction(function (tx) {  
			tx.executeSql(returnText);	
		});

	},
	free:function(data){
		return new Promise(function (resolve, reject) {
	        dbObj.transaction(function (tx) {
	            tx.executeSql(data,[],function (tx,results) {
	                resolve(JSON.stringify(results.rows)); // here the returned Promise is resolved
	            });
	        });
	    });
	},
	d:function(data) {

		var deferred= new Promise(function (resolve, reject) {
        dbObj.transaction(function (tx) {
	            tx.executeSql(data,[],function (tx,results) {
	                resolve(JSON.stringify(results.rows)); // here the returned Promise is resolved
	            });
	        });
	    });
		//let result = await promise;
		return deferred;

	}
}

/*var load = () => {
	db.insert('products',["id","p_id","p_name","p_price","p_kategori","p_adet","srcImg","p_title","p_text"],[Math.random(1000)*1000,"ev1"+Math.random(1000)*1000,'Süs','50','ev1','5','image/3.png','Lamba','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'])
	db.insert('products',["id","p_id","p_name","p_price","p_kategori","p_adet","srcImg","p_title","p_text"],[Math.random(1000)*1000,"el"+Math.random(1000)*1000,'Iphone 2','8000','el1','5','image/2.png','Iphone 58 Plus 2','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'])
	db.insert('products',["id","p_id","p_name","p_price","p_kategori","p_adet","srcImg","p_title","p_text"],[Math.random(1000)*1000,"el"+Math.random(1000)*1000,'Iphone','8000','el1','5','image/1.png','Iphone 58 Plus','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'])
	db.insert('products',["id","p_id","p_name","p_price","p_kategori","p_adet","srcImg","p_title","p_text"],[Math.random(1000)*1000,"el"+Math.random(1000)*1000,'HP','5000','el2','5','image/11.png','HP Bilgisayar','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'])
	db.insert('products',["id","p_id","p_name","p_price","p_kategori","p_adet","srcImg","p_title","p_text"],[Math.random(1000)*1000,"el"+Math.random(1000)*1000,'Monster','5000','el2','5','image/12.png','Monster Bilgisayar','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'])	
	db.insert('products',["id","p_id","p_name","p_price","p_kategori","p_adet","srcImg","p_title","p_text"],[Math.random(1000)*1000,"el"+Math.random(1000)*1000,'Lenovo','5000','el2','5','image/13.png','Lenovo Bilgisayar','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'])
	db.insert('products',["id","p_id","p_name","p_price","p_kategori","p_adet","srcImg","p_title","p_text"],[Math.random(1000)*1000,"ev2"+Math.random(1000)*1000,'Çiçek','50','ev2','5','image/21.png','Zambak','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'])
	db.insert('products',["id","p_id","p_name","p_price","p_kategori","p_adet","srcImg","p_title","p_text"],[Math.random(1000)*1000,"ev2"+Math.random(1000)*1000,'Çiçek','50','ev2','5','image/22.png','Lale','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'])
	db.insert('products',["id","p_id","p_name","p_price","p_kategori","p_adet","srcImg","p_title","p_text"],[Math.random(1000)*1000,"ev2"+Math.random(1000)*1000,'Çiçek','50','ev2','5','image/23.png','Gül','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'])

}*/