import { panda } from "./pandalib.js";
globalThis.panda = panda;
const convagen = { //image ratio 8 (150/16) 225 / 169 chario+panda
    canvas: document.querySelector('#canvagame'),
    tempvar: {},
    val: {line:{old:1,new:1,state:1},start:false,startpanda:-1,saut:false,mapoffset:-1,sautstate:0,direction:"forward"},
    config:{speed:2},
    imgcash:{},
    forkill:null,
    util:{
        gamestate:{
            victory:() => {
                
            }
        },
        returnX: (cachename,image) => {
            if(!document.querySelector('#travailzone')){
                const tempcanvas = document.createElement('canvas');
                tempcanvas.style.display = 'none';
                tempcanvas.id = 'travailzone';
                document.querySelector('#game').appendChild(tempcanvas);
            }
            const travail = document.querySelector('#travailzone');
            const context_temp = travail.getContext('2d');
            travail.width = image.width;
            
            travail.height = image.height;
            context_temp.clearRect(0, 0, travail.width, travail.height);
            context_temp.translate(travail.width, 0);
            context_temp.scale(-1, 1);
            context_temp.drawImage(image, 0, 0);

            const imageRetournee = new Image();
            imageRetournee.src = travail.toDataURL();
            imageRetournee.onload = () => {
                convagen.imgcash[cachename] = imageRetournee;
            }
        },
        pixel(number){
            return number*8;
        },
        imagestate(name,imglist){
            let select = convagen.tempvar[name];
            if(select == undefined){
                select = 0;
            }
            convagen.tempvar[name] += 1;
            if(convagen.tempvar[name] > Object.keys(imglist).length){
                convagen.tempvar[name] = 0;
            }
            select = convagen.tempvar[name];
            return imglist[select];
        }
    },
    checkcolide: (img) =>{
        let i = convagen.util.pixel(24);
        if(convagen.val.line.new == 0){
            i = convagen.util.pixel(9);
        }else if(convagen.val.line.new == 1){
            i = convagen.util.pixel(24);
        }else if(convagen.val.line.new == 2){
            i = convagen.util.pixel(41);
        }
        var pixelData = img.getImageData(i, convagen.util.pixel(52), 1, 1).data;
        if(pixelData[0] == 255){
            return "red";
        }else if(pixelData[1] == 255){
            return "green";
        }else if(pixelData[2] == 255){
            return "blue";
        }else{
            return "empty";
        }

    },
    update: () => {
        
        const canvas = document.getElementById('canvagame');
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = 400;
        canvas.height = window.innerHeight;
        
        // for (let index = 0; index < 100; index++) {
        //     if(convagen.util.pixel(index) == 200){
        //         context.strokeStyle = 'red';
        //     }else{
        //         context.strokeStyle = 'white';
        //     }
        //     context.beginPath();
        //     context.moveTo(convagen.util.pixel(index), 0);
        //     context.lineTo(convagen.util.pixel(index), canvas.height);
        //     context.stroke();
            
        // }
        let bg = convagen.imgcash.gamestage_lv_1;
        if(convagen.val.mapoffset == -1 || convagen.val.mapoffset >= 0){
            convagen.val.mapoffset =  -6000 + canvas.height;
        }
        // globalThis.panda.util.log(convagen.val.mapoffset,"cyan");
        
        context.drawImage(bg, 0, convagen.val.mapoffset);
        if(convagen.val.start == true){
            convagen.val.mapoffset = convagen.val.mapoffset + convagen.util.pixel(1);
            let color = convagen.checkcolide(context);
            if(color == "red"){
                document.querySelector("#game").style.display = "none";
                document.querySelector("#defeat").style.display = "";
                convagen.val.start = false;
                clearInterval(convagen.val.forkill);
            }else if(color == "green"){
                document.querySelector("#game").style.display = "none";
                document.querySelector("#victoire").style.display = "";
                convagen.val.start = false;
                clearInterval(convagen.val.forkill);
            }
        }
        context.drawImage(convagen.imgcash.gamebg_lb_1, 0, convagen.val.mapoffset)
        // context.strokeStyle = 'purple';
        // context.moveTo(convagen.util.pixel(24), convagen.util.pixel(52));


        let chario = convagen.imgcash["CHARIOTNeutral01"];
        console.log(convagen.util.imagestate("chario",{0:"CHARIOTNeutral01",1:"CHARIOTNeutral02"}));
        let panda = convagen.imgcash.PANDABase;

        let mainX = 0;
        let mainY = convagen.util.pixel(52);
        let PoCfY = convagen.util.pixel(1);
        let PoCfX = -convagen.util.pixel(2);
        // console.log(convagen.val.line);
        if(convagen.val.line.old != convagen.val.line.new){
            if(convagen.val.line.old < convagen.val.line.new){
                let max = 0;
                if(convagen.val.line.new == 1) {
                    max = convagen.util.pixel(16);
                }else if(convagen.val.line.new == 2) {
                    max = convagen.util.pixel(32);
                }
                // console.log(mainX);
                if(convagen.val.line.state < max){
                    mainX = convagen.val.line.state+convagen.util.pixel(2);
                }else{
                    mainX = max;
                    convagen.val.line.old = convagen.val.line.new;
                }
            }else{
                let min = 0;
                if(convagen.val.line.new == 1) {
                    min = convagen.util.pixel(16);
                }else if(convagen.val.line.new == 0) {
                    min = 0;
                }
                if(convagen.val.line.state > min){
                    mainX = convagen.val.line.state-convagen.util.pixel(2);
                }else{
                    mainX = min;
                    convagen.val.line.old = convagen.val.line.new;
                }
            }
        }else{
            convagen.val.direction = "forward"; 
            switch (convagen.val.line.old) {
                case 0:
                    mainX = 0;
                    break;
                case 1:
                    mainX = canvas.width/2-(144/2);
                    break;
                case 2:
                    mainX = canvas.width-144;
                    break;
            }
        }
        convagen.val.line.state = mainX;
        switch (convagen.val.saut) {
            case false:
                PoCfY = convagen.util.pixel(1);
                convagen.val.sautstate = convagen.util.pixel(1);
                switch(convagen.val.direction){
                    case "forward":
                        panda = convagen.imgcash.PANDABase;
                        break;
                    case "left":
                        panda = convagen.imgcash.PANDASide;
                        chario = convagen.imgcash.CHARIOTSide;
                        // convagen.val.direction = "forward";
                        break;
                    case "right":
                        panda = convagen.imgcash.PANDASideR;
                        chario = convagen.imgcash.CHARIOTSideR;
                        // convagen.val.direction = "forward";
                        break;
                }
                break;
            case true:
                // globalThis.panda.util.log(JSON.stringify(convagen.val),"red");
                globalThis.panda.util.log(JSON.stringify(convagen.val.sautstate),"red");
                globalThis.panda.util.log(convagen.util.pixel(20),"red");

                if(convagen.val.sautstate > -convagen.util.pixel(20)){
                    convagen.val.sautstate = convagen.val.sautstate-convagen.util.pixel(2);
                    globalThis.panda.util.log(JSON.stringify(convagen.val.sautstate),"red");
                }else{
                    convagen.val.sautstate = -convagen.util.pixel(1);
                    convagen.val.saut = false;
                }
                PoCfY = convagen.val.sautstate;
                panda = convagen.imgcash.PANDAAPied01;
                PoCfX = PoCfX+convagen.util.pixel(5);
                
        }
        
        // context.drawImage(chario, convagen.util.pixel(0), mainY);
        // context.drawImage(chario, convagen.util.pixel(16), mainY);
        // context.drawImage(chario, convagen.util.pixel(32), mainY);
        context.drawImage(chario, mainX, mainY);

        if(convagen.val.start == true){
            context.drawImage(panda, mainX-PoCfX, mainY+PoCfY);
        }else{
            panda = convagen.imgcash.PANDAAPied01;
            if(convagen.val.startpanda == -1){
                convagen.val.startpanda = convagen.util.pixel(20);
            }else{
                convagen.val.startpanda = convagen.val.startpanda-convagen.util.pixel(2);
            }
            if(convagen.val.startpanda == 0){
                convagen.val.start = true;
            }
            console.log(convagen.val.startpanda)
            
            PoCfX = PoCfX+convagen.util.pixel(5);
            context.drawImage(panda, mainX-PoCfX, mainY+convagen.val.startpanda);
        }
        // context.drawImage(panda, mainX-PoCfX, mainY+PoCfY);
        
        convagen.forkill = setTimeout(() => {
            requestAnimationFrame(convagen.update);
        }, 50);
    },
    pre_init: () => {
        //preload images;
        function preloadImages(images) {
            let loadedCount = 0;
            function imageLoaded() {
                loadedCount++;
                if (loadedCount === Object.keys(images).length) {
                    document.querySelector("#startButton").style.display = "";
                }
            }
            for (const name in images) {
                const image = new Image();
                image.onload = imageLoaded(images[name]);
                image.src = images[name];
                convagen.imgcash[name] = image;
            }
        }
        const imagesToPreload = {
             gamestage_lv_1:'./assets/img/STAGE_01_debogage.png',
             gamebg_lb_1:'./assets/img/STAGE_02.png',
             CHARIOTNeutral01:'./assets/img/CHARIOTNeutral01.png',
             CHARIOTNeutral02:'./assets/img/CHARIOTNeutral02.png',
             PANDABase:'./assets/img/PANDABase.png',
             CHARIOTSide:"./assets/img/CHARIOTSide.png",
             PANDASide:"./assets/img/PANDAASide_01.png",
             PANDAAPied01:'./assets/img/PANDAAPieds_01.png',
             PANDAAPied02:'./assets/img/PANDAAPieds_02.png',
             PANDAAPied03:'./assets/img/PANDAAPieds_03.png',
             PANDAAtion01: "./assets/img/PANDAAction_01.png",
             PANDAAtion02: "./assets/img/PANDAAction_02.png",
             PANDAAtion03: "./assets/img/PANDAAction_03.png",
             PANDAAtion04: "./assets/img/PANDAAction_04.png",
             PANDAASaut01: "./assets/img/PANDAASaut_01.png",
        };
        preloadImages(imagesToPreload);
    },
    init: () => {
        // initializing var game
        convagen.val = {line:{old:1,new:1,state:1},start:false,startpanda:-1,saut:false,mapoffset:-1,sautstate:0,direction:"forward"};

        clearTimeout(convagen.forkill);
        convagen.update();
    },
    left: () => {
        if (convagen.val.line.new != 0){
            convagen.val.line.new = convagen.val.line.new - 1;
            convagen.val.direction = "left";
            // convagen.update();
        }
    },
    right: () => {
        if(!convagen.imgcash.PANDASideR){
            convagen.util.returnX("CHARIOTSideR",convagen.imgcash.CHARIOTSide);
            convagen.util.returnX("PANDASideR",convagen.imgcash.PANDASide);

        }
        if (convagen.val.line.new != 2){
            convagen.val.line.new = convagen.val.line.new + 1;
            convagen.val.direction = "right";
            // convagen.update();
        }
    },
    space: () => {
        convagen.val.saut = true;
        // convagen.update();
        // setTimeout(() => {
        //     convagen.val.saut = false;
        //     convagen.update();
        // }, 1000);
    },
    
}
convagen.pre_init();

// add event listener key left right and espace
window.addEventListener('keydown', (e) => {
    // e.preventDefault();
    switch (e.key) {
            case "ArrowLeft":
                convagen.left();
                break;
            case "ArrowRight":
                convagen.right();
                break;
            case " ":
                convagen.space();
                break;
            case "r":
                convagen.init();
                break;
            default:
                panda.util.log(e.key,"pink");
        }
});

document.querySelector("#left-arrow").addEventListener("click", () => {
    convagen.left();
});

document.querySelector("#right-arrow").addEventListener("click", () => {
    convagen.right();
});

document.querySelector("#jump-arrow").addEventListener("click", () => {
    convagen.space();
});

document.querySelector("#startButton").addEventListener("click", () => {
    convagen.init();
})
document.querySelectorAll(".restart").forEach(element => {
    element.addEventListener("click", () => {
        document.querySelector("#defeat").style.display = "none";
        document.querySelector("#victoire").style.display = "none";
        document.querySelector("#menu").style.display = "";
        convagen.init();
    })
});
