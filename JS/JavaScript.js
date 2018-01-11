var h_canvas, my_context, canvas_image;
var my_Array=[];
var img=document.getElementById("assests/doughnut.png");
var favVideoStorage = {"favVideoIndex":0,"favVideoInput":""};
var cartData = {"total":0,"rows":[]};
var totalCost = 0;
var interval = 30;
var base_image;
var iconImg = 'donut';
var editor_canvas, editor_context;
var droppedPos;
var editorIcon;
var paintCheckBox, enable_paint = false, enable_eraser = false;

window.onload = function() {
	//loading the header Canvas for each webpage
	h_canvas = document.getElementById("h_canvas");
	my_context = h_canvas.getContext('2d');
	//This will show the 'Odd Future' title of the website, needing to be loaded when the DOM has loaded
	showTitle();
	
	//this is for the JavaScript slide show, it will load up the first image
	showDivs();
	
	//Used for the customisable header canvas to allow images to be placed on click
	document.getElementById('h_canvas').addEventListener("mousedown",(function(e){
		//The position is taken from the data from the users click to input the image into the canvas
		var xCord = e.pageX - this.offsetLeft - 25;
		var yCord = e.pageY - this.offsetTop - 19;
		//console.log('e.pageX= ', e.pageX, 'e.pageY= ', e.pageY, 'this.offsetLeft= ', this.offsetLeft, 'this.offsetTop= ', this.offsetTop, 'x= ', xCord, 'y= ', yCord); 
		//runs the function to add the image to the canvas
		drawLogo(xCord, yCord);
	}));
	
	//Checks to see if the album editor canvas is present and if it isnt it wont run all the functions
	var runAlbumEditor = $('#albumEditorBody').attr("data-page");
	//console.log(runAlbumEditor);
	if(runAlbumEditor == 'run'){
		//Loading the canvas onto the webpage
		editor_canvas = document.getElementById("albumEditor");
		editor_context = editor_canvas.getContext('2d');
		
		//Sets the default brush size for the editor
		var brushSize = 5;
		//when the slider is changed it will change the brush size
		var range = document.getElementById("paintbrushSize");
		range.addEventListener("change", function(){
			document.getElementById("rangeValue").innerHTML = range.value;
			brushSize = range.value;
		});
		//sets the brush colour of the paint brush
		var brushColour;
		//changes the brush colour when the user chooses a different colour on the website
		var colourChange = document.getElementById("paintbrushColour");
		colourChange.addEventListener("change", function(){
			brushColour = colourChange.value;
		});
		//sets the default eraser size for the editor
		var eraserSize = 5;
		//when the lider is changed so will the eraser size
		var eraserRange = document.getElementById("eraserSize");
		eraserRange.addEventListener("change", function(){
			document.getElementById("eraserRangeValue").innerHTML = eraserRange.value;
			eraserSize = eraserRange.value;
		});
		
		//Used to input the images, draw or erase parts the the canvas
		document.getElementById('albumEditor').addEventListener("mousedown", (function(e){
			//this checks if either of the paintbrush or eraser are selected
			paintCheckBox = document.getElementById('paintCheckBox');
			eraserCheckBox = document.getElementById('eraserCheckBox');
			//nested if statements for the program to use logic to choose what function to carry out
			if(paintCheckBox.checked == false){
				if(eraserCheckBox.checked == false){
				//Input images
				//The position is taken from the data from the users click to input the image into the canvas
				var xCord = e.pageX - this.offsetLeft - 25;
				var yCord = e.pageY - this.offsetTop - 30;
				//console.log('e.pageX= ', e.pageX, 'e.pageY= ', e.pageY, 'this.offsetLeft= ', this.offsetLeft, 'this.offsetTop= ', this.offsetTop, 'x= ', xCord, 'y= ', yCord); 
				drawEditorIcon(xCord, yCord);
			} else {
				//Enable eraser to erase some of the canvas
				enable_eraser = true;
				//console.log(enable_eraser);
				//when the user moves their mouse the canvas will erase parts of the canvas near the mouse
				document.getElementById('albumEditor').addEventListener("mousemove", (function(e){
					//The position is taken from the data from the users click to input the image into the canvas
					var xCord = e.pageX - this.offsetLeft;
					var yCord = e.pageY - this.offsetTop;
					//runs the erase function
					EditorEraser(xCord, yCord, enable_eraser, eraserSize);
				}));
			}
			} else {
				//enable painting on the canvas
				enable_paint = true;
				//console.log(enable_paint);
				//when the user moves their mouse the canvas will paint parts of the canvas near the mouse
				document.getElementById('albumEditor').addEventListener("mousemove", (function(e){
					//The position is taken from the data from the users click to input the image into the canvas
					var xCord = e.pageX - this.offsetLeft;
					var yCord = e.pageY - this.offsetTop;
					//console.log("x= " + xCord + " y= " + yCord + " enable_paint= " + enable_paint);
					//runs the paint function
					drawEditorPaint(xCord, yCord, enable_paint, brushSize, brushColour);
				}));
			}
		}));
		//will stop the paint and erase function
		document.getElementById('albumEditor').addEventListener("mouseup", (function(e){
		//console.log('up');
		enable_paint = false;
		enable_eraser = false;
		}));

	};
	
}

