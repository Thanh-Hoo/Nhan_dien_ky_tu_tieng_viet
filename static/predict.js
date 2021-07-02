async function predict(url, IframeID) {
    console.log(url)
    const rawResponse = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "src": document.getElementById("img").src, "name": document.getElementById("img").alt })
    });
    const jsonResponse = await rawResponse.json();
    document.getElementById(IframeID).src = 'data:image/jpeg;base64,' + jsonResponse['data']['img_src'];
}