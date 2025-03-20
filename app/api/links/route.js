import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  const client = await clientPromise;
  const db = client.db("bitlinks");
  const collection = db.collection("links");

  // Fetch all links
  const links = await collection.find({}).toArray();

  return new Response(JSON.stringify({ success: true, data: links }), {
    status: 200,
  });
}