//Changes the icon for the header canvas
function changeIcon(icon){
	//console.log('icon change');
	iconImg = icon;
	hideIconList();
}
//Changes the icon for the album customiser canvas
function changeEditorIcon(icon){
	//console.log('Editor Icon Change');
	editorIcon = icon;
}
//WIll input the image onto the album canvas
function drawEditorIcon(xCord, yCord){
	//creates a new image entity
	editorImg = new Image();
	//uses the var editorIcon which was choosen before by the user
	editorImg.src = 'assets/AlbumCoverEditor/' + editorIcon + '.png';
	
	//inputs the image using all image entity and mouse coordinates on the click
	editor_context.drawImage(editorImg, xCord, yCord);
}
//Used to paint circles on the album canvas
function drawEditorPaint(xCord, yCord, enable_paint_canvas, brushSize, brushColour){
	if(enable_paint_canvas == true){
		//draws a circle using paths and pi
		editor_context.beginPath();
		editor_context.arc(xCord, yCord, brushSize, 0, 2 * Math.PI, false);
		//uses the user selected colour for the circle colour
		editor_context.fillStyle = brushColour;
		editor_context.fill();
	};
}
//used to erase parts of the canvas
function EditorEraser(xCord, yCord, enable_eraser_canvas, eraserSize){
	if(enable_eraser_canvas == true){
		//clears a rectangle where the mouse has been clicked and dragged in a size choosen before by the user
		editor_context.clearRect(xCord, yCord, eraserSize, eraserSize);
	}
}
//when the 'clear all' button button is pressed this will remove everything from the canvas 
function clearEditor(){
	editor_context.clearRect(0, 0, 509, 512);
}

//Loads up the title with the shadowed effect
function showTitle(){
	//console.log("loaded func");
	//using the odd future normal font and solours from the colour scheme
	my_context.font = "61px Cooper Black";
	my_context.fillStyle = '#ffffff';
	my_context.fillText("ODD FUTURE", 500, 65);
	my_context.font = "60px Cooper Black";
	my_context.fillStyle = '#FF8DA4';
	my_context.fillText("ODD FUTURE", 510, 60);
}
//inputs the image onto the header where the user clicks
function drawLogo(xCord, yCord){
	//creates a new image entity from the choosen icon beforehand
	base_image = new Image();
	base_image.src = 'assets/' + iconImg + '.png';
	//console.log("x= " + xCord + " y= " + yCord);
	
	my_context.drawImage(base_image, xCord, yCord, 50, 37.07);
}

//JQuery animations to show and hide the icons for the header
function showIconList(){
	$('#showIconButton').css('display', 'none');
	$('#selectIconMenu').css('marginBottom', '-133px');
	$('#selectIconMenu').animate({marginLeft: '-20px'});
}
function hideIconList(){
	$('#selectIconMenu').animate({marginLeft: '-330px'});
	$('#selectIconMenu').css('marginBottom', '-105px');
	$('#showIconButton').css('display', 'block');
}

