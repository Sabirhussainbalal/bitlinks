"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shorturl, setShorturl] = useState("");
  const [data, setData] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("Generate");
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  // Fetch links from the backend (GET /api/links)
  const fetchLinks = () => {
    fetch("/api/links")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setData(data.data);
        }
      });
  };

  // Fetch links on component mount
  useEffect(() => {
    fetchLinks();
  }, []);

  // Utility function to ensure links have a protocol
  const formatLink = (link) => {
    return link.startsWith("http") ? link : `https://${link}`;
  };

  // Function to generate and save the URL
  const generate = async () => {
    if (!url || !shorturl) {
      alert("Please fill all the fields");
      return;
    }

    const Myheader = new Headers();
    Myheader.append("Content-Type", "application/json");

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: Myheader,
      body: JSON.stringify({ url, shorturl }),
    });

    const dataRes = await response.json();

    // If an error occurs (e.g., duplicate short URL), display the message and exit early
    if (dataRes.error) {
      setMsg(dataRes.message);
      alert(dataRes.message);
      return;
    }

    // On success, display the message, trigger loading, and update data after a delay
    setMsg(dataRes.message);
    setLoading(true);
    setText("Generating...");

    setTimeout(() => {
      setLoading(false);
      setUrl("");
      setShorturl("");
      setText("Generate");
      fetchLinks(); // Refresh the list with the new entry
    }, 3000);
  };

  // Filter the data based on the search term
  const filteredData = data.filter((link) => {
    const term = searchTerm.toLowerCase();
    return (
      link.url.toLowerCase().includes(term) ||
      link.shorturl.toLowerCase().includes(term)
    );
  });

  return (
    <div className="w-full h-[100vh] overflow-hidden flex justify-center items-center text-white flex-col gap-5">
      <div className="flex flex-col gap-2 bg-[#fff1] p-4 relative">
        <input
          type="text"
          name="url"
          placeholder="url (e.g., https://www.example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="outline-none border p-2"
        />
        <input
          type="text"
          name="shorturl"
          placeholder="shorturl (e.g., exmpl)"
          value={shorturl}
          onChange={(e) => setShorturl(e.target.value)}
          className="outline-none border p-2"
        />
        <button
          onClick={generate}
          className="group border p-2 mt-5 cursor-pointer hover:bg-[#00000056] text-white transition-all duration-300"
        >
          <span className="group-hover:scale-105 group-hover:animate-bounce transition-all duration-300">
            {text}
          </span>
        </button>
        {loading && (
          <p className="text-gray-900 font-bold absolute w-full h-full flex justify-center items-center">
            <span className="animate-ping transition-all duration-300 ease-in-out font-bold">
              Loading...
            </span>
          </p>
        )}
      </div>
      <div className="w-[80%] h-[2px] bg-gradient-to-r from-[#0000009b] via-[#ffffff5f] to-[#0000009b]"></div>
      <div className="flex flex-col gap-2">
        {/* Search bar */}
        <div className="group">
          <input
            type="search"
            name="search"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[500px] outline-none border-b p-2 focus:bg-[#ffffff2f] px-6 transition-all duration-300"
          />
          <div className="group-hover:w-full w-0 h-[2px] bg-[#ffffffcd] transition-all duration-300"></div>
        </div>
        {/* Display fetched data */}
        <div className="transition-all duration-300 hover:scale-105 hover:shadow-[0px_0px_20px_black] text-[12px] w-[500px] h-[200px] border flex flex-col relative p-4 gap-2 overflow-x-hidden overflow-y-auto shadow-[0px_0px_10px_0px_rgba(0,0,0,0.5)]">
          {filteredData.length > 0 ? (
            filteredData.map((link, index) => (
              <div
                key={index}
                className="transition-all duration-700 delay-100 flex items-center justify-center gap-2 bg-gradient-to-bl from-[#ffffff78] via-[#ffffff1a] to-[#ffffff14] p-2 min-h-[80px] overflow-auto"
              >
                <span className="font-bold">Url</span> -{" "}
                <a
                  href={formatLink(link.url)}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#0000009b] hover:underline"
                >
                  {link.url}
                </a>{" "}
                | <span className="font-bold">ShortUrl</span> -{" "}
                <a
                  href={formatLink(link.url)}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#0000009b] hover:underline"
                >
                  {link.shorturl}
                </a>
              </div>
            ))
          ) : (
            <p>No links available</p>
          )}
        </div>
      </div>
      <p className="absolute bottom-2 text-[12px] text-[#dcdbe0]">
        Made By <span className="font-bold owner">Sabir Hussain Balal</span>
      </p>
    </div>
  );
}
