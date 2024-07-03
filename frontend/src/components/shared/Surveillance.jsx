

export default function Surveillance() {
    var ws = new WebSocket("ws://110.44.121.73:2564/camera/1");
    ws.binaryType = "arraybuffer";
    ws.onmessage = function (event) {
        var arrayBufferView = new Uint8Array(event.data);
        var blob = new Blob([arrayBufferView], { type: "image/png" });
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(blob);
        document.getElementById("video").src = imageUrl;
    };
    return (

        <section className="max-h-screen flex flex-col">
            {/* <h1>WebSocket Video Stream</h1> */}
            <img id="video" className="h-screen w-auto bg-slate-50" />
        </section>
    );
}