//geo location to find the users location
function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(tourMap);
    } else {
        $('#googleMap').innerHTML = "Geolocation is not supported by this browser.";
    }
}
//loads up a map centered on the users location and creates markers where odd future tours are
function tourMap(position, x){
	var mapProp;
	//if the user selects a tour location
	if (x == 1) {
		mapProp= {
		center:new google.maps.LatLng(position),
		zoom: 5,
		}
	}
	//when the window is first loaded the map will center on the users locartion if they give permission to the browser
	if (x != 1) {
		var mapLat = position.coords.latitude;
		//console.log(mapLat);
		var mapLng = position.coords.longitude;
		//console.log(mapLng);
		
		mapProp= {
			center:new google.maps.LatLng(mapLat, mapLng),
			zoom:10,
		};
	}
	//sets the map in to div set out for the map
	var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
	
	//holds the users location on the blank marger and all tour locations label with a character alphabetically
	venueMarker({lat:mapLat,lng:mapLng}, ' ', map);
	venueMarker({lat:37.768005,lng:-122.420528}, 'A', map);
	venueMarker({lat:32.755548,lng:-117.212253}, 'B', map);
	venueMarker({lat:33.437016,lng:-111.943981}, 'C', map);
	venueMarker({lat:39.099143,lng:-94.583846}, 'D', map);
	venueMarker({lat:32.782205,lng:-96.784138}, 'E', map);
	venueMarker({lat:33.761059,lng:-84.401208}, 'D', map);
}	
//runs the function to set the markers on the map
function venueMarker(venueLoc, label, map){
	var marker = new google.maps.Marker({
		position: venueLoc,
		label: label,
		map: map
		});
}

//the modals are the popups which are set for each member
//opens the modal using JQuery and the argument 'x' which is the members name
function openModal(x){
	//console.log(x);
	$('#' + x).css('display', 'block');
}
//sets the modal to display none to close the modal
function closeModal(){
	$('.memberModal').css('display', 'none');
}

//local storage to set the users favourite video from the loiter squad page
function favouriteVideo(x, y){
	//creates a new array for the favourite video
	favVideoArray = new Array();
	//x = videos unique ID
	var favVideo = x;
	//console.log(favVideo);
	//y = The name of the video to be input into the videos header
	var favVideoName= y;
	//console.log(favVideoName);
	//uses JQuery to use the unique ID to get the link to the youtube video
	var favVideoLink = $('.LS_video' + x).attr('id');
	//console.log(favVideoLink);
	
	//pushes the variables into the array to save into local storage
	favVideoArray.push({favVideoIndex:favVideo,favVideoInput:favVideoLink,favVideoName:favVideoName});
	
	//converts the array into a string to be set into local storgae
	var favVideoArrayStringify = JSON.stringify(favVideoArray);
	//console.log(favVideoArrayStringify);
	//sets the local storage item
	localStorage.setItem("favVideo", favVideoArrayStringify);
	//this inputs the video into the favourite video area
	inputFavouriteVideo();
};
function inputFavouriteVideo(){
	favVideoArray = new Array();
	favVideoArray = JSON.parse(localStorage.getItem('favVideo'));
	
	console.log(favVideoArray);
	
	var favVideoLink = favVideoArray["0"].favVideoInput;
	//console.log(favVideoLink);
	var favVideoName = favVideoArray["0"].favVideoName;
	//console.log(favVideoName);
	
	$('#LS_favVideoFrame').attr('src', 'https://www.youtube.com/embed/' + favVideoLink + '?rel=0');
	document.getElementById("LS_favVideoTitle").innerHTML = favVideoName;
}
//uses JQuery animations to reveal the favourite video, this allows for the user to come back and view the video later
function showFavourite(){
	$('.LS_favVideoArea').css('display', 'block');
	$('#showFavButton').css('display', 'none');
	$('#showFavButton').css('marginLeft', '8%');
	$('#hideFavButton').css('display', 'block');
	$('#LS_videoDiv').css('height', '3700px');
	inputFavouriteVideo();
}
function hideFavourite(){
	$('.LS_favVideoArea').css('display', 'none');
	$('#showFavButton').css('display', 'block');
	$('#hideFavButton').css('display', 'none');
	$('#LS_videoDiv').css('height', '3000px');
}

//uses JQuery animation to show the sort list for the store
function showSortList(){
	$('#storeSort').css('display', 'block');
	$('#storeSort').animate({marginLeft: '-20px'});
	//this interval timer allows for the list to be hidden after a breif pause of it being visible, reducing screen cluster for the user
	var sortListTimer = setInterval(hideSortList, 10000);
}
function hideSortList(){
	$('#showSortList').css('display', 'block');
	$('#storeSort').animate({marginLeft: '-200px'});
}

