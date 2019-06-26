
var userService ={
	add:function (values) {
		console.log(values)
		db.insert('users',["id","user_name","user_surname","user_idName","user_pass","admin"],values);
	},
	remove:function(values) {
		db.delete('users','id',values);
	},
	update:function(colums,values,where,whereValue) {
		db.update('users',values,where,whereValue);
	}
} 