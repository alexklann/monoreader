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
  const [modalCheckSuccess, setModalCheckSuccess] = useState(false);

  const [loadingFeeds, setLoadingFeeds] = useState(true);
  const [feeds, setFeeds] = useState<any[]>([]);

  const [checkButtonText, setCheckButtonText] = useState<React.ReactNode>("Check");

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

  async function checkFeed() {
    setCheckButtonText(<span className="loading loading-spinner loading-xs"></span>);

    fetch(`/api/fetch?url=${modalFeedUrl}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.ok) {
        setCheckButtonText(
          <svg fill="#000000" width="20px" height="20px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path d="M28.998 8.531l-2.134-2.134c-0.394-0.393-1.030-0.393-1.423 0l-12.795 12.795-6.086-6.13c-0.393-0.393-1.029-0.393-1.423 0l-2.134 2.134c-0.393 0.394-0.393 1.030 0 1.423l8.924 8.984c0.393 0.393 1.030 0.393 1.423 0l15.648-15.649c0.393-0.392 0.393-1.030 0-1.423z"></path>
          </svg>
        );
        setModalCheckSuccess(true);
      } else {
        setCheckButtonText(
          <svg width="16px" height="16px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" preserveAspectRatio="xMidYMid meet">
            <path d="M62 10.571L53.429 2L32 23.429L10.571 2L2 10.571L23.429 32L2 53.429L10.571 62L32 40.571L53.429 62L62 53.429L40.571 32z" fill="#000000" />
          </svg>
        );
        setModalCheckSuccess(false);
      }
    });
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
            console.log(feed);
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
          <div className="absolute flex flex-col gap-8 min-w-[32rem] bg-zinc-900 p-8 rounded-lg z-10">
            <span className="font-semibold text-xl">Add a Feed</span>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2 w-full font-semibold">
                  <label>Feed Name</label>
                  <input value={modalFeedName} onChange={(e) => {setModalFeedName(e.target.value)}} placeholder="My Local Feed" className="input"></input>
                </div>
                <div className="flex flex-col gap-2 font-semibold">
                  <label>Feed Url</label>
                  <div className="flex flex-row gap-4">
                    <input value={modalFeedUrl} onChange={(e) => {setModalFeedUrl(e.target.value); setModalCheckSuccess(false); setCheckButtonText("Check");}} placeholder="https://localhost.com/feed" className="input w-full"></input>
                    <button onClick={async () => {await checkFeed();}} className="btn btn-primary min-w-[6rem]">{checkButtonText}</button>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-auto w-fit">
                <button onClick={() => {resetModal(); setOpenFeedModal(false);}} className="btn btn-outline">Cancel</button>
                <button onClick={async () => {await addFeed();}} className="btn btn-primary" disabled={!modalCheckSuccess}>Add</button>
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