//All the code used to allow the drag and drop aspect of the cart to work as well as save the cart onto local stroage
$(function(){
	//creates and array to store the cart in
	cartArray = new Array();
	//makes the cart a datagrid using the jeasyui library
	$('#cartContent').datagrid({
		singleSelect:true
	});
	
	//this will get any items in the cart before hand to load them into the cart
	if(localStorage && localStorage.getItem('Cart')){
		//console.log(localStorage.getItem('Cart'));
		//parse the array to allow JavaScript to understand it
		cartArray = JSON.parse(localStorage.getItem('Cart'));
		//console.log(cartArray);
		//console.log(cartArray.length);
		//this is a for loop to get each item in the array
		for (i = 0; i < cartArray.length; i++){
			//console.log('i = ' + i);
			//gets each array item into one variable to be easierr extracted
			var addLocalStorageItems = cartArray[i];
			//console.log(addLocalStorageItems);
			//gets each part of the array into seporate variables to be input into the cart
			var name = addLocalStorageItems['Name'];
			var price = addLocalStorageItems['Price'];
			//console.log(name);
			//console.log(price);
			//these are then passed through the normal function to be added to the cart
			addProduct(name, parseFloat(price));
		}
	}
	
	//sets each of the store items as draggable
	$('.storeItem').draggable({
		revert:true,
		proxy:'clone',
		//on drag the item follows the cursor and reveals the cart if its not allready shown
		onStartDrag:function(){
			$(this).draggable('proxy').css('z-index',10);
			showCart();
		}
	});
	
	//makes the cart droppable to allow the items to be dragged onto it
	$('.cart').droppable({
		onDrop:function(e,source){
			//similar to local storage gets the name and price value of the store item
			var name = $(source).find('h3.storeItemName').text();
			var price = $(source).find('h4.storeItemPrice').attr("data-price");
			//runs the function to add the item to the cart using the variables
			addProduct(name, parseFloat(price));
			//pushes the item into an array to be added to local storage as well
			cartArray.push({Name:name,Price:price,Quantity:1});
			JSON.stringify(cartArray);
		}
	});
	

});

//shows the cart to allow items to be dropped into the cart, uses JQuery animations
function showCart(){
	$('.cart').animate({bottom: '0px'});
	$('#storeSection').css('height', '6750px');
}
//hides the cart to allow the user to see the store easier
function hideCart(){
	{ $('.cart').animate({bottom: '0px'}); }
}

//function to add the item to the cart and local storage
function addProduct(name,price){
	//goes through each row to see if their is a duplicate object and if there is just add one to the quantity
	function add(){
		for(var i=0; i<cartData.total; i++){
			var row = cartData.rows[i];
			if (row.Name == name){
				row.Quantity += 1;
				return;
			}
		}
		//add 1 to the total size of the cart
		cartData.total += 1;
		//pushes the items attributes into the array
		cartData.rows.push({
			Name:name,
			Quantity:1,
			Price:price
		});
	}
	//runs add function
	add();
	//calculates the new total price
	totalCost += price;
	//updates the cart items and price
	$('#cartContent').datagrid('loadData', cartData);
	$('div.cart .total').html('Total: £'+totalCost);
	
	//console.log(cartData);
	//adds the item to the local storage
	var cartArrayStringify = JSON.stringify(cartArray);
	//console.log(cartArrayStringify);
	localStorage.setItem("Cart",cartArrayStringify);
}
//emptys the local storage and the cart
function emptyCart(){
	//console.log('empty cart');
	//removes the local storage for 'cart'
	localStorage.removeItem('Cart');
	/*for (var i = 0; i<cartData.total; i++){
		$('#cartContent').datagrid('removeRow[Array(i)]');
	}*/
	//reloading the window removes everything from the cart because there is no longer anything in the local storage to reload
	window.location.reload();
}

//when a sort option is selected, depending on the class of the item that will be displayed or not
function storeSort(x) {
	var storeSortData = x
	
	$('.storeItem').css('display', 'none');
	$('.' + storeSortData).css('display', 'block');
	
	//console.log("Sorted to " + storeSortData);
};
//shows the first slide of the javascript slideshow
var slideIndex = 1;
showDivs(slideIndex);

//when the user presses either of the arrows on the slideshow it will change the image shown
function plusDivs(n) {
	showDivs(slideIndex += n);
}

//shows the selected image on the slideshow
function showDivs(n) {
  var i;
  //gets each image into one variable
  var slides = document.getElementsByClassName("mySlides");
  //console.log(slides);
  //gives each image a index (i) and scrolls through the index when the user presses either left or right
  if (n > slides.length) {slideIndex = 1};
  if (n < 1) {slideIndex = slides.length};
  for (i = 0; i < slides.length; i++) {
	  //sets all other images as display none;
     slides[i].style.display = "none";  
  }
  //sets selected image to display
  $(slides[slideIndex-1]).css('display', 'block');  
};
