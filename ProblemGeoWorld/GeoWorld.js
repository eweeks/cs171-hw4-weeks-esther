/**
 * Created by hen on 3/8/14.
 */

var margin = {
	top: 50,
	right: 50,
	bottom: 50,
	left: 50,
	text: 10,
	screen: 1130
};

var width = 950 - margin.left - margin.right;
var height = 700 - margin.bottom - margin.top;

var bbVis = {
	x: 100,
	y: 10,
	w: width - 100,
	h: 300
};

var dataSet = {};

var svg = d3.select("#vis")
	.append("svg").attr({
		width: width + margin.left + margin.right,
		height: height + margin.top + margin.bottom
	})
	.append("g").attr({
		transform: "translate(" + margin.left + "," + (margin.top+50) + ")"
	});

var info = d3.select("#textLabel")
	.append("svg")
	.attr({
		width: margin.screen-width,
		height: height + margin.top + margin.bottom
	})
	.append("g")
	.attr({
		width: margin.screen-width,
		height: height + margin.top + (margin.bottom+100)
	})
	.attr({
		transform: "translate(" + margin.text + "," + margin.top + ")"
	});

// --- this is just for fun.. play arround with it iof you like :)
var projectionMethods = [
	{
		name:"mercator",
		method: d3.geo.mercator().translate([width / 2, height / 2])//.precision(.1);
	},{
		name:"equiRect",
		method: d3.geo.equirectangular().translate([width / 2, height / 2])//.precision(.1);
	},{
		name:"stereo",
		method: d3.geo.stereographic().translate([width / 2, height / 2])//.precision(.1);
	}
];

var actualProjectionMethod = 0;
var colorMin = colorbrewer.Greens[3][0];
var colorMax = colorbrewer.Greens[3][2];
var c;
var indi;
var max;
var call;
var date;
var years =[];
var leg =[];
var colorScale;

var path = d3.geo.path().projection(projectionMethods[0].method);

//fill in years array
for(i=2013; i>=1960; i--){
	years.push(parseInt(i));
}

//fill in leg array
for(i=0; i<=15; i++){
	leg.push(parseInt(i));
}

//legend for map
var legend = svg.selectAll("rect")
	.data(leg)
	.enter()
	.append("rect")
	.attr("x", 30)
	.attr("y", function(d, i){
		return 300+(i*10);
	})
	.attr("width", 40)
	.attr("height", 10)
	.style("fill", function(d, i){
		return color(16, i)
	});

//Text for min on legend
svg.append('text')
	.attr("x", 80)
	.attr("y", 300)
	.attr("width", 40)
	.attr("height", 10)
	.text("0");

//Titles for right side
//Adds Title
info.append("text")
	.attr("class", "title")
	.text("Indicator:");

//Adds indicator name
info.append('foreignObject')
	.attr('x', 0)
	.attr('y', 5)
	.attr("class", "small info source")
	.attr("id", "iName")
	.attr('width', margin.screen-width-margin.text)
	.attr('height', 60)
	.append("xhtml:div")
	.html();

//Adds Source Title
info.append("text")
	.attr("class", "title")
	.text("Source:")
	.attr({
		"transform":"translate(0, 60)"
	});

//Add source info
info.append('foreignObject')
	.attr('x', 0)
	.attr('y', 70)
	.attr("class", "small info source")
	.attr("id", "source")
	.attr('width', margin.screen-width-margin.text)
	.attr('height', 30)
	.append("xhtml:div")
	.html();

//Add source origin
info.append('foreignObject')
	.attr('x', 0)
	.attr('y', 90)
	.attr("class", "small info source")
	.attr("id", "origin")
	.attr('width', margin.screen-width-margin.text)
	.attr('height', 60)
	.append("xhtml")
	.html();

//Adds Notes Title
info.append("text")
	.attr("class", "title")
	.text("Notes:")
	.attr({
		"transform":"translate(0, 167)"
	});

//Add source Notes
info.append('foreignObject')
	.attr('x', 0)
	.attr('y', 170)
	.attr("class", "small info source")
	.attr("id", "notes")
	.attr('width', margin.screen-width-margin.text)
	.attr('height', 145)
	.append("xhtml")
	.html();

//Adds Country Titles
info.append("text")
	.attr("class", "title")
	.text("Country:")
	.attr({
		"transform":"translate(0, 330)"
	});

//Add country name
info.append('foreignObject')
	.attr('x', 0)
	.attr('y', 340)
	.attr("class", "small info country")
	.attr("id", "cInfo")
	.attr('width', margin.screen-width-margin.text)
	.attr('height', 20)
	.append("xhtml:div")
	.html();

