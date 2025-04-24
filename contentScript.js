(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentVideo = "";
    let currentVideoBookmarks = [];

    // listen to data from background.js
    // when does this run? only run when new tabs open, not when i refresh video

    const fetchBookmarks = () => {
        return new Promise((resolve) => {
            try {
                chrome.storage.sync.get([currentVideo], (obj) => {
                    resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
                });
            } catch (err) {
                console.error("Failed to fetch bookmarks:", err);
                resolve([]); // fallback to empty array
            }
        });
    };

    const newVideoLoaded = async () => {
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
        currentVideoBookmarks = await fetchBookmarks();
        console.log("18 ", bookmarkBtnExists);

        if (!bookmarkBtnExists) {
            const bookmarkBtn = document.createElement("img");

            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "ytp-button " + "bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current timestamp";

            youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
            youtubePlayer = document.getElementsByClassName("video-stream")[0];

            youtubeLeftControls.append(bookmarkBtn);
            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
        }
    };

    const addNewBookmarkEventHandler = async () => {
        const currentTime = youtubePlayer.currentTime;
        const newBookmark = {
            time: currentTime,
            desc: "Bookmark at " + getTime(currentTime),
        };
        console.log("41 ", newBookmark);

        currentVideoBookmarks = await fetchBookmarks();

        // what is .sort(a,b )
        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify(
                [...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)
            ),
        });
    };

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId } = obj;

        if (type === "NEW") {
            currentVideo = videoId;
            newVideoLoaded();
        } else if (type === "PLAY") {
            youtubePlayer.currentTime = value;
        } else if (type === "DELETE") {
            currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value);
            chrome.storage.sync.set({
                [currentVideo]: JSON.stringify(currentVideoBookmarks),
            });

            response(currentVideoBookmarks);
        }
    });

    newVideoLoaded();
})();

const getTime = (t) => {
    const date = new Date(0);
    date.setSeconds(t); // set to actual time
    return date.toISOString().substr(11, 8); // hh:mm:ss
};
