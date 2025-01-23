(async () => {
  const MAX_LINKS_TO_SCAN = 100; // מספר הקישורים המרבי לסריקה

  // יצירת כפתור סריקה במסך
  const button = document.createElement("button");
  button.style.width = "120px";
  button.style.height = "120px";
  button.style.backgroundColor = "#007BFF";
  button.style.border = "none";
  button.style.borderRadius = "50%";
  button.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
  button.style.cursor = "pointer";
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.zIndex = "9999";
  button.style.display = "flex";
  button.style.flexDirection = "column";
  button.style.justifyContent = "center";
  button.style.alignItems = "center";
  button.style.color = "#fff";
  button.style.fontSize = "14px";
  button.style.fontWeight = "bold";

  const buttonText = document.createElement("span");
  buttonText.innerText = "Scan Links";
  buttonText.style.textAlign = "center";

  button.appendChild(buttonText);
  document.body.appendChild(button);

  // פונקציה ליצירת חלונית תוצאות
  const createModal = (linksInfo) => {
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.width = "70%";
    modal.style.height = "60%";
    modal.style.backgroundColor = "#fff";
    modal.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.2)";
    modal.style.borderRadius = "10px";
    modal.style.zIndex = "10000";
    modal.style.padding = "20px";
    modal.style.overflowY = "auto";

    const closeButton = document.createElement("button");
    closeButton.innerText = "✖";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.background = "none";
    closeButton.style.border = "none";
    closeButton.style.fontSize = "20px";
    closeButton.style.cursor = "pointer";

    closeButton.addEventListener("click", () => {
      modal.remove();
    });

    modal.appendChild(closeButton);

    linksInfo.forEach((info) => {
      const linkRow = document.createElement("div");
      linkRow.style.display = "flex";
      linkRow.style.justifyContent = "space-between";
      linkRow.style.alignItems = "center";
      linkRow.style.marginBottom = "10px";

      const linkText = document.createElement("span");
      linkText.innerText = info.link;
      linkText.style.wordBreak = "break-word";
      linkText.style.flex = "3";

      const statusText = document.createElement("span");
      statusText.innerText = info.isPhishing ? "Phishing" : "Safe";
      statusText.style.color = info.isPhishing ? "red" : "green";
      statusText.style.flex = "1";

      linkRow.appendChild(linkText);
      linkRow.appendChild(statusText);
      modal.appendChild(linkRow);
    });

    document.body.appendChild(modal);
  };

  // פונקציה להפעלת סריקה
  button.addEventListener("click", async () => {
    const apiKey = "enter your key"; // הכנס את מפתח ה-API שלך
    const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

    const links = [...document.querySelectorAll("a[href]")].slice(0, MAX_LINKS_TO_SCAN);

    if (links.length === 0) {
      alert("No links found on this page.");
      return;
    }

    const linksInfo = [];

    for (const linkElement of links) {
      const link = linkElement.href;

      const body = {
        client: { clientId: "your-client-id", clientVersion: "1.0.0" },
        threatInfo: {
          threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url: link }],
        },
      };

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await response.json();
        if (data.matches) {
          linkElement.style.backgroundColor = "red";
          linksInfo.push({ link, isPhishing: true });
        } else {
          linkElement.style.backgroundColor = "green";
          linksInfo.push({ link, isPhishing: false });
        }
      } catch (error) {
        console.error(`Error analyzing link ${link}:`, error.message);
        linksInfo.push({ link, isPhishing: false });
      }
    }

    createModal(linksInfo); // הצגת תוצאות
  });
})();
