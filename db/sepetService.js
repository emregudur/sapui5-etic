var sepet={
	add:function (p_id,userID) {
		db.insert('sepet', ["id", "user_id", "p_id", "adet"],[Math.floor(Math.random(10000)*10000),userID,p_id,1]);
	},
	remove:function(id){
		db.delete('sepet','id',id);
	}
}