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
	h_canvas = document.getElementById("h_canvas");
	my_context = h_canvas.getContext('2d');
	showTitle();
	showDivs();
	
	document.getElementById('h_canvas').addEventListener("mousedown",(function(e){
		var xCord = e.pageX - this.offsetLeft - 25;
		var yCord = e.pageY - this.offsetTop - 19;
		console.log('e.pageX= ', e.pageX, 'e.pageY= ', e.pageY, 'this.offsetLeft= ', this.offsetLeft, 'this.offsetTop= ', this.offsetTop, 'x= ', xCord, 'y= ', yCord); 
	
		drawLogo(xCord, yCord);
	}));
	
	var runAlbumEditor = $('#albumEditorBody').attr("data-page");
	console.log(runAlbumEditor);
	if(runAlbumEditor == 'run'){
		editor_canvas = document.getElementById("albumEditor");
		editor_context = editor_canvas.getContext('2d');
		loadEditor();
		
		var brushSize = 5;
		var range = document.getElementById("paintbrushSize");
		range.addEventListener("change", function(){
			document.getElementById("rangeValue").innerHTML = range.value;
			brushSize = range.value;
		});
		var brushColour;
		var colourChange = document.getElementById("paintbrushColour");
		colourChange.addEventListener("change", function(){
			brushColour = colourChange.value;
		});
	
		var eraserSize = 5;
		var eraserRange = document.getElementById("eraserSize");
		eraserRange.addEventListener("change", function(){
			document.getElementById("eraserRangeValue").innerHTML = eraserRange.value;
			eraserSize = eraserRange.value;
		});

		document.getElementById('albumEditor').addEventListener("mousedown", (function(e){
			paintCheckBox = document.getElementById('paintCheckBox');
			eraserCheckBox = document.getElementById('eraserCheckBox');
			if(paintCheckBox.checked == false){
				if(eraserCheckBox.checked == false){
				var xCord = e.pageX - this.offsetLeft - 25;
				var yCord = e.pageY - this.offsetTop - 30;
				//console.log('e.pageX= ', e.pageX, 'e.pageY= ', e.pageY, 'this.offsetLeft= ', this.offsetLeft, 'this.offsetTop= ', this.offsetTop, 'x= ', xCord, 'y= ', yCord); 
				drawEditorIcon(xCord, yCord);
			} else {
				enable_eraser = true;
				console.log(enable_eraser);
				document.getElementById('albumEditor').addEventListener("mousemove", (function(e){
					var xCord = e.pageX - this.offsetLeft;
					var yCord = e.pageY - this.offsetTop;
					EditorEraser(xCord, yCord, enable_eraser, eraserSize);
				}));
			}
			} else {
				enable_paint = true;
				console.log(enable_paint);
				document.getElementById('albumEditor').addEventListener("mousemove", (function(e){
					var xCord = e.pageX - this.offsetLeft;
					var yCord = e.pageY - this.offsetTop;
					//console.log("x= " + xCord + " y= " + yCord + " enable_paint= " + enable_paint);
					drawEditorPaint(xCord, yCord, enable_paint, brushSize, brushColour);
				}));
			}
		}));
		document.getElementById('albumEditor').addEventListener("mouseup", (function(e){
		console.log('up');
		enable_paint = false;
		enable_eraser = false;
		}));

	};
	
}

function changeIcon(icon){
	console.log('icon change');
	iconImg = icon;
	hideIconList();
}
function changeEditorIcon(icon){
	console.log('Editor Icon Change');
	editorIcon = icon;
}
function drawEditorIcon(xCord, yCord){
	editorImg = new Image();
	editorImg.src = 'assets/AlbumCoverEditor/' + editorIcon + '.png';
	
	editor_context.drawImage(editorImg, xCord, yCord);
}
function drawEditorPaint(xCord, yCord, enable_paint_canvas, brushSize, brushColour){
	if(enable_paint_canvas == true){
		editor_context.beginPath();
		editor_context.arc(xCord, yCord, brushSize, 0, 2 * Math.PI, false);
		editor_context.fillStyle = brushColour;
		editor_context.fill();
	};
}
function EditorEraser(xCord, yCord, enable_eraser_canvas, eraserSize){
	if(enable_eraser_canvas == true){
		editor_context.clearRect(xCord, yCord, eraserSize, eraserSize);
	}
}

function clearEditor(){
	editor_context.clearRect(0, 0, 509, 512);
}
function showTitle(){
	console.log("loaded func");
	my_context.font = "61px Cooper Black";
	my_context.fillStyle = '#ffffff';
	my_context.fillText("ODD FUTURE", 500, 65);
	my_context.font = "60px Cooper Black";
	my_context.fillStyle = '#FF8DA4';
	my_context.fillText("ODD FUTURE", 510, 60);
}
function drawLogo(xCord, yCord){
	base_image = new Image();
	base_image.src = 'assets/' + iconImg + '.png';
	console.log("x= " + xCord + " y= " + yCord);
	
	my_context.drawImage(base_image, xCord, yCord, 50, 37.07);
}
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

