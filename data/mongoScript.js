// cursor = db.components.find();
// print("[");
// while ( cursor.hasNext() ) {
// 	printjson( cursor.next() );
// 	print(",");
// }
// print("]");

/*
	mongoScript.js
*/
var x = db.components.find(); // Returns an iterator of components
print('['); // Start JSON array
while (x.hasNext()) { // Loop through the results
	x.forEach(function(doc) { // For each result:
		doc._id=doc._id.valueOf(); // Convert the BSON ID to a String
		print(tojson(doc)); // Print as JSON
		print(",") // Appnd with a comma
	});
}
print(']'); // Close the JSON array