//add country capital
info.append('foreignObject')
	.attr('x', 0)
	.attr('y', 365)
	.attr("class", "small info country")
	.attr("id", "cap")
	.attr('width', margin.screen-width-margin.text)
	.attr('height', 20)
	.append("xhtml:div")
	.html();

//add country region
info.append('foreignObject')
	.attr('x', 0)
	.attr('y', 385)
	.attr("class", "small info country")
	.attr("id", "reg")
	.attr('width', margin.screen-width-margin.text)
	.attr('height', 20)
	.append("xhtml:div")
	.html();

//add country income
info.append('foreignObject')
	.attr('x', 0)
	.attr('y', 405)
	.attr("class", "small info country")
	.attr("id", "inco")
	.attr('width', margin.screen-width-margin.text)
	.attr('height', 20)
	.append("xhtml:div")
	.html();

//add country lending
info.append('foreignObject')
	.attr('x', 0)
	.attr('y', 425)
	.attr("class", "small info country")
	.attr("id", "lend")
	.attr('width', margin.screen-width-margin.text)
	.attr('height', 20)
	.append("xhtml:div")
	.html();

//add country lat
info.append('foreignObject')
	.attr('x', 0)
	.attr('y', 445)
	.attr("class", "small info country")
	.attr("id", "lat")
	.attr('width', margin.screen-width-margin.text)
	.attr('height', 20)
	.append("xhtml:div")
	.html();

//add country long
info.append('foreignObject')
	.attr('x', 0)
	.attr('y', 465)
	.attr("class", "small info country")
	.attr("id", "lon")
	.attr('width', margin.screen-width-margin.text)
	.attr('height', 20)
	.append("xhtml")
	.html();

//function to make calls and get data for map, indicator info
function runAQueryOn(indicatorString) {
	//values for selected items on dropdown
	call = $( "#select" ).val();
	date = $( "#selectY" ).val();
	
	//resets max value on legend
	d3.selectAll("#leg").remove();

//ajax call for data of selected indicators/years
	$.ajax({
		url: "http://api.worldbank.org/countries/all/indicators/"+call+"?format=jsonP&prefix=Getdata&date="+date+"&per_page=500", //do something here
		jsonpCallback:'getdata',
		dataType:'jsonp',
		success: function (data, status){
			max =0;
			//data[1] has the info
			data[1].map(function(d, i){
				//maps to country info
				c.map(function(e, j){
					if(e !== null){
						//if country id's match, set value and id
						if(e.iso == d.country.id){
							e.indicator.value=d.value;
							e.indicator.id=d.indicator.id;
						}
					}
				});
			});
		//gets max value for dataset
		getMax();
		cColor();
		

           
           //console.log(max);
          // console.log(getMax());
           //console.log(color(max, 59));
           //Legend                          
   				
   				svg.append('text')
    			.attr("x", 80)
    			.attr("y", 460)
    			.attr("id", "leg")
   				.attr("width", 40)
   				.attr("height", 10)
   				.text(max);
           
           
           if(status != "success"){
           	console.log("Error with country data");
           }

        }

    });
    
    //call to get indicator information
    $.ajax({
        url: "http://api.worldbank.org/indicators/"+call+"?format=jsonP&prefix=Getdata&per_page=500",
        jsonpCallback:'getdata',
        dataType:'jsonp',
        success: function (data, status){
        	//console.log(data);
        	
			/*//Add Indicator name
        	info.append('foreignObject')
        	.attr('x', 0)
			.attr('y', 5)
        	.attr("class", "small info")
        	.attr('width', margin.screen-width-margin.text)
			.attr('height', 60)
        	.append("xhtml:div")
        	.attr("id", "iName")
        	.html(data[1][0].name);*/
        	
        	d3.select("#iName").html(data[1][0].name);
        	d3.select("#source").html(data[1][0].source.value);
        	d3.select("#origin").html(data[1][0].sourceOrganization);
        	d3.select("#notes").html(data[1][0].sourceNote);
        	

			/*//Add country name
        	info.append('foreignObject')
        	.attr('x', 0)
			.attr('y', 340)
        	.attr("class", "small info")
        	.attr('width', margin.screen-width-margin.text)
			.attr('height', 20)
        	.append("xhtml:div")
        	.attr("id", "cInfo")
        	.html();*/
        	
			
			
        }
    });


}

//runAQueryOn();
//initVis;

