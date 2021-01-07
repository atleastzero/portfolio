let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
    type = "canvas"
}

let app = new PIXI.Application();
document.body.appendChild(app.view);

initialSetup();
crawl();

function initialSetup() {
    window.addEventListener("resize", function(event){ 
        scaleToWindow(app.renderer.view);
    });

    var newStyle = document.createElement("style");
    var style = "* {padding: 0; margin: 0}";
    newStyle.appendChild(document.createTextNode(style));
    document.head.appendChild(newStyle);

    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";
    app.renderer.autoResize = true;
    app.renderer.resize(window.innerWidth, window.innerHeight);
}

function crawl() {
    let blueText = new PIXI.Text("A... not long time ago, in the galaxy in which you currently are...");
    let blueStyle = new PIXI.TextStyle({
        fontFamily: "Oxygen",
        fontSize: 40,
        fill: "#127b88",
        wordWrap: true,
        wordWrapWidth: 800,
        align: "left"
    });
    blueText.style = blueStyle;
    blueText.x = window.innerWidth / 2 - 400;
    blueText.y = window.innerHeight / 2 - 100;
    app.stage.addChild(blueText);

    setTimeout(() => {
        app.stage.removeChild(blueText);
        let title;
        PIXI.loader.add("./assets/images/atleastzero_tpbg.png")
            .add("./assets/images/stars.jpg")
            .load(() => {
                bg = new PIXI.Sprite(PIXI.loader.resources["./assets/images/stars.jpg"].texture);
                bg.width = window.innerWidth * 2;
                bg.height = window.innerHeight * 2;
                app.stage.addChild(bg);

                title = new PIXI.Sprite(PIXI.loader.resources["./assets/images/atleastzero_tpbg.png"].texture);
                title.x = window.innerWidth / 2;
                title.y = window.innerHeight / 2;
                title.width = window.innerWidth;
                title.height = window.innerHeight;
                title.anchor.set(0.5, 0.5);
                app.stage.addChild(title);

                function titleShrink() {
                    title.width = title.width * 0.98;
                    title.height = title.height * 0.98;

                    if (title.height > 1 && title.width > 1) {
                        setTimeout(titleShrink, 50);
                    }
                }

                titleShrink();
            })
    }, 3000);
}

function scaleToWindow(canvas, backgroundColor) {
    var scaleX, scaleY, scale, center;

    //1. Scale the canvas to the correct size
    //Figure out the scale amount on each axis
    scaleX = window.innerWidth / canvas.offsetWidth;
    scaleY = window.innerHeight / canvas.offsetHeight;
  
    //Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
    scale = Math.min(scaleX, scaleY);
    canvas.style.transformOrigin = "0 0";
    canvas.style.transform = "scale(" + scale + ")";
  
    //2. Center the canvas.
    //Decide whether to center the canvas vertically or horizontally.
    //Wide canvases should be centered vertically, and 
    //square or tall canvases should be centered horizontally
    if (canvas.offsetWidth > canvas.offsetHeight) {
      if (canvas.offsetWidth * scale < window.innerWidth) {
        center = "horizontally";
      } else {
        center = "vertically";
      }
    } else {
      if (canvas.offsetHeight * scale < window.innerHeight) {
        center = "vertically";
      } else {
        center = "horizontally";
      }
    }
  
    //Center horizontally (for square or tall canvases)
    var margin;
    if (center === "horizontally") {
      margin = (window.innerWidth - canvas.offsetWidth * scale) / 2;
      canvas.style.marginTop = 0 + "px";
      canvas.style.marginBottom = 0 + "px";
      canvas.style.marginLeft = margin + "px";
      canvas.style.marginRight = margin + "px";
    }
  
    //Center vertically (for wide canvases) 
    if (center === "vertically") {
      margin = (window.innerHeight - canvas.offsetHeight * scale) / 2;
      canvas.style.marginTop = margin + "px";
      canvas.style.marginBottom = margin + "px";
      canvas.style.marginLeft = 0 + "px";
      canvas.style.marginRight = 0 + "px";
    }
  
    //3. Remove any padding from the canvas  and body and set the canvas
    //display style to "block"
    canvas.style.paddingLeft = 0 + "px";
    canvas.style.paddingRight = 0 + "px";
    canvas.style.paddingTop = 0 + "px";
    canvas.style.paddingBottom = 0 + "px";
    canvas.style.display = "block";
  
    //4. Set the color of the HTML body background
    document.body.style.backgroundColor = backgroundColor;
  
    //Fix some quirkiness in scaling for Safari
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("safari") != -1) {
      if (ua.indexOf("chrome") > -1) {
        // Chrome
      } else {
        // Safari
        //canvas.style.maxHeight = "100%";
        //canvas.style.minHeight = "100%";
      }
    }
  
    //5. Return the `scale` value. This is important, because you'll nee this value 
    //for correct hit testing between the pointer and sprites
    return scale;
}