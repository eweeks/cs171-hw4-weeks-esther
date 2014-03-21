/**
 * Created by hen on 3/8/14.
 */

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var width = 1060 - margin.left - margin.right;
var height = 800 - margin.bottom - margin.top;
var centered;

var bbVis = {
    x: 100,
    y: 10,
    w: width - 100,
    h: 300
};

var detailVis = d3.select("#detailVis").append("svg").attr({
    width:350,
    height:300
})

var canvas = d3.select("#vis").append("svg").attr({
    width: width + margin.left + margin.right,
    height: height + margin.top + margin.bottom
    })

var svg = canvas.append("g").attr({
        transform: "translate(" + margin.left + "," + margin.top + ")"
    });


var projection = d3.geo.albersUsa().translate([width / 2, height / 2]);//.precision(.1);
var path = d3.geo.path().projection(projection);


var dataSet = {};
var completeDataSet;
var max=0;
var keys;

//Show the tooltip
//d3.select("#tooltip").classed("hidden", false);

/*var lon= -71.06;
var lat= 42.36;

var screencoord = projection([lon, lat]);

svg.append("circle")
	.attr("cx", screencoord[0])
	.attr("cy", screencoord[1])
	.attr("r", 5);*/

function loadStations() {
    d3.csv("../data/NSRDB_StationsMeta.csv",function(error,data){
       // console.log(data);
        data.forEach(function(d, i){
        	//console.log(d["ST"]);
        	lo= d["NSRDB_LON(dd)"];
			la= d["NSRDB_LAT (dd)"];
        	
        	var screen = projection([lo, la]);
        	if(d["ST"] !== "PR" && d["ST"] !== "GU" && d["ST"] !== "VI" && d["STATION"] !=="MIDWAY ISLAND NAS") {
        		//console.log(d["ST"]);
        		/*completeDataSet.map(function(e){
        			if(d["USAF"] == e.id){
        				d["test"]="something";
        			}
        		})*/
        		
        		keys.forEach(function(e, j){
        			
        			if(completeDataSet[e].length>=1){
        				//console.log(completeDataSet[e][0].sum);
        				
        				if(d["USAF"] == completeDataSet[e][0].id){
        					//console.log("match");
        					//console.log(completeDataSet[e][0].id);
        					var s = parseInt(completeDataSet[e][0].sum);
        					d.sum = s;
        				}
        			//d.push({"Sum":completeDataSet[e][0].sum });
        			}
       			 });
        		
        		
        		
        		
        		//scale for station sizes
				var sScale = d3.scale.linear()
					.domain([ 0, max])
					.range([1, 4]);
        		
        		svg
					.append("circle")
					.attr("class", "stations")
					.attr("cx", screen[0])
					.attr("cy", screen[1])
					.attr("r", function(e, i){
						//if object has a sum, use that, else use zero
						if("sum" in d){
							var r = d.sum;
						}else{
							var r =0;
						}
						return sScale(r);
					})
					.attr("class", function(e, i){
						//if object has a sum, use that, else use zero
						if("sum" in d){
							return "station hasData";
						}
						return "station";
						
						
					})
					.on("mouseover", function(e) {
						//console.log(e);
						d3.select(this).attr("id", "hover");
					
						/*var xPosition = parseFloat(e.x+10);
						var yPosition = parseFloat(e.y) ;*/
						//Update the tooltip position and value
					d3.select("#tooltip")
						.style("left", (event.pageX-10)+"px")
						.style("top", (event.pageY+10)+"px")
						.select("#station")
						.text(d.STATION);

					d3.select("#value")
						.text(d.sum);
					
					//Show the tooltip
					d3.select("#tooltip").classed("hidden", false);
				})
				.on("mouseout", function(e){
					d3.select(this)
					.attr("id", "");
					
					//Hide the tooltip
					d3.select("#tooltip").classed("hidden", true);
				})
				.on("click", function(e){
					d3.select(".graph").remove();
				
					//var g =detailVis.append("div").attr("class", "graph")
					
					detailVis.append("text")
					.attr("class", "graph")
					.text(d.STATION)
					.attr("x", 35)
					.attr("y", 35)
					.attr("fill", "black")
					.attr("font-size", "11px");
					
					//get max number for range
					var rMax=0;
					var tKeys;
					var station;
					keys.forEach(function(e, j){
        			
        			if(completeDataSet[e].length>=1){
        				//console.log(completeDataSet[e][0].sum);
        				tKeys = Object.keys(completeDataSet[e][0].hourly);
        				
        				if(d["USAF"] == completeDataSet[e][0].id){
        					//console.log(completeDataSet[e][0].hourly);
        					station = completeDataSet[e][0].hourly;
        					//console.log(k);
        					tKeys.forEach(function(j, k){
        						//console.log(completeDataSet[e][0].hourly[j]);
        						
        						if(completeDataSet[e][0].hourly[j] >= rMax){
        							rMax = completeDataSet[e][0].hourly[j];
        						}
        					});
        					/*completeDataSet[e][0].hourly.map(function(e, j){
        						
        					})*/
        				}
        			
        			}
       			 });
					//console.log(rMax);
					
					//yScale
					var yScale = d3.scale.linear().domain([rMax, 0]).range([50, 180]);
					
					//yAxis
					yAxis = d3.svg.axis()
						.scale(yScale)
						.orient("left")
						.ticks(5);
						
					//Draw Y axis
					detailVis.append("g")
						.attr("class", "axis line")
						.attr("transform", "translate(80, 0)")
						.call(yAxis)
						
					//xScale 
					var xScale = d3.scale.ordinal()
						.domain(tKeys.map(function (d) {return d; }))
						.rangeRoundBands([50, 300], .1);
						
					//xAxis
					var xAxis = d3.svg.axis()
						.scale(xScale)
						.orient("bottom");
					
					//Add X axis
					var axis = detailVis.append("g")
						.attr("class", "axis line")
						.attr("transform", "translate(30, 180)") 
						.call(xAxis);
						
					axis.selectAll("text")
						.attr("transform", function(d) {
							return "rotate(-80)translate(-40, -11)";
						});
						
					//Draw Bars
					detailVis.selectAll(".bar")
						.data(station)
						.enter().append("rect")
						/*.attr("x", "10")
						.attr("y", function(d) { 
							if(Number.isNaN(d.pop)){
								return graphH-30;
							}else{
								return yScale(d.pop); 
							}
						})
						.attr("height", function(d) { 
							if(Number.isNaN(d.pop)){
								return 0;
							}else{
								return (graphH-30)- yScaleT(d.pop); 
							}
						})
						.attr("width", (graphW-240) / list.values.length - barPadding)*/
				});
			}
        
        })
        console.log(data);
    });
}