function loadEditor(){
	console.log('Loaded Editor');
}

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(tourMap);
    } else {
        $('#googleMap').innerHTML = "Geolocation is not supported by this browser.";
    }
}
function tourMap(position, x){
	var mapProp;
	if (x == 1) {
		mapProp= {
		center:new google.maps.LatLng(position),
		zoom: 5,
		}
	}
	if (x != 1) {
		var mapLat = position.coords.latitude;
		console.log(mapLat);
		var mapLng = position.coords.longitude;
		console.log(mapLng);
		
		mapProp= {
			center:new google.maps.LatLng(mapLat, mapLng),
			zoom:10,
		};
	}

	var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
	
	venueMarker({lat:mapLat,lng:mapLng}, ' ', map);
	venueMarker({lat:37.768005,lng:-122.420528}, 'A', map);
	venueMarker({lat:32.755548,lng:-117.212253}, 'B', map);
	venueMarker({lat:33.437016,lng:-111.943981}, 'C', map);
	venueMarker({lat:39.099143,lng:-94.583846}, 'D', map);
	venueMarker({lat:32.782205,lng:-96.784138}, 'E', map);
	venueMarker({lat:33.761059,lng:-84.401208}, 'D', map);
}	

function venueMarker(venueLoc, label, map){
	var marker = new google.maps.Marker({
		position: venueLoc,
		label: label,
		map: map
		});
}

function openModal(x){
	console.log(x);
	$('#' + x).css('display', 'block');
}
function closeModal(){
	$('.memberModal').css('display', 'none');
}
function playMusicButton(title){
	console.log(title);
	var music = document.getElementById(title);
	music.play();
}


function favouriteVideo(x, y){
	favVideoArray = new Array();
	
	var favVideo = x;
	console.log(favVideo);
	var favVideoName= y;
	console.log(favVideoName);
	var favVideoLink = $('.LS_video' + x).attr('id');
	console.log(favVideoLink);
	
	favVideoArray.push({favVideoIndex:favVideo,favVideoInput:favVideoLink,favVideoName:favVideoName});
	
	var favVideoArrayStringify = JSON.stringify(favVideoArray);
	console.log(favVideoArrayStringify);
	
	localStorage.setItem("favVideo", favVideoArrayStringify);
	
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

function showSortList(){
	$('#storeSort').css('display', 'block');
	$('#storeSort').animate({marginLeft: '-20px'});
	var sortListTimer = setInterval(hideSortList, 10000);
}
function hideSortList(){
	$('#showSortList').css('display', 'block');
	$('#storeSort').animate({marginLeft: '-200px'});
}

$(function(){
	cartArray = new Array();
	$('#cartContent').datagrid({
		singleSelect:true
	});
	
	if(localStorage && localStorage.getItem('Cart')){
		console.log(localStorage.getItem('Cart'));
		cartArray = JSON.parse(localStorage.getItem('Cart'));
		//console.log(cartArray);
		//console.log(cartArray.length);
		for (i = 0; i < cartArray.length; i++){
			//console.log('i = ' + i);
			var addLocalStorageItems = cartArray[i];
			//console.log(addLocalStorageItems);
			var name = addLocalStorageItems['Name'];
			var price = addLocalStorageItems['Price'];
			//console.log(name);
			//console.log(price);
			addProduct(name, parseFloat(price));
		}
	}
	
	$('.storeItem').draggable({
		revert:true,
		proxy:'clone',
		onStartDrag:function(){
			$(this).draggable('proxy').css('z-index',10);
			showCart();
		}
	});
	
	$('.cart').droppable({
		onDrop:function(e,source){
			var name = $(source).find('h3.storeItemName').text();
			var price = $(source).find('h4.storeItemPrice').attr("data-price");

			addProduct(name, parseFloat(price));
			cartArray.push({Name:name,Price:price,Quantity:1});
			JSON.stringify(cartArray);
		}
	});
	

});

function showCart(){
	$('.cart').animate({bottom: '0px'});
	$('#storeSection').css('height', '6750px');
}
function hideCart(){
	{ $('.cart').animate({bottom: '0px'}); }
}

function addProduct(name,price){
	function add(){
		for(var i=0; i<cartData.total; i++){
			var row = cartData.rows[i];
			if (row.Name == name){
				row.Quantity += 1;
				return;
			}
		}
		cartData.total += 1;
		cartData.rows.push({
			Name:name,
			Quantity:1,
			Price:price
		});
	}
	add();
	totalCost += price;
	$('#cartContent').datagrid('loadData', cartData);
	$('div.cart .total').html('Total: £'+totalCost);
	
	console.log(cartData);
	var cartArrayStringify = JSON.stringify(cartArray);
	console.log(cartArrayStringify);
	localStorage.setItem("Cart",cartArrayStringify);
}
function emptyCart(){
	console.log('empty cart');
	localStorage.removeItem('Cart');
	/*for (var i = 0; i<cartData.total; i++){
		$('#cartContent').datagrid('removeRow[Array(i)]');
	}*/
	window.location.reload();
}

function storeSort(x) {
	var storeSortData = x
	
	$('.storeItem').css('display', 'none');
	$('.' + storeSortData).css('display', 'block');
	
	console.log("Sorted to " + storeSortData);
};

var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
	showDivs(slideIndex += n);
}

function showDivs(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  //console.log(slides);
  if (n > slides.length) {slideIndex = 1};
  if (n < 1) {slideIndex = slides.length};
  for (i = 0; i < slides.length; i++) {
     slides[i].style.display = "none";  
  }
  $(slides[slideIndex-1]).css('display', 'block');  
};
