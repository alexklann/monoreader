import Image from "next/image";

export default function Article({feed} : {feed: any}) {
    return (
        <a key={feed.link} href={feed.link}>
            <div className="flex flex-col gap-2 w-full h-fit justify-center bg-zinc-900 p-4 rounded-lg">
                <div className="flex flex-row gap-4 items-center">
                    {feed.feed.image !== "" &&
                    <Image src={feed.feed.image} alt="Feed Logo" width={32} height={32}/>
                    }
                    <span className="font-bold text-lg">{feed.title}</span>
                </div>
                <span className="">{feed.contentSnippet.substring(0, 120)}{feed.contentSnippet.length > 120 ? "..." : ""}</span>
                <span>{new Date(feed.pub_date).toLocaleString('de-DE')}</span>
            </div>
        </a>
    );
}