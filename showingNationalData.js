//Let create a force layout map that shows the national contiguity between countries.

const url = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";

const linkStrenght = 0.1;
const linkDistance = 60;
const gravity = 0.03;

/*  Normally to create a full window app we just have to call window.innerWidth to get the full screen value, but not on codepen*/

var w = getScreenSize().width,
    h = getScreenSize().height;

function getScreenSize() {
        var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;
        return { width: x, height: y };
    }


//let declare the function that creates the force layout map

function createMap(nodes, links){

  var svg = d3.select("body").append('svg')
              .attr({width: w, height: h});



  var link = svg.selectAll('.link')
            .data(links)
            .enter().append('line')
            .attr("class", 'link');

  //Create the nodes

  var node = svg.selectAll('.node')
          .data(nodes)
          .enter().append('circle')
          .attr("class", "node")
          .attr({
      cx: function(d,i){ return (i+1)*(w/4);},
      cy: function(d,i){ return h/2;},
      r: w*0.008
    });

  node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("y", -22)
      .attr("class", "label")
      .text(function(d){ return d.country; })

  //Lets create the force layout

  var force = d3.layout.force()
          .size([w, h])
          .nodes(nodes)
          .links(links)
          .on('tick', tick)
          .gravity(gravity)
          .charge(-30)
          .linkDistance(linkDistance)
          .linkStrength(linkStrenght)
          .start();

  //tick function

  function tick(){
    node.attr({
      cx: function(d){ return d.x},
      cy: function(d){ return d.y}
    }).call(force.drag);

    link.attr({
      x1: function(d){return d.source.x;},
      y1: function(d){return d.source.y;},
      x2: function(d){return d.target.x;},
      y2: function(d){return d.target.y;}
    })
  }
}
// - - - END of createMap function - - - //

//Lets get the data
d3.json(url, function(error, data){
  if (error){return console.log('There is an error getting the data');};

  createMap(data.nodes, data.links);
})
