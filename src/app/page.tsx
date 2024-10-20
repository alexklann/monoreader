"use client";

import { Poppins } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import AlertItem from "./components/alertItem";
import FeedItem from "./components/feedItem";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export default function Home() {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [openFeedModal, setOpenFeedModal] = useState(false);
  const [modalFeedName, setModalFeedName] = useState("");
  const [modalFeedUrl, setModalFeedUrl] = useState("");

  const [loadingFeeds, setLoadingFeeds] = useState(true);
  const [feeds, setFeeds] = useState<any[]>([]);

  const initialized = useRef(false);

  async function addFeed() {
    fetch(`/api/add?name=${modalFeedName}&url=${modalFeedUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      console.log(response);
      if (response.ok) {
        showAlert(`Feed "${modalFeedName}" successfully added!`);
        updateFeeds();
        setOpenFeedModal(false);
        resetModal();
    }});
  }

  // Not too sure what id is at this point
  async function removeFeed(id: any) {
    fetch(`/api/remove?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      console.log(response);
      if (response.ok) {
        showAlert(`Feed successfully removed!`);
        updateFeeds();
    }});
  }

  function updateFeeds() {
    setFeeds([]);
    setLoadingFeeds(true);
    initialized.current = false;
  }

  function resetModal() {
    setModalFeedName("");
    setModalFeedUrl("");
  }

  function showAlert(alertMessage: string) {
    setAlertMessage(alertMessage);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 5000);
  }

  useEffect(() => {
    const fetchFeeds = async () => {
      fetch("/api/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        response.json().then((data) => {
          for (const feed of data.data) {
            setFeeds((prevFeeds) => [...prevFeeds, feed]);
          }
        });
        if (response.ok) {
          setLoadingFeeds(false);
        }
      })
    }

    if (!initialized.current) {
      fetchFeeds();
      initialized.current = true;
    }
  }, [feeds]);

  return (
    <div className={`h-screen w-screen ${poppins.className}`}>
      <main className="flex flex-col items-center justify-center w-full h-full gap-8">
        {alertVisible && (
          <AlertItem message={alertMessage} />
        )}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold">This will be monoreader!</h1>
          <span>Monoreader will make it easy to bundle all of your favorite RSS channels, like news outlets or blogs!</span>
        </div>
        <a onClick={() => {setOpenFeedModal(true);}} className="btn btn-primary">Add Feed</a>
        {/* Not too sure on how to make this into a component whilst keeping it's functionality */}
        {openFeedModal && (
          <div className="absolute flex flex-col gap-8 bg-zinc-900 p-8 rounded-lg">
            <span className="font-semibold text-xl">Add a Feed</span>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2 font-semibold">
                  <label>Feed Name</label>
                  <input value={modalFeedName} onChange={(e) => {setModalFeedName(e.target.value)}} placeholder="My Local Feed" className="input"></input>
                </div>
                <div className="flex flex-col gap-2 font-semibold">
                  <label>Feed Url</label>
                  <input value={modalFeedUrl} onChange={(e) => {setModalFeedUrl(e.target.value)}} placeholder="https://localhost.com/feed" className="input"></input>
                </div>
              </div>
              <div className="flex gap-2 ml-auto w-fit">
                <a onClick={() => {resetModal(); setOpenFeedModal(false);}} className="btn btn-outline">Cancel</a>
                <a onClick={async () => {await addFeed();}} className="btn btn-primary">Add</a>
              </div>
          </div>
        )}
        {/* Not really a use-case to make these a component for now */}
        {loadingFeeds ? (
          <div className="flex flex-col gap-2 h-fit w-96">
            <span className="font-bold">Feeds:</span>
            <div className="flex flex-col gap-4 h-fit w-full">
              <div className="skeleton h-20 w-full"></div>
              <div className="skeleton h-20 w-full"></div>
              <div className="skeleton h-20 w-full"></div>
            </div>
          </div>
        )
        : (
          <div className="flex flex-col gap-2 h-fit w-96">
            <span className="font-bold">Feeds:</span>
            <div className="flex flex-col gap-4 h-fit w-full">
              {feeds.map((feed) => (
                <FeedItem key={feed.id} feed={feed} onRemoveFeed={async () => {await removeFeed(feed.id)}}/>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
