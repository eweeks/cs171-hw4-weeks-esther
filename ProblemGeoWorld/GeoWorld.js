/**
 * Created by hen on 3/8/14.
 */

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var width = 960 - margin.left - margin.right;
var height = 700 - margin.bottom - margin.top;



var bbVis = {
    x: 100,
    y: 10,
    w: width - 100,
    h: 300
};

var dataSet = {};

var svg = d3.select("#vis").append("svg").attr({
    width: width + margin.left + margin.right,
    height: height + margin.top + margin.bottom
}).append("g").attr({
        transform: "translate(" + margin.left + "," + margin.top + ")"
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
// --- this is just for fun.. play arround with it iof you like :)


var actualProjectionMethod = 0;
var colorMin = colorbrewer.Greens[3][0];
var colorMax = colorbrewer.Greens[3][2];
var c;
var indi;
var max;
var call;



var path = d3.geo.path().projection(projectionMethods[0].method);





function runAQueryOn(indicatorString) {

	call = $( "#select" ).val();
    $.ajax({
        url: "http://api.worldbank.org/countries/all/indicators/"+call+"?format=jsonP&prefix=Getdata&date=2010&per_page=500", //do something here
        jsonpCallback:'getdata',
        dataType:'jsonp',
        success: function (data, status){
           //console.log(data[1]);
           console.log(c);
          //var min =0;
          max =0;
           data[1].map(function(d, i){
           		//console.log(d.country.id);
				c.map(function(e, j){
					if(e !== null){
						//console.log(e.iso);
					  	if(e.iso == d.country.id){
							//console.log("Match "+e.iso+" "+d.country.id);
							e.indicator.value=d.value;
							e.indicator.id=d.indicator.id;
							
							
						}
					}
						
				});
           });
           getMax();
           
           svg.selectAll(".country")
            .attr("fill", function(d, i){
  				//console.log(c);
  				var r;
  				var t =0;
  				r ="grey";
  				c.map(function(l, m){
  					//console.log(l);
           			//if(l !== null){
						if(l.id == d.id){
							//console.log(parseInt(l.indicator.value));
							var m = getMax();
							var l = l.indicator.value;
							if(l !== null){
								r =color(m, l);
							}
							//console.log(color(m, l));
							//r =color(m, l);
						}
						//return "red";
					//}
					//if(l == null){
					//	t=t+1;
					//	console.log("null is "+t);
						//r ="grey";
					//}
						//r ="grey";
					
        		});
        		/*if(d.id =="AFG"){
        			return "blue";
        		}*/
        			//console.log(r);
  					return r;
  			});
           
           console.log(max);
          // console.log(getMax());
           //console.log(color(max, 59));
           if(status != "success"){
           	console.log("Error with country data");
           }

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


function color(max, number){
	var colorScale = d3.scale.linear()
					.domain([ 0, max ])
					.range([colorMin, colorMax]);
	return colorScale(number);
};


var initVis = function(error, indicators, world, countries){
    console.log(indicators);
    //console.log(world);
   // console.log(countries[1].id);
    c = countries;
    indi = indicators;
    //console.log(c[1]);
    var dropdown = d3.select("#selector")
		.append("select")
    	.attr("id", "select")
    	.on("change", function(d){
       			call = $( "#select" ).val();
				console.log(call);
				runAQueryOn();
       	});

	var options = dropdown.selectAll("option")
           	.data(indi)
         	.enter()
           	.append("option")
           	.text(function (d) { return d.IndicatorName; })
       		.attr("value", function (d) { return d.IndicatorCode; });
       		
       		
	call = $( "#select" ).val();
	//console.log(call);
    
    
    
    runAQueryOn();
    
  svg.selectAll("path")
  .data(world.features)
  .enter().append("path")
  .attr("d", path)
  .attr("class", "country")
  .attr("id", function(d, i){
  	return d.id;
  })
  .attr("fill", "grey");




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




