let type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas";
}

let app = new PIXI.Application();
document.body.appendChild(app.view);

let bg;
let inventoryOpen = false;

let inventoryKey = keyboard("i");

initialSetup();
crawl();

function initialSetup() {
  window.addEventListener("resize", function (event) {
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
  let blueText = new PIXI.Text(
    "A... not long time ago, in the galaxy in which you currently are..."
  );
  let blueStyle = new PIXI.TextStyle({
    fontFamily: "Oxygen",
    fontSize: 40,
    fill: "#127b88",
    wordWrap: true,
    wordWrapWidth: 800,
    align: "left",
  });
  blueText.style = blueStyle;
  blueText.x = window.innerWidth / 2 - 400;
  blueText.y = window.innerHeight / 2 - 100;
  app.stage.addChild(blueText);

  setTimeout(() => {
    app.stage.removeChild(blueText);
    let title;
    PIXI.loader
      .add("./assets/images/atleastzero_tpbg.png")
      .add("./assets/images/stars.jpg")
      .add("./assets/images/grappling_hook.png")
      .add("./assets/images/companion_cube.png")
      .load(() => {
        bg = new PIXI.Sprite(
          PIXI.loader.resources["./assets/images/stars.jpg"].texture
        );
        bg.width = window.innerWidth * 2;
        bg.height = window.innerHeight * 2;
        app.stage.addChild(bg);

        let inventoryBg = new PIXI.Graphics();
        inventoryBg.beginFill(0xA8937D);
        inventoryBg.drawRect(window.innerWidth - 800, window.innerHeight - 500, 800, 1000);
        inventoryBg.endFill();
        let inventoryItemBgs = [];
        let items = [];
        let inventoryItems = [];
        for (let i = 0; i < 10; i++) {
          for (let j = 0; j < 16; j++) {
            inventoryItemBg = new PIXI.Graphics();
            inventoryItemBg.beginFill(0xA5907A);
            inventoryItemBg.drawRect(
              window.innerWidth - 795 + j * 50, 
              window.innerHeight - 495 + i * 50,
              45,
              45
            )
            inventoryItemBg.endFill();
            inventoryItemBgs.push(inventoryItemBg);
          }
        }
      
        items.push({
          name: "Grappling Hook",
          description: "Launch, swing, pull!",
          image: "./assets/images/grappling_hook.png"
        })
      
        items.push({
          name: "Companion Cube",
          description: "I could never give you up",
          image: "./assets/images/companion_cube.png"
        })
      
        for (let i = 0; i < items.length; i++) {
          inventoryItem = new PIXI.Sprite(
            PIXI.loader.resources[items[i].image].texture
          );
          inventoryItem.x = window.innerWidth - 795 + (i / 10) * 50;
          inventoryItem.y = window.innerHeight - 495 + (i % 10) * 50;
          inventoryItem.width = 45;
          inventoryItem.height = 45;
          inventoryItem.interactive = true;
          inventoryItem.mouseover = function (mouseData) {
            var message = new PIXI.Text(`"${items[i].name}" - ${items[i].description}`);
            message.x = mouseData.data.global.x;
            message.y = mouseData.data.global.y;
          }
          inventoryItems.push(inventoryItem);
        }

        inventoryKey.press = () => {
          if (inventoryOpen) {
            app.stage.removeChild(inventoryBg);
            inventoryItemBgs.map(inventoryItemBg => {
              app.stage.removeChild(inventoryItemBg)
            });
            inventoryItems.map(inventoryItem => {
              app.stage.removeChild(inventoryItem)
            });
            inventoryOpen = false;
          } else {
            app.stage.addChild(inventoryBg);
            inventoryItemBgs.map(inventoryItemBg => {
              app.stage.addChild(inventoryItemBg)
            });
            inventoryItems.map(inventoryItem => {
              app.stage.addChild(inventoryItem)
            });
            inventoryOpen = true;
          }
        }

        title = new PIXI.Sprite(
          PIXI.loader.resources["./assets/images/atleastzero_tpbg.png"].texture
        );
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
      });
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

function keyboard(value) {
  let key = {};

  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;

  //The `downHandler`
  key.downHandler = event => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);
  
  window.addEventListener(
    "keydown", downListener, false
  );
  window.addEventListener(
    "keyup", upListener, false
  );
  
  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };
  
  return key;
}