
var urunService ={
	urunAdd:function (values) {
		console.log(values)
		db.insert('products',["id","p_id","p_name","p_price","p_kategori","p_adet","srcImg","p_title","p_text"],values);
	},
	urunRemove:function(values) {
		db.delete('products','id',values);
	},
	urunUpdate:function(colums,values,where,whereValue) {
		db.update('products',values,where,whereValue);
	}
} 