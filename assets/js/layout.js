// Robby

var activeMenu = "intro";
var menus = ["intro","projects","results","slides","keynotes","callToAction"]
var isScrollingToNext = false;

/*
 Events
*/
$("#menu a").click(function(event){
	//event.preventDefault();

	/*$("#menu a").removeClass("menuItemActive");
	$("#menu a").addClass("menuItem");
	$(this).addClass("menuItemActive");*/
	highlightMenuItem("#"+$(this).attr("id"));
	activeMenu = $(this).attr("id");
	scrollToPage($(this).attr("href"));
	return false;
});

$("#next").click(function(event){

	if(!isScrollingToNext && (activeMenu != "callToAction" || menus.indexOf(activeMenu) == -1) ){
		//console.log(activeMenu+ " - " + menus.indexOf(activeMenu));
		activeMenu = activeMenu.replace("#","");
		activeMenu = menus[menus.indexOf(activeMenu)+1];
		highlightMenuItem("#a_"+activeMenu);
		scrollToPage("#"+activeMenu);
		isScrollingToNext = true;

		//console.log(activeMenu);
	}
	return false;
});

var scroller=self.setInterval(function(){checkScroll()},400);

function checkScroll(){
	var scrollFromTop = $(this).scrollTop();
	// find the div which top is closest to top of browser
	var closest;
	var closestDistance = Infinity;
	$(".pageDiv").each(function(){
		//console.log($(this).attr("id") + " - " + Math.abs(scrollFromTop - $(this).offset().top) + " - " + closestDistance);

		if(Math.abs(scrollFromTop - $(this).offset().top) < closestDistance){
			var thisdiv = $(this).attr("id");
			closest = "#a_"+thisdiv;
			activeMenu = thisdiv;
			closestDistance = Math.abs(scrollFromTop - $(this).offset().top);
		}
	});
	if(closest){
		//console.log(closest+" is smallest");
		highlightMenuItem(closest);
		if(closest == "#a_callToAction"){
			$("#next").hide(100);
		}else{
			$("#next").show(100);
		}

	}
}


$(document).ready(function() {
	resizeBigVideos();
	$(window).resize(function(){
		resizeBigVideos();
	});
});

function resizeBigVideos(){
	// video hoogtes aanpassen aan hoogte van window:
	$("#intromovie, #keynotesmovie").height( $(window).height() - 200 );
}


function highlightMenuItem(active){
	/*console.log("highlight: ");
	console.log(active);*/
	$("#menu a").removeClass("menuItemActive");
	$("#menu a").addClass("menuItem");
	$(active).addClass("menuItemActive");
}


// check scrolling
// highlight menu items




/*
 Makes DIVS full height
*/


/*
 PageChange
*/
/*function menuClick(e){
	var target = e.currentTarget.getAttribute("href");
	activeMenu = e.currentTarget.getAttribute("href");

}*/

/*
 Transistion scroll to given page (div)
*/
function scrollToPage(pageId){
	var offset = $(pageId).offset().top;
	$('html, body').stop().animate({scrollTop: offset}, 400, function(){
		window.location = pageId;
		if( window.location.hash.match(/#results/) && Results!= null)
			window.location = pageId+Results.index;
		isScrollingToNext = false;
	});
	activeMenu = pageId;
}
