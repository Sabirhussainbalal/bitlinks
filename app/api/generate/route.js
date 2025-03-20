import clientPromise from "@/lib/mongodb";

// Define the request parameter
export async function POST(request) {
  // Parse the body of the request
  const body = await request.json();
  
  const client = await clientPromise;
  const db = client.db("bitlinks");
  const collection = db.collection("links");

  // Check if the short URL already exists in the database
  const data = await collection.find({ shorturl: body.shorturl }).toArray();
  if (data.length > 0) {
    return new Response(JSON.stringify({ success: false, error: true, message: "Short URL already exists" }), { status: 400 });
  }

  // Insert the new URL and short URL into the database
  const result = await collection.insertOne({
    url: body.url,
    shorturl: body.shorturl,
  });

  return new Response(JSON.stringify({ success: true, error: false, message: "URL Generated" }), { status: 200 });
}