function getMax(){
	 //Might be able to move this up into prev function
           c.map(function(l, m){
           	//if(l !== null){
				if(parseInt(l.indicator.value) > max){
					max=parseInt(l.indicator.value);
				}
			//}
           })
        return max;
}


function color(m, number){
	//var m = m;
	 colorScale = d3.scale.linear().clamp([true])
					.domain([ 0, m ])
					.range([colorMin, colorMax]);
	return colorScale(number);
};

function cColor(){
		//sets countries fill
		svg.selectAll(".country")
			.attr("fill", function(d){
				var r;
				var t =0;
				r ="grey";
				c.map(function(l, m){
						if(l.id == d.id){
							var m = getMax();
							var l = l.indicator.value;
							if(l !== null){
								r =color(m, l);
							}
						}
				});
				return r;
			});
}


var initVis = function(error, indicators, world, countries){
   // console.log(indicators);
    //console.log(world);
   // console.log(countries[1].id);
    c = countries;
    indi = indicators;
    console.log(c);
    //Sets up dropdown for indicators
    var dropdown = d3.select("#selector")
		.append("select")
    	.attr("id", "select")
    	.on("change", function(d){
       			call = $( "#select" ).val();
				//console.log(call);
				d3.selectAll(".clicked").classed({'clicked': false});
				runAQueryOn();
       	});
	//adds options to dropdown selector
	var options = dropdown.selectAll("option")
           	.data(indi)
         	.enter()
           	.append("option")
           	.text(function (d) { return d.IndicatorName; })
       		.attr("value", function (d) { return d.IndicatorCode; });
       		
       		
	call = $( "#select" ).val();
	
	
	//Sets up dropdown for year, selectorYear
	var dropYear= d3.select("#selectorYear")
		.append("select")
    	.attr("id", "selectY")
    	.on("change", function(d){
       			date = $("#selectY").val();
				//console.log("Change "+date);
				d3.selectAll(".clicked").classed({'clicked': false});
				d3.selectAll(".country").html("");
				d3.selectAll(".source").html("");
				runAQueryOn();
       	});
       	
	//adds options to dropdown selector for year
	var sYears = dropYear.selectAll("option")
           	.data(years)
         	.enter()
           	.append("option")
           	.text(function (d) { return d; })
       		.attr("value", function (d) { return d; });
    //select values on load that have easy to view data   		
    $('#selectY').val(2010);
    $("#select").val("AG.LND.ARBL.HA.PC");
       		
    date = $( "#selectY" ).val();
    //console.log( $( "#selectY" ).val()); 
    
    runAQueryOn();
    
  svg.selectAll("path")
  .data(world.features)
  .enter().append("path")
  .attr("d", path)
  .attr("class", "country")
  .attr("id", function(d, i){
  	return d.id;
  })
  .attr("fill", "grey")
  .on("click", function(d, i){
  	d3.selectAll(".clicked").classed({'clicked': false});
  //var k = $( this ).css( "fill" );
  d3.selectAll(".country").html("");
  	
  	d3.select(this).classed({'clicked': true});
  	//console.log(d.id);
  	c.map(function (e){
  		if(d.id == e.id){
  			console.log(e.id+" "+d.id);
  			d3.select("#cInfo").html(e.name);
  			d3.select("#cap").html("Capital: "+e.about.capital);
  			d3.select("#reg").html("Region: "+e.about.region);
  			d3.select("#inco").html("Income: "+e.about.income);
  			d3.select("#lend").html("Lending: "+e.about.lending);
  			d3.select("#lat").html("Lat: "+e.about.lat);
  			d3.select("#lon").html("Long: "+e.about.long);
  			
			
  		}
  	})
  });




}


// very cool queue function to make multiple calls.. 
// see 
queue()
    .defer(d3.csv,"../data/worldBank_indicators.csv")
    .defer(d3.json,"../data/world_data.json")
    .defer(d3.json,"../data/WorldBankCountries2.json")
    .await(initVis);


// just for fun 
var textLabel = svg.append("text").text(projectionMethods[actualProjectionMethod].name).attr({
    "transform":"translate(-40,-30)"
})

var changePro = function(){
    actualProjectionMethod = (actualProjectionMethod+1) % (projectionMethods.length);

    textLabel.text(projectionMethods[actualProjectionMethod].name);
    path= d3.geo.path().projection(projectionMethods[actualProjectionMethod].method);
    svg.selectAll(".country").transition().duration(750).attr("d",path);
};

d3.select("body").append("button").text("changePro").on({
    "click":changePro
})






//})