function loadStats() {

    d3.json("../data/reducedMonthStationHour2003_2004.json", function(error, data){
       // console.log(data[690150][0].sum);
        completeDataSet= data;
        keys = Object.keys(data);
        keys.forEach(function(d, i){
        	if(data[d].length>=1){
        	//console.log(data[d][0].sum);
        		if(data[d][0].sum > max){
        			max=data[d][0].sum;
        		}
        	}
        	
        	//data[d][0].map(function(e, j){
        		
        	//});
        });
        //console.log(max);

		//....
		
        loadStations();
    });

}


d3.json("../data/us-named.json", function(error, data) {

    var usMap = topojson.feature(data,data.objects.states).features
    //console.log(usMap);

    svg.selectAll(".country").data(usMap).enter().append("path").attr("class", "country").attr("d", path).on("click", clicked);
    // see also: http://bl.ocks.org/mbostock/4122298

    loadStats();
});



// ALL THESE FUNCTIONS are just a RECOMMENDATION !!!!
var createDetailVis = function(){

}


var updateDetailVis = function(data, name){
  
}

function clicked(d) {
	var centroid = path.centroid(d);
	//If the map wasn't already centered on the area clicked, it centers it
	if (d && centered !== d) {
		var centroid = path.centroid(d);
    	x = centroid[0];
    	y = centroid[1];
    	k = 4; //this controls how much it zooms
    	centered = d;
  	} else {
    	x = width / 2;
    	y = height / 2;
    	k = 1;
    	centered = null;
  	}

  	svg.selectAll("path")
		.classed("active", centered && function(d) { return d === centered; });
	
	svg.transition()
		.duration(750)
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
		.style("stroke-width", 1.5 / k + "px");	
}



// ZOOMING
function zoomToBB() {


}

function resetZoom() {
    
}


