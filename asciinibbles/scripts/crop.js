var imageCropper = {

    ctx: null,

    image: null,

    click: false,

    downPointX: 0,

    downPointY: 0,

    lastPointX: 0,

    lastPointY: 0,

    hoverBoxSize: 5,

    cropedFile: null,

    resize: false,

    canvasBackgroundColor: "#FFFFFF",

    init: function() {
        this.ctx = document.getElementById("panel").getContext("2d");
        var imageUploader = document.getElementById('imageLoader');
        this.initCanvas();
        document.getElementById("cropBttn").onclick = this.cropImage.bind(this);
    },

    initCanvas: function(image) {
        this.image = new Image();
        this.image.src = "canvas.png";
        this.image.onload = function() {
            this.ctx.canvas.width = this.image.width;
            this.ctx.canvas.height = this.image.height;
            this.reDrawCanvas();
            this.initEventsOnCanvas();
        }.bind(this);
    },

    /**
     * Initlize mousedown and mouseup event, third brother of this type of event, onmousemove, will be set little letter.
     *
     */
    initEventsOnCanvas: function() {
        this.ctx.canvas.onmousedown = this.onMouseDown.bind(this);
        this.ctx.canvas.onmouseup = this.onMouseUp.bind(this);
    },

    /**
     * This event is bit tricky!
     * Normal task of this method is to pin point the starting point, from where we will  start making the selection box.
     * However, it work diffrently if user is hover over the resize boxes
     *
     */
    onMouseDown: function(e) {
        var loc = this.windowToCanvas(e.clientX, e.clientY);
        e.preventDefault();
        this.click = true;
        if (!this.resize) {
            this.ctx.canvas.onmousemove = this.onMouseMove.bind(this);
            this.downPointX = loc.x;
            this.downPointY = loc.y;
            this.lastPointX = loc.x;
            this.lastPointY = loc.y;
        }
    },

    /**
     * register normal movement, with click but no re-size.
     */
    onMouseMove: function(e) {
        e.preventDefault();
        if (this.click) {
            var loc = this.windowToCanvas(e.clientX, e.clientY);
            this.lastPointX = loc.x;
            this.lastPointY = loc.y;
            this.reDrawCanvas();
            //console.log('MOVING e.clientX:',e.clientX,' e.clientY: ',e.clientY,' loc.x: ',loc.x,' loc.y: ',loc.y);
        }
    },

    onMouseUp: function(e) {
        e.preventDefault();
        this.ctx.canvas.onmousemove = this.onImageResize.bind(this);
        this.click = false;
    },

    reDrawCanvas: function() {
        this.clearCanvas();
        this.drawImage();
        this.drawSelRect();
        this.drawResizerBox();
    },

    clearCanvas: function() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = this.canvasBackgroundColor;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    },

    /**
     * Draw image on canvas.
     */
    drawImage: function() {
        this.ctx.drawImage(this.image, 0, 0);
    },

    /**
     * Draw selection box on canvas
     */
    drawSelRect: function() {

        //We are gonna limit the cropping to 160 x 80 
        //Also we limit the selection to 
        // From LEFT-to-RIGHT and TOP-to-BOTTOM (we could also implement others)
        if(this.lastPointX-this.downPointX <= 0){
            this.lastPointX = this.downPointX ;
        }else if(this.lastPointX-this.downPointX > 160){
            this.lastPointX = this.downPointX +160;
        }
        if(this.lastPointY-this.downPointY <= 0){
            this.lastPointY = this.downPointY + 1;
        }else if(this.lastPointY-this.downPointY > 80){
            this.lastPointY = this.downPointY + 80;
        }

        //Draw the selection box with strokeRect
        this.ctx.strokeStyle = '#FF0000';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(this.downPointX, this.downPointY, (this.lastPointX - this.downPointX), (this.lastPointY - this.downPointY));
        //console.log('DRAWSELRECT: ',this.downPointX, this.downPointY, (this.lastPointX - this.downPointX), (this.lastPointY - this.downPointY));
    },

    /**
     * This method take care of resizeing the selection box.
     * It does so by looking on (click == true and hover on resize box == true)
     * if both are true, it adjust the resize.
     *
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    onImageResize: function(e) {
        var centerPointX = (this.lastPointX + this.downPointX) / 2;
        var centerPointY = (this.lastPointY + this.downPointY) / 2;
        var loc = this.windowToCanvas(e.clientX, e.clientY);
        this.ctx.fillStyle = '#FF0000';
        this.ctx.lineWidth = 1;
        if (this.isResizeBoxHover(loc, centerPointX, this.downPointY)) {
            if (this.click) {
                this.downPointY = loc.y;
                this.reDrawCanvas();
            }
        } else if (this.isResizeBoxHover(loc, this.lastPointX, centerPointY)) {
            if (this.click) {
                this.lastPointX = loc.x;
                this.reDrawCanvas();
            }
        } else if (this.isResizeBoxHover(loc, centerPointX, this.lastPointY)) {
            if (this.click) {
                this.lastPointY = loc.y;
                this.reDrawCanvas();
            }
        } else if (this.isResizeBoxHover(loc, this.downPointX, centerPointY)) {
            if (this.click) {
                this.downPointX = loc.x;
                this.reDrawCanvas();
            }
        } else {
            this.resize = false;
            this.reDrawCanvas();
        }
    },

    /**
     * Detect the mousehover on given axis
     */
    isResizeBoxHover: function(loc, xPoint, yPoint) {
        var hoverMargin = 3;
        if (loc.x > (xPoint - this.hoverBoxSize - hoverMargin) && loc.x < (xPoint + this.hoverBoxSize + hoverMargin) && loc.y > (yPoint - this.hoverBoxSize - hoverMargin) && loc.y < (yPoint + 5 + hoverMargin)) {
            this.ctx.fillRect(xPoint - this.hoverBoxSize, yPoint - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2);
            this.resize = true;
            return true;
        }
        return false;
    },

    /**
     * Draw 4 resize box of 10 x 10
     * @return {[type]} [description]
     */
    drawResizerBox: function() {
        var centerPointX = (this.lastPointX + this.downPointX) / 2;
        var centerPointY = (this.lastPointY + this.downPointY) / 2;
        this.ctx.fillStyle = '#000000';
        this.ctx.lineWidth = 1;
        this.ctx.fillRect(centerPointX - this.hoverBoxSize, this.downPointY - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2);
        this.ctx.fillRect(this.lastPointX - this.hoverBoxSize, centerPointY - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2);
        this.ctx.fillRect(centerPointX - this.hoverBoxSize, this.lastPointY - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2);
        this.ctx.fillRect(this.downPointX - this.hoverBoxSize, centerPointY - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2);
    },

    /**
     * Translate to HTML coardinates to Canvas coardinates.
     */
    windowToCanvas: function(x, y) {
        var canvas = this.ctx.canvas,
            bbox = canvas.getBoundingClientRect();
        return {
            x: x - bbox.left * (canvas.width / bbox.width),
            y: y - bbox.top * (canvas.height / bbox.height)
        };
    },

    /**
     * Get the canvas, remove cutout, create image elemnet on UI.
     * @return {[type]}
     */
    cropImage: function() {
        tempCtx = document.createElement('canvas').getContext('2d');
        /* We are gonna limit the cropping to 160 x 80 
        (This is useless since we limit it from drawSelRect - We limit the selection while mousemoving instead of limiting it when pressing crop button)
        if(this.lastPointX-this.downPointX > 160){
            this.lastPointX = this.downPointX + 160;
        }
        if(this.lastPointY-this.downPointY > 80){
            this.lastPointY = this.downPointY + 80;
        }
        */

        // Using the new image size
        // tempCtx.canvas.width = this.image.width;
        // tempCtx.canvas.height = this.image.height;
        tempCtx.canvas.width = this.lastPointX;
        tempCtx.canvas.height = this.lastPointY;

        //Debugging the cropped image coordinates
        console.log('Selected region initial pos X: ', this.downPointX,' Selected region initial pos Y: ', this.downPointY);
        console.log('Selected region last pos X: ', this.lastPointX,' Selected region last pos Y: ', this.lastPointY);

        //Calculating the end of the image
        //var cropLastX = this.lastPointX - this.downPointX;
        //var cropLastY = this.lastPointY - this.downPointY;
        croppedRegionX = this.lastPointX - this.downPointX;
        croppedRegionY = this.lastPointY - this.downPointY; 

        //Draw the image. 
        if(croppedRegionX > 0 && croppedRegionY > 0){
            tempCtx.drawImage(this.image, this.downPointX, this.downPointY, croppedRegionX, croppedRegionY, 0, 0, croppedRegionX, croppedRegionY);
            var imageData = tempCtx.canvas.toDataURL();
            document.getElementById('croppedImage').src = imageData;


            // Store the selected region into a pixel array
            //var imgData = tempCtx.getImageData(this.downPointX,this.downPointY,this.lastPointX,this.lastPointY);
            //var data = imgData.data; // Contains every pixel color R G B A .  [R,G,B,A,R,G,B,A,R,G,B,A ...] each 4 positions 1 pixel is defined
            
            // getImageData(downPointX,downPointY) was WRONG because it is the canvas on the right side (tempCtx), and that starts at 0,0 and not where the mouse cursor is!
            croppedImageData = tempCtx.getImageData(0, 0, croppedRegionX,croppedRegionY);
            

            // Set the cropped image size
            
        }else{
            console.log('ERROR: The selected region has an X or Y value = 0');
        }
        
    }
}


