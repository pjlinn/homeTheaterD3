// cursor = db.components.find();
// print("[");
// while ( cursor.hasNext() ) {
// 	printjson( cursor.next() );
// 	print(",");
// }
// print("]");

var x = db.components.find();
print('[');
while (x.hasNext()) {
	x.forEach(function(doc) {
		doc._id=doc._id.valueOf();
		print(tojson(doc));
		print(",")
	});
}
print(']');
